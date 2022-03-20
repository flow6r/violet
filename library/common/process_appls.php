<?php
/*批量处理设备借用申请的脚本*/
//获取POST请求的数据
$userRole = $_POST["userRole"];
$appls = $_POST["appls"];
$dspUser = $_POST["dspUser"];

//获取当前时间
$dspDate = date("Y-m-d H:i:s");

//创建不可处理申请的数组
$cantProcAppls = array();
$cantProcApplsIndx = 0;

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

//检查申请状态
for ($indx = 0; $indx < count($appls); $indx++) {
    $currApplID = intval($appls[$indx]);
    $query = "SELECT ApplStat FROM Applications WHERE ApplID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $currApplID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->bind_result($currApplStat);
        $stmt->fetch();
        if ($currApplStat != "未通过") {
            $cantProcAppls[$cantProcApplsIndx][0] = $appls[$indx];
            $cantProcAppls[$cantProcApplsIndx++][1] = $currApplStat;
        }
    } else {
        $stmt->free_result();
        $db->close();
        echo "查询申请状态时发生错误，请联系管理员并反馈问题";
        exit;
    }
    $stmt->free_result();
}

//回显不符合处理条件的申请的状态信息
if (count($cantProcAppls) > 0) {
    $tips = "";
    for ($indx = 0; $indx < count($cantProcAppls); $indx++) {
        $tips .= "\n申请ID：" . $cantProcAppls[$indx][0] . "，申请状态：" . $cantProcAppls[$indx][1];
    }
    $stmt->free_result();
    $db->close();
    echo "抱歉，您提交的申请中包含不符合处理条件的申请记录：" . $tips . "\n请确认无误后再执行处理操作";
    exit;
}

//处理申请
for ($indx = 0; $indx < count($appls); $indx++) {
    $currApplID = intval($appls[$indx]);
    //获取该申请记录中的用户ID、借用起始和结束时间
    $query = "SELECT UserID, LendBegn, LendEnd FROM Applications WHERE ApplID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $currApplID);
    $stmt->execute();
    $stmt->bind_result($userID, $lendBegn, $lendEnd);
    $stmt->fetch();
    $stmt->free_result();
    
    //获取该申请记录中的设备ID
    $query = "SELECT EqptID FROM Details WHERE ApplID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $currApplID);
    $stmt->execute();
    $result = $stmt->get_result();
    $eqptID = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->free_result();
    
    //更新申请状态
    $applStat = "已通过";
    $query = "UPDATE Applications SET ApplStat = ?, DspUser = ?, DspDate = ? WHERE ApplID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("sssi", $applStat, $dspUser, $dspDate, $currApplID);
    $stmt->execute();

    //新建设备借用记录
    $lendStat = "未归还";
    for ($eqptIDIndx = 0; $eqptIDIndx < count($eqptID); $eqptIDIndx++) {
        $query = "INSERT INTO Lend VALUES(?,?,?,?,?,NULL)";
        $stmt = $db->prepare($query);
        $stmt->bind_param("sssss", $userID, $eqptID[$eqptIDIndx]["EqptID"], $lendBegn, $lendEnd, $lendStat);
        $stmt->execute();
    }

    //更新设备借用状态
    $eqptStat = "已借出";
    for ($eqptIDIndx = 0; $eqptIDIndx < count($eqptID); $eqptIDIndx++) {
        $query = "UPDATE Equipments SET EqptStat = ? WHERE EqptID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $eqptStat, $eqptID[$eqptIDIndx]["EqptID"]);
        $stmt->execute();
    }
}

echo "successful";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>