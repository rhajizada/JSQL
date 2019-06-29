/*
    Given sqlite3 db name converts all the table in the db to json files and returns array of names and filenames for those json, gives empty array if
*/
module.exports = function sqlite2json(filename, path){
    let filepath = path;
    if (typeof (filename) != "string") {
        console.warn("Failed convert sqlite3 database to json. Make sure filename is of type string");
    } else {
        const sqlite = require('better-sqlite3');
        const fs = require('fs');
        const db = new sqlite(filename);
        let dbName = '';
        if (filename.includes('/')) {
            const dbSize = filename.split('/').length
            const dbNameWithoutPath = filename.split('/')[dbSize - 1];
            dbName = dbNameWithoutPath.split('.')[0];
        } else {
            dbName = filename.split('.')[0];
        }
        if(filepath !== undefined && typeof(filepath) === "string"){
            filepath = `${path}/${dbName}`;
        } else {
            filepath = dbName;
        }
        !fs.existsSync(filepath) && fs.mkdirSync(filepath); // Creates folder in case folder does not exist
        const tableNamesRequest = db.prepare("select name from sqlite_master where type='table'").all();
        let tableNames = [];
        for (let i in tableNamesRequest) {
            tableNames.push(tableNamesRequest[i].name);
        }
        for (let i in tableNames) {
            fs.writeFileSync(`${filepath}/${tableNames[i]}.json`, JSON.stringify(db.prepare(`select * from ${tableNames[i]}`).all()), (err) => {
                if (err) console.log(err);
            });
        }
        let returnStatement = [];
        for (i in tableNames) {
            let obj = {
                name: `${dbName}-${tableNames[i]}`,
                filename: `${filepath}/${tableNames[i]}.json`
            }
            returnStatement.push(obj);
        }
        if(returnStatement.length != 0){
        return returnStatement;
        }
        else{
            console.warn(`Could not create sqlite3 database to json. File ${filename} does not exist`);
        }
    }
}
