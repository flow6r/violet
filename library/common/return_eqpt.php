<?php
/*归还单个设备的脚本*/
//获取POST请求的数据
$userRole = $_POST["userRole"];
$lendID = intval($_POST["lendID"]);
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
$query = "SELECT LendStat FROM Lend WHERE LendID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $lendID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($lendStat);
    $stmt->fetch();
    $stmt->free_result();
    if ($lendStat === "已归还") {
        echo "该设备已归还，请勿重复执行归还操作";
        $db->close();
        exit;
    } else {
        $eqptStat = "未借出";
        $lendStat = "已归还";
        $query = "UPDATE Equipments E, Lend L SET E.EqptStat = ?, L.LendStat = ?, L.LendRtn = ? WHERE L.LendID = ? AND E.EqptID = L.EqptID AND L.EqptID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("sssis", $eqptStat, $lendStat, $lendRtn, $lendID, $eqptID);
        $stmt->execute();
    }
} else {
    echo "查询设备借用状态时发生错误，发生异常的借用记录ID为" . $lendStat . "请联系管理员并反馈问题";
    $stmt->free_result();
    $db->close();
    exit;
}

echo "successful";

//关闭链接
$db->close();
exit;
?>