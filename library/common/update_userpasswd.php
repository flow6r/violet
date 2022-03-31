<?php
/*更新用户密码的脚本*/
//获取POST请求的数据
$userRole = $_POST["userRole"];
$userID = $_POST["userID"];
$userPasswd = $_POST["userPasswd"];

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

//加密密码
$userPasswd = password_hash($userPasswd, PASSWORD_BCRYPT);

//查询数据库
$query = "SELECT * FROM Users WHERE UserID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $userID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->free_result();
    $query = "UPDATE Users SET UserPasswd = ? WHERE UserID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ss", $userPasswd, $userID);
    $stmt->execute();
} else {
    echo "查询用户信息时发生错误，请联系管理员并反馈问题";
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