<?php
/*查询更新后的用户信息*/
//获取POST请求的数据
$userID = $_GET["userID"];
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
    // 引入创建储存用户信息会话的脚本
    require_once("../session/user_login.php");
    //将会话变量转换成JSON数据返回给浏览器端
    $userInfoJSON = json_encode($_SESSION["userInfo"], JSON_UNESCAPED_UNICODE);
    echo $userInfoJSON;
}
//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>