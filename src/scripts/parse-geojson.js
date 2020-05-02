const fs = require("fs");

const validTypes = ['country', 'us-state', 'canada-state', 'mexico-state', 'us-county'];
const validPrecisions = ['large', 'medium'];
const isValidStateType = ((val) => ['us-state', 'canada-state', 'mexico-state'].includes(val) );
if (process.argv.length < 4 || !validTypes.includes(process.argv[2]) || !validPrecisions.includes(process.argv[3])) {
  console.error("You must specify one of the valid data types as a command line argument:\n" + 
                "    country\n" + 
                "    us-state\n" + 
                "    canada-state\n" + 
                "    mexico-state\n" + 
                "    us-county\n" + 
                "And you must specify the precision of the input file to use - medium or large.\n" + 
                "Example - ./parse-geojson.js us-state large");
  process.exit(1);
}

const inputType = process.argv[2];
const precision = process.argv[3];
const inputFileName = (() => {
  switch(inputType) {
    case 'country': 
      return `country-${precision}.json`;
    case 'us-state':
    case 'canada-state':
    case 'mexico-state': 
      return `states-${precision}.json`;
    case 'us-county': 
      return `county-${precision}.json`;
    default: 
      return null;
  }
})();

const contents = fs.readFileSync(`./geojson-data/${inputFileName}`);
const rawJsonContent = JSON.parse(contents);

const neededCountryCode = (() => {
  switch(inputType) {
    case 'us-state': return 'US';
    case 'canada-state': return 'CA';
    case 'mexico-state': return 'MX';
    default: return null;
  }
})();

const isCountry = inputType === 'country';
const validCountryTypes = ['Sovereign country', 'Country'];

const rawGeoJsonItems = isValidStateType(inputType) ? 
  rawJsonContent.features.filter(x => x.properties.iso_a2 && x.properties.iso_a2 === neededCountryCode) :
  rawJsonContent.features.filter(x => validCountryTypes.includes(x.properties.TYPE));

const featureDataStructured = rawGeoJsonItems.map(item => {
  const name = isCountry ? item.properties.ADMIN : item.properties.name;
  const id = isCountry ? item.properties.NAME : item.properties.postal;
  const featureType = item.geometry.type;
  if (featureType !== "Polygon" && featureType !== "MultiPolygon") {
    console.error("Got an unexpected coordinate type - " + coordinateType);
    process.exit(1);
  }

  let center;
  // Country does not have a defined center so just use the first coordinate
  if (isCountry) {
    center = featureType === 'MultiPolygon' ?
      item.geometry.coordinates[0][0][0] :
      item.geometry.coordinates[0][0];
  } else {
    center = [item.properties.longitude, item.properties.latitude];
  }

  return {
    id,
    name,
    center
  };

});

const cutCoordinatePrecision = (coordinate) => {
  const lon = parseFloat(coordinate[0].toFixed(4));
  const lat = parseFloat(coordinate[1].toFixed(4));  
  return [lon, lat];
};

// The raw GeoJSON has a lot of unnecessary data (like the name in all languages), and the coordinates
// are very precise. To cut down on the amount of data for the file, cut these out and cut the precision
// of the coordinates.
const geoJsonFeaturesParsed = rawGeoJsonItems.map(item => {
  const id = isCountry ? item.properties.NAME : item.properties.postal;
  const featureType = item.geometry.type;
  let coordinates;
  if (featureType === 'MultiPolygon') {
    coordinates = item.geometry.coordinates.map(polygons => {
      return polygons.map(polygon => {
        return polygon.map(cutCoordinatePrecision);
      });
    });
  } else {
    coordinates = item.geometry.coordinates.map(polygon => {
      return polygon.map(cutCoordinatePrecision);
    });
  }
  return {
    type: 'Feature',
    properties: {
      id
    },
    geometry: {
      type: featureType,
      coordinates
    }
  };
});

const geoJsonParsed = {
  type: 'FeatureCollection',
  features: geoJsonFeaturesParsed
}

fs.writeFile(`../../public/data/${inputType}-${precision}-data.json`, JSON.stringify(featureDataStructured), (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Wrote file ${inputType}-data.json`);
});

fs.writeFile(`../../public/data/${inputType}-${precision}-geojson.json`, JSON.stringify(geoJsonParsed), (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Wrote file ${inputType}-geojson.json`);
})

