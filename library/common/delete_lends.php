<?php
/*批量删除设备借用记录的脚本*/
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

//查询设备借用记录状态
$canDel = true;
$cantDelLendIDs = array();
$cantDelLendIDsIndx = 0;
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
        if ($lendStat === "未归还") {
            $canDel = false;
            $cantDelLendIDs[$cantDelLendIDsIndx++] = $currLendID;
        }
    } else {
        echo "查询设备借用记录时发生错误，发生异常的设备借用记录ID为" . $currLendID . "，请联系管理员并反馈问题";
        $stmt->free_result();
        $db->close();
        exit;
    }
}

//执行批量删除借用记录操作
if ($canDel) {
    for ($indx = 0; $indx < count($lendIDs); $indx++) {
        $currLendID = intval($lendIDs[$indx]);
        $query = "DELETE FROM Lend WHERE LendID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $currLendID);
        $stmt->execute();
    }
} else {
    $tips = null;
    for ($indx = 0; $indx < count($cantDelLendIDs); $indx++) {
        $tips .= "\n借用记录ID：" . $cantDelLendIDs[$indx] . "，借用记录状态：未归还";
    }
    echo "您提交的借用记录ID中含有不符合删除条件的记录：" . $tips . "请检查无误后再执行批量删除操作";
    $db->close();
    exit;
}

echo "successful";

//释放结果集并关闭链接
$db->close();
exit;
?>