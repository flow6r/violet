<?php
/*新增教师用户记录的脚本*/
//获取POST请求的数据
$procRole = $_POST["procRole"];
$userID = $_POST["userID"];
$userName = $_POST["userName"];
$userGen = $_POST["userGen"];
$userEmail = $_POST["userEmail"];
$colgName = $_POST["colgName"];
$mjrName = $_POST["mjrName"];

//加密密码
$userPasswd = password_hash("user" . $userID, PASSWORD_BCRYPT);
//设置性别
$userGen = ($userGen === "male") ? "男" : "女";
//设置用户角色为教师
$userRole = "教师";

//引入数据库用户信息脚本
require_once("../dbuser/admin.php");

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}

//查询数据库检查是否存在同ID用户
$query = "SELECT * FROM Users WHERE UserID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $userID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) echo "教师ID为的教师用户已存在，请检查无误后再创建新的教师用户";
else {
    $query = "INSERT INTO Users VALUES(?,?,?,?,?,?,NULL,?,?)";
    $stmt = $db->prepare($query);
    $stmt->bind_param(
        "ssssssss",
        $userID,
        $userName,
        $userPasswd,
        $userGen,
        $userRole,
        $userEmail,
        $colgName,
        $mjrName
    );
    $stmt->execute();
 
    echo "successful";
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>