<?php
include_once 'extract.php';
// Bindet das Skript 130_extract.php für Rohdaten ein
//$data = fetchWeatherData(40, -73);

//echo "<pre>";
//var_dump($data);
//echo "</pre>";





// Definiert eine Zuordnung von Koordinaten zu Stadtnamen
$locationsMap = [
["name" => "Bern", "latitude" => 46.9480, "longitude" => 7.4474],
["name" => "Thun", "latitude"  => 46.7621, "longitude" => 7.6847],
["name" => "Wohlen", "latitude" => 47.3483, "longitude" => 8.2769],
["name" => "Uttigen", "latitude" => 46.8167, "longitude" => 7.5667]
];

foreach ($locationsMap as $location) {
    $weather = fetchWeatherData($location['latitude'], $location['longitude']);
    echo "Aktueller UV-Index in " . $location['name'] . ": " . $weather['now']['uvi'] . "<br>";
}



// Initialisiert ein Array, um die transformierten Daten zu speichern
// $transformedData = [];

//Funktion zur Umwandlung der Daten
function transformData($locationsMap) {
    $transformedData = [];
}
//     Holt den aktuellen Standort anhand der Latitude und Longitude
//     $latitude = $data['latitude'];
//     echo $latitude;
//     $longitude = $data['longitude'];
//     $locationKey = $latitude . ',' . $longitude;
    
//     Überprüft, ob die Koordinaten im Zuordnungs-Array sind
//     $city = $locationsMap[$locationKey] ?? 'Unbekannte Stadt';

//     Holt die aktuellen und prognostizierten UV-Werte
//     $currentUVI = $data['now']['uvi'];
//     $forecastData = $data['forecast'];
    
//     Fügt den aktuellen UV-Index zur transformierten Daten hinzu
//     $transformedData['city'] = $city;
//     $transformedData['current_uvi'] = $currentUVI;
//     $transformedData['forecast'] = [];
    
//     Iteriert über die Prognose und extrahiert die relevanten Informationen
//     foreach ($forecastData as $forecast) {
//         $time = $forecast['time'];
//         $uvi = $forecast['uvi'];
        
//         Speichert die Zeit und den UV-Index in der Prognose
//         $transformedData['forecast'][] = [
//             'time' => $time,
//             'uvi' => $uvi
//         ];
//     }

//     return $transformedData;
// }

// Transformiert die Daten
$transformedData = transformData($locationsMap);
print_r($transformedData);

return $transformedData;

// Ausgabe der transformierten Daten (kann später auch in ein anderes Format überführt werden)
echo "<pre>";
var_dump($transformedData);
echo "</pre>";
?>

