var lentEqptRecs = null;
var lentRecsLimit = 16;
var lentTotPages = null;
var lentCurrPage = null;
var lentEqptIDs = new Array();
var lentEqptIDsIndx = 0;

//查询设备借用记录
$("#content").on("click", "#queryLendEqptsBtn", function () {
    let searchItem = $("#content").find("#queryLendsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#queryLendsDiv").find("#searchType").val();

    if (searchItem != "") {
        $("#content").find("#lendEqptsRecsHead").siblings().remove();
        queryLentEqptRecs(userInfo.userID, userInfo.userRole, userInfo.mjrName, searchItem, searchType);
    } else alert("请输入关键词");

});

//实现查询设备借用记录的函数
function queryLentEqptRecs(userID, userRole, mjrName, searchItem, searchType) {
    $.ajax({
        url: "../../library/common/query_lends.php",
        type: "GET",
        async: false,
        data: { userID: userID, userRole: userRole, mjrName: mjrName, searchItem: searchItem, searchType: searchType },
        dataType: "json",
        success: function (lentRecsJSON) {
            lentEqptRecs = lentRecsJSON;

            if (lentEqptRecs.length === 0) {
                $("#content").find("#lendPrevPage").attr("disabled", "disabled");
                $("#content").find("#lendRecsPagesInfo").val("第0页，共0页");
                $("#content").find("#lendNextPage").attr("disabled", "disabled");
                $("#content").find("#lendTrgtPage").attr("disabled", "disabled");
                $("#content").find("#lendJumpToTrgtPage").attr("disabled", "disabled");
            } else {
                if (lentEqptRecs.length < lentRecsLimit) {
                    lentTotPages = 1;
                    lentCurrPage = 1;
                } else {
                    lentTotPages = parseInt(lentEqptRecs.length / lentRecsLimit);
                    if (lentEqptRecs.length % lentRecsLimit) lentTotPages++;
                    lentCurrPage = 1;
                }

                echoLentEqptRecs(lentCurrPage);
            }
        }
    });
}

//显示指定页的设备借用记录
function echoLentEqptRecs(page) {
    lentEqptIDs = new Array();
    lentEqptIDsIndx = 0;
    lentCurrPage = page;

    if (lentCurrPage === 1) $("#content").find("#lendPrevPage").attr("disabled", "disabled");
    else $("#content").find("#lendPrevPage").removeAttr("disabled");

    if (lentCurrPage === lentTotPages) $("#content").find("#lendNextPage").attr("disabled", "disabled");
    else $("#content").find("#lendNextPage").removeAttr("disabled");

    $("#content").find("#lendEqptsRecsHead").siblings().remove();

    let begnPage = (lentCurrPage - 1) * lentRecsLimit;
    let endPage = (lentCurrPage * lentRecsLimit) - 1;

    for (; begnPage <= endPage && begnPage < lentEqptRecs.length; begnPage++) {
        $("#content").find("#lendEqptsRecs").append(
            "<tr><td><input type='checkbox' name='lendCheckbox' class='lendCheckbox' value='" + lentEqptRecs[begnPage].EqptID + "' /></td>" +
            "<td><a class='lendUserID' name='" + lentEqptRecs[begnPage].UserID + "' href='#'>" + lentEqptRecs[begnPage].UserID + "</a></td>" +
            "<td><a class='lentEqptID' name='" + lentEqptRecs[begnPage].EqptID + "' href='#'>" + lentEqptRecs[begnPage].EqptID + "</a></td>" +
            "<td class='lentTime'>" + lentEqptRecs[begnPage].LendBegn + "</td>" +
            "<td class='lentTime'>" + lentEqptRecs[begnPage].LendEnd + "</td>" +
            "<td>" + lentEqptRecs[begnPage].LendStat + "</td>" +
            "<td class='lentTime'>" + (lentEqptRecs[begnPage].LendRtn === null ? "暂无" : lentEqptRecs[begnPage].LendRtn) + "</td>" +
            "<td><input type='button' id='rtn" + lentEqptRecs[begnPage].EqptID + "' name='" + lentEqptRecs[begnPage].EqptID + "' class='rtnEqptBtn' value='归还' />" +
            "<input type='button' id='brk" + lentEqptRecs[begnPage].EqptID + "' name='" + lentEqptRecs[begnPage].EqptID + "' class='brkEqptBtn' value='报修' />" +
            "<input type='button' id='del" + lentEqptRecs[begnPage].EqptID + "' name='" + lentEqptRecs[begnPage].EqptID + "' class='delRecBtn' value='删除' /></td></tr>"
        );
    }

    $("#content").find("#lendRecsPagesInfo").val("第" + lentCurrPage + "页，共" + lentTotPages + "页");
}

//上一页
$("#content").on("click", "#lendPrevPage", function () {
    let trgtPage = lentCurrPage - 1;
    echoLentEqptRecs(trgtPage);
});

//下一页
$("#content").on("click", "#lendNextPage", function () {
    let trgtPage = lentCurrPage + 1;
    echoLentEqptRecs(trgtPage);
});

//跳转
$("#content").on("click", "#lendJumpToTrgtPage", function () {
    let trgtPage = $("#content").find("#lendTrgtPage").val();
    trgtPage = parseInt(trgtPage);

    $("#content").find("#lendTrgtPage").val("");

    if (trgtPage < 1 || trgtPage > lentTotPages) alert("请输入合法的页数");
    else echoLentEqptRecs(trgtPage);
});

//用户信息
$("#content").on("click", ".lendUserID", function (event) {
    let currLendUserID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/query_user.php",
        type: "GET",
        async: false,
        data: { userRole: userInfo.userRole, userID: currLendUserID },
        dataType: "json",
        error: function () {
            alert("查询用户信息失败，请联系管理员并反馈问题");
        },
        success: function (userJSON) {
            $("#mask").attr("style", "visibility: visible;");

            $("body").append(
                "<div id='lendUserInfoDiv' name='lendUserInfoDiv' class='popup'><form id='lendUserInfoForm' name='lendUserInfoForm'>" +
                "<table id='lendUserInfoTbl' name='lendUserInfoTbl'><tr><th colspan='2'><span>用户信息</span></th></tr>" +
                "<tr><td><label>用户ID</label></td><td><input type='text' id='userID' name='userID' placeholder='" + userJSON[0].UserID + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>用户姓名</label></td><td><input type='text' id='userName' name='userName' placeholder='" + userJSON[0].UserName + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>用户性别</label></td><td><input type='text' id='userGen' name='userGen' placeholder='" + userJSON[0].UserGen + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>用户角色</label></td><td><input type='text' id='userRole' name='userRole' placeholder='" + userJSON[0].UserRole + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>电子邮箱</label></td><td><input type='text' id='userEmail' name='userEmail' placeholder='" + userJSON[0].UserEmail + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>入学年份</label></td><td><input type='text' id='userAdms' name='userAdms' placeholder='" + (userJSON[0].UserAdms === null ? "暂无" : userJSON[0].UserAdms) + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>隶属学院</label></td><td><input type='text' id='colgName' name='colgName' placeholder='" + userJSON[0].ColgName + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>专业名称</label></td><td><input type='text' id='mjrName' name='mjrName' placeholder='" + userJSON[0].MjrName + "' disabled='disabled' /></td></tr>" +
                "<tr><td colspan='2'><input type='button' id='lendUserInfoCancel' name='lendUserInfoCancel' class='lendCancelBtn' value='取消' /></td></tr>" +
                "</table></form></div>"
            );
        }
    });
});

//设备信息
$("#content").on("click", ".lentEqptID", function (event) {
    let currLentEqptID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/query_eqpt.php",
        type: "GET",
        async: false,
        data: { userRole: userInfo.userRole, eqptID: currLentEqptID },
        dataType: "json",
        error: function () {
            alert("查询设备信息失败，请联系管理员并反馈问题");
        },
        success: function (eqptJson) {
            $("#mask").attr("style", "visibility: visible;");

            $("body").append(
                "<div id='lentEqptInfoDiv' name='lentEqptInfoDiv' class='popup'><form id='lentEqptInfoForm' name='lentEqptInfoForm'>" +
                "<table id='lentEqptInfoTbl' name='lentEqptInfoTbl'><tr><th colspan='2'><span>实验设备详情</span></th>" +
                "</tr><tr><td colspan='2'><img src='" + eqptJson[0].ImgPath + "' width='200' height='200' alt='eqptImg' title='' /></td>" +
                "</tr><tr><td><label>设备ID</label></td><td><input type='text' id='eqptID' name='eqptID' placeholder='" + eqptJson[0].EqptID + "' disabled='disabled' />" +
                "</td></tr><tr><td><label>设备名称</label></td>" +
                "<td><input type='text' id='eqptName' name='eqptName' placeholder='" + eqptJson[0].EqptName + "' disabled='disabled' />" +
                "</td></tr><tr><td><label>设备分类</label></td>" +
                "<td><input type='text' id='eqptCls' name='eqptCls' placeholder='" + eqptJson[0].ClsName + "' disabled='disabled' /></td>" +
                "</tr><tr><td><label>隶属学院</label></td>" +
                "<td><input type='text' id='colgName' name='colgName' placeholder='" + eqptJson[0].ColgName + "' disabled='disabled' /></td>" +
                "</tr><tr><td><label>入库时间</label></td>" +
                "<td><input type='text' id='eqptCre' name='eqptCre' placeholder='" + eqptJson[0].EqptCre + "' disabled='disabled' /></td>" +
                "</tr><tr><td><label>设备描述</label></td><td><textarea id='eqptDesc' placeholder='" + eqptJson[0].EqptDesc + "'></textarea></td></tr><tr>" +
                "<td colspan='2'><input type='button' id='lendEqptInfoCancel' name='lendEqptInfoCancel' class='lendCancelBtn' value='取消'></td>" +
                "</tr></table></form></div>"
            );
        }
    });
});

//关闭弹框
$("body").on("click", ".lendCancelBtn", function () {
    $("#mask").attr("style", "visibility: hidden;");

    $(".popup").remove();

    let searchItem = $("#content").find("#queryLendsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#queryLendsDiv").find("#searchType").val();

    $("#content").find("#lendEqptsRecsHead").siblings().remove();
    if (searchItem === "") {
        searchItem = "";
        searchType = "lendStat";
    }
    queryLentEqptRecs(userInfo.userID, userInfo.userRole, userInfo.mjrName, searchItem, searchType);
});

//归还单个设备
$("#content").on("click", ".rtnEqptBtn", function (event) {
    let currLentEqptID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/return_eqpt.php",
        type: "POST",
        async: false,
        data: { userID: userInfo.userID, userRole: userInfo.userRole, eqptID: currLentEqptID },
        success: function (status) {
            if (status === "successful") {
                alert("成功归还设备ID为" + currLentEqptID + "的设备");

                let searchItem = $("#content").find("#queryLendsDiv").find("#searchItem").val();
                let searchType = $("#content").find("#queryLendsDiv").find("#searchType").val();

                $("#content").find("#lendEqptsRecsHead").siblings().remove();
                if (searchItem === "") {
                    searchItem = "";
                    searchType = "lendStat";
                }
                queryLentEqptRecs(userInfo.userID, userInfo.userRole, userInfo.mjrName, searchItem, searchType);

            } else alert(status);
        }
    });
});