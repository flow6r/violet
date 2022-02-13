function checkCode() {
    var code = document.getElementById("codeBox").value;
    var tip = document.getElementById("codeTipText");

    if (code == "") {
        tip.style.visibility = "visible";
    } else {
        tip.style.visibility = "hidden";
    }
}

function checkPasswd() {
    var passwd = document.getElementById("passwdBox").value;
    var tip = document.getElementById("passwdTipText");
    if (passwd == "" || passwd.length < 6) {
        tip.style.visibility = "visible";
    } else {
        tip.style.visibility = "hidden";
    }
}

function checkVerify() {
    var passwd = document.getElementById("passwdBox").value;
    var verify = document.getElementById("verifyBox").value;
    var tip = document.getElementById("verifyTipText");

    if (passwd === verify) {
        tip.style.visibility = "hidden";
    } else {
        tip.style.visibility = "visible";
    }
}

function checkForm() {
    var code = document.getAnimations("codeBox").value;
    var passwd = document.getElementById("passwdBox").value;
    var verify = document.getElementById("verifyBox").value;

    if (code == "" || passwd == "" || verify == "") {
        alert ("请将验证码和密码信息补充完整");
        return false;
    }
}