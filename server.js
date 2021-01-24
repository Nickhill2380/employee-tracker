const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');


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
                'View All Employees',
                'View All Employees By Department',
                'View all Employees By Manager',
                'View All Roles',
                'View All Departments',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'Add Role',
                'Remove Role',
                'Add Department',
                'Delete Department',
                'Department Budget',
                'Quit',
            ],
        })
        .then(({ choice }) => {
            if(choice === 'View All Employees By Department') {
                console.log('Viewing all employees by department.');
                allEmployeesByDepartment();
            }
            else if(choice === 'View All Employees') {
                allEmployees();
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
            else if(choice === 'View All Departments'){
                console.log('Viewing all departments');
                viewAllDepartments();
            }
            else if (choice === 'Add Department'){
                inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: "What is the department's name?"
                    }
                    ])
                    .then(({name}) => {
                        addDepartment(name);
                    })
            }
            else if (choice === 'Delete Department'){
                connection.query(
                    'Select name FROM department',
                    function(err, res) {
                        if(err) throw err;
                        departmentChoices = [];
                        res.forEach(element => departmentChoices.push(element.name));
                        inquirer
                        .prompt([
                            {
                                type: 'list',
                                name:'name',
                                message: 'What is the department name?',
                                choices: departmentChoices
                            }
                        ])
                        .then(({name}) => {
                            removeDepartment(name);
                        })
                    }
                )

            }
            else if (choice === 'Department Budget'){
                connection.query(
                    'Select name FROM department',
                    function(err, res) {
                        if(err) throw err;
                        departmentChoices = [];
                        res.forEach(element => departmentChoices.push(element.name));
                        inquirer
                        .prompt([
                            {
                                type: 'list',
                                name:'name',
                                message: 'What is the department name?',
                                choices: departmentChoices
                            }
                        ])
                        .then(({name}) => {
                            connection.query(
                                'SELECT id FROM department WHERE ?',
                                {
                                   name: name
                                }, 
                               function(err,res) {
                                   if(err) throw err;
                                departmentBudget(res[0].id);
                               })
                        })
                    })
            }
            else if (choice === 'Quit') {
                console.log('Thank you');
                connection.end();
            }
        })
};

module.exports = {promptUser, connection};
const {allEmployees, allEmployeesByDepartment, addEmployee, removeEmployee, viewRoles, updateEmployeeRole, updateEmployeeManager, addRole, removeRole, allEmployeesByManager, viewAllDepartments, removeDepartment, addDepartment, departmentBudget} = require('./generate-tables');