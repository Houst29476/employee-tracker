INSERT INTO department(department_name)
VALUES
  ("Engineering"), 
  ("Sales"), 
  ("Finance"), 
  ("Management"), 
  ("Legal");

INSERT INTO role (title, salary, department_id)
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

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ('Walter', 'White', 1, 2), 
  ('Jesse', 'Pinkman', 1, null), 
  ('Hank', 'Schrader', 1, 2), 
  ('Saul', 'Goodman', 2, 2), 
  ('Skyler', 'White', 4, null), 
  ('Todd', 'Alquist', 4, null), 
  ('Steven', 'Gomez', 4, null), 
  ('Gus', 'Fring', 4, null), 
  ('Mike', 'Ehrmantraut', 4, null), 
  ('Tuco', 'Salamanca', 4, null), 
  ('Huell', 'Babineaux', 4, null);

------- Role ID Numbers --------
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