// Initialize the map
const map = L.map('map').setView([37.8, -96], 4);

// Add the base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Add GeoJSON layer
L.geoJSON(statesData).addTo(map);
