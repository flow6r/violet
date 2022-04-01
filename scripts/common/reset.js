$("#userEmail").on("focusout", function checkUserEmail() {
    /*需要改进，验证邮箱地址是否合法！*/
    let userEmail = $("#userEmail").val();
    let verify = $("#verifyUserEmail");

    if (userEmail === "") verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");
});

$("#sendCodeBtn").on("click", function sendCode() {
    let userEmail = $("#userEmail").val();
    if (userEmail === "") alert("请输合法的电子邮箱地址");
    else {
        $.post("../../library/common/verify_email.php", { userEmail: userEmail }, function (bound) {
            if (bound === "bound") {
                let resetForm = $("#resetForm");
                $("table").remove();
                resetForm.append(
                    "<table><tr><th>验证邮箱</th></tr>\n" +
                    "<tr></tr><tr>" +
                    "<td><input type='text' id='code' name='code' maxlength='5' placeholder='验证码'/></td></tr>\n" +
                    "<tr></tr><tr><td>" +
                    "<input type='button' id='verifyCodeBtn' name='verifyCodeBtn' value='继续' />" +
                    "</td></tr></table>"
                );
                $.post("../../library/common/send_code.php", { userEmail: userEmail });
            } else alert("该邮箱未被绑定");
        });
    }
});

$("#resetForm").on("click", "#verifyCodeBtn", function verifyCode() {
    let code = $("#code").val();
    $.post("../../library/common/verify_code.php", { code: code }, function (valid) {
        if (valid === "valid") {
            let resetForm = $("#resetForm");
            $("table").remove();
            resetForm.append(
                "<table style='text-align: center;'>\n<tr><th>重置密码</th></tr>" +
                "<tr></tr><tr>\n" +
                "<td><input type='password' id='userPasswd' name='userPasswd' maxlength='18' placeholder='新密码' /></td></tr>\n" +
                "<tr><td colspan='2'><span id='verifyUserPasswd' style='visibility: hidden;'>请输入6~18密码</span></td></tr>\n" +
                "<tr>\n" +
                "<td><input type='password' id='retype' name='retype' maxlength='18' placeholder='重复密码' /></td></tr>\n" +
                "<tr><td><span id='verifyRetype' style='visibility: hidden;'>两次密码不一致</span></td></tr>\n" +
                "<tr><td>" +
                "<input type='button' id='resetPasswdBtn' name='resetPasswdBtn' value='重置密码' />" +
                "</td></tr>\n</table>"
            );
        } else alert("验证码错误");
    });
});

$("#resetForm").on("focusout", "#userPasswd", function () {
    let userPasswd = $("#userPasswd").val();
    let verify = $("#verifyUserPasswd");

    if (userPasswd === "") verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");
});

$("#resetForm").on("focusout", "#retype", function () {
    let userPasswd = $("#userPasswd").val();
    let retype = $("#retype").val();
    let verify = $("#verifyRetype");

    if (userPasswd != retype) verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");
});

$("#resetForm").on("click", "#resetPasswdBtn", function resetPasswd() {
    let userPasswd = $("#userPasswd").val();
    let retype = $("#retype").val();
    if (userPasswd != "" && retype != "" && userPasswd === retype) {
        $.post("../../library/common/reset_passwd.php", { userPasswd: userPasswd }, function (status) {
            if (status != "successful") alert(status);
            else window.location.href = "../../index.html";
        });
    } else alert("请输入完整的密码信息并确保两次密码的一致性");
});