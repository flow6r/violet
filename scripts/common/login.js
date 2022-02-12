function checkID() {
    var userID = document.getElementById("idBox").value;
    var tip = document.getElementById("idTipText");

    if (userID == "") {
        tip.style.visibility = "visible";
    } else {
        tip.style.visibility = "hidden";
    }
}

function checkPasswd() {
    var passwd = document.getElementById("passwdBox").value;
    var tip = document.getElementById("passwdTipText");

    if (passwd == "") {
        tip.style.visibility = "visible";
    } else {
        tip.style.visibility = "hidden";
    }
}

function checkForm() {
    var userID = document.getElementById("idBox").value;
    var passwd = document.getElementById("passwdBox").value;

    if (userID == "" || passwd == "") {
        alert("请请将用户ID和密码信息补充完整");
        return false;
    }
}