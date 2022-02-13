<?php
/*保存学生用户信息的会话的脚本*/
//启动会话
session_start();
//创建学生信息数组
$user_info = array(
    "id" => $user_id,
    "name" => $user_name,
    "gen" => $user_gen,
    "pn" => $user_pn,
    "email" => $user_email,
    "univ" => $user_univ,
    "colg" => $user_colg,
    "grd" => $user_grd,
    "cls" => $user_cls
);
//创建会话变量
$_SESSION["user_info"] = $user_info;
?>