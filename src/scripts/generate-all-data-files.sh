#!/bin/sh

node ./parse-geojson.js country large
node ./parse-geojson.js country medium
node ./parse-geojson.js us-state large
node ./parse-geojson.js us-state medium
node ./parse-geojson.js canada-state large
node ./parse-geojson.js canada-state medium
node ./parse-geojson.js mexico-state large
node ./parse-geojson.js mexico-state medium
