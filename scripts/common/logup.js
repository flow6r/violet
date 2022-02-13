function checkID() {
    var userID = document.getElementById("idBox").value;
    var tip = document.getElementById("idTipText");

    if (userID == "") {
        tip.style.visibility = "visible";
    } else {
        tip.style.visibility = "hidden";
    }
}

function checkName() {
    var name = document.getElementById("nameBox").value;
    var tip = document.getElementById("nameTipText");

    if (name == "") {
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
    var userID = document.getElementById("idBox").value;
    var name = document.getAnimations("nameBox").value;
    var passwd = document.getElementById("passwdBox").value;
    var verify = document.getElementById("verifyBox").value;

    if (userID == "" || name == "" || passwd == "" || verify == "") {
        alert ("请将学号、姓名、密码信息补充完整");
        return false;
    }
}