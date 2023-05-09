INSERT INTO department (name)
VALUES
('Board of Directors'),
('Engineering'),
('Marketing'),
('Sales'),
('Human Resources');


INSERT INTO role (title, salary, department_id)
VALUES
('CEO', 1000000.00, 1),
('Senior Engineer', 175000.00, 2),
('Marketing Manager', 150000.00, 3),
('Sales Rep', 80000.00, 4),
('HR Director', 120000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('LeBron', 'James', 1, NULL),
('Drake', 'Graham', 2, 1),
('Kanye', 'West', 3, 1),
('Trae', 'Young', 4, 1),
('Anthony', 'Richardson', 5, 1);

       