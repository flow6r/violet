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
        queryAppls(userInfo.userRole, userInfo.colgName, searchItem, searchType);
    } else alert("请输入关键词");
});

function queryAppls(userRole, colgName, searchItem, searchType) {
    $.ajax({
        url: "../../library/common/query_appls.php",
        type: "GET",
        async: false,
        data: { userRole: userRole, colgName: colgName, searchItem: searchItem, searchType: searchType },
        dataType: "json",
        success: function (applsJSON) {
            appls = applsJSON;

            if (appls.length === 0) {
                alert("共0条记录");
            } else {
                alert("共"+appls.length+"条记录");
            }
        }
    });
}