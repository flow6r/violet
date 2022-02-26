<?php
/*保存用户信息的脚本*/
//启动会话
session_start();
//创建存储用户信息的数组
$userInfo = array(
    "userID" => $userID,
    "userName" => $userName,
    "userPasswd" => $userPasswd,
    "userGen" => $userGen,
    "userRole" => $userRole,
    "userEmail" => $userEmail,
    "userAdms" => $userAdms,
    "colgName" => $colgName,
    "mjrName" => $mjrName
);
//创建会话变量
$_SESSION["userInfo"] = $userInfo;
?>