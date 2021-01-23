const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { raw } = require('express');

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
                promptUser();
            }
            else if (choice === 'Add Employee') {
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
                        choices: [('Sales Lead'),('Salesperson'), ('Lead Engineer'), ('Software Engineer'), ('Accountant'),('Legal Team Lead'), ('Lawyer')]
                    },
                ])
                .then(({first_name, last_name, title}) => {
                    
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
                        addEmployee(first_name, last_name, res[0].id);
                    })
                })
            }
            else if(choice === 'Remove Employee') {
                console.log('Who would you like to remove?');
                inquirer
                .prompt ([
                    {
                    type:'list',
                    name: 'first_name',
                    message: "What is the employee's first name?",
                    choices: [('Ted')]
                    }
                ])
                
                removeEmployee(first_name);
               
            }
            else if(choice === 'Update Employee Role'){
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
                        message: 'What is their new job title?',
                        choices: [('Sales Lead'),('Salesperson'), ('Lead Engineer'), ('Software Engineer'), ('Accountant'),('Legal Team Lead'), ('Lawyer')]
                    },
                ])
                .then(({first_name, last_name, title}) => {
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
                   updateEmployeeRole(first_name, last_name, res[0].id);
               })
            })    
            }
            else if(choice === 'Update Employee Manager') {
                console.log('Whose manager would you like to update?')
                promptUser();
            }
            else if (choice === 'View All Roles') {
                console.log('Viewing all roles')
                viewRoles();
            }
            else if (choice === 'Add Role') {
                console.log("What role would you like to add?")
                promptUser();
            }
            else if(choice === 'Remove Role') {
                console.log('What role would you like to remove?')
                promptUser();
            }
            else if (choice === 'Quit') {
                console.log('Thank you');
                connection.end();
            }
        })
};



allEmployees = () => {
    const sql = 
    `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, employee.first_name, employee.last_name AS manager
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
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    ORDER BY department.name`
    
    connection.query(sql, function(err, res) {
        if(err) throw err;
        console.table(res);
        promptUser();
    })
    
};

addEmployee = (first_name, last_name, id) => {
   console.log('Adding new employee.');
   connection.query(
       'INSERT INTO employee SET ?',
       {
           first_name: first_name,
           last_name: last_name,
           role_id: id
       },
       function(err,res) {
           if(err) throw err;
           console.log(res.affectedRows + ' employee added.');
           console.table(res)
           promptUser();
       }
   )
};

removeEmployee = (first_name, last_name) => {
    console.log('Removing Employee.');
    const sql = `DELETE FROM employee WHERE first_name = ? AND last_name=?`;
    connection.query(sql,
        {
            first_name: first_name,
            last_name: last_name
        }
        ,  function(err, res) {
            if(err) throw err;
            console.log(res.affectedRows + ' employee removed.')
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

updateEmployeeRole = (first_name, last_name, id) => {
    console.log('Updating employee role');
    connection.query('UPDATE employee SET ? WHERE ?',
    [
        {
            role_id: id
        },
        {
            last_name: last_name
        }
    ],
    function(err,res) {
        if (err) throw err;
        console.log(res.affectedRows + ' employee updated!')
        promptUser();
    }
    )

};