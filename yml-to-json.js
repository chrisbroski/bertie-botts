/* jshint esversion: 6 */

const yaml = require('js-yaml');
const fs = require('fs');

fs.readFile('flavors.yml', function (err, data) {
    const jsonData = yaml.safeLoad(data);
    console.log(jsonData[Object.keys(jsonData)[0]].length  + " flavors so far");

    fs.writeFile('flavors.json', JSON.stringify(jsonData), function () {});
});
