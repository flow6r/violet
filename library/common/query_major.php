<?php
/*查询学院以及专业信息的脚本*/
//获取POST请求的数据
$colgAbrv = $_POST["colgAbrv"];
//引入数据库用户信息脚本
require_once("../dbuser/user.php");
//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}
//查询学院信息
$query = "SELECT ColgName FROM Colleges WHERE ColgAbrv = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $colgAbrv);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($colgName);
$stmt->fetch();
//查询专业信息
$query = "SELECT MjrName, MjrAbrv FROM Major WHERE ColgName = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $colgName);
$stmt->execute();
//将查询结果保存为JSON数据并返回给浏览器端
$result = $stmt->get_result();
$major = $result->fetch_all(MYSQLI_ASSOC);
$stmt->free_result();
$db->close();
$majorJSON = json_encode($major, JSON_UNESCAPED_UNICODE);
echo $majorJSON;
exit;
?>