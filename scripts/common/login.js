$("#userID").on("focusout", function checkUserID() {
    var userID = $("#userID").val();
    var verify = $("#verifyUserID");

    if (userID === "") verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");

});

$("#userPasswd").on("focusout", function checkUserPasswd() {
    var userPasswd = $("#userPasswd").val();
    var verify = $("#verifyUserPasswd");

    if (userPasswd === "") verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");
});

$("#loginBtn").on("click", function checkLogin() {
    var userID = $("#userID").val();
    var userPasswd = $("#userPasswd").val();

    if (userID === "" || userPasswd === "") {
        alert("请输入完整的用户ID和密码信息");
    } else {
        $.post("../../library/common/check_login.php",
            { userID: userID, userPasswd: userPasswd },
            function (status) {
                if (status === "valid") window.location.href = "../../pages/panel.html";
                else alert(status);
            });
    }
});