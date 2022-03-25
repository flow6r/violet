<?php
/*报修单个设备的脚本*/
//获取POST的请求数据
$userID = $_POST["userID"];
$userRole = $_POST["userRole"];
$lendID = intval($_POST["lendID"]);
$eqptID = $_POST["eqptID"];

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

//检查设备借用记录状态
$query = "SELECT E.EqptStat, L.LendStat FROM Equipments AS E, Lend AS L WHERE E.EqptID = L.EqptID AND L.LendID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $lendID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($eqptStat, $lendStat);
    $stmt->fetch();
    if ($eqptStat != "已借出" && $lendStat != "未归还") {
        echo "该设备无法报修，设备状态：" . $eqptStat . "，借用状态：" . $lendStat;
        $stmt->free_result();
        $db->close();
        exit;
    }
} else {
    echo "查询设备记录时发生错误，发生异常的设备借用记录ID为" . $lendID . "请联系管理员并反馈问题";
    $stmt->free_result();
    $db->close();
    exit;
}

//更新设备借用记录状态
$lendStat = "已归还";
$lendRtn = date("Y-m-d H:i:s");
$query = "UPDATE Lend SET LendStat = ?, LendRtn = ? WHERE LendID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("ssi", $lendStat, $lendRtn, $lendID);
$stmt->execute();

//更新设备借用状态
$eqptStat = "已损坏";
$query = "UPDATE Equipments SET EqptStat = ? WHERE EqptID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("ss", $eqptStat, $eqptID);
$stmt->execute();

//创建报修记录
$stmt->free_result();
$brkStat = "未处理";
$brkCre = date("Y-m-d H:i:s");
$query = "INSERT INTO Breakages VALUES(NULL,?,?,?,?,NUll,NULL)";
$stmt = $db->prepare($query);
$stmt->bind_param("ssss", $userID, $eqptID, $brkCre, $brkStat);
$stmt->execute();

echo "successful";

//关闭链接
$db->close();
exit;
?>