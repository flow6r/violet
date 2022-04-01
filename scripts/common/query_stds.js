var stdUsersInfo = null;
var stdUserLimit = 16;
var stdTotPages = null;
var stdCurrPage = null;
var stdUserIDs = new Array();
var stdUserIDsIndx = 0;
var currStdUserIndx = null;

//查询学生用户记录
$("#content").on("click", "#queryStdUsersBtn", function () {
    let searchItem = $("#content").find("#stdUserRecsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#stdUserRecsDiv").find("#searchType").val();

    if (searchItem != "") {
        $("#content").find("#stdUserRecsHead").siblings().remove();
        queryStdUsers(userInfo.userRole, userInfo.mjrName, userInfo.colgName, "std", searchItem, searchType);
    } else alert("请输入关键词");
});

//实现查询用户信息的函数
function queryStdUsers(userRole, mjrName, colgName, trgtRole, searchItem, searchType) {
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
            "<td>" + stdUsersInfo[begnPage].UserName + "</td><td>" + stdUsersInfo[begnPage].UserGen +
            "</td><td><a href='mailto:" + stdUsersInfo[begnPage].UserEmail + "'>" + stdUsersInfo[begnPage].UserEmail + "</a></td>" +
            "<td><a class='stdUserDetl' name='" + stdUsersInfo[begnPage].UserID + "' href='#'>详情</a></td>" +
            "<td><input type='button' id='reset" + stdUsersInfo[begnPage].UserID + "' name='" + stdUsersInfo[begnPage].UserID + "' class='updtStdPasswdBtn' value='更新密码' />" +
            "<input type='button' id='del" + stdUsersInfo[begnPage].UserID + "' name='" + stdUsersInfo[begnPage].UserID + "' class='delStdUserBtn' value='删除' /></td></tr>"
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

//获取选中的用户ID
$("#content").on("click", ".stdCheckbox", function (event) {
    let currUserID = $(event.target).val();

    if ($(event.target).attr("checked")) {
        $(event.target).removeAttr("checked");
        let currUserIdIndx = stdUserIDs.indexOf(currUserID);
        stdUserIDs.splice(currUserIdIndx, 1);
        stdUserIDsIndx--;
    } else {
        $(event.target).attr("checked", "ture");
        stdUserIDs[stdUserIDsIndx++] = currUserID;
    }
});

//新增学生用户记录
$("#content").on("click", "#addNewStdUserBtn", function () {
    if (userInfo.userRole === "教师") tchAddNewStd();
    else adminAddNewStd();
});

//打印新增学生用户记录的弹窗
function tchAddNewStd() {
    $("#mask").attr("style", "visibility: visible;");

    $("body").append(
        "<div id='tchAddNewStdDiv' name='tchAddNewStdDiv' class='popup'><form id='tchAddNewStdForm' name='tchAddNewStdForm'>" +
        "<table id='tchAddNewStdTbl' name='tchAddNewStdTbl'><tr><th colspan='2'><span>创建学生用户</span></th></tr>" +
        "<tr><td><label>学生ID</label></td><td><input type='text' id='newStdID' name='newStdID' maxlength='15' /></td></tr>" +
        "<tr><td><label>学生姓名</label></td><td><input type='text' id='newStdName' name='newStdName' maxlength='10' /></td></tr>" +
        "<tr><td><label>学生性别</label></td><td><select id='newStdGen' name='newStdGen'></select></td></tr>" +
        "<tr><td><label>电子邮箱</label></td><td><input type='text' id='newStdEmail' name='newStdEmail' maxlength='50' /></td></tr>" +
        "<tr><td><label>入学年份</label></td><td><select id='newStdAdms' name='newStdAdms'></select></td></tr>" +
        "<tr><td><input type='button' class='stdCancelBtn' value='取消' /></td>" +
        "<td><input type='button' id='tchAddNewStdBtn' name='tchAddNewStdBtn' value='创建' /></td></tr></table></form></div>"
    );
}

function adminAddNewStd() {
    $("#mask").attr("style", "visibility: visible;");

    $("body").append(
        "<div id='adminAddNewStdDiv' name='adminAddNewStdDiv' class='popup'><form id='adminAddNewStdForm' name='adminAddNewStdForm'>" +
        "<table id='adminAddNewStdTbl' name='adminAddNewStdTbl'><tr><th colspan='2'><span>创建学生用户</span></th></tr>" +
        "<tr><td><label>学生ID</label></td><td><input type='text' id='newStdID' name='newStdID' maxlength='15' /></td></tr>" +
        "<tr><td><label>学生姓名</label></td><td><input type='text' id='newStdName' name='newStdName' maxlength='10' /></td></tr>" +
        "<tr><td><label>学生性别</label></td><td><select id='newStdGen' name='newStdGen'></select></td></tr>" +
        "<tr><td><label>电子邮箱</label></td><td><input type='text' id='newStdEmail' name='newStdEmail' maxlength='50' /></td></tr>" +
        "<tr><td><label>入学年份</label></td><td><select id='newStdAdms' name='newStdAdms'></select></td></tr>" +
        "<tr><td><label>所在专业</label></td><td><select id='newStdMjr' name='newStdMjr'></select></td></tr>" +
        "<tr><td><input type='button' class='stdCancelBtn' value='取消' /></td>" +
        "<td><input type='button' id='adminAddNewStdBtn' name='adminAddNewStdBtn' value='创建' /></td></tr></table></form></div>"
    );
}

//性别选择
$("body").on("focusin", "#newStdGen", function () {
    $("body").find("#newStdGen").empty();
    $("body").find("#newStdGen").append(
        "<option value='male'>男</option>" +
        "<option value='female'>女</option>"
    );
});

//入学年份选择
$("body").on("focusin", "#newStdAdms", function () {
    $("body").find("#newStdAdms").empty();
    let currYear = new Date();
    let yyyy = Number(currYear.getFullYear());
    for (let lower = yyyy - 4; lower <= yyyy; lower++) {
        $("body").find("#newStdAdms").append("<option value='" + lower + "'>" + lower + "</option>");
    }
});

//专业选择
$("body").on("focusin", "#newStdMjr", function () {
    $.ajax({
        url: "../../library/common/query_major_by_colgname.php",
        type: "GET",
        async: false,
        data: { userRole: userInfo.userRole, colgName: userInfo.colgName },
        dataType: "json",
        success: function (mjrJSON) {
            $("body").find("#newStdMjr").empty();
            for (let indx = 0; indx < mjrJSON.length; indx++) {
                $("body").find("#newStdMjr").append("<option value='" + mjrJSON[indx].MjrName + "'>" + mjrJSON[indx].MjrName + "</option>");
            }
        }
    });
});

//实现新增学生用户记录
$("body").on("click", "#tchAddNewStdBtn", function () {
    let newStdID = $("body").find("#newStdID").val();
    let newStdName = $("body").find("#newStdName").val();
    let newStdGen = $("body").find("#newStdGen").val();
    let newStdEmail = $("body").find("#newStdEmail").val();
    let newStdAdms = $("body").find("#newStdAdms").val();

    if (newStdID != "" && newStdName != "" && newStdGen != "" &&
        newStdEmail != "" && newStdAdms != "") {
        $.ajax({
            url: "../../library/common/add_std.php",
            type: "POST",
            async: false,
            data: {
                procRole: userInfo.userRole, userID: newStdID, userName: newStdName,
                userGen: newStdGen, userEmail: newStdEmail, userAdms: newStdAdms,
                colgName: userInfo.colgName, mjrName: userInfo.mjrName
            },
            success: function (status) {
                if (status === "successful") {
                    alert("成功新增ID为" + newStdID + "的学生用户记录");

                    ReQueryStdUser();
                }
                else alert(status);
            }
        });
    } else alert("请完善学生用户信息后再执行创建操作");
});

$("body").on("click", "#adminAddNewStdBtn", function () {
    let newStdID = $("body").find("#newStdID").val();
    let newStdName = $("body").find("#newStdName").val();
    let newStdGen = $("body").find("#newStdGen").val();
    let newStdEmail = $("body").find("#newStdEmail").val();
    let newStdAdms = $("body").find("#newStdAdms").val();
    let newStdMjr = $("body").find("#newStdMjr").val();

    if (newStdID != "" && newStdName != "" && newStdGen != "" &&
        newStdEmail != "" && newStdAdms != "" && newStdMjr != "") {
        $.ajax({
            url: "../../library/common/add_std.php",
            type: "POST",
            async: false,
            data: {
                procRole: userInfo.userRole, userID: newStdID, userName: newStdName,
                userGen: newStdGen, userEmail: newStdEmail, userAdms: newStdAdms,
                colgName: userInfo.colgName, mjrName: newStdMjr
            },
            success: function (status) {
                if (status === "successful") {
                    alert("成功新增ID为" + newStdID + "的学生用户记录");

                    ReQueryStdUser();
                }
                else alert(status);
            }
        });
    } else alert("请完善学生用户信息后再执行创建操作");
});

//用户信息详情
$("#content").on("click", ".stdUserDetl", function (event) {
    let currUserID = $(event.target).attr("name");
    currStdUserIndx = stdUsersInfo.findIndex(stdUsersInfo => stdUsersInfo.UserID === currUserID);
    $("#mask").attr("style", "visibility: visible;");

    $("body").append(
        "<div id='userInfoDiv' name='userInfoDiv' class='popup'><form id='userInfoForm' name='userInfoForm'><table id='userInfoTbl' name='userInfoForm'>" +
        "<tr><td><span>用户信息</span></td><td><input type='button' id='editStdInfoBtn' name='editStdInfoBtn' value='编辑' /></td></tr>" +
        "<tr><td><label>用户ID</label></td><td><input type='text' id='userID' name='userID' value='" + stdUsersInfo[currStdUserIndx].UserID + "' placeholder='" + stdUsersInfo[currStdUserIndx].UserID + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>用户姓名</label></td><td><input type='text' id='userName' name='userName' value='" + stdUsersInfo[currStdUserIndx].UserName + "' placeholder='" + stdUsersInfo[currStdUserIndx].UserName + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>用户性别</label></td><td><select id='userGen' disabled='disabled'><option value='male'>男</option><option value='female'>女</option></select></td></tr>" +
        "<tr><td><label>用户角色</label></td><td><select id='userRole' disabled='disabled'><option value='std'>学生</option><option value='tch'>教师</option>" +
        "<option value='admin'>管理员</option></select></td></tr>" +
        "<tr><td><label>电子邮箱</label></td><td><input type='text' id='userEmail' name='userEmail' value='" + stdUsersInfo[currStdUserIndx].UserEmail + "' placeholder='" + stdUsersInfo[currStdUserIndx].UserEmail + "' disabled='disabled' /></td></tr>" +
        "<tr><td><label>入学年份</label></td><td><select id='userAdms' disabled='disabled'><option>" + stdUsersInfo[currStdUserIndx].UserAdms + "</option></select></td></tr>" +
        "<tr><td><label>隶属学院</label></td><td><select id='colgName' disabled='disabled'><option>" + stdUsersInfo[currStdUserIndx].ColgName + "</option></select></td></tr>" +
        "<tr><td><label>专业名称</label></td><td><select id='mjrName' disabled='disabled'><option>" + stdUsersInfo[currStdUserIndx].MjrName + "</option></select></td></tr>" +
        "<tr><td><input type='button' id='stdUpdtCancel' name='stdUpdtCancel' class='stdCancelBtn' value='取消' /></td>" +
        "<td><input type='button' id='updateStdInfoBtn' name='" + stdUsersInfo[currStdUserIndx].UserID + "' value='更新' style='visibility: hidden;'/></td></tr></table></form></div>"
    );

    if (stdUsersInfo[currStdUserIndx].UserGen === "男") $("body").find("#userGen").find("option[value='male']").attr("selected", "selected");
    else $("body").find("#userGen").find("option[value='female']").attr("selected", "selected");

    switch (stdUsersInfo[currStdUserIndx].UserRole) {
        case "学生":
            $("body").find("#userRole").find("option[value='std']").attr("selected", "selected");
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
$("body").on("click", "#editStdInfoBtn", function () {
    $("body").find("#userInfoDiv").find("#editStdInfoBtn").attr("style", "visibility: hidden;");

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
    $("body").find("#updateStdInfoBtn").attr("style", "visibility: visible");

    let currYear = new Date();
    let yyyy = Number(currYear.getFullYear());
    for (let lower = yyyy - 4; lower <= yyyy; lower++) {
        $("body").find("#userAdms").append("<option value='" + lower + "'>" + lower + "</option>");
    }
    $("body").find("#userAdms").find("option[value='" + stdUsersInfo[currStdUserIndx].UserAdms + "']").attr("selected", "selected");

    $.ajax({
        url: "../../library/common/query_college.php",
        async: false,
        dataType: "json",
        success: function (colgJSON) {
            for (let indx = 0; indx < colgJSON.length; indx++) {
                $("body").find("#colgName").append("<option value='" + colgJSON[indx].ColgAbrv + "'>" + colgJSON[indx].ColgName + "</option>");
                if (colgJSON[indx].ColgName === stdUsersInfo[currStdUserIndx].ColgName) {
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
                if (mjrJSON[indx].MjrName === stdUsersInfo[currStdUserIndx].MjrName)
                    $("body").find("#mjrName").find("option[value='" + mjrJSON[indx].MjrAbrv + "']").attr("selected", "selected");
            }
        }
    });
});

//更新用户信息
$("body").on("click", "#updateStdInfoBtn", function () {
    let oldUserID = $("body").find("#updateStdInfoBtn").attr("name");
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

            ReQueryStdUser();
        }
    });
});

//批量导入学生用户
$("#content").on("click", "#importStdUsersBtn", function () {
    $("#mask").attr("style", "visibility: visible;");

    $("body").append(
        "<div id='importStdUsersDiv' name='importStdUsersDiv' class='popup'>" +
        "<form id='importStdUsersForm' name='importStdUsersForm' enctype='multipart/form-data' action='../../library/common/import_stds.php' method='post' target='doNotRefresh' onsubmit='return checkImpStdFile()'>" +
        "<table id='importStdUsersTbl' name='importStdUsersTbl'><tr><th colspan='2'><span>批量导入学生信息</span></th></tr>" +
        "<tr><th colspan='2'><a href='http://localhost/data/tmpl/StdUserInfoTmpl.xlsx'>点击我下载模板文件</a></th></tr>" +
        "<tr><td><label>学生信息文件</label></td><td><input type='file' id='newStdUsersInfoFile' name='newStdUsersInfoFile' /></td></tr>" +
        "<tr><td><input type='button' class='stdCancelBtn' value='取消' /></td>" +
        "<td><input type='submit' name='' class='imptStdUsers' value='导入' /></td>" +
        "</tr></table></form><iframe id='doNotRefresh' name='doNotRefresh' title='doNotRefresh' style='display: none;'></iframe></div>"
    );
});

//检查模板文件
function checkImpStdFile() {
    let theFile = $("body").find("#newStdUsersInfoFile").val();
    if (theFile === "") {
        alert("请选择待上传的学生信息文件再执行上传操作");
        return false;
    }
}

//更新用户密码
$("#content").on("click", ".updtStdPasswdBtn", function (event) {
    let currUserID = $(event.target).attr("name");

    $("#mask").attr("style", "visibility: visible;");

    $("body").append(
        "<div id='updtUserPasswdDiv' name='updtUserPasswdDiv' class='popup'><form id='updtUserPasswdForm' name='updtUserPasswdForm'>" +
        "<table id='updtUserPasswdTbl' name='updtUserPasswdTbl'><tr><th colspan='2'><span>更新用户密码</span></th></tr>" +
        "<tr><td><label>新密码</label></td><td><input type='password' id='newStdPasswd' name='newStdPasswd' /></td></tr>" +
        "<tr><td><label>重复密码</label></td><td><input type='password' id='reEnterStdPasswd' name='reEnterStdPasswd' /></td></tr>" +
        "<tr><td><input type='button' class='stdCancelBtn' value='取消' />" +
        "</td><td><input type='button' id='updtStdPasswd' name='" + currUserID + "' class='updtStdPasswd' value='更新' /></td></tr>" +
        "</table></form></div>"
    );
});

//检查密码
$("body").on("focusout", "#newStdPasswd", function (event) {
    if ($(event.target).val() === "")
        $("body").find("#newStdPasswd").attr("placeholder", "请输入新密码");
});

//检查重复的密码
$("body").on("focusout", "#reEnterStdPasswd", function (event) {
    if ($(event.target).val() === "")
        $("body").find("#reEnterStdPasswd").attr("placeholder", "两次密码不一致");
});

//实现更新学生用户密码
$("body").on("click", "#updtStdPasswd", function (event) {
    let currUserID = $(event.target).attr("name");
    let newPasswd = $("body").find("#newStdPasswd").val();
    let reEnterPasswd = $("body").find("#reEnterStdPasswd").val();

    if (newPasswd === reEnterPasswd && newPasswd != "" && reEnterPasswd != "" && newPasswd.length >= 6 && newPasswd.length <= 18) {
        $.ajax({
            url: "../../library/common/update_userpasswd.php",
            type: "POST",
            async: false,
            data: { userRole: userInfo.userRole, userID: currUserID, userPasswd: newPasswd },
            success: function (status) {
                if (status === "successful") alert("成功更新ID为" + currUserID + "的用户的密码");
                else alert(status);

                ReQueryStdUser();
            }
        })
    } else if (newPasswd === "" || reEnterPasswd === "") alert("确保密码信息的完整性");
    else if (newPasswd != reEnterPasswd) alert("两次密码不一致");
    else alert("密码长度为6~18位");
});

//删除单个用户
$("#content").on("click", ".delStdUserBtn", function (event) {
    let currUserID = $(event.target).attr("name");

    $.ajax({
        url: "../../library/common/delete_user.php",
        type: "POST",
        async: false,
        data: { userRole: userInfo.userRole, userID: currUserID },
        success: function (status) {
            if (status === "successful") alert("成功删除ID为" + currUserID + "的用户");
            else alert(status);

            ReQueryStdUser();
        }
    });
});

//批量删除用户
$("#content").on("click", "#deleteStdUsersBtn", function () {
    if (stdUserIDs.length != 0) {
        $.ajax({
            url: "../../library/common/delete_users.php",
            type: "POST",
            async: false,
            data: { userRole: userInfo.userRole, userIDs: stdUserIDs },
            success: function (status) {
                if (status === "successful") alert("成功删除" + stdUserIDs.length + "条用户记录");
                else alert(status);

                ReQueryStdUser();
            }
        });
    } else alert("您选择了0条用户记录，请选择至少一条记录后再执行批量删除操作");
});

//关闭弹窗
$("body").on("click", ".stdCancelBtn", function () {
    ReQueryStdUser();
});

//实现关闭弹窗后执行重新查询的函数
function ReQueryStdUser() {
    $("#mask").attr("style", "visibility: hidden;");

    $(".popup").remove();

    let searchItem = $("#content").find("#stdUserRecsDiv").find("#searchItem").val();
    let searchType = $("#content").find("#stdUserRecsDiv").find("#searchType").val();

    $("#content").find("#stdUserRecsHead").siblings().remove();

    if (searchItem === "") {
        searchItem = "";
        searchType = "userID";
    }

    queryStdUsers(userInfo.userRole, userInfo.mjrName, userInfo.colgName, "std", searchItem, searchType);
}