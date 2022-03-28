<?php
/*检查邮箱是否被绑定的脚本*/
//获取POST请求的数据
$userEmail = $_POST["userEmail"];

//引入数据库用户信息脚本
require_once("../dbuser/user.php");

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}

//查询数据库
$query = "SELECT UserEmail FROM Users WHERE UserEmail = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $userEmail);
$stmt->execute();

//储存查询数据行
$stmt->store_result();
if ($stmt->num_rows()) echo "bound";
else echo "unbound";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>