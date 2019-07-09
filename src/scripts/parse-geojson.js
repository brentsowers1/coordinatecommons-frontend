const fs = require("fs");

const validTypes = ['country', 'us-state', 'canada-state', 'mexico-state', 'us-county'];
const isValidStateType = ((val) => ['us-state', 'canada-state', 'mexico-state'].includes(val) );
if (process.argv.length < 3 || !validTypes.includes(process.argv[2])) {
  console.error("You must specify one of the valid data types as a command line argument:\n" + 
                "    country\n" + 
                "    us-state\n" + 
                "    canada-state\n" + 
                "    mexico-state\n" + 
                "    us-county\n");
  process.exit(1);
}

const inputType = process.argv[2];
const inputFileName = (() => {
  switch(inputType) {
    case 'country': 
      return 'country.json';
    case 'us-state':
    case 'canada-state':
    case 'mexico-state': 
      return 'states.json';
    case 'us-county': 
      return 'county.json';
    default: 
      return null;
  }
})();

const contents = fs.readFileSync(`./geojson-data/${inputFileName}`);
const jsonContent = JSON.parse(contents);

const neededCountryCode = (() => {
  switch(inputType) {
    case 'us-state': return 'US';
    case 'canada-state': return 'CA';
    case 'mexico-state': return 'MX';
    default: return null;
  }
})();

const isCountry = inputType === 'country';

const geoJsonItems = isValidStateType(inputType) ? 
  jsonContent.features.filter(x => x.properties.iso_a2 && x.properties.iso_a2 === neededCountryCode) :
  jsonContent.features;

const structured = geoJsonItems.map(item => {
  //console.log("state => ");
  const name = isCountry ? item.properties.ADMIN : item.properties.name;
  const id = isCountry ? item.properties.NAME : item.properties.postal;
  const featureType = item.geometry.type;
  if (featureType !== "Polygon" && featureType !== "MultiPolygon") {
    console.error("Got an unexpected coordinate type - " + coordinateType);
    process.exit(1);
  } else {
    const coordinates = item.geometry.coordinates.map(polygon => {
      if (featureType === "MultiPolygon") {
        polygon = polygon[0];
      }
      //console.log("    polygon => " + JSON.stringify(polygon));
      return polygon.map(coordinate => {
        //console.log("        coordinate => " + JSON.stringify(coordinate));
        // The input files have a really high number of decimal places. This is not necessary, so 
        // to reduce data file size sent to front end, and memory used up, reduce precision
        const lon = parseFloat(coordinate[0].toFixed(4));
        const lat = parseFloat(coordinate[1].toFixed(4));
        return [lon, lat];    
      });
    });
    // Country does not have a defined center so just use the first coordinate
    const center = isCountry ? 
      coordinates[0][0] :
      [item.properties.longitude, item.properties.latitude];

    return {
      id,
      name,
      center,
      coordinates
    };  
  }
});

fs.writeFile(`../../public/data/${inputType}.json`, JSON.stringify(structured), (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Wrote file ${inputType}.json`);
});

