

const taggingButton = document.getElementById("taggingButton");
const discoveryButton = document.getElementById("discoveryButton");

taggingButton.addEventListener("click", handleTaggingButtonClick);
discoveryButton.addEventListener("click", handleDiscoveryButtonClick);

async function handleTaggingButtonClick() {
    event.preventDefault();
    const form = document.getElementById('tag-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const name = document.getElementById("name").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;
    const hashtag = document.getElementById("tagTextField").value;

    const response = await fetch(`/api/geotags`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            latitude: latitude,
            longitude: longitude,
            hashtag: hashtag
        })
    });
    const data = await response.json();
    console.log(response);
    let geotaglist;

    fetch('/api/geotags')
        .then(response => response.json())
        .then(data => {
            geotaglist = data;
            refreshElements(geotaglist);
        });
}

async function handleDiscoveryButtonClick() {
    event.preventDefault();
    const form = document.getElementById('discoveryFilterForm');
    if (!form.checkValidity()) {
        form.reportValidity();
    }
    const name = document.getElementById("searchterm").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    const url = `/api/geotags?name=${name}&latitude=${latitude}&longitude=${longitude}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            refreshElements(data);
            console.log(data);
        });
}

function refreshElements(geotaglist) {
    const ul = document.getElementById('discoveryResults');
    ul.innerHTML = "";
    for (const tag of geotaglist) {
        const li = document.createElement("li");
        li.textContent = `${tag.name} (${tag.latitude},${tag.longitude}) ${tag.hashtag}`;
        ul.appendChild(li);
    }
    const mapviewdata = document.getElementById("mapView");
    mapviewdata.setAttribute("data-tags", JSON.stringify(geotaglist));
    updateLocation();
}


function updateLocation() {
    // MapManager mit API Key initialisieren
    const mapManager = new MapManager('c8nLw5oe3DkrjZlfHY3KTVguYfnvcUHw');

    // Lesen Sie die geeigneten Formularfelder im DOM aus
    const taggingLatitudeInput = document.getElementById('latitude');
    const taggingLongitudeInput = document.getElementById('longitude');
    const discoveryLatitudeInput = document.getElementById('disc_latitude');
    const discoveryLongitudeInput = document.getElementById('disc_longitude');

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