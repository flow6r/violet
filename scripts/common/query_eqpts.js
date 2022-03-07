var recLimit = 16;
var eqptInfo = null;
var totPages = null;
var currPage = null;
var eqptDetl = null;
var eqptIndx = null;

$("#content").on("click", "#queryEqptsBtn", function () {
    $("#content").find("#queryRsltTblHead").siblings().remove();

    let searchItem = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#queryEqptsTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#queryEqptsTbl").find("#searchType").val();

    if (searchItem != "") queryEqpts("学生", searchItem, searchType);
    else alert("请输入关键词");
});

function queryEqpts(userRole, searchItem, searchType) {
    $.ajax({
        url: "../../library/common/query_eqpts.php",
        type: "GET",
        async: false,
        data: { userRole: userRole, searchItem: searchItem, searchType: searchType },
        dataType: "json",
        success: function (eqptJSON) {
            eqptInfo = eqptJSON;

            if (eqptInfo.length === 0) alert("共0条记录");
            else {
                if (eqptInfo.length < recLimit) {
                    totPages = 1;
                    currPage = 1;
                } else {
                    totPages = parseInt(eqptInfo.length / recLimit);
                    if (eqptInfo.length % recLimit) totPages++;
                    currPage = 1;
                }

                echoEqptRecords(currPage);
            }
        }
    });
}

//打印每页设备的记录
function echoEqptRecords(page) {
    currPage = page;

    if (currPage === 1) $("#content").find("#prevPage").attr("disabled", "disabled");
    else $("#content").find("#prevPage").removeAttr("disabled");

    if (currPage === totPages) $("#content").find("#nextPage").attr("disabled", "disabled");
    else $("#content").find("#nextPage").removeAttr("disabled");

    $("#content").find("#queryRsltTblHead").siblings().remove();

    let begnPage = (currPage - 1) * recLimit;
    let endPage = (currPage * recLimit) - 1;

    for (; begnPage <= endPage && begnPage < eqptInfo.length; begnPage++) {
        ($("#content").find("#queryRsltTbl")).append(
            "<tr><td><input type='checkbox' value='" + eqptInfo[begnPage].EqptID + "' name='eqptCheckbox' class='checkbox' /></td>" +
            "<td>" + eqptInfo[begnPage].EqptID + "</td>" +
            "<td>" + eqptInfo[begnPage].EqptName + "</td>" +
            "<td>" + eqptInfo[begnPage].ColgName + "</td>" +
            "<td>" + eqptInfo[begnPage].EqptStat + "</td>" +
            "<td><a id='" + eqptInfo[begnPage].EqptID + "' href='#'>详情</a></td>" +
            "<td><input type='button' id='" + eqptInfo[begnPage].EqptID + "' class='lendBtn' value='借用' /></td>" +
            "</tr>"
        );
        if (eqptInfo[begnPage].EqptStat != "未借出") $("input[id='" + eqptInfo[begnPage].EqptID + "']").attr("disabled", "disabled");
    }
    ($("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#pageCtlTbl").find("#pageInfo")).val("第" + currPage + "页，共" + totPages + "页");
}

//上一页
$("#content").on("click", "#prevPage", function () {
    let trgtPage = currPage - 1;
    echoEqptRecords(trgtPage);
});

//下一页
$("#content").on("click", "#nextPage", function () {
    let trgtPage = currPage + 1;
    echoEqptRecords(trgtPage);
});

//跳转
$("#content").on("click", "#jump", function () {
    let trgtPage = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#pageCtlTbl").find("#trgtPage").val();
    trgtPage = parseInt(trgtPage);

    ($("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#pageCtlTbl").find("#trgtPage")).val("");

    if (trgtPage < 1 || trgtPage > totPages) alert("请输入合法的页数");
    else echoEqptRecords(trgtPage);
});

//显示设备详情的弹窗
$("#content").on("click", "a", function eqptDetail(event) {
    $("#mask").attr("style", "visibility: visible;");
    //获取当前选择记录在JSON数据中的索引值
    eqptDetl = $(event.target).attr("id");
    eqptIndx = eqptInfo.findIndex(eqptInfo => eqptInfo.EqptID == eqptDetl);
    $("body").append(
        "<div id='eqptDetlDiv' class='popup'><form id='eqptDetlForm' name='eqptDetlForm'>" +
        "<table id='eqptDetlTbl'><tr><th><span id='detlTitleTxt'>实验设备详情</span></th>" +
        "<th><input type='button' id='editEqptDetlInfo' name='editEqptDetlInfo' value='更新设备信息' /></th>" +
        "</tr><tr id='eqptImg'><td colspan='2'><img src='images/eqpts/" + eqptInfo[eqptIndx].EqptID + ".jpg' width='200' height='200' alt='eqptDetlInfo' title='" + eqptInfo[eqptIndx].EqptID + "' /></td>" +
        "</tr><tr><td><span>设备ID</span></td><td><input type='text' id='eqptDetlID' name='eqptDetlID' value='" + eqptInfo[eqptIndx].EqptID + "' disabled='disabled' />" +
        "</td></tr><tr><td><span>设备名称</span></td>" +
        "<td><input type='text' id='eqptDetlName' name='eqptDetlName' value='" + eqptInfo[eqptIndx].EqptName + "' disabled='disabled' />" +
        "</td></tr><tr><td><span>隶属学院</span></td><td><select id='eqptDetlColg' name='eqptDetlColg' disabled='disabled'>" +
        "<option value='spst'>" + eqptInfo[eqptIndx].ColgName + "</option></select></td></tr><tr>" +
        "<td><span>入库时间</span></td><td><input type='datetime-local' step='1' id='eqptDetlCre' name='eqptDetlCre' value='" + (eqptInfo[eqptIndx].EqptCre).replace(" ", "T") + "' disabled='disabled' /></td></tr><tr>" +
        "<td><span>设备描述</span></td><td><textarea id='eqptDetlDesc' disabled='disabled'>" + eqptInfo[eqptIndx].EqptDesc + "</textarea></td></tr>" +
        "<tr style='text-align:center'><td><input type='button' id='editDetlCancelBtn' name='editDetlCancelBtn' value='取消' /></td>" +
        "<td><input type='button' id='editDetlUpdateBtn' name='editDetlUpdateBtn' value='更新' style='visibility: hidden;' /></td></tr></table></form></div>"
    );
    //判断下是否为学生，如果是学生，隐藏更新按钮！
    if (userInfo.userRole === "学生") $("body").find("#editEqptDetlInfo").attr("style", "visibility: hidden");
});

//点击更新设备信息按钮
$("body").on("click", "#editEqptDetlInfo", function () {
    $("body").find("#editDetlUpdateBtn").attr("style", "visibility: visible");

    $("body").find("#eqptDetlID").removeAttr("disabled").removeAttr("placeholder").val(eqptInfo[eqptIndx].EqptID);

    $("body").find("#eqptDetlName").removeAttr("disabled").removeAttr("placeholder").val(eqptInfo[eqptIndx].EqptName);

    $("body").find("#eqptDetlColg").removeAttr("disabled").empty();

    $.ajax({
        url: "../../library/common/query_college.php",
        type: "GET",
        async: false,
        dataType: "json",
        success: function (colgJSON) {
            let colgs = colgJSON;
            for (let indx = 0; indx < colgs.length; indx++) {
                $("body").find("#eqptDetlColg").append("<option value='" + colgs[indx].ColgAbrv + "'>" + colgs[indx].ColgName + "</option>");
                if (colgs[indx].ColgName === eqptInfo[eqptIndx].ColgName) {
                    $("body").find("#eqptDetlColg").find("option[value=" + colgs[indx].ColgAbrv + "]").attr("selected", "selected");
                }
            }
        }
    });

    $("body").find("#eqptDetlCre").removeAttr("disabled").val((eqptInfo[eqptIndx].EqptCre).replace(" ", "T"));

    $("body").find("#eqptDetlDesc").removeAttr("disabled");
});

//取消更新设备信息
$("body").on("click", "#editDetlCancelBtn", function () {
    eqptDetl = null;
    eqptIndx = null;
    $("#mask").attr("style", "visibility: hidden;");
    $(".popup").remove();
});

//保存更新的信息并更新设备信息
$("body").on("click", "#editDetlUpdateBtn", function () {
    alert("成功更新");
    $("body").find("#editDetlUpdateBtn").attr("style", "visibility: hidden");
})

//显示添加设备的弹窗