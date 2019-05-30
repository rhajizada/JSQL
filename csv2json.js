/*
    This module takes csv file and generates an array of JS objects
 */
const fs = require('fs');
module.exports = function  csv2json(filename){
    var array = csv2array(filename);
    var schemaPrototype = array[0];
    var schema = [];
    for(var i in schemaPrototype[0]){
        schema.push(schemaPrototype[0][i]);
    }
    var jsonArray = [];
    for (var i = 1; i < array.length; i++) {
        var object = {};
        for (var j = 0; j < array[i][0].length; j++) {
            object[schema[j]] = array[i][0][j];
        }
        jsonArray.push(object);
    }
    return jsonArray;
}
function csv2array(filename){
    let csv = fs.readFileSync(filename, 'utf-8').match(/^.+$/gm);
    var thing = [];
    for(var i in csv){
        thing.push(line2array(csv[i]));
    }
    return thing;
}

function line2array( strData, strDelimiter ){
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );
    var arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec( strData )){
        var strMatchedDelimiter = arrMatches[ 1 ];
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
            ){
            arrData.push( [] );
        }
        if (arrMatches[ 2 ]){
            var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );
        } else {
            var strMatchedValue = arrMatches[ 3 ];
        }
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    return( arrData );
}

