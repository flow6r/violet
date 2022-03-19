<?php
/*借用单个设备的脚本*/
//获取POST请求的数据
$userID = $_POST["userID"];
$userRole = $_POST["userRole"];
$eqptID = $_POST["eqptID"];
$lendBegn = $_POST["lendBegn"];
$lendEnd = $_POST["lendEnd"];
$applDesc = $_POST["applDesc"];

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

//查询
$query = "SELECT EqptStat FROM Equipments WHERE EqptID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $eqptID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($eqptStat);
    $stmt->fetch();
    if ($eqptStat === "已借出" || $eqptStat === "申请中") {
        echo "抱歉，当前设备状态为：" . $eqptStat . "，请选择其他可用设备";
    } else {
        $stmt->free_result();
        //创建新的设备申请记录
        $applQty = 1;
        $applCre = date("Y-m-d H:i:s");
        $applStat = "未通过";
        $query = "INSERT INTO Applications VALUES(NULL,?,?,?,?,?,?,?,NULL,NULL)";
        $stmt = $db->prepare($query);
        $stmt->bind_param("sisssss", $userID, $applQty, $lendBegn, $lendEnd, $applDesc, $applCre, $applStat);
        $stmt->execute();
        //获取新创建的设备申请ID
        $query = "SELECT LAST_INSERT_ID(ApplID) FROM Applications";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows()) {
            $stmt->bind_result($applID);
            $stmt->fetch();
            //创建新的申请详情记录
            $query = "INSERT INTO Details VALUES(?,?)";
            $stmt = $db->prepare($query);
            $stmt->bind_param("ss", $applID, $eqptID);
            $stmt->execute();
            //更新借用设备的状态
            $eqptStat = "申请中";
            $query = "UPDATE Equipments SET EqptStat = ? WHERE EqptID = ?";
            $stmt = $db->prepare($query);
            $stmt->bind_param("ss", $eqptStat, $eqptID);
            $stmt->execute();
        } else {
            echo "查询申请ID时发生错误，请联系管理员并反馈问题";
            exit;
        }
    }
} else {
    echo "查询设备状态时发生错误，请联系管理员并反馈问题";
}

echo "successful";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>