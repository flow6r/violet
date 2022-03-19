<?php
/*处理单个设备借用申请记录的脚本*/
//获取POST请求数据
$userRole = $_POST["userRole"];
$applID = intval($_POST["applID"]);
$dspUser = $_POST["dspUser"];

//获取当前时间
$dspDate = date("Y-m-d H:i:s");

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

//处理设备借用申请
$applStat = "未通过";
$query = "SELECT * FROM Applications WHERE ApplID = ? AND ApplStat = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("is", $applID, $applStat);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->free_result();
    //获取该申请记录中的用户ID、借用起始和结束时间
    $query = "SELECT UserID, LendBegn, LendEnd FROM Applications WHERE ApplID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $applID);
    $stmt->execute();
    $stmt->bind_result($userID, $lendBegn, $lendEnd);
    $stmt->fetch();
    $stmt->free_result();
    //获取该申请记录中的设备ID
    $query = "SELECT EqptID FROM Details WHERE ApplID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $applID);
    $stmt->execute();
    $result = $stmt->get_result();
    $eqptID = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->free_result();
} else {
    echo "查询设备借用申请记录时发生错误，请联系管理员并反馈问题";
    $stmt->free_result();
    $db->close();
    exit;
}

//更新申请状态
$applStat = "已通过";
$query = "UPDATE Applications SET ApplStat = ?, DspUser = ?, DspDate = ? WHERE ApplID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("sssi", $applStat, $dspUser, $dspDate, $applID);
$stmt->execute();

//新建设备借用记录
$lendStat = "未归还";
for ($indx = 0; $indx < count($eqptID); $indx++) {
    $query = "INSERT INTO Lend VALUES(?,?,?,?,?,NULL)";
    $stmt = $db->prepare($query);
    $stmt->bind_param("sssss", $userID, $eqptID[$indx]["EqptID"], $lendBegn, $lendEnd, $lendStat);
    $stmt->execute();
}

//更新设备借用状态
$eqptStat = "已借出";
for ($indx = 0; $indx < count($eqptID); $indx++) {
    $query = "UPDATE Equipments SET EqptStat = ? WHERE EqptID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ss", $eqptStat, $eqptID[$indx]["EqptID"]);
    $stmt->execute();
}

echo "successful";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>