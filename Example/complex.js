// Example of working with complex JSON files
let Table = require('../jsql');
let activity_log = Table.fromComplexJSON('Sample Data/My Data/activity_log_1.json'); // Use your filename for complex json
let i;
let location_history = Table.fromComplexJSON('Sample Data/My Data/Location History.json');
for(i in location_history){
    location_history[i].epochToReadable('timestampMs'); // this function takes time formatted as epoch into time string
}
location_history[0].toHTML('Sample Data/My Data/Location/'); // Creates an html