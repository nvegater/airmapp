# Convert Bbox to Geojson

## What is this

This app consists on a form where you can enter valid boundary Box coordinates (min/max Latitudes and min/max Longitudes) 
to see the features within the boundary box displayed in a map. 
The bounding box area should be within the limits allowed by openstreetmap's api. (area shouldn't be bigger than 0.25)

### References

* [Valid bounding box](https://wiki.openstreetmap.org/wiki/Bounding_Box)
* [API download policy](https://wiki.openstreetmap.org/wiki/Downloading_data)
* [Bounding box computation](https://wiki.openstreetmap.org/wiki/API_v0.6#Bounding_box_computation)
* [OSM JSON Format](http://overpass-api.de/output_formats.html#json)
* [Tool for converting OSM file returned by Openstreetmap api to a displayable set of GeoJSON Features](https://github.com/tyrasd/osmtogeojson)

## Tech stack

* Single page app bootstrapped with create-react-app
* Typescript
* Jest and react-testing-library
* Chakra UI component library
* SWR for hooks syntax for API calls
* Axios and QS for query parameter formatting
* React-hook-form for easy input validation, component library intergration and unit testing.
* Turf and osmtogeojson for GeoJSON operations
* React Leaflet for the map with Open street map tiles

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

