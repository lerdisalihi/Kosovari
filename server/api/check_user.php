<?php
header('Content-Type: text/plain');

try {
    // Database connection
    $pdo = new PDO("mysql:host=localhost;dbname=kosovar", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get all users
    $stmt = $pdo->query("SELECT * FROM perdoruesit");
    $users = $stmt->fetchAll();

    echo "Users in database:\n\n";
    foreach ($users as $user) {
        echo "User ID: " . $user['perdorues_id'] . "\n";
        echo "Name: " . $user['emri'] . "\n";
        echo "Email: " . $user['email'] . "\n";
        echo "Role: " . $user['roli'] . "\n";
        echo "Level: " . $user['leveli'] . "\n";
        echo "Experience: " . $user['pike_eksperience'] . "\n";
        echo "Password Hash: " . $user['password_hash'] . "\n";
        echo "----------------------------------------\n";
    }

    // Test password verification
    if (isset($_GET['email']) && isset($_GET['password'])) {
        $email = $_GET['email'];
        $password = $_GET['password'];
        
        echo "\nTesting password verification for email: $email\n";
        
        $stmt = $pdo->prepare("SELECT password_hash FROM perdoruesit WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user) {
            echo "Stored hash: " . $user['password_hash'] . "\n";
            echo "Password matches: " . (password_verify($password, $user['password_hash']) ? "YES" : "NO") . "\n";
        } else {
            echo "User not found\n";
        }
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?> 