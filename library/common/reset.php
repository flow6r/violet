<?php
/*检查会话变量*/
//启动会话
session_start();
if (isset($_SESSION["code"])) {
    if (!strcmp($_POST["code"], strval($_SESSION["code"]))) {
        /*获取电子邮箱地址*/
        $email = $_SESSION["email"];
        /*加密密码*/
        $passwd = $_POST["passwd"];
        $passwd = password_hash($passwd, PASSWORD_BCRYPT);
        /*连接数据库，修改用户密码*/
        //引入数据库用户信息脚本
        require_once("../dbuser/student.php");
        //连接数据库
        $db = mysqli_connect($db_server, $db_user_name, $db_passwd, $db_name);
        //检查连接
        if (mysqli_connect_error()) {
            echo "<script type='text/javascript'>alert('错误：连接数据库失败，请联系管理员并反馈问题。');</script>";
            echo "<script type='text/javascript'>window.location.href='../../pages/forget.html';</script>";
        }
        //设置查询语句
        $query = "UPDATE Users_STD SET Password = ? WHERE Email = ?";
        //预处理
        $stmt = $db->prepare($query);
        //绑定查询参数
        $stmt->bind_param("ss", $passwd, $email);
        //执行查询
        $stmt->execute();
        //缓存查询结果数据行
        $stmt->store_result();
        //判断是否修改成功
        if (!$stmt->num_rows()) {
            echo "<script type='text/javascript'>alert('错误：查询数据库失败，请联系管理员并反馈问题');</script>";
        }
        //释放结果集
        $stmt->free_result();
        //关闭链接
        $db->close();
        /*销毁会话*/
        require_once("../session/destory_code_reset.php");
        /*跳转至用户登陆界面*/
        header("location:../../login.html");
    } else {    //验证码错误，跳转至重置密码页面
        echo "<script type='text/javascript'>alert('验证码错误，请输入正确的验证码');</script>";
        echo "<script type='text/javascript'>window.location.href='../../pages/reset.html';</script>";
    }
} else {    //未验证邮箱，跳转至验证邮箱页面
    echo "<script type='text/javascript'>window.location.href='../../pages/forget.html';</script>";
}
?>