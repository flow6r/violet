<?php
/*查询设备的脚本*/
//获取用户的GET请求数据
$userRole = $_GET["userRole"];
$colgName = $_GET["colgName"];
$searchItem = $_GET["searchItem"];
$searchType = $_GET["searchType"];
//设置查询关键词
$searchItem = "%".$searchItem."%";
//设置查询类型和关键词
switch ($searchType) {
    case "eqptID":$searchType = "EqptID";break;
    case "eqptName":$searchType = "EqptName";break;
    case "clsName":$searchType = "ClsName";break;
    case "eqptStat":$searchType = "EqptStat";break;
}

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
$query = "SELECT * FROM Equipments WHERE ColgName = ? AND " . $searchType . " LIKE ?";
$stmt = $db->prepare($query);
$stmt->bind_param("ss", $colgName, $searchItem);
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$equipments = $result->fetch_all(MYSQLI_ASSOC);
$equipmentsJSON = json_encode($equipments, JSON_UNESCAPED_UNICODE);
echo $equipmentsJSON;

// 将JSON写入文件
// file_put_contents("eqpts.json", $equipmentsJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>