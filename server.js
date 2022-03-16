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
          '(1) View All Departments',
          '(2) View All Managers',
          '(3) View All Roles',
          '(4) View All Employees',
          '(5) Add a Department',
          '(6) Add a Role',
          '(7) Add Employee',
          '(8) Update Employee Role',
          '(9) Update Employee Manager',
          '(10) Delete Department',
          '(11) Delete Role',
          '(12) Delete Employee',
          'Exit',
        ],
      },
  
  ]).then((answers) => {
    const { choices } = answers;
    if (choices === '(1) View All Departments') {
      viewAllDepartments();
    }
    if (choices === '(2) View All Managers') {
      viewAllManagers();
    }
    if (choices === '(3) View All Roles') {
      viewAllRoles();
    }
    if (choices === '(4) View All Employees') {
      viewAllEmployees();
    }
    if (choices === '(5) Add a Department') {
      addDepartment();
    }
    if (choices === '(6) Add a Role') {
      addRole();
    }
    if (choices === '(7) Add Employee') {
      addEmployee();
    }
    if (choices === '(8) Update Employee Role') {
      updateEmplRole();
    }
    if (choices === '(9) Update Employee Manager') {
      updateEmpMgr();
    }
    if (choices === '(10) Delete Deparment') {
      deleteDept();
    }
    if (choices === '(11) Delete Role') {
      deleteRole();
    }
    if (choices === '(12) Delete Employee') {
      deleteEmpl();
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
  let query = `
  SELECT DISTINCT concat(manager.first_name, " ", manager.last_name) AS full_name 
  FROM employees 
  LEFT JOIN employees AS manager ON manager.id = employees.manager_id;`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.log("All Managers")
    console.table(res);

    menu();
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
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON departments.id = roles.departments_id
  LEFT JOIN employees as manager ON employees.manager_id = manager.id;`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.log("All Employees")
    console.table(res);

    menu();
  });
}

// ------ Add a Department ------ //
function addDepartment() {
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

      menu();
    });
  });
};

// ------ Add a Role ------ //
function addRole () {
  const sql = "SELECT * FROM departments";
  connection.query(sql, (err, res) => {
    
    if (err) throw err;
    // Logic to add new dept for the new role...
    let deptNamesArray = [];
    res.forEach((departments) => {
      deptNamesArray.push(departments.departments_name);
    });
    deptNamesArray.push("Create Department");
    
    prompt([
      {
        name: "departmentName",
        type: "list",
        message: "Which department will you add this role to?",
        choices: deptNamesArray,
      },
    ]).then((answer) => {
      if (answer.departmentName === "Create Department") {
        this.addDepartment();
      } else {
        addRoleResume(answer);
      }
    });

    const addRoleResume = (departmentData) => {
      prompt([
        {
          name: "newRole",
          type: "input",
          message: "What is the name of your new role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of this new role?",
        },
      
      ]).then((answer) => {
        let createdRole = answer.newRole;
        let departmentId;

        res.forEach((departments) => {
          if (departmentData.departmentName === departments.departments_name) {
            departmentId = departments.id;
          }
        });

        let sql = `INSERT INTO roles (title, salary, departments_id) VALUES (?, ?, ?)`;
        let crit = [createdRole, answer.salary, departmentId];

        connection.query(sql, crit, (err) => {
          if (err) throw err;
          
          console.log("Role created successfully!");
          viewAllRoles();

          menu();
        });
      });
    };
  });
};


// ------ Add New Employee ------ //
function addEmployee() {
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
        const roles = rolesChoice.role;
        crit.push(roles);

        const managerSql = `SELECT * FROM employees`;
        connection.query(managerSql, (err, data) => {
          if (err) throw err;
          const manager = data.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name, value: id,
          }));
          
          prompt([
            {
              type: "list",
              name: "manager",
              message: "Who is the employee's manager?",
              choices: manager,
            },
          
          ]).then((managerChoice) => {
            let manager = managerChoice.manager;
            crit.push(manager);
            let sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?)`;

            connection.query(sql, crit, (err) => {
              if (err) throw err;
              
              console.log("Employee added successfully!");
              viewAllEmployees();

              menu();
            });
          });
        });
      });
    });
  });
};

// // ------ Update an Employee Role ------ //
// function updateEmployeeRoles() {
//   let employeesArray = []

//   connection.query(
//     `SELECT first_name, last_name FROM employees`,
//     (err, res) => {
//       if (err) throw err;
//       prompt([
//         {
//           type: "list",
//           name: "employee",
//           message: "Which employee has a new role?",
//           choices() {
//             res.forEach(employee => {
//               employeesArray.push(`${employee.first_name} ${employee.last_name}`);
//             });
//             return employeesArray;
//           }
//         },
//         {
//           type: "input",
//           name: "role",
//           message: `Enter the new role ID from the choices below. ${('\nDesigner: 1\nSenior Designer: 2\nPresident: 3\nIntern: 4\nConsultant: 5\nPress: 6\nTemp: 7\n'('Your Answer: '))}`
//         }
      
//       ]).then( (answer) => {

//         const updateEmployeeRoles = answer.employee.split(' ');
//         const updateEmployeeRolesFirstName = JSON.stringify(updateEmployeeRoles[0]);
//         const updateEmployeeRolesLastName = JSON.stringify(updateEmployeeRoles[1]);

//         connection.query(
//           `UPDATE employee
//           SET roles_id = ${answer.roles}
//           WHERE first_name = ${updateEmployeeRolesFirstName}
//           AND last_name = ${updateEmployeeRolesLastName}`,

//           (err, res) => {
//             if (err) throw err;
//             console.log("Employee roles updated successfully!");
//             viewAllEmployees();
//           }
//         );
//       });
//     }
//   );
// };

