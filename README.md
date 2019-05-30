# JSQL
JSON querying library.
This library is written for Node JS in order to query the JSON files.

# What inspired me?
I was working on Node script that would automatically test the ping and network connection speed and instead of loading the results in SQL or any other conventional database I decided to go with the JSON. JSON is the JavaScript Object Notation. It is very similar to the structures in C/C++ but the main point of JSON is the fact that JavaScript natively parses JSON. For making the life easier JSQL works with the array of JSON's stored in the file for automatic indexing. Another pro of JSON is its native support by all web applications written in JavaScript.

# How does the JSQL works?
JSQL loads an array of JSON's from the file you want to use and then using the written library you can query the JSON file.
JSON array is a table and array item is a tuple.

# Methods supported
* constructor(filename,name) - constructs a  table from given file
* rename(name) - renames  the table
* checkSchema() - checks if the schema is consistent throughout the table
* printSchema() - prints the schema of table on the console
* print() - prints whole table on the console
* toString() - returns table as a formatted string
* insert(row) - inserts correctly formatted object row into the  table and table's json file
* toHTML() - creates file %name.html for visualizing table
* simpleSearch(column, value) - essentially same as `SELECT * FROM %name WHERE %column = %value`
* simpleSearchWithAttributes(column, value, attribute) - essentially same as `SELECT %sttribute FROM %name WHERE %column = %value`<br>
**Both search functions return array of results** <br>
*duplicateSearch() - returns specifically formatted array of all duplicates in the table<br>
**Duplicate Array is formatted in this way**<br>
``{
    item: %row,
    originalIndex: %rowIndex,
    duplicateIndex: %{aray of row duplicate indeces}
}``
# Features to be added in next versions
- [ ] Complex querying
- [ ] Multiple-table support
- [ ] Adding user prompt to the script

# How to install and run
JSQL is an npm package so just download it and run<br>
``npm install``
and then look at test.js file for manual on how to use the library

