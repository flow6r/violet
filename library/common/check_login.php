<?php
/*检查登录用户的信息的脚本*/
//获取POST请求的数据
$userID = $_POST["userID"];
$passwd = $_POST["userPasswd"];
//引入数据库用户信息脚本
require_once("../dbuser/user.php");
//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}
//查询数据库
$query = "SELECT * FROM Users where UserID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $userID);
$stmt->execute();
//储存查询数据行
$stmt->store_result();
//检查查询结果
if ($stmt->num_rows()) {
    //绑定查询结果参数
    $stmt->bind_result($userID, $userName, $userPasswd, $userGen, $userRole, $userEmail, $userAdms, $colgName, $mjrName);
    //获取查询结果
    $stmt->fetch();
    //判断密码是否正确
    if (password_verify($passwd, $userPasswd)) {
        echo "valid";
        // 引入创建储存用户信息会话的脚本
        require_once("../session/user_login.php");
    } else {
        echo "密码错误，请检查密码";
    }
} else {
    echo "该用户不存在，请注册后再登录";
}
//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>