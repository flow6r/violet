<?php
/*更改用户密码的脚本*/
//启动会话
session_start();

//获取用户的邮箱
$userEmail = $_SESSION["userEmail"];
//获取POST请求的数据
$userPasswd = $_POST["userPasswd"];

//加密密码
$userPasswd = password_hash($userPasswd, PASSWORD_BCRYPT);

//引入数据库用户信息脚本
require_once("../dbuser/user.php");

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}

//查询
$query = "UPDATE Users SET UserPasswd = ? WHERE UserEmail = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("ss", $userPasswd, $userEmail);
$stmt->execute();

echo "successful";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
?>