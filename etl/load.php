<?php
// Einbinden der benötigten Dateien
include_once 'transform.php'; // Um transformierte Daten zu erhalten
include_once 'config.php'; // Um Datenbankverbindungsparameter zu erhalten

try {
    // Erstelle eine neue PDO-Instanz mit den Werten aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query für das Einfügen der Daten in die flow_daten-Tabelle
    $sql = "INSERT INTO flow_daten (now_uvi, latitude, longitude, erstellt_am)
            VALUES (:now_uvi, :latitude, :longitude, CURRENT_TIMESTAMP)";

    // Vorbereitung des Statements
    $stmt = $pdo->prepare($sql);

    // Hole die transformierten Daten
    $transformedData = transformData($locationsMap); // Aufruf der Funktion, die transformierte Daten zurückgibt

    foreach ($transformedData as $item) {
        // Binde die Parameter mit den entsprechenden Werten
        $stmt->bindParam(':now_uvi', $item['now_uvi']);
        $stmt->bindParam(':latitude', $item['latitude']);
        $stmt->bindParam(':longitude', $item['longitude']);

        // Ausführen des Statements
        $stmt->execute();
    }

    echo "Daten erfolgreich in die Datenbank eingefügt";

} catch (PDOException $e) {
    // Wenn ein Fehler auftritt, die Fehlermeldung anzeigen
    die("Fehler bei der Verbindung zur Datenbank: " . $e->getMessage());
}
?>
