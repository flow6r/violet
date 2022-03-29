var lentEqptRecs = null;
var lentRecsLimit = 16;
var lentTotPages = null;
var lentCurrPage = null;
var lendIDs = new Array();
var lendIDsIndx = 0;

//查询设备借用记录
$("#content").on("click", "#queryLendEqptsBtn", function () {
    let searchItem = $("#content").find("#queryLendsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#queryLendsDiv").find("#searchType").val();

    if (searchItem != "") {
        $("#content").find("#lendEqptsRecsHead").siblings().remove();
        queryLentEqptRecs(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
    } else alert("请输入关键词");

});

//实现查询设备借用记录的函数
function queryLentEqptRecs(userID, userRole, colgName, searchItem, searchType) {
    $.ajax({
        url: "../../library/common/query_lends.php",
        type: "GET",
        async: false,
        data: { userID: userID, userRole: userRole, colgName: colgName, searchItem: searchItem, searchType: searchType },
        dataType: "json",
        success: function (lentRecsJSON) {
            lentEqptRecs = lentRecsJSON;

            if (lentEqptRecs.length === 0) {
                alert("共0条设备借用记录");

                lentTotPages = 0;
                lentCurrPage = 0;

                $("#content").find("#lendPrevPage").attr("disabled", "disabled");
                $("#content").find("#lendRecsPagesInfo").val("第0页，共0页");
                $("#content").find("#lendNextPage").attr("disabled", "disabled");
                $("#content").find("#lendTrgtPage").attr("disabled", "disabled");
                $("#content").find("#lendJumpToTrgtPage").attr("disabled", "disabled");
            } else {
                if (lentEqptRecs.length < lentRecsLimit) {
                    lentTotPages = 1;
                    lentCurrPage = 1;

                    $("#content").find("#lendTrgtPage").attr("disabled", "disabled");
                    $("#content").find("#lendJumpToTrgtPage").attr("disabled", "disabled");
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
    lendIDs = new Array();
    lendIDsIndx = 0;
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
            "<tr><td><input type='checkbox' name='lendCheckbox' class='lendCheckbox' value='" + lentEqptRecs[begnPage].LendID + "' /></td>" +
            "<td><a class='lendUserID' name='" + lentEqptRecs[begnPage].UserID + "' href='#'>" + lentEqptRecs[begnPage].UserID + "</a></td>" +
            "<td><a class='lentEqptID' name='" + lentEqptRecs[begnPage].EqptID + "' href='#'>" + lentEqptRecs[begnPage].EqptID + "</a></td>" +
            "<td class='lentTime'>" + lentEqptRecs[begnPage].LendBegn + "</td>" +
            "<td class='lentTime'>" + lentEqptRecs[begnPage].LendEnd + "</td>" +
            "<td>" + lentEqptRecs[begnPage].LendStat + "</td>" +
            "<td class='lentTime'>" + (lentEqptRecs[begnPage].LendRtn === null ? "暂无" : lentEqptRecs[begnPage].LendRtn) + "</td>" +
            "<td><input type='button' id='rtn" + lentEqptRecs[begnPage].LendID + "' name='" + lentEqptRecs[begnPage].EqptID + "' class='rtnEqptBtn' value='归还' />" +
            "<input type='button' id='brk" + lentEqptRecs[begnPage].LendID + "' name='" + lentEqptRecs[begnPage].EqptID + "' class='brkEqptBtn' value='报修' />" +
            "<input type='button' id='del" + lentEqptRecs[begnPage].LendID + "' name='" + lentEqptRecs[begnPage].EqptID + "' class='delRecBtn' value='删除' /></td></tr>"
        );

        if (lentEqptRecs[begnPage].LendStat === "未归还") {
            $("#content").find("input[name='" + lentEqptRecs[begnPage].EqptID + "'][value='删除']").attr("disabled", "disabled");
        } else {
            $("#content").find("input[name='" + lentEqptRecs[begnPage].EqptID + "'][value='归还']").attr("disabled", "disabled");
            $("#content").find("input[name='" + lentEqptRecs[begnPage].EqptID + "'][value='报修']").attr("disabled", "disabled");
        }
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
                "<tr><td><label>用户ID</label></td><td><input type='text' id='userID' name='userID' value='" + userJSON[0].UserID + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>用户姓名</label></td><td><input type='text' id='userName' name='userName' value='" + userJSON[0].UserName + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>用户性别</label></td><td><input type='text' id='userGen' name='userGen' value='" + userJSON[0].UserGen + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>用户角色</label></td><td><input type='text' id='userRole' name='userRole' value='" + userJSON[0].UserRole + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>电子邮箱</label></td><td><input type='text' id='userEmail' name='userEmail' value='" + userJSON[0].UserEmail + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>入学年份</label></td><td><input type='text' id='userAdms' name='userAdms' value='" + (userJSON[0].UserAdms === null ? "暂无" : userJSON[0].UserAdms) + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>隶属学院</label></td><td><input type='text' id='colgName' name='colgName' value='" + userJSON[0].ColgName + "' disabled='disabled' /></td></tr>" +
                "<tr><td><label>专业名称</label></td><td><input type='text' id='mjrName' name='mjrName' value='" + userJSON[0].MjrName + "' disabled='disabled' /></td></tr>" +
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
                "</tr><tr><td><label>设备ID</label></td><td><input type='text' id='eqptID' name='eqptID' value='" + eqptJson[0].EqptID + "' placeholder='" + eqptJson[0].EqptID + "' disabled='disabled' />" +
                "</td></tr><tr><td><label>设备名称</label></td>" +
                "<td><input type='text' id='eqptName' name='eqptName' value='" + eqptJson[0].EqptName + "' placeholder='" + eqptJson[0].EqptName + "' disabled='disabled' />" +
                "</td></tr><tr><td><label>设备分类</label></td>" +
                "<td><input type='text' id='eqptCls' name='eqptCls' value='" + eqptJson[0].ClsName + "' placeholder='" + eqptJson[0].ClsName + "' disabled='disabled' /></td>" +
                "</tr><tr><td><label>隶属学院</label></td>" +
                "<td><input type='text' id='colgName' name='colgName' value='" + eqptJson[0].ColgName + "' placeholder='" + eqptJson[0].ColgName + "' disabled='disabled' /></td>" +
                "</tr><tr><td><label>入库时间</label></td>" +
                "<td><input type='text' id='eqptCre' name='eqptCre' value='" + eqptJson[0].EqptCre + "' placeholder='" + eqptJson[0].EqptCre + "' disabled='disabled' /></td>" +
                "</tr><tr><td><label>设备描述</label></td><td><textarea id='eqptDesc' placeholder='" + eqptJson[0].EqptDesc + "' disabled='disabled'>" + eqptJson[0].EqptDesc + "</textarea></td></tr><tr>" +
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

    queryLentEqptRecs(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
});

//获取选择的多个借用记录ID
$("#content").on("click", ".lendCheckbox", function (event) {
    let currLendID = $(event.target).val();

    if ($(event.target).attr("checked")) {
        $(event.target).removeAttr("checked");
        let currLendIndx = lendIDs.indexOf(currLendID);
        lendIDs.splice(currLendIndx, 1);
        lendIDsIndx--;
    } else {
        $(event.target).attr("checked", "ture");
        lendIDs[lendIDsIndx++] = currLendID;
    }
});

//归还单个设备
$("#content").on("click", ".rtnEqptBtn", function (event) {
    let currLendID = ($(event.target).attr("id")).substring(3);
    let currLentEqptID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/return_eqpt.php",
        type: "POST",
        async: false,
        data: { userRole: userInfo.userRole, lendID: currLendID, eqptID: currLentEqptID },
        success: function (status) {
            if (status === "successful") alert("成功归还设备ID为" + currLentEqptID + "的设备");
            else alert(status);

            let searchItem = $("#content").find("#queryLendsDiv").find("#searchItem").val();
            let searchType = $("#content").find("#queryLendsDiv").find("#searchType").val();

            $("#content").find("#lendEqptsRecsHead").siblings().remove();
            if (searchItem === "") {
                searchItem = "";
                searchType = "lendStat";
            }

            queryLentEqptRecs(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
        }
    });
});

//批量归还借用的设备
$("#content").on("click", "#rtnEqptsBtn", function () {
    if (lendIDs.length === 0) alert("您选择了0条借用记录，请选择至少一条记录后再执行批量归还操作");
    else {
        $.ajax({
            url: "../../library/common/return_eqpts.php",
            type: "POST",
            async: false,
            data: { userRole: userInfo.userRole, lendIDs: lendIDs },
            success: function (status) {
                if (status === "successful") alert("成功归还" + lendIDs.length + "个设备")
                else alert(status);
            }
        });
    }

    let searchItem = $("#content").find("#queryLendsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#queryLendsDiv").find("#searchType").val();

    $("#content").find("#lendEqptsRecsHead").siblings().remove();
    if (searchItem === "") {
        searchItem = "";
        searchType = "lendStat";
    }

    queryLentEqptRecs(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
});

//报修单个设备弹窗
$("#content").on("click", ".brkEqptBtn", function (event) {
    let currLendID = ($(event.target).attr("id")).substring(3);
    let currLentEqptID = $(event.target).attr("name");

    $("#mask").attr("style", "visibility: visible;");

    $("body").append(
        "<div id='creBrkRecDiv' name='creBrkRecDiv' class='popup'><form id='creBrkRecForm' name='creBrkRecForm'>" +
        "<table id='creBrkRecTbl' name='creBrkRecTbl'><tr><th colspan='2'><span>报修设备</span></th></tr>" +
        "<tr><td><label>设备ID</label></td><td><input type='text' id='brkLentEqptID' name='brkLentEqptID' value='" + currLentEqptID + "' placeholder='" + currLentEqptID + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>报修原因</label></td><td><textarea id='brkDesc' name='brkDesc'></textarea></td></tr>" +
        "<tr><td><input type='button' id='creBrkRecCancelBtn' name='creBrkRecCancelBtn' class='lendCancelBtn' value='取消' /></td>" +
        "<td><input type='button' id='creBrkRecBtn' name='" + currLendID + "' value='报修' /></td></tr></table></form></div>"
    );
});

//实现报修单个设备的函数
$("body").on("click", "#creBrkRecBtn", function () {
    let currLendID = $("body").find("#creBrkRecBtn").attr("name");
    let currLentEqptID = $("body").find("#brkLentEqptID").val();
    let brkDesc = $("body").find("#brkDesc").val();

    if (brkDesc === "") alert("报修原因不能为空");
    else {
        $.ajax({
            url: "../../library/common/create_brkrec.php",
            type: "POST",
            async: false,
            data: { userID: userInfo.userID, userRole: userInfo.userRole, lendID: currLendID, eqptID: currLentEqptID, brkDesc: brkDesc },
            success: function (status) {
                $("#mask").attr("style", "visibility: hidden;");
                $(".popup").remove();

                if (status === "successful") alert("成功报修");
                else alert(status);
            }
        });
    }

    let searchItem = $("#content").find("#queryLendsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#queryLendsDiv").find("#searchType").val();

    $("#content").find("#lendEqptsRecsHead").siblings().remove();
    if (searchItem === "") {
        searchItem = "";
        searchType = "lendStat";
    }

    queryLentEqptRecs(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
});

//批量报修设备弹窗
$("#content").on("click", "#creBrkRecsBtn", function () {
    if (lendIDs.length === 0) alert("您选择了0条借用记录，请选择至少一条记录后再执行批量报修操作");
    else {
        $("#mask").attr("style", "visibility: visible;");

        $("body").append(
            "<div id='creBrkRecsDiv' name='creBrkRecsDiv' class='popup'><form id='creBrkRecsForm' name='creBrkRecsForm'>" +
            "<table id='creBrkRecsTbl' name='creBrkRecsTbl'><tr><th colspan='2'><span>报修设备</span></th></tr>" +
            "<tr><td><label>设备ID</label></td><td><select id='brkLentEqptIDs' name='brkLentEqptIDs'></select></td></tr>" +
            "<tr><td><label>报修描述</label></td><td><textarea id='brkDesc' name='brkDesc'></textarea></td></tr>" +
            "<tr><td><input type='button' id='creBrkRecsCancelBtn' name='creBrkRecsCancelBtn' class='lendCancelBtn' value='取消' /></td>" +
            "<td><input type='button' id='bulkCreBrkRecsBtn' name='bulkCreBrkRecsBtn' value='报修' /></td></tr></table></form></div>"
        );

        for (let indx = 0; indx < lendIDs.length; indx++) {
            let currLentEqptIDIndx = lentEqptRecs.findIndex(lentEqptRecs => lentEqptRecs.LendID == lendIDs[indx]);

            $("body").find("#brkLentEqptIDs").append("<option value='" + lentEqptRecs[currLentEqptIDIndx].EqptID + "'>" + lentEqptRecs[currLentEqptIDIndx].EqptID + "</option>");
        }
    }
});

//实现批量报修
$("body").on("click", "#bulkCreBrkRecsBtn", function () {
    let brkDesc = $("body").find("#brkDesc").val();

    if (brkDesc === "") alert("报修原因不能为空");
    else {
        $.ajax({
            url: "../../library/common/create_brkrecs.php",
            type: "POST",
            async: false,
            data: { userID: userInfo.userID, userRole: userInfo.userRole, lendIDs: lendIDs, brkDesc: brkDesc },
            success: function (status) {
                $("#mask").attr("style", "visibility: hidden;");
                $(".popup").remove();

                if (status === "successful") alert("成功报修" + lendIDs.length + "个设备");
                else alert(status);
            }
        });
    }

    let searchItem = $("#content").find("#queryLendsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#queryLendsDiv").find("#searchType").val();

    $("#content").find("#lendEqptsRecsHead").siblings().remove();
    if (searchItem === "") {
        searchItem = "";
        searchType = "lendStat";
    }

    queryLentEqptRecs(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
});

//删除单个设备借用记录
$("#content").on("click", ".delRecBtn", function (event) {
    let currLendID = ($(event.target).attr("id")).substring(3);

    $.ajax({
        url: "../../library/common/delete_lend.php",
        type: "POST",
        async: false,
        data: { userRole: userInfo.userRole, lendID: currLendID },
        success: function (status) {
            if (status === "successful") alert("成功删除借用ID为" + currLendID + "的设备借用记录");
            else alert(status);

            let searchItem = $("#content").find("#queryLendsDiv").find("#searchItem").val();
            let searchType = $("#content").find("#queryLendsDiv").find("#searchType").val();

            $("#content").find("#lendEqptsRecsHead").siblings().remove();
            if (searchItem === "") {
                searchItem = "";
                searchType = "lendStat";
            }

            queryLentEqptRecs(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
        }
    });
});

//批量删除设备借用记录
$("#content").on("click", "#delLendRecsBtn", function () {
    if (lendIDs.length === 0) alert("您选择了0条借用记录，请选择至少一条记录后再执行批量删除操作");
    else {
        $.ajax({
            url: "../../library/common/delete_lends.php",
            type: "POST",
            async: false,
            data: { userRole: userInfo.userRole, lendIDs: lendIDs },
            success: function (status) {
                if (status === "successful") alert("成功删除" + lendIDs.length + "条设备借用记录");
                else alert(status);
            }
        });
    }

    let searchItem = $("#content").find("#queryLendsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#queryLendsDiv").find("#searchType").val();

    $("#content").find("#lendEqptsRecsHead").siblings().remove();
    if (searchItem === "") {
        searchItem = "";
        searchType = "lendStat";
    }

    queryLentEqptRecs(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
});