<?php
/*添加单个实验设备的脚本*/
//获取POST请求
$newEqptID = $_POST["newEqptID"];
$newEqptName = $_POST["newEqptName"]; 
$newEqptCls = $_POST["newEqptCls"];
$newEqptColg = $_POST["newEqptColg"];
$newEqptCre = $_POST["newEqptCre"];
$newEqptDesc = $_POST["newEqptDesc"];

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//格式化时间字符串
$newEqptCre = str_replace("T", " ", $newEqptCre);

//检查文件上传错误
if ($_FILES["newEqptImg"]["error"] === 1) {
    echo "<script>alert('超出单个文件上传大小');</script>";
    exit;
}

//检查文件类型并设置后置名
$extName = null;
switch ($_FILES["newEqptImg"]["type"]) {
    case "image/bmp" : $extName = ".bmp"; break;
    case "image/gif" : $extName = ".gif"; break;
    case "image/jpeg": $extName = ".jpg"; break;
    case "image/png" : $extName = ".png"; break;
    default: echo  "<script>alert('您上传的图片格式不符合要求，请上传bmp、gif、jpg或png格式的图片文件');</script>"; exit;
}

//获取当前用户的角色信息
session_start();
$userRole = $_SESSION["userInfo"]["userRole"];

//引入数据库用户信息脚本
switch ($userRole) {
    case "教师":require_once("../dbuser/teacher.php");break;
    case "管理员":require_once("../dbuser/admin.php");break;
}

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "<script>alert('连接数据库时发生错误，请联系管理员并反馈问题');</script>";
    exit;
}

//查询数据库，检查是否存在同ID设备
$query = "SELECT EqptID FROM Equipments WHERE EqptID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $newEqptID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    echo "<script>alert('已存在同ID设备，请确认后再添加新设备');</script>";
    exit;
}

//查询设备分类信息
$query = "SELECT ClsName FROM Classification WHERE ClsAbrv = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $newEqptCls);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($newEqptCls);
    $stmt->fetch();
} else {
    echo "<script>alert('查询设备分类时发生错误，请联系管理员并反馈问题');</script>";
    exit;
}

//查询学院信息
$query = "SELECT ColgName FROM Colleges WHERE ColgAbrv = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $newEqptColg);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($newEqptColg);
    $stmt->fetch();
} else {
    echo "<script>alert('查询学院信息时发生错误，请联系管理员并反馈问题');</script>";
    exit;
}

//将新设备信息插入到数据库
$newEqptStat = "未借出";
$newEqptImgPath = "../images/eqpts/".$newEqptID.".jpg";
$query = "INSERT INTO Equipments VALUES(?,?,?,?,?,?,?,?)";
$stmt = $db->prepare($query);
$stmt->bind_param("ssssssss", $newEqptID, $newEqptName, $newEqptCls, $newEqptColg, $newEqptCre, $newEqptImgPath, $newEqptDesc, $newEqptStat);
$stmt->execute();

//将图片文件移动至指定位置
$trgtPath = $docRoot."/images/eqpts/".$newEqptID.$extName;

if (is_uploaded_file($_FILES["newEqptImg"]["tmp_name"])) {
    if (!move_uploaded_file($_FILES["newEqptImg"]["tmp_name"], $trgtPath)) {
        echo "<script>alert('移动设备图片文件时发生错误，请联系管理员并反馈问题');</script>";
        exit;
    } else {
        echo "<script>alert('成功添加设备');</script>";
        exit;
    }
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
?>