<?php
/*销毁随机验证码会话的脚本*/
//销毁会话变量
unset($_SESSION["code"]);
unset($_SESSION["email"]);
?>