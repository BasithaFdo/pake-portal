<?php
require __DIR__.'/bootstrap.php';
if (isset($_SESSION['user_id'])) redirect('/dashboard.php');
$errors=[]; $name='';$email='';
if ($_SERVER['REQUEST_METHOD']==='POST') {
    verify_csrf();
    $name=trim((string)($_POST['name'] ?? ''));
    $email=strtolower(trim((string)($_POST['email'] ?? '')));
    $password=(string)($_POST['password'] ?? '');
    if(strlen($name)<2 || mb_strlen($name)>100) $errors[]='Name must be 2 to 100 characters.';
    if(!filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($email)>190) $errors[]='Enter a valid email address.';
    if(strlen($password)<12 || strlen($password)>72) $errors[]='Use a password between 12 and 72 characters.';
    if(!$errors){
        try {
            $stmt=$pdo->prepare('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)');
            $stmt->execute([$name,$email,password_hash($password,PASSWORD_DEFAULT)]);
            session_regenerate_id(true);
            $_SESSION['user_id']=(int)$pdo->lastInsertId();
            $_SESSION['user_name']=$name;
            redirect('/dashboard.php');
        } catch(PDOException $e){
            if($e->getCode()==='23000') $errors[]='This email is already registered.';
            else { error_log($e->getMessage()); $errors[]='Registration unavailable. Please try again.'; }
        }
    }
}
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Create Account | PAKE Portal</title><link rel="stylesheet" href="/assets/style.css"></head><body><a class="back" href="/">← Home</a><main class="auth"><div class="eyebrow">JOIN PAKE PORTAL</div><h1>Create account</h1><p class="muted">Your new workspace starts here.</p><?php foreach($errors as $err): ?><div class="error"><?= h($err) ?></div><?php endforeach; ?><form method="post"><input type="hidden" name="csrf" value="<?= h(csrf()) ?>"><label>Full name<input required maxlength="100" name="name" autocomplete="name" value="<?= h($name) ?>"></label><label>Email address<input required type="email" maxlength="190" name="email" autocomplete="email" value="<?= h($email) ?>"></label><label>Password<input required type="password" minlength="12" maxlength="72" name="password" autocomplete="new-password"></label><button class="btn full" type="submit">Create account</button></form><p class="muted">Already registered? <a href="/login.php">Sign in</a></p></main></body></html>
