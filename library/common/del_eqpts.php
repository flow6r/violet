<?php
/*删除实验设备的脚本*/
//获取POST的数据
$userRole = $_POST["userRole"];
$eqptsBeDel = $_POST["eqptsBeDel"];

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//将待删除的设备ID写入文件
// file_put_contents("eqptsBeDel.txt", $eqptsBeDel);

//计算待删设备的数量
$delEqptsCnt = count($eqptsBeDel);

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
for ($index = 0; $index < $delEqptsCnt; $index++) {
    $query = "SELECT EqptStat FROM Equipments WHERE EqptID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $eqptsBeDel[$index]);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->bind_result($eqptStat);
        $stmt->fetch();
        if ($eqptStat === "已借出" || $eqptStat === "申请中") {
            echo "设备ID为" . $eqptsBeDel[$index] . "的设备，当前状态为" . $eqptStat . "无法删除";
            exit;
        }
    } else {
        echo "查询设备状态时发生错误，请联系管理员并反馈问题";
        exit;
    }
}

//从数据库中删除设备记录并删除相应的设备图片
for ($index = 0; $index < $delEqptsCnt; $index++) {
    $query = "DELETE FROM Equipments WHERE EqptID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $eqptsBeDel[$index]);
    $stmt->execute();
    unlink($docRoot."/images/eqpts/".$eqptsBeDel[$index].".jpg");
}
echo "successful";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>