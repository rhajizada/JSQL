let Table = require('./jsql');
let table = new Table('data.json');
table.printSchema();
table.printTable();