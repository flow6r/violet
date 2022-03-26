var userInfo = null;

/*获取登录用户的信息*/
$(document).ready(function () {
    $("#content").empty();
    obtainUserInfo();
});

/*获取用户信息*/
function obtainUserInfo() {
    $.get("../../library/session/obtain_info.php", function (userInfoJSON) {
        if (JSON.parse(userInfoJSON).error === "启动会话时发生错误，请联系管理员并反馈问题") {
            window.location.href = "../../index.html";
        } else {
            userInfo = JSON.parse(userInfoJSON);
            switch (userInfo.userRole) {
                case "学生": printStdNav(); break;
                case "教师": printTchNav(); break;
                case "管理员": printAdminNav(); break;
            }
        }
    });
}

/*打印学生用户导航栏*/
function printStdNav() {
    var userNav = $(".userNav");
    userNav.attr("id", "stdNav");
    userNav.attr("name", "stdNav");
    $("#userInfo").after("<li id='queryEqpts' name='queryEqpts'>设备查询</li>\n");
}

/*打印教师用户导航栏*/
function printTchNav() {
    var userNav = $(".userNav");
    userNav.attr("id", "tchNav");
    userNav.attr("name", "tchNav");
    $("#userInfo").after(
        "<li id='stdMgt' name='stdMgt'>学生管理</li>\n" +
        "<li id='eqptMgt' name='eqptMgt'>设备管理</li>"
    );
}

/*打印管理员用户导航栏*/
function printAdminNav() {
    var userNav = $(".userNav");
    userNav.attr("id", "adminNav");
    userNav.attr("name", "adminNav");
    $("#userInfo").after(
        "<li id='userMgt' name='userMgt'>用户管理\n" +
        "<ul id='userMgtSubNav' name='userMgtSubNav'>\n" +
        "<li id='stdUser' name='stdUser'>学生用户</li>\n" +
        "<li id='tchUser' name='tchUser'>教师用户</li>\n" +
        "</ul>\n</li>\n<li id='eqptMgt' name='eqptMgt'>设备管理</li>\n"
    );
}

/*显示用户信息设置*/
$(".userNav").on("click", "#basicInfo", function () {
    printUserInfo();
});

/*显示用户信息的函数*/
function printUserInfo() {
    let content = $("#content");
    content.empty();
    content.append(
        "<div id='basicInfoDiv' name='basicInfoDiv'><form id='basicInfoFrm' name='basicInfoFrm'>" +
        "<table id='basicInfoTbl'><tr><td colspan='2'><span id='basicInfoTitle'>基本信息设置</span></td>" +
        "</tr><tr><td><label for='userID'>用户ID</label></td>" +
        "<td><input type='text' id='userID' name='userID' class='basicInfo' placeholder='" + userInfo.userID + "' disabled='disabled' maxlength='15' />" +
        "</td></tr><tr><td><label for='userName'>姓名</label></td>" +
        "<td><input type='text' id='userName' name='userName' class='basicInfo' placeholder='" + userInfo.userName + "' disabled='disabled' />" +
        "</td></tr><tr><td><label for='userGen'>性别</label></td>" +
        "<td><select id='userGen' name='userGen' class='basicInfo' disabled='disabled'>" +
        "<option selected='selected'>" + userInfo.userGen + "</option>" +
        "</select></td></tr><tr><td><label for='userAdms'>入学年份</label></td>" +
        "<td><select id='userAdms' name='userAdms' class='basicInfo' disabled='disabled'>" +
        "<option selected='selected'>" + userInfo.userAdms + "</option></select></td></tr><tr>" +
        "<td><label for='colgName'>学院</label></td>" +
        "<td><select id='colgName' name='colgName' class='basicInfo' disabled='disabled'>" +
        "<option selected='selected'>" + userInfo.colgName + "</option></select></td></tr><tr>" +
        "<td><label for='mjrName'>专业</label></td>" +
        "<td><select id='mjrName' name='mjrName' class='basicInfo' disabled='disabled'>" +
        "<option selected='selected'>" + userInfo.mjrName + "</option></select></td></tr><tr><td>" +
        "<input type='button' id='editInfoBtn' name='editInfoBtn' value='编辑' /></td>" +
        "<td class='optBtn' style='visibility: hidden;'>" +
        "<input type='button' id='cancelBtn' name='cancelBtn' class='basicInfo' value='取消'/>" +
        "<input type='button' id='updateBtn' name='updateBtn' class='basicInfo' value='更新'/></td></tr></table></form></div>"
    );
}

$("body").on("click", "#editInfoBtn", function () {
    $("#editInfoBtn").attr("style", "visibility: hidden;");
    $(".optBtn").attr("style", "visibility: visible;");
    $("#userName").removeAttr("disabled");
    $("#userName").removeAttr("placeholder");
    $("#userName").val(userInfo.userName);

    $("#userGen").removeAttr("disabled");
    $("#userGen").empty();
    $("#userGen").append("<option value='male'>男</option><option value='female'>女</option>")
    if (userInfo.userGen === "男") $("option[value=male]").attr("selected", "selected");
    else $("option[value=female]").attr("selected", "selected");

    $("#userAdms").removeAttr("disabled");
    $("#userAdms").empty();
    let userAdms = $("#userAdms");
    let currYear = new Date();
    let yyyy = Number(currYear.getFullYear());
    for (let lower = yyyy - 4; lower <= yyyy; lower++) {
        userAdms.append("<option value='" + lower + "'>" + lower + "</option>");
    }
    $("option[value=" + userInfo.userAdms + "]").attr("selected", "selected");

    $("#colgName").removeAttr("disabled");
    $("#colgName").empty();
    $.get("../../library/common/query_college.php", function (colgJSON) {
        $.each(JSON.parse(colgJSON), function (colgIndx, colgInfo) {
            $("#colgName").append("<option value='" + colgInfo.ColgAbrv + "'>" + colgInfo.ColgName + "</option>");
            if (colgInfo.ColgName === userInfo.colgName) {
                $("option[value=" + colgInfo.ColgAbrv + "]").attr("selected", "selected");
            }
        });
        let currUserColgAbrv = $("#colgName option:selected").val();
        $("#mjrName").removeAttr("disabled");
        $("#mjrName").empty();
        $.post("../../library/common/query_major.php", { colgAbrv: currUserColgAbrv }, function (majorJSON) {
            $.each(JSON.parse(majorJSON), function (majorIndx, majorInfo) {
                $("#mjrName").append("<option value='" + majorInfo.MjrAbrv + "'>" + majorInfo.MjrName + "</option>");
                if (majorInfo.MjrName === userInfo.mjrName) $("option[value=" + majorInfo.MjrAbrv + "]").attr("selected", "selected");
            });
        });
    });
});

$("body").on("change", "#colgName", function () {
    $("#mjrName").empty();
    let colgAbrv = $("#colgName").val();
    $.post("../../library/common/query_major.php", { colgAbrv: colgAbrv }, function (majorJSON) {
        let mjrName = $("#mjrName");
        $.each(JSON.parse(majorJSON), function (majorIndx, majorInfo) {
            mjrName.append(
                "<option value='" + majorInfo.MjrAbrv + "'>" + majorInfo.MjrName + "</option>"
            );
        });
    });
});

$("#content").on("click", "#cancelBtn", function () {
    $("#editInfoBtn").attr("style", "visibility: visible;");
    $(".optBtn").attr("style", "visibility: hidden;");
    $("#userName").attr("disabled", "disabled");
    $("#userName").val("");
    $("#userName").attr("placeholder", userInfo.userName);
    $("#userGen").attr("disabled", "disabled");
    $("#userGen").empty();
    $("#userGen").append("<option>" + userInfo.userGen + "</option>");
    $("#userAdms").attr("disabled", "disabled");
    $("#userAdms").empty();
    $("#userAdms").append("<option>" + userInfo.userAdms + "</option>");
    $("#colgName").attr("disabled", "disabled");
    $("#colgName").empty();
    $("#colgName").append("<option>" + userInfo.colgName + "</option>");
    $("#mjrName").attr("disabled", "disabled");
    $("#mjrName").empty();
    $("#mjrName").append("<option>" + userInfo.mjrName + "</option>");
});

/*更新用户信息*/
$("#content").on("click", "#updateBtn", function () {
    let currUserID = userInfo.userID;
    let newName = $("#userName").val();
    let newGen = $("#userGen").val();
    let newAdms = $("#userAdms").val();
    let newColg = $("#colgName").val();
    let newMjr = $("#mjrName").val();
    let currUserRole = userInfo.userRole;

    $.ajax({
        type: "POST",
        url: "../../library/common/update_info.php",
        async: false,
        data: {
            currUserID: currUserID, newName: newName, newGen: newGen, newAdms: newAdms,
            newColg: newColg, newMjr: newMjr, currUserRole: currUserRole
        },
        success: function (status) {
            alert("成功更新用户信息");
            //获取更新后的用户信息
            $.get("../../library/common/obtain_info_updated.php", { userID: userInfo.userID }, function (userInfoJSON) {
                userInfo = JSON.parse(userInfoJSON);
                $("#editInfoBtn").attr("style", "visibility: visible;");
                $(".optBtn").attr("style", "visibility: hidden;");
                $("#userName").attr("disabled", "disabled");
                $("#userName").val("");
                $("#userName").attr("placeholder", userInfo.userName);
                $("#userGen").attr("disabled", "disabled");
                $("#userGen").empty();
                $("#userGen").append("<option>" + userInfo.userGen + "</option>");
                $("#userAdms").attr("disabled", "disabled");
                $("#userAdms").empty();
                $("#userAdms").append("<option>" + userInfo.userAdms + "</option>");
                $("#colgName").attr("disabled", "disabled");
                $("#colgName").empty();
                $("#colgName").append("<option>" + userInfo.colgName + "</option>");
                $("#mjrName").attr("disabled", "disabled");
                $("#mjrName").empty();
                $("#mjrName").append("<option>" + userInfo.mjrName + "</option>");
            });
        }
    });

});

/*显示安全性设置*/
$(".userNav").on("click", "#secSet", function () {
    printSecSet();
});

/*显示用户安全性设置的函数*/
function printSecSet() {
    let content = $("#content");
    content.empty();
    content.append(
        "<div id='secSetDiv' name='secSetDiv'>\n<form id='secSetFrm' name='secSetFrm'>\n" +
        "<table id='secSetTbl'>\n<tr>\n<td colspan='3'><span id='secTitleTxt'>安全性设置</span></td>\n" +
        "</tr>\n<tr>\n<td><label for='userEmail'>电子邮箱</label></td>\n" +
        "<td><input type='email' id='userEmail' name='userEmail' placeholder='" + userInfo.userEmail
        + "' disabled='disabled' /></td>" +
        "\n<td><input type='button' id='updateEmailBtn' name='updateEmailBtn' value='更新' /></td>\n" +
        "</tr>\n<tr>\n<td><label for='userPasswd'>账户密码</label></td>\n" +
        "<td><input type='text' id='userPasswd' name='userPasswd' placeholder='*******' disabled='disabled' />\n" +
        "</td>\n<td><input type='button' id='updatePasswdBtn' name='updatePasswdBtn' value='更新' /></td>" +
        "\n</tr>\n</table>\n</form>\n</div>"
    );
}

/*查询设备*/
$(".userNav").on("click", "#queryEqpts", function () {
    printQueryEqpt()
});

$(".userNav").on("click", "#eqptMgt", function () {
    printQueryEqpt()
});

/*显示查询设备的函数*/
function printQueryEqpt() {
    let content = $("#content");
    content.empty();
    content.append(
        "<div id='queryEqptsDiv'><form id='queryEqptsForm' name='queryEqptsForm'>" +
        "<table id='queryEqptsTbl'><tr><td colspan='3'><span id='titleTxt'>实验室设备查询</span></td></tr><tr>" +
        "<td><input type='text' id='searchItem' name='searchItem' placeholder='请输入待搜索的关键词' /></td>" +
        "<td><select id='searchType' name='searchType'><option value='eqptID'>设备ID</option><option value='eqptName'>设备名称</option>" +
        "<option value='clsName'>设备分类</option><option value='colgName'>隶属学院</option><option value='eqptStat'>设备状态</option></select></td>" +
        "<td><input type='button' id='queryEqptsBtn' name='queryEqptsBtn' value='查询' /></td>" +
        "<td><input type='button' id='lendEqptsBtn' name='lendEqptsBtn' value='批量借用' style='visibility: visible' /></td>" +
        "<td><input type='button' id='addEqptBtn' name='addEqptBtn' value='新增设备' style='visibility: visible' /></td>" +
        "<td><input type='button' id='impEqptsBtn' name='impEqptsBtn' value='批量导入' style='visibility: visible' /></td>" +
        "<td><input type='button' id='delEqptsBtn' name='delEqptsBtn' value='删除设备' style='visibility: visible' /></td></tr></table>" +
        "<table id='queryRsltTbl'><tr id='queryRsltTblHead'><th width='50px'></th><th>设备ID</th><th>设备名称</th><th>隶属学院</th>" +
        "<th>设备状态</th><th>设备详情</th><th>其他操作</th></tr></table><table id='pageCtlTbl'>" +
        "<tr><td><input type='button' id='prevPage' value='上一页' /></td>" +
        "<td><input type='text' id='pageInfo' value='' size='12' disabled='disabled' /></td>" +
        "<td><input type='button' id='nextPage' value='下一页' /></td>" +
        "<td><input type='text' id='trgtPage' placeholder='输入想要跳转的页数' /></td>" +
        "<td><input type='button' id='jump' value='跳转' /></td></tr></table></form></div>"
    );

    if (userInfo.userRole === "学生") {
        $("#content").find("#addEqptBtn").attr("style", "visibility: hidden");
        $("#content").find("#impEqptsBtn").attr("style", "visibility: hidden");
        $("#content").find("#delEqptsBtn").attr("style", "visibility: hidden");
    }

    $("#content").find("#queryRsltTblHead").siblings().remove();

    queryEqpts(userInfo.userRole, userInfo.colgName, "colgName");

}

/*设备申请记录*/
$(".userNav").on("click", "#userAppls", function () {
    printQueryAppl();
});

function printQueryAppl() {
    $("#content").empty();
    $("#content").append(
        "<div id='queryApplsDiv' name='queryApplsDiv'><form id='queryApplsForm' name='queryApplsForm'>" +
        "<table id='queryApplsMenuTbl'><tr><td colspan='3'><span>设备申请记录查询</span></td></tr>" +
        "<tr><td><input type='text' id='searchItem' name='searchItem' placeholder='请输入待搜索的关键词' /></td>" +
        "<td><select id='searchType' name='searchType'><option value='applID'>申请记录ID</option>" +
        "<option value='userID'>申请用户ID</option><option value='applStat'>申请状态</option></select></td>" +
        "<td><input type='button' id='queryApplsBtn' name='queryApplsBtn' value='查询' /></td>" +
        "<td><input type='button' id='delApplsBtn' name='delApplsBtn' value='批量删除'/></td>" +
        "<td><input type='button' id='rjctApplsBtn' name='rjctApplsBtn' value='批量驳回'/></td>" +
        "<td><input type='button' id='procApplsBtn' name='procApplsBtn' value='批量处理'/></td></tr>" +
        "</table><table id='applRsltsTbl' name='applRsltsTbl'>" +
        "<tr id='applRsltsTblHead'><th width='50px'></th><th>申请记录ID</th><th>申请用户ID</th><th>申请详情</th><th>申请状态</th><th>操作</th></tr>" +
        "</table><table id='applsPageCtlTbl'>" +
        "<tr><td><input type='button' id='applsPrevPage' value='上一页' /></td><td><input type='text' id='applsPageInfo' value='' size='12' disabled='disabled' /></td>" +
        "<td><input type='button' id='applsNextPage' value='下一页' /></td><td><input type='text' id='applsTrgtPage' placeholder='输入想要跳转的页数' /></td>" +
        "<td><input type='button' id='applsJump' value='跳转' /></td></tr></table></form></div>"
    );

    if (userInfo.userRole === "学生") {
        $("#content").find("#rjctApplsBtn").attr("style", "display: none");
        $("#content").find("#procApplsBtn").attr("style", "display: none");
        $("#content").find("option[value='userID']").remove();
    }

    queryAppls(userInfo.userID, userInfo.userRole, userInfo.mjrName, "", "applStat");
}

/*设备借用记录*/
$(".userNav").on("click", "#lentEqpts", function () {
    printLentEqpts()
});

function printLentEqpts() {
    $("#content").empty();
    $("#content").append(
        "<div id='queryLendsDiv' name='queryLendsDiv'><form id='queryLendsForm' name='queryLendsForm'>" +
        "<table id='queryLendsFormMenu' name='queryLendsFormMenu'><tr><td colspan='5'><span>设备借用记录查询</span></td></tr>" +
        "<tr><td><input type='text' id='searchItem' name='searchItem' placeholder='请输入待搜索的关键词'/></td>" +
        "<td><select id='searchType' name='searchType'><option value='userID'>用户ID</option><option value='eqptID'>设备ID</option>" +
        "<option value='lendStat'>借用状态</option><option value='mjrName'>专业名称</option><option value='colgName'>学院名称</option></select></td>" +
        "<td><input type='button' id='queryLendEqptsBtn' name='queryLendEqptsBtn' value='查询' /></td>" +
        "<td><input type='button' id='rtnEqptsBtn' name='rtnEqptsBtn' value='批量归还' /></td>" +
        "<td><input type='button' id='creBrkRecsBtn' name='creBrkRecsBtn' value='批量报修' /></td>" +
        "<td><input type='button' id='delLendRecsBtn' name='delLendRecsBtn' value='批量删除' /></td></tr></table>" +
        "<table id='lendEqptsRecs' name='lendEqptsRecs'><tr id='lendEqptsRecsHead' name='lendEqptsRecsHead'>" +
        "<th width='25px'></th><th>用户ID</th><th>设备ID</th><th>借用开始时间</th><th>借用结束时间</th><th>借用状态</th><th>实际归还时间</th><th>其他操作</th>" +
        "</tr></table><table id='lendRecsPagesCtl' name='lendRecsPagesCtl'><td><input type='button' id='lendPrevPage' name='lendPrevPage' value='上一页' /></td>" +
        "<td><input type='text' id='lendRecsPagesInfo' name='lendRecsPagesInfo' size='12' placeholder='' disabled='disabled' /></td><td><input type='button' id='lendNextPage' name='lendNextPage' value='下一页' /></td>" +
        "<td><input type='text' id='lendTrgtPage' name='lendTrgtPage' placeholder='输入想要跳转的页数' /></td><td><input type='button' id='lendJumpToTrgtPage' name='lendJumpToTrgtPage' value='跳转'/></td>" +
        "</table></form></div>"
    );

    if (userInfo.userRole === "学生") {
        $("#content").find("option[value='userID']").remove();
        $("#content").find("option[value='mjrName']").remove();
        $("#content").find("option[value='colgName']").remove();
    }

    queryLentEqptRecs(userInfo.userID, userInfo.userRole, userInfo.mjrName, "", "lendStat");
}

/*设备报修记录*/
$(".userNav").on("click", "#BrkRecs", function () {
    printBrkEqpts();
});

function printBrkEqpts() {
    $("#content").empty();
    $("#content").append(
        "<div id='queryBrkRecsDiv' name='queryBrkRecsDiv'><form id='queryBrkRecsForm' name='queryBrkRecsForm'><table id='queryBrkRecsMenu' name='queryBrkRecsMenu'>" +
        "<tr><td><span>损坏设备报修记录查询</span></td></tr><tr><td><input type='text' id='searchItem' name='searchItem' placeholder='请输入待搜索的关键词' /></td>" +
        "<td><select id='searchType' name='searchType'><option value='brkID'>报修ID</option><option value='userID'>上报用户ID</option><option value='eqptID'>报修设备ID</option>" +
        "<option value='eqptName'>设备名称</option><option value='clsName'>设备分类</option><option value='brkStat'>报修状态</option><option value='dspUser'>处理用户ID</option></select></td>" +
        "<td><input type='button' id='queryBrkRecsBtn' name='queryBrkRecsBtn' value='查询' /></td>" +
        "<td><input type='button' id='delBrkRecsBtn' name='delBrkRecsBtn' value='批量删除'/></td>" +
        "<td><input type='button' id='procBrkRecsBtn' name='procBrkRecsBtn' value='批量处理'/></td></tr></table><table id='brkRecsTbl' name='brkRecsTbl'>" +
        "<tr id='brkRecsTblHead' name='brkRecsTblHead'><th width='20px'></th><th>报修ID</th><th>上报用户</th><th>报修设备</th><th>报修状态</th><th>报修详情</th><th>其他操作</th>" +
        "</tr></table><table id='brkRecsPageCtl' name='brkRecsPageCtl'><tr><td><input type='button' id='brkPrevPage' name='brkPrevPage' value='上一页' /></td>" +
        "<td><input type='text' id='brkRecsPageInfo' name='brkRecsPageInfo' size='12' disabled='disabled' /></td>" +
        "<td><input type='button' id='brkNextPage' name='brkNextPage' value='下一页' /></td>" +
        "<td><input type='text' id='brkRecsTrgtPage' name='brkRecsTrgtPage' placeholder='请输入想要跳转的页数' /></td>" +
        "<td><input type='button' id='brkJupmToTrgtPage' name='brkJupmToTrgtPage' value='跳转' /></td></tr></table></form></div>"
    );

    if (userInfo.userRole === "学生") $("#content").find("option[value='userID']").remove();

}

/*退出登录*/
$(".userNav").on("click", "#logout", function () {
    $.post("../../library/session/user_logout.php", function (status) {
        if (status === "successful") window.location.href = "../../index.html";
    });
});