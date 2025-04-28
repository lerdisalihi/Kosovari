<?php
require_once 'config/database.php';

// Test query
try {
    $stmt = $pdo->query("SELECT 1");
    echo "Database connection is working!";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?> 