<?php
/*删除单个设备申请记录的脚本*/
//获取POST请求的数据
$userRole = $_POST["userRole"];
$applID = intval($_POST["applID"]);

//创建不可删除申请对应的设备信息数组
$cantDelApplEqpts = array();
$cantDelApplEqptsIndx = 0;

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

//检查申请状态
$query = "SELECT ApplStat FROM Applications WHERE ApplID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $applID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($applStat);
    $stmt->fetch();
    if ($applStat === "已通过") {
        $stmt->free_result();
        $db->close();
        echo "该申请已通过，请勿重复处理";
        exit;
    }
}

//获取申请借用的设备ID
$stmt->free_result();
$query = "SELECT EqptID FROM Details WHERE ApplID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $applID);
$stmt->execute();
$result = $stmt->get_result();
$eqptID = $result->fetch_all(MYSQLI_ASSOC);
$stmt->free_result();

//检查设备状态
$canDel = true;
$eqptStat = array();
for ($indx = 0; $indx < count($eqptID); $indx++) {
    $query = "SELECT EqptStat FROM Equipments WHERE EqptID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $eqptID[$indx]["EqptID"]);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->bind_result($currEqptStat);
        $stmt->fetch();
        if ($currEqptStat != "未借出") {
            $canDel = false;
            $cantDelApplEqpts[$cantDelApplEqptsIndx][0] = $eqptID[$indx]["EqptID"];
            $cantDelApplEqpts[$cantDelApplEqptsIndx++][1] = $currEqptStat;
        }
        $stmt->free_result();
    } else {
        $stmt->free_result();
        $db->close();
        echo "查询设备借用状态时发生错误，请联系管理员并反馈问题";
        exit;
    }
}

if ($canDel) {
    //删除申请记录
    $stmt->free_result();
    $query = "DELETE FROM Applications WHERE ApplID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $applID);
    $stmt->execute();

    //更新设备借用状态
    $notLent = "未借出";
    for ($indx = 0; $indx < count($eqptID); $indx++) {
        $query = "UPDATE Equipments SET EqptStat = ? WHERE EqptID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $notLent, $eqptID[$indx]["EqptID"]);
        $stmt->execute();
    }
} else {
    //回显错误信息
    $tips = null;
    for ($indx = 0; $indx < count($cantDelApplEqpts); $indx++) {
        $tips .= "\n设备ID：" . $cantDelApplEqpts[$indx][0] . "，设备状态：" . $cantDelApplEqpts[$indx][1];
    }
    echo "抱歉，您选择的申请中包含不符合删除条件的设备状态的设备：" . $tips . "\n请确认无误后再进行删除操作";
}

echo "successful";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>