<?php
/*根据学院名称查询专业名称*/
//获取GET请求的数据
$userRole = $_GET["userRole"];
$colgName = $_GET["colgName"];

//引入数据库用户信息脚本
switch ($userRole) {
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

//查询数据库
$query = "SELECT MjrAbrv, MjrName FROM Major WHERE ColgName = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $colgName);
$stmt->execute();

//将查询结果保存为JSON数据并返回给浏览器端
$result = $stmt->get_result();
$major = $result->fetch_all(MYSQLI_ASSOC);
$majorJSON = json_encode($major, JSON_UNESCAPED_UNICODE);
echo $majorJSON;

//将JSON数据写入文件
// file_put_contents("major.json", $majorJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>