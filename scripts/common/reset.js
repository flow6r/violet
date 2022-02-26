$("#userEmail").on("focusout", function checkUserEmail() {
    /*需要改进，验证邮箱地址是否合法！*/
    var userEmail = $("#userEmail").val();
    var verify = $("#verifyUserEmail");

    if (userEmail === "") verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");
});

$("#sendCodeBtn").on("click", function sendCode() {
    var userEmail = $("#userEmail").val();
    $.post("../../library/common/verify_email.php", { userEmail: userEmail }, function (bound) {
        if (bound === "bound") {
            var resetForm = $("#resetForm");
            $("table").remove();
            resetForm.append(
                "<table border='1'><tr><th colspan='2'>验证邮箱</th></tr>\n" +
                "<tr><td><label for='code'>验证码：</label></td>" +
                "<td><input type='text' id='code' name='code' size='20' maxlength='5' /></td></tr>\n" +
                "<tr><td colspan='2'>" +
                "<input type='button' id='verifyCodeBtn' name='verifyCodeBtn' value='继续' />" +
                "</td></tr></table>"
            );
            $.post("../../library/common/send_code.php", { userEmail: userEmail });
        } else alert("该邮箱未被绑定");
    });
});

$("#resetForm").on("click", "#verifyCodeBtn", function verifyCode() {
    var code = $("#code").val();
    $.post("../../library/common/verify_code.php", { code: code }, function (valid) {
        if (valid === "valid") {
            var resetForm = $("#resetForm");
            $("table").remove();
            resetForm.append(
                "<table border='1'>\n<tr><th colspan='2'>重置密码</th></tr>" +
                "<tr><td><label for='userPasswd'>密码：</label></td>\n" +
                "<td><input type='password' id='userPasswd' name='userPasswd' size='20' maxlength='18' /></td></tr>\n" +
                "<tr><td colspan='2'><span id='verifyUserPasswd' style='visibility: hidden;'>请输入6~18密码</span></td></tr>\n" +
                "<tr><td><label for='retype'>重复密码：</label></td>\n" +
                "<td><input type='password' id='retype' name='retype' size='20' maxlength='18' /></td></tr>\n" +
                "<tr><td colspan='2'><span id='verifyRetype' style='visibility: hidden;'>两次密码不一致</span></td></tr>\n" +
                "<tr><td colspan='2'>" +
                "<input type='button' id='resetPasswdBtn' name='resetPasswdBtn' value='重置密码' />" +
                "</td></tr>\n</table>"
            );
        } else alert("验证码错误");
    });
});

$("#resetForm").on("focusout", "#userPasswd", function () {
    var userPasswd = $("#userPasswd").val();
    var verify = $("#verifyUserPasswd");

    if (userPasswd === "") verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");
});

$("#resetForm").on("focusout", "#retype", function () {
    var userPasswd = $("#userPasswd").val();
    var retype = $("#retype").val();
    var verify = $("#verifyRetype");

    if (retype === "" || (userPasswd != retype)) verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");
});

$("#resetForm").on("click", "#resetPasswdBtn", function resetPasswd() {
    var userPasswd = $("#userPasswd").val();
    var retype = $("#retype").val();
    if (userPasswd != "" && retype != "" && userPasswd === retype) {
        $.post("../../library/common/reset_passwd.php", { userPasswd: userPasswd }, function (status) {
            if (status != "successful") alert(status);
            else window.location.href = "../../index.html";
        });
    } else alert("请输入完整的密码信息并确保两次密码的一致性");
});