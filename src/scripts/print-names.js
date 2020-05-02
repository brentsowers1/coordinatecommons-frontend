const fs = require("fs");

const contents = fs.readFileSync(`./geojson-data/country-medium.json`);
const rawJsonContent = JSON.parse(contents);

const countries = rawJsonContent.features.filter(x => x.properties.TYPE === 'Sovereign country').map(x => x.properties.ADMIN);

console.log(countries.join(', '));
