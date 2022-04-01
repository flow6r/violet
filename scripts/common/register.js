$("#userID").on("focusout", function checkUserID() {
    let userID = $("#userID").val();

    if (userID === "") $("#userID").attr("placeholder", "请输入用户ID");
    else $("#userID").removeAttr("placeholder");

});

$("#userName").on("focusout", function checkUserName() {
    let userName = $("#userName").val();

    if (userName === "") $("#userName").attr("placeholder", "请输入姓名");
    else $("#userName").removeAttr("placeholder");
});

$("#userPasswd").on("focusout", function checkUserPasswd() {
    let userPasswd = $("#userPasswd").val();

    if (userPasswd === "") $("#userPasswd").attr("placeholder", "请输入6~18位密码");
    else $("#userPasswd").removeAttr("placeholder");
});

$("#retype").on("focusout", function checkRetype() {
    let userPasswd = $("#userPasswd").val();
    let retype = $("#retype").val();

    if (userPasswd != retype) $("#retype").attr("placeholder", "两次密码不一致");
    else $("#retype").removeAttr("placeholder");
});

$("#userEmail").on("focusout", function checkUserEmail() {
    /*需要改进，验证邮箱地址是否合法！*/
    let userEmail = $("#userEmail").val();

    if (userEmail === "") $("#userEmail").attr("placeholder", "请输合法的电子邮箱地址");
    else $("#userNuserEmailame").removeAttr("placeholder");
});

$("#userGen").on("focusin", function () {
    $("#userGen").empty();
    $("#userGen").append(
        "<option value='male'>男</option>" +
        "<option value='female'>女</option>"
    );
});

$("#userAdms").on("focusin", function queryYear() {
    $("#userAdms").empty();
    let userAdms = $("#userAdms");
    let currYear = new Date();
    let yyyy = Number(currYear.getFullYear());
    for (let lower = yyyy - 4; lower <= yyyy; lower++) {
        userAdms.append("<option value='" + lower + "'>" + lower + "</option>");
    }
});

$("#colgName").on("focusin", function queryMajor() {
    $("#colgName").find("option").remove();
    let colgAbrv = $("#colgName");
    colgAbrv.append("<option value='tips'>请选择您所在的学院</option>");
    $.get("../../library/common/query_college.php", function (colgJSON) {
        $.each(JSON.parse(colgJSON), function (colgIndx, colgInfo) {
            colgAbrv.append("<option value='" + colgInfo.ColgAbrv + "'>" + colgInfo.ColgName + "</option>");
        });
    });
});

$("#colgName").on("change", function queryMajor() {
    $("#mjrName").find("option").remove();
    let colgAbrv = $("#colgName").val();
    if (colgAbrv != "tips") {
        $.post("../../library/common/query_major.php", { colgAbrv: colgAbrv }, function (majorJSON) {
            let mjrName = $("#mjrName");
            $.each(JSON.parse(majorJSON), function (majorIndx, majorInfo) {
                mjrName.append(
                    "<option value='" + majorInfo.MjrAbrv + "'>" + majorInfo.MjrName + "</option>"
                );
            });
        });
    }
});

$("#createAccBtn").on("click", function createAccount() {
    let userID = $("#userID").val();
    let userName = $("#userName").val();
    let userPasswd = $("#userPasswd").val();
    let retype = $("#retype").val();
    let userGen = $("#userGen").val();
    let userEmail = $("#userEmail").val();
    let colgAbrv = $("#colgName").val();
    let userAdms = $("#userAdms").val();
    let mjrAbrv = $("#mjrName").val();
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