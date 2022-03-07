<?php
/*更新实验设备信息的脚本*/
//获取POST请求的数据
$currUserRole = $_POST["currUserRole"];
$eqptNewID = $_POST["eqptNewID"];
$eqptOldID = $_POST["eqptOldID"];
$eqptNewName = $_POST["eqptNewName"];
$eqptNewColg = $_POST["eqptNewColg"];
$eqptNewCre = $_POST["eqptNewCre"];
$eqptNewDesc = $_POST["eqptNewDesc"];
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//引入数据库用户信息脚本
switch ($currUserRole) {
    case "学生":require_once("../dbuser/student.php");break;
    case "教师":require_once("../dbuser/teacher.php");break;
    case "管理员":require_once("../dbuser/admin.php");break;
}

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "0";
    exit;
}

//查询数据库
$query = "SELECT EqptID FROM Equipments WHERE EqptID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $eqptNewID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) echo "1";
else {
    //查询学院信息
    $query = "SELECT ColgName FROM Colleges WHERE ColgAbrv = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $eqptNewColg);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->bind_result($eqptNewColg);
        $stmt->fetch();
        //更新设备信息
        $query = "UPDATE Equipments SET EqptID = ?, EqptName = ?, ColgName = ?, EqptCre = ?, EqptDesc = ? WHERE EqptID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ssssss", $eqptNewID, $eqptNewName, $eqptNewColg, $eqptNewCre, $eqptNewDesc, $eqptOldID);
        $stmt->execute();
        //更新设备图片文件名
        rename($docRoot."/images/eqpts/".$eqptOldID.".jpg", $docRoot."/images/eqpts/".$eqptNewID.".jpg");
    } else echo "2";
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
?>