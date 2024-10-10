console.log('Hello, world');

// Funktion, die Daten von unload.php abruft
async function fetchUVData(route) {
    console.log("Starte Anfrage an unload.php");

    try {
        const response = await fetch(`etl/unload.php?route=${route}`); // Route als Parameter angeben
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

// Funktion zum Verarbeiten der abgerufenen Daten
function processUVData(data) {
    console.log("Verarbeite UV-Daten");

    // Überprüfen, ob genug Daten vorhanden sind
    if (data.length < 2) {
        console.error("Nicht genügend UV-Daten vorhanden");
        window.uvIndex = 0; // Setzen Sie einen Standardwert, wenn die Daten fehlen
        return;
    }

    // Annahme: Die UV-Daten enthalten Objekte mit den Feldern latitude, longitude, now_uvi
    const uvValues = data.map(item => item.now_uvi); // Alle UV-Indizes
    const uvSum = uvValues.reduce((acc, uv) => acc + uv, 0); // Summe der UV-Indizes
    window.uvIndex = uvSum / uvValues.length; // Durchschnitt des UV-Index
    console.log(`Durchschnittlicher UV-Index: ${window.uvIndex}`);
}

// Funktion zur Berechnung des Sonnenschutzfaktors (SPF) unter Berücksichtigung der neuen Formel
function calculateSPF(travelTime, protectionTime, uvIndex) {
    if (travelTime <= 0) {
        console.error("Fahrtdauer muss größer als null sein.");
        return 0; // Verhindern von Division durch null
    }

    // Berechnung des SPF basierend auf der neuen Formel
    let spf = (protectionTime / travelTime) * uvIndex;

    return Math.round(spf); // Gibt den SPF-Wert zurück, gerundet auf die nächste ganze Zahl
}

// Event Listener für den Button
document.getElementById("calculateButton").addEventListener("click", async function () {
    const skinType = parseInt(document.getElementById("skinType").value);
    const route = document.getElementById("route").value;

    console.log(`Berechnung gestartet: Hauttyp ${skinType}, Route ${route}`);

    await fetchUVData(route); // Zuerst UV-Daten abrufen

    // Berechnung der Distanz basierend auf der Route
    const distance = getDistance(route);
    const travelTime = distance / 15; // 15 km/h als Flussgeschwindigkeit
    const protectionTime = getProtectionTime(skinType);

    console.log(`Distanz: ${distance} km, Fahrtdauer: ${travelTime} Stunden, Eigenschutzzeit: ${protectionTime} Minuten`);

    // Berechnung des SPF unter Berücksichtigung des UV-Index
    const sunscreenFactor = calculateSPF(travelTime, protectionTime, window.uvIndex);
    
    // Ausgabe der Ergebnisse (nur Sonnenschutzfaktor als SPF)
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <p>Empfohlener Sonnenschutzfaktor (SPF): ${sunscreenFactor}</p>
        <p>Durchschnittlicher UV-Index: ${window.uvIndex}</p>
    `;
});

// Funktion zur Bestimmung der Strecke basierend auf der Route
function getDistance(route) {
    const distances = {
        "thun-bern": 30,      // Thun - Bern (30 km)
        "thun-uttigen": 15,   // Thun - Uttigen (15 km)
        "uttigen-bern": 10,   // Uttigen - Bern (10 km)
        "bern-wohlen": 50     // Bern - Wohlen (50 km)
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
