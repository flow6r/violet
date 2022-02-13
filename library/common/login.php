<?php
if (isset($_POST["id"]) && isset($_POST["passwd"])) {   //检查表单域是否存在
    /*获取表单域数据*/
    $userID = $_POST["id"];
    $passwd = $_POST["passwd"];
    
    //引入数据库用户信息脚本
    require_once("../dbuser/student.php");
    
    /*连接数据库，查询用户信息*/
    $db = mysqli_connect($db_server, $db_user_name, $db_passwd, $db_name);
    //检查连接
    if (mysqli_connect_error()) {
        echo "<script type='text/javascript'>alert('错误：连接数据库失败，请联系管理员并反馈问题');</script>";
        echo "<script type='text/javascript'>window.location.href='../../login.html';</script>";
    }
    //设置查询语句
    $query = "SELECT * FROM Users_STD WHERE Student_ID = ?";
    $stmt = $db->prepare($query);
    //绑定参数
    $stmt->bind_param("s", $userID);
    //执行查询
    $stmt->execute();
    //缓存查询结果数据行
    $stmt->store_result();
    //判断用户是否存在
    if ($stmt->num_rows()) {    //用户存在
        //设置与查询结果进行绑定的变量
        $stmt->bind_result($user_id, $user_name, $user_passwd, $user_gen, $user_pn, $user_email, $user_univ, $user_colg, $user_grd, $user_cl);
        //绑定查询结果
        $stmt->fetch();
        //判断密码是否正确
        if (password_verify($passwd, $user_passwd)) {    //密码正确
            header("location:../../pages/panel.html");
        } else {    //密码错误
            echo "<script type='text/javascript'>alert('密码错误，请检查密码');</script>";
            echo "<script type='text/javascript'>window.location.href='../../login.html';</script>";    
        }
    } else {    //用户不存在
        echo "<script type='text/javascript'>alert('该用户不存在，请先注册用户');</script>";
        echo "<script type='text/javascript'>window.location.href='../../login.html';</script>";
    }
    //释放结果集
    $stmt->free_result();
    //关闭链接
    $db->close();
} else {    //跳转至登录界面
    header("location:../../login.html");
}
?>