if(Array.prototype.equals){
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
}
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
// Dependencies
jsonfile = require('jsonfile');
fs = require('fs');

module.exports =  class Table {
    constructor(filename, name) {
        // Constructs a table object from JSON file given
        this.name = name;
        this.filename = filename;
        // Reads JSON file
        try{
            this.table = jsonfile.readFileSync(filename);
        }
        catch(e){
            throw new Error("Error reading " + filename);
        }
        // Prints that table is initialized succes
        if (this.table.length != 0) {
            console.log('Table ' + this.filename + ' succesfully initialized');
        }
        // Creates table from first object in array
        this.schema = [];
        for (var i = 0; i < Object.keys(this.table[0]).length; i++) {
            this.schema.push(Object.keys(this.table[0])[i]);
        }
        // Checks correctness of schema
        this.schemaIsCorrect = this.checkSchema();
        if(this.schemaIsCorrect){
            console.log("Schema is consistent throughout the file");
        }
        else{
            throw new Error("Schema is not consistent throughtout the file");
        }
    }

    checkSchema() {
        // Checks if schema is consistent through all file
        var correct = true;
        var i = 1;
        while(i < this.table.length && correct){
            var currentSchema = [];
            for (var j = 0; j < Object.keys(this.table[i]).length; j++) {
                currentSchema.push(Object.keys(this.table[i])[j])
            }
            correct = this.schema.equals(currentSchema)
            i++;
        }
        return correct;
    }

    printSchema() {
        // Prints the table schema 
        console.log(this.name + " schema is:");
        var schema = '';
        for (var i = 0; i < Object.keys(this.table[0]).length; i++) {
            schema = schema + Object.keys(this.table[0])[i] + "\t";
        }
        console.log(schema);
    }

    print() {
        // Prints the whole table on the console
        for (var i = 0; i < this.table.length; i++) {
            var tuple = "";
            for (var j = 0; j < this.schema.length; j++) {
                tuple += this.table[i][this.schema[j]] + "\t";
            }
            console.log(tuple);
        }
    }

    toString(){
        // Returns the table as a string
        var tableAsString = "";
        for (var i = 0; i < this.table.length; i++) {
            var tuple = "";
            for (var j = 0; j < this.schema.length; j++) {
                tuple += this.table[i][this.schema[j]] + "\t";
            }
            tableAsString += tuple;
            tableAsString += "\n";
        }
        return tableAsString;
    }


    insert(row){
        // Given the object inserts it into the table and also adds it to the file
        var rowSchema = [];
        for(var i = 0; i < Object.keys(row).length; i++){
            rowSchema.push(Object.keys(row)[i]);
        }
        var rowSchemaCorrect = rowSchema.equals(this.schema);
        if(rowSchemaCorrect){
            this.table.push(row);
            let updatedTable = JSON.stringify(this.table);
                fs.writeFile(this.filename, updatedTable, (err) => {
                    if (err) console.log(err);
                  });
        }
        else{
            console.warn("Input object is using wrong schema.\nFailed inserting into table.\nTable schema is: ");
            console.log(this.schema);
            console.warn("Your input object schema is: ");
            console.log(rowSchema);
        }
    }

    toHTML(){
        // Writes table into a new html file for better visualization
        var html = "<!DOCTYPE html>\n";
        html += "<html>\n<head>\n<style>\n";
        html += "table {\n\tfont-family: arial, sans-serif;\n\ttext-align: center;\n\tborder-collapse: collapse;\n\twidth: 100%;\n}\n";
        html += "td, th {\n\tborder: 1px solid #dddddd;\n\ttext-align: center;\n\ttext-align: left;\n\tpadding: 8px;\n}\n";
        html += "tr:nth-child(even) {\n\tbackground-color: #dddddd;\n}\n";
        html += "body\n{\n\ttext-align: center;\n}\n"
        html += "</style>\n</head>\n<body>\n<h2>";
        html += this.name;
        html += "</h2>\n<table>\n<tr>";
        for(var i = 0; i < this.schema.length; i++){
            let element = "<th>" + this.schema[i] + "</th>\n";
            html += element;
        }
        html += "</tr>\n";
        for(i in this.table){
            html += "<tr>";
            for(var j = 0; j <  Object.values(this.table[i]).length; j++){
                let element = "<th>" + Object.values(this.table[i])[j] + "</th>";
                html += element;
            }
            html += "</tr>";
        }
        html +="</table>\n</body>\n</html>"
        fs.writeFile(this.name +".html", html, (err) => {
            if (err) console.warn(err);
            else console.log("HTML file of table created");
          });
    }

    simpleSearch(column, value) {
        // Looks for rows that match and adds them to return array of objects
        var result = [];
        for (var i = 0; i < this.table.length; i++) {
            if (this.table[i][column] == value) {
                result.push(this.table[i]);
            }
        }
        if (result.length != 0) {
            return result;
        } else {
            console.warn("Value not found!");
        }
    }
    
    simpleSearchWithAttribute(column, value, attribute){
        // Looks for rows that match and adds value of the attribute to return array
        var result = [];
        for (var i = 0; i < this.table.length; i++) {
            if (this.table[i][column] == value) {
                result.push(this.table[i][attribute]);
            }
        }
        if (result.length != 0) {
            return result;
        } else {
            console.log("Value not found!");
        }
    }
};

