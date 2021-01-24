const {connection, promptUser } = require('./server');

const allEmployees = () => {
    const sql = 
    `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
     FROM employee
     LEFT JOIN role ON employee.role_id = role.id
     LEFT JOIN department ON role.department_id = department.id
     LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;
    
    connection.query(sql, function(err,res) {
        if (err) throw err;
        console.table(res);
        promptUser();
    })
    
};

const allEmployeesByDepartment = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, ' ',manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    ORDER BY department.name`
    
    connection.query(sql, function(err, res) {
        if(err) throw err;
        console.table(res);
        promptUser();
    })
    
};

const addEmployee = (first_name, last_name, id, managerId) => {
   console.log('Adding new employee.');
   connection.query(
       'INSERT INTO employee SET ?',
       {
           first_name: first_name,
           last_name: last_name,
           role_id: id,
           manager_id: managerId
       },
       function(err,res) {
           if(err) throw err;
           console.log(res.affectedRows + ' employee added.');
           console.table(res)
           promptUser();
       }
   )
};

const removeEmployee = (name) => {
    nameSplitter = name.split(" ");
    const sql = 'DELETE FROM employee WHERE first_name = ? AND last_name = ?';
    connection.query(sql,
         [nameSplitter[0], nameSplitter[1]]
        ,  function(err, res) {
            if(err) throw err;
            console.log(res.affectedRows + ' employee removed.')
            promptUser();
        });   
};

const viewRoles = () => {
    connection.query(
        `SELECT role.id, role.title, role.salary, department.name
         FROM role
         LEFT JOIN department ON role.department_id = department.id`, 
        function(err,res) {
        if(err) throw err;
        console.log('Here are the current job titles.');
        console.table(res);
        promptUser();
    });
};

const updateEmployeeRole = (name, id) => {
    nameSplitter = name.split(" ");
    console.log('Updating employee role');
    connection.query('UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name= ?',
    [id, nameSplitter[0], nameSplitter[1]],
    function(err,res) {
        if (err) throw err;
        console.log(res.affectedRows + ' employee updated!')
        promptUser();
    }
    )

};


const updateEmployeeManager = (name, id) => {
    nameSplitter = name.split(" ");
    console.log('Updating employee manager');
    connection.query('UPDATE employee SET manager_id= ? WHERE first_name = ? AND last_name= ?',
    [id, nameSplitter[0], nameSplitter[1]],
    function(err,res) {
        if (err) throw err;
        console.log(res.affectedRows + ' employee updated!')
        promptUser();
    }
    )
};


const addRole = (title, salary, id) => {
    console.log('Adding new role.');
    connection.query(
        'INSERT INTO role SET ?',
        {
            title: title,
            salary: salary,
            department_id: id
        },
        function(err,res) {
            if(err) throw err;
            console.log(res.affectedRows + ' role added.');
            console.table(res)
            promptUser();
        }
    )
};

const removeRole = (title) => {
    console.log('Removing role.');
    connection.query(
        'DELETE FROM role WHERE ?',
        {
            title: title
        },
        function(err,res) {
            if(err) throw err;
            console.log(res.affectedRows + ' role removed.');
            console.table(res)
            promptUser();
        }
    )
};

const allEmployeesByManager = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    ORDER BY employee.manager_id`
    
    connection.query(sql, function(err, res) {
        if(err) throw err;
        console.table(res);
        promptUser();
    })
    

};

const viewAllDepartments = () => {
    connection.query(`SELECT * FROM department`, function(err,res) {
        if(err) throw err;
        console.log('Here are the current departments.');
        console.table(res);
        promptUser();
    });

};

const removeDepartment = (name) => {
    console.log('Removing department.');
    connection.query(
        'DELETE FROM department WHERE ?',
        {
            name: name
        },
        function(err,res) {
            if(err) throw err;
            console.log(res.affectedRows + ' department removed.');
            console.table(res)
            promptUser();
        }
    )
};

const addDepartment = (name) => {
    console.log('Adding new department.');
    connection.query(
        'INSERT INTO department SET ?',
        {
            name: name
        },
        function(err,res) {
            if(err) throw err;
            console.log(res.affectedRows + ' department added.');
            console.table(res)
            promptUser();
        }
    )
};

const departmentBudget = (id) => {
    const sql = `SELECT department.name AS department, SUM(role.salary) AS totalBudget
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    WHERE role.department_id = ?`;
    params= [id]
    connection.query(sql, params,

    function(err,res) {
        if(err) throw err;
        console.table(res)
        promptUser();
    }
    )
};

module.exports = {allEmployees, allEmployeesByDepartment, addEmployee, removeEmployee, viewRoles, updateEmployeeRole, updateEmployeeManager, addRole, removeRole, allEmployeesByManager, viewAllDepartments, removeDepartment, addDepartment, departmentBudget}