var jsonfile = require('jsonfile');
// var table = jsonfile.readFileSync("data.json");
var table;

function setTable(t){
    table = jsonfile.readFileSync(t);
    if( table.length != 0){
        console.log('Table ' + t +' succesfully initialized');
    }
}

function schema() {
    var attribute = [];
    for (var i = 0; i < Object.keys(table[0]).length; i++) {
        attribute.push(Object.keys(table[0])[i]);
    }
    return attribute;
}

function schemaCheck() {
    var correct = true;
    for(var i = 0; i < table.length; i++){
        for(var j = 0; j < Object.keys(table[i]).length;j++){
            //if(){}
        }
    }
}

function printSchema() {
    // Prints the table schema 
    var schema = "";
    for (var i = 0; i < Object.keys(table[0]).length; i++) {
        schema = schema + Object.keys(table[0])[i] + "||";
    }
    console.log(schema);
}

function printTable() {
    var attribute = [];
    attribute = schema();
    printSchema();
    var tuple = [];
    for (var i = 0; i < table.length; i++) {
        for (var j = 0; j < attribute.length; j++) {
            tuple[i] += "\t" + table[i][attribute[j]] +  "\t";
        }
        tuple[i] = tuple[i].substr(10);
        console.log(tuple[i]);
    }
}

function search(row, value) {
    var result = [];
    for (var i = 0; i < table.length; i++) {
        if (table[i][row] == value) {
            result.push(table[i]);
        }
    }
    if(result.length != 0){
        console.log(result);
    }
    else{
        console.log("Value not found!");
    }
}


setTable('data.json');
// console.log(schema());
// printSchema();
// //printTable();
// search("ID", 70); usage of search
printTable();