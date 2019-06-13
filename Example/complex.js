let Table = require('../jsql');
let activity_log = Table.fromComplexJSON('My Data/activity_log_1.json'); // Use your filename for complexjson
let i;
let location_history = Table.fromComplexJSON('My Data/Location History.json');
for(i in location_history){
    location_history[i].epochToReadable('timestampMs'); // this function takes time formatted as epoch into time string
}
location_history[0].toHTML('My Data/Location/'); //