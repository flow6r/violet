<?php
/*查询设备借用记录的脚本*/
//获取GET请求的数据
$userID = $_GET["userID"];
$userRole = $_GET["userRole"];
$mjrName = $_GET["mjrName"];
$searchItem = $_GET["searchItem"];
$searchType = $_GET["searchType"];

//设置查询关键词
$searchItem = "%" . $searchItem . "%";

$fromTblUsers = false;

//设置查询类型和关键词
switch ($searchType) {
    case "userID":
        $searchType = "UserID";
        break;
    case "eqptID":
        $searchType = "EqptID";
        break;
    case "lendStat":
        $searchType = "LendStat";
        break;
    case "mjrName":
        $searchType = "MjrName";
        $fromTblUsers = true;
        break;
    case "colgName":
        $searchType = "ColgName";
        $fromTblUsers = true;
        break;
}

//引入数据库用户信息脚本
switch ($userRole) {
    case "学生":
        require_once("../dbuser/student.php");
        break;
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

//根据用户角色查询数据库
switch ($userRole) {
    case "学生":
        $query = "SELECT L.* FROM Lend AS L WHERE L.UserID = ? AND L." . $searchType . "LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $userID, $searchItem);
        break;
    case "教师":
        $query = "SELECT L.* FROM Users AS U, Lend AS L WHERE U.UserID = L.UserID AND U.MjrName = ? AND L." . $searchType . " LIKE ? AND U.UserRole != '管理员'";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $mjrName, $searchItem);
        break;
    case "管理员":
        if ($fromTblUsers) $query = "SELECT L.* FROM Users AS U, Lend AS L WHERE U.UserID = L.UserID AND U." . $searchType . " LIKE ?";
        else $query = "SELECT L.* FROM Lend AS L WHERE L." . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("s", $searchItem);
        break;
}
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$lendRecords = $result->fetch_all(MYSQLI_ASSOC);
$lendRecordsJSON = json_encode($lendRecords, JSON_UNESCAPED_UNICODE);
echo $lendRecordsJSON;

//将JSON写入文件
// file_put_contents("lend.json", $lendRecordsJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>