// Tests how join works
let Table = require('../jsql');
/* Did all of that before */
let employee_id = new Table({name: 'employee_id', schema: ['employee_id', 'last_name', 'first_name', 'position_id'], isNew: true}); // Creating new empty table
let position_id = new Table({name: 'position_id', schema: ['position_id', 'title'], isNew: true}); // Creating another empty table
/* Filling those tables */
employee_id.insert({employee_id: 1000, last_name: 'Smith', first_name: 'John', position_id: 1});
employee_id.insert({employee_id: 1001, last_name: 'Anderson', first_name: 'Dave', position_id: 2});
employee_id.insert({employee_id: 1002, last_name: 'Doe', first_name: 'John', position_id: 3});
employee_id.insert({employee_id: 1003, last_name: 'Dylen', first_name: 'Hunt', position_id: null});

position_id.insert({position_id: 1, title: 'Manager'});
position_id.insert({position_id: 2, title: 'Project Planner'});
position_id.insert({position_id: 3, title:  'Programmer'});
position_id.insert({position_id: 4, title:  'Data Analyst'});

employee_id.print(); // Printing those tables
position_id.print();

let join = Table.join(employee_id, position_id, 'position_id', 'position_id'); // Creating inner join table 
join.print(); // Printing join table