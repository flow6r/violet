<?php
//引入数据库用户信息脚本
require_once("../dbuser/user.php");
//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}
//查询学院信息
$query = "SELECT ColgName, ColgAbrv FROM Colleges";
$stmt = $db->prepare($query);
$stmt->execute();
//将查询结果保存为JSON数据并返回给浏览器端
$result = $stmt->get_result();
$colleges = $result->fetch_all(MYSQLI_ASSOC);
$stmt->free_result();
$db->close();
$collegesJSON = json_encode($colleges, JSON_UNESCAPED_UNICODE);
echo $collegesJSON;
?>