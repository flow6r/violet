<?php
/*批量删除报修设备记录的脚本*/
//获取POST请求的数据
$userRole = $_POST["userRole"];
$brkIDs = $_POST["brkIDs"];

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

//声明无法删除的报修设备记录信息数组
$canDel = true;
$cantDelBrkRecs = array();
$cantDelBrkRecsIndx = 0;

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
        if ($brkStat === "未处理") {
            $canDel = false;
            $cantDelBrkRecs[$cantDelBrkRecsIndx][0] = $currBrkID;
            $cantDelBrkRecs[$cantDelBrkRecsIndx++][1] = $brkStat;
        }
    } else {
        echo "查询报修设备记录时发生错误，发生异常的报修ID为" . $currBrkID . "，请联系管理员并反馈问题\n或检查报修ID以及报修状态无误后再执行处理操作";
        $stmt->free_result();
        $db->close();
        exit;
    }
}

if ($canDel) {
    for ($indx = 0; $indx < count($brkIDs); $indx++) {
        $currBrkID = intval($brkIDs[$indx]);
        $query = "DELETE FROM Breakages WHERE BrkID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $currBrkID);
        $stmt->execute();
    }

    echo "successful";
} else {
    for ($indx = 0; $indx < count($cantDelBrkRecs); $indx++) {
        $tips = null;
        $tips .= "\n报修ID：" . $cantDelBrkRecs[$indx][0] . "，报修状态：" . $cantDelBrkRecs[$indx][1];
    }
    echo "您提交的报修ID中包含不符合删除条件的记录：" . $tips . "请检查无误后再执行批量删除操作";
    $stmt->free_result();
    $db->close();
    exit;
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>