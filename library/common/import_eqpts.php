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
if (
    $_FILES["newEqptsInfoTmpl"]["type"] != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    && $_FILES["newEqptsInfoTmpl"]["type"] != "application/vnd.ms-excel"
) {
    echo "<script>alert('请上传xls或xlsx格式的设备信息文件');</script>";
    exit;
}

//获取当前用户的姓名和角色信息
session_start();
$userRole = $_SESSION["userInfo"]["userRole"];
$userName = $_SESSION["userInfo"]["userName"];

//设置文件基本名
$baseName = "EqptInfoTmpl_" . $userName . $currDateTime;

//设置文件后缀名
$extName = null;
if ($_FILES["newEqptsInfoTmpl"]["type"] === "application/vnd.ms-excel") $extName = ".xls";
else $extName = ".xlsx";

//设置文件路径
$trgtPath = $docRoot . "/data/upload/" . $baseName . $extName;

//移动文件至指定目录
if (is_uploaded_file($_FILES["newEqptsInfoTmpl"]["tmp_name"])) {
    if (!move_uploaded_file($_FILES["newEqptsInfoTmpl"]["tmp_name"], $trgtPath)) {
        echo "<script>alert('移动设备信息文件时发生错误，请联系管理员并反馈问题');</script>";
        exit;
    }
}

//尝试读取文件
$readXlsx = new Xlsx();
$spreadsheet = $readXlsx->load($trgtPath);
$newEqptsInfo = $spreadsheet->getActiveSheet(0);

//获取数据行数
$dataRows = $newEqptsInfo->getHighestRow() - 3;
$begnRows = 4;

//遍历数据表并初始化数组
for ($outer = 0; $outer < $dataRows; $outer++, $begnRows++) {
    $newEqptsInfoAray[$outer]["newEqptID"] = $newEqptsInfo->getCellByColumnAndRow(1, $begnRows)->getValue();
    $newEqptsInfoAray[$outer]["newEqptName"] = $newEqptsInfo->getCellByColumnAndRow(2, $begnRows)->getValue();
    $newEqptsInfoAray[$outer]["newEqptCls"] = $newEqptsInfo->getCellByColumnAndRow(3, $begnRows)->getValue();
    $newEqptsInfoAray[$outer]["newEqptColg"] = $newEqptsInfo->getCellByColumnAndRow(4, $begnRows)->getValue();
    $newEqptsInfoAray[$outer]["newEqptCre"] = $newEqptsInfo->getCellByColumnAndRow(5, $begnRows)->getValue();
    $newEqptsInfoAray[$outer]["newEqptDesc"] = $newEqptsInfo->getCellByColumnAndRow(6, $begnRows)->getValue();
}

//将数组保存为JSON数据并写入文件
// $newEqptsInfoJSON = json_encode($newEqptsInfoAray, JSON_UNESCAPED_UNICODE);
// file_put_contents("newEqptsInfo.json", $newEqptsInfoJSON);

//引入数据库用户信息脚本
switch ($userRole) {
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
    echo "<script>alert('连接数据库时发生错误，请联系管理员并反馈问题');</script>";
    exit;
}

//检查数据表中是否包含已在库的设备
$isExist = false;
for ($indx = 0; $indx < count($newEqptsInfoAray); $indx++) {
    $query = "SELECT EqptID FROM Equipments WHERE EqptID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $newEqptsInfoAray[$indx]["newEqptID"]);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        echo "<script>alert('您所导入的设备信息中，包含已在库的设备，请检查无误后继续导入');</script>";
        unlink($trgtPath);
        $isExist = true;
        break;
    }
}

//将设备信息插入数据库中
if (!$isExist) {
    $eqptStat = "未借出";

    for ($indx = 0; $indx < count($newEqptsInfoAray); $indx++) {
        $query = "INSERT INTO Equipments VALUES (?,?,?,?,?,?,?)";
        $stmt = $db->prepare($query);
        $stmt->bind_param(
            "sssssss",
            $newEqptsInfoAray[$indx]["newEqptID"],
            $newEqptsInfoAray[$indx]["newEqptName"],
            $newEqptsInfoAray[$indx]["newEqptCls"],
            $newEqptsInfoAray[$indx]["newEqptColg"],
            $newEqptsInfoAray[$indx]["newEqptCre"],
            $newEqptsInfoAray[$indx]["newEqptDesc"],
            $eqptStat
        );
        $stmt->execute();
    }

    echo "<script>alert('成功导入" . count($newEqptsInfoAray) . "条新设备记录');</script>";
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>