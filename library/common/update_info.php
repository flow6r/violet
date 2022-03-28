<?php
/*更新用户信息的脚本*/
//获取POST请求的数据
$userID = $_POST["currUserID"];
$userName = $_POST["newName"];
$userGen = $_POST["newGen"];
$userAdms = $_POST["newAdms"];
$colgAbrv = $_POST["newColg"];
$mjrAbrv = $_POST["newMjr"];
$userRole = $_POST["currUserRole"];

//设置性别
$userGen = ($userGen === "male") ? "男" : "女";
//格式化入学年份
$userAdms = intval($userAdms);

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
$query = "SELECT ColgName, MjrName FROM Major WHERE MjrAbrv = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $mjrAbrv);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($colgName, $mjrName);
    $stmt->fetch();
}
$query = "UPDATE Users SET UserName = ?, UserGen = ?, UserAdms = ?, ColgName = ?, MjrName = ? WHERE UserID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("ssisss", $userName, $userGen, $userAdms, $colgName, $mjrName, $userID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    echo "successful";
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>