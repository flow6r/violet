<?php
/*新增学生用户记录的脚本*/
//获取POST请求的数据
$procRole = $_POST["procRole"];
$userID = $_POST["userID"];
$userName = $_POST["userName"];
$userGen = $_POST["userGen"];
$userEmail = $_POST["userEmail"];
$userAmds = intval($_POST["userAdms"]);
$colgName = $_POST["colgName"];
$mjrName = $_POST["mjrName"];

//加密密码
$userPasswd = password_hash("user" . $userID, PASSWORD_BCRYPT);
//设置性别
$userGen = ($userGen === "male") ? "男" : "女";
//设置用户角色为学生
$userRole = "学生";

//引入数据库用户信息脚本
switch ($procRole) {
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

//查询数据库检查是否存在同ID用户
$query = "SELECT * FROM Users WHERE UserID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $userID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) echo "学生ID为的学生用户已存在，请检查无误后再创建新的学生用户";
else {
    $query = "INSERT INTO Users VALUES(?,?,?,?,?,?,?,?,?)";
    $stmt = $db->prepare($query);
    $stmt->bind_param(
        "ssssssiss",
        $userID,
        $userName,
        $userPasswd,
        $userGen,
        $userRole,
        $userEmail,
        $userAmds,
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