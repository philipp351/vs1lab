function updateLocation() {
    // MapManager mit API Key initialisieren
    const mapManager = new MapManager('c8nLw5oe3DkrjZlfHY3KTVguYfnvcUHw');

    // Lesen Sie die geeigneten Formularfelder im DOM aus
    const taggingLatitudeInput = document.getElementById('tagLatitude');
    const taggingLongitudeInput = document.getElementById('tagLongitude');
    const discoveryLatitudeInput = document.getElementById('latitude');
    const discoveryLongitudeInput = document.getElementById('longitude');

    const mapImage = document.getElementById('mapView');

    var latitude = taggingLatitudeInput.value;
    var longitude = taggingLongitudeInput.value;

    if(latitude === "" && longitude === "") {
        LocationHelper.findLocation((location) => {
            latitude = location.latitude;
            longitude = location.longitude;

            // Werte in Tagging und Discovery updaten
            taggingLatitudeInput.value = latitude;
            taggingLongitudeInput.value = longitude;
            discoveryLatitudeInput.value = latitude;
            discoveryLongitudeInput.value = longitude;

            const mapUrl = mapManager.getMapUrl(latitude, longitude, JSON.parse(document.getElementById("mapView").getAttribute("data-tags")));

            // Map URL als Bild einfügen
            mapImage.src = mapUrl;
        });
    } else {
                // Werte in Tagging und Discovery updaten
                taggingLatitudeInput.value = latitude;
                taggingLongitudeInput.value = longitude;
                discoveryLatitudeInput.value = latitude;
                discoveryLongitudeInput.value = longitude;
        
                // Map URL mit Mapmanager abfragen
                const mapUrl = mapManager.getMapUrl(latitude, longitude, JSON.parse(document.getElementById("mapView").getAttribute("data-tags")));
        
                // Map URL als Bild einfügen
                mapImage.src = mapUrl;

    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation);