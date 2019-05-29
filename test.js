/*
    Use this file to test jsql library and how to use library
    You  can use data in 'Sample Data'  folder to test the library
*/
let Table = require('./jsql'); // Imports library from jsql.js as Table
let led_zep = new Table('./Sample Data/songs.json', 'Led Zeppelin'); // creates a new table from songs.json file
let price_index = new Table('./Sample Data/price-index.csv', 'Price Indeces'); // creates  a new table and converts to json from price-index.csv
price_index.printSchema(); // Prints schema of price_index on console
console.log(`Led zeppelin schema: ${led_zep.schema}`); // Another way to print schema
led_zep.toHTML(); // Creates html file called 'Led Zeppelin.html' from table for easier data visualization
let price_index_string = price_index.toString(); // Returns price index table as a formatted string
// Creating new object to insert into  led_zep table
let initialSearchResult = led_zep.simpleSearch('Song', 'Stairway to Heaven');
if(initialSearchResult == undefined){
    // Checking if search returns nothing
    console.log("Can't find Stairway to Heaven");
}
var newSong = {
    Song: 'Stairway to Heaven',
    Artist: 'Led Zeppelin',
    Album: 'Led Zeppelin IV'
}
led_zep.insert(newSong); //inserting new song into table
console.log(led_zep.toString()); // One way to print the table
let laterSearchResult = led_zep.simpleSearchWithAttribute('Song', 'Stairway to Heaven', 'Album'); // Example of search with attribute
console.dir(laterSearchResult); // Printing result of search
led_zep.insert(newSong); // generating duplicate
let duplicates = led_zep.duplicateSearch();
console.dir(duplicates); // Shows duplicates
led_zep.removeByIndex(9); // Removing first duplicate by index
led_zep.removeByIndex(9); // Removing second duplicate by index. Index stays the same since table shifts
led_zep.print();
// led_zep.removeDuplicates(); // removing duplicates from table
// led_zep.removeByAttribute('Song', 'Stairway to Heaven'); // removing item by attribute