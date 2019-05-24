let Table = require('./jsql');
let table = new Table('song.json', 'Led Zeppelin I');
// table.printSchema();
// table.printTable();
// let result = table.simpleSearch('Ping', 49);
// let resultWithAttribute = table.simpleSearchWithAttribute('Date', '2017-11-16', 'ID');
// console.log(result);
// console.log(resultWithAttribute);
// table.printTable();
table.printSchema();
console.log(table.toString());
console.dir(table.simpleSearch('Song', 'Dazed and Confused'));


// let newRow = {
//     ID: 44,
//     Date: '2019-05-23',
//     Time: '20:49:01',
//     Download: 3.01,
//     Upload: 5.02,
//     Ping: 20
// };

// table.insert(newRow);
// table.toHTML();
// table.printTable();