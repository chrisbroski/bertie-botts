/* jshint esversion: 6 */

const yaml = require('js-yaml');
const fs = require('fs');

fs.readFile('flavors.yml', function (err, data) {
    const jsonData = yaml.safeLoad(data);
    console.log(jsonData[Object.keys(jsonData)[0]].length  + " flavors so far");

    fs.writeFile('flavors.json', JSON.stringify(jsonData), function () {});
});

fs.readFile('names.yml', function (err, data) {
    const jsonData = yaml.safeLoad(data);
    console.log(jsonData.names.magic.sur.length  + " surnames");
    console.log(jsonData.names.magic.male.length  + " male names");
    console.log(jsonData.names.magic.female.length  + " female names");

    fs.writeFile('names.json', JSON.stringify(jsonData), function () {});
});
