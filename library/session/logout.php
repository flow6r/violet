<?php
/*注销用户的脚本*/
//启动会话
session_start();
//销毁所有会话变量
$_SESSION = array();
//销毁会话ID
session_destroy();
header("location:../../login.html");
?>