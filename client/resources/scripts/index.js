function handleOnLoad(){
    displayDropdowns()
}

// Initialize the map
const map = L.map('map').setView([37.8, -96], 4);
const filterSelect = document.getElementById('filter');

fetch('/client/resources/data.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            L.marker([item.latitude, item.longitude]).addTo(map)
                .bindPopup(item.full_address); // Assuming your JSON has latitude, longitude, and full_address fields
        });
        console.log(data);
    })
    .catch(error => console.error('Error loading data:', error));
 

// Add the base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);


const filterTypes = [
    { name: 'EMR', options: ['EMR', 'Cerner', 'EPIC', 'MT56', 'MTx', 'MTX', 'Unknown'] },
    { name: 'Division', options: ['Division', 'Address Option 1', 'Address Option 2', 'Address Option 3'] },
    { name: 'Timezone', options: ['Timezone', 'Eastern Timezone', 'Pacific Timezone', 'Central Timezone', 'Alaska Timezone', 'Mountain Timezone'] },
    { name: 'State', options: ['State', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'] },
    { name: 'Address', options: ['Address', 'Address Option 1', 'Address Option 2', 'Address Option 3'] },
    // Add more filter types with their respective options as needed
];

function displayDropdowns() {
    fetch('/client/resources/data.json')
        .then(response => response.json())
        .then(data => {
            populateDropdowns(data, 'EMR', 'emrSelect');
            populateDropdowns(data, 'Timezone', 'timezoneSelect');
            populateDropdowns(data, 'Division', 'divisionSelect');
            populateDropdowns(data, 'State', 'stateSelect');
            populateDropdowns(data, 'Address', 'addressSelect');
            // Add more calls to populateDropdown for other categories
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

function populateDropdowns(data, category, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const filterType = filterTypes.find(filter => filter.name.toLowerCase() === category.toLowerCase());

    if (filterType) {
        filterType.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.toLowerCase().replace(/\s+/g, ''); // Convert option text to lowercase and remove spaces
            optionElement.textContent = option;
            // dropdown.appendChild(optionElement);
        });
    }
}





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

