<?php
/*处理单个报修设备的脚本*/
//获取POST脚本
$userRole = $_POST["userRole"];
$brkID = intval($_POST["brkID"]);
$dspUser = $_POST["dspUser"];

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

//查询数据库
$query = "SELECT EqptID, BrkStat FROM Breakages WHERE BrkID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $brkID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($eqptID, $brkStat);
    $stmt->fetch();
    $stmt->free_result();
    if ($brkStat === "未处理") {
        $eqptStat = "未借出";
        $brkStat = "已处理";
        $dspDate = date("Y-m-d H:i:s");
        $query = "UPDATE Equipments E, Breakages B SET E.EqptStat = ?, B.BrkStat = ?, B.DspUser = ?, B.DspDate = ? WHERE B.BrkID = ? AND E.EqptID = B.EqptID AND E.EqptID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ssssis", $eqptStat, $brkStat, $dspUser, $dspDate, $brkID, $eqptID);
        $stmt->execute();
    } else {
        echo "报修ID为" . $brkID . "的报修记录状态为'已处理'，请勿重复执行处理操作";
        $stmt->free_result();
        $db->close();
        exit;
    }
} else {
    echo "查询报修设备记录时发生错误，发生异常的报修ID为" . $brkID . "，请联系管理员并反馈问题\n或检查报修ID以及报修状态无误后再执行处理操作";
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