<?php
/*验证用户密码的脚本*/
//启动会话
session_start();

//获取POST请求的数据并验证密码
$currUserPasswd = $_POST["userPasswd"];
$userPasswd = $_SESSION["userInfo"]["userPasswd"];
if (password_verify($currUserPasswd, $userPasswd)) {
    echo "valid";
} else {
    echo "invalid";
}

exit;
?>