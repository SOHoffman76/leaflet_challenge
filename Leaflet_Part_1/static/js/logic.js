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
  