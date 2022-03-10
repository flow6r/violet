<?php
/*批量导入设备信息的脚本*/

//使用命名空间
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;

//引入PHPSpreadsheet文件
require_once("../PHPSpreadsheet/vendor/autoload.php");

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//获取当前时间信息
$currDateTime = date("_YmdHis");

//检查文件上传错误
if ($_FILES["newEqptsInfoTmpl"]["error"] === 1) {
    echo "<script>alert('超出单个文件上传大小');</script>";
    exit;
}

//检查文件类型
if ($_FILES["newEqptsInfoTmpl"]["type"] != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    && $_FILES["newEqptsInfoTmpl"]["type"] != "application/vnd.ms-excel") {
    echo "<script>alert('请上传xls或xlsx格式的设备信息文件');</script>";
    exit;
}

//获取当前用户的姓名和角色信息
session_start();
$userRole = $_SESSION["userInfo"]["userRole"];
$userName = $_SESSION["userInfo"]["userName"];

//设置文件基本名
$baseName = "EqptInfoTmpl_".$userName.$currDateTime;

//设置文件后缀名
$extName = null;
if ($_FILES["newEqptsInfoTmpl"]["type"] === "application/vnd.ms-excel") $extName = ".xls";
else $extName = ".xlsx";

//设置文件路径
$trgtPath = $docRoot."/data/upload/".$baseName.$extName;

//移动文件至指定目录
if (is_uploaded_file($_FILES["newEqptsInfoTmpl"]["tmp_name"])) {
    if (!move_uploaded_file($_FILES["newEqptsInfoTmpl"]["tmp_name"], $trgtPath)) {
        echo "<script>alert('移动设备信息文件时发生错误，请联系管理员并反馈问题');</script>";
        exit;
    } else {
        echo "<script>alert('成功导入设备');</script>";
    }
}

//尝试读取文件
$readXlsx = new Xlsx();
$spreadsheet = $readXlsx->load($trgtPath);
$newEqptInfo = $spreadsheet->getActiveSheet();
$newEqptID = $newEqptInfo->getCellByColumnAndRow(1, 4)->getValue();
$newEqptName = $newEqptInfo->getCellByColumnAndRow(2, 4)->getValue();
$newEqptCls = $newEqptInfo->getCellByColumnAndRow(3, 4)->getValue();
$newEqptColg = $newEqptInfo->getCellByColumnAndRow(4, 4)->getValue();
$newEqptCre = $newEqptInfo->getCellByColumnAndRow(5, 4)->getValue();
$newEqptDesc = $newEqptInfo->getCellByColumnAndRow(6, 4)->getValue();

echo "<script>alert('新设备ID：".$newEqptID.
"\\n新设备名称：".$newEqptName.
"\\n新设备分类：".$newEqptCls.
"\\n新设备隶属学院：".$newEqptColg.
"\\n新设备入库时间：".$newEqptCre.
"\\n新设备设备描述：".$newEqptDesc."');</script>";
exit;

// //引入数据库用户信息脚本
// switch ($userRole) {
//     case "教师":require_once("../dbuser/teacher.php");break;
//     case "管理员":require_once("../dbuser/admin.php");break;
// }

// //连接数据库
// $db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
// if (mysqli_connect_error()) {
//     echo "<script>alert('连接数据库时发生错误，请联系管理员并反馈问题');</script>";
//     exit;
// }

?>