-- 以root用户登录数据库并执行以下查询

-- 创建数据库
CREATE DATABASE eems;

-- 选择eems数据库
USE eems;

-- 创建用户表
CREATE TABLE std (
    stdID CHAR(12) NOT NULL PRIMARY KEY,
    stdName CHAR(8) NOT NULL,
    stdPasswd CHAR(60) NOT NULL,
    stdGen ENUM('男','女') NULL,
    stdPN CHAR(11) NULL,
    stdEmail CHAR(100) NULL,
    stdUniv CHAR(50) NULL,
    stdColg CHAR(20) NULL,
    stdGrd CHAR(4) NULL,
    stdCls CHAR(20) NULL
);

CREATE TABLE tch (
    tchID CHAR(12) NOT NULL PRIMARY KEY,
    tchName CHAR(8) NOT NULL,
    tchPasswd CHAR(60) NOT NULL,
    tchGen ENUM('男','女') NULL,
    tchPN CHAR(11) NULL,
    tchEmail CHAR(100) NULL,
    tchUniv CHAR(50) NULL,
    tchColg CHAR(20) NULL
);

CREATE TABLE admin (
    adminID CHAR(12) NOT NULL PRIMARY KEY,
    adminName CHAR(8) NOT NULL,
    adminPasswd CHAR(60) NOT NULL,
    adminGen ENUM('男','女') NULL,
    adminPN CHAR(11) NULL,
    adminEmail CHAR(100) NULL,
    adminUniv CHAR(50) NULL,
    adminColg CHAR(20) NULL
);

-- 创建设备表
CREATE TABLE eqpt (
    eqptID CHAR(50) NOT NULL PRIMARY KEY,
    eqptName VARCHAR(100) NOT NULL PRIMARY KEY,
    eqptLoc INT(4) UNSIGNED NOT NULL,
    eqptCeate DATETIME NOT NULL,
    eqptStat ENUM('未借出','已借出','已损坏') NOT NULL,
    eqptDesc TEXT NULL
);

-- 创建设备申请表
CREATE TABLE apply (
    applyID INT(10) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userID CHAR(12) NOT NULL,
    userName CHAR(8) NOT NULL,
    eqptID CHAR(50) NOT NULL PRIMARY KEY,
    eqptName VARCHAR(100) NOT NULL PRIMARY KEY,
    lendDate DATETIME NOT NULL,
    expectDate DATETIME NOT NULL,
    applyStat ENUM('未处理','已处理') NOT NULL

    FOREIGN KEY (eqptID) REFERENCES eqpt(eqptID),
    FOREIGN KEY (eqptName) REFERENCES eqpt(eqptName)
);

-- 创建设备借用表
CREATE TABLE lend (
    lendID INT(10) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userID CHAR(12) NOT NULL,
    userName CHAR(8) NOT NULL,
    eqptID CHAR(50) NOT NULL PRIMARY KEY,
    eqptName VARCHAR(100) NOT NULL PRIMARY KEY,
    lendDate DATETIME NOT NULL,
    expectDate DATETIME NOT NULL,
    returnDate DATETIME NULL,
    lendStat ENUM('未归还','已归还') NOT NULL,

    FOREIGN KEY (eqptID) REFERENCES eqpt(eqptID),
    FOREIGN KEY (eqptName) REFERENCES eqpt(eqptName)
);

-- 创建报修设备表
CREATE TABLE repair (
    repairID INT(10) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userID CHAR(12) NOT NULL,
    userName CHAR(8) NOT NULL,
    eqptID CHAR(50) NOT NULL PRIMARY KEY,
    eqptName VARCHAR(100) NOT NULL PRIMARY KEY,
    createDate DATETIME NOT NULL

    FOREIGN KEY (eqptID) REFERENCES eqpt(eqptID),
    FOREIGN KEY (eqptName) REFERENCES eqpt(eqptName)
);

-- 创建数据库用户并赋予权限
-- 1. 学生用户对各表的权限
GRANT SELECT, INSERT, UPDATE ON eems.std TO 'studenttest'@'localhost' IDENTIFIED BY 'studenttest123';
GRANT SELECT ON eems.eqpt TO 'studenttest'@'localhost' IDENTIFIED BY 'studenttest123';
GRANT UPDATE ON eqpt.eqptStat TO 'studenttest'@'localhost' IDENTIFIED BY 'studenttest123';
GRANT SELECT, INSERT ON eems.apply TO 'studenttest'@'localhost' IDENTIFIED BY 'studenttest123';
GRANT SELECT, INSERT ON eems.lend TO 'studenttest'@'localhost' IDENTIFIED BY 'studenttest123';
GRANT UPDATE ON lend.returnDate TO 'studenttest'@'localhost' IDENTIFIED BY 'studenttest123';
GRANT UPDATE ON lend.lendStat TO 'studenttest'@'localhost' IDENTIFIED BY 'studenttest123';
-- 2. 教师用户对给表的权限
GRANT SELECT, INSERT, UPDATE ON eems.tch TO 'teachertest'@'localhost' IDENTIFIED BY 'teachertest123';
GRANT SELECT, INSERT, UPDATE, DELETE ON eems.std TO 'teachertest'@'localhost' IDENTIFIED BY 'teachertest123';
GRANT SELECT, INSERT, UPDATE, DELETE ON eems.eqpt TO 'teachertest'@'localhost' IDENTIFIED BY 'teachertest123';
GRANT SELECT, INSERT ON eems.apply TO 'teachertest'@'localhost' IDENTIFIED BY 'teachertest123';
GRANT SELECT, INSERT ON eems.lend TO 'teachertest'@'localhost' IDENTIFIED BY 'teachertest123';
GRANT UPDATE ON lend.returnDate TO 'teachertest'@'localhost' IDENTIFIED BY 'teachertest123';
GRANT UPDATE ON lend.lendStat TO 'studenttest'@'localhost' IDENTIFIED BY 'studenttest123';
-- 3. 管理员用户对各表的权限
GRANT SELECT, INSERT, UPDATE, DELETE ON eems.* TO 'admintest'@'localhost' IDENTIFIED BY 'admintest123';

-- 刷新权限
FLUSH PRIVILEGES;

-- 插入测试数据
-- 插入用户信息

-- 插入器材设备信息