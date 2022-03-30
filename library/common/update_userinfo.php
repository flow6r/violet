<?php
/*更新用户信息的脚本*/
//获取POST请求的数据
$procUserRole = $_POST["procUserRole"];
$oldUserID = $_POST["oldUserID"];
$newUserID = $_POST["newUserID"];
$userName = $_POST["userName"];
$userGen = $_POST["userGen"];
$userRole = $_POST["userRole"];
$userEmail = $_POST["userEmail"];
$userAdms = intval($_POST["userAdms"]);
$colgAbrv = $_POST["colgAbrv"];
$mjrAbrv = $_POST["mjrAbrv"];

//引入数据库用户信息脚本
switch ($procUserRole) {
    case "教师":
        require_once("../dbuser/teacher.php");
        break;
    case "管理员":
        require_once("../dbuser/admin.php");
        break;
}

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}

//检查用户ID是否可用
if ($oldUserID != $newUserID) {
    $query = "SELECT UserID FROM Users WHERE UserID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $newUserID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        echo "用户ID：" . $newUserID . "，已存在，请检查无误后再执行更新操作";
        $stmt->free_result();
        $db->close();
        exit;
    }
}

switch ($userRole) {
    case "std":
        $userRole = "学生";
        break;
    case "tch":
        $userRole = "教师";
        break;
    case "admin":
        $userRole = "管理员";
        break;
}

switch ($userGen) {
    case "male":
        $userGen = "男";
        break;
    case "female":
        $userGen = "女";
        break;
}

$query = "SELECT C.ColgName, M.MjrName FROM Colleges AS C, Major AS M WHERE C.ColgAbrv = ? AND M.MjrAbrv = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("ss", $colgAbrv, $mjrAbrv);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($colgName, $mjrName);
    $stmt->fetch();
    $stmt->free_result();
    $query = "UPDATE Users SET UserID = ?, UserName = ?, UserGen = ?, UserRole = ?, UserEmail = ?, UserAdms = ?, ColgName = ?, MjrName = ? WHERE UserID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("sssssisss", $newUserID, $userName, $userGen, $userRole, $userEmail, $userAdms, $colgName, $mjrName, $oldUserID);
    $stmt->execute();
} else {
    echo "查询学院以及专业信息时发生错误，请联系管理员并反馈问题";
    $stmt->free_result();
    $db->close();
    exit;
}

echo "successful";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>