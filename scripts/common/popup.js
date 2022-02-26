/*显示更新电子邮箱的弹窗*/
$("#content").on("click", "#updateEmailBtn", function popUpUpdateEmail () {
    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='updateEmailDiv' class='popup' ><form id='updateEmailFrm'>" +
        "<table id='updateEmailTbl'><tr><td id='updateTitleTxt' colspan='3'><span>您正在进行敏感操作，请验证身份</span></td>" +
        "</tr><tr><td><label for='userPasswd'>密码</label></td>" +
        "<td colspan='2'><input type='password' id='userPasswd' name='userPasswd' maxlength='18' /></td>" +
        "</tr><tr><td colspan='3'><span id='verifyUserPasswd' class='helpTxt'style='visibility: hidden;'>请输入正确的密码</span>" +
        "</td></tr><tr><td><label for='userEmail'>新邮箱</label></td>" +
        "<td><input type='email' id='userEmail' name='userEmail' /></td>" +
        "<td><input type='button' id='sendCodeBtn' name='sendCodeBtn' value='发送验证码' /></td></tr><tr>" +
        "<td colspan='3'><span id='verifyUserEmail' class='helpTxt'style='visibility: hidden;'>请输入合法的电子邮箱，且不能为原邮箱或已绑定邮箱" +
        "</span></td></tr><tr><td><label for='code'>验证码</label></td>" +
        "<td colspan='2'><input id='code' name='code' maxlength='5' /></td></tr><tr>" +
        "<td colspan='3'><span id='verifyCode' class='helpTxt' style='visibility: hidden;'>请输正确的验证码</span>" +
        "</td></tr><tr><td colspan='3'><input type='button' id='updateBtn' name='updateBtn' value='更新' />" +
        "<input type='button' id='cancelBtn' name='cancelBtn' value='取消' /></td></tr></table></form></div>"
    );
});

/*显示更新密码的弹窗*/
$("body").on("click", "#updatePasswdBtn", function popUpUpdatePasswd () {
    $("#mask").attr("style", "visibility: visible;");
    $("body").append(
        "<div id='updatePasswdDiv' class='popup' ><form id='updatePasswdFrm'><table id='updatePasswdTbl'><tr>" +
        "<td id='updateTitleTxt' colspan='3'><span>您正在进行敏感操作，请验证身份</span></td>" +
        "</tr><tr><td><label for='userEmail'>邮箱</label></td>" +
        "<td><input type='email' id='userEmail' name='userEmail' /></td>" +
        "<td><input type='button' id='sendCodeBtn' name='sendCodeBtn' value='发送验证码' /></td>" +
        "</tr><tr><td colspan='3'><span id='verifyUserEmail' class='helpTxt' style='visibility: hidden;'>请输入合法的电子邮箱，且不能为原邮箱或已绑定邮箱</span></td>" +
        "</tr><tr><td><label for='code'>验证码</label></td>" +
        "<td colspan='2'><input id='code' name='code' maxlength='5' /></td>" +
        "</tr><tr><td colspan='3'><span id='verifyCode' class='helpTxt' style='visibility: hidden;'>请输正确的验证码</span>" +
        "</td></tr><tr><td><label for='userPasswd'>新密码</label></td>" +
        "<td colspan='2'><input type='password' id='userPasswd' name='userPasswd' maxlength='18' /></td>" +
        "</tr><tr><td colspan='3'><span id='verifyUserPasswd' class='helpTxt' style='visibility: hidden;'>请输入正确的密码</span></td>" +
        "</tr><tr><td><label for='retype'>重复密码</label></td>" +
        "<td colspan='2'><input type='password' id='retype' name='retype' maxlength='18' /></td>" +
        "</tr><tr><td colspan='3'><span id='verifyRetype' class='helpTxt' style='visibility: hidden;'>两次密码不一致</span></td>" +
        "</tr><tr><td colspan='3'><input type='button' id='updateBtn' name='updateBtn' value='更新' />" +
        "<input type='button' id='cancelBtn' name='cancelBtn' value='取消' /></td></tr></table></form></div>"
    );
});

/*关闭弹窗*/
$("body").on("click", "#cancelBtn", function closePopUP() {
    $(".popup").remove();
    $("#mask").attr("style", "visibility: hidden;");
});