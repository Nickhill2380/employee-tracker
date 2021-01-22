SELECT first_name, last_name, title
    FROM employee
    INNER JOIN role ON employee.role_id = role.id;
    