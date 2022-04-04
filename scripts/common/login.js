$("#userID").on("focusout", function checkUserID() {
    let userID = $("#userID").val();
    let verify = $("#verifyUserID");

    if (userID === "") verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");

});

$("#userPasswd").on("focusout", function checkUserPasswd() {
    let userPasswd = $("#userPasswd").val();
    let verify = $("#verifyUserPasswd");

    if (userPasswd === "") verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");
});

$("#loginBtn").on("click", function checkLogin() {
    let userID = $("#userID").val();
    let userPasswd = $("#userPasswd").val();

    if (userID === "" || userPasswd === "") {
        alert("请输入完整的用户ID和密码信息");
    } else {
        $.ajax({
            url: "../../library/common/check_login.php",
            type: "POST",
            async: false,
            data: { userID: userID, userPasswd: userPasswd },
            success: function (status) {
                if (status === "valid") window.location.href = "../../pages/panel.html";
                else alert(status);
            }
        });
    }
});