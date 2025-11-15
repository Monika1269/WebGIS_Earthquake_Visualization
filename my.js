var map;

document.addEventListener('DOMContentLoaded', function () {
    map = L.map('map').setView([27.7088, 85.3205], 8);
    initializeMap();
});
document.addEventListener('DOMContentLoaded', function () {
    map = L.map('map').setView([27.7088, 85.3205], 8);
    initializeMap();

});


function initializeMap() {
    var osmLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    });

    var topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.opentopomap.org/">OpenTopoMap</a>'
    });

    var baseMaps = {
        "OpenStreetMap": osmLayer,
        "Topographic Map": topoLayer
    };

    var markers = L.markerClusterGroup();
    map.addLayer(markers);

    map.addControl(new L.Control.Fullscreen());

    var miniMap = new L.Control.MiniMap(osmLayer, { toggleDisplay: true }).addTo(map);

    L.control.layers(baseMaps).addTo(map);

    osmLayer.addTo(map);

    function fetchEarthquakeData(startDate, endDate) {
        // Format the dates to ISO strings
        const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
        const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
    
        // Construct the URL with properly formatted dates
        const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${formattedStartDate}&endtime=${formattedEndDate}&minmagnitude=4.0&limit=1000`;
    
        // Fetch earthquake data
        fetch(url)
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, {
                            radius: 8,
                            color: 'red',
                            fillColor: 'red',
                            fillOpacity: 0.7
                        }).bindPopup(`<strong>Magnitude:</strong> ${feature.properties.mag}<br><strong>Location:</strong> ${feature.properties.place}`);
                    }
                }).addTo(markers); // Add earthquake data to the marker cluster
            })
            .catch(error => {
                console.error('Error fetching earthquake data:', error);
            });
    }
    
    

    // Get earthquake data function called on button click
    function getData() {
        const startDate = document.getElementById('start').value;
        const endDate = document.getElementById('end').value;
        fetchEarthquakeData(startDate, endDate);
    }

    // adding a marker on map click
    map.on('click', function (e) {
        var marker = L.marker(e.latlng).addTo(map);
        marker.bindPopup('You clicked the map at ' + e.latlng.toString()).openPopup();
    });

    // Attaching event listener to the button to fetch earthquake data
    document.querySelector('button').addEventListener('click', getData);

}
