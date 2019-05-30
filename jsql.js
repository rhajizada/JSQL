/*
    Code below adds extension functions for Object and Array
    Object.equals(object) Object.toString() Array.equals(array) Array.isEmpty()
 */

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

    let i = 0;
    const l = this.length;
    for (; i < l; i++) {
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
};
Object.defineProperty(Array.prototype, "equals", {
    enumerable: false
});
// Code for removing undefined items from array
if (Array.prototype.clean) {
    console.warn("Overriding existing Array.prototype.clean. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
}
Array.prototype.clean = function () {
     return (this.filter(function (e) {
        return e != null;
    }));

};
Object.defineProperty(Array.prototype, "clean", {
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
    for (let i in Object.keys(this)) {
        if (this[Object.keys(this)[i]] != object[Object.keys(this)[i]]) {
            return false;
        }
    }
    return true;
};
Object.defineProperty(Object.prototype, "equals", {
    enumerable: false
});
// Code for converting object to string
if (Object.prototype.toString) {
    console.warn("Overriding existing Object.prototype.toString. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
}
Object.prototype.toString = function () {
    let string = "";
    for (let i in Object.values(this)) {
        if (i != this.length - 1) {
            string += `${Object.values(this)[i]} `;
        } else {
            string += `${Object.values(this)[i]}`;
        }
    }
    return string;
};
Object.defineProperty(Object.prototype, "toString", {
    enumerable: false
});
// Code for checking if array is empty
if (Array.prototype.isEmpty) {
    console.warn("Overriding existing Array.prototype.isEmpty. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
}
Array.prototype.isEmpty = function () {
    return this.length == 0;
};
Object.defineProperty(Array.prototype, "isEmpty", {
    enumerable: false
});

/*
    Dependencies needed to run JSQL
    file2json - converts json file containing array of objects into a JavaScript array of objects
    csv2json - converts csv file into a json file containing array of objects
    fs - module needed to work with filesystem
 */

const fs = require('fs');
const file2json = require('./file2json');
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
            this.csvName = this.filename;
            this.filename = filename.split('.csv')[0] + '.json';
            fs.writeFileSync(this.filename, JSON.stringify(this.table), (err) => {
                if (err) console.log(err);
            });
            console.log(`Converted ${filename} to  JSON format and stored it as ${this.filename}`);
        } else if (filename.includes('.json')) {
            // Reads JSON file
            this.isCSV = false;
            try {
                this.table = file2json(this.filename);
            } catch (e) {
                throw new Error(`Error reading ${filename}`);
            }
        } else {
            this.isCSV = false;
            throw new Error(`${filename} is not supported format`);
        }
        // Prints that table is initialized success
        if (!this.table.isEmpty()) {
            console.log(`Table ${this.name} successfully initialized from file ${this.filename}`);
        }
        // Creates table from first object in array
        this.schema = [];
        for (let i = 0; i < Object.keys(this.table[0]).length; i++) {
            this.schema.push(Object.keys(this.table[0])[i]);
        }
        // Checks correctness of schema
        this.schemaIsCorrect = this.checkSchema();
        if (this.schemaIsCorrect) {
            console.log("Schema is consistent throughout the file");
        } else {
            throw new Error("Schema is not consistent throughout the file");
        }
    }

    rename(name) {
        // renames the table
        console.log(`Renaming ${this.name} to ${name}`);
        this.name = name;
    }

    checkSchema() {
        // Checks if schema is consistent through all file
        let correct = true;
        let i = 1;
        while (i < this.table.length && correct) {
            const currentSchema = [];
            for (let j = 0; j < Object.keys(this.table[i]).length; j++) {
                currentSchema.push(Object.keys(this.table[i])[j])
            }
            correct = this.schema.equals(currentSchema);
            i++;
        }
        return correct;
    }

    printSchema() {
        // Prints the table schema 
        console.log(this.name + " schema is:");
        let schema = '';
        for (let i = 0; i < Object.keys(this.table[0]).length; i++) {
            schema = schema + Object.keys(this.table[0])[i] + "\t";
        }
        console.log(schema);
    }

    print() {
        // Prints the table on console
        console.table(this.table);
    }

    toString() {
        // Returns the table as a string
        let tableAsString = "";
        for (let i = 0; i < this.table.length; i++) {
            let tuple = "";
            for (let j = 0; j < this.schema.length; j++) {
                tuple += this.table[i][this.schema[j]] + "\t";
            }
            tableAsString += tuple;
            tableAsString += "\n";
        }
        return tableAsString;
    }

    insert(row) {
        // Given the object inserts it into the table and also adds it to the file
        const rowSchema = [];
        for (let i = 0; i < Object.keys(row).length; i++) {
            rowSchema.push(Object.keys(row)[i]);
        }
        const rowSchemaCorrect = rowSchema.equals(this.schema);
        if (rowSchemaCorrect) {
            this.table.push(row);
            let updatedTable = JSON.stringify(this.table);
            fs.writeFileSync(this.filename, updatedTable, (err) => {
                if (err) console.log(err);
                else {
                    console.log(`${this.filename} updated`);
                }
            });
            console.log(`Successfully inserted ${JSON.stringify(row)}`);
        } else {
            console.warn("Input object is using wrong schema.\nFailed inserting into table.\nTable schema is: ");
            console.log(this.schema);
            console.warn("Your input object schema is: ");
            console.log(rowSchema);
        }
    }

    toHTML() {
        let i;
// Writes table into a new html file for better visualization
        let html = `<!DOCTYPE html>
            <html lang="en">
            <title>${this.name}</title>
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
        for (i = 0; i < this.schema.length; i++) {
            html += `<th>${this.schema[i]}</th>\n`;
        }
        html += "</tr>\n";
        for (i in this.table) {
            html += "<tr>\n";
            for (let j = 0; j < Object.values(this.table[i]).length; j++) {
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

    toCSV(){
        let i;
        let newFileName = '';
        if(this.isCSV){
            newFileName = this.csvName;
        }
        else{
            newFileName = this.filename.split('.json')[0] + '.csv';
        }
        let csv = '';
        // noinspection Annotator
        for(i  in this.schema){
            if(i != this.schema.length - 1) {
                csv +=  `${this.schema[i]},`
            }
            else {
                csv += `${this.schema[i]}`
            }
        }
        csv += '\n';
        // noinspection Annotator
        for(i in this.table){
            for(let j in Object.values(this.table[i])){
                if(j != Object.values(this.table[i]).length - 1){
                    csv += `${Object.values(this.table[i])[j]},`
                }
                else{
                    csv += `${Object.values(this.table[i])[j]}`;
                }
            }
            if(i != this.table.length - 1) {
                csv += '\n';
            }
        }
        fs.writeFileSync(newFileName, csv, (err) => {
            if (err) console.log(err);
            else {
                console.log(`${this.filename} updated`);
            }
        });
        let consoleMessage = "";
        if(this.isCSV){
            consoleMessage = `Updated ${this.csvName}`;
        }
        else{
            consoleMessage = `Converted ${this.filename} to CSV and created ${newFileName}`;
        }
        console.log(consoleMessage);
    }

    simpleSearch(column, value) {
        // Looks for rows that match and adds them to return array of objects
        const result = [];
        for (let i = 0; i < this.table.length; i++) {
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
        const result = [];
        for (let i = 0; i < this.table.length; i++) {
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
        const result = [];
        for (let i = 0; i < this.table.length; i++) {
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
        // Looks for duplicates in table and returns array of duplicate objects with original index and duplicate indices
        const format = (duplicateArray) => {
            let i = 0;
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
            });
            return duplicateArray;
        };
        let x = 0;
        let duplicates = [];
        while (x < this.table.length) {
            let z = x + 1;
            while (z < this.table.length) {
                if (this.table[x] != undefined && this.table[x] != undefined && this.table[x].equals(this.table[z])) {
                    const y = {};
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
        let j;
        let i;
// Removes duplicates from table
        let duplicateArray = this.duplicateSearch();
        const duplicateIndices = [];
        // noinspection Annotator
        for (i in duplicateArray) {
            // noinspection Annotator
            for (j in duplicateArray[i].duplicateIndex) {
                duplicateIndices.push(duplicateArray[i].duplicateIndex[j]);
            }
        }
        // noinspection Annotator
        for (i in duplicateIndices) {
            // noinspection Annotator
            for (j in this.table) {
                if (duplicateIndices[i] == j) {
                    console.log(`Successfully removed ${this.table[j].toString()}`);
                    this.table[j] = undefined
                }
            }
        }
        this.table = this.table.clean();
        let updatedTable = JSON.stringify(this.table);
        fs.writeFileSync(this.filename, updatedTable, (err) => {
            if (err) console.log(err);
            else {
                console.log(`${this.filename} updated`);
            }
        });
        console.log(`Successfully removed duplicates from ${this.name}`)
    }

    removeByIndex(index) {
        // Removes item from table at give index
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
            console.log(`Successfully removed item ${removed.toString()} from ${this.name}`);
        }
    }

    removeByAttribute(column, value) {
        // Removes all the elements that match column = value from table
        let result = this.returnIndices(column, value);
        for (let i in result) {
            for (let j in this.table) {
                if (result[i] == j) {
                    console.log(`Successfully removed ${this.table[j].toString()}`);
                    this.table[j] = undefined
                }
            }
        }
        this.table = this.table.clean();
        let updatedTable = JSON.stringify(this.table);
        fs.writeFileSync(this.filename, updatedTable, (err) => {
            if (err) console.log(err);
            else {
                console.log(`${this.filename} updated`);
            }
        });
    }

    swap(target, destination){
        // Swaps rows
        let temp = this.table[target];
        this.table[target] = this.table[destination];
        this.table[destination] = temp;
        console.log(`Swapped row at index ${target} with row at index ${destination}`);
    }
};