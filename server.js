const inquirer = require('inquirer');
const mysql = require('mysql');
require('dotenv').config();


const db = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: 'localhost'
});

const questions = [
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'promptChoices',
    choices: [
      'View All Employees',
      'Add Employee',
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department'
    ]
  }
];

const handleUserInput = (answer) => {
  switch(answer.promptChoices) {
    case 'View All Employees':
      viewAllEmployees();
      break;
    case 'Add Employee':
      addEmployee();
      break;
    case 'Update Employee Role':
      updateEmployeeRole();
      break;
    case 'View All Roles':
      viewAllRoles();
      break;
    case 'Add Role':
      addRole();
      break;
    case 'View All Departments':
      viewAllDepartments();
      break;
    case 'Add Department':
      addDepartment();
      break;
    default:
      console.log('Invalid choice. Please try again.');
      break;
  }
};

const viewAllEmployees = () => {
  const query = 'SELECT * FROM employee';
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);

    promptUser();
  });
}




const innit = () => {
  inquirer.prompt(questions).then(handleUserInput);
};

// start the program
innit();