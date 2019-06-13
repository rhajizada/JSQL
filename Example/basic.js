/*
    Use this file to test jsql library and how to use library
    You  can use data in 'Sample Data'  folder to test the library
*/
let Table = require('../jsql'); // Imports library from jsql.js as Table
//let led_zep_iv = new Table({name: 'Led Zeppelin IV', schema: ['Song', 'Artist', 'Album'], isNew: true}); // another way to create new table
let led_zep_iv = Table.newTable('Led Zeppelin IV', ['Song', 'Artist', 'Album']); // creating new table
led_zep_iv.print(); // will print that table is empty since its just created
/*
    Inserting items to new table
 */
led_zep_iv.insert({Song: 'Black Dog', Artist: 'Led Zeppelin', Album: 'Led Zeppelin IV' });
led_zep_iv.insert({Song: 'Rock and Roll', Artist: 'Led Zeppelin', Album: 'Led Zeppelin IV' });
led_zep_iv.insert({Song: 'The Battle of Evermore', Artist: 'Led Zeppelin', Album: 'Led Zeppelin IV' });
led_zep_iv.insert({Song: 'Stairway to Heaven', Artist: 'Led Zeppelin', Album: 'Led Zeppelin IV' });
led_zep_iv.insert({Song: 'Misty Mountain Hop', Artist: 'Led Zeppelin', Album: 'Led Zeppelin IV' });
led_zep_iv.insert({Song: 'Four Sticks', Artist: 'Led Zeppelin', Album: 'Led Zeppelin IV'});
led_zep_iv.insert({Song: 'Going to California', Artist: 'Led Zeppelin', Album: 'Led Zeppelin IV'});
led_zep_iv.insert({Song: 'When the Levee Breaks', Artist: 'Led Zeppelin', Album: 'Led Zeppelin IV'});
led_zep_iv.print();  // Printing table with all  items inserted above
// let led_zep = new Table({filename: 'Sample Data/songs.json', name: 'Led Zeppelin'}); // creates a new table from songs.json file
let led_zep = Table.fromFile('Sample Data/songs.json', 'Led Zeppelin'); // another way to create table from file
//let price_index = new Table({filename: 'Sample Data/price-index.csv', name: 'Price Indexes'}); // creates  a new table and converts to json from price-index.csv
let price_index = Table.fromFile('Sample Data/price-index.csv', 'Price Indexes');
price_index.printSchema(); // Prints schema of price_index on console
price_index.toHTML('Sample Data/');
console.log(`Led zeppelin schema: ${led_zep.schema}`); // Another way to print schema
led_zep.toHTML(); // Creates html file called 'Led Zeppelin.html' from table for easier data visualization
let price_index_string = price_index.toString(); // Returns price index table as a formatted string
// Creating new object to insert into  led_zep table
let initialSearchResult = led_zep.simpleSearch('Song', 'Dazed and Confused'); // Example of simple search
led_zep.rename(`Led Zeppelin I`); // Renaming table
if (initialSearchResult === undefined) {
    // Checking if search returns nothing
    console.log("Can't find Stairway to Heaven");
}
const newSong = {
    Song: 'Stairway to Heaven',
    Artist: 'Led Zeppelin',
    Album: 'Led Zeppelin IV'
};
led_zep.insert(newSong); //inserting new song into table
console.log(led_zep.toString()); // One way to print the table
let laterSearchResult = led_zep.simpleSearchWithAttribute('Song', 'Stairway to Heaven', 'Album'); // Example of search with attribute
console.dir(laterSearchResult); // Printing result of search
led_zep.insert(newSong); // generating duplicate
led_zep.insert(newSong); // generating duplicate
let duplicates = led_zep.duplicateSearch();
led_zep.removeByIndex(10); // Removing first duplicate by index
led_zep.insert(led_zep.table[0]); // Generating  another duplicate
console.log("Showing duplicate array: ");
console.dir(duplicates); // Shows duplicates
led_zep.removeByAttribute('Song', 'Stairway to Heaven'); // removing item by attribute
led_zep.print();
led_zep.removeDuplicates(); // removing duplicates from table
led_zep.print(); // print table on the console using console.table()
led_zep.toCSV(); // Creates a csv file for led_zep table
/*
    Example of swapping items in table
 */
led_zep_iv.swap(0, 1);
led_zep_iv.print();
led_zep_iv.swap(0,1);
led_zep_iv.print();
console.dir(led_zep.duplicateSearch());