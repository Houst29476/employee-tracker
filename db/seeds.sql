USE employee_tracker;

INSERT INTO
  departments (departments_name)
VALUES
  ("Engineering"), 
  ("Sales"), 
  ("Finance"), 
  ("Management"), 
  ("Legal");

INSERT INTO
  roles (title, salary, departments_id)
VALUES
  ("Engineer", 80000, 1), 
  ("Senior Engineer", 120000, 1), 
  ("President", 220000, 4), 
  ("Vice President", 200000, 4), 
  ("Accountant", 50000, 3), 
  ("Account Manager", 70000, 3), 
  ("Legal Team Lead", 130000, 5), 
  ("Lawyer", 120000, 5), 
  ("Salesperson", 50000, 2), 
  ("Sales Team Lead", 60000, 2), 
  ("Intern", 30000, 2);

INSERT INTO
  employees (first_name, last_name, role_id, manager_id)
VALUES
  ("Walter", "White", 1, null), 
  ("Jesse", "Pinkman", 2, 2), 
  ("Hank", "Schrader", 8, null), 
  ("Saul", "Goodman", 7, null), 
  ("Skyler", "White", 3, 3), 
  ("Todd", "Alquist", 6, null), 
  ("Steven", "Gomez", 5, null), 
  ("Gus", "Fring", 4, 4), 
  ("Mike", "Ehrmantraut", 10, null), 
  ("Tuco", "Salamanca", 11, null), 
  ("Huell", "Babineaux", 9, null);

SELECT * FROM employees;

SELECT * FROM roles;

SELECT * FROM departments;

SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments_name AS departments_name, concat(manager.first_name, " ", manager.last_name) AS manager_full_name
  FROM employees 
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON departments.id = roles.departments_id
  LEFT JOIN employees as manager ON employees.manager_id = manager.id;

------- role ID Numbers --------
-- engineer = role_id 1
-- senior engineer = role_id 2
-- president = role_id 3
-- vice president = role_id 4
-- accountant = role_id 5
-- account manager = role_id 6
-- legal team lead = role_id 7
-- lawyer = role_id 8
-- salesperson = role_id 9
-- sales team lead = role_id 10
-- intern = role_id 11