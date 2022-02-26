$("#userID").on("focusout", function checkUserID() {
    var userID = $("#userID").val();
    var verify = $("#verifyUserID");

    if (userID === "") verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");

});

$("#userName").on("focusout", function checkUserName() {
    var userName = $("#userName").val();
    var verify = $("#verifyUserName");

    if (userName === "") verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");
});

$("#userPasswd").on("focusout", function checkUserPasswd() {
    var userPasswd = $("#userPasswd").val();
    var verify = $("#verifyUserPasswd");

    if (userPasswd === "") verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");
});

$("#retype").on("focusout", function checkRetype() {
    var userPasswd = $("#userPasswd").val();
    var retype = $("#retype").val();
    var verify = $("#verifyRetype");

    if (retype === "" || (userPasswd != retype)) verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");
});

$("#userEmail").on("focusout", function checkUserEmail() {
    /*需要改进，验证邮箱地址是否合法！*/
    var userEmail = $("#userEmail").val();
    var verify = $("#verifyUserEmail");

    if (userEmail === "") verify.attr("style", "visibility: visible;");
    else verify.attr("style", "visibility: hidden;");
});

$("#userAdms").on("focusin", function queryYear() {
    $("#userAdms").empty();
    var userAdms = $("#userAdms");
    var currYear = new Date();
    var yyyy = Number(currYear.getFullYear());
    for (var lower = yyyy - 4; lower <= yyyy; lower++) {
        userAdms.append("<option value='" + lower + "'>" + lower + "</option>");
    }
});

$("#colgName").on("focusin", function queryMajor() {
    $("#colgName").find("option").remove();
    var colgAbrv = $("#colgName");
    colgAbrv.append("<option value='tips'>请选择您所在的学院</option>");
    $.get("../../library/common/query_college.php", function (colgJSON) {
        $.each(JSON.parse(colgJSON), function (colgIndx, colgInfo) {
            colgAbrv.append("<option value='" + colgInfo.ColgAbrv + "'>" + colgInfo.ColgName + "</option>");
        });
    });
});

$("#colgName").on("change", function queryMajor() {
    $("#mjrName").find("option").remove();
    var colgAbrv = $("#colgName").val();
    if (colgAbrv != "tips") {
        $.post("../../library/common/query_major.php", { colgAbrv: colgAbrv }, function (majorJSON) {
            var mjrName = $("#mjrName");
            $.each(JSON.parse(majorJSON), function (majorIndx, majorInfo) {
                mjrName.append(
                    "<option value='" + majorInfo.MjrAbrv + "'>" + majorInfo.MjrName + "</option>"
                );
            });
        });
    }
});

$("#createAccBtn").on("click", function createAccount() {
    var userID = $("#userID").val();
    var userName = $("#userName").val();
    var userPasswd = $("#userPasswd").val();
    var retype = $("#retype").val();
    var userGen = $("#userGen").val();
    var userEmail = $("#userEmail").val();
    var colgAbrv = $("#colgName").val();
    var userAdms = $("#userAdms").val();
    var mjrAbrv = $("#mjrName").val();
    if (userID != "" && userName != "" && userPasswd != "" && userPasswd === retype
        && userGen != "" && userEmail != "" && colgAbrv != "" && userAdms != "" && mjrAbrv != "") {
        $.post("../../library/common/create_account.php",
            {
                userID: userID,
                userName: userName,
                userPasswd: userPasswd,
                userGen: userGen,
                userEmail: userEmail,
                userAdms: userAdms,
                mjrAbrv: mjrAbrv,
            },
            function (status) {
                if (status != "successful") alert(status);
                else window.location.href = "../../pages/panel.html";
            });
    } else alert("请完善注册信息");
});