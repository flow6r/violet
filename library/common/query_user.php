<?php
/*根据用户ID查询用户信息的脚本*/
//获取GET请求的数据
$userRole = $_GET["userRole"];
$userID = $_GET["userID"];

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
$query = "SELECT * FROM Users WHERE UserID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $userID);
$stmt->execute();

//将查询结果保存为JSON数据格式
$result = $stmt->get_result();
$user = $result->fetch_all(MYSQLI_ASSOC);
$userJSON = json_encode($user, JSON_UNESCAPED_UNICODE);

// 将JSON写入文件
// file_put_contents("user.json", $userJSON);

//将查询结果返回给浏览器
echo $userJSON;

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>