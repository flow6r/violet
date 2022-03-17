<?php
/*查询设备申请记录的脚本*/
//获取GET请求
$userRole = $_GET["userRole"];
$searchItem = $_GET["searchItem"];
$searchType = $_GET["searchType"];

//设置查询关键词
$searchItem = "%".$searchItem."%";

//设置查询类型和关键词
switch ($searchType) {
    case "applID":$searchType = "ApplID";break;
    case "userID":$searchType = "UserID";break;
    case "applStat":$searchType = "ApplStat";break;
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
$query = "SELECT A.* FROM Applications AS A WHERE A.".$searchType." LIKE ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $searchItem);
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$applications = $result->fetch_all(MYSQLI_ASSOC);
$applsJSON = json_encode($applications, JSON_UNESCAPED_UNICODE);
echo $applsJSON;

//将JSON写入文件
// file_put_contents("appls.json", $applsJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>