let Table = require('./jsql');
let table = new Table('data.json');
table.printSchema();
table.printTable();
let result = table.simpleSearch('Ping', 49);
let resultWithAttribute = table.simpleSearchWithAttribute('Date', '2017-11-16', 'ID');
console.log(result);
console.log(resultWithAttribute);