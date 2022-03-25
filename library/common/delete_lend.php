<?php
/*删除单个设备借用记录的脚本*/
//获取POST请求的数据
$userRole = $_POST["userRole"];
$lendID = intval($_POST["lendID"]);

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
    if ($lendStat === "未归还") {
        echo "借用ID为" . $lendID . "的记录当前状态为‘未归还’，不符合删除条件，无法删除";
        $db->close();
        exit;
    } else {
        $query = "DELETE FROM Lend WHERE LendID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $lendID);
        $stmt->execute();
    }
} else {
    echo "查询设备借用记录时发生错误，请联系管理员并反馈问题";
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