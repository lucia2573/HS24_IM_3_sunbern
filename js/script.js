console.log('Hello, world');

// Funktion, die Daten von unload.php abruft
async function fetchUVData(route) {
    console.log("Starte Anfrage an unload.php");

    try {
        const response = await fetch(`etl/unload.php?route=${route}`); // Hole die Daten mit Route
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der UV-Daten');
        }

        const data = await response.json(); // Erwartet eine JSON-Antwort
        console.log("Daten erfolgreich abgerufen:", data); // Ausgabe in der Konsole zur Überprüfung

        processUVData(data);

    } catch (error) {
        console.error('Fehler:', error);
    }
}

// Funktion, die Daten von unloadYesterday.php abruft
async function fetchYesterdayUVData(route) {
    console.log("Starte Anfrage an unloadYesterday.php");

    try {
        const response = await fetch(`https://im3.luciaschnyder.ch/etl/unloadYesterday.php?route=${route}`); // Hole die Daten für gestern
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der UV-Daten für gestern');
        }

        const data = await response.json(); // Erwartet eine JSON-Antwort
        console.log("Gestern Daten erfolgreich abgerufen:", data); // Ausgabe in der Konsole zur Überprüfung

        processYesterdayUVData(data); // Verarbeite die Daten für gestern

    } catch (error) {
        console.error('Fehler:', error);
    }
}

// Funktion zum Verarbeiten der abgerufenen UV-Daten für heute
function processUVData(data) {
    console.log("Verarbeite UV-Daten");

    if (data.length < 1) {
        console.error("Nicht genügend UV-Daten vorhanden");
        window.uvIndex = 0;
        displayUVIndex(window.uvIndex);
        return;
    }

    const uvValues = data.map(item => parseFloat(item.now_uvi)); 
    const uvSum = uvValues.reduce((acc, uv) => acc + uv, 0); 
    window.uvIndex = (uvSum / uvValues.length).toFixed(2); 
    displayUVIndex(window.uvIndex);
}

// Funktion zum Verarbeiten der abgerufenen UV-Daten für gestern
function processYesterdayUVData(data) {
    console.log("Verarbeite UV-Daten für gestern");

    if (data.length < 1) {
        console.error("Nicht genügend UV-Daten für gestern vorhanden");
        window.yesterdayUVIndex = 0;
        displayYesterdayUVIndex(window.yesterdayUVIndex);
        return;
    }

    const uvValues = data.map(item => parseFloat(item.now_uvi)); 
    const uvSum = uvValues.reduce((acc, uv) => acc + uv, 0); 
    window.yesterdayUVIndex = (uvSum / uvValues.length).toFixed(2); 
    displayYesterdayUVIndex(window.yesterdayUVIndex);
}

// Funktion zur Anzeige des UV-Index im HTML
function displayUVIndex(uvIndex) {
    const uvIndexDisplay = document.getElementById("uvIndexDisplay");
    uvIndexDisplay.innerHTML = `<p>Aktueller UV-Index: ${uvIndex}</p>`;
    console.log(`UV-Index: ${uvIndex}`);
}

// Funktion zur Anzeige des UV-Index für gestern im HTML
function displayYesterdayUVIndex(yesterdayUVIndex) {
    const yesterdayUVIndexDisplay = document.getElementById("yesterdayUVIndexDisplay");
    yesterdayUVIndexDisplay.innerHTML = `<p>UV-Index für gestern: ${yesterdayUVIndex}</p>`;
    console.log(`UV-Index für gestern: ${yesterdayUVIndex}`);
}

// Funktion zur Berechnung des Sonnenschutzfaktors (SPF)
function calculateSPF(distance, skinType) {
    const riverSpeed = 15; 
    const protectionTime = getProtectionTime(skinType);
    const travelTime = distance / riverSpeed;

    const spf = (travelTime / (protectionTime / 60)) * window.uvIndex;
    return spf;
}

// Funktion zur Bestimmung der Eigenschutzzeit basierend auf Hauttyp
function getProtectionTime(skinType) {
    switch (skinType) {
        case 1: return 10;
        case 2: return 20;
        case 3: return 30;
        case 4: return 50;
        case 5: return 60;
        case 6: return 60;
        default: return 30;
    }
}

// Update the button functionality to the new calculateBtn
document.getElementById("calculateBtn").addEventListener("click", async function () {
    const skinType = getSelectedSkinTypeFromSlider(); 
    const route = selectedRoute;

    // Überprüfen, ob eine Route ausgewählt wurde
    if (!route) {
        document.getElementById("result").innerHTML = `<p>Bitte wähle zuerst eine Route aus.</p>`;
        console.error("Keine Route ausgewählt.");
        return; // Beende die Funktion, wenn keine Route ausgewählt ist
    }

    console.log(`Berechnung gestartet: Hauttyp ${skinType}, Route ${route}`);

    const distance = getDistance(route);
    await fetchUVData(route); 
    await fetchYesterdayUVData(route); // Fetch yesterday's data

    const sunscreenFactor = calculateSPF(distance, skinType);  
    console.log(`Berechneter Sonnenschutzfaktor: ${sunscreenFactor}`);

    let protectionMessage = "";
    let spfValue = ""; // Neues Variable für den SPF Wert

    if (sunscreenFactor < 20) {
        protectionMessage = "Kein Schutz erforderlich.";
        spfValue = "0 SPF";
    } else if (sunscreenFactor < 30) {
        protectionMessage = "Es wäre empfehlenswert, sich mit 20 SPF einzucremen.";
        spfValue = "20 SPF";
    } else if (sunscreenFactor < 60) {
        protectionMessage = "Es wäre empfehlenswert, sich mit 30 SPF einzucremen.";
        spfValue = "30 SPF";
    } else {
        protectionMessage = "Es wäre empfehlenswert, sich mit 50 SPF einzucremen.";
        spfValue = "50 SPF";
    }

    // Text oberhalb der Sonnencreme
    document.getElementById("result").innerHTML = `<p>${protectionMessage}</p>`;

    // SPF Wert innerhalb/über dem Bild der Sonnencreme
    document.getElementById("cremeSPF").innerHTML = `<p>${spfValue}</p>`;
});

// Funktion zur Bestimmung der Strecke basierend auf der Route
function getDistance(route) {
    const distances = {
        "thun-bern": 30,
        "uttigen-bern": 10,
        "bern-wohlen": 20
    };
    return distances[route] || 0;
}

// Get the slider element
const slider = document.getElementById('mySlider');

// Function to get skin type from the slider
function getSelectedSkinTypeFromSlider() {
    const value = slider.value;
    let skinType = 1;

    if (value < 10) {
        skinType = 1;
    } else if (value >= 10 && value < 20) {
        skinType = 2;
    } else if (value >= 20 && value < 30) {
        skinType = 3;
    } else if (value >= 30 && value < 40) {
        skinType = 4;
    } else if (value >= 40 && value < 50) {
        skinType = 5;
    } else if (value >= 50) {
        skinType = 6;
    }
    return skinType;
}

// Update the skin type based on the slider value
function updateSkinType() {
    const skinType = getSelectedSkinTypeFromSlider();
    const protectionTime = getProtectionTime(skinType);
    document.getElementById('result').innerText = `Hauttyp ${skinType} (Eigenschutzzeit: ${protectionTime} min)`;
}

// Add an event listener to the slider to update skin type in real time
slider.addEventListener('input', updateSkinType);

// --- SVG Points as Route Buttons ---
let selectedRoute = null;

const routes = {
    "thun": {start: "thun", end: "bern"},
    "uttigen": {start: "uttigen", end: "bern"},
    "bern": {start: "bern", end: "wohlen"}
};

const points = {
    thun: document.querySelector('.map-point_point-1 img'),
    uttigen: document.querySelector('.map-point_point-2 img'),
    bern: document.querySelector('.map-point_point-3 img'),
    wohlen: document.querySelector('.map-point_point-4 img')
};

function resetPoints() {
    Object.values(points).forEach(point => {
        point.style.filter = "grayscale(100%) brightness(50%)"; // Grauer und dunkler
    });
}


function setRoute(startPoint) {
    selectedRoute = `${routes[startPoint].start}-${routes[startPoint].end}`;
    console.log(`Ausgewählte Route: ${selectedRoute}`);

    resetPoints();

    points[startPoint].style.filter = "none"; 
    points[routes[startPoint].end].style.filter = "none";
}

// Add click event listeners to points
points.thun.addEventListener('click', () => setRoute("thun"));
points.uttigen.addEventListener('click', () => setRoute("uttigen"));
points.bern.addEventListener('click', () => setRoute("bern"));


/// Smooth scroll for "Do not get sunbernt"
document.querySelector('h1').addEventListener('click', function() {
    // Scroll to the h3 inside the sunbernverhindern section
    document.querySelector('#sunbernverhindern h3').scrollIntoView({ behavior: 'smooth' });
});

// Smooth scroll for "Wie du ein Sunbern verhindern kannst"
document.querySelector('#sunbernverhindern h3').addEventListener('click', function() {
    document.getElementById('Wege').scrollIntoView({ behavior: 'smooth' });
});

// Texte der Punkte
const pointsText = {
    thun: document.querySelector('.map-point_point-1 p'),
    uttigen: document.querySelector('.map-point_point-2 p'),
    bern: document.querySelector('.map-point_point-3 p'),
    wohlen: document.querySelector('.map-point_point-4 p')
};

function resetPoints() {
    Object.values(points).forEach(point => {
        point.style.filter = "grayscale(100%) brightness(50%)"; // Grauer und dunkler
    });
    Object.values(pointsText).forEach(text => {
        text.style.visibility = "hidden"; // Text der nicht ausgewählten Punkte ausblenden
    });
}

function setRoute(startPoint) {
    selectedRoute = `${routes[startPoint].start}-${routes[startPoint].end}`;
    console.log(`Ausgewählte Route: ${selectedRoute}`);

    resetPoints();

    // Markiere die ausgewählten Punkte und zeige den Text an
    points[startPoint].style.filter = "none"; 
    points[routes[startPoint].end].style.filter = "none";
    
    // Sichtbarkeit der Texte für die ausgewählten Punkte
    pointsText[startPoint].style.visibility = "visible";
    pointsText[routes[startPoint].end].style.visibility = "visible";
}

// Add click event listeners to points
points.thun.addEventListener('click', () => setRoute("thun"));
points.uttigen.addEventListener('click', () => setRoute("uttigen"));
points.bern.addEventListener('click', () => setRoute("bern"));


// Funktionalität für den Button "SPF berechnen"
document.getElementById("calculateBtn").onclick = function() {
    // Sanftes Scrollen zum Ergebnisbereich
    document.getElementById("resultatcreme").scrollIntoView({ behavior: 'smooth' });
};