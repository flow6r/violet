<?php
/*判断是否已登录用户*/
//启动会话
session_start();
if (!isset($_SESSION["user_info"])) {
    header("location:../login.html");
}
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>用户面板</title>
    <link href="../styles/panel.css" type="text/css" rel="stylesheet" />
</head>

<body>
    <div id="panel">
        <div id="userBar">
            <div id="logo"><a id="logoText" href="#">violet</a></div>
            <div id="userName"><a id="userNameText" href="#">你好，<?php echo $_SESSION["user_info"]["name"];?></a></div>
            <form id="logoutForm" action="../library/session/logout.php" method="post"><input id="logoutBtn" type="submit" value="注销"/></form>
        </div>
        <div id="userInfoDiv">
            <div id="tipTextDiv"><span id="tipText">个人信息</span></div>
            <p class="info">学号：<?php echo $_SESSION["user_info"]["id"];?></p>
            <p class="info">姓名：<?php echo $_SESSION["user_info"]["name"];?></p>
            <p class="info">性别：<?php echo $_SESSION["user_info"]["gen"];?></p>
            <p class="info">手机号：<?php echo $_SESSION["user_info"]["pn"];?></p>
            <p class="info">邮箱：<?php echo $_SESSION["user_info"]["email"];?></p>
            <p class="info">学校：<?php echo $_SESSION["user_info"]["univ"];?></p>
            <p class="info">学院：<?php echo $_SESSION["user_info"]["colg"];?></p>
            <p class="info">入学年份：<?php echo $_SESSION["user_info"]["grd"];?></p>
            <p class="info">班级：<?php echo $_SESSION["user_info"]["cls"];?></p>
        </div>
    </div>
    <div id="footer"></div>
</body>

</html>