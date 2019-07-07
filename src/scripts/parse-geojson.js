const fs = require("fs");
const contents = fs.readFileSync("../../public/data/us-state.json");
const jsonContent = JSON.parse(contents);

var structured = jsonContent.features.map(state => {
  console.log("state => ");
  const name = state.properties.name;
  const id = state.properties.postal;
  const center = [state.properties.longitude, state.properties.latitude];
  const featureType = state.geometry.type;
  if (featureType !== "Polygon" && featureType !== "MultiPolygon") {
    console.log("Got an unexpected coordinate type - " + coordinateType);
    return null;
  } else {
    const coordinates = state.geometry.coordinates.map(polygon => {
      if (featureType === "MultiPolygon") {
        polygon = polygon[0];
      }
      console.log("    polygon => " + JSON.stringify(polygon));
      return polygon.map(coordinate => {
        console.log("        coordinate => " + JSON.stringify(coordinate));
        // The input files have a really high number of decimal places. This is not necessary, so 
        // to reduce data file size sent to front end, and memory used up, reduce precision
        const lon = parseFloat(coordinate[0].toFixed(4));
        const lat = parseFloat(coordinate[1].toFixed(4));
        return [lon, lat];    
      });
    });
    return {
      id,
      name,
      center,
      coordinates
    };  
  }
});

fs.writeFile("../../public/data/us-state-converted.json", JSON.stringify(structured), (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Wrote file");
});

