<?php
// Include the database configuration
require 'config.php';
//header json
header('Content-Type: application/json');

// Hole die Route von den GET-Parametern
$route = isset($_GET['route']) ? $_GET['route'] : null;

try {
    // Create a new PDO instance
    $pdo = new PDO($dsn, $username, $password, $options);

    // Setze die SQL-Abfrage basierend auf der Route
    switch ($route) {
        case 'thun-bern':
            // Abfrage für Thun (46.6167, 7.5667) und Bern (46.9480, 7.4474)
            $stmt = $pdo->prepare("
                SELECT latitude, longitude, now_uvi, erstellt_am 
                FROM flow_daten 
                WHERE (latitude = 46.6167 AND longitude = 7.5667) -- Thun
                OR (latitude = 46.9480 AND longitude = 7.4474) -- Bern
                ORDER BY erstellt_am DESC LIMIT 2
            ");
            break;

        case 'uttigen-bern':
            // Abfrage für Uttigen (46.7621, 7.6847) und Bern (46.9480, 7.4474)
            $stmt = $pdo->prepare("
                SELECT latitude, longitude, now_uvi, erstellt_am 
                FROM flow_daten 
                WHERE (latitude = 46.7621 AND longitude = 7.6847) -- Uttigen
                OR (latitude = 46.9480 AND longitude = 7.4474) -- Bern
                ORDER BY erstellt_am DESC LIMIT 2
            ");
            break;

        case 'bern-wohlen':
            // Abfrage für Bern (46.9480, 7.4474) und Wohlen (47.3483, 8.2769)
            $stmt = $pdo->prepare("
                SELECT latitude, longitude, now_uvi, erstellt_am 
                FROM flow_daten 
                WHERE (latitude = 46.9480 AND longitude = 7.4474) -- Bern
                OR (latitude = 47.3483 AND longitude = 8.2769) -- Wohlen
                ORDER BY erstellt_am DESC LIMIT 2
            ");
            break;

        default:
            // Unbekannte Route
            http_response_code(400);
            echo json_encode(['error' => 'Ungültige Route']);
            exit;
    }

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
