let hcaData = [];

async function handleOnLoad() {
    await getData();
    displayDropdowns();
}

// Initialize the map
const map = L.map('map').setView([37.8, -96], 4);
const filterSelect = document.getElementById('filter');

// Define colors for different facility types
var colors = {
    divisionOffice: '#ffa500',  // Orange
    supplyChainCenter: '#0000ff',  // Blue
    sharedServiceCenter: '#008000',  // Green
    hospital: '#FF0000'  // Pink
};

fetch('resources/scripts/data.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            // Determine marker color based on facility_type
            let markerColor = '#000000'; // Default color
            switch (item.facility_type) {
                case "Division Office":
                    markerColor = colors.divisionOffice;
                    break;
                case "Supply Chain Center":
                    markerColor = colors.supplyChainCenter;
                    break;
                case "Shared Service Center":
                    markerColor = colors.sharedServiceCenter;
                    break;
                case "Hospital":
                    markerColor = colors.hospital;
                    break;
            }

            // Create a circleMarker with the determined color
            let marker = L.circleMarker([item.latitude, item.longitude], {
                color: markerColor,
                fillColor: markerColor,
                fillOpacity: 0.5,
                radius: 8
            }).addTo(map).bindPopup(
                `<b>${item.facility_name}</b>
                <br>${item.full_address}
                <br>${item.emr_name}
                <br>${item.division_name}<br>
                </br>
                <a href="#" class="more-info">More Info</a>`
            );
            marker.on('click', function() {
                // Update the detail pane with information from the clicked item
                updateDetailPane(item);
            });
            
        });
        console.log(data);e
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
    let html = `
    <span>Filter:
        <select onclick="emrFilter()"></select>
    
        <!-- Timezone Dropdown -->
        <select onclick="timezoneFilter()"></select>
    
        <!-- Division Dropdown -->
        <select onclick="divisionFilter()"></select>
    
        <!-- State Dropdown -->
        <select onclick="stateFilter()"></select>
    
        <!-- Address Dropdown -->
        <select onclick="addressFilter()"></select>

        <!-- Include your JavaScript file -->
        <script src="./resources/scripts/index.js"></script>
    </span>`

    document.getElementById('filter-container').innerHTML = html
}

function emrFilter(){
    alert('yo')
}

function timezoneFilter(){
    alert('timezome')
}

function divisionFilter(){
    alert('division')
}

function stateFilter(){
    alert('state')
}

function addressFilter(){
    alert('address')
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


function updateDetailPane(item) {
    const detailPane = document.getElementById('detailPane');
    // Create a content string or HTML structure with the item details
    const content = `
        <h2>${item.facility_name}</h2>
        <p><strong>Facility Type:</strong> ${item.facility_type}</p>
        <p><strong>ID:</strong>${item.facility_id}</p>
        <p><strong>COID:</strong>${item.facility_coid}</p>
        <p><strong>Address:</strong> ${item.full_address}</p>
        <p><strong>Latitude:</strong> ${item.latitude}</p>
        <p><strong>Longitutde:</strong> ${item.longitude}</p>
        <p><strong>EMR Code:</strong> ${item.mnem}</p>
        <p><strong>EMR System:</strong> ${item.demr_name}</p>
        <p><strong>Company Name:</strong> ${item.company_name}</p>
        <p><strong>Division:</strong> ${item.division_name}</p>
        <p><strong>Division:</strong>${item.division_mnem}</p>
        <p><strong>Network:</strong> ${item.network_meditech_network}</p>
        <p><strong>Timezone:</strong> ${item.timezone}</p>
        <p><strong>Timezone Offset:</strong> ${item.tz_utc_offset}</p>
        <p><strong>Timezone Description:</strong> ${item.tz_description}</p>

    `;
    // Set the innerHTML of the detailPane to the content
    detailPane.innerHTML = content;
}

