<?php
/*查询申请记录详情的脚本*/
//获取GET请求数据
$userRole = $_GET["userRole"];
$applID = intval($_GET["applID"]);

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
$query = "SELECT D.ApplID, D.EqptID, E.ImgPath FROM Equipments AS E, Details AS D WHERE E.EqptID = D.EqptID AND D.ApplID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $applID);
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$details = $result->fetch_all(MYSQLI_ASSOC);
$detailsJSON = json_encode($details, JSON_UNESCAPED_UNICODE);
echo $detailsJSON;

//将JSON写入文件
// file_put_contents("details.json", $detailsJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>