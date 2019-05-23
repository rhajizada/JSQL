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

module.exports =  class Table {
    constructor(filename) {
        this.jsonfile = require('jsonfile');
        this.filename = filename;
        try{
            this.table = this.jsonfile.readFileSync(filename);
        }
        catch(e){
            console.warn("Error reading " + filename);
        }
        if (this.table.length != 0) {
            console.log('Table ' + this.filename + ' succesfully initialized');
        }
        this.schema = [];
        for (var i = 0; i < Object.keys(this.table[0]).length; i++) {
            this.schema.push(Object.keys(this.table[0])[i]);
        }
        this.schemaIsCorrect = this.checkSchema();
        if(this.schemaIsCorrect){
            console.log("Schema is consistent throughout the file");
        }
        else{
            console.warn("Schema is not consistent throughtout the file");
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
        var schema = '';
        for (var i = 0; i < Object.keys(this.table[0]).length; i++) {
            schema = schema + Object.keys(this.table[0])[i] + "||";
        }
        console.log(schema);
    }

    printTable() {
        var tuple = [];
        for (var i = 0; i < this.table.length; i++) {
            for (var j = 0; j < this.schema.length; j++) {
                tuple[i] += "\t" + this.table[i][this.schema[j]] + "\t";
            }
            tuple[i] = tuple[i].substr(10);
            console.log(tuple[i]);
        }
    }
    
    simpleSearch(column, value) {
        var result = [];
        for (var i = 0; i < this.table.length; i++) {
            if (this.table[i][column] == value) {
                result.push(this.table[i]);
            }
        }
        if (result.length != 0) {
            return result;
        } else {
            console.log("Value not found!");
        }
    }
    
    simpleSearchWithAttribute(column, value, attribute){
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

