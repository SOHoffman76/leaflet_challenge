// Initialize the Map
// Create the map object with center and zoom level
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // Add a tile layer (the background map image) to the map.
  // with the addTo method to add objects to our map.
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(myMap);
  
  // URL to fetch earthquake data for the last 7 days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function for each feature in the array
  // Give each feature a popup - place and time
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  // circle markers based on magnitude
  function createCircleMarker(feature, latlng) {
    let options = {
      radius: feature.properties.mag * 5,
      fillColor: getColor(feature.properties.mag),
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    return L.circleMarker(latlng, options);
  }

  // GeoJSON layer containing the features array on the earthquakeData object
  // onEachFeature function once for each piece of data in the array
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });

  // Add the earthquakes layer to the map
  earthquakes.addTo(myMap);
}

// Function to determine marker color based on earthquake magnitude
function getColor(magnitude) {
  return magnitude > 5 ? '#F06B6B' :
         magnitude > 4 ? '#F0A76B' :
         magnitude > 3 ? '#F3BA4D' :
         magnitude > 2 ? '#F3DB4D' :
         magnitude > 1 ? '#E1F34D' :
                         '#B7F34D';
}
// Create a legend (using Leaflet's "L.control")
// the 'onAdd' creates a div and populates it with colored squares
// representing depth.
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [-10, 10, 30, 50, 70, 90];
  var colors = [
    '#A3F600',
    '#DCF400',
    '#F7DB11',
    '#FDB72A',
    '#FCA35D',
    '#FF5F65'
  ];

  // Loop through our depth intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

// Add the legend to the map
legend.addTo(myMap);