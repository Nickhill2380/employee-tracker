const mysql = require('mysql2');
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
    promptUser();
 }

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
                promptUser();
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
                        choices: ['Sales Lead', 'Salesperson', 'Lead Enigneer', 'Software Engineer', 'Accountant', 'Legal Team Lead', 'Lawyer']
                    },
                ])
                .then(({first_name, last_name, title}) => {
                    console.log(first_name + " " + last_name + " " + title);
                    promptUser();
                })   
            }
            else if(choice === 'Remove Employee') {
                console.log('Who would you like to remove?');
                promptUser();
            }
            else if(choice === 'Update Employee Role'){
                console.log('Whose role would you like to update?')
                promptUser();
            }
            else if(choice === 'Update Employee Manager') {
                console.log('Whose manager would you like to update?')
                promptUser();
            }
            else if (choice === 'View All Roles') {
                console.log('Viewing all roles')
                promptUser();
            }
            else if (choice === 'Add Role') {
                console.log("What role would you like to add?")
                promptUser();
            }
            else if(choice === 'Remove Role') {
                console.log('What role would youl iek to remove?')
                promptUser();
            }
            else if (choice === 'Quit') {
                console.log('Thank you');
                connection.end();
            }
        })
};



