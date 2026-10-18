<?php
require __DIR__ . '/bootstrap.php';
if (isset($_SESSION['user_id'])) {
    redirect('/dashboard.php');
}

$error = '';
$email = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    $password = (string)($_POST['password'] ?? '');

    $stmt = $pdo->prepare('SELECT id, name, password_hash FROM users WHERE email=? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = (int)$user['id'];
        $_SESSION['user_name'] = $user['name'];
        redirect('/dashboard.php');
    }
    // Small delay to slow brute-force guessing
    usleep(300000);
    $error = 'Incorrect email or password.';
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign In | SkyLine Cloud</title>
  <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
  <!-- Ambient Orbs -->
  <div class="ambient-orb orb-1"></div>
  <div class="ambient-orb orb-2"></div>

  <a class="back" href="/">← Return to Home</a>

  <main class="auth">
    <div class="eyebrow">SECURE VAULT ACCESS</div>
    <h1>Sign In to Cloud</h1>
    <p class="muted">Access your encrypted private cloud storage & files.</p>

    <?php if ($error): ?>
      <div class="error"><?= h($error) ?></div>
    <?php endif; ?>

    <form method="post">
      <input type="hidden" name="csrf" value="<?= h(csrf()) ?>">
      <label>
        Email address
        <input required type="email" name="email" autocomplete="username" placeholder="name@domain.com" value="<?= h($email) ?>">
      </label>
      <label>
        Password
        <input required type="password" name="password" autocomplete="current-password" placeholder="••••••••••••">
      </label>
      <button class="btn full" type="submit">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
        Sign In to Drive
      </button>
    </form>

    <p class="muted" style="text-align: center; margin-top: 24px;">
      Need private cloud storage? <a href="/register.php">Create free account</a>
    </p>
  </main>
</body>
</html>
