const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();


const db = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: 'localhost'
});

db.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Successful connection to database!');
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

const userInput = (answer) => {
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
  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name
  FROM employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id;
  `;
  db.query(query, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(res);
    innit();
  });
};

const addEmployee = () => {
  db.query('SELECT id, title FROM role', (err, res) => {
    if (err) {
      console.error(err);
      return;
    }

    const roles = res.map(({ id, title }) => ({
      name: title,
      value: id
    }));

    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      
      const managers = res.map(({ id, name }) => ({
        name,
        value: id,
      }))

      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "What is the employee's first name?",
        },
        {
          type: 'input',
          name: 'lastName',
          message: "What is the employee's last name?",
        },
        {
          type: 'list',
          name: 'roleId',
          message: "What is the employee's role?",
          choices: roles,
        },
        {
          type: 'list',
          name: 'managerId',
          message: "What is the id of the employee's manager?",
          choices: managers
        },
      ])
      .then(answers => {
        const { firstName, lastName, roleId, managerId } = answers;
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, ?, ?)
        `;
        db.query(query, [firstName, lastName, roleId, managerId], (err, res) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('Successfully updated!');
          db.query('SELECT * FROM employee', (err, updatedEmployee) => {
            if (err) {
              console.error(err);
              return;
            }
            console.table(updatedEmployee);
            innit();
          });
        });
      });
    })
  });
};

const updateEmployeeRole = () => {
  db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id', (err, employees) => {
    if (err) {
      console.error(err);
      return;
    };
    db.query('SELECT * FROM role', (err, roles) => {
      if (err) {
        console.error(err);
        return;
      };
      const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));
      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: "Which employee's role would you like to update?",
          choices: employeeChoices,
        },
        {
          type: 'list',
          name: 'role',
          message: 'Select new role:',
          choices: roleChoices,
        },
      ])
      .then((userInput) => {
        const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
        db.query(query, [userInput.role, userInput.employee], (err, res) => {
          if (err) {
            console.error(err);
            return;
          };
          console.log('Successfully updated!');
          db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id', (err, updatedEmployee) => {
            if (err) {
              console.error(err);
              return;
            }
            console.table(updatedEmployee);
            innit();
          });
        });
      })
    })
  })
};

const viewAllRoles = () => {
  db.query('SELECT role.title, role.id, department.name, role.salary FROM role LEFT JOIN department ON role.department_id = department.id', (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    console.table(res);
    innit();
  });
};

const innit = () => {
  inquirer.prompt(questions).then(userInput);
};

// start the program
innit();

// stops the connection when exiting 
process.on('exit', () => {
  db.end();
});