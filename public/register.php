<?php
require __DIR__ . '/bootstrap.php';
if (isset($_SESSION['user_id'])) {
    redirect('/dashboard.php');
}

$errors = [];
$name = '';
$email = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $name = trim((string)($_POST['name'] ?? ''));
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    $password = (string)($_POST['password'] ?? '');

    if (strlen($name) < 2 || mb_strlen($name) > 100) {
        $errors[] = 'Name must be between 2 and 100 characters.';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
        $errors[] = 'Enter a valid email address.';
    }
    if (strlen($password) < 12 || strlen($password) > 72) {
        $errors[] = 'Use a password between 12 and 72 characters.';
    }

    if (!$errors) {
        try {
            $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
            $stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);
            session_regenerate_id(true);
            $_SESSION['user_id'] = (int)$pdo->lastInsertId();
            $_SESSION['user_name'] = $name;
            redirect('/dashboard.php');
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                $errors[] = 'This email is already registered.';
            } else {
                error_log($e->getMessage());
                $errors[] = 'Registration unavailable. Please try again.';
            }
        }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Create Cloud Account | SkyLine Cloud</title>
  <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
  <!-- Ambient Orbs -->
  <div class="ambient-orb orb-1"></div>
  <div class="ambient-orb orb-2"></div>

  <a class="back" href="/">← Return to Home</a>

  <main class="auth">
    <div class="eyebrow">GET 100 GB CLOUD STORAGE</div>
    <h1>Create Account</h1>
    <p class="muted">Your private encrypted cloud storage workspace starts here.</p>

    <?php foreach ($errors as $err): ?>
      <div class="error"><?= h($err) ?></div>
    <?php endforeach; ?>

    <form method="post">
      <input type="hidden" name="csrf" value="<?= h(csrf()) ?>">
      <label>
        Full name
        <input required maxlength="100" name="name" autocomplete="name" placeholder="John Doe" value="<?= h($name) ?>">
      </label>
      <label>
        Email address
        <input required type="email" maxlength="190" name="email" autocomplete="email" placeholder="name@domain.com" value="<?= h($email) ?>">
      </label>
      <label>
        Master Password
        <input required type="password" minlength="12" maxlength="72" name="password" autocomplete="new-password" placeholder="At least 12 characters">
      </label>
      <button class="btn full" type="submit">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
        Provision Private Cloud Drive
      </button>
    </form>

    <p class="muted" style="text-align: center; margin-top: 24px;">
      Already registered? <a href="/login.php">Sign in to Cloud</a>
    </p>
  </main>
</body>
</html>
