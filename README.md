# VIOLET 实验器材管理系统

## 数据库设计

### 数据库表
#### 学院信息表(Colleges)
|字段|类型|主/外键|是否可空|描述|
|-|-|-|-|-|
|ColgName|VARCHAR(20)|主键|否|学院名称|
|ColgAbrv|CHAR(10)|-|否|学院名称简称|
#### 专业信息表(Major)
|字段|类型|主/外键|是否可空|描述|
|-|-|-|-|-|
|ColgName|VARCHAR(20)|外键|否|学院名称|
|MjrName|VARCHAR(20)|主键|否|专业名称|
|MjrAbrv|CHAR(10)|-|否|专业名称简称|
#### 用户信息表(Users)
|字段|类型|主/外键|是否可空|描述|
|-|-|-|-|-|
|UserID|CHAR(15)|主键|否|用户ID|
|UserName|CHAR(20)|-|否|用户姓名|
|UserPasswd|CHAR(60)|-|否|用户密码|
|UserGen|ENUM|-|否|用户性别|
|UserRole|ENUM|-|否|用户角色|
|UserEmail|CHAR(100)|-|否|用户电子邮箱|
|UserAdms|INT(4) UNSIGNED|-|是|学生入学年份|
|ColgName|VARCHAR(20)|外键|否|用户隶属学院名称|
|MjrName|VARCHAR(20)|外键|否|用户隶属专业名称|
#### 设备信息表(Equipments)
|字段|类型|主/外键|是否可空|描述|
|-|-|-|-|-|
|EqptID|CHAR(50)|主键|否|设备ID|
|EqptName|VARCHAR(100)|-|否|设备名称|
|ColgName|VARCHAR(20)|外键|否|设备隶属学院名称|
|EqptCre|DATETIME|-|否|设备入库时间|
|EqptDesc|TEXT|-|否|设备描述|
|EqptStat|ENUM|-|否|设备状态|
#### 设备申请表(Applications)
|字段|类型|主/外键|是否可空|描述|
|-|-|-|-|-|
|ApplID|INT(5) UNSIGNED|主键|否|用户设备申请ID|
|UserID|CHAR(15)|外键|否|用户ID|
|ApplQty|INT(4) UNSIGNED|-|否|申请设备的数量|
|LendBegn|DATETIME|-|否|设备借用开始时间|
|LendEnd|DATETIME|-|否|设备借用结束时间|
|ApplDesc|TEXT|-|否|申请说明|
|ApplCre|DATETIME|-|否|申请创建的时间|
|ApplStat|ENUM|-|否|申请的状态|
|DspUser|CHAR(15)|-|是|处理人ID|
|DspDate|DATETIME|-|是|处理时间|
#### 申请明细表(Details)
|字段|类型|主/外键|是否可空|描述|
|-|-|-|-|-|
|ApplID|INT(5) UNSIGNED|外键|否|用户设备申请ID|
|EqptID|CHAR(50)|外键|否|设备ID|
#### 设备借用表(Lend)
|字段|类型|主/外键|是否可空|描述|
|-|-|-|-|-|
|UserID|CHAR(15)|外键|否|用户ID|
|EqptID|CHAR(50)|外键|否|设备ID|
|LendBegn|DATETIME|-|否|设备借用开始时间|
|LendEnd|DATETIME|-|否|设备借用结束时间|
|LendStat|ENUM|-|否|设备借用状态|
|LendRtn|DATETIME|-|否|设备实际归还时间|
#### 设备报修表(Breakages)
|字段|类型|主/外键|是否可空|描述|
|-|-|-|-|-|
|BrkID|INT(3) UNSIGNED|主键|否|设备报修ID|
|ColgName|VARCHAR(20)|外键|否|设备隶属学院名称|
|UserID|CHAR(15)|外键|否|提交报修的用户ID|
|EqptID|CHAR(50)|外键|否|损坏设备的ID|
|BrkCre|DATETIME|-|否|报修申请创建的时间|
|BrkStat|ENUM|-|否|报修的状态|
|DspUser|CHAR(15)|-|是|处理人ID|
|DspDate|DATETIME|-|是|处理时间|
### 数据库用户
+ user
+ students
+ teacher
+ admin
#### 用户权限