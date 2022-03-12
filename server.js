const connection = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
prompt = inquirer.createPromptModule();



// ------ Start Server after DB Connection ------ //
connection.connect((err) => {
  if (err) throw err;
  console.log('Database Connected!');
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
    if (choices === 'View All Deparments') {
      viewAllDepartments();
    }
    if (choices === 'View All Positions') {
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
const viewAllDepartments = () => {
  let sql = `SELECT department.id AS id, department.department_name AS department FROM department`;

  connection.query(sql, (err, res) => {
    if (err) throw err;

    console.log("List of Departments:\n");
    console.table(res);
    
    menu();
  });
};

// ------ View All Roles ------ //
const viewAllRoles = () => {
  let sql = `SELECT role.id, role.title, department.department_name AS department
  FROM role
  INNER JOIN department ON role.department_id = department.id`;

  connection.query(sql, (err, res) => {
    if (err) throw err;

    console.log("List of Roles:\n");
    console.table(res);
    
    menu();
  });
};

// ------ View All Employees ------ //
const viewAllEmployees = () => {
  let sql = `SELECT employee.id,
              employee.first_name,
              employee.last_name,
              role.title,
              department.department_name AS 'department',
              role.salary
              FROM employee, role, department
              WHERE department.id = role.department_id
              AND role.id = employee.role_id
              ORDER BY employee.id ASC`;
  
  connection.query(sql, (err, res) => {
    if (err) throw err;
    
    console.log("All Employees:\n");
    console.table(res);
    
    menu();
  });
};

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
    let sql = `INSERT INTO department (department_name) VALUES (?)`;
    
    connection.query(sql, answer.newDepartment, (err, res) => {
      if (err) throw err;
      
      console.log(answer.newDepartment + "Deparment added successfully!");
      viewAllDepartments();
    });
  });
};

// ------ Add a Role to an Employee ------ //
const addRole = () => {
  const sql = "SELECT * FROM department";
  connection.query(sql, (err, res) => {
    if (err) throw err;

    let deptNamesArray = [];
    response.forEach((department) => {
      deptNamesArray.push(department.department_name);
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
          message: "What is the name of the new role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the new employee?",
        },
      
      ]).then((answer) => {
        let createdRole = answer.newRole;
        let departmentId;

        response.forEach((department) => {
          if (departmentData.departmentName === department.department_name) {
            departmentId = department.id;
          }
        });

        let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        let crit = [createdRole, ansswer.salary, departmentId];

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
    const roleSql = `SELECT role.id, role.title FROM role`;
    
    connection.query(roleSql, (err, data) => {
      if (err) throw err;
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));

      prompt([
        {
          type: "list",
          name: "role",
          message: "What is the Employee's role?",
          choices: roles,
        },
      
      ]).then((roleChoice) => {
        const role = roleChoice.role;
        crit.push(role);

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
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
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