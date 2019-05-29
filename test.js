/*
    Use this file to test jsql library
*/
let Table = require('./jsql'); // Imports library from jsql.js as Table
let led_zep = new Table('./Sample Data/songs.json', 'Led Zeppelin'); // creates a new table from songs.json file
let price_index = new Table('./Sample Data/price-index.csv', 'Price Indeces'); // creates  a new table and converts to json from price-index.csv
price_index.printSchema(); // Prints schema of price_index on console
led_zep.toHTML(); // Creates html file called 'Led Zeppelin.html' from table for easier data visualization
let price_index_string = price_index.toString(); // Returns price index table as a formatted string 