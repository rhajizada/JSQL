// This example of importing tables from sqlite3 database
const Table = require('../jsql'); // getting library
let chinook = Table.fromDB('Sample Data/chinook.db'); // getting tables from database
for(let i in chinook){
    // Prints names and schemas of the tables in database
    console.log(chinook[i].name);
    chinook[i].printSchema();
}
let newJoin = Table.join(chinook[0], chinook[2], 'ArtistId', 'ArtistId'); // Performing a join on album table and artist table on ArtistId attribute
newJoin.toHTML(); // Creating an html of joined table