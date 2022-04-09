<?php
/*查询驳回原因的脚本*/
//获取GET请求的数据
$userRole = $_GET["userRole"];
$applID = intval($_GET["applID"]);

//引入数据库用户信息脚本
switch ($userRole) {
    case "学生":
        require_once("../dbuser/student.php");
        break;
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
$query = "SELECT RjctRsn FROM Reject WHERE ApplID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $applID);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($rjctRsn);
$stmt->fetch();

echo $rjctRsn;

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>