<?php
/*删除单个设备借用记录的脚本*/
//获取POST请求的数据
$userID = $_POST["userID"];
$userRole = $_POST["userRole"];
$eqptID = $_POST["eqptID"];
$lendBegn = $_POST["lendBegn"];

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
$query = "SELECT LendStat FROM Lend WHERE UserID = ? AND EqptID = ? AND LendBegn = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("sss", $userID, $eqptID, $lendBegn);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->free_result();
    $stmt->bind_result($lendStat);
    $stmt->fetch();
    if ($lendStat === "未归还") echo "该设备已归还，请勿重复执行归还操作";
    else {
        $query = "DELETE FROM Lend WHERE UserID = ? AND EqptID = ? AND LendBegn = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("sss", $userID, $eqptID, $lendBegn);
        $stmt->execute();
    }
} else {
    echo "查询设备借用记录时发生错误，请联系管理员并反馈问题";
    $stmt->free_result();
    $db->close();
    exit;
}

echo "successful";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>