-- Login as root user and execute the following queries.

-- Create database.
CREATE DATABASE EEMS;

-- Select EEMS database.
USE EEMS;

-- Create tables.
CREATE TABLE Users_STD (
    Student_ID CHAR(12) NOT NULL PRIMARY KEY,
    Name CHAR(8) NOT NULL,
    Password CHAR(60) NOT NULL,
    Gender ENUM('男','女','间性') NULL,
    PN CHAR(11) NULL,
    Email CHAR(100) NULL,
    University VARCHAR(50) NULL,
    College CHAR(20) NULL,
    Grade CHAR(4) NULL,
    Class VARCHAR(20) NULL
);

CREATE TABLE Users_TCH (
    Teacher_ID CHAR(10) NOT NULL PRIMARY KEY,
    Name CHAR(8) NOT NULL,
    Password CHAR(60) NOT NULL,
    Gender ENUM('男','女','间性') NULL,
    PN CHAR(11) NULL,
    Email CHAR(100) NULL,
    University VARCHAR(50) NULL,
    College CHAR(20) NULL
);

CREATE TABLE Users_ADMIN (
    Admin_ID CHAR(10) NOT NULL PRIMARY KEY,
    Name CHAR(8) NOT NULL,
    Password CHAR(60) NOT NULL,
    Gender ENUM('男','女','间性') NULL,
    PN CHAR(11) NULL,
    Email CHAR(100) NULL,
    University VARCHAR(50) NULL,
    College CHAR(20) NULL
);

-- Create database users.
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE ON EEMS.Users_STD TO 'student_test@localhost' IDENTIFIED BY 'studenttest123';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE ON EEMS.Users_TCH TO 'teacher_test@localhost' IDENTIFIED BY 'teachertest123';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE ON EEMS.Users_ADMIN TO 'admin_test@localhost' IDENTIFIED BY 'admintest123';

-- Flush privileges.
FLUSH PRIVILEGES;