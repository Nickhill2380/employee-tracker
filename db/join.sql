SELECT first_name, last_name, title
    FROM employee
    INNER JOIN role ON employee.role_id = role.id;
    


    SELECT * FROM EMPLOYEE AS EMPLOYEE
    JOIN EMPLOYEE AS manager_id
    ON EMPLOYEE.manager_id = manager.id


roleChoices = []

connection.query(`SELECT title FROM role`) function (err,res){

    roleChoices.push(res);

}

`SELECT department.name, SUM(role.salary) totalBudget
                 FROM role
                 LEFT JOIN department ON role.department_id = department.id
                 WHERE role.department_id = ?`;


