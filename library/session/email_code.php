<?php
/*储存随机验证码会话的脚本*/
//启动会话
session_start();
//创建会话变量
$_SESSION["code"] = $code;
$_SESSION["userEmail"] = $userEmail;
?>