let map;
let activeRoute = null;
let activeMarker = null;

document.addEventListener('DOMContentLoaded', function() {
    const wanderungen = [
        {
            name: "Wildensee",
            koordinaten: [47.713114, 13.853089],
            distanz: "1,8 km",
            höhenmeter: "120 hm",
            gehzeit: "30 Minuten",
            schwierigkeit: "leicht",
            bild: "see.jpg",
            beschreibung: "Wunderschöner Bergsee",
            gpxFile: "Wildensee.gpx"
        },
        {
            name: "Rinnerkogel",
            koordinaten: [47.719718, 13.839825],
            distanz: "3,2 km",
            höhenmeter: "570 hm",
            gehzeit: "3 Stunden",
            schwierigkeit: "mittel",
            bild: "rinner.jpg",
            beschreibung: "Ein wunderschöner Gipfel auf 2021m Höhe",
            gpxFile: "Rinnerkogel.gpx"
        },
        {
            name: "Weißhorn",
            koordinaten: [47.72706, 13.86032],
            distanz: "2,0 km",
            höhenmeter: "940 hm",
            gehzeit: "1 Stunde",
            schwierigkeit: "schwer",
            bild: "weiß.jpg",
            beschreibung: "Kein markierter Weg, nur ein Jägersteig, aber man wird durch eine unfassbare Aussicht über das Tote Gebirge belohnt",
            gpxFile: "weißhorn.gpx"
        },
        {
            name: "Albert-Appel-Haus",
            koordinaten: [47.69334, 13.87031],
            distanz: "5,0 km",
            höhenmeter: "300 hm",
            gehzeit: "1,5 Stunden",
            schwierigkeit: "leicht",
            bild: "appelhaus.jpg",
            beschreibung: "Gut markierter Wanderweg durch das wunderschöne Tote Gebirge. Die Hütte bietet eine beeindruckende Aussicht und eine gemütliche Einkehrmöglichkeit.",
            gpxFile: "Albert-Appel-Haus.gpx"
        },
        {
            name: "Hochkogelhaus",
            koordinaten: [47.72699, 13.78895],
            distanz: "8,5 km",
            höhenmeter: "940 hm",
            gehzeit: "3,5 Stunden",
            schwierigkeit: "mittel",
            bild: "hochkogelhaus.jpg",
            beschreibung: "Eine lange, aber lohnende Wanderung durch das Tote Gebirge.",
            gpxFile: "Hochkogelhaus.gpx"
        }
    ];

    map = L.map('wanderungen-map').setView([47.72526, 13.848444], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const rienerhutteCoords = [47.72526, 13.848444];
    // Erstellen eines benutzerdefinierten grünen Icons
    const greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const orangeIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Anwenden des grünen Icons auf den Rienerhütte-Marker
    const huetteMarker = L.marker(rienerhutteCoords, {icon: greenIcon}).addTo(map)
        .bindPopup('Rienerhütte')
        .openPopup();

    const wanderungenList = document.querySelector('.wanderungen-list');
    const wanderungDetails = document.querySelector('.wanderung-details');

    wanderungen.forEach((wanderung, index) => {
        const wanderungElement = document.createElement('div');
        wanderungElement.classList.add('wanderung-item');
        wanderungElement.innerHTML = `
            <img src="images/${wanderung.bild}" alt="${wanderung.name}">
            <div class="wanderung-item-info">
                <h3>${wanderung.name}</h3>
                <p>${wanderung.gehzeit}</p>
            </div>
        `;
        wanderungenList.appendChild(wanderungElement);

        const marker = L.marker(wanderung.koordinaten).addTo(map)
            .bindPopup(wanderung.name);
        
        function activateRoute() {
            resetRoute();
            loadRoute(wanderung, marker);
            showWanderungDetails(wanderung);
            if (activeMarker) {
                activeMarker.setIcon(new L.Icon.Default());
            }
            marker.setIcon(orangeIcon);
            activeMarker = marker;
        }

        wanderungElement.addEventListener('click', activateRoute);
        marker.on('click', activateRoute);
    });
});

function resetRoute() {
    if (activeRoute) {
        map.removeLayer(activeRoute);
        activeRoute = null;
    }
    if (activeMarker) {
        activeMarker.setIcon(new L.Icon.Default());
        activeMarker = null;
    }
}

function loadRoute(wanderung, marker) {
    fetch(`gpx/${wanderung.gpxFile}`)
        .then(response => response.text())
        .then(gpxData => {
            const parser = new DOMParser();
            const gpx = parser.parseFromString(gpxData, "text/xml");
            const points = gpx.getElementsByTagName('trkpt');
            const latlngs = [];
            for (let point of points) {
                const lat = parseFloat(point.getAttribute('lat'));
                const lon = parseFloat(point.getAttribute('lon'));
                latlngs.push([lat, lon]);
            }
            
            activeRoute = L.polyline(latlngs, {
                color: 'red',
                weight: 3,
                opacity: 0.8
            }).addTo(map);
            
            const bounds = activeRoute.getBounds().extend(L.latLng(47.72526, 13.848444));
            map.fitBounds(bounds, {padding: [50, 50]});
        });
}

function showWanderungDetails(wanderung) {
    const wanderungDetails = document.querySelector('.wanderung-details');
    wanderungDetails.innerHTML = `
        <img src="images/${wanderung.bild}" alt="${wanderung.name}">
        <h2>${wanderung.name}</h2>
        <p><strong>Gehzeit:</strong> ${wanderung.gehzeit}</p>
        <p><strong>Distanz:</strong> ${wanderung.distanz}</p>
        <p><strong>Höhenmeter:</strong> ${wanderung.höhenmeter}</p>
        <p><strong>Schwierigkeit:</strong> <span class="difficulty-indicator difficulty-${wanderung.schwierigkeit}">${wanderung.schwierigkeit}</span></p>
        <p>${wanderung.beschreibung}</p>
    `;
    wanderungDetails.style.display = 'block';
}

function ensureMapSize() {
    if (map) {
        map.invalidateSize();
        const mapContainer = document.getElementById('wanderungen-map');
        if (window.innerWidth <= 768) {
            mapContainer.style.height = '50vh';
        } else {
            mapContainer.style.height = '100%';
        }
    }
}

window.addEventListener('resize', ensureMapSize);
window.addEventListener('orientationchange', ensureMapSize);
document.addEventListener('DOMContentLoaded', ensureMapSize);