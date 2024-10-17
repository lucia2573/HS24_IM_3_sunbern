<?php
// Include the database configuration
require 'config.php';
//header json
header('Content-Type: application/json');

// get date and time for yesterday at noon
$yesterday_noon = date('Y-m-d H:i:s', strtotime("yesterday noon"));

// Hole die Route von den GET-Parametern
$route = isset($_GET['route']) ? $_GET['route'] : null;

try {
    // Create a new PDO instance
    $pdo = new PDO($dsn, $username, $password, $options);

    // Setze die SQL-Abfrage basierend auf der Route
    switch ($route) {
        case 'thun-bern':
            // Abfrage für Thun (46.748428, 7.626299) und Bern (46.947922, 7.444609)
            $stmt = $pdo->prepare("
                SELECT latitude, longitude, now_uvi, erstellt_am 
                FROM flow_daten 
                WHERE ((latitude = 46.748428 AND longitude = 7.626299) -- Thun
                OR (latitude = 46.947922 AND longitude = 7.444609)) -- Bern
                AND DATE(erstellt_am) = DATE(:yesterday_noon)
                AND HOUR(erstellt_am) = 12
                ORDER BY erstellt_am DESC LIMIT 2
            ");
            break;

        case 'uttigen-bern':
            // Abfrage für Uttigen (46.793495, 7.577903) und Bern (46.947922, 7.444609)
            $stmt = $pdo->prepare("
                SELECT latitude, longitude, now_uvi, erstellt_am 
                FROM flow_daten 
                WHERE ((latitude = 46.793495 AND longitude = 7.577903) -- Uttigen
                OR (latitude = 46.947922 AND longitude = 7.444609)) -- Bern
                AND DATE(erstellt_am) = DATE(:yesterday_noon)
                AND HOUR(erstellt_am) = 12
                ORDER BY erstellt_am DESC LIMIT 2
            ");
            break;

        case 'bern-wohlen':
            // Abfrage für Bern (46.947922, 7.444609) und Wohlen (46.973849, 7.358384)
            $stmt = $pdo->prepare("
                SELECT latitude, longitude, now_uvi, erstellt_am 
                FROM flow_daten 
                WHERE ((latitude = 46.947922 AND longitude = 7.444609) -- Bern
                OR (latitude = 46.973849 AND longitude = 7.358384)) -- Wohlen
                AND DATE(erstellt_am) = DATE(:yesterday_noon)
                AND HOUR(erstellt_am) = 12
                ORDER BY erstellt_am DESC LIMIT 2
            ");
            break;

        default:
            // Unbekannte Route
            http_response_code(400);
            echo json_encode(['error' => 'Ungültige Route']);
            exit;
    }

    // Bind the parameter
    $stmt->bindParam(':yesterday_noon', $yesterday_noon);

    // Execute the statement
    $stmt->execute();

    // Fetch all the results
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Output the data as JSON
    echo json_encode($data);

} catch (PDOException $e) {
    // Handle the error
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
