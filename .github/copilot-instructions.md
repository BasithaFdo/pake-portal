# Copilot Instructions for SkyLine Hub

## Project overview
This repository is a small PHP + MySQL web portal for account registration and login. The application is intentionally lightweight: page scripts live under `public/`, a shared `bootstrap.php` handles configuration and session setup, and the schema lives in `database/schema.sql`.

The important runtime flow is:
- `config.php` is required at runtime and is created from `config.example.php`.
- `public/bootstrap.php` loads config, creates the PDO connection, initializes secure session settings, and defines shared helpers such as `h()`, `csrf()`, `verify_csrf()`, and `redirect()`.
- `public/index.php`, `public/login.php`, `public/register.php`, and `public/dashboard.php` are top-level entry points served from the web root.
- Apache should serve the project with the document root set to `public/`.
- The `users` table is the core persistence model; emails are unique and passwords are stored as password hashes.

## Build, test, and lint commands
There is no package manager or automated test suite configured in this repository.

Use these commands for validation while working here:

```bash
# Syntax-check PHP files
php -l public/bootstrap.php
php -l public/index.php
php -l public/login.php
php -l public/register.php
php -l public/dashboard.php
php -l public/logout.php

# Start a local PHP dev server from the project root
php -S localhost:8000 -t public

# Apply the database schema (after creating the database/user in MySQL)
mysql < database/schema.sql
```

For a focused smoke test, run the PHP built-in server and then open the app in a browser:
- `http://localhost:8000/` for the landing page
- `http://localhost:8000/register.php` for account creation
- `http://localhost:8000/login.php` for sign-in
- `http://localhost:8000/dashboard.php` after login

If you need to validate a single changed file, prefer `php -l path/to/file.php` over a full repository-wide check.

## High-level architecture
- `public/` is the document root and contains all user-facing PHP pages.
- `public/bootstrap.php` is the central bootstrap layer. It is responsible for:
  - loading `config.php`
  - connecting to MySQL via PDO
  - enabling session security defaults
  - providing `h()` for HTML escaping and `verify_csrf()` for request validation
- `database/schema.sql` defines the current data model; currently it only contains the `users` table with a unique email index.
- `config.example.php` is the template for local configuration; copy it to `config.php` and fill in the actual MySQL credentials. Do not commit `config.php`.
- Authentication is session-based: each protected page checks `$_SESSION['user_id']` and redirects to `/login.php` when missing.
- CSRF protection is enforced by a per-session token stored in `$_SESSION['csrf']` and checked in POST handlers.

## Key conventions in this codebase
- Every page entry point begins with `require __DIR__.'/bootstrap.php';` so the same DB connection, session settings, and helpers are reused.
- Use prepared statements with PDO (`prepare()` + `execute()`) for all database access. Do not concatenate SQL strings with user input.
- Protect write actions and login flows with `verify_csrf()` before processing `$_POST` data.
- Escape all user-generated content with `h()` before echoing into HTML.
- Normalize email addresses with `strtolower(trim(...))` before storing or comparing them.
- Redirect with `redirect('/path.php')` for authenticated/unauthenticated flow changes instead of rendering a custom route manually.
- Keep secrets out of the repository. `config.php` is ignored by Git and should never be committed.
- This project is a starter portal: the landing page and dashboard are intentionally simple, and feature work should be added into the existing page structure rather than a separate framework.

## Local setup notes
- Create a MySQL database and user per the instructions in `README.md`.
- Load `database/schema.sql` after creating the schema.
- Copy `config.example.php` to `config.php`, update the database credentials, and keep it local-only.
- The repository is designed to run on Ubuntu/Apache with PHP 8.1+ and MySQL 8+, as documented in `README.md`.

## Working expectations
When making changes here:
- prefer surgical edits in the existing PHP scripts and shared bootstrap helpers
- keep the application flow compatible with the current session-based auth model
- preserve the CSRF and input-validation patterns already present in the codebase
- validate PHP syntax for changed files with `php -l` and prefer a direct local smoke test over broad repo-wide validation
