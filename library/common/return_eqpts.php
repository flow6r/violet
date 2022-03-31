<?php
/*归还多个借用的设备的脚本*/
//获取POST请求的数据
$userRole = $_POST["userRole"];
$lendIDs = $_POST["lendIDs"];

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

//查询借用记录状态
$cantRtnLendIDs = array();
$cantRtnLendIDIndx = 0;
$canRtn = true;
for ($indx = 0; $indx < count($lendIDs); $indx++) {
    $currLendID = intval($lendIDs[$indx]);
    $query = "SELECT LendStat FROM Lend WHERE LendID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $currLendID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->bind_result($lendStat);
        $stmt->fetch();
        $stmt->free_result();
        if ($lendStat === "已归还") {
            $canRtn = false;
            $cantRtnLendIDs[$cantRtnLendIDIndx++] = $currLendID;
        }
    } else {
        echo "查询设备借用记录时发生错误，发生异常的设备借用记录ID为" . $currLendID . "，请联系管理员并反馈问题";
        $stmt->free_result();
        $db->close();
        exit;
    }
}

//执行批量归还操作
if ($canRtn) {
    for ($indx = 0; $indx < count($lendIDs); $indx++) {
        $currLendID = intval($lendIDs[$indx]);
        $query = "SELECT EqptID FROM Lend WHERE LendID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $currLendID);
        $stmt->execute();
        $stmt->bind_result($eqptID);
        $stmt->fetch();
        $stmt->free_result();
        $eqptStat = "未借出";
        $lendStat = "已归还";
        $lendRtn = date("Y-m-d H:i:s");
        $query = "UPDATE Equipments E, Lend L SET E.EqptStat = ?, L.LendStat = ?, L.LendRtn = ? WHERE L.LendID = ? AND E.EqptID = L.EqptID AND L.EqptID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("sssis", $eqptStat, $lendStat, $lendRtn, $currLendID, $eqptID);
        $stmt->execute();
    }
} else {
    $tips = null;
    for ($indx = 0; $indx < count($cantRtnLendIDs); $indx++) {
        $tips .= "\n借用记录ID：" . $cantRtnLendIDs[$indx] . "，借用记录状态：已归还";
    }
    echo "您提交的借用记录ID中含有不符合归还条件的记录：" . $tips . "\n请检查无误后再执行批量归还操作";
    $db->close();
    exit;
}

echo "successful";

//关闭链接
$db->close();
exit;
?>