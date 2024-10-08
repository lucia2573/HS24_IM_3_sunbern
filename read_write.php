<?php

require_once 'config.php';

try {
    // Create a new PDO instance using the values from config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // Define the SQL query
    $sql = "SELECT * FROM Notes";

    // Prepare the statement
    $stmt = $pdo->prepare($sql);

    // Execute the query
    $stmt->execute();

    // Fetch all results
    $result = $stmt->fetchAll();

    // Check if any results were returned
    if ($result) {
        // Loop through the results and print each row
        foreach ($result as $row) {
            echo "ID: " . $row['ID'] . " - Note: " . $row['Notiz'] . "<br>";
        }
    } else {
        echo "Keine Ergebnisse gefunden";
    }

} catch (PDOException $e) {
    // If an error occurs, display the error message
    die("Fehler bei der Verbindung zur Datenbank: " . $e->getMessage());
}

echo "Hello World!";


?>


