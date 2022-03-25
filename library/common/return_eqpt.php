<?php
/*归还单个设备的脚本*/
//获取POST请求的数据
$userID = $_POST["userID"];
$userRole = $_POST["userRole"];
$eqptID = $_POST["eqptID"];

//获取当前时间
$lendRtn = date("Y-m-d H:i:s");

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
$lendStat = "未归还";
$query = "SELECT LendBegn FROM Lend WHERE UserID = ? AND EqptID = ? AND LendStat = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("sss", $userID, $eqptID, $lendStat);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($lendBegn);
    $stmt->fetch();
    $stmt->free_result();
    $eqptStat = "未借出";
    $lendStat = "已归还";
    $query = "UPDATE Equipments E, Lend L SET E.EqptStat = ?, L.LendStat = ?, L.LendRtn = ? WHERE L.UserID = ? AND E.EqptID = L.EqptID AND L.EqptID = ? AND L.LendBegn = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ssssss", $eqptStat, $lendStat, $lendRtn, $userID, $eqptID, $lendBegn);
    $stmt->execute();
} else echo "查询设备借用状态时发生错误，请联系管理员并反馈问题";

echo "successful";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>