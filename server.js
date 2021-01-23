const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { raw } = require('express');
const { registerPrompt } = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '3+E46JU',
    database: 'employeeDB'
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    afterConnection();
})

afterConnection = () => {
    allEmployees();
 };

const promptUser = () => {
    return inquirer.prompt(
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View All Employees By Department',
                'View all Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'Remove Role',
                'Quit',
            ],
        })
        .then(({ choice }) => {
            if(choice === 'View All Employees By Department') {
                console.log('Viewing all employees by department.');
                allEmployeesByDepartment();
            }
            else if (choice === 'View all Employees By Manager') {
                console.log('Viewing all employees by manager.')
                allEmployeesByManager();
            }
            else if (choice === 'Add Employee') {
                connection.query(
                    'SELECT CONCAT(first_name, " ", last_name) AS name FROM employee',
                    function(err, res) {
                        if(err) throw err;
                        employeeChoices = [];
                        res.forEach(element => employeeChoices.push(element.name));
                connection.query(
                    'Select title FROM role',
                    function(err, res) {
                        if(err) throw err;
                        roleChoices = [];
                        res.forEach(element => roleChoices.push(element.title));
               inquirer
                .prompt ([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: " What is the employee's first name?"
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: "What is the employee's last name?"    
                    },
                    {
                        type: 'list',
                        name: 'title',
                        message: 'What is their job title?',
                        choices: roleChoices
                    },
                    {
                        type:'list',
                        name:'managerName',
                        message: "What is their manager's name?",
                        choices: employeeChoices
                    }
                ])
                .then(({first_name, last_name, title, managerName}) => {
                    nameSplitter = managerName.split(" ");
                connection.query(
                    'SELECT id FROM employee WHERE first_name = ? AND last_name = ?',
                    [nameSplitter[0],nameSplitter[1]], 
                   function(err,manager) {
                       if(err) throw err;
                    connection.query(
                         'SELECT id FROM role WHERE ?',
                         {
                            title: title
                         }, 
                        function(err,res) {
                            if(err) throw err;
                        console.log(res[0].id);
                        console.log(res);
                        console.log(first_name + " " + last_name + " " + res[0].id);
                        addEmployee(first_name, last_name, res[0].id, manager[0].id);
                        })
                    })
                })
            })
            })
            }
            else if(choice === 'Remove Employee') {
                connection.query(
                    'SELECT CONCAT(first_name, " ", last_name) AS name FROM employee',
                    function(err, res) {
                        if(err) throw err;
                        employeeChoices = [];
                        res.forEach(element => employeeChoices.push(element.name));
                inquirer
                .prompt ([
                    {
                    type:'list',
                    name: 'name',
                    message: "What is the employee's name?",
                    choices: employeeChoices
                    }
                ]).then(({name}) => {
                
                removeEmployee(name); 

                });
            })
            }
            else if(choice === 'Update Employee Role'){
                connection.query(
                    'SELECT CONCAT(first_name, " ", last_name) AS name FROM employee',
                    function(err, res) {
                        if(err) throw err;
                        employeeChoices = [];
                        res.forEach(element => employeeChoices.push(element.name));
                connection.query(
                    'Select title FROM role',
                    function(err, res) {
                        if(err) throw err;
                        roleChoices = [];
                        res.forEach(element => roleChoices.push(element.title));
                inquirer
                .prompt ([
                    {
                        type: 'list',
                        name: 'name',
                        message: "What is the employee's name?",
                        choices: employeeChoices
                    },
                    {
                        type: 'list',
                        name: 'title',
                        message: 'What is their new job title?',
                        choices: roleChoices
                    },
                ])
                .then(({name, title}) => {
                connection.query(
                    'SELECT id FROM role WHERE ?',
                    {
                       title: title
                    }, 
                   function(err,res) {
                       if(err) throw err;
                   console.log(name + " " + res[0].id);
                   updateEmployeeRole(name, res[0].id);
               })
            })
            })
            })    
            }
            else if(choice === 'Update Employee Manager') {
                connection.query(
                    'SELECT CONCAT(first_name, " ", last_name) AS name FROM employee',
                    function(err, res) {
                        if(err) throw err;
                        employeeChoices = [];
                        res.forEach(element => employeeChoices.push(element.name));
                inquirer
                .prompt ([
                    {
                        type: 'list',
                        name: 'name',
                        message: "What is the employee's name?",
                        choices: employeeChoices
                    },
                    {
                        type: 'list',
                        name: 'managerName',
                        message: 'What is their new manager?',
                        choices: employeeChoices
                    },
                ])
                .then(({name, managerName}) => {
                    nameSplitter = managerName.split(" ");
                connection.query(
                    'SELECT id FROM employee WHERE first_name = ? AND last_name = ?',
                    [nameSplitter[0],nameSplitter[1]], 
                   function(err,res) {
                       if(err) throw err;
                   console.log(name + " " + res[0].id);
                   updateEmployeeManager(name, res[0].id);
               })
            })
            })
            }
            else if (choice === 'View All Roles') {
                console.log('Viewing all roles')
                viewRoles();
            }
            else if (choice === 'Add Role') {
                connection.query(
                    'SELECT name FROM department',
                    function(err, res) {
                        if(err) throw err;
                        nameChoices = [];
                        res.forEach(element => nameChoices.push(element.name));
                inquirer
                .prompt([
                    {
                        type: 'input',
                        name:'title',
                        message: 'What is the role title?'
                    },
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'What is the salary for this role?'
                    },
                    {
                        type:'list',
                        name: 'department',
                        message:'What department does this role belong to?',
                        choices: nameChoices
                    }
                ])
                .then(({title,salary,department}) => {
                    connection.query(
                        'SELECT id FROM department WHERE ?',
                        {
                           name: department
                        }, 
                       function(err,res) {
                           if(err) throw err;
                       console.log(res[0].id);
                       console.log(res);
                       addRole(title, salary, res[0].id);
                })
            })
                }
                )
            }
            else if(choice === 'Remove Role') {
                connection.query(
                    'Select title FROM role',
                    function(err, res) {
                        if(err) throw err;
                        roleChoices = [];
                        res.forEach(element => roleChoices.push(element.title));
                        inquirer
                        .prompt([
                            {
                                type: 'list',
                                name:'title',
                                message: 'What is the role title?',
                                choices: roleChoices
                            }
                        ])
                        .then(({title}) => {
                               removeRole(title);
                        })
                    }
                )
            }
            else if (choice === 'Quit') {
                console.log('Thank you');
                connection.end();
            }
        })
};



allEmployees = () => {
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

allEmployeesByDepartment = () => {
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

addEmployee = (first_name, last_name, id, managerId) => {
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

removeEmployee = (name) => {
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

viewRoles = () => {
    connection.query(`SELECT title FROM role`, function(err,res) {
        if(err) throw err;
        console.log('Here are the current job titles.');
        console.table(res);
        promptUser();
    });
};

updateEmployeeRole = (name, id) => {
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


updateEmployeeManager = (name, id) => {
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


addRole = (title, salary, id) => {
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

removeRole = (title) => {
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

allEmployeesByManager = () => {
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

