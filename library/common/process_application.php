<?php
/*管理员用户处理设备申请的脚本*/
//设置更新设备申请所需要的信息
$applID = "220";
$dspUser = "111111111111";
$dspDate = date("Y-m-d H:i:s");
//连接数据库
$db = mysqli_connect("localhost", "admintest", "admintest123", "EEMS");
if (mysqli_connect_error()) {
    echo "连接数据库失败，请联系管理员并反馈问题";
    exit;
}
//检查该订单是否已被处理
$query = "SELECT ApplStat FROM Applications WHERE ApplID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $applID);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($applStat);
$stmt->fetch();
if ($applStat === "未处理") {
    //更新设备申请信息
    $query = "UPDATE Applications SET ApplStat = '已处理', DspUser = ?, DspDate = ? WHERE ApplID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("sss", $dspUser, $dspDate, $applID);
    $stmt->execute();
    //更新被借用设备的状态信息
    $query = "UPDATE Equipments AS E INNER JOIN (SELECT * FROM Details WHERE ApplID = ?) AS D ON E.EqptID = D.EqptID SET E.EqptStat = '已借出'";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $applID);
    $stmt->execute();
    //从订单中获取信息
    $query = "SELECT UserID, ApplQty, LendBegn, LendEnd FROM Applications WHERE ApplID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $applID);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($userID, $applQty, $lendBegn, $lendEnd);
    $stmt->fetch();
    //获取设备ID信息
    $query = "SELECT EqptID FROM Details WHERE ApplID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $applID);
    $stmt->execute();
    $result = $stmt->get_result();
    $applIDs = $result->fetch_all(MYSQLI_ASSOC);
    //创建设备借用信息
    $lendStat = '未归还';
    foreach ($applIDs as $index) {
        $query = "INSERT INTO Lend VALUES (?, ?, ?, ?, ?, NULL)";
        $stmt = $db->prepare($query);
        $stmt->bind_param("sssss", $userID, $index["EqptID"], $lendBegn, $lendEnd, $lendStat);
        $stmt->execute();
    }
    echo "处理成功";
} else {
    echo "该申请已处理，不能重复处理申请";
}
//释放结果集并关闭链接
$stmt->free_result();
$db->close();
?>