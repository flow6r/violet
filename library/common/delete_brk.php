<?php
/*删除单个报修设备记录的脚本*/
//获取POST请求的数据
$userRole = $_POST["userRole"];
$brkID = intval($_POST["brkID"]);

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
$query = "SELECT BrkStat FROM Breakages WHERE BrkID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $brkID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($brkStat);
    $stmt->fetch();
    if ($brkStat === "已处理") {
        $query = "DELETE FROM Breakages WHERE BrkID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $brkID);
        $stmt->execute();
    } else {
        echo "报修ID为" . $brkID . "的报修记录状态为" . $brkStat . "，不符合删除条件";
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