var brkRecs = null;
var brkRecsLimit = 16;
var brkTotPages = null;
var brkCurrPage = null;
var brkRecsIDs = new Array();
var brkRecsIDsIndx = 0;

//查询报修设备记录
$("#content").on("click", "#queryBrkRecsBtn", function () {
    let searchItem = $("#content").find("#queryBrkRecsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#queryBrkRecsDiv").find("#searchType").val();

    if (searchItem != "") {
        $("#content").find("#brkRecsTblHead").siblings().remove();
        alert(searchItem + "," + searchType);
        queryBrkRecs(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
    } else alert("请输入关键词");
});

//实现查询报修设备记录的函数
function queryBrkRecs(userID, userRole, colgName, searchItem, searchType) {
    $.ajax({
        url: "../../library/common/query_brkrecs.php",
        type: "GET",
        async: false,
        data: { userID: userID, userRole: userRole, colgName: colgName, searchItem: searchItem, searchType: searchType },
        dataType: "json",
        error: function () { alert("查询数据库时发生错误，请联系管理员并反馈问题"); },
        success: function (brkRecsJSON) {
            brkRecs = brkRecsJSON;

            if (brkRecs.length === 0) {
                alert("共0条报修设备记录");

                $("#content").find("#brkPrevPage").attr("disabled", "disabled");
                $("#content").find("#brkRecsPageInfo").val("第0页，共0页");
                $("#content").find("#brkNextPage").attr("disabled", "disabled");
                $("#content").find("#brkRecsTrgtPage").attr("disabled", "disabled");
                $("#content").find("#brkJupmToTrgtPage").attr("disabled", "disabled");
            } else {
                if (brkRecs.length < brkRecsLimit) {
                    brkTotPages = 1;
                    brkCurrPage = 1;

                    $("#content").find("#brkRecsTrgtPage").attr("disabled", "disabled");
                    $("#content").find("#brkJupmToTrgtPage").attr("disabled", "disabled");
                } else {
                    brkTotPages = parseInt(brkRecs.length / brkRecsLimit);
                    if (brkRecs.length % brkRecsLimit) brkTotPages++;
                    brkCurrPage = 1;
                }

                echoBrkRecs(brkCurrPage);
            }
        }
    });
}

//打印指定页数上的报修记录
function echoBrkRecs(page) {
    brkRecsIDs = new Array();
    brkRecsIDsIndx = 0;
    brkCurrPage = page;

    if (brkCurrPage === 1) $("#content").find("#brkPrevPage").attr("disabled", "disabled");
    else $("#content").find("#brkPrevPage").removeAttr("disabled");

    if (brkCurrPage === brkTotPages) $("#content").find("#brkNextPage").attr("disabled", "disabled");
    else $("#content").find("#brkNextPage").removeAttr("disabled");

    $("#content").find("#brkRecsTblHead").siblings().remove();

    let begnPage = (brkCurrPage - 1) * brkRecsLimit;
    let endPage = (brkCurrPage * brkRecsLimit) - 1;

    for (; begnPage <= endPage && begnPage < brkRecs.length; begnPage++) {
        $("#content").find("#brkRecsTbl").append(
            "<tr><td><input type='checkbox' name='brkCheckbox' class='brkCheckbox' value='" + brkRecs[begnPage].BrkID + "' /></td>" +
            "<td>" + brkRecs[begnPage].BrkID + "</td>" +
            "<td><a class='brkUserID' name='" + brkRecs[begnPage].UserID + "' href='#'>" + brkRecs[begnPage].UserID + "</a></td>" +
            "<td><a class='brkEqptID' name='" + brkRecs[begnPage].EqptID + "' href='#'>" + brkRecs[begnPage].EqptID + "</a></td>" +
            "<td>" + brkRecs[begnPage].BrkStat + "</td>" +
            "<td><a class='brkDetl' name='" + brkRecs[begnPage].BrkID + "' href='#'>详情</a></td>" +
            "<td><input type='button' id='proc" + brkRecs[begnPage].BrkID + "' name='" + brkRecs[begnPage].BrkID + "' class='procBrkRecBtn' value='处理' />" +
            "<input type='button' id='del" + brkRecs[begnPage].BrkID + "' name='" + brkRecs[begnPage].BrkID + "' class='delBrkRecBtn' value='删除' /></td><tr>"
        );

        if (brkRecs[begnPage].BrkStat === "未处理") $("#content").find("input[type='button'][name='" + brkRecs[begnPage].BrkID + "'][class='delBrkRecBtn']").attr("disabled", "disabled");
        else $("#content").find("input[type='button'][name='" + brkRecs[begnPage].BrkID + "'][class='procBrkRecBtn']").attr("disabled", "disabled");
    }

    if (userInfo.userRole === "学生") $("#content").find(".procBrkRecBtn").attr("style", "display: none");

    $("#content").find("#brkRecsPageInfo").val("第" + brkCurrPage + "页，共" + brkTotPages + "页");
}

//上一页
$("#content").on("click", "#brkPrevPage", function () {
    let trgtPage = brkCurrPage - 1;
    echoBrkRecs(trgtPage);
});

//下一页
$("#content").on("click", "#brkNextPage", function () {
    let trgtPage = brkCurrPage + 1;
    echoBrkRecs(trgtPage);
});

//跳转
$("#content").on("click", "#brkJupmToTrgtPage", function () {
    let trgtPage = $("#content").find("#brkRecsTrgtPage").val();
    trgtPage = parseInt(trgtPage);

    $("#content").find("#brkRecsTrgtPage").val("");

    if (trgtPage < 1 || trgtPage > brkTotPages) alert("请输入合法的页数");
    else echoBrkRecs(trgtPage);
});

//报修用户信息
$("#content").on("click", ".brkUserID", function (event) {
    let currUserID = $(event.target).attr("name");
    
    $.ajax({
        url: "../../library/common/query_user.php",
        type: "GET",
        async: false,
        data: { userRole: userInfo.userRole, userID: currUserID },
        dataType: "json",
        error: function () {
            alert("查询用户信息失败，请联系管理员并反馈问题");
        },
        success: function (userJSON) {
            $("#mask").attr("style", "visibility: visible;");

            $("body").append(
                "<div id='brkUserInfoDiv' name='brkUserInfoDiv' class='popup'><form id='brkUserInfoForm' name='brkUserInfoForm'>" +
                "<table id='brkUserInfoTbl' name='brkUserInfoTbl'><tr><th colspan='2'><span>用户信息</span></th></tr>" +
                "<tr><td><label>用户ID</label></td><td><input type='text' id='userID' name='userID' value='" + userJSON[0].UserID + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>用户姓名</label></td><td><input type='text' id='userName' name='userName' value='" + userJSON[0].UserName + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>用户性别</label></td><td><input type='text' id='userGen' name='userGen' value='" + userJSON[0].UserGen + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>用户角色</label></td><td><input type='text' id='userRole' name='userRole' value='" + userJSON[0].UserRole + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>电子邮箱</label></td><td><input type='text' id='userEmail' name='userEmail' value='" + userJSON[0].UserEmail + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>入学年份</label></td><td><input type='text' id='userAdms' name='userAdms' value='" + (userJSON[0].UserAdms === null ? "暂无" : userJSON[0].UserAdms) + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>隶属学院</label></td><td><input type='text' id='colgName' name='colgName' value='" + userJSON[0].ColgName + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>专业名称</label></td><td><input type='text' id='mjrName' name='mjrName' value='" + userJSON[0].MjrName + "' disabled='disabled' /></td></tr>" +
                "<tr><td colspan='2'><input type='button' id='brkUserInfoCancel' name='brkUserInfoCancel' class='brkCancelBtn' value='取消' /></td></tr>" +
                "</table></form></div>"
            );
        }
    });
});

//报修设备信息
$("#content").on("click", ".brkEqptID", function (event) {
    let currEqptID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/query_eqpt.php",
        type: "GET",
        async: false,
        data: { userRole: userInfo.userRole, eqptID: currEqptID },
        dataType: "json",
        error: function () {
            alert("查询设备信息失败，请联系管理员并反馈问题");
        },
        success: function (eqptJson) {
            $("#mask").attr("style", "visibility: visible;");
    
            $("body").append(
                "<div id='brkEqptInfoDiv' name='brkEqptInfoDiv' class='popup'><form id='brkEqptInfoForm' name='brkEqptInfoForm'>" +
                "<table id='brkEqptInfoTbl' name='brkEqptInfoTbl'><tr><th colspan='2'><span>实验设备详情</span></th>" +
                "</tr><tr><td colspan='2'><img src='" + eqptJson[0].ImgPath + "' width='200' height='200' alt='eqptImg' title='' /></td>" +
                "</tr><tr><td><label>设备ID</label></td><td><input type='text' id='eqptID' name='eqptID' value='" + eqptJson[0].EqptID + "' placeholder='" + eqptJson[0].EqptID + "' disabled='disabled' />" +
                "</td></tr><tr><td><label>设备名称</label></td>" +
                "<td><input type='text' id='eqptName' name='eqptName' value='" + eqptJson[0].EqptName + "' placeholder='" + eqptJson[0].EqptName + "' disabled='disabled' />" +
                "</td></tr><tr><td><label>设备分类</label></td>" +
                "<td><input type='text' id='eqptCls' name='eqptCls' value='" + eqptJson[0].ClsName + "' placeholder='" + eqptJson[0].ClsName + "' disabled='disabled' /></td>" +
                "</tr><tr><td><label>隶属学院</label></td>" +
                "<td><input type='text' id='colgName' name='colgName' value='" + eqptJson[0].ColgName + "' placeholder='" + eqptJson[0].ColgName + "' disabled='disabled' /></td>" +
                "</tr><tr><td><label>入库时间</label></td>" +
                "<td><input type='text' id='eqptCre' name='eqptCre' value='" + eqptJson[0].EqptCre + "' placeholder='" + eqptJson[0].EqptCre + "' disabled='disabled' /></td>" +
                "</tr><tr><td><label>设备描述</label></td><td><textarea id='eqptDesc' placeholder='" + eqptJson[0].EqptDesc + "'>" + eqptJson[0].EqptDesc + "</textarea></td></tr><tr>" +
                "<td colspan='2'><input type='button' id='brkEqptInfoCancel' name='brkEqptInfoCancel' class='brkCancelBtn' value='取消'></td>" +
                "</tr></table></form></div>"
            );
        }
    });
});

//报修详情
$("#content").on("click", ".brkDetl", function (event) {
    let currBrkID = $(event.target).attr("name");
    alert(currBrkID);
});

//关闭弹框
$("body").on("click", ".brkCancelBtn", function () {
    $("#mask").attr("style", "visibility: hidden;");

    $(".popup").remove();

    let searchItem = $("#content").find("#queryBrkRecsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#queryBrkRecsDiv").find("#searchType").val();

    $("#content").find("#brkRecsTblHead").siblings().remove();

    if (searchItem === "") {
        searchItem = "";
        searchType = "brkID";
    }

    queryBrkRecs(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
});

//处理单个报修设备

//批量处理报修设备

//删除单个报修设备记录

//批量删除报修设备记录