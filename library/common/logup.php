<?php
if (isset($_POST["id"]) && isset($_POST["name"]) &&isset($_POST["passwd"])) {   //检查表单域是否存在
    /*获取表单域信息*/
    //获取用户输入的信息
    $userID = $_POST["id"];
    $name = $_POST["name"];
    $passwd = $_POST["passwd"];
    //加密密码
    $passwd = password_hash($passwd, PASSWORD_BCRYPT);

    /*连接数据库，插入用户数据*/
    //连接数据库
    require_once("../dbuser/student.php");
    $db = mysqli_connect($db_server, $db_user_name, $db_passwd, $db_name);
    //检查连接
    if (mysqli_connect_error()) {
        echo "<script type='text/javascript'>alert('错误：连接数据库失败，请联系管理员并反馈问题。');</script>";
        echo "<script type='text/javascript'>window.location.href='../../login.html';</script>";
    }
    //设置查询语句
    $query = "INSERT INTO Users_STD VALUES (?, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)";
    $stmt = $db->prepare($query);
    //绑定查询参数
    $stmt->bind_param("sss", $userID, $name, $passwd);
    //执行查询
    $stmt->execute();
    //关闭链接
    $db->close();

    //注册成功，跳转至用户面板页面
    header("location:../../pages/panel.php");
} else {    //跳转至登录界面
    header(("location:../../login.html"));
}
?>