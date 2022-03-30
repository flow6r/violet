<?php
/*查询用户信息的脚本*/
//获取GET请求的数据
$userRole = $_GET["userRole"];
$mjrName = $_GET["mjrName"];
$colgName = $_GET["colgName"];
$trgtRole = $_GET["trgtRole"];
$searchItem = $_GET["searchItem"];
$searchType = $_GET["searchType"];

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

//设置查询关键词
$searchItem = "%" . $searchItem . "%";

//设置查询类型和关键词
switch ($searchType) {
    case "userID":
        $searchType = "UserID";
        break;
    case "userName":
        $searchType = "UserName";
        break;
    case "userGen":
        $searchType = "UserGen";
        break;
    case "userAdms":
        $searchType = "UserAdms";
        break;
    case "mjrName":
        $searchType = "MjrName";
        break;
}

//设置查询角色
switch ($trgtRole) {
    case "std":
        $trgtRole = "学生";
        break;
    case "tch":
        $trgtRole = "教师";
        break;
    default:
        echo "设置查询角色时发生错误，请联系管理员并反馈问题";
        $db->close();
        exit;
}

//查询数据库
switch ($userRole) {
    case "教师":
        $query = "SELECT * FROM Users WHERE MjrName = ? AND UserRole = ? AND " . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("sss", $mjrName, $trgtRole, $searchItem);
        break;
    case "管理员":
        $queru = "SELECT * FROM Users WHERE ColgName = ? AND UserRole = ? AND " . $searchType . " LIKE ?";
        $stmt = $db->prepare($queru);
        $stmt->bind_param("sss", $colgName, $trgtRole, $searchItem);
}
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$users = $result->fetch_all(MYSQLI_ASSOC);
$usersJSON = json_encode($users, JSON_UNESCAPED_UNICODE);
echo $usersJSON;

//将JSON写入文件
// file_put_contents("users.json", $usersJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
