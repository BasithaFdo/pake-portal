<?php
declare(strict_types=1);
$cfgFile = dirname(__DIR__) . '/config.php';
if (!is_file($cfgFile)) {
    http_response_code(503);
    exit('Setup required: copy config.example.php to config.php and set database credentials.');
}
$config = require $cfgFile;
try {
    $pdo = new PDO('mysql:host=' . $config['db_host'] . ';dbname=' . $config['db_name'] . ';charset=utf8mb4', $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    error_log('Database connection error: ' . $e->getMessage());
    http_response_code(503);
    exit('Database unavailable. Check server configuration.');
}
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
$secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>$secure,'httponly'=>true,'samesite'=>'Lax']);
session_start();
function h(string $v): string { return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function csrf(): string { if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32)); return $_SESSION['csrf']; }
function verify_csrf(): void { if (!isset($_POST['csrf'], $_SESSION['csrf']) || !is_string($_POST['csrf']) || !hash_equals($_SESSION['csrf'], $_POST['csrf'])) { http_response_code(403); exit('Invalid request. Refresh and try again.'); } }
function redirect(string $path): never { header('Location: '.$path, true, 303); exit; }
