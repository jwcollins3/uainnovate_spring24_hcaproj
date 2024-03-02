// Initialize the map
const map = L.map('map').setView([37.8, -96], 4);
const filterSelect = document.getElementById('filter');

// Add the base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Add GeoJSON layer
L.geoJSON(statesData).addTo(map);

// Add event listener to handle filter change
filterSelect.addEventListener('change', function() {
    const filterValue = this.value; // Get the selected filter value

    // Perform filtering based on selected value
    if (filterValue === 'state') {
        // Logic to filter by state
        // Example: showStateMarkers();
    } else if (filterValue === 'city') {
        // Logic to filter by city
        // Example: showCityMarkers();
    } else {
        // Show all markers
        // Example: showAllMarkers();
    }
});

// Side Bar Click
// Array of link names
const linkNames = ['Home', 'News', 'Contact', 'About'];

// Get the sidebar container
const sidebar = document.getElementById('sidebar');

// Iterate over the link names array and create anchor elements
linkNames.forEach((name, index) => {
    // Create anchor element
    const link = document.createElement('a');
    
    // Set href attribute
    link.href = '#' + name.toLowerCase();
    
    // Set text content
    link.textContent = name;
    
    // Add active class to the first link
    if (index === 0) {
        link.classList.add('active');
    }
    
    // Append the anchor element to the sidebar container
    sidebar.appendChild(link);
});