function checkEmail() {
    var email = document.getElementById("emailBox").value;
    var tip = document.getElementById("emailTipText");

    if (email == "") {
        tip.style.visibility = "visible";
    } else {
        tip.style.visibility = "hidden";
    }
}

function checkForm() {
    var email = document.getElementById("emailBox").value;

    if (email == "") {
        alert ("请将邮箱信息补充完整");
        return false;
    }
}