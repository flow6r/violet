<?php
/*批量删除用户的脚本*/
//获取POST请求的数据
$userRole = $_POST["userRole"];
$userIDs = $_POST["userIDs"];

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
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}

//声明无法删除的用户的数组
$canDel = true;
$cantDelUserIDs = array();
$cantDelUserIDIndx = 0;

//检查用户是否存在
for ($indx = 0; $indx < count($userIDs); $indx++) {
    $query = "SELECT * FROM Users WHERE UserID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $userIDs[$indx]);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows() === 0) {
        $canDel = false;
        $cantDelUserIDs[$cantDelUserIDIndx++] = $userIDs[$indx];
    }
    $stmt->free_result();
}

if ($canDel) {
    for ($indx = 0; $indx < count($userIDs); $indx++) {
        $query = "DELETE FROM Users WHERE UserID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("s", $userIDs[$indx]);
        $stmt->execute();
    }
} else {
    $tips = null;
    for ($indx = 0; $indx < count($cantDelUserIDs); $indx++) {
        $tips .= "\n用户ID：" . $cantDelUserIDs[$indx];
    }
    echo "查询数据库时发生错误，以下用户不存在：\n请检查无误后再执行批量删除操作";
    $stmt->free_result();
    $db->close();
    exit;
}

echo "successful";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>