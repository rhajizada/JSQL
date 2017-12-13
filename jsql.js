var jsonfile = require('jsonfile');
var table = jsonfile.readFileSync("data.json");

//console.dir(table);

function setTable(t){
    var table = jsonfile.readFileSync(t);
    if( table.length != 0){
        console.log('Table succesfully initialized');
    }
}0

function schema() {
    var attribute = new Array();
    for (var i = 0; i < Object.keys(table[0]).length; i++) {
        attribute.push(Object.keys(table[0])[i]);
    }
    return attribute;
}

function schemaCheck() {
    var cor = true;
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
        schema = schema + Object.keys(table[0])[i] + "    ";
    }
    console.log(schema);
}

function printTable() {
    var attribute = new Array();
    attribute = schema();
    var tuple = new Array();
    for (var i = 0; i < table.length; i++) {
        for (var j = 0; j < attribute.length; j++) {
            tuple[i] += " " + table[i][attribute[j]] + "  ";
        }
        console.log(tuple[i]);
    }
}

function search(a, x) {
    var result = new Array();
    for (var i = 0; i < table.length; i++) {
        if (table[i][a] == x) {
            console.log(table[i]);
        }
    }
}

function newTable(tableName){

}

//setTable('data.json');
console.log(schema());
printSchema();
//printTable();
search("Date", "2017-11-16");