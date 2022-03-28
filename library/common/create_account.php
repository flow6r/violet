<?php
//获取POST请求的数据
$userID = $_POST["userID"];
$userName = $_POST["userName"];
$userPasswd = $_POST["userPasswd"];
$userGen = $_POST["userGen"];
$userEmail = $_POST["userEmail"];
$userAdms = $_POST["userAdms"];
$mjrAbrv = $_POST["mjrAbrv"];

//加密密码
$userPasswd = password_hash($userPasswd, PASSWORD_BCRYPT);
//设置性别
$userGen = ($userGen === "male") ? "男" : "女";
//设置用户角色为学生
$userRole = "学生";
//格式化入学年份
$userAdms = intval($userAdms);

//引入数据库用户信息脚本
require_once("../dbuser/user.php");

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}

//查看用户是否已存在
$query = "SELECT UserID FROM Users WHERE UserID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $userID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) echo "该用户已存在";
else {
    //查询学院和班级信息
    $query = "SELECT ColgName, MjrName FROM Major WHERE MjrAbrv = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $mjrAbrv);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->bind_result($colgName, $mjrName);
        $stmt->fetch();
    }
    //将学生信息插入数据库表
    $query = "INSERT INTO Users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ssssssiss", $userID, $userName, $userPasswd, $userGen, $userRole, $userEmail, $userAdms, $colgName, $mjrName);
    $stmt->execute();
    echo "successful";
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>