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
        echo "<script type='text/javascript'>alert('错误：连接数据库失败，请联系管理员并反馈问题');</script>";
        echo "<script type='text/javascript'>window.location.href='../../login.html';</script>";
    }
    /*检查该用户是否已存在*/
    //设置查询语句
    $query = "SELECT * FROM Users_STD WHERE Student_ID = ?";
    $stmt = $db->prepare($query);
    //绑定查询参数
    $stmt->bind_param("s", $userID);
    //执行查询
    $stmt->execute();
    //缓存查询结果数据行
    $stmt->store_result();
    //判断用户是否存在
    if ($stmt->num_rows()) { //该用户已存在
        //释放结果集
        $stmt->free_result();
        //关闭链接
        $db->close();
        echo "<script type='text/javascript'>alert('错误：该用户已存在，请重新注册或联系联系管理员');</script>";
        echo "<script type='text/javascript'>window.location.href='../../login.html';</script>";
    } else {    //该ID可被注册
        /*创建新用户*/
        //设置查询语句
        $query = "INSERT INTO Users_STD VALUES (?, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)";
        $stmt = $db->prepare($query);
        //绑定查询参数
        $stmt->bind_param("sss", $userID, $name, $passwd);
        //执行查询
        $stmt->execute();
        //关闭链接
        $db->close();
    
        /*注册成功，跳转至用户面板页面*/
        header("location:../../pages/panel.php");
    }
} else {    //跳转至登录界面
    header(("location:../../login.html"));
}
?>