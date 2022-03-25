<?php
/*批量报修设备的脚本*/
//获取POST请求的数据
$userID = $_POST["userID"];
$userRole = $_POST["userRole"];
$lendIDs = $_POST["lendIDs"];
$brkDesc = $_POST["brkDesc"];

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

//查询设备借用状态
$canCre = true;
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
        if ($lendStat != "未归还") $canCre = false;
    } else {
        echo "查询设备借用记录时发生错误，发生异常的借用ID为" . $currLendID . "，请联系管理员并反馈问题";
        $stmt->free_result();
        $db->close();
        exit;
    }
}

if ($canCre) {
    for ($indx = 0; $indx < count($lendIDs); $indx++) {
        $currLendID = intval($lendIDs[$indx]);

        //获取设备ID
        $query = "SELECT EqptID FROM Lend WHERE LendID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $currLendID);
        $stmt->execute();
        $stmt->bind_result($eqptID);
        $stmt->fetch();
        $stmt->free_result();

        //更新设备借用记录状态
        $lendStat = "已归还";
        $lendRtn = date("Y-m-d H:i:s");
        $query = "UPDATE Lend SET LendStat = ?, LendRtn = ? WHERE LendID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ssi", $lendStat, $lendRtn, $currLendID);
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
        $query = "INSERT INTO Breakages VALUES(NULL,?,?,?,?,?,NUll,NULL)";
        $stmt = $db->prepare($query);
        $stmt->bind_param("sssss", $userID, $eqptID, $brkCre, $brkDesc, $brkStat);
        $stmt->execute();
    }
} else {
    echo "您选择的设备借用记录中包含不符合报修条件的记录，请检查无误后再执行批量报修操作";
    $db->close();
    exit;
}

echo "successful";

//关闭链接
$db->close();
exit;
?>