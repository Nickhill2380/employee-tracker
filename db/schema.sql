DROP DATABASE IF EXISTS employeeDB;
DROP TABLE IF EXISTS department; 
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;

CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
    id INT AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INTEGER AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL UNSIGNED NOT NULL,
    department_id int,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL,
    PRIMARY KEY(id) 
);

CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id int,
    manager_id int,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    PRIMARY KEY(id)
);