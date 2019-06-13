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
    if (this.length !== array.length)
        return false;

    let i = 0;
    const l = this.length;
    for (; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        } else if (this[i] !== array[i]) {
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
    if (Object.keys(this).length !== Object.keys(object).length) {
        return false;
    }
    for (let i in Object.keys(this)) {
        if (this[Object.keys(this)[i]] !== object[Object.keys(this)[i]]) {
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
        if (i !== this.length - 1) {
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
    return this.length === 0;
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
    constructor(init) {
        if(typeof(init) !== "object"){
            console.warn("Failed constructing table. Make sure that init is of type object");
        }
        else {
            if (init.isNew) {
                if (!Array.isArray(init.schema)) {
                    console.warn("Wrong schema. Schema should be array.");
                }
                if (typeof (init.name) != "string" || !init.name) {
                    console.warn("Wrong table name. Make sure table name is string.")
                } else {
                    this.table = [];
                    this.schema = init.schema;
                    this.name = init.name;
                    if (!init.filename) {
                        this.filename = init.name.replace(/ /g, '-') + '.json';
                    } else {
                        if (init.filename.includes('.json')) {
                            this.filename = init.filename + '.json'
                        } else {
                            this.filename = init.filename;
                        }
                    }
                    console.log(`Successfully created new table ${this.name}`);
                }
            } else {
                // Constructs a table object from JSON file given
                if (typeof (init.name) != "string" || typeof (init.filename) != "string") {
                    console.warn("Wrong table name. Make sure table name is string.")
                } else {
                    this.name = init.name;
                    this.filename = init.filename;
                    this.isCSV;
                    if (init.filename.includes('.csv')) {
                        // Converts CSV to JSON file and stores it
                        this.table = csv2json(init.filename);
                        this.isCSV = true;
                        this.csvName = this.filename;
                        this.filename = init.filename.split('.csv')[0] + '.json';
                        fs.writeFileSync(this.filename, JSON.stringify(this.table), (err) => {
                            if (err) console.log(err);
                        });
                        console.log(`Converted ${init.filename} to  JSON format and stored it as ${this.filename}`);
                    } else if (init.filename.includes('.json')) {
                        // Reads JSON file
                        this.isCSV = false;
                        try {
                            this.table = file2json(this.filename);
                        } catch (e) {
                            throw new Error(`Error reading ${init.filename}`);
                        }
                    } else {
                        this.isCSV = false;
                        throw new Error(`${init.filename} is not supported format`);
                    }
                    // Prints that table is initialized success
                    if (this.table.length != 0) {
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
                        this.fixSchema();
                        console.log("Schema was wrong. Fixing table");
                        fs.writeFileSync(this.filename, JSON.stringify(this.table), (err) => {
                            if (err) console.log(err);
                        });
                    }
                }
            }
        }
    }

    static fromFile(filename, name){
        // Another way to create table from file
        if(typeof(filename) !== "string" && typeof(name) !== "string"){
            console.warn(`Error creating new table from ${filename}. Make sure filename and name are type of string type`);
        }
        else {
            return new Table({name: name, filename: filename});
        }
    }

    static newTable(name, schema){
        // Another way to construct new table
        if(typeof(name) != "string" && !Array.isArray(schema)){
            console.warn("Error creating new table. Make sure that name is type of string and schema is type of array");
        }
        else{
            return new Table({name: name, schema: schema, isNew: true});
        }
    }

    epochToReadable(attribute){
        // Given the attribute converts UNIX epoch into date and time string
        if(typeof(attribute) != "string") {
            console.warn("Error converting epoch into date string. Make sure attribute is of type string");
        }
        else{
            let i;
            for (i in this.table) {
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCMilliseconds(this.table[i][attribute]);
                this.table[i][attribute] = d.toDateString();
            }
            fs.writeFileSync(this.filename, JSON.stringify(this.table), (err) => {
                if (err) console.log(err);
            });
            console.log("Succesfully converted epoch to readable date");
        }
    }

    static fromComplexJSON(filename) {
        // Creates an array of tables from complex JSON file
        if(typeof(file) !== "string"){
            console.warn(`Error creating array of tables from compplex json. Make sure filename is of type string`);
        }
        else{
            let file = JSON.parse(fs.readFileSync(filename, 'utf-8'));
            let tableNames = Object.keys(file);
            console.dir(tableNames);
            let i;
            let j;
            let k;
            let newFiles = [];
            let newSchema = [];
            for (i in tableNames) {
                fs.writeFileSync(`${filename.split('.json')[0]}_${tableNames[i]}.json`, JSON.stringify(file[tableNames[i]]), (err) => {
                    if (err) console.log(err);
                });
                newFiles.push(`${filename.split('.json')[0]}_${tableNames[i]}.json`);
            }
            let tables = []
            for (i in newFiles) {
                tables.push(new Table({
                    filename: newFiles[i],
                    name: tableNames[i]
                }))
            }
            return tables;
        }
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

    fixSchema() {
        let newSchema = [];
        let i;
        let j;
        for (i in this.table) {
            for (j in Object.keys(this.table[i])) {
                if (!(newSchema.includes(Object.keys(this.table[i])[j]))) {
                    newSchema.push(Object.keys(this.table[i])[j]);
                }
            }
        }
        for (i in this.table) {
            for (j in newSchema) {
                if (this.table[i][newSchema[j]] == undefined) {
                    this.table[i][newSchema[j]] = null;
                }
            }
        }
        this.schema = newSchema;
    }

    rename(name) {
        if(typeof(name) !== "string"){
            console.warn("Failed renaming table. Make sure name is of type string");
        }
        else{
            this.name = name;
        }
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
        if (this.table.isEmpty()) {
            console.log(`Table ${this.name} is empty`);
        } else {
            console.table(this.table);
        }
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
            console.log(`Successfully inserted ${row.toString()} to ${this.name}`);
        } else {
            console.warn("Input object is using wrong schema.\nFailed inserting into table.\nTable schema is: ");
            console.log(this.schema);
            console.warn("Your input object schema is: ");
            console.log(rowSchema);
        }
    }

    toHTML(path) {
        if(path == undefined){
            path = '';
        }
        else if(typeof(path) !== "string"){
            path = '';
        }
        let i;
        // Writes table into a new html file for better visualization
        let html = `<!DOCTYPE html>
            <html lang="en">
            <head>
            <title>${this.name}</title>
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
        fs.writeFileSync(`${path}${this.name}.html`, html, (err) => {
            if (err) console.warn(err);
            else console.log("HTML file of table created");
        });
    }

    toCSV(path) {
        if(path == undefined){
            path = '';
        }
        else if(typeof(path) !== "string"){
            path = '';
        }
        let i;
        let newFileName = '';
        if (this.isCSV) {
            newFileName = this.csvName;
        } else {
            newFileName = this.filename.split('.json')[0] + '.csv';
        }
        let csv = '';
        // noinspection Annotator
        for (i in this.schema) {
            if (i !== this.schema.length - 1) {
                csv += `${this.schema[i]},`
            } else {
                csv += `${this.schema[i]}`
            }
        }
        csv += '\n';
        // noinspection Annotator
        for (i in this.table) {
            for (let j in Object.values(this.table[i])) {
                if (j !== Object.values(this.table[i]).length - 1) {
                    csv += `${Object.values(this.table[i])[j]},`
                } else {
                    csv += `${Object.values(this.table[i])[j]}`;
                }
            }
            if (i !== this.table.length - 1) {
                csv += '\n';
            }
        }
        fs.writeFileSync(`${path}${newFileName}`, csv, (err) => {
            if (err) console.log(err);
            else {
                console.log(`${this.filename} updated`);
            }
        });
        let consoleMessage = "";
        if (this.isCSV) {
            consoleMessage = `Updated ${this.csvName}`;
        } else {
            consoleMessage = `Converted ${this.filename} to CSV and created ${newFileName}`;
        }
        console.log(consoleMessage);
    }

    simpleSearch(column, value) {
        if (typeof (column) != "string" || typeof (value) != "string" || !column || !value) {
            console.warn("Failed  searching table. Make sure column and value are both of type string");
        } else {
            // Looks for rows that match and adds them to return array of objects
            const result = [];
            for (let i = 0; i < this.table.length; i++) {
                if (this.table[i][column] === value) {
                    result.push(this.table[i]);
                }
            }
            if (!result.isEmpty()) {
                return result;
            } else {
                console.warn("Value not found!");
            }
        }
    }

    returnIndices(column, value) {
        if (typeof (column) != "string" || typeof (value) != "string") {
            console.warn("Failed  searching table. Make sure column and value are both of type string");
        }
        // Looks for rows that match and adds them to return array of indices
        else {
            const result = [];
            for (let i = 0; i < this.table.length; i++) {
                if (this.table[i][column] === value) {
                    result.push(i);
                }
            }
            if (!result.isEmpty()) {
                return result;
            } else {
                console.warn("Value not found!");
            }
        }
    }

    simpleSearchWithAttribute(column, value, attribute) {
        if (typeof (column) !== "string" || typeof (value) !== "string" || typeof (attribute) !== "string") {
            console.warn("Failed searching table. Make sure column, value and attribute are both of type string")
        }
        // Looks for rows that match and adds value of the attribute to return array
        else {
            const result = [];
            for (let i = 0; i < this.table.length; i++) {
                if (this.table[i][column] === value) {
                    result.push(this.table[i][attribute]);
                }
            }
            if (!result.isEmpty()) {
                return result;
            } else {
                console.log("Value not found!");
            }
        }
    }

    duplicateSearch() {
        // Looks for duplicates in table and returns array of duplicate objects with original index and duplicate indices
        const format = (duplicateArray) => {
            let j;
            let i = 0;
            while (i < duplicateArray.length) {
                j = i + 1;
                while (j < duplicateArray.length) {
                    if (duplicateArray[i].duplicateIndex[0] === duplicateArray[j].originalIndex) {
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
                    if (duplicateArray[i] !== undefined && duplicateArray[j] !== undefined && duplicateArray[i].item.equals(duplicateArray[j].item)) {
                        duplicateArray[j] = undefined;
                    }
                    j++;
                }
                i++;
            }
            duplicateArray = duplicateArray.clean();
            return duplicateArray;
        };
        let x = 0;
        let duplicates = [];
        while (x < this.table.length) {
            let z = x + 1;
            while (z < this.table.length) {
                if (this.table[x] !== undefined && this.table[x] !== undefined && this.table[x].equals(this.table[z])) {
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
        if (duplicates.isEmpty()) {
            console.log(`No duplicates found in ${this.name}`);
        } else {
            return duplicates;
        }

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
        if(typeof(index) !== "number"){
            console.warn("Failed removing item from table. Make sure index is of type number")
        }
        else {
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
    }

    removeByAttribute(column, value) {
        // Removes all the elements that match column = value from table
        if(typeof(column) !== "string" && typeof(value) !== "string"){
            console.warn("Error removing item from table. Make sure column and value are of type string");
        }
        else {
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
    }

    swap(target, destination) {
        if (typeof (target) !== "number" || typeof (destination) !== "number") {
            console.warn("Failed swapping items. Make sure target and destination are both not  empty and of type number");
        } else {
            // Swaps rows
            let temp = this.table[target];
            this.table[target] = this.table[destination];
            this.table[destination] = temp;
            console.log(`Swapped row at index ${target} with row at index ${destination}`);
        }
    }

    static join(table1, table2, attribute1, attribute2) {
        // Performs simple inner join on table1 and table2
        if (table1 instanceof Table && table2 instanceof Table && typeof(attribute1) === "string" && typeof(attribute2) === "string") {
            console.log("Both of them instance of table");
            let newSchema = table1.schema;
            let i;
            let j;
            let k;
            for (i in table2.schema) {
                if (!(newSchema.includes(table2.schema[i]))) {
                    newSchema.push((table2.schema[i]));
                }
            }
            let join = new Table({
                name: `${table1.name}_${table2.name}_join`,
                schema: newSchema,
                isNew: true
            });
            for (i in table1.table) {
                let val1 = table1.table[i][attribute1];
                for (j in table2.table) {
                    let val2 = table2.table[j][attribute2];
                    let obj = {};
                    if (val1 == val2) {
                        for (k in newSchema) {
                            if (table2.schema.includes(newSchema[k])) {
                                obj[newSchema[k]] = table2.table[j][newSchema[k]];
                            } else {
                                obj[newSchema[k]] = table1.table[i][newSchema[k]];
                            }
                        }
                    }
                    if (Object.values(obj) != 0) {
                        join.insert(obj);
                    }
                }
            }
            return join;
        } else {
            console.warn("Failed performing join. Make sure  table1 and table2 are both instance  of Table");
        }
    }
};