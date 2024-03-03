let hcaData = [];

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

//References to use for filtering
var markerReferences = {};
var markerObjects = {};

fetch('resources/scripts/data.json')
    .then(response => response.json())
    .then(data => {
        // Create a Marker Cluster Group
        markers = new L.markerClusterGroup({
            spiderfyOnMaxZoom: true
        });
        

        data.forEach(item => {
            // Determine marker color based on facility_type
            let markerColor = '#000000';
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
            }).bindPopup(
                `<b><span class="orange-text">${item.facility_name}</span></b><br>${item.full_address}<br>${item.emr_name}<br>${item.division_name}`
            );
            marker.on('mouseover', function(ev) {
                marker.openPopup();
            });
            marker.on('click', function() {
                // Update the detail pane with information from the clicked item
                updateDetailPane(item);
                
            });
            markers.on('mouseover', function (a) {
                a.layer.spiderfy();
            });
            markers.on('mouseover', function (b) {
                b.layer.spiderfy();
            });
            
            markerObjects[item] = marker;
            markerReferences[item] =  markers.addLayer(marker);
        });

        // Add the Marker Cluster Group to the map
        map.addLayer(markers);
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

const filterOptions = {
    all: [],
    address: ['Full Address', 'City', 'State', 'Zip'],
    state: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'], // All 50 states
    division: ['Capital', 'Central West Texas', 'Continental', 'East Florida', 'Far West', 'Gulf Coast', 'HCA Corp', 'HSC', 'MidAmerica', 'Mountain', 'North Carolina', 'North Florida', 'North Texas', 'Physician Services Group', 'San Antonio', 'South Atlantic', 'Supply Chain', 'Tristar'], // Will be populated dynamically
    timeZone: ['Eastern', 'Central', 'Mountain', 'Pacific', 'Alaska'],
    emr: ['Cerner', 'EPIC', 'MT56', 'MT6x', 'MTX', 'None', 'Unknown']
};


document.addEventListener("DOMContentLoaded", function() {
    const filterSelect = document.getElementById('filterOptions');
    const subFilterSelect = document.getElementById('subFilterOptions');
    let hcaData = []; 
    

    let filteredOption = ""; 

    filterSelect.addEventListener('change', function(){
        console.log("Change for Filter Select")
        const selectedOption = filterSelect.value;
        const options = filterOptions[selectedOption] || [];
        populateSubFilterOptions(subFilterSelect, options);
    })

    subFilterSelect.addEventListener('change', async function() {
        console.log("Change for Sub Filter Select")
        const selectedOption = filterSelect.value;
        const filteredOption = subFilterSelect.value
    
        for (const item of hcaData) {
            if (filteredOption == item.facility_state) {
                if (!markers.hasLayer(markerReferences[item])) {
                    console.log("true");
                    await markers.addLayer(markerReferences[item]);
                } 
            } else {
                if (markers.hasLayer(markerReferences[item])) {
                    markers.removeLayer(markerReferences[item]);
                    console.log("false");
                }
            }
        }
    
        console.log(markers);
    });
    
    

    fetch('resources/scripts/data.json')
        .then(response => response.json())
        .then(data => {
            hcaData = data;
            const divisionNames = [...new Set(data.map(item => item.division_name))];
            filterOptions.division = divisionNames;
        })
        .catch(error => console.error('Error loading data:', error))
});


function populateSubFilterOptions(select, options) {
    select.innerHTML = '<option value="">Select a filter</option>';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.text = option;
        select.appendChild(optionElement);
    });
}

//Detail Side Bar

function updateDetailPane(item) {
    const detailPane = document.getElementById('detailPane');
    
    const content = `
        <h2>${item.facility_name}</h2>
        '<hr>';
        <p><strong class="orange-text">Facility Type:</strong> ${item.facility_type}</p>
        <p><strong strong class="orange-text">ID:</strong> ${item.facility_id}</p>
        <p><strong strong class="orange-text">COID:</strong> ${item.facility_coid}</p>
        <p><strong strong class="orange-text">Address:</strong> ${item.full_address}</p>
        <p><strong strong class="orange-text">Latitude:</strong> ${item.latitude}</p>
        <p><strong strong class="orange-text">Longitutde:</strong> ${item.longitude}</p>
        <p><strong strong class="orange-text">EMR Code:</strong> ${item.emr_mnem}</p>
        <p><strong strong class="orange-text">EMR System:</strong> ${item.emr_name}</p>
        <p><strong strong class="orange-text">Company Name:</strong> ${item.company_name}</p>
        <p><strong strong class="orange-text">Division:</strong> ${item.division_name}</p>
        <p><strong strong class="orange-text">Division:</strong> ${item.division_mnem}</p>
        <p><strong strong class="orange-text">Network:</strong> ${item.network_meditech_network}</p>
        <p><strong strong class="orange-text">Timezone:</strong> ${item.timezone}</p>
        <p><strong strong class="orange-text">Timezone Offset:</strong> ${item.tz_utc_offset}</p>
        <p><strong strong class="orange-text">Timezone Description:</strong> ${item.tz_description}</p>

    `;
    
    detailPane.innerHTML = content;
}