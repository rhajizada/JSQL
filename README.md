# JSQL
JSON querying library.
This library is written for Node JS in order to query the JSON files.

# What inspired me?
I was working on Node script that would automatically test the ping and network connection speed and instead of loading the results in SQL or any other conventional database I decided to go with the JSON. JSON is the JavaScript Object Notation. It is very similar to the structures in C/C++ but the main point of JSON is the fact that JavaScript natively parses JSON. For making the life easier JSQL works with the array of JSON's stored in the file for automatic indexing. Another pro of JSON is its native support by all webapps written in JavaScript.

# How does the JSQL works?
JSQL loads an array of JSON's from the file you want to use and then using the written library you can query the JSON file.
JSON array is a table and array item is a tuple.

# Methods supported
setTable() - sets a table from JSON file name
printTable() - shows the table on the screen
printSchema() - shows the table schema on the screen
schema() - reteuns all the attributes of 
search(a, x) - searches the table for tuple with attribute a equal to x and outputs on the screen



# Features to be added in next versions
Complex querying
Multiple-table support
Table creation and insertion
Adding user prompt to the script

# How to install and run
Make sure you have Node js and npm installed on the machine you want to run it on
Install following npm libraries : fs and jsonfile

