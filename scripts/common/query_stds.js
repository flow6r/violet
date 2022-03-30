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
            "<td><a class='stdUserID' name='" + stdUsersInfo[begnPage].UserID + "' href='#'>" + stdUsersInfo[begnPage].UserID + "</a></td>" +
            "<td>" + stdUsersInfo[begnPage].UserName + "</td><td>" + stdUsersInfo[begnPage].UserGen + "</td><td>" + stdUsersInfo[begnPage].UserEmail + "</td>" +
            "<td><a class='stdUserDetl' name='" + stdUsersInfo[begnPage].UserID + "' href='#'>详情</a></td>" +
            "<td><input type='button' id='del" + stdUsersInfo[begnPage].UserID + "' name='" + stdUsersInfo[begnPage].UserID + "' class='delStdUserBtn' value='删除' /></td></tr>"
        );
    }

    $("#content").find("#stdUserPagesInfo").val("第" + stdCurrPage + "页，共" + stdTotPages + "页");
}