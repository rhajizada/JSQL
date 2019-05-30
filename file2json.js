/*
        This module takes JSON array file and returns an array of jsons
        Was written to get rid of 'jsonfile' module dependency
 */
const fs = require('fs');
module.exports = function file2json(filename){
        let json= fs.readFileSync(filename, 'utf-8')
        return JSON.parse(json);
}