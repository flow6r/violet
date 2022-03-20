<?php
/*批量删除设备借用申请的脚本*/
//获取POST请求的数据
$userRole = $_POST["userRole"];
$appls = $_POST["appls"];

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

//遍历并删除设备借用申请
for ($indx = 0; $indx < count($appls); $indx++) {
    $currApplID = intval($appls[$indx]);
    $query = "SELECT ApplStat FROM Applications WHERE ApplID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $currApplID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->bind_result($applStat);
        $stmt->fetch();
        $stmt->free_result();
        if ($applStat === "未通过") {
            //获取申请借用的设备ID
            $query = "SELECT EqptID FROM Details WHERE ApplID = ?";
            $stmt = $db->prepare($query);
            $stmt->bind_param("i", $currApplID);
            $stmt->execute();
            $result = $stmt->get_result();
            $eqptID = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->free_result();

            //更新设备借用状态
            $eqptStat = "未借出";
            for ($eqptIDIndx = 0; $eqptIDIndx < count($eqptID); $eqptIDIndx++) {
                $query = "UPDATE Equipments SET EqptStat = ? WHERE EqptID = ?";
                $stmt = $db->prepare($query);
                $stmt->bind_param("ss", $eqptStat, $eqptID[$eqptIDIndx]["EqptID"]);
                $stmt->execute();
            }
        }
        //删除设备借用申请
        $query = "DELETE FROM Applications WHERE ApplID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $currApplID);
        $stmt->execute();
    } else {
        $stmt->free_result();
        $db->close();
        echo "查询设备借用申请状态时发生错误，请联系管理员并反馈问题\n抛出异常的申请ID：" . $currApplID;
        exit;
    }
}

echo "successful";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>