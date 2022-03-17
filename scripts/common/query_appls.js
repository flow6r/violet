var appls = null;
var applsRecLimit = 16;
var applsTotPages = null;
var applsCurrPage = null;
var applDetl = null;

$("#content").on("click", "#queryUnrvwApplsBtn", function () {

    let searchItem = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchItem").val();
    let searchType = $("#content").find("#queryApplsDiv").find("#queryApplsForm").find("#queryApplsMenuTbl").find("#searchType").val();

    if (searchItem != "") {
        $("#content").find("#applRsltsTblHead").siblings().remove();
        queryAppls(userInfo.userRole, searchItem, searchType);
    } else alert("请输入关键词");
});

function queryAppls(userRole, searchItem, searchType) {
    $.ajax({
        url: "../../library/common/query_appls.php",
        type: "GET",
        async: false,
        data: { userRole: userRole, searchItem: searchItem, searchType: searchType },
        dataType: "json",
        success: function (applsJSON) {
            appls = applsJSON;

            if (appls.length === 0) {
                alert("共0条记录");
                $("#content").find("#applsPrevPage").attr("disabled", "disabled");
                $("#content").find("#applsPageInfo").val("第0页，共0页");
                $("#content").find("#applsNextPage").attr("disabled", "disabled");
                $("#content").find("#applsTrgtPage").attr("disabled", "disabled");
                $("#content").find("#applsJump").attr("disabled", "disabled");
            } else {
                if (appls.length < applsRecLimit) {
                    applsTotPages = 1;
                    applsCurrPage = 1;
                } else {
                    applsTotPages = parseInt(appls.length / applsRecLimit);
                    if (appls.length % applsRecLimit) applsTotPages++;
                    applsCurrPage = 1;
                }

                echoApplsRecords(applsCurrPage);
            }
        }
    });
}

function echoApplsRecords(page) {
    applsCurrPage = page;

    if (applsCurrPage === 1) $("#content").find("#applsPrevPage").attr("disabled", "disabled");
    else $("#content").find("#applsPrevPage").removeAttr("disabled");

    if (applsCurrPage === applsTotPages) $("#content").find("#applsNextPage").attr("disabled", "disabled");
    else $("#content").find("#applsNextPage").removeAttr("disabled");

    $("#content").find("#applRsltsTblHead").siblings().remove();

    let begnPage = (applsCurrPage - 1) * applsRecLimit;
    let endPage = (applsCurrPage * applsRecLimit) - 1;

    for (; begnPage <= endPage && begnPage < appls.length; begnPage++) {
        $("#content").find("#applRsltsTbl").append(
            "<tr><td><input type='checkbox' name='applCheckbox' class='applCheckbox' value='" + appls[begnPage].ApplID + "' /></td>" +
            "<td>" + appls[begnPage].ApplID + "</td>" +
            "<td>" + appls[begnPage].UserID + "</td>" +
            "<td><a name='" + appls[begnPage].ApplID + "' href='#'>详情</a></td>" +
            "<td>" + appls[begnPage].ApplStat + "</td>" +
            "<td><input type='button' id='procApplBtn' name='procApplBtn' value='处理' /></td></tr>"
        );
    }

    $("#content").find("#applsPageInfo").val("第" + applsCurrPage + "页，共" + applsTotPages + "页");
}

//上一页
$("#content").on("click", "#applsPrevPage", function () {
    let trgtPage = currPage - 1;
    echoApplsRecords(trgtPage);
});

//下一页
$("#content").on("click", "#applsNextPage", function () {
    let trgtPage = currPage + 1;
    echoApplsRecords(trgtPage);
});

//跳转
$("#content").on("click", "#applsJump", function () {
    let trgtPage = $("#content").find("#applsTrgtPage").val();
    trgtPage = parseInt(trgtPage);

    $("#content").find("#applsTrgtPage").val("");

    if (trgtPage < 1 || trgtPage > applsTotPages) alert("请输入合法的页数");
    else echoApplsRecords(trgtPage);
});

//显示详情