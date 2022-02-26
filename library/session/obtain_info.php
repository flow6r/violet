<?php
/*获取用户信息的脚本*/
//启动会话
session_start();
if (!isset($_SESSION["userInfo"])) {
    $error = ["error"=>"启动会话时发生错误，请联系管理员并反馈问题"];
    $errorJSON = json_encode($error, JSON_UNESCAPED_UNICODE);
    echo $errorJSON;
    exit;
}
//将会话变量转换成JSON数据返回给浏览器端
$userInfoJSON = json_encode($_SESSION["userInfo"], JSON_UNESCAPED_UNICODE);
echo $userInfoJSON;
?>