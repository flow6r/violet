<?php
/*查询报修设备记录的脚本*/
//获取GET请求的数据
$userID = $_GET["userID"];
$userRole = $_GET["userRole"];
$colgName = $_GET["colgName"];
$searchItem = $_GET["searchItem"];
$searchType = $_GET["searchType"];

//设置查询关键词
$searchItem = "%" . $searchItem . "%";

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

//设置查询类型和关键词
$fromTblEqpt = false;
switch ($searchItem) {
    case "brkID":
        $searchItem = "BrkID";
        break;
    case "userID":
        $searchItem = "UserID";
        break;
    case "eqptID":
        $searchItem = "EqptID";
        break;
    case "eqptName":
        $searchItem = "EqptName";
        $fromTblEqpt = true;
        break;
    case "clsName":
        $searchItem = "ClsName";
        $fromTblEqpt = true;
        break;
    case "brkStat":
        $searchItem = "BrkStat";
        break;
    case "dspUser":
        $searchItem = "DspUser";
        break;
}

//查询数据库
switch ($userRole) {
    case "学生":
        if (!$fromTblEqpt) $query = "SELECT * FROM Breakages WHERE UserID = ? AND " . $searchType . " LIKE ?";
        else $query = "SELECT B.* FROM Equipments AS E, Breakages AS B WHERE E.EqptID = B.EqptID AND B.UserID = ? AND E." . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $userID, $searchItem);
        break;
    case "教师":
        if (!$fromTblEqpt) $query = "SELECT B.* FROM Users AS U, Breakages AS B WHERE U.UserID = B.UserID AND U.ColgName = ? AND U.UserRole != '管理员' AND B." . $searchType . " LIKE ?";
        else $query = "SELECT B.* FROM Users AS U, Equipments AS E, Breakages AS B WHERE U.UserID = B.UserID AND E.EqptID = B.EqptID AND U.ColgName = ? AND U.UserRole != '管理员' AND E." . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $colgName, $searchItem);
    case "管理员":
        if (!$fromTblEqpt) $query = "SELECT B.* FROM Users AS U, Breakages AS B WHERE U.UserID = B.UserID AND U.ColgName = ? AND B." . $searchType . " LIKE ?";
        else $query = "SELECT B.* FROM Users AS U, Equipments AS E, Breakages AS B WHERE U.UserID = B.UserID AND E.EqptID = B.EqptID AND U.ColgName = ? AND E.".$searchType." LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $colgName, $searchItem);

}
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$breakages = $result->fetch_all(MYSQLI_ASSOC);
$breakagesJSON = json_encode($breakages, JSON_UNESCAPED_UNICODE);
echo $breakagesJSON;

//将JSON写入文件
// file_put_contents("breakages.json", $breakagesJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
