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
    $("#userInfo").append("<li id='eqptQuery' name='eqptQuery'>设备查询</li>\n");
}

/*打印教师用户导航栏*/
function printTchNav() {
    var userNav = $(".userNav");
    userNav.attr("id", "tchNav");
    userNav.attr("name", "tchNav");
    $("#userInfo").append(
        "<li id='stdMgt' name='stdMgt'>学生管理</li>\n" +
        "<li id='eqptMgt' name='eqptMgt'>设备管理</li>"
    );
}

/*打印管理员用户导航栏*/
function printAdminNav() {
    var userNav = $(".userNav");
    userNav.attr("id", "adminNav");
    userNav.attr("name", "adminNav");
    $("#userInfo").append(
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
        ""
    );
}

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

/*退出登录*/
$(".userNav").on("click", "#logout", function () {
    $.post("../../library/session/user_logout.php", function (status) {
        if (status === "successful") window.location.href = "../../index.html";
    });
});