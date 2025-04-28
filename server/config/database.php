<?php
// Set JSON header first
header('Content-Type: application/json');

// Database configuration
$host = 'localhost';
$dbname = 'kosovar';
$username = 'root';
$password = '';

try {
    // Test database connection
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $pdo = new PDO($dsn, $username, $password, $options);
    
    // Test if we can query the database
    $testQuery = $pdo->query("SELECT 1");
    if (!$testQuery) {
        throw new PDOException("Database test query failed");
    }
    
    // If we get here, connection is successful
    return $pdo;
    
} catch (PDOException $e) {
    // Log the detailed error
    error_log("Database Error: " . $e->getMessage());
    error_log("Error Code: " . $e->getCode());
    error_log("File: " . $e->getFile());
    error_log("Line: " . $e->getLine());
    
    // Return a proper JSON error response
    http_response_code(500);
    echo json_encode([
        'error' => 'Database connection failed',
        'message' => $e->getMessage(),
        'details' => [
            'code' => $e->getCode(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
    exit();
}
?> 