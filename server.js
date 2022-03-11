const connection = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
prompt = inquirer.createPromptModule();

const PORT = process.env.PORT || 3001;
const app = express();


// ------ Start Server after DB Connection ------ //
connection.connect((error) => {
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



// ------ View All Roles ------ //




// ------ View All Employees ------ //



// ------ Add a Department to an Employee ------ //




// ------ Add a Role to an Employee ------ //



// ------ Add New Employee ------ //



// ------ Update an Employee Role ------ //