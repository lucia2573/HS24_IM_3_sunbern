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

        // Hier kannst du die Daten im Frontend verarbeiten
        processUVData(data);

    } catch (error) {
        console.error('Fehler:', error);
    }
}

// Funktion zum Verarbeiten der abgerufenen UV-Daten
function processUVData(data) {
    console.log("Verarbeite UV-Daten");

    // Überprüfen, ob genug Daten vorhanden sind
    if (data.length < 1) { // Überprüfen auf mindestens 1 Datensatz
        console.error("Nicht genügend UV-Daten vorhanden");
        window.uvIndex = 0; // Setzen Sie einen Standardwert, wenn die Daten fehlen
        displayUVIndex(window.uvIndex);
        return;
    }

    // Annahme: Die UV-Daten enthalten Objekte mit dem Feld `now_uvi`
    const uvValues = data.map(item => parseFloat(item.now_uvi)); // Alle UV-Indizes als Zahlen
    console.log("UV-Indizes:", uvValues);
    const uvSum = uvValues.reduce((acc, uv) => acc + uv, 0); // Summe der UV-Indizes
    window.uvIndex = (uvSum / uvValues.length).toFixed(2); // Durchschnitt des UV-Index auf 2 Dezimalstellen
    console.log(`Aktueller UV-Index: ${window.uvIndex}`);

    // Zeige den aktuellen UV-Index an
    displayUVIndex(window.uvIndex);
}

// Funktion zur Anzeige des UV-Index im HTML
function displayUVIndex(uvIndex) {
    const uvIndexDisplay = document.getElementById("uvIndexDisplay");
    uvIndexDisplay.innerHTML = `<p>Aktueller UV-Index: ${uvIndex}</p>`;
}

// Funktion zur Berechnung des Sonnenschutzfaktors (SPF)
function calculateSPF(distance, skinType) {
    const riverSpeed = 15; // Geschwindigkeit des Flusses in km/h
    const protectionTime = getProtectionTime(skinType); // Eigenschutzzeit in Minuten
    const travelTime = distance / riverSpeed; // Fahrtdauer in Stunden

    // Berechnung des Sonnenschutzfaktors
    const spf = (travelTime / (protectionTime / 60)) * window.uvIndex; // Formel für SPF
    console.log(`Empfohlener Sonnenschutzfaktor (SPF): ${spf}`);
    return spf;
}

// Event Listener für den Button
document.getElementById("calculateButton").addEventListener("click", async function () {
    const skinType = parseInt(document.getElementById("skinType").value);
    const route = document.getElementById("route").value; // Route wird hier verwendet

    console.log(`Berechnung gestartet: Hauttyp ${skinType}, Route ${route}`);

    // Berechnung der Distanz basierend auf der Route
    const distance = getDistance(route);
    await fetchUVData(route); // Hole die UV-Daten mit der ausgewählten Route

    const resultDiv = document.getElementById("result");

    // Berechnung des Sonnenschutzfaktors
    const sunscreenFactor = calculateSPF(distance, skinType);

    // Ausgabe der Ergebnisse (Sonnenschutzfaktor)
    let protectionMessage = "";

    // Bedingungen für den Schutztext basierend auf SPF
    if (sunscreenFactor < 20) {
        protectionMessage = "Kein Schutz erforderlich.";
    } else if (sunscreenFactor < 30) {
        protectionMessage = "Es wäre empfehlenswert, sich mit 20 SPF einzucremen.";
    } else if (sunscreenFactor < 60) {
        protectionMessage = "Es wäre empfehlenswert, sich mit 30 SPF einzucremen.";
    } else {
        protectionMessage = "Es wäre empfehlenswert, sich mit 50 SPF einzucremen.";
    }

    // Ausgabe des empfohlenen Sonnenschutzfaktors und der Schutznachricht
    resultDiv.innerHTML = `<p>Empfohlener Sonnenschutzfaktor (SPF): ${sunscreenFactor.toFixed(2)}</p>`;
    resultDiv.innerHTML += `<p>${protectionMessage}</p>`;
});

// Funktion zur Bestimmung der Strecke basierend auf der Route
function getDistance(route) {
    const distances = {
        "thun-bern": 30,      // Thun - Bern (30 km)
        "uttigen-bern": 10,   // Uttigen - Bern (10 km)
        "bern-wohlen": 20     // Bern - Wohlen (20 km)
    };
    return distances[route] || 0; // Standardwert 0 für unbekannte Routen
}

// Funktion zur Bestimmung der Eigenschutzzeit basierend auf Hauttyp
function getProtectionTime(skinType) {
    switch (skinType) {
        case 1: return 10; // Hauttyp 1: 10 Minuten
        case 2: return 20; // Hauttyp 2: 20 Minuten
        case 3: return 30; // Hauttyp 3: 30 Minuten
        case 4: return 50; // Hauttyp 4: 50 Minuten
        case 5: return 60; // Hauttyp 5: 60 Minuten
        case 6: return 60; // Hauttyp 6: 60 Minuten
        default: return 30; // Standardwert für unbekannte Hauttypen
    }
}

document.querySelectorAll('.map-point').forEach(point => {
    point.addEventListener('click', function() {
        alert(`You clicked on ${this.querySelector('p').textContent}`);
        // You can replace the alert with any functionality you need
    });
});
