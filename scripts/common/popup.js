/*显示更新电子邮箱的弹窗*/
$("#content").on("click", "#updateEmailBtn", function popUpUpdateEmail() {
    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='updateEmailDiv' class='popup' ><form id='updateEmailFrm'>" +
        "<table id='updateEmailTbl'><tr><td id='updateTitleTxt' colspan='3'><span>您正在进行敏感操作，请验证身份</span></td>" +
        "</tr><tr><td><label for='userPasswd'>密码</label></td>" +
        "<td colspan='2'><input type='password' id='userPasswd' name='userPasswd' maxlength='18' /></td>" +
        "</tr><tr><td colspan='3'><span id='verifyUserPasswd' class='helpTxt' style='visibility: hidden;'>请输入正确的密码</span>" +
        "</td></tr><tr><td><label for='userEmail'>新邮箱</label></td>" +
        "<td><input type='email' id='userEmail' name='userEmail' /></td>" +
        "<td><input type='button' id='sendCodeBtn-updateEmail' name='sendCodeBtn' value='发送验证码' /></td></tr><tr>" +
        "<td colspan='3'><span id='verifyUserEmail' clauserPasswdss='helpTxt' style='visibility: hidden;'>请输入合法的电子邮箱，且不能为原邮箱或已绑定邮箱" +
        "</span></td></tr><tr><td><label for='code'>验证码</label></td>" +
        "<td colspan='2'><input id='code-updateEmail' name='code' maxlength='5' /></td></tr><tr>" +
        "<td colspan='3'><span id='verifyCode' class='helpTxt' style='visibility: hidden;'>请输正确的验证码</span>" +
        "</td></tr><tr><td colspan='3'><input type='button' id='toUpdateEmail' name='toUpdateEmail' class='popUpBtn' value='更新' />" +
        "<input type='button' id='cancelBtn' name='cancelBtn' class='popUpBtn' value='取消' /></td></tr></table></form></div>"
    );
});

/*显示更新密码的弹窗*/
$("body").on("click", "#updatePasswdBtn", function popUpUpdatePasswd() {
    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='updatePasswdDiv' class='popup' ><form id='updatePasswdFrm'><table id='updatePasswdTbl'><tr>" +
        "<td id='updateTitleTxt' colspan='3'><span>您正在进行敏感操作，请验证身份</span></td>" +
        "</tr><tr><td><label for='userEmail'>邮箱</label></td>" +
        "<td><input type='email' id='userEmail' name='userEmail' /></td>" +
        "<td><input type='button' id='sendCodeBtn-updatePasswd' name='sendCodeBtn' value='发送验证码' /></td>" +
        "</tr><tr><td colspan='3'><span id='verifyUserEmail' class='helpTxt' style='visibility: hidden;'>请输入合法的电子邮箱，且不能为原邮箱或已绑定邮箱</span></td>" +
        "</tr><tr><td><label for='code'>验证码</label></td>" +
        "<td colspan='2'><input id='code-updatePasswd' name='code' maxlength='5' /></td>" +
        "</tr><tr><td colspan='3'><span id='verifyCode' class='helpTxt' style='visibility: hidden;'>请输正确的验证码</span>" +
        "</td></tr><tr><td><label for='newPasswd'>新密码</label></td>" +
        "<td colspan='2'><input type='password' id='newPasswd' name='userPasswd' maxlength='18' disabled='disabled' /></td>" +
        "</tr><tr><td colspan='3'><span id='verifyUserPasswd' class='helpTxt' style='visibility: hidden;'>请输入正确的密码</span></td>" +
        "</tr><tr><td><label for='retype'>重复密码</label></td>" +
        "<td colspan='2'><input type='password' id='retype' name='retype' maxlength='18' disabled='disabled' /></td>" +
        "</tr><tr><td colspan='3'><span id='verifyRetype' class='helpTxt' style='visibility: hidden;'>两次密码不一致</span></td>" +
        "</tr><tr><td colspan='3'><input type='button' id='toUpdatePasswd' name='toUpdatePasswd' class='popUpBtn' value='更新' />" +
        "<input type='button' id='cancelBtn' name='cancelBtn' class='popUpBtn' value='取消' /></td></tr></table></form></div>"
    );
});

/*检查当前账户的密码*/
$("body").on("focusout", "#userPasswd", function checkOldPasswd() {
    let userPasswd = $("#updateEmailDiv").find("#userPasswd").val();
    $.post("../../library/common/verify_passwd.php", { userPasswd: userPasswd }, function (status) {
        if (status === "invalid") alert("密码错误");
    });
});

/*检查邮箱并发送验证码*/
$("body").on("click", "#sendCodeBtn-updateEmail", function sendCodeToNewEmail() {
    let newEmail = $("#updateEmailDiv").find("#userEmail").val();
    if (newEmail === "") alert("请输入合法的邮箱");
    else {
        $.post("../../library/common/verify_email.php", { userEmail: newEmail }, function (status) {
            if (status === "bound") alert("该邮箱为原邮箱或已被绑定");
            else {
                $.post("../../library/common/send_code.php", { userEmail: newEmail });
                alert("已将验证码发送至新邮箱");
            }
        });
    }
});

/*检查验证码*/
$("body").on("focusout", "#code-updateEmail", function verifyCode() {
    let code = $("#updateEmailDiv").find("#code-updateEmail").val();
    if (code === "") alert("请输入验证码");
    else {
        $.post("../../library/common/verify_code.php", { code: code }, function (status) {
            if (status === "invalid") {
                alert("请输入正确的验证码");
            }
        });
    }
});

/*关闭弹窗，可以写一个关闭弹窗的函数，再调用*/
$("body").on("click", "#cancelBtn", function closePopUP() {
    $(".popup").remove();
    $("#mask").attr("style", "visibility: hidden;");
});

/*更新电子邮箱*/
$("body").on("click", "#toUpdateEmail", function updateEmail() {
    let userPasswd = $("#updateEmailDiv").find("#userPasswd").val();
    let newEmail = $("#updateEmailDiv").find("#userEmail").val();
    let code = $("#updateEmailDiv").find("#code-updateEmail").val();
    if (userPasswd != "" && newEmail != "" && code != "") {
        let currUserID = userInfo.userID;
        let currUserRole = userInfo.userRole;
        $.post("../../library/common/update_email.php",
            { userID: currUserID, userRole: currUserRole, userEmail: newEmail },
            function (status) {
                if (status != "successful") alert(status);
                else {
                    alert("成功更新电子邮箱");
                    obtainUserInfoUpdated();
                }
            });
    } else alert("请完善必要信息");
});

/*获取更新后的用户信息*/
function obtainUserInfoUpdated() {
    let currUserId = userInfo.userID;
    $.get("../../library/common/obtain_info_updated.php", { userID: currUserId }, function (userInfoJSON) {
        userInfo = JSON.parse(userInfoJSON);
        $(".popup").remove();
        $("#mask").attr("style", "visibility: hidden;");
        $("#userEmail").attr("placeholder", userInfo.userEmail);
    });
}

/*检查电子邮箱*/
$("body").on("click", "#sendCodeBtn-updatePasswd", function () {
    let currUserEmail = $("#updatePasswdDiv").find("#userEmail").val();
    if (currUserEmail === "") alert("请输入合法的邮箱");
    else {
        $.post("../../library/common/send_code.php", { userEmail: currUserEmail });
        alert("已将验证码发送至新邮箱");
    }
});

/*检查更新密码时的电子邮箱*/
$("body").on("focusout", "#code-updatePasswd", function () {
    let code = $("#updatePasswdDiv").find("#code-updatePasswd").val();
    if (code === "") alert("请输入验证码");
    else {
        $.post("../../library/common/verify_code.php", { code: code }, function (status) {
            if (status === "invalid") {
                alert("请输入正确的验证码");
            } else {
                $("#updatePasswdDiv").find("#newPasswd").removeAttr("disabled");
                $("#updatePasswdDiv").find("#retype").removeAttr("disabled");
            }
        });
    }
});

$("body").on("focusout", "#newPasswd", function () {
    let newPasswd = $("#updatePasswdDiv").find("#newPasswd").val();
    if (newPasswd === "" || newPasswd.length < 6) alert("请输入6~18位密码");
});

$("body").on("focusout", "#retype", function () {
    let newPasswd = $("#updatePasswdDiv").find("#newPasswd").val();
    let retype = $("#updatePasswdDiv").find("#retype").val();
    if (newPasswd != retype) alert("两次密码不一致");
});

$("body").on("click", "#toUpdatePasswd", function () {
    let currUserEmail = $("#updatePasswdDiv").find("#userEmail").val();
    let code = $("#updatePasswdDiv").find("#code-updatePasswd").val();
    let newPasswd = $("#updatePasswdDiv").find("#newPasswd").val();
    let retype = $("#updatePasswdDiv").find("#retype").val();
    if (currUserEmail != "" && code != "" && newPasswd != "" && retype != "" && newPasswd === retype) {
        let currUserRole = userInfo.userRole;
        let currUserID = userInfo.userID;
        $.post("../../library/common/update_passwd.php", { userID: currUserID, userRole: currUserRole, newPasswd: newPasswd }, function (status) {
            if (status === "successful") {
                alert("成功更新密码");
                obtainUserInfoUpdated();
            }
        });
    } else alert("请完善必要信息");
});