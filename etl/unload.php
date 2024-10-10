<?php
// Include the database configuration
require 'config.php';
//header json
header('Content-Type: application/json');

try {
    // Create a new PDO instance
    $pdo = new PDO($dsn, $username, $password, $options);

    // Prepare the SQL statement
    $stmt = $pdo->prepare("SELECT latitude, longitude, `now_uvi` FROM flow_daten");

    // Execute the statement
    $stmt->execute();

    // Fetch all the results
    $data = $stmt->fetchAll();

    // Set the content type to JSON
    header('Content-Type: application/json');

    // Output the data as JSON
    echo json_encode($data);

} catch (PDOException $e) {
    // Handle the error
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
