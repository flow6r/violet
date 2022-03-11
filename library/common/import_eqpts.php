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

//设置入库时间
$newEqptCre = date("Y-m-d H:i:s");

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

//获取上传的照片的数量
$newEqptsImgsCnt = count($_FILES["newEqptsImgs"]["name"]);

//检查上传的设备图片文件类型
for ($indx = 0; $indx < $newEqptsImgsCnt; $indx++) {
    if (
        $_FILES["newEqptsImgs"]["type"][$indx] != "image/bmp" &&
        $_FILES["newEqptsImgs"]["type"][$indx] != "image/gif" &&
        $_FILES["newEqptsImgs"]["type"][$indx] != "image/jpeg" &&
        $_FILES["newEqptsImgs"]["type"][$indx] != "image/png"
    ) {
        echo "<script>alert('您上传的文件中包含非图片格式的文件，请检查无误后再执行上传操作');</script>";
        exit;
    }
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
$newEqptsInfoFile = $docRoot . "/data/upload/" . $baseName . $extName;

//移动文件至指定目录
if (is_uploaded_file($_FILES["newEqptsInfoTmpl"]["tmp_name"])) {
    if (!move_uploaded_file($_FILES["newEqptsInfoTmpl"]["tmp_name"], $newEqptsInfoFile)) {
        echo "<script>alert('移动设备信息文件时发生错误，请联系管理员并反馈问题');</script>";
        exit;
    }
}

//尝试读取文件
$readXlsx = new Xlsx();
$spreadsheet = $readXlsx->load($newEqptsInfoFile);
$newEqptsInfo = $spreadsheet->getActiveSheet(0);

//获取数据行数
$dataRows = $newEqptsInfo->getHighestRow() - 3;
$begnRows = 4;

//检查图片数量与新增设备记录数是否匹配
if ($newEqptsImgsCnt != $dataRows) {
    echo "<script>alert('您上传的新增设备记录数与设备图像文件数量不匹配，请检查无误后再执行上传操作');</script>";
    unlink($newEqptsInfoFile);
    exit;
}

//遍历数据表并初始化新增设备信息数组
for ($indx = 0; $indx < $dataRows; $indx++, $begnRows++) {
    $newEqptsInfoAray[$indx]["newEqptID"] = $newEqptsInfo->getCellByColumnAndRow(1, $begnRows)->getValue();
    $newEqptsInfoAray[$indx]["newEqptName"] = $newEqptsInfo->getCellByColumnAndRow(2, $begnRows)->getValue();
    $newEqptsInfoAray[$indx]["newEqptCls"] = $newEqptsInfo->getCellByColumnAndRow(3, $begnRows)->getValue();
    $newEqptsInfoAray[$indx]["newEqptColg"] = $newEqptsInfo->getCellByColumnAndRow(4, $begnRows)->getValue();
    $newEqptsInfoAray[$indx]["newEqptCre"] = $newEqptCre;
    $newEqptsInfoAray[$indx]["newEqptDesc"] = $newEqptsInfo->getCellByColumnAndRow(5, $begnRows)->getValue();
}

//遍历上传的图片文件信息并初始化新增设备图片信息数组
for ($indx = 0; $indx < $newEqptsImgsCnt; $indx++) {
    $newEqptsImgsAray[$indx]["newEqptImgName"] = $_FILES["newEqptsImgs"]["name"][$indx];
    $newEqptsImgsAray[$indx]["newEqptImgType"] = $_FILES["newEqptsImgs"]["type"][$indx];
    $newEqptsImgsAray[$indx]["newEqptImgSize"] = $_FILES["newEqptsImgs"]["size"][$indx];
}

//遍历新增设备图片信息数组并设置对应设备的图片路径
$newEqptsImgsArayLen = count($newEqptsImgsAray);
for ($indx = 0; $indx < $newEqptsImgsArayLen; $indx++) {
    $dotPosn = strpos($newEqptsImgsAray[$indx]["newEqptImgName"], ".");
    $newEqptImgBaseName = substr($newEqptsImgsAray[$indx]["newEqptImgName"], 0, $dotPosn);
    $newEqptImgExtName = substr($newEqptsImgsAray[$indx]["newEqptImgName"], $dotPosn);
    $isEqptIDExist = false;
    foreach ($newEqptsInfoAray as $key => $val) {
        if ($newEqptsInfoAray[$key]["newEqptID"] === $newEqptImgBaseName) {
            $newEqptsInfoAray[$key]["newEqptImgPath"] = "../images/eqpts/" . $newEqptsImgsAray[$indx]["newEqptImgName"];
            $isEqptIDExist = true;
        }
    }
    if (!$isEqptIDExist) {
        echo "<script>alert('您上传的新增设备记录与设备图片中含有设备ID不匹配项，请检查无误后再执行上传操作');</script>";
        unlink($newEqptsInfoFile);
        exit;
    }
}

//将数组保存为JSON数据并写入文件
// $newEqptsInfoJSON = json_encode($newEqptsInfoAray, JSON_UNESCAPED_UNICODE);
// file_put_contents("newEqptsInfo.json", $newEqptsInfoJSON);
// $newEqptsInfoJSON = json_encode($newEqptsImgsAray, JSON_UNESCAPED_UNICODE);
// file_put_contents("newEqptsImgs.json", $newEqptsInfoJSON);
// exit;

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
for ($indx = 0; $indx < $dataRows; $indx++) {
    $query = "SELECT EqptID FROM Equipments WHERE EqptID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $newEqptsInfoAray[$indx]["newEqptID"]);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        echo "<script>alert('您所导入的设备信息中，包含已在库的设备，请检查无误后继续导入');</script>";
        unlink($newEqptsInfoFile);
        $isExist = true;
        break;
    }
}

//将设备信息插入数据库中
$stmt->free_result();
if (!$isExist) {
    $eqptStat = "未借出";

    for ($indx = 0; $indx < $dataRows; $indx++) {
        $query = "INSERT INTO Equipments VALUES (?,?,?,?,?,?,?,?)";
        $stmt = $db->prepare($query);
        $stmt->bind_param(
            "ssssssss",
            $newEqptsInfoAray[$indx]["newEqptID"],
            $newEqptsInfoAray[$indx]["newEqptName"],
            $newEqptsInfoAray[$indx]["newEqptCls"],
            $newEqptsInfoAray[$indx]["newEqptColg"],
            $newEqptsInfoAray[$indx]["newEqptCre"],
            $newEqptsInfoAray[$indx]["newEqptImgPath"],
            $newEqptsInfoAray[$indx]["newEqptDesc"],
            $eqptStat
        );
        $stmt->execute();
    }

    echo "<script>alert('数据库新增" . $dataRows . "条设备记录');</script>";
}

//将上传的文件移动至指定位置
for ($indx = 0; $indx < $newEqptsImgsArayLen; $indx++) {
    $imgStoragePath = $docRoot . "/images/eqpts/";
    if (is_uploaded_file($_FILES["newEqptsImgs"]["tmp_name"][$indx])) {
        if (!move_uploaded_file(
            $_FILES["newEqptsImgs"]["tmp_name"][$indx],
            $imgStoragePath . $_FILES["newEqptsImgs"]["name"][$indx]
        )) {
            echo "<script>alert('移动设备图片文件时发生错误，请联系管理员并反馈问题');</script>";
            exit;
        }
    }
}

echo "<script>alert('导入成功，新增" . $dataRows . "条设备记录');</script>";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>