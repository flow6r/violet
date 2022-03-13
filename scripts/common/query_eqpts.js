var recLimit = 16;
var eqptInfo = null;
var totPages = null;
var currPage = null;
var eqptDetl = null;
var eqptIndx = null;
var eqptOldID = null;
var eqptIDs = new Array();
var eqptIDsIndx = 0;

$("#content").on("click", "#queryEqptsBtn", function () {
    $("#content").find("#queryRsltTblHead").siblings().remove();

    let searchItem = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#queryEqptsTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#queryEqptsTbl").find("#searchType").val();

    if (searchItem != "") queryEqpts(userInfo.userRole, searchItem, searchType);
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

            if (eqptInfo.length === 0) {
                alert("共0条记录");
                totPages = 0;
                currPage = 0;
                ($("#content").find("#pageInfo")).val("第0页，共0页");
                $("#content").find("#prevPage").attr("disabled", "disabled");
                $("#content").find("#nextPage").attr("disabled", "disabled");
            } else {
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
            "<tr><td><input type='checkbox' value='" + eqptInfo[begnPage].EqptID + "' name='eqptCheckbox' class='eqptCheckbox' /></td>" +
            "<td>" + eqptInfo[begnPage].EqptID + "</td>" +
            "<td>" + eqptInfo[begnPage].EqptName + "</td>" +
            "<td>" + eqptInfo[begnPage].ColgName + "</td>" +
            "<td>" + eqptInfo[begnPage].EqptStat + "</td>" +
            "<td><a name='" + eqptInfo[begnPage].EqptID + "' href='#'>详情</a></td>" +
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

    eqptDetl = $(event.target).attr("name");
    eqptIndx = eqptInfo.findIndex(eqptInfo => eqptInfo.EqptID == eqptDetl);

    $("body").append(
        "<div id='eqptDetlDiv' class='popup'><form id='eqptDetlForm' name='eqptDetlForm'>" +
        "<table id='eqptDetlTbl'><tr><th><span id='detlTitleTxt'>实验设备详情</span></th>" +
        "<th><input type='button' id='editEqptDetlInfo' name='editEqptDetlInfo' value='更新设备信息' /></th>" +
        "</tr><tr id='eqptImg'><td colspan='2'><img src='" + eqptInfo[eqptIndx].ImgPath + "'" +
        " width='200' height='200' alt='eqptDetlInfo' title='" + eqptInfo[eqptIndx].EqptID + "' /></td>" +
        "</tr><tr><td><span>设备ID</span></td><td><input type='text' id='eqptDetlID' name='eqptDetlID' value='" +
        eqptInfo[eqptIndx].EqptID + "' disabled='disabled' />" +
        "</td></tr><tr><td><span>设备名称</span></td>" +
        "<td><input type='text' id='eqptDetlName' name='eqptDetlName' value='" + eqptInfo[eqptIndx].EqptName + "' disabled='disabled' />" +
        "</td></tr><tr><td><span>设备分类</span></td><td><select id='eqptDetlCls' name='eqptDetlCls' disabled='disabled'><option>" +
        eqptInfo[eqptIndx].ClsName + "<option></select></td></tr>" +
        "<tr><td><span>隶属学院</span></td><td><select id='eqptDetlColg' name='eqptDetlColg' disabled='disabled'>" +
        "<option>" + eqptInfo[eqptIndx].ColgName + "</option></select></td></tr><tr>" +
        "<td><span>入库时间</span></td><td><input type='datetime-local' step='1' id='eqptDetlCre' name='eqptDetlCre' value='" +
        (eqptInfo[eqptIndx].EqptCre).replace(" ", "T") + "' disabled='disabled' /></td></tr><tr>" +
        "<td><span>设备描述</span></td><td><textarea id='eqptDetlDesc' disabled='disabled'>" + eqptInfo[eqptIndx].EqptDesc + "</textarea></td></tr>" +
        "<tr style='text-align:center'><td><input type='button' id='editDetlCancelBtn' name='editDetlCancelBtn' value='取消' /></td>" +
        "<td><input type='button' id='editDetlUpdateBtn' name='editDetlUpdateBtn' value='更新' style='visibility: hidden;' /></td></tr></table></form></div>"
    );

    if (userInfo.userRole === "学生") $("body").find("#editEqptDetlInfo").attr("style", "visibility: hidden");
});

//点击更新设备信息按钮
$("body").on("click", "#editEqptDetlInfo", function () {
    if (userInfo.userRole != "学生") {
        $("body").find("#editDetlUpdateBtn").attr("style", "visibility: visible");

        $("body").find("#eqptDetlID").removeAttr("disabled").removeAttr("placeholder").val(eqptInfo[eqptIndx].EqptID);
        eqptOldID = $("body").find("#eqptDetlID").removeAttr("disabled").removeAttr("placeholder").val();

        $("body").find("#eqptDetlName").removeAttr("disabled").removeAttr("placeholder").val();

        $("body").find("#eqptDetlCls").removeAttr("disabled").empty();

        $.ajax({
            url: "../../library/common/query_cls.php",
            type: "GET",
            async: false,
            data: { userRole: userInfo.userRole },
            dataType: "json",
            success: function (clsJSON) {
                let cls = clsJSON;
                for (let indx = 0; indx < cls.length; indx++) {
                    $("body").find("#eqptDetlCls").append("<option value='" + cls[indx].ClsAbrv + "'>" + cls[indx].ClsName + "</option>");
                    if (cls[indx].ClsName === eqptInfo[eqptIndx].ClsName) {
                        $("body").find("#eqptDetlCls").find("option[value=" + cls[indx].ClsAbrv + "]").attr("selected", "selected");
                    }
                }
            }
        });

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
    } else alert("禁止学生操作");
});

//取消更新设备信息
$("body").on("click", "#editDetlCancelBtn", function () {
    $("#mask").attr("style", "visibility: hidden;");

    $(".popup").remove();

    $("#content").find("#queryRsltTblHead").siblings().remove();

    let searchItem = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#queryEqptsTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#queryEqptsTbl").find("#searchType").val();

    if (searchItem === "") {
        searchItem = userInfo.colgName;
        searchType = "colgName";
    }

    queryEqpts(userInfo.userRole, searchItem, searchType);
});

//保存更新的信息并更新设备信息
$("body").on("click", "#editDetlUpdateBtn", function () {
    let currUserRole = userInfo.userRole;
    let eqptNewID = $("body").find("#eqptDetlID").val();
    let eqptNewName = $("body").find("#eqptDetlName").val();
    let eqptNewCls = $("body").find("#eqptDetlCls").val();
    let eqptNewColg = $("body").find("#eqptDetlColg").val();
    let eqptNewCre = $("body").find("#eqptDetlCre").val();
    let eqptNewDesc = $("body").find("#eqptDetlDesc").val();
    eqptNewCre = eqptNewCre.replace("T", " ");


    $.ajax({
        url: "../../library/common/update_eqpt_info.php",
        type: "POST",
        async: false,
        data: {
            currUserRole: currUserRole, eqptNewID: eqptNewID, eqptOldID: eqptOldID,
            eqptNewCls: eqptNewCls, eqptNewName: eqptNewName, eqptNewColg: eqptNewColg,
            eqptNewCre: eqptNewCre, eqptNewDesc: eqptNewDesc
        },
        dataType: "text",
        success: function (status) {
            switch (status) {
                case "0": alert("连接数据库时发生错误，请联系管理员并反馈问题"); break;
                case "1": alert("已存在同ID设备，请确认后再更新设备ID"); break;
                case "2": alert("查询设备分类时发生错误，请联系管理员并反馈问题"); break;
                case "3": alert("查询学院信息时发生错误，请联系管理员并反馈问题"); break;
                default: alert("成功更新设备信息"); break;
            }
        }
    });

    $("#mask").attr("style", "visibility: hidden;");

    $(".popup").remove();

    $("#content").find("#queryRsltTblHead").siblings().remove();

    let searchItem = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#queryEqptsTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#queryEqptsTbl").find("#searchType").val();

    if (searchItem === "") {
        searchItem = userInfo.colgName;
        searchType = "colgName";
    }

    queryEqpts(userInfo.userRole, searchItem, searchType);

});

/*添加设备*/
$("#content").on("click", "#addEqptBtn", function () {
    if (userInfo.userRole === "学生") alert("禁止学生操作");
    else {
        $("#mask").attr("style", "visibility: visible;");

        $("body").append(
            "<div id='addEqptDiv' class='popup'>" +
            "<form id='addEqptForm' name='addEqptForm' action='../../library/common/add_eqpt.php' target='doNotRefresh' method='post' enctype='multipart/form-data' onsubmit='return checkAddNewEqpt()'>" +
            "<table id='addEqptTbl' name='addEqptTbl'><tr><th colspan='2'>新增设备</th></tr>" +
            "<tr><th colspan='2'><span class='tips'>注意，单个图片文件上传限制为20M</span></th></tr>" +
            "<tr><td><span>设备ID</span></td><td><input type='text' id='newEqptID' name='newEqptID' maxlength='50' /></td></tr>" +
            "<tr><td><span>设备名称</span></td><td><input type='text' id='newEqptName' name='newEqptName' maxlength='50' /></td></tr>" +
            "<tr><td><span>设备图片</span></td><td><input type='file' id='newEqptImg' name='newEqptImg' /></td></tr>" +
            "<tr><td><span>设备分类</span></td><td><select id='newEqptCls' name='newEqptCls'></select></td></tr>" +
            "<tr><td><span>隶属学院</span></td><td><select id='newEqptColg' name='newEqptColg'></select></td></tr>" +
            "<tr><td><span>入库时间</span></td><td><input type='datetime-local' step='1' id='newEqptCre' name='newEqptCre' /></td></tr>" +
            "<tr><td><span>设备描述</span></td><td><textarea id='newEqptDesc' name='newEqptDesc'></textarea></td></tr>" +
            "<tr><td colspan='2'><input type='button' id='cancelAddEqptBtn' name='cancelAddEqptBtn' class='cancelBtn' value='取消' />" +
            "<input type='submit' id='addNewEqptBtn' name='addNewEqptBtn' value='添加设备' /></td>" +
            "</tr></table></form><iframe id='doNotRefresh' name='doNotRefresh' title='doNotRefresh' style='display: none;'></iframe></div>"
        );
    }
});
//添加设备-显示设备分类
$("body").on("focusin", "#newEqptCls", function () {
    $("body").find("#newEqptCls").empty();

    $.ajax({
        url: "../../library/common/query_cls.php",
        type: "GET",
        async: false,
        data: { userRole: userInfo.userRole },
        dataType: "json",
        success: function (clsJSON) {
            let cls = clsJSON;
            for (let indx = 0; indx < cls.length; indx++) {
                $("body").find("#newEqptCls").append("<option value='" + cls[indx].ClsAbrv + "'>" + cls[indx].ClsName + "</option>");
            }
        }
    });
});
//添加设备-显示学院信息
$("body").on("focusin", "#newEqptColg", function () {
    $("body").find("#newEqptColg").empty();

    $.ajax({
        url: "../../library/common/query_college.php",
        type: "GET",
        async: false,
        dataType: "json",
        success: function (colgJSON) {
            let colgs = colgJSON;
            for (let indx = 0; indx < colgs.length; indx++) {
                $("body").find("#newEqptColg").append("<option value='" + colgs[indx].ColgAbrv + "'>" + colgs[indx].ColgName + "</option>");
            }
        }
    });
});
//检查添加单个实验设备信息
function checkAddNewEqpt() {
    let newEqptID = $("body").find("#newEqptID").val();
    let newEqptName = $("body").find("#newEqptName").val();
    let newEqptImg = $("body").find("#newEqptImg").val();
    let newEqptCls = $("body").find("#newEqptCls").val();
    let newEqptColg = $("body").find("#newEqptColg").val();
    let newEqptCre = $("body").find("#newEqptCre").val();
    let newEqptDesc = $("body").find("#newEqptDesc").val();

    if (userInfo.userRole === "学生") {
        alert("禁止学生操作");
        return false;
    } else if (newEqptID === "" || newEqptName === "" || newEqptImg === "" ||
        newEqptCls === "" || newEqptColg === "" || newEqptCre === "" || newEqptDesc === "") {
        alert("设备信息不全，请输入必要信息");
        return false;
    }
}
//批量添加实验设备
$("#content").on("click", "#impEqptsBtn", function () {
    if (userInfo.userRole === "学生") alert("禁止学生操作");
    else {
        $("#mask").attr("style", "visibility: visible;");

        $("body").append(
            "<div id='impEqptsDiv' class='popup'>" +
            "<form id='impEqptsForm' name='impEqptsForm' enctype='multipart/form-data' action='../../library/common/import_eqpts.php' method='post' target='doNotRefresh' onsubmit='return checkImpNewEqpts()'>" +
            "<table id='impEqptsTbl' name='impEqptsTbl'><tr><th colspan='2'><span>批量添加设备</span></th></tr>" +
            "<tr><th colspan='2'><a href='http://localhost/data/tmpl/EqptInfoTmpl.xlsx'>点击我下载模板</a></th></tr>" +
            "<tr><td><label>设备信息文件</label></td><td><input type='file' id='newEqptsInfoTmpl' name='newEqptsInfoTmpl' /></td></tr>" +
            "<tr><td><label>设备图片文件</label></td><td><input type='file' id='newEqptsImgs' name='newEqptsImgs[]' multiple='multiple' /></td></tr>" +
            "<tr><td><input type='button' id='cancelImpEqptsBtn' name='cancelImpEqptsBtn' class='cancelBtn' value='取消' /></td>" +
            "<td><input type='submit' id='impNewEqptsBtn' value='上传' /></td></tr></table></form>" +
            "<iframe id='doNotRefresh' name='doNotRefresh' title='doNotRefresh' style='display: none;'>" +
            "</iframe></div>"
        );
    }
});
//检查设备模板文件的函数
function checkImpNewEqpts() {
    if (userInfo.userRole != "学生") {
        let eqptInfoTmpl = $("body").find("#newEqptsInfoTmpl").val();
        let eqptImgs = $("body").find("#newEqptsImgs").val();
        if (eqptInfoTmpl === "") {
            alert("请选择待上传的设备信息文件再执行上传操作");
            return false;
        }
        if (eqptImgs === "") {
            alert("请选择待上传的设备图片文件再执行上传操作");
            return false;
        }
    } else {
        alert("禁止学生操作");
        return false;
    }
}
//取消
$("body").on("click", ".cancelBtn", function () {
    $("#mask").attr("style", "visibility: hidden;");

    $(".popup").remove();

    $("#content").find("#queryRsltTblHead").siblings().remove();

    let searchItem = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#queryEqptsTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#queryEqptsTbl").find("#searchType").val();

    if (searchItem === "") {
        searchItem = userInfo.colgName;
        searchType = "colgName";
    }

    queryEqpts(userInfo.userRole, searchItem, searchType);
});

//借用单个设备
$("#content").on("click", ".lendBtn", function (event) {
    $("#mask").attr("style", "visibility: visible;");

    beLentEqptIndx = eqptInfo.findIndex(eqptInfo => eqptInfo.EqptID == $(event.target).attr("id"));

    $("body").append(
        "<div id='lendEqptDiv' name='lendEqptDiv' class='popup'><form id='lendEqptForm' name='lendEqptForm'><table id='lendEqptTbl' name='lendEqptTbl'>" +
        "<tr><th colspan='2'><span>借用设备</span></th></tr>" +
        "<tr><td colspan='2'><img src='" + eqptInfo[beLentEqptIndx].ImgPath + "' width='200' height='200' alt='eqptImg' title='eqptInfo[beLentEqptIndx].EqptID' /></td></tr>" +
        "<tr><td><label>设备ID</label></td><td><input type='text' id='beLentEqptID' name='beLentEqptID' placeholder='" + eqptInfo[beLentEqptIndx].EqptID + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>借用开始时间</label></td><td><input type='datetime-local' step='1' id='lendBegn' /></td></tr>" +
        "<tr><td><label>借用结束时间</label></td><td><input type='datetime-local' step='1' id='lendEnd' /></td></tr>" +
        "<tr><td><label>借用用途描述</label></td><td><textarea id='applDesc'></textarea></td></tr>" +
        "<tr><td><input type='button' id='cancelLendEqptBtn' name='cancelLendEqptBtn' class='cancelBtn' value='取消' /></td>" +
        "<td><input type='button' id='lendAnEqptBtn' name='lendAnEqptBtn' value='借用' /></td></tr></table></form></div>"
    );
});
//处理借用设备的函数
$("body").on("click", "#lendOneEqptBtn", function () {

});
//批量借用实验设备

/*批量删除实验设备*/
//获取选中的设备ID
$("#content").on("click", ".eqptCheckbox", function (event) {
    let currEqptID = $(event.target).val();

    if ($(event.target).attr("checked")) {
        $(event.target).removeAttr("checked");
        let currEqptIndx = eqptIDs.indexOf(currEqptID);
        eqptIDs.splice(currEqptIndx, 1);
    } else {
        $(event.target).attr("checked", "ture");
        eqptIDs[eqptIDsIndx++] = currEqptID;
    }
});
//遍历、检查获取的设备ID
$("#content").on("click", "#delEqptsBtn", function () {
    if (userInfo.userRole != "学生") {
        if (eqptIDs.length != 0) {
            $.ajax({
                url: "../../library/common/del_eqpts.php",
                type: "POST",
                async: false,
                data: { userRole: userInfo.userRole, eqptsBeDel: eqptIDs },
                dataType: "text",
                success: function (status) {
                    if (status != "successful") {
                        alert(status);

                        for (let indx = 0; indx < eqptIDs.length; indx++) {
                            $("#content").find("input[value='" + eqptIDs[indx] + "']").removeAttr("checked");
                            $("#content").find("input[value='" + eqptIDs[indx] + "']").prop("checked", false);
                        }
                    } else {
                        alert("成功删除" + eqptIDs.length + "条设备记录");

                        $("#content").find("#queryRsltTblHead").siblings().remove();

                        let searchItem = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#queryEqptsTbl").find("#searchItem").val();
                        let searchType = $("#content").find("#queryEqptsDiv").find("#queryEqptsForm").find("#queryEqptsTbl").find("#searchType").val();

                        if (searchItem === "") {
                            searchItem = userInfo.colgName;
                            searchType = "colgName";
                        }

                        queryEqpts(userInfo.userRole, searchItem, searchType);
                    }
                }
            });
        } else alert("您选择了" + eqptIDs.length + "条记录，请选择待删除的设备再进行操作");
        eqptIDs = new Array();
        eqptIDsIndx = 0;
    } else alert("禁止学生操作");
});