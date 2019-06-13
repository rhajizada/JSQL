/*
    This module takes csv file and generates an array of JS objects
 */
const fs = require('fs');
module.exports = function  csv2json(filename){
    let i;
    const array = csv2array(filename);
    const schemaPrototype = array[0];
    const schema = [];
    for(i in schemaPrototype[0]){
        schema.push(schemaPrototype[0][i]);
    }
    const jsonArray = [];
    for (i = 1; i < array.length; i++) {
        const object = {};
        for (let j = 0; j < array[i][0].length; j++) {
            object[schema[j]] = array[i][0][j];
        }
        jsonArray.push(object);
    }
    return jsonArray;
};
function csv2array(filename){
    let csv = fs.readFileSync(filename, 'utf-8').match(/^.+$/gm);
    const thing = [];
    for(let i in csv){
        thing.push(line2array(csv[i]));
    }
    return thing;
}

function line2array( strData, strDelimiter ){
    let strMatchedValue;
    strDelimiter = (strDelimiter || ",");
    const objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );
    const arrData = [[]];
    let arrMatches = null;
    while (arrMatches = objPattern.exec(strData)){
        const strMatchedDelimiter = arrMatches[1];
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter !== strDelimiter)
            ){
            arrData.push( [] );
        }
        if (arrMatches[ 2 ]){
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );
        } else {
            strMatchedValue = arrMatches[3];
        }
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    return( arrData );
}

