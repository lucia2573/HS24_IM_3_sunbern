<?php
include_once 'extract.php';

// Definiert eine Zuordnung von Koordinaten zu Stadtnamen
$locationsMap = [
    ["name" => "Bern", "latitude" => 46.94792220, "longitude" => 7.44460850],
    ["name" => "Thun", "latitude"  => 46.74842840, "longitude" => 7.62629850],
    ["name" => "Wohlen", "latitude" => 46.97384900, "longitude" => 7.35838360],
    ["name" => "Uttigen", "latitude" => 46.79349477, "longitude" => 7.57790253]
];

// Funktion zur Umwandlung der Daten
function transformData($locationsMap) {
    $transformedData = [];

    foreach ($locationsMap as $location) {
        // Holt die Wetterdaten für jede Stadt
        $weather = fetchWeatherData($location['latitude'], $location['longitude']);

        // Erstellt ein Array für die transformierten Daten
        $transformedData[] = [
            'city' => $location['name'],
            'latitude' => $location['latitude'],
            'longitude' => $location['longitude'],
            'now_uvi' => isset($weather['now']['uvi']) ? $weather['now']['uvi'] : null // Überprüft, ob der UV-Index verfügbar ist
        ];
    }

    return $transformedData;
}

// Transformiert die Daten
$transformedData = transformData($locationsMap);

// Ausgabe der transformierten Daten untereinander
foreach ($transformedData as $item) {
    echo "Stadt: " . $item['city'] . "<br>";
    echo "  Latitude: " . $item['latitude'] . "<br>";
    echo "  Longitude: " . $item['longitude'] . "<br>";
    echo "  Aktueller UV-Index: " . $item['now_uvi'] . "<br><br>";
}

// Optional: Rückgabe der transformierten Daten für weitere Verarbeitung
return $transformedData;
?>