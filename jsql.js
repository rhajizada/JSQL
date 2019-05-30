// Code for comparing arrays
if (Array.prototype.equals) {
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
}
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
Object.defineProperty(Array.prototype, "equals", {
    enumerable: false
});

//Code for comparing objects
if (Object.prototype.equals) {
    console.warn("Overriding existing Object.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
}
Object.prototype.equals = function (object) {
    if (!object) {
        return false;
    }
    if (Object.keys(this).length != Object.keys(object).length) {
        return false;
    }
    for (i in Object.keys(this)) {
        if (this[Object.keys(this)[i]] != object[Object.keys(this)[i]]) {
            return false;
        }
    }
    return true;
}
Object.defineProperty(Object.prototype, "equals", {
    enumerable: false
});

// Code for converting object to string
if (Object.prototype.toString) {
    console.warn("Overriding existing Object.prototype.toString. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
}
Object.prototype.toString = function () {
    var string = "";
    for (var i in Object.values(this)) {
        if (i != this.length - 1) {
            string += `${Object.values(this)[i]} `;
        } else {
            string += `${Object.values(this)[i]}`;
        }
    }
    return string;
}
Object.defineProperty(Object.prototype, "toString", {
    enumerable: false
});

// Code for checking if array is empty
if (Array.prototype.isEmpty) {
    console.warn("Overriding existing Array.prototype.isEmpty. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
}
Array.prototype.isEmpty = function () {
    return this.length == 0;
}
Object.defineProperty(Array.prototype, "isEmpty", {
    enumerable: false
});

// Dependencies
const jsonfile = require('jsonfile');
const fs = require('fs');
const csv2json = require('./csv2json');

module.exports = class Table {
    constructor(filename, name) {
        // Constructs a table object from JSON file given
        this.name = name;
        this.filename = filename;
        this.isCSV;
        if (filename.includes('.csv')) {
            // Converts CSV to JSON file and stores it
            this.table = csv2json(filename);
            this.isCSV = true;
            this.filename = filename.split('.csv')[0] + '.json';
            fs.writeFileSync(this.filename, JSON.stringify(this.table), (err) => {
                if (err) console.log(err);
            });
            console.log(`Converted ${filename} to  JSON format and stored it as ${this.filename}`);
        } else if (filename.includes('.json')) {
            // Reads JSON file
            this.isCSV = false;
            try {
                this.table = jsonfile.readFileSync(filename);
            } catch (e) {
                throw new Error(`Error reading ${filename}`);
            }
        } else {
            this.isCSV = false;
            throw new Error(`${filename} is not supported format`);
        }
        // Prints that table is initialized succes
        if (!this.table.isEmpty()) {
            console.log(`Table ${this.name} succesfully initialized from file ${this.filename}`);
        }
        // Creates table from first object in array
        this.schema = [];
        for (var i = 0; i < Object.keys(this.table[0]).length; i++) {
            this.schema.push(Object.keys(this.table[0])[i]);
        }
        // Checks correctness of schema
        this.schemaIsCorrect = this.checkSchema();
        if (this.schemaIsCorrect) {
            console.log("Schema is consistent throughout the file");
        } else {
            throw new Error("Schema is not consistent throughtout the file");
        }
    }

    rename(name) {
        // renames 
        console.log(`Renaming ${this.name} to ${name}`);
        this.name = name;
    }

    checkSchema() {
        // Checks if schema is consistent through all file
        var correct = true;
        var i = 1;
        while (i < this.table.length && correct) {
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
        console.table(this.table);
    }

    toString() {
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

    insert(row) {
        // Given the object inserts it into the table and also adds it to the file
        var rowSchema = [];
        for (var i = 0; i < Object.keys(row).length; i++) {
            rowSchema.push(Object.keys(row)[i]);
        }
        var rowSchemaCorrect = rowSchema.equals(this.schema);
        if (rowSchemaCorrect) {
            this.table.push(row);
            let updatedTable = JSON.stringify(this.table);
            fs.writeFileSync(this.filename, updatedTable, (err) => {
                if (err) console.log(err);
                else {
                    console.log(`${this.filename} updated`);
                }
            });
            console.log(`Succesfully inserted ${JSON.stringify(row)}`);
        } else {
            console.warn("Input object is using wrong schema.\nFailed inserting into table.\nTable schema is: ");
            console.log(this.schema);
            console.warn("Your input object schema is: ");
            console.log(rowSchema);
        }
    }

    toHTML() {
        // Writes table into a new html file for better visualization
        var html = `<!DOCTYPE html>
            <html>
            <head>
            <style>
                table {
                    font-family: arial, sans-serif;
                    text-align: center;
                    border-collapse: collapse;
                    width: 100%;
                }
                td, th {
                    border: 1px solid #dddddd;
                    text-align: center;
                    text-align: left;
                    padding: 8px;
                }
                tr:nth-child(even) {
                    background-color: #dddddd;
                }
                body {
                    text-align: center;
                }
            </style>
            </head>
            <body>
            <h2>${this.name}</h2>
            <table>
            <tr>`;
        for (var i = 0; i < this.schema.length; i++) {
            html += `<th>${this.schema[i]}</th>\n`;
        }
        html += "</tr>\n";
        for (i in this.table) {
            html += "<tr>\n";
            for (var j = 0; j < Object.values(this.table[i]).length; j++) {
                html += `<th>${Object.values(this.table[i])[j]}</th>`;
            }
            html += "</tr>\n";
        }
        html += `</table>
                 </body>
                 </html>`;
        fs.writeFileSync(this.name + ".html", html, (err) => {
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
        if (!result.isEmpty()) {
            return result;
        } else {
            console.warn("Value not found!");
        }
    }

    returnIndices(column, value) {
        // Looks for rows that match and adds them to return array of indices 
        var result = [];
        for (var i = 0; i < this.table.length; i++) {
            if (this.table[i][column] == value) {
                result.push(i);
            }
        }
        if (!result.isEmpty()) {
            return result;
        } else {
            console.warn("Value not found!");
        }
    }

    simpleSearchWithAttribute(column, value, attribute) {
        // Looks for rows that match and adds value of the attribute to return array
        var result = [];
        for (var i = 0; i < this.table.length; i++) {
            if (this.table[i][column] == value) {
                result.push(this.table[i][attribute]);
            }
        }
        if (!result.isEmpty()) {
            return result;
        } else {
            console.log("Value not found!");
        }
    }

    duplicateSearch() {
        // Looks for duplicates in table and returns array of duplicate objcets with original index and duplicate index
        var format = (duplicateArray) => {
            var i = 0;
            while (i < duplicateArray.length) {
                var j = i + 1;
                while (j < duplicateArray.length) {
                    if (duplicateArray[i].duplicateIndex[0] == duplicateArray[j].originalIndex) {
                        duplicateArray[i].duplicateIndex.push(duplicateArray[j].duplicateIndex[0]);
                    }
                    j++;
                }
                i++;
            }
            i = 0;
            while (i < duplicateArray.length) {
                j = i + 1;
                while (j < duplicateArray.length) {
                    if (duplicateArray[i] != undefined && duplicateArray[j] != undefined && duplicateArray[i].item.equals(duplicateArray[j].item)) {
                        duplicateArray[j] = undefined;
                    }
                    j++;
                }
                i++;
            }
            duplicateArray = duplicateArray.filter(function (value, index, arr) {
                return value != undefined;
            })
            return duplicateArray;
        }
        var x = 0;
        var duplicates = [];
        while (x < this.table.length) {
            var z = x + 1;
            while (z < this.table.length) {
                if (this.table[x] != undefined && this.table[x] != undefined && this.table[x].equals(this.table[z])) {
                    var y = {};
                    y.item = this.table[x];
                    y.originalIndex = x;
                    y.duplicateIndex = [z];
                    duplicates.push(y);
                }
                z++;
            }
            x++;
        }
        duplicates = format(duplicates);
        return duplicates;
    }

    removeDuplicates() {
        // Removes duplicates from array
        let duplicateArray = this.duplicateSearch();
        var duplicateIndeces = [];
        for (var i in duplicateArray) {
            for (var j in duplicateArray[i].duplicateIndex) {
                duplicateIndeces.push(duplicateArray[i].duplicateIndex[j]);
            }
        }
        for (var i in duplicateIndeces) {
            for (var j in this.table) {
                if (duplicateIndeces[i] == j) {
                    console.log(`Succesfully removed ${this.table[j].toString()}`);
                    this.table[j] = undefined
                }
            }
        }
        this.table = this.table.filter(function (e) {
            return e != null;
        });
        let updatedTable = JSON.stringify(this.table);
        fs.writeFileSync(this.filename, updatedTable, (err) => {
            if (err) console.log(err);
            else {
                console.log(`${this.filename} updated`);
            }
        });
        console.log(`Succesfully removed duplicates from ${this.name}`)
    }

    removeByIndex(index) {
        if (index > this.table.length) {
            console.warn(`Index exceed ${this.name}'s size`);
        } else {
            // Removes element from array by index
            let removed = this.table.splice(index, 1);
            let updatedTable = JSON.stringify(this.table);
            fs.writeFileSync(this.filename, updatedTable, (err) => {
                if (err) console.log(err);
                else {
                    console.log(`${this.filename} updated`);
                }
            });
            console.log(`Succesfully removed item ${removed.toString()} from ${this.name}`);
        }
    }

    removeByAttribute(column, value) {
        // Removes all the elements that match column = value
        let result = this.returnIndices(column, value);
        for (var i in result) {
            for (var j in this.table) {
                if (result[i] == j) {
                    console.log(`Succesfully removed ${this.table[j].toString()}`);
                    this.table[j] = undefined
                }
            }
        }
        this.table = this.table.filter(function (e) {
            return e != null;
        });
        let updatedTable = JSON.stringify(this.table);
        fs.writeFileSync(this.filename, updatedTable, (err) => {
            if (err) console.log(err);
            else {
                console.log(`${this.filename} updated`);
            }
        });
    }
};