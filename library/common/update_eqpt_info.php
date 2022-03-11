<?php
/*更新实验设备信息的脚本*/
//获取POST请求的数据
$currUserRole = $_POST["currUserRole"];
$eqptNewID = $_POST["eqptNewID"];
$eqptOldID = $_POST["eqptOldID"];
$eqptNewName = $_POST["eqptNewName"];
$eqptNewCls = $_POST["eqptNewCls"];
$eqptNewColg = $_POST["eqptNewColg"];
$eqptNewCre = $_POST["eqptNewCre"];
$eqptNewDesc = $_POST["eqptNewDesc"];

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//引入数据库用户信息脚本
switch ($currUserRole) {
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
    echo "0";
    exit;
}

//查询数据库
if ($eqptNewID === $eqptOldID) {
    //无需更新设备ID，更新其余信息
    //查询设备分类信息
    $query = "SELECT ClsName FROM Classification WHERE ClsAbrv = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $eqptNewCls);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->bind_result($eqptNewCls);
        $stmt->fetch();
        //查询学院信息
        $query = "SELECT ColgName FROM Colleges WHERE ColgAbrv = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("s", $eqptNewColg);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows()) {
            $stmt->bind_result($eqptNewColg);
            $stmt->fetch();
            //更新设备图片文件名
            $stmt->free_result();
            $query = "SELECT ImgPath FROM Equipments WHERE EqptID = ?";
            $stmt = $db->prepare($query);
            $stmt->bind_param("s", $eqptOldID);
            $stmt->execute();
            $stmt->bind_result($extName);
            $stmt->fetch();
            $extName = substr($extName, -4);
            $oldPath = $docRoot . "/images/eqpts/" . $eqptOldID . $extName;
            $newPath = $docRoot . "/images/eqpts/" . $eqptNewID . $extName;
            rename($oldPath, $newPath);
            //更新设备信息
            $stmt->free_result();
            $eqptImgNewPath = "../images/eqpts/" . $eqptNewID . $extName;
            $query = "UPDATE Equipments SET EqptID = ?, EqptName = ?, ClsName = ?, ColgName = ?, EqptCre = ?, ImgPath = ?, EqptDesc = ? WHERE EqptID = ?";
            $stmt = $db->prepare($query);
            $stmt->bind_param(
                "ssssssss",
                $eqptNewID,
                $eqptNewName,
                $eqptNewCls,
                $eqptNewColg,
                $eqptNewCre,
                $eqptImgNewPath,
                $eqptNewDesc,
                $eqptOldID
            );
            $stmt->execute();
        } else echo "3";
    } else echo "2";
} else {
    //更新ID，需要检测是否有同ID设备
    $query = "SELECT EqptID FROM Equipments WHERE EqptID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $eqptNewID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) echo "1";
    else {
        $query = "SELECT ClsName FROM Classification WHERE ClsAbrv = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("s", $eqptNewCls);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows()) {
            $stmt->bind_result($eqptNewCls);
            $stmt->fetch();
            //查询学院信息
            $query = "SELECT ColgName FROM Colleges WHERE ColgAbrv = ?";
            $stmt = $db->prepare($query);
            $stmt->bind_param("s", $eqptNewColg);
            $stmt->execute();
            $stmt->store_result();
            if ($stmt->num_rows()) {
                $stmt->bind_result($eqptNewColg);
                $stmt->fetch();
            //更新设备图片文件名
            $stmt->free_result();
            $query = "SELECT ImgPath FROM Equipments WHERE EqptID = ?";
            $stmt = $db->prepare($query);
            $stmt->bind_param("s", $eqptOldID);
            $stmt->execute();
            $stmt->bind_result($extName);
            $stmt->fetch();
            $extName = substr($extName, -4);
            $stmt->free_result();
            $oldPath = $docRoot . "/images/eqpts/" . $eqptOldID . $extName;
            $newPath = $docRoot . "/images/eqpts/" . $eqptNewID . $extName;
            rename($oldPath, $newPath);
            //更新设备信息
            $eqptImgNewPath = "../images/eqpts/" . $eqptNewID . $extName;
            $query = "UPDATE Equipments SET EqptID = ?, EqptName = ?, ClsName = ?, ColgName = ?, EqptCre = ?, ImgPath = ?, EqptDesc = ? WHERE EqptID = ?";
            $stmt = $db->prepare($query);
            $stmt->bind_param(
                "ssssssss",
                $eqptNewID,
                $eqptNewName,
                $eqptNewCls,
                $eqptNewColg,
                $eqptNewCre,
                $eqptImgNewPath,
                $eqptNewDesc,
                $eqptOldID
            );
            $stmt->execute();
            } else echo "3";
        } else echo "2";
    }
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>