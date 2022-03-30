var stdUsersInfo = null;
var stdUserLimit = 16;
var stdTotPages = null;
var stdCurrPage = null;
var stdUserIDs = new Array();
var stdUserIDsIndx = 0;

//查询学生用户记录
$("#content").on("click", "#queryStdUsersBtn", function () {
    let searchItem = $("#content").find("#stdUserRecsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#stdUserRecsDiv").find("#searchType").val();

    if (searchItem != "") {
        $("#content").find("#stdUserRecsHead").siblings().remove();
        queryUsers(userInfo.userRole, userInfo.mjrName, userInfo.colgName, "std", searchItem, searchType);
    } else alert("请输入关键词");
});

//实现查询用户信息的函数
function queryUsers(userRole, mjrName, colgName, trgtRole, searchItem, searchType) {
    $.ajax({
        url: "../../library/common/query_users.php",
        type: "GET",
        async: false,
        data: { userRole: userRole, mjrName: mjrName, colgName: colgName, trgtRole: trgtRole, searchItem: searchItem, searchType: searchType },
        dataType: "json",
        success: function (usersJSON) {
            stdUsersInfo = usersJSON;

            if (stdUsersInfo.length === 0) {
                alert("共0条学生用户记录");

                $("#content").find("#stdPrevPage").attr("disabled", "disabled");
                $("#content").find("#stdUserPagesInfo").val("第0页，共0页");
                $("#content").find("#stdNextPage").attr("disabled", "disabled");
                $("#content").find("#stdTrgtPage").attr("disabled", "disabled");
                $("#content").find("#stdJumpToTrgtPage").attr("disabled", "disabled");
            } else {
                if (stdUsersInfo.length < stdUserLimit) {
                    stdTotPages = 1;
                    stdCurrPage = 1;

                    $("#content").find("#stdTrgtPage").attr("disabled", "disabled");
                    $("#content").find("#stdJumpToTrgtPage").attr("disabled", "disabled");
                } else {
                    stdTotPages = parseInt(stdUsersInfo.length / stdUserLimit);
                    if (stdUsersInfo.length % stdUserLimit) stdTotPages++;
                    stdCurrPage = 1;
                }

                echoStdUsers(stdCurrPage);
            }
        }
    });
}

function echoStdUsers(page) {
    stdUserIDs = new Array();
    stdUserIDsIndx = 0;
    stdCurrPage = page;

    if (stdCurrPage === 1) $("#content").find("#stdPrevPage").attr("disabled", "disabled");
    else $("#content").find("#stdPrevPage").removeAttr("disabled");

    if (stdCurrPage === stdTotPages) $("#content").find("#stdNextPage").attr("disabled", "disabled");
    else $("#content").find("#stdNextPage").removeAttr("disabled");

    $("#content").find("#stdUserRecsHead").siblings().remove();

    let begnPage = (stdCurrPage - 1) * stdUserLimit;
    let endPage = (stdCurrPage * stdUserLimit) - 1;

    for (; begnPage <= endPage && begnPage < stdUsersInfo.length; begnPage++) {
        $("#content").find("#stdUserRecsTbl").append(
            "<tr><td><input type='checkbox' name='stdCheckbox' class='stdCheckbox' value='" + stdUsersInfo[begnPage].UserID + "' /></td>" +
            "<td>" + stdUsersInfo[begnPage].UserID + "</td>" +
            "<td>" + stdUsersInfo[begnPage].UserName + "</td><td>" + stdUsersInfo[begnPage].UserGen + "</td><td>" + stdUsersInfo[begnPage].UserEmail + "</td>" +
            "<td><a class='stdUserDetl' name='" + stdUsersInfo[begnPage].UserID + "' href='#'>详情</a></td>" +
            "<td><input type='button' id='del" + stdUsersInfo[begnPage].UserID + "' name='" + stdUsersInfo[begnPage].UserID + "' class='delStdUserBtn' value='删除' /></td></tr>"
        );
    }

    $("#content").find("#stdUserPagesInfo").val("第" + stdCurrPage + "页，共" + stdTotPages + "页");
}

//上一页
$("#content").on("click", "#stdPrevPage", function () {
    let trgtPage = stdCurrPage - 1;
    echoStdUsers(trgtPage);
});

//下一页
$("#content").on("click", "#stdNextPage", function () {
    let trgtPage = stdCurrPage + 1;
    echoStdUsers(trgtPage);
});

//跳转
$("#content").on("click", "#stdJumpToTrgtPage", function () {
    let trgtPage = $("#content").find("#stdTrgtPage").val();
    trgtPage = parseInt(trgtPage);

    $("#content").find("#stdTrgtPage").val("");

    if (trgtPage < 1 || trgtPage > stdTotPages) alert("请输入合法的页数");
    else echoStdUsers(trgtPage);
});

//用户信息详情
$("#content").on("click", ".stdUserDetl", function (event) {
    let currUserID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/query_user.php",
        type: "GET",
        async: false,
        data: { userRole: userInfo.userRole, userID: currUserID },
        dataType: "json",
        error: function () {
            alert("查询用户信息失败，请联系管理员并反馈问题");
        },
        success: function (userJSON) {
            $("#mask").attr("style", "visibility: visible;");

            $("body").append(
                "<div id='userInfoDiv' name='userInfoDiv' class='popup'><form id='userInfoForm' name='userInfoForm'><table id='userInfoTbl' name='userInfoForm'>" +
                "<tr><td><span>用户信息</span></td><td><input type='button' id='editUserInfoBtn' name='editUserInfoBtn' value='编辑' /></td></tr>" +
                "<tr><td><label>用户ID</label></td><td><input type='text' id='userID' name='userID' value='' placeholder='' disabled='disabled' /></td></tr>" +
                "<tr><td><label>用户姓名</label></td><td><input type='text' id='userName' name='userName' value='' placeholder='' disabled='disabled' /></td></tr>" +
                "<tr><td><label>用户性别</label></td><td><select id='userGen'><option value='male'>男</option value='female'><option>女</option></select></td></tr>" +
                "<tr><td><label>用户角色</label></td><td><select id='userRole'><option value='std'>学生</option><option value='tch'>教师</option>" +
                "<option value='admin'>管理员</option></select></td></tr>" +
                "<tr><td><label>电子邮箱</label></td><td><input type='text' id='userEmail' name='userEmail' value='' placeholder='' disabled='disabled' /></td></tr>" +
                "<tr><td><label>入学年份</label></td><td><select id='userAdms'></select></td></tr>" +
                "<tr><td><label>隶属学院</label></td><td><select id='colgAbrv'></select></td></tr>" +
                "<tr><td><label>专业名称</label></td><td><select id='mjrAbrv'></select></td></tr>" +
                "<tr><td><input type='button' id='stdUpdtCancel' name='stdUpdtCancel' class='stdCancelBtn' value='取消' /></td>" +
                "<td><input type='button' id='updateStdInfoBtn' name='updateStdInfoBtn' value='更新' /></td></tr></table></form></div>");
        }
    });
});


//关闭弹窗
$("body").on("click", ".stdCancelBtn", function () {
    $("#mask").attr("style", "visibility: hidden;");

    $(".popup").remove();

    let searchItem = $("#content").find("#stdUserRecsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#stdUserRecsDiv").find("#searchType").val();

    $("#content").find("#stdUserRecsHead").siblings().remove();

    if (searchItem === "") {
        searchItem = "";
        searchType = "userID";
    }

    queryUsers(userInfo.userRole, userInfo.mjrName, userInfo.colgName, "std", searchItem, searchType);
});