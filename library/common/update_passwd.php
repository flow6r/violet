<?php
/*更新用户邮箱的脚本*/
//获取POST请求的数据
$userID = $_POST["userID"];
$userRole = $_POST["userRole"];
$newPasswd = $_POST["newPasswd"];

//加密密码
$newPasswd = password_hash($newPasswd, PASSWORD_BCRYPT);

//引入数据库用户信息脚本
switch ($userRole) {
    case "学生":require_once("../dbuser/student.php");break;
    case "教师":require_once("../dbuser/teacher.php");break;
    case "管理员":require_once("../dbuser/admin.php");break;
}

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}

//查询数据库
$query = "UPDATE Users SET UserPasswd = ? WHERE UserID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("ss", $newPasswd, $userID);
$stmt->execute();

echo "successful";

//关闭链接
$db->close();
exit;
?>