var appls = null;
var applIndx = null;
var applsRecLimit = 16;
var applsTotPages = null;
var applsCurrPage = null;
var applDetls = null;
var applIDs = new Array();
var applIDsIndx = 0;

//查询借用申请记录
$("#content").on("click", "#queryApplsBtn", function () {

    let searchItem = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchType").val();

    if (searchItem != "") {
        $("#content").find("#applRsltsTblHead").siblings().remove();
        queryAppls(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
    } else alert("请输入关键词");
});

//实现查询借用申请记录的函数
function queryAppls(userID, userRole, colgName, searchItem, searchType) {
    $.ajax({
        url: "../../library/common/query_appls.php",
        type: "GET",
        async: false,
        data:
        {
            userID: userID, userRole: userRole, colgName: colgName,
            searchItem: searchItem, searchType: searchType
        },
        dataType: "json",
        success: function (applsJSON) {
            appls = applsJSON;

            if (appls.length === 0) {
                alert("共0条设备借用申请记录");

                applsTotPages = 0;
                applsCurrPage = 0;

                $("#content").find("#applsPrevPage").attr("disabled", "disabled");
                $("#content").find("#applsPageInfo").val("第0页，共0页");
                $("#content").find("#applsNextPage").attr("disabled", "disabled");
                $("#content").find("#applsTrgtPage").attr("disabled", "disabled");
                $("#content").find("#applsJump").attr("disabled", "disabled");
            } else {
                if (appls.length < applsRecLimit) {
                    applsTotPages = 1;
                    applsCurrPage = 1;

                    $("#content").find("#applsTrgtPage").attr("disabled", "disabled");
                    $("#content").find("#applsJump").attr("disabled", "disabled");
                } else {
                    applsTotPages = parseInt(appls.length / applsRecLimit);
                    if (appls.length % applsRecLimit) applsTotPages++;
                    applsCurrPage = 1;
                }

                echoApplsRecords(applsCurrPage);
            }
        }
    });
}

//显示指定页的设备借用申请记录
function echoApplsRecords(page) {
    applIDs = new Array();
    applIDsIndx = 0;
    applsCurrPage = page;

    if (applsCurrPage === 1) $("#content").find("#applsPrevPage").attr("disabled", "disabled");
    else $("#content").find("#applsPrevPage").removeAttr("disabled");

    if (applsCurrPage === applsTotPages) $("#content").find("#applsNextPage").attr("disabled", "disabled");
    else $("#content").find("#applsNextPage").removeAttr("disabled");

    $("#content").find("#applRsltsTblHead").siblings().remove();

    let begnPage = (applsCurrPage - 1) * applsRecLimit;
    let endPage = (applsCurrPage * applsRecLimit) - 1;

    for (; begnPage <= endPage && begnPage < appls.length; begnPage++) {
        if (appls[begnPage].ApplStat === "已驳回") {
            $("#content").find("#applRsltsTbl").append(
                "<tr><td><input type='checkbox' name='applCheckbox' class='applCheckbox' value='" + appls[begnPage].ApplID + "' /></td>" +
                "<td>" + appls[begnPage].ApplID + "</td>" +
                "<td>" + appls[begnPage].UserID + "</td>" +
                "<td><a class='queryApplDetl' name='" + appls[begnPage].ApplID + "' href='#'>详情</a></td>" +
                "<td><a class='beenRjcted' name='" + appls[begnPage].ApplID + "' href='#' style='color: red;'>" + appls[begnPage].ApplStat + "</a></td>" +
                "<td><input type='button' id='" + appls[begnPage].ApplID + "' name='procApplBtn' class='procApplBtn' value='处理' />" +
                "<input type='button' name='" + appls[begnPage].ApplID + "' class='rjctApplBtn' value='驳回' />" +
                "<input type='button' name='" + appls[begnPage].ApplID + "' class='delApplBtn' value='删除'/></td></tr>"
            );
        } else {
            $("#content").find("#applRsltsTbl").append(
                "<tr><td><input type='checkbox' name='applCheckbox' class='applCheckbox' value='" + appls[begnPage].ApplID + "' /></td>" +
                "<td>" + appls[begnPage].ApplID + "</td>" +
                "<td>" + appls[begnPage].UserID + "</td>" +
                "<td><a class='queryApplDetl' name='" + appls[begnPage].ApplID + "' href='#'>详情</a></td>" +
                "<td>" + appls[begnPage].ApplStat + "</td>" +
                "<td><input type='button' id='" + appls[begnPage].ApplID + "' name='procApplBtn' class='procApplBtn' value='处理' />" +
                "<input type='button' name='" + appls[begnPage].ApplID + "' class='rjctApplBtn' value='驳回' />" +
                "<input type='button' name='" + appls[begnPage].ApplID + "' class='delApplBtn' value='删除'/></td></tr>"
            );
        }
        if (appls[begnPage].ApplStat != "未通过") {
            $("#content").find("input[type='button'][id='" + appls[begnPage].ApplID + "']").attr("disabled", "disabled");
            $("#content").find("input[type='button'][name='" + appls[begnPage].ApplID + "'][class='rjctApplBtn']").attr("disabled", "disabled");
        }
    }

    if (userInfo.userRole === "学生") {
        $("#content").find(".procApplBtn").attr("style", "display: none");
        $("#content").find(".rjctApplBtn").attr("style", "display: none");
    }

    $("#content").find("#applsPageInfo").val("第" + applsCurrPage + "页，共" + applsTotPages + "页");
}

//上一页
$("#content").on("click", "#applsPrevPage", function () {
    let trgtPage = applsCurrPage - 1;
    echoApplsRecords(trgtPage);
});

//下一页
$("#content").on("click", "#applsNextPage", function () {
    let trgtPage = applsCurrPage + 1;
    echoApplsRecords(trgtPage);
});

//跳转
$("#content").on("click", "#applsJump", function () {
    let trgtPage = $("#content").find("#applsTrgtPage").val();
    trgtPage = parseInt(trgtPage);

    $("#content").find("#applsTrgtPage").val("");

    if (trgtPage < 1 || trgtPage > applsTotPages) alert("请输入合法的页数");
    else echoApplsRecords(trgtPage);
});

//获取选中的申请ID
$("#content").on("click", ".applCheckbox", function (event) {
    let currApplID = $(event.target).val();

    if ($(event.target).attr("checked")) {
        $(event.target).removeAttr("checked");
        let currApplIndx = applIDs.indexOf(currApplID);
        applIDs.splice(currApplIndx, 1);
        applIDsIndx--;
    } else {
        $(event.target).attr("checked", "ture");
        applIDs[applIDsIndx++] = currApplID;
    }
});

//查询指定申请ID的借用设备ID
function queryEqptsByApplID(applID) {
    $.ajax({
        url: "../../library/common/query_details.php",
        type: "GET",
        async: false,
        data: { userRole: userInfo.userRole, applID: applID },
        dataType: "json",
        success: function (detailsJSON) {
            applDetls = detailsJSON;
        }
    });
}

//显示详情
$("#content").on("click", "#queryApplsDiv a[class='queryApplDetl']", function (event) {
    applIndx = appls.findIndex(appls => appls.ApplID == $(event.target).attr("name"));

    queryEqptsByApplID($(event.target).attr("name"));

    $("#mask").attr("style", "visibility: visible;");

    $("body").append(
        "<div id='applDetlDiv' name='applDetlDiv' class='popup'><form id='applDetlForm' name='applDetlForm'>" +
        "<table id='applDetlTbl' name='applDetlTbl'><tr><th colspan='2'><span>申请借用记录详情</span></th></tr>" +
        "<tr><td><label>申请设备数量</label></td><td><input type='text' id='applQty' name='applQty' placeholder='" + appls[applIndx].ApplQty + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>设备ID</label></td><td><select id='applEqptID' name='applEqptID'></select></td></tr>" +
        "<tr><td colspan='2'><img src='' width='150' height='150' alt='eqptImg' title='EqptID' /></td></tr>" +
        "<tr><td><label>借用开始时间</label></td><td><input type='datetime-local' step='1' id='lendBegn' name='lendBegn' value='" + (appls[applIndx].LendBegn).replace(" ", "T") + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>借用结束时间</label></td><td><input type='datetime-local' step='1' id='lendEnd' name='lendEnd' value='" + (appls[applIndx].LendEnd).replace(" ", "T") + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>借用用途描述</label></td><td><textarea id='applDesc' name='applDesc' placeholder='" + appls[applIndx].ApplDesc + "' disabled='disabled'>" + appls[applIndx].ApplDesc + "</textarea></td></tr>" +
        "<tr><td><label>创建申请时间</label></td><td><input type='datetime-local' step='1' id='applCre' name='applCre' value='" + (appls[applIndx].ApplCre).replace(" ", "T") + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>处理申请用户</label></td><td><input type='text' id='dspUser' name='dspUser' placeholder='" + (appls[applIndx].DspUser == null ? "暂无" : appls[applIndx].DspUser) + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>处理申请时间</label></td><td><input type='datetime-local' step='1' id='dspDate' name='dspDate' value='" + (appls[applIndx].DspDate == null ? "" : (appls[applIndx].DspDate).replace(" ", "T")) + "' disabled='disabled' /></td></tr>" +
        "<tr><td colspan='2'><input type='button' id='applDetlCancelBtn' name='applDetlCancelBtn' class='applsCancelBtn' value='取消' /></td></tr></table></form></div>"
    );

    $("body").find("#applEqptID").empty();

    for (let indx = 0; indx < applDetls.length; indx++) {
        $("body").find("#applEqptID").append("<option value='" + applDetls[indx].ImgPath + "'>" + applDetls[indx].EqptID + "</option>");
    }

    $("body").find("#applDetlDiv").find("img").attr("src", applDetls[0].ImgPath);
    $("body").find("#applDetlDiv").find("img").attr("title", applDetls[0].EqptID);
});

//切换申请详情中设备ID对应的设备图片
$("body").on("change", "#applEqptID", function (event) {
    $("body").find("#applDetlDiv").find("img").attr("src", $(event.target).val());
    $("body").find("#applDetlDiv").find("img").attr("title", $(event.target).val());
});

//查看驳回原因
$("body").on("click", "#queryApplsDiv a[class='beenRjcted']", function (event) {
    let currApplID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/query_rjctrsn.php",
        type: "GET",
        async: false,
        data: { userRole: userInfo.userRole, applID: currApplID },
        dataType: "text",
        error: function (error) { alert(error); },
        success: function (rjctRsn) {
            if (rjctRsn != "") {
                $("#mask").attr("style", "visibility: visible;");

                $("body").append(
                    "<div id='rjctDetlDiv' name='rjctDetlDiv' class='popup'><form id='rjctDetlForm' name='rjctDetlForm'>" +
                    "<table id='rjctDetlTbl' name='rjctDetlTbl'><tr><th colspan='2'><span>驳回详情</span></th></tr>" +
                    "<tr><td><label>申请ID</label></td><td><input type='text' id='rjctedApplID' name='rjctedApplID' placeholder='" + currApplID + "' value='" + currApplID + "' disabled='disabled' /></td></tr>" +
                    "<tr><td><label>驳回原因</label></td><td><textarea id='rjctedRsn' name='rjctedRsn' placeholder='" + rjctRsn + "' disabled='disabled'>" + rjctRsn + "</textarea></td></tr>" +
                    "<tr><td colspan='2'><input type='button' class='applsCancelBtn' value='取消' /></td></tr></table></form></div>"
                );
            } else alert("查询驳回原因时发生错误，发生异常的申请ID为，请联系管理员并反馈问题");
        }
    });
});

//关闭弹窗
$("body").on("click", ".applsCancelBtn", function () {
    $("#mask").attr("style", "visibility: hidden;");

    $(".popup").remove();

    let searchItem = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchType").val();

    $("#content").find("#applRsltsTblHead").siblings().remove();
    if (searchItem === "") {
        searchItem = "";
        searchType = "applStat";
    }

    queryAppls(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
});

//处理单个设备申请记录
$("#content").on("click", ".procApplBtn", function (event) {
    if (userInfo.userRole != "学生") {
        $.ajax({
            url: "../../library/common/process_appl.php",
            type: "POST",
            async: false,
            data: { userRole: userInfo.userRole, applID: $(event.target).attr("id"), dspUser: userInfo.userName },
            success: function (status) {
                if (status === "successful") alert("申请ID为" + $(event.target).attr("id") + "的借用申请处理成功");
                else alert(status);
            }
        });
    } else alert("禁止学生操作");

    let searchItem = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchType").val();

    $("#content").find("#applRsltsTblHead").siblings().remove();
    if (searchItem === "") {
        searchItem = "";
        searchType = "applStat";
    }

    queryAppls(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
});

//批量处理设备借用申请
$("#content").on("click", "#procApplsBtn", function () {
    if (userInfo.userRole === "学生") alert("禁止学生操作");
    else {
        if (applIDs.length != 0) {
            $.ajax({
                url: "../../library/common/process_appls.php",
                async: false,
                type: "POST",
                data: { userRole: userInfo.userRole, appls: applIDs, dspUser: userInfo.userName },
                success: function (status) {
                    if (status === "successful") alert("成功处理" + applIDs.length + "条记录");
                    else alert(status);
                }
            });
        } else alert("您选择了0条申请记录，请选择至少一条记录后再执行批量处理操作");
    }

    let searchItem = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchType").val();

    $("#content").find("#applRsltsTblHead").siblings().remove();
    if (searchItem === "") {
        searchItem = "";
        searchType = "applStat";
    }

    queryAppls(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
});

//显示驳回单个申请记录的弹窗
$("#content").on("click", ".rjctApplBtn", function (event) {
    if (userInfo.userRole === "学生") alert("禁止学生操作");
    else {
        $("#mask").attr("style", "visibility: visible;");

        $("body").append(
            "<div id='rjctApplDiv' name='rjctApplDiv' class='popup'><form id='rjctApplForm' name='rjctApplForm'>" +
            "<table id='rjctApplTbl' name='rjctApplTbl'><tr><th colspan='2'><span>驳回设备借用申请</span></th></tr>" +
            "<tr><td><label>申请ID</label></td><td><input type='text' id='rjctedApplID' name='rjctedApplID' placeholder='" + $(event.target).attr("name") +
            "' disabled='disabled' /></td></tr>" +
            "<tr><td><label>驳回原因</label></td><td><textarea id='rjctRsn' name='rjctRsn'></textarea></td></tr>" +
            "<tr><td><input type='button' id='cancelRjctBtn' name='cancelRjctBtn' class='applsCancelBtn' value='取消' /></td>" +
            "<td><input type='button' id='rjctApplBtn' name='rjctApplBtn' value='驳回' /></td></tr></table></form></div>"
        );
    }
});

//实现驳回单个设备申请记录
$("body").on("click", "#rjctApplBtn", function () {
    if (userInfo.userRole === "学生") alert("禁止学生操作");
    else {
        let rjctedApplID = $("body").find("#rjctedApplID").attr("placeholder");
        let rjctRsn = $("body").find("#rjctRsn").val();

        if (rjctRsn === "") alert("驳回理由不能为空");
        else {
            $.ajax({
                url: "../../library/common/reject_appl.php",
                type: "POST",
                async: false,
                data: {
                    dspUser: userInfo.userName, userRole: userInfo.userRole,
                    applID: rjctedApplID, rjctRsn: rjctRsn
                },
                success: function (status) {
                    $("#mask").attr("style", "visibility: hidden;");
                    $(".popup").remove();

                    if (status != "successful") alert(status);
                    else alert("申请ID为" + rjctedApplID + "的申请，驳回成功");
                }
            });
        }
    }

    let searchItem = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchType").val();

    $("#content").find("#applRsltsTblHead").siblings().remove();
    if (searchItem === "") {
        searchItem = "";
        searchType = "applStat";
    }

    queryAppls(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
});

//批量驳回设备借用申请记录
$("#content").on("click", "#rjctApplsBtn", function () {
    if (userInfo.userRole === "学生") alert("禁止学生操作");
    else {
        if (applIDs.length != 0) {
            $("#mask").attr("style", "visibility: visible;");

            $("body").append(
                "<div id='rjctApplsDiv' name='rjctApplsDiv' class='popup'><form id='rjctApplsForm' name='rjctApplsForm'>" +
                "<table id='rjctApplsTbl' name='rjctApplsTbl'><tr><th colspan='2'><span>驳回设备借用申请</span></th></tr>" +
                "<tr><td><label>申请ID</label></td><td><select id='rjctedApplsID' ></select></td></tr>" +
                "<tr><td><label>驳回原因</label></td><td><textarea id='rjctRsn' name='rjctRsn'></textarea></td></tr>" +
                "<tr><td><input type='button' id='cancelRjctBtn' name='cancelRjctBtn' class='applsCancelBtn' value='取消' /></td>" +
                "<td><input type='button' id='bulkRjctApplsBtn' name='rjctApplsBtn' value='驳回' /></td></tr></table></form></div>"
            );

            for (let indx = 0; indx < applIDs.length; indx++) {
                $("body").find("#rjctedApplsID").append("<option>" + applIDs[indx] + "</option>");
            }
        } else alert("您选择了0条申请记录，请选择至少一条记录后再执行批量驳回操作");
    }
});

//实现批量驳回设备借用申请记录
$("body").on("click", "#bulkRjctApplsBtn", function () {
    if (userInfo.userRole === "学生") alert("禁止学生操作");
    else {
        let rjctRsn = $("body").find("#rjctRsn").val();
        if (rjctRsn === "") alert("驳回理由不能为空");
        else {
            $.ajax({
                url: "../../library/common/reject_appls.php",
                type: "POST",
                async: false,
                data: {
                    dspUser: userInfo.userName, userRole: userInfo.userRole,
                    appls: applIDs, rjctRsn: rjctRsn
                },
                success: function (status) {
                    $("#mask").attr("style", "visibility: hidden;");
                    $(".popup").remove();

                    if (status != "successful") alert(status);
                    else alert("成功驳回" + applIDs.length + "条设备借用申请");
                }
            });
        }
    }

    let searchItem = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchType").val();

    $("#content").find("#applRsltsTblHead").siblings().remove();
    if (searchItem === "") {
        searchItem = "";
        searchType = "applStat";
    }

    queryAppls(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
});

//删除单个设备申请记录
$("#content").on("click", ".delApplBtn", function (event) {
    $.ajax({
        url: "../../library/common/delete_appl.php",
        type: "POST",
        async: false,
        data: { userRole: userInfo.userRole, applID: $(event.target).attr("name") },
        success: function (status) {
            if (status === "successful") alert("申请ID为" + $(event.target).attr("name") + "的借用申请删除成功");
            else alert(status);

            let searchItem = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchItem").val();
            let searchType = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchType").val();

            $("#content").find("#applRsltsTblHead").siblings().remove();
            if (searchItem === "") {
                searchItem = "";
                searchType = "applStat";
            }

            queryAppls(userInfo.userID, userInfo.userRole, userInfo.colgName, searchItem, searchType);
        }
    });
});

//批量删除设备借用申请
$("#content").on("click", "#delApplsBtn", function () {
    if (applIDs.length != 0) {
        $.ajax({
            url: "../../library/common/delete_appls.php",
            type: "POST",
            async: false,
            data: { userRole: userInfo.userRole, appls: applIDs },
            success: function (status) {
                if (status === "successful") alert("成功删除" + applIDs.length + "条记录");
                else alert(status);
            }
        });
    } else alert("您选择了0条申请记录，请选择至少一条记录后再执行批量删除操作");

    let searchItem = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchType").val();

    $("#content").find("#applRsltsTblHead").siblings().remove();
    if (searchItem === "") {
        searchItem = "";
        searchType = "applStat";
    }

    queryAppls(userInfo.userID, userInfo.userRole, userInfo.mjrName, searchItem, searchType);
});