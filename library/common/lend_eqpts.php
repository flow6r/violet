<?php
/*批量借用实验设备的脚本*/
//获取POST请求的数据
$userID = $_POST["userID"];
$userRole = $_POST["userRole"];
$eqpts = $_POST["eqpts"];
$lendBegn = $_POST["lendBegn"];
$lendEnd = $_POST["lendEnd"];
$applDesc = $_POST["applDesc"];
$applQty = count($eqpts);

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

//查询数据库，检查设备状态
for ($indx = 0; $indx < $applQty; $indx++) {
    $query = "SELECT EqptStat FROM Equipments WHERE EqptID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $eqpts[$indx]);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->bind_result($eqptStat);
        $stmt->fetch();
        if ($eqptStat === "已借出" || $eqptStat === "申请中") {
            echo "抱歉，您借用的设备中含有不符合借用状态的设备，请检查无误后再借用";
            exit;
        }
    } else {
        echo "查询设备状态时发生错误，请联系管理员并反馈问题";
        exit;
    }
    $stmt->free_result();
}

//创建新的设备申请记录
$applCre = date("Y-m-d H:i:s");
$applStat = "未处理";
$query = "INSERT INTO Applications VALUES(NULL,?,?,?,?,?,?,?,NULL,NULL)";
$stmt = $db->prepare($query);
$stmt->bind_param("sisssss", $userID, $applQty, $lendBegn, $lendEnd, $applDesc, $applCre, $applStat);
$stmt->execute();

//获取新创建的设备申请ID
$query = "SELECT LAST_INSERT_ID(ApplID) FROM Applications";
$stmt = $db->prepare($query);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($applID);
    $stmt->fetch();
    //创建新的设备借用记录并更新设备状态
    $eqptStat = "申请中";
    for ($indx = 0; $indx < $applQty; $indx++) {
        $query = "INSERT INTO Details VALUES(?,?)";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $applID, $eqpts[$indx]);
        $stmt->execute();
        $query = "UPDATE Equipments SET EqptStat = ? WHERE EqptID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $eqptStat, $eqpts[$indx]);
        $stmt->execute();
    }
} else echo "查询申请ID时发生错误，请联系管理员并反馈问题";

echo "successful";

//将数据保存未JSON格式并写入文件
// $lendEqptsJSON = json_encode($eqpts, JSON_UNESCAPED_UNICODE);
// file_put_contents("lendEqpts.json", $lendEqptsJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>