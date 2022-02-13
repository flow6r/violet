<?php
/*检查表单域*/
if (!isset($_POST["email"])) {
    //返回验证邮箱页面
    echo "<script type='text/javascript'>window.location.href='../../pages/forget.html';</script>";
} else {
    //获取表单域数据
    $email = $_POST["email"];

    /*连接数据库查询电子邮箱是否已与现有账户绑定*/
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
    $query = "SELECT * FROM Users_STD WHERE Email = ?";
    $stmt = $db->prepare($query);
    //绑定参数
    $stmt->bind_param("s", $email);
    //执行查询
    $stmt->execute();
    //缓存查询结果数据行
    $stmt->store_result();
    $exist = $stmt->num_rows();
    //释放结果集
    $stmt->free_result();
    //关闭链接
    $db->close();
    //判断用户是否存在
    if ($exist) {    //当前邮箱已被绑定
        //生成随机数作邮件验证码
        $code = rand(10000, 99999);
        //发送随机验证码至指定的电子邮箱地址
        require_once("../PHPMailer/SendEmail.php");
        //创建会话变量，储存随机验证码
        require_once("../session/code_reset.php");
        //跳转至重置密码页面
        header("location:../../pages/reset.html");
    } else {    //用户不存在
        echo "<script type='text/javascript'>alert('当前邮箱未被绑定，请输入正确的邮箱地址');</script>";
        echo "<script type='text/javascript'>window.location.href='../../pages/forget.html';</script>";
    }
}
?>