let map;

document.addEventListener('DOMContentLoaded', function() {
    const wanderungen = [
        {
            name: "Wildensee",
            koordinaten: [47.7125, 13.8517],
            gehzeit: "30 Minuten",
            schwierigkeit: "leicht",
            bild: "see.jpg",
            beschreibung: "Wunderschöner Bergsee"
        },
        {
            name: "Rinnerkogel",
            koordinaten: [47.7197, 13.8403],
            gehzeit: "3 Stunden",
            schwierigkeit: "mittel",
            bild: "rinner.jpg",
            beschreibung: "Ein wunderschöner Gipfel auf 2021m Höhe"
        },
        {
            name: "Weißhorn",
            koordinaten: [47.72706, 13.86032],
            gehzeit: "1,5 Stunden",
            schwierigkeit: "schwer",
            bild: "weiß.jpg",
            beschreibung: "Kein markierter Weg, nur ein Jägersteig, aber man wird durch eine unfassbare Aussicht über das Tote Gebirge belohnt"
        }
    ];

    map = L.map('wanderungen-map').setView([47.72526, 13.848444], 13);
    setTimeout(() => { map.invalidateSize(); }, 0);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    setTimeout(() => {
        map.invalidateSize();
    }, 0);

    // Event Listener für Fenstergrößenänderungen
    window.addEventListener('resize', function() {
        map.invalidateSize();
    })
  

    const huetteMarker = L.marker([47.72526, 13.848444]).addTo(map)
        .bindPopup('Rienerhütte')
        .openPopup();

    
    const wanderungenList = document.querySelector('.wanderungen-list');
    const wanderungDetails = document.querySelector('.wanderung-details');

    let activeRoute = null;

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
        
        const route = L.polyline([
            [47.72526, 13.848444],
            wanderung.koordinaten
        ], {color: 'red', weight: 3, opacity: 0}).addTo(map);

        function activateRoute() {
            if (activeRoute) {
                activeRoute.setStyle({opacity: 0});
            }
            route.setStyle({opacity: 0.8});
            activeRoute = route;
            
            // Zoom auf die Route, aber behalte die aktuelle Kartengröße bei
            map.fitBounds([
                [47.72526, 13.848444],
                wanderung.koordinaten
            ], {
                padding: [50, 50],
                maxZoom: 13  // Begrenzt den maximalen Zoom
            });
            
            showWanderungDetails(wanderung);
            marker.openPopup();
            
            // Stellen Sie sicher, dass die Karte nach dem Zoomen ihre Größe beibehält
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }

        wanderungElement.addEventListener('click', activateRoute);
        marker.on('click', activateRoute);
    });

    function showWanderungDetails(wanderung) {
        wanderungDetails.innerHTML = `
            <img src="images/${wanderung.bild}" alt="${wanderung.name}">
            <h2>${wanderung.name}</h2>
            <p><strong>Gehzeit:</strong> ${wanderung.gehzeit}</p>
            <p><strong>Schwierigkeit:</strong> <span class="difficulty-indicator difficulty-${wanderung.schwierigkeit}">${wanderung.schwierigkeit}</span></p>
            <p>${wanderung.beschreibung}</p>
        `;
    }
});

wanderungElement.addEventListener('click', function() {
    activateRoute();
    ensureMapSize();
    
    // Für mobile Geräte: Scrollen Sie zur Karte
    if (window.innerWidth <= 768) {
        document.getElementById('wanderungen-map').scrollIntoView({behavior: 'smooth'});
    }
});



function addGpxTrack(map, gpxData) {
    const points = gpxData.getElementsByTagName('trkpt');
    const latlngs = [];
    for (let point of points) {
        const lat = parseFloat(point.getAttribute('lat'));
        const lon = parseFloat(point.getAttribute('lon'));
        latlngs.push([lat, lon]);
    }
    
    const polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
    map.fitBounds(polyline.getBounds());
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

// Rufen Sie diese Funktion bei verschiedenen Ereignissen auf
window.addEventListener('resize', ensureMapSize);
window.addEventListener('orientationchange', ensureMapSize);
document.addEventListener('DOMContentLoaded', ensureMapSize);