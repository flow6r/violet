<?php
/*批量导入教师用户信息的脚本*/
//使用命名空间
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Reader\Xls;

//引入PHPSpreadsheet文件
require_once("../PHPSpreadsheet/vendor/autoload.php");

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//获取当前时间信息
$currDateTime = date("_YmdHis");

//检查文件类型
if (
    $_FILES["newTchUsersInfoFile"]["type"] != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    && $_FILES["newTchUsersInfoFile"]["type"] != "application/vnd.ms-excel"
) {
    echo "<script>alert('请上传xls或xlsx格式的教师用户信息文件');</script>";
    exit;
}

//获取当前用户的姓名和角色信息
session_start();
$userRole = $_SESSION["userInfo"]["userRole"];
$userName = $_SESSION["userInfo"]["userName"];

//设置文件基本名
$baseName = "TchUserInfoTmpl_" . $userName . $currDateTime;

//设置文件后缀名
$extName = null;
if ($_FILES["newTchUsersInfoFile"]["type"] === "application/vnd.ms-excel") $extName = ".xls";
else $extName = ".xlsx";

//设置文件路径
$newTchUsersInfoFile = $docRoot . "/data/upload/" . $baseName . $extName;

//移动文件至指定目录
if (is_uploaded_file($_FILES["newTchUsersInfoFile"]["tmp_name"])) {
    if (!move_uploaded_file($_FILES["newTchUsersInfoFile"]["tmp_name"], $newTchUsersInfoFile)) {
        echo "<script>alert('移动教师用户信息文件时发生错误，请联系管理员并反馈问题');</script>";
        exit;
    }
}

//尝试读取文件
if ($extName === ".xls") $readFile = new Xls();
else $readFile = new Xlsx();
$spreadsheet = $readFile->load($newTchUsersInfoFile);
$newTchUsersInfo = $spreadsheet->getActiveSheet(0);

//获取数据行数
$dataRows = $newTchUsersInfo->getHighestRow() - 3;
$begnRows = 4;

//声明教师用户信息数组
$newTchUsersInfoAray = array();

//声明无法插入的教师用户信息数组
$canIsrt = true;
$cantIsrtUserInfo = array();
$cantIsrtUserInfoIndx = 0;

//遍历数据表，读取数据
for ($indx = 0; $indx < $dataRows; $indx++, $begnRows++) {
    $newTchUsersInfoAray[$indx]["userID"] = $newTchUsersInfo->getCellByColumnAndRow(1, $begnRows)->getValue();
    $newTchUsersInfoAray[$indx]["userName"] = $newTchUsersInfo->getCellByColumnAndRow(2, $begnRows)->getValue();
    $newTchUsersInfoAray[$indx]["userPasswd"] = password_hash("user" . $newTchUsersInfoAray[$indx]["userID"], PASSWORD_BCRYPT);
    $newTchUsersInfoAray[$indx]["userGen"] = $newTchUsersInfo->getCellByColumnAndRow(3, $begnRows)->getValue();
    $newTchUsersInfoAray[$indx]["userRole"] = "教师";
    $newTchUsersInfoAray[$indx]["userEmail"] = $newTchUsersInfo->getCellByColumnAndRow(4, $begnRows)->getValue();
    $newTchUsersInfoAray[$indx]["colgName"] = $newTchUsersInfo->getCellByColumnAndRow(5, $begnRows)->getValue();
    $newTchUsersInfoAray[$indx]["mjrName"] = $newTchUsersInfo->getCellByColumnAndRow(6, $begnRows)->getValue();
}

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

//检查是否含有不可插入的数据
for ($indx = 0; $indx < count($newTchUsersInfoAray); $indx++) {
    $query = "SELECT * FROM Users WHERE UserID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $newTchUsersInfoAray[$indx]);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->store_result($currUserID);
        $stmt->fetch();
        $stmt->free_result();
        $canIsrt = false;
        $cantIsrtUserInfo[$cantIsrtUserInfoIndx++] = $currUserID;
    }
}

if ($canIsrt) {
    for ($indx = 0; $indx < count($newTchUsersInfoAray); $indx++) {
        $query = "INSERT INTO Users VALUES(?,?,?,?,?,?,NULL,?,?)";
        $stmt = $db->prepare($query);
        $stmt->bind_param(
            "ssssssss",
            $newTchUsersInfoAray[$indx]["userID"],
            $newTchUsersInfoAray[$indx]["userName"],
            $newTchUsersInfoAray[$indx]["userPasswd"],
            $newTchUsersInfoAray[$indx]["userGen"],
            $newTchUsersInfoAray[$indx]["userRole"],
            $newTchUsersInfoAray[$indx]["userEmail"],
            $newTchUsersInfoAray[$indx]["colgName"],
            $newTchUsersInfoAray[$indx]["mjrName"]
        );
        $stmt->execute();
    }
} else {
    $tips = null;
    for ($indx = 0; $indx < count($cantIsrtUserInfo); $indx++) {
        $tips .= "\n用户ID：" . $cantIsrtUserInfo[$indx];
        echo "<script>alert('您导入的信息中包含已存在的用户信息：" . $tips . "\n请检查无误后再执行批量导入的操作');</script>";
        unlink($newTchUsersInfoFile);
        $stmt->free_result();
        $db->close();
        exit;
    }
}

echo "<script>alert('成功导入" . $dataRows . "条教师用户信息');</script>";

//将数据保存为JSON格式并写入文件
// $tchUsers = json_encode($newTchUsersInfoAray, JSON_UNESCAPED_UNICODE);
// file_put_contents("tchUsers.json", $tchUsers);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>