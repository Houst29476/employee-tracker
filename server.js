const connection = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
prompt = inquirer.createPromptModule();

const PORT = process.env.PORT || 3001;
const app = express();


// ------ Start Server after DB Connection ------ //
connection.connect((err) => {
  if (err) throw err;
  console.log('Database Connected!');
  app.listen(PORT, () => {
    console.log(`Server Running on Port: ${PORT}`);
  })
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
          'View All Positions',
          'View All Employees',
          'Add a Department to an Employee',
          'Add a Title to an Employee',
          'Add a New Employee',
          'Update Employee Title',
          'Exit',
        ],
      },
  
  ]).then((answers) => {
    const { choices } = answers;
    if (choices === 'View All Deparments') {
      viewAllDepartments();
    }
    if (choices === 'View All Positions') {
      viewAllPositions();
    }
    if (choices === 'View All Employees') {
      viewAllEmployees();
    }
    if (choices === 'Add a Department to an Employee') {
      addDepartment();
    }
    if (choices === 'Add a Title to an Employee') {
      addTitle();
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
    if (err) throw err:

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
    if (err) throw err:

    console.log("List of Departments:\n");
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




// ------ Add a Role to an Employee ------ //



// ------ Add New Employee ------ //



// ------ Update an Employee Role ------ //