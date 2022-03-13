const connection = require("./db/connection");
const inquirer = require('inquirer');
const cTable = require("console.table");

prompt = inquirer.createPromptModule();


// ------ Start Server after DB Connection ------ //
connection.connect((err) => {
  if (err) throw err;
});

// ------ Welcome Message ------ //
prompt([
  {
    type: 'list',
    message: 'Welcome to the Employee Tracker! Select Continue to Begin!',
    choices: ['Continue', 'Quit'],
    name: "start",
  },

]).then((response) => {
  switch (response.start) {
    case 'Continue':
      menu();
      break;
    case 'Quit':
      return console.log('Restart the application and try again!');
  }
});

// ------ Functionality Menu ------ //
function menu() {
  prompt([
      {
        name: 'choices',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View All Departments',
          'View All Managers',
          'View All Roles',
          'View All Employees',
          'Add a Department to an Employee',
          'Add a Role to an Employee',
          'Add a New Employee',
          'Update Employee Role',
          'Exit',
        ],
      },
  
  ]).then((answers) => {
    const { choices } = answers;
    if (choices === 'View All Departments') {
      viewAllDepartments();
    }
    if (choices === 'View All Managers') {
      viewAllManagers();
    }
    if (choices === 'View All Roles') {
      viewAllRoles();
    }
    if (choices === 'View All Employees') {
      viewAllEmployees();
    }
    if (choices === 'Add a Department to an Employee') {
      addDepartment();
    }
    if (choices === 'Add a Role to an Employee') {
      addRole();
    }
    if (choices === 'Add a New Employee') {
      addEmployee();
    }
    if (choices === 'Exit') {
      console.log('Thank You for Stopping By!');
      connection.end();
    }
  });
}

// ------ View All Departments ------ //
function viewAllDepartments() {
  let query = `SELECT * FROM employee_tracker.departments`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.log("All Departments")
    console.table(res);
    
    menu();
  });
};

// ------ View All Managers ------ //
function viewAllManagers() {
  let query = `SELECT DISTINCT concat(manager.first_name, " ", manager.last_name) AS full_name FROM employees LEFT JOIN employee AS manager ON manager.id = employees.manager_id;`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.log("All Managers")
    console.table(res);
  });
}

// ------ View All Roles ------ //
function viewAllRoles () {
  let query = `SELECT * FROM employee_tracker.roles`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.log("All Roles")
    console.table(res);
          
    menu();
  });
};

// ------ View All Employees ------ //
function viewAllEmployees() {
  let query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments_name AS departments_name, concat(manager.first_name, " ", manager.last_name) AS manager_full_name 
  FROM employees 
  LEFT JOIN roles ON employees.roles_id = roles.id
  LEFT JOIN departments ON departments.id = roles.departments_id
  LEFT JOIN employees as manager ON employees.manager_id = manager.id;`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.log("All Employees")
    console.table(res);
  });
}

// ------ Add a Department to an Employee ------ //
const addDepartment = () => {
prompt([
    {
      name: 'newDepartment',
      type: 'input',
      message: 'Enter the name of the new department:'
    }
  ])
  .then((answer) => {
    let sql = `INSERT INTO departments (departments_name) VALUES (?)`;
    
    connection.query(sql, answer.newDepartment, (err, res) => {
      if (err) throw err;
      
      console.log(answer.newDepartment + "Department added successfully!");
      viewAllDepartments();
    });
  });
};

// ------ Add a Role to an Employee ------ //
const addRoles = () => {
  const sql = "SELECT * FROM departments";
  connection.query(sql, (err, res) => {
    if (err) throw err;

    let deptNamesArray = [];
    response.forEach((department) => {
      deptNamesArray.push(departments.departments_name);
    });

    deptNamesArray.push("Create Department");
    prompt([
      {
        name: "departmentsName",
        type: "list",
        message: "Which department will you add this role to?",
        choices: deptNamesArray,
      },

    ]).then((answer) => {
      if (answer.departmentsName === "Create Department") {
        this.addDepartment();
      } else {
        addRolesResume(answer);
      }
    });

    const addRolesResume = (departmentData) => {
      prompt([
        {
          name: "newRole",
          type: "input",
          message: "What is the name of the new role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the new employee?",
        },
      
      ]).then((answer) => {
        let createdRoles = answer.newRoles;
        let departmentsId;

        response.forEach((departments) => {
          if (departmentsData.departmentsName === departments.departments_name) {
            departmentsId = departments.id;
          }
        });

        let sql = `INSERT INTO roles (title, salary, departments_id) VALUES (?, ?, ?)`;
        let crit = [createdRoles, answer.salary, departmentsId];

        connection.query(sql, crit, (err) => {
          if (err) throw err;
          console.log("Role created successfully!");
          viewAllRoles();
        });
      });
    };
  });
};

// ------ Add New Employee ------ //
const addEmployee = () => {
  prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
    },
  
  ]).then((answer) => {
    const crit = [answer.firstName, answer.lastName];
    const rolesSql = `SELECT roles.id, roles.title FROM roles`;
    
    connection.query(rolesSql, (err, data) => {
      if (err) throw err;
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));

      prompt([
        {
          type: "list",
          name: "role",
          message: "What is the Employee's role?",
          choices: roles,
        },
      
      ]).then((rolesChoice) => {
        const roles = rolesChoice.roles;
        crit.push(roles);

        const managerSql = `SELECT * FROM employee`;
        connection.query(managerSql, (err, data) => {
          if (err) throw err;
          const managers = data.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
          }));
          prompt([
            {
              type: "list",
              name: "manager",
              message: "Who is the employee's manager?",
              choices: managers,
            },
          
          ]).then((managerChoice) => {
            const manager = managerChoice.manager;
            crit.push(manager);
            const sql = `INSERT INTO employee (first_name, last_name, roles_id, manager_id)
            VALUES (?, ?, ?, ?)`;

            connection.query(sql, crit, (err) => {
              if (err) throw err;
              console.log("Employee added successfully!");
              viewAllEmployees();
            });
          });
        });
      });
    });
  });
};

// ------ Update an Employee Role ------ //
const updateEmployeeRoles = () => {
  let employeesArray = []

  connection.query(
    `SELECT first_name, last_name FROM employee`,
    (err, res) => {
      if (err) throw err;
      prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee has a new role?",
          choices() {
            res.forEach(employee => {
              employeesArray.push(`${employee.first_name} ${employee.last_name}`);
            });
            return employeesArray;
          }
        },
        {
          type: "input",
          name: "role",
          message: `Enter the new role ID from the choices below. ${('\nDesigner: 1\nSenior Designer: 2\nPresident: 3\nIntern: 4\nConsultant: 5\nPress: 6\nTemp: 7\n'('Your Answer: '))}`
        }
      
      ]).then( (answer) => {

        const updateEmployeeRoles = answer.employee.split(' ');
        const updateEmployeeRolesFirstName = JSON.stringify(updateEmployeeRoles[0]);
        const updateEmployeeRolesLastName = JSON.stringify(updateEmployeeRoles[1]);

        connection.query(
          `UPDATE employee
          SET roles_id = ${answer.roles}
          WHERE first_name = ${updateEmployeeRolesFirstName}
          AND last_name = ${updateEmployeeRolesLastName}`,

          (err, res) => {
            if (err) throw err;
            console.log("Employee roles updated successfully!");
            viewAllEmployees();
          }
        );
      });
    }
  );
};



// function viewAllEmployees () {
//   let query = `SELECT employees.id, employees.first_name, employees.last_name,
//               roles.title, departments_name AS 'departments_name', roles.salary,
//               concat(manager.first_name, " ", manager.last_name) AS manager_full_name
//               FROM employees 
//               LEFT JOIN roles ON employees.role_id = roles.id
//               LEFT JOIN departments ON departments.id = roles.department_id
//               LEFT JOIN employee as manager ON employees.manager_id = manager.id;`;