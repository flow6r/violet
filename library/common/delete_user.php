<?php
/*删除用户的脚本*/
//获取POST请求的数据
$userRole = $_POST["userRole"];
$userID = $_POST["userID"];

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

//查询数据库
$query = "SELECT * FROM Users WHERE UserID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $userID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->free_result();
    $query = "DELETE FROM Users WHERE UserID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $userID);
    $stmt->execute();
} else {
    echo "查询数据库时发生错误，ID为的用户不存在，请检查无误后再执行删除操作";
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