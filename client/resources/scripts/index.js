// Initialize the map
const map = L.map('map').setView([37.8, -96], 4);
const filterSelect = document.getElementById('filter');

fetch('resources/scripts/data.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            L.marker([item.latitude, item.longitude]).addTo(map)
                .bindPopup(
                    `<b>${item.facility_name}</b><br>${item.full_address}<br>${item.emr_name}<br>${item.division_name}`
                    ); // Assuming your JSON has latitude, longitude, and full_address fields
        });
        console.log(data);
    })
    .catch(error => console.error('Error loading data:', error));
 
// Add the base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// const filterTypes = [
//     { name: 'EMR', options: ['EMR', 'EMR Option 1', 'EMR Option 2', 'EMR Option 3'] },
//     { name: 'Division', options: ['Division', 'Address Option 1', 'Address Option 2', 'Address Option 3'] },
//     { name: 'Timezone', options: ['Timezone', 'Address Option 1', 'Address Option 2', 'Address Option 3'] },
//     { name: 'State/Zip', options: ['State', 'Address Option 1', 'Address Option 2', 'Address Option 3'] },
//     { name: 'Address', options: ['Address', 'Address Option 1', 'Address Option 2', 'Address Option 3'] }
   
// ]

function populateDropdown(data, category, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const uniqueValues = [...new Set(data.map(item => item[category]))];

    uniqueValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    });
}

// Fetch data and populate dropdowns
fetch('/client/resources/data.json')
    .then(response => response.json())
    .then(data => {
        populateDropdown(data, 'emr_name', 'emrSelect');
        populateDropdown(data, 'facility_state', 'stateSelect');
        populateDropdown(data, 'timezone', 'timezoneSelect');
        // Add more calls to populateDropdown for other categories
    })
    .catch(error => console.error('Error fetching JSON:', error));



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
    // sidebar.appendChild(link);
});

