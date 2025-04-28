<?php
// Start output buffering to catch any unwanted output
ob_start();

// Enable error logging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Log file path
$logFile = __DIR__ . '/register.log';

// Function to log messages
function logMessage($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Function to send JSON response
function sendJsonResponse($success, $message, $data = null) {
    // Clear any previous output
    ob_clean();
    
    // Set JSON header
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    $response = [
        'success' => $success,
        'message' => $message,
        'data' => $data
    ];
    
    logMessage("Sending response: " . json_encode($response));
    echo json_encode($response);
    exit();
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendJsonResponse(true, 'Preflight request accepted');
}

try {
    logMessage("Registration attempt started");
    
    // Database connection
    $pdo = new PDO("mysql:host=localhost;dbname=kosovar", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    logMessage("Database connection established");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get and validate input
        $input = file_get_contents('php://input');
        logMessage("Received input: " . $input);
        
        $data = json_decode($input, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            logMessage("JSON decode error: " . json_last_error_msg());
            sendJsonResponse(false, 'Invalid JSON data');
        }

        // Validate required fields
        if (empty($data['email']) || empty($data['password_hash']) || empty($data['emri'])) {
            logMessage("Missing required fields");
            sendJsonResponse(false, 'Missing required fields');
        }

        // Check if email exists
        $stmt = $pdo->prepare("SELECT email FROM perdoruesit WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->rowCount() > 0) {
            logMessage("Email already exists: " . $data['email']);
            sendJsonResponse(false, 'Email already exists');
        }

        // Hash the password
        $passwordHash = password_hash($data['password_hash'], PASSWORD_DEFAULT);
        logMessage("Password hashed: " . $passwordHash);

        // Insert new user
        $stmt = $pdo->prepare("
            INSERT INTO perdoruesit (emri, email, password_hash, roli)
            VALUES (?, ?, ?, ?, NOW())
        ");
        
        $stmt->execute([
            $data['emri'],
            $data['email'],
            $passwordHash,
            $data['roli'] ?? 'citizen'
        ]);

        logMessage("User registered successfully: " . $data['email']);
        sendJsonResponse(true, 'User registered successfully');
    } else {
        logMessage("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
        sendJsonResponse(false, 'Method not allowed');
    }
} catch (PDOException $e) {
    logMessage("Database Error: " . $e->getMessage());
    sendJsonResponse(false, 'Database error: ' . $e->getMessage());
} catch (Exception $e) {
    logMessage("Server Error: " . $e->getMessage());
    sendJsonResponse(false, 'Server error: ' . $e->getMessage());
}

// End output buffering and clean any remaining output
ob_end_clean();
?> 