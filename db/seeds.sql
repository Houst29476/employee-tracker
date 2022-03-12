INSERT INTO department (department_name)
VALUES
  ('Engineering'), 
  ('Sales'), 
  ('Finance'), 
  ('Management'), 
  ('Legal');

INSERT INTO title (title, salary, department_id)
VALUES
  ('Engineer', 80000, 1), 
  ('Senior Engineer', 120000, 1), 
  ('President', 220000, 4), 
  ('Vice President', 200000, 4), 
  ('Accountant', 50000, 3), 
  ('Account Manager', 70000, 3), 
  ('Legal Team Lead', 130000, 5), 
  ('Lawyer', 120000, 5), 
  ('Salesperson', 50000, 2), 
  ('Sales Team Lead', 60000, 2), 
  ('Intern', 30000, 2);

INSERT INTO employee (first_name, last_name, title_id, manager_id)
VALUES 
  ('Walter', 'White', 2, 2), 
  ('Jesse', 'Pinkman', 1, null), 
  ('Hank', 'Schrader', 8, 2), 
  ('Saul', 'Goodman', 7, 2), 
  ('Skyler', 'White', 3, null), 
  ('Todd', 'Alquist', 6, null), 
  ('Steven', 'Gomez', 5, null), 
  ('Gus', 'Fring', 4, null), 
  ('Mike', 'Ehrmantraut', 10, null), 
  ('Tuco', 'Salamanca', 11, null), 
  ('Huell', 'Babineaux', 9, null);

------- Title ID Numbers --------
-- engineer = title_id 1
-- senior engineer = title_id 2
-- president = title_id 3
-- vice president = title_id 4
-- accountant = title_id 5
-- account manager = title_id 6
-- legal team lead = title_id 7
-- lawyer = title_id 8
-- salesperson = title_id 9
-- sales team lead = title_id 10
-- intern = title_id 11