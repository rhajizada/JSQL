var jsonfile = require('jsonfile');
var table = jsonfile.readFileSync("data.json");

//console.dir(table);

function setTable(t){
    var table = jsonfile.readFileSync(t);
    if( table.length != 0){
        console.log('Table succesfully initialized');
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
    var attribute = [];
    var str = "";
    attribute = schema();
    for(i in attribute){
        str += attribute[i] + "\t\t";
    }
    console.log(str);
    var tuple = [];
    for (var i = 0; i < table.length; i++) {
        for (var j = 0; j < attribute.length; j++) {
            tuple[i] += "\t" + table[i][attribute[j]] +  "\t";
        }
        tuple[i] = tuple[i].substr(10);
        console.log(tuple[i]);
    }
}

function search(a, x) {
    var result = [];
    for (var i = 0; i < table.length; i++) {
        if (table[i][a] == x) {
            result.push(table[i]);
        }
    }
    console.log(result);
}


//setTable('data.json');
// console.log(schema());
// printSchema();
// //printTable();
search("ID", 10);
printTable();