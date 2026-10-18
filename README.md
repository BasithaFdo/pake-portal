# SkyLine Hub — Ubuntu Apache + PHP + MySQL

## Requirements
Ubuntu, Apache 2.4, PHP 8.1+ with PDO MySQL and mbstring, MySQL 8+

## Database
```bash
sudo mysql
```
```sql
CREATE DATABASE pake_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pake_user'@'localhost' IDENTIFIED BY 'YOUR_NEW_STRONG_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE ON pake_portal.* TO 'pake_user'@'localhost';
EXIT;
```
```bash
sudo mysql < database/schema.sql
cp config.example.php config.php
nano config.php
```
Set the DB password in config.php. Do not commit config.php.

## Apache site
Create /etc/apache2/sites-available/pake-portal.conf:
```apache
<VirtualHost *:80>
    ServerName YOUR_SERVER_IP_OR_DOMAIN
    DocumentRoot /var/www/pake-portal/public
    <Directory /var/www/pake-portal/public>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
    ErrorLog ${APACHE_LOG_DIR}/pake-portal-error.log
    CustomLog ${APACHE_LOG_DIR}/pake-portal-access.log combined
</VirtualHost>
```
```bash
sudo a2dissite 000-default.conf
sudo a2ensite pake-portal.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

## Security notes
For production: configure HTTPS and make sure sessions use Secure cookies; add per-account/IP login rate limits and email verification; add security headers, monitoring and backups. Registration is public by default. Never commit credentials.
