<?php
/*驳回单个设备借用申请的脚本*/
//获取POST请求数据
$dspUser = $_POST["dspUser"];
$userRole = $_POST["userRole"];
$applID = intval($_POST["applID"]);
$rjctRsn = $_POST["rjctRsn"];

//获取当前时间
$dspDate = date("Y-m-d H:i:s");

//引入数据库用户信息脚本
switch ($userRole) {
    case "教师":
        require_once("../dbuser/teacher.php");
        break;
    case "管理员":
        require_once("../dbuser/admin.php");
        break;
}

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}

//查询申请状态
$query = "SELECT ApplStat FROM Applications WHERE ApplID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $applID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($applStat);
    $stmt->fetch();
    if ($applStat === "已驳回") {
        $stmt->free_result();
        $db->close();
        echo "该申请已被驳回，请勿对同一申请重复执行驳回操作";
        exit;
    } else {
        //获取申请借用的用户邮箱
        $stmt->free_result();
        $query = "SELECT U.UserEmail FROM Users AS U, Applications AS A WHERE A.ApplID = ? AND U.UserID = A.UserID";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $applID);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows()) {
            $stmt->bind_result($userEmail);
            $stmt->fetch();
        } else {
            $stmt->free_result();
            $db->close();
            echo "查询用户邮箱时发生错误，请联系管理员并反馈问题";
            exit;
        }
        //获取该申请中的设备ID
        $stmt->free_result();
        $query = "SELECT EqptID FROM Details WHERE ApplID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("i", $applID);
        $stmt->execute();
        $result = $stmt->get_result();
        $eqptID = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->free_result();
    }
} else {
    $stmt->free_result();
    $db->close();
    echo "该申请不存在，请确认检查后再执行驳回操作";
    exit;
}

//更新申请状态
$applStat = "已驳回";
$query = "UPDATE Applications SET ApplStat = ?, DspUser = ?, DspDate = ? WHERE ApplID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("sssi", $applStat, $dspUser, $dspDate, $applID);
$stmt->execute();

//更新设备借用状态
$eqptStat = "未借出";
for ($indx = 0; $indx < count($eqptID); $indx++) {
    $query = "UPDATE Equipments SET EqptStat = ? WHERE EqptID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ss", $eqptStat, $eqptID[$indx]["EqptID"]);
    $stmt->execute();
}

//向申请人发送驳回邮件
// 引入PHPMailer的核心文件
require_once("../PHPMailer/PHPMailer.php");
require_once("../PHPMailer/SMTP.php");
// 实例化PHPMailer核心类
$mail = new PHPMailer\PHPMailer\PHPMailer();
// 是否启用smtp的debug进行调试 开发环境建议开启 生产环境注释掉即可 默认(0值)关闭debug调试模式
$mail->SMTPDebug = 0;
// 使用smtp鉴权方式发送邮件
$mail->isSMTP();
// smtp需要鉴权 这个必须是true
$mail->SMTPAuth = true;
// 链接qq域名邮箱的服务器地址
$mail->Host = "smtp.qq.com";
// 设置使用ssl加密方式登录鉴权
$mail->SMTPSecure = "ssl";
// 设置ssl连接smtp服务器的远程服务器端口号
$mail->Port = 465;
// 设置发送的邮件的编码
$mail->CharSet = "UTF-8";
// 设置发件人昵称 显示在收件人邮件的发件人邮箱地址前的发件人姓名
$mail->FromName = "m66rk9t";
// smtp登录的账号 QQ邮箱即可
$mail->Username = "3622495140@qq.com";
// smtp登录的密码 使用生成的授权码
$mail->Password = "perxtsgtgvdfdbib";
// 设置发件人邮箱地址 同登录账号
$mail->From = "3622495140@qq.com";
// 邮件正文是否为html编码 注意此处是一个方法
$mail->isHTML(true);
// 设置收件人邮箱地址,添加多个收件人 则多次调用方法即可
$mail->addAddress($userEmail);
// 添加该邮件的主题
$mail->Subject = "设备借用申请驳回通知";
// 添加邮件正文
$mail->Body = "<h1>您好，您提交的申请ID为".$applID."的申请被驳回</h1><br /><p>驳回原因：".$rjctRsn."</p>";
// 为该邮件添加附件
//$mail->addAttachment("./example.pdf");
// 发送邮件 返回状态
$status = $mail->send();

echo "successful";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>