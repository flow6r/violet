<?php
/*验证邮件验证码的脚本*/
//获取POST请求的数据
$code = $_POST["code"];
//启动会话
session_start();
if ($code === strval($_SESSION["code"])) echo "valid";
else echo "invalid";
?>