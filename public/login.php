<?php
require __DIR__.'/bootstrap.php';
if(isset($_SESSION['user_id'])) redirect('/dashboard.php');
$error='';$email='';
if($_SERVER['REQUEST_METHOD']==='POST'){
    verify_csrf();
    $email=strtolower(trim((string)($_POST['email'] ?? '')));
    $password=(string)($_POST['password'] ?? '');
    $stmt=$pdo->prepare('SELECT id,name,password_hash FROM users WHERE email=? LIMIT 1');
    $stmt->execute([$email]);$user=$stmt->fetch();
    if($user && password_verify($password,$user['password_hash'])){
        session_regenerate_id(true);$_SESSION['user_id']=(int)$user['id'];$_SESSION['user_name']=$user['name'];redirect('/dashboard.php');
    }
    // Small delay to slow online guessing; add server-side rate limits for production.
    usleep(300000);$error='Incorrect email or password.';
}
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Login | PAKE Portal</title><link rel="stylesheet" href="/assets/style.css"></head><body><a class="back" href="/">← Home</a><main class="auth"><div class="eyebrow">WELCOME BACK</div><h1>Sign in</h1><p class="muted">Access your PAKE dashboard.</p><?php if($error): ?><div class="error"><?= h($error) ?></div><?php endif; ?><form method="post"><input type="hidden" name="csrf" value="<?= h(csrf()) ?>"><label>Email address<input required type="email" name="email" autocomplete="username" value="<?= h($email) ?>"></label><label>Password<input required type="password" name="password" autocomplete="current-password"></label><button class="btn full" type="submit">Sign in</button></form><p class="muted">New here? <a href="/register.php">Create an account</a></p></main></body></html>
