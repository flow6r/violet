<?php
/*批量处理报修设备的脚本*/
//获取POST请求的数据

use function Complex\cot;
use function Complex\ln;

$userRole = $_POST["userRole"];
$brkIDs = $_POST["brkIDs"];
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

//声明无法处理的报修设备记录信息数组
$canProc = true;
$cantPrcoBrkRecs = array();
$cantProcBrkRecsIndx = 0;

//查询数据库检查报修状态
for ($indx = 0; $indx < count($brkIDs); $indx++) {
    $currBrkID = intval($brkIDs[$indx]);
    $query = "SELECT BrkStat FROM Breakages WHERE BrkID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $currBrkID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->bind_result($brkStat);
        $stmt->fetch();
        $stmt->free_result();
        if ($brkStat === "已处理") {
            $canProc = false;
            $cantPrcoBrkRecs[$cantProcBrkRecsIndx][0] = $currBrkID;
            $cantPrcoBrkRecs[$cantProcBrkRecsIndx++][1] = $brkStat;
        }
    } else {
        echo "查询报修设备记录时发生错误，发生异常的报修ID为" . $currBrkID . "，请联系管理员并反馈问题\n或检查报修ID以及报修状态无误后再执行处理操作";
        $stmt->free_result();
        $db->close();
        exit;
    }
}

if ($canProc) {
    for ($indx = 0; $indx < count($brkIDs); $indx++) {
        $currBrkID = intval($brkIDs[$indx]);
        $query = "SELECT EqptID FROM Breakages WHERE BrkID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $currBrkID);
        $stmt->execute();
        $stmt->bind_result($eqptID);
        $stmt->fetch();
        $stmt->free_result();
        $eqptStat = "未借出";
        $brkStat = "已处理";
        $dspDate = date("Y-m-d H:i:s");
        $query = "UPDATE Equipments E, Breakages B SET E.EqptStat = ?, B.BrkStat = ?, B.DspUser = ?, B.DspDate = ? WHERE B.BrkID = ? AND E.EqptID = B.EqptID AND E.EqptID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ssssis", $eqptStat, $brkStat, $dspUser, $dspDate, $currBrkID, $eqptID);
        $stmt->execute();
    }

    echo "successful";
} else {
    $tips = null;
    for ($indx = 0; $indx < count($cantPrcoBrkRecs); $indx++) {
        $tips .= "\n报修ID：" . $cantPrcoBrkRecs[$indx][0] . "，报修状态：" . $cantPrcoBrkRecs[$indx][1];
    }
    echo "您提交的报修ID中包含不符合处理条件的记录：" . $tips . "\n请检查无误后再执行批量处理操作";
    $stmt->free_result();
    $db->close();
    exit;
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>