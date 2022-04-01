var tchUsersInfo = null;
var tchUserLimit = 16;
var tchTotPages = null;
var tchCurrPage = null;
var tchUserIDs = new Array();
var tchUserIDsIndx = 0;
var currTchUserIndx = null;

//查询教师用户记录
$("#content").on("click", "#queryTchUsersBtn", function () {
    let searchItem = $("#content").find("#tchUserRecsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#tchUserRecsDiv").find("#searchType").val();

    if (searchItem != "") {
        $("#content").find("#tchUserRecsHead").siblings().remove();
        queryTchUsers(userInfo.userRole, userInfo.mjrName, userInfo.colgName, "tch", searchItem, searchType);
    } else alert("请输入关键词");
});

//实现查询用户信息的函数
function queryTchUsers(userRole, mjrName, colgName, trgtRole, searchItem, searchType) {
    $.ajax({
        url: "../../library/common/query_users.php",
        type: "GET",
        async: false,
        data: { userRole: userRole, mjrName: mjrName, colgName: colgName, trgtRole: trgtRole, searchItem: searchItem, searchType: searchType },
        dataType: "json",
        success: function (usersJSON) {
            tchUsersInfo = usersJSON;

            if (tchUsersInfo.length === 0) {
                alert("共0条教师用户记录");

                $("#content").find("#tchPrevPage").attr("disabled", "disabled");
                $("#content").find("#tchUserPagesInfo").val("第0页，共0页");
                $("#content").find("#tchNextPage").attr("disabled", "disabled");
                $("#content").find("#tchTrgtPage").attr("disabled", "disabled");
                $("#content").find("#tchJumpToTrgtPage").attr("disabled", "disabled");
            } else {
                if (tchUsersInfo.length < tchUserLimit) {
                    tchTotPages = 1;
                    tchCurrPage = 1;

                    $("#content").find("#tchTrgtPage").attr("disabled", "disabled");
                    $("#content").find("#tchJumpToTrgtPage").attr("disabled", "disabled");
                } else {
                    tchTotPages = parseInt(tchUsersInfo.length / tchUserLimit);
                    if (tchUsersInfo.length % tchUserLimit) tchTotPages++;
                    tchCurrPage = 1;
                }

                echoTchUsers(tchCurrPage);
            }
        }
    });
}

function echoTchUsers(page) {
    tchUserIDs = new Array();
    tchUserIDsIndx = 0;
    tchCurrPage = page;

    if (tchCurrPage === 1) $("#content").find("#tchPrevPage").attr("disabled", "disabled");
    else $("#content").find("#tchPrevPage").removeAttr("disabled");

    if (tchCurrPage === tchTotPages) $("#content").find("#tchNextPage").attr("disabled", "disabled");
    else $("#content").find("#tchNextPage").removeAttr("disabled");

    $("#content").find("#tchUserRecsHead").siblings().remove();

    let begnPage = (tchCurrPage - 1) * tchUserLimit;
    let endPage = (tchCurrPage * tchUserLimit) - 1;

    for (; begnPage <= endPage && begnPage < tchUsersInfo.length; begnPage++) {
        $("#content").find("#tchUserRecsTbl").append(
            "<tr><td><input type='checkbox' name='tchCheckbox' class='tchCheckbox' value='" + tchUsersInfo[begnPage].UserID + "' /></td>" +
            "<td>" + tchUsersInfo[begnPage].UserID + "</td>" +
            "<td>" + tchUsersInfo[begnPage].UserName + "</td><td>" + tchUsersInfo[begnPage].UserGen +
            "</td><td><a href='mailto:" + tchUsersInfo[begnPage].UserEmail + "'>" + tchUsersInfo[begnPage].UserEmail + "</a></td>" +
            "<td><a class='tchUserDetl' name='" + tchUsersInfo[begnPage].UserID + "' href='#'>详情</a></td>" +
            "<td><input type='button' id='reset" + tchUsersInfo[begnPage].UserID + "' name='" + tchUsersInfo[begnPage].UserID + "' class='updtTchPasswdBtn' value='更新密码' />" +
            "<input type='button' id='del" + tchUsersInfo[begnPage].UserID + "' name='" + tchUsersInfo[begnPage].UserID + "' class='delTchUserBtn' value='删除' /></td></tr>"
        );
    }

    $("#content").find("#tchUserPagesInfo").val("第" + tchCurrPage + "页，共" + tchTotPages + "页");
}

//上一页
$("#content").on("click", "#tchPrevPage", function () {
    let trgtPage = tchCurrPage - 1;
    echoTchUsers(trgtPage);
});

//下一页
$("#content").on("click", "#tchNextPage", function () {
    let trgtPage = tchCurrPage + 1;
    echoTchUsers(trgtPage);
});

//跳转
$("#content").on("click", "#tchJumpToTrgtPage", function () {
    let trgtPage = $("#content").find("#tchTrgtPage").val();
    trgtPage = parseInt(trgtPage);

    $("#content").find("#tchTrgtPage").val("");

    if (trgtPage < 1 || trgtPage > tchTotPages) alert("请输入合法的页数");
    else echoTchUsers(trgtPage);
});

//获取选中的用户ID
$("#content").on("click", ".tchCheckbox", function (event) {
    let currUserID = $(event.target).val();

    if ($(event.target).attr("checked")) {
        $(event.target).removeAttr("checked");
        let currUserIdIndx = tchUserIDs.indexOf(currUserID);
        tchUserIDs.splice(currUserIdIndx, 1);
        tchUserIDsIndx--;
    } else {
        $(event.target).attr("checked", "ture");
        tchUserIDs[tchUserIDsIndx++] = currUserID;
    }
});

//新增教师用户记录
$("body").on("click", "#addNewTchUserBtn", function () {
    $("#mask").attr("style", "visibility: visible;");

    $("body").append(
        "<div id='adminAddNewTchDiv' name='adminAddNewTchDiv' class='popup'><form id='adminAddNewTchForm' name='adminAddNewTchForm'>" +
        "<table id='adminAddNewTchTbl' name='adminAddNewTchTbl'><tr><th colspan='2'><span>创建教师用户</span></th></tr>" +
        "<tr><td><label>教师ID</label></td><td><input type='text' id='newTchID' name='newTchID' maxlength='15' /></td></tr>" +
        "<tr><td><label>教师姓名</label></td><td><input type='text' id='newTchName' name='newTchName' maxlength='10' /></td></tr>" +
        "<tr><td><label>教师性别</label></td><td><select id='newTchGen' name='newTchGen'></select></td></tr>" +
        "<tr><td><label>电子邮箱</label></td><td><input type='text' id='newTchEmail' name='newTchEmail' maxlength='50' /></td></tr>" +
        "<tr><td><label>所在专业</label></td><td><select id='newTchMjr' name='newTchMjr'></select></td></tr>" +
        "<tr><td><input type='button' class='tchCancelBtn' value='取消' /></td>" +
        "<td><input type='button' id='adminAddNewTchBtn' name='adminAddNewTchBtn' value='创建' /></td></tr></table></form></div>"
    );
});

//教师性别选择
$("body").on("focusin", "#newTchGen", function () {
    $("body").find("#newTchGen").empty();
    $("body").find("#newTchGen").append(
        "<option value='male'>男</option>" +
        "<option value='female'>女</option>"
    );
});

//所在专业选择
$("body").on("focusin", "#newTchMjr", function () {
    $.ajax({
        url: "../../library/common/query_major_by_colgname.php",
        type: "GET",
        async: false,
        data: { userRole: userInfo.userRole, colgName: userInfo.colgName },
        dataType: "json",
        success: function (mjrJSON) {
            $("body").find("#newTchMjr").empty();
            for (let indx = 0; indx < mjrJSON.length; indx++) {
                $("body").find("#newTchMjr").append("<option value='" + mjrJSON[indx].MjrName + "'>" + mjrJSON[indx].MjrName + "</option>");
            }
        }
    });
});

//实现新增教师用户记录
$("body").on("click", "#adminAddNewTchBtn", function () {
    let newTchID = $("body").find("#newTchID").val();
    let newTchName = $("body").find("#newTchName").val();
    let newTchGen = $("body").find("#newTchGen").val();
    let newTchEmail = $("body").find("#newTchEmail").val();
    let newTchMjr = $("body").find("#newTchMjr").val();

    if (newTchID != "" && newTchName != "" && newTchGen != "" &&
        newTchEmail != "" && newTchMjr != "") {
        $.ajax({
            url: "../../library/common/add_tch.php",
            type: "POST",
            async: false,
            data: {
                procRole: userInfo.userRole,
                userID: newTchID, userName: newTchName,
                userGen: newTchGen, userEmail: newTchEmail,
                colgName: userInfo.colgName, mjrName: newTchMjr
            },
            success: function (status) {
                if (status === "successful") {
                    alert("成功新增ID为" + newTchID + "的教师用户记录");

                    ReQueryTchUser();
                }
                else alert(status);
            }
        });
    } else alert("请完善教师用户信息后再执行创建操作");
});

//用户信息详情
$("#content").on("click", ".tchUserDetl", function (event) {
    let currUserID = $(event.target).attr("name");
    currTchUserIndx = tchUsersInfo.findIndex(tchUsersInfo => tchUsersInfo.UserID === currUserID);
    $("#mask").attr("style", "visibility: visible;");

    $("body").append(
        "<div id='userInfoDiv' name='userInfoDiv' class='popup'><form id='userInfoForm' name='userInfoForm'><table id='userInfoTbl' name='userInfoForm'>" +
        "<tr><td><span>用户信息</span></td><td><input type='button' id='editTchInfoBtn' name='editTchInfoBtn' value='编辑' /></td></tr>" +
        "<tr><td><label>用户ID</label></td><td><input type='text' id='userID' name='userID' value='" + tchUsersInfo[currTchUserIndx].UserID + "' placeholder='" + tchUsersInfo[currTchUserIndx].UserID + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>用户姓名</label></td><td><input type='text' id='userName' name='userName' value='" + tchUsersInfo[currTchUserIndx].UserName + "' placeholder='" + tchUsersInfo[currTchUserIndx].UserName + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>用户性别</label></td><td><select id='userGen' disabled='disabled'><option value='male'>男</option><option value='female'>女</option></select></td></tr>" +
        "<tr><td><label>用户角色</label></td><td><select id='userRole' disabled='disabled'><option value='tch'>学生</option><option value='tch'>教师</option>" +
        "<option value='admin'>管理员</option></select></td></tr>" +
        "<tr><td><label>电子邮箱</label></td><td><input type='text' id='userEmail' name='userEmail' value='" + tchUsersInfo[currTchUserIndx].UserEmail + "' placeholder='" + tchUsersInfo[currTchUserIndx].UserEmail + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>入学年份</label></td><td><select id='userAdms' disabled='disabled'><option>" + tchUsersInfo[currTchUserIndx].UserAdms + "</option></select></td></tr>" +
        "<tr><td><label>隶属学院</label></td><td><select id='colgName' disabled='disabled'><option>" + tchUsersInfo[currTchUserIndx].ColgName + "</option></select></td></tr>" +
        "<tr><td><label>所在专业</label></td><td><select id='mjrName' disabled='disabled'><option>" + tchUsersInfo[currTchUserIndx].MjrName + "</option></select></td></tr>" +
        "<tr><td><input type='button' id='tchUpdtCancel' name='tchUpdtCancel' class='tchCancelBtn' value='取消' /></td>" +
        "<td><input type='button' id='updateTchInfoBtn' name='" + tchUsersInfo[currTchUserIndx].UserID + "' value='更新' style='visibility: hidden;'/></td></tr></table></form></div>"
    );

    if (tchUsersInfo[currTchUserIndx].UserGen === "男") $("body").find("#userGen").find("option[value='male']").attr("selected", "selected");
    else $("body").find("#userGen").find("option[value='female']").attr("selected", "selected");

    switch (tchUsersInfo[currTchUserIndx].UserRole) {
        case "学生":
            $("body").find("#userRole").find("option[value='tch']").attr("selected", "selected");
            break;
        case "教师":
            $("body").find("#userRole").find("option[value='tch']").attr("selected", "selected");
            break;
        case "管理员":
            $("body").find("#userRole").find("option[value='admin']").attr("selected", "selected");
            break;
    }
});

//编辑用户信息
$("body").on("click", "#editTchInfoBtn", function () {
    $("body").find("#userInfoDiv").find("#editTchInfoBtn").attr("style", "visibility: hidden;");

    let currUserColgAbrv = null;

    $("body").find("#userID").removeAttr("disabled");
    $("body").find("#userName").removeAttr("disabled");
    $("body").find("#userGen").removeAttr("disabled");
    $("body").find("#userRole").removeAttr("disabled");
    $("body").find("#userEmail").removeAttr("disabled");
    $("body").find("#userAdms").removeAttr("disabled");
    $("body").find("#userAdms").empty();
    $("body").find("#colgName").removeAttr("disabled");
    $("body").find("#colgName").empty();
    $("body").find("#mjrName").removeAttr("disabled");
    $("body").find("#mjrName").empty();
    $("body").find("#updateTchInfoBtn").attr("style", "visibility: visible");

    let currYear = new Date();
    let yyyy = Number(currYear.getFullYear());
    for (let lower = yyyy - 4; lower <= yyyy; lower++) {
        $("body").find("#userAdms").append("<option value='" + lower + "'>" + lower + "</option>");
    }
    $("body").find("#userAdms").find("option[value='" + tchUsersInfo[currTchUserIndx].UserAdms + "']").attr("selected", "selected");

    $.ajax({
        url: "../../library/common/query_college.php",
        async: false,
        dataType: "json",
        success: function (colgJSON) {
            for (let indx = 0; indx < colgJSON.length; indx++) {
                $("body").find("#colgName").append("<option value='" + colgJSON[indx].ColgAbrv + "'>" + colgJSON[indx].ColgName + "</option>");
                if (colgJSON[indx].ColgName === tchUsersInfo[currTchUserIndx].ColgName) {
                    $("body").find("#colgName").find("option[value='" + colgJSON[indx].ColgAbrv + "']").attr("selected", "selected");
                    currUserColgAbrv = colgJSON[indx].ColgAbrv;
                }
            }
        }
    });

    $.ajax({
        url: "../../library/common/query_major.php",
        type: "POST",
        async: false,
        data: { colgAbrv: currUserColgAbrv },
        dataType: "json",
        success: function (mjrJSON) {
            for (let indx = 0; indx < mjrJSON.length; indx++) {
                $("body").find("#mjrName").append("<option value='" + mjrJSON[indx].MjrAbrv + "'>" + mjrJSON[indx].MjrName + "</option>");
                if (mjrJSON[indx].MjrName === tchUsersInfo[currTchUserIndx].MjrName)
                    $("body").find("#mjrName").find("option[value='" + mjrJSON[indx].MjrAbrv + "']").attr("selected", "selected");
            }
        }
    });
});

//更新用户信息
$("body").on("click", "#updateTchInfoBtn", function () {
    let oldUserID = $("body").find("#updateTchInfoBtn").attr("name");
    let newUserID = $("body").find("#userID").val();
    let newUserName = $("body").find("#userName").val();
    let newUserGen = $("body").find("#userGen").val();
    let newUserRole = $("body").find("#userRole").val();
    let newUserEmail = $("body").find("#userEmail").val();
    let newUserAdms = $("body").find("#userAdms").val();
    let newColgAbrv = $("body").find("#colgName").val();
    let newMjrAbrv = $("body").find("#mjrName").val();

    $.ajax({
        url: "../../library/common/update_userinfo.php",
        type: "POST",
        async: false,
        data: {
            procUserRole: userInfo.userRole,
            oldUserID: oldUserID, newUserID: newUserID, userName: newUserName,
            userGen: newUserGen, userRole: newUserRole, userEmail: newUserEmail,
            userAdms: newUserAdms, colgAbrv: newColgAbrv, mjrAbrv: newMjrAbrv
        },
        success: function (status) {
            if (status === "successful") {
                alert("成功更新用户信息");
            } else alert(status)

            ReQueryTchUser();
        }
    });
});

//批量导入学生用户
$("#content").on("click", "#importTchUsersBtn", function () {
    $("#mask").attr("style", "visibility: visible;");

    $("body").append(
        "<div id='importTchUsersDiv' name='importTchUsersDiv' class='popup'>" +
        "<form id='importTchUsersForm' name='importTchUsersForm' enctype='multipart/form-data' action='../../library/common/import_tchs.php' method='post' target='doNotRefresh' onsubmit='return checkImpTchFile()'>" +
        "<table id='importTchUsersTbl' name='importTchUsersTbl'><tr><th colspan='2'><span>批量导入学生信息</span></th></tr>" +
        "<tr><th colspan='2'><a href='http://localhost/data/tmpl/TchUserInfoTmpl.xlsx'>点击我下载模板文件</a></th></tr>" +
        "<tr><td><label>学生信息文件</label></td><td><input type='file' id='newTchUsersInfoFile' name='newTchUsersInfoFile' /></td></tr>" +
        "<tr><td><input type='button' class='tchCancelBtn' value='取消' /></td>" +
        "<td><input type='submit' name='' class='imptTchUsers' value='导入' /></td>" +
        "</tr></table></form><iframe id='doNotRefresh' name='doNotRefresh' title='doNotRefresh' style='display: none;'></iframe></div>"
    );
});

//检查模板文件
function checkImpTchFile() {
    let theFile = $("body").find("#newTchUsersInfoFile").val();
    if (theFile === "") {
        alert("请选择待上传的教师信息文件再执行上传操作");
        return false;
    }
}

//更新用户密码
$("#content").on("click", ".updtTchPasswdBtn", function (event) {
    let currUserID = $(event.target).attr("name");

    $("#mask").attr("style", "visibility: visible;");

    $("body").append(
        "<div id='updtUserPasswdDiv' name='updtUserPasswdDiv' class='popup'><form id='updtUserPasswdForm' name='updtUserPasswdForm'>" +
        "<table id='updtUserPasswdTbl' name='updtUserPasswdTbl'><tr><th colspan='2'><span>更新用户密码</span></th></tr>" +
        "<tr><td><label>新密码</label></td><td><input type='password' id='newTchPasswd' name='newTchPasswd' /></td></tr>" +
        "<tr><td><label>重复密码</label></td><td><input type='password' id='reEnterTchPasswd' name='reEnterTchPasswd' /></td></tr>" +
        "<tr><td><input type='button' class='tchCancelBtn' value='取消' />" +
        "</td><td><input type='button' id='updtTchPasswd' name='" + currUserID + "' class='updtTchPasswd' value='更新' /></td></tr>" +
        "</table></form></div>"
    );
});

//检查密码
$("body").on("focusout", "#newTchPasswd", function (event) {
    if ($(event.target).val() === "")
        $("body").find("#newTchPasswd").attr("placeholder", "请输入新密码");
});

//检查重复的密码
$("body").on("focusout", "#reEnterTchPasswd", function (event) {
    if ($(event.target).val() === "")
        $("body").find("#reEnterTchPasswd").attr("placeholder", "两次密码不一致");
});

//实现更新教师用户密码
$("body").on("click", "#updtTchPasswd", function (event) {
    let currUserID = $(event.target).attr("name");
    let newPasswd = $("body").find("#newTchPasswd").val();
    let reEnterPasswd = $("body").find("#reEnterTchPasswd").val();

    if (newPasswd === reEnterPasswd && newPasswd != "" && reEnterPasswd != "" && newPasswd.length >= 6 && newPasswd.length <= 18) {
        $.ajax({
            url: "../../library/common/update_userpasswd.php",
            type: "POST",
            async: false,
            data: { userRole: userInfo.userRole, userID: currUserID, userPasswd: newPasswd },
            success: function (status) {
                if (status === "successful") alert("成功更新ID为" + currUserID + "的用户的密码");
                else alert(status);

                ReQueryTchUser();
            }
        })
    } else if (newPasswd === "" || reEnterPasswd === "") alert("确保密码信息的完整性");
    else if (newPasswd != reEnterPasswd) alert("两次密码不一致");
    else alert("密码长度为6~18位");
});

//删除单个用户
$("#content").on("click", ".delTchUserBtn", function (event) {
    let currUserID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/delete_user.php",
        type: "POST",
        async: false,
        data: { userRole: userInfo.userRole, userID: currUserID },
        success: function (status) {
            if (status === "successful") alert("成功删除ID为" + currUserID + "的用户");
            else alert(status);

            ReQueryTchUser();
        }
    });
});

//批量删除用户
$("#content").on("click", "#deleteTchUsersBtn", function () {
    if (tchUserIDs.length != 0) {
        $.ajax({
            url: "../../library/common/delete_users.php",
            type: "POST",
            async: false,
            data: { userRole: userInfo.userRole, userIDs: tchUserIDs },
            success: function (status) {
                if (status === "successful") alert("成功删除" + tchUserIDs.length + "条用户记录");
                else alert(status);

                ReQueryTchUser();
            }
        });
    } else alert("您选择了0条用户记录，请选择至少一条记录后再执行批量删除操作");
});

//关闭弹窗
$("body").on("click", ".tchCancelBtn", function () {
    ReQueryTchUser();
});

//实现关闭弹窗后执行重新查询的函数
function ReQueryTchUser() {
    $("#mask").attr("style", "visibility: hidden;");

    $(".popup").remove();

    let searchItem = $("#content").find("#tchUserRecsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#tchUserRecsDiv").find("#searchType").val();

    $("#content").find("#tchUserRecsHead").siblings().remove();

    if (searchItem === "") {
        searchItem = "";
        searchType = "userID";
    }

    queryTchUsers(userInfo.userRole, userInfo.mjrName, userInfo.colgName, "tch", searchItem, searchType);
}