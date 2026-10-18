<?php
require __DIR__ . '/bootstrap.php';
$isLoggedIn = isset($_SESSION['user_id']);
$userName = $isLoggedIn ? (string)($_SESSION['user_name'] ?? 'User') : '';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SkyLine Hub — Ultra-Fast PHP & MySQL Portal Platform</title>
  <meta name="description" content="SkyLine Hub is a modern, high-performance Ubuntu Apache, PHP 8.1+ & MySQL 8 portal platform featuring secure authentication, CSRF protection, and zero-bloat architecture.">
  <link rel="stylesheet" href="/assets/style.css">
</head>
<body>

  <!-- Scroll Progress Indicator -->
  <div class="scroll-progress-bar"></div>

  <!-- Interactive Particle Background Canvas -->
  <canvas id="bg-canvas"></canvas>

  <!-- Glowing Ambient Mesh Orbs -->
  <div class="ambient-orb orb-1"></div>
  <div class="ambient-orb orb-2"></div>
  <div class="ambient-orb orb-3"></div>

  <!-- Sticky Glassmorphic Navbar -->
  <header class="nav-header">
    <nav class="nav">
      <a class="logo" href="/">
        <span class="logo-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </span>
        SkyLine<span>Hub</span>
      </a>

      <ul class="nav-menu">
        <li><a href="#r34-showcase">Skyline 3D</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#architecture">Architecture</a></li>
        <li><a href="#security">Security</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>

      <div class="links">
        <?php if ($isLoggedIn): ?>
          <a class="btn small" href="/dashboard.php">Dashboard (<?= h($userName) ?>)</a>
          <form action="/logout.php" method="post" class="inline">
            <input type="hidden" name="csrf" value="<?= h(csrf()) ?>">
            <button class="ghost" type="submit">Logout</button>
          </form>
        <?php else: ?>
          <a class="ghost" href="/login.php">Sign In</a>
          <a class="btn small" href="/register.php">Get Started →</a>
        <?php endif; ?>
      </div>
    </nav>
  </header>

  <main>
    <!-- Hero Section -->
    <section class="hero-wrapper">
      <div class="container hero">
        <div class="badge-pill">
          <span class="pulse-dot"></span>
          <span>v2.0 Active • Production Ready PHP 8 & MySQL Portal</span>
        </div>

        <div class="eyebrow">Enterprise-Grade Performance</div>
        <h1>
          Build. Connect.<br>
          <span class="gradient-text">Scale Without Limits.</span>
        </h1>

        <p class="hero-subtitle">
          A secure, blazing-fast PHP 8.1+ and MySQL portal engine with modern session security, CSRF protection, and a sleek glassmorphic UI. Ready to deploy on Apache.
        </p>

        <div class="actions">
          <a class="btn" href="<?= $isLoggedIn ? '/dashboard.php' : '/register.php' ?>">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
            <?= $isLoggedIn ? 'Open Your Dashboard' : 'Deploy SkyLine Hub Free' ?>
          </a>
          <a class="ghostbutton" href="#architecture">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            Explore Architecture
          </a>
          <?php if (!$isLoggedIn): ?>
            <a class="ghostbutton" href="/login.php">Existing User? Sign In</a>
          <?php endif; ?>
        </div>

        <!-- 3D Interactive Hero Mockup -->
        <div class="hero-mockup-container">
          <div class="hero-mockup">
            <div class="mockup-header">
              <div class="mockup-dots">
                <span class="mockup-dot red"></span>
                <span class="mockup-dot yellow"></span>
                <span class="mockup-dot green"></span>
              </div>
              <div class="mockup-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                skyline-node@ubuntu-apache: ~ /var/www/pake-portal
              </div>
              <div class="mockup-status-tag">
                <span class="pulse-dot" style="width:6px;height:6px"></span>
                LIVE
              </div>
            </div>

            <div class="mockup-body">
              <div class="mockup-stats-grid">
                <div class="stat-widget">
                  <div class="label">System Uptime</div>
                  <div class="value">99.99%</div>
                  <div class="trend">↑ Continuous Operation</div>
                </div>
                <div class="stat-widget">
                  <div class="label">Response Latency</div>
                  <div class="value" id="live-latency">14ms</div>
                  <div class="trend">⚡ Sub-millisecond PDO</div>
                </div>
                <div class="stat-widget">
                  <div class="label">Queries Processed</div>
                  <div class="value" id="live-queries">12,840</div>
                  <div class="trend">🛡️ 100% Prepared Statements</div>
                </div>
                <div class="stat-widget">
                  <div class="label">Session Integrity</div>
                  <div class="value">Active</div>
                  <div class="trend">🔒 SameSite Strict Cookies</div>
                </div>
              </div>

              <div class="mockup-terminal">
                <div class="terminal-logs">
                  <div class="terminal-line"><span class="cyan">[BOOT]</span> PHP 8.1 PDO Engine Initialized</div>
                  <div class="terminal-line"><span class="purple">[AUTH]</span> CSRF Hash Tokens Generated (HMAC-SHA256)</div>
                  <div class="terminal-line"><span class="green">[OK]</span> MySQL UTF8MB4 Unicode connection established</div>
                  <div class="terminal-line"><span class="dim">[SYS]</span> VirtualHost packet listener active on port 443</div>
                </div>
                <div class="terminal-status-bar">
                  <span>Host: Ubuntu Linux 22.04 LTS</span>
                  <span>PHP Engine: v8.1+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Brian's Nissan Skyline GT-R R34 (2 Fast 2 Furious) Interactive 3D Showcase -->
    <section id="r34-showcase" class="container r34-showcase-container">
      <div class="r34-showcase-box">
        <!-- Header Bar -->
        <div class="r34-header-bar">
          <div class="r34-badge-title">
            <span class="gtr-badge">GT-R</span>
            <span class="r34-title-text">
              Brian's Nissan Skyline GT-R <span style="color:#00f0ff;font-weight:700;">// 2 FAST 2 FURIOUS</span> <span style="color:#64748b;font-weight:400;font-size:13px">(BNR34)</span>
            </span>
          </div>
          <div class="r34-specs-ticker">
            <span><span class="pulse-dot" style="width:6px;height:6px;background:#00f0ff;box-shadow:0 0 10px #00f0ff"></span> TWIN TURBO RB26DETT</span>
            <span>•</span>
            <span>ATTESA E-TS AWD</span>
            <span>•</span>
            <span id="r34RevStatus" style="color:#00f0ff;font-weight:700;">⚡ BRIAN'S R34 GT-R ACTIVE • 2 FAST 2 FURIOUS SPEC</span>
          </div>
        </div>

        <!-- 3D Canvas Area -->
        <div class="r34-canvas-wrapper" id="r34CanvasWrapper">
          <div class="tech-corner top-left"></div>
          <div class="tech-corner top-right"></div>
          <div class="tech-corner bottom-left"></div>
          <div class="tech-corner bottom-right"></div>

          <!-- Loading Progress Overlay -->
          <div class="r34-loading-overlay" id="r34LoadingOverlay">
            <div class="r34-loading-spinner"></div>
            <div style="font-weight:700;color:#fff;font-size:15px;margin-bottom:4px" id="r34LoadingText">⚡ Loading Brian's R34 GT-R (14.2 MB)...</div>
            <div class="r34-loading-bar-track">
              <div class="r34-loading-bar-fill" id="r34LoadingBar"></div>
            </div>
          </div>

          <!-- Telemetry HUD Left -->
          <div class="r34-hud-telemetry">
            <div><span class="cyan">CHASSIS:</span> BNR34-2F2F SPEC</div>
            <div><span class="cyan">AERO:</span> C-WEST Bodykit + APR GT Wing</div>
            <div><span class="cyan">WHEELS:</span> HRE 446R 19" 3-Piece</div>
            <div><span class="green">STATUS:</span> Infinite Highway Run Active</div>
          </div>

          <!-- Cockpit Speedometer & Tachometer Cluster Right -->
          <div class="r34-hud-cluster">
            <div class="gauge-item">
              <div class="gauge-label">Speed</div>
              <div class="gauge-val cyan"><span id="r34SpeedMph">128</span> <span class="gauge-unit">MPH</span></div>
            </div>
            <div class="gauge-item">
              <div class="gauge-label">Tachometer</div>
              <div class="gauge-val"><span id="r34RpmValue">6,800</span> <span class="gauge-unit">RPM</span></div>
            </div>
            <div class="gauge-item">
              <div class="gauge-label">Gear</div>
              <div class="gauge-val" style="color:#f59e0b">4TH</div>
            </div>
            <div class="gauge-item">
              <div class="gauge-label">NOS</div>
              <div class="gauge-val" style="color:#00f0ff">100%</div>
            </div>
          </div>

          <!-- Steering Keyboard Hint -->
          <div class="r34-steer-hint">
            <kbd>A</kbd> <kbd>D</kbd> or <kbd>←</kbd> <kbd>→</kbd> to Steer Car • <kbd>Space</kbd> for NOS Boost
          </div>

          <!-- 3D WebGL Canvas Container -->
          <div id="r34-3d-canvas"></div>

          <!-- Cockpit Controls Bar -->
          <div class="r34-controls-bar">
            <!-- Camera View Switcher -->
            <div class="r34-cam-switcher">
              <span class="r34-color-label">Cam:</span>
              <button class="r34-cam-btn active" data-view="chase">Chase</button>
              <button class="r34-cam-btn" data-view="orbit">Orbit</button>
              <button class="r34-cam-btn" data-view="hood">Hood</button>
              <button class="r34-cam-btn" data-view="low">Low</button>
            </div>

            <!-- Action Toggles -->
            <div class="r34-action-buttons">
              <!-- Big NOS Button -->
              <button class="r34-rev-btn" id="btnR34Nos" style="background:linear-gradient(135deg, #00d4ff, #0055ff);box-shadow:0 4px 18px rgba(0, 150, 255, 0.5);" title="Trigger Nitrous Oxide Purge & High Speed Boost">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                NOS PURGE & BOOST
              </button>

              <button class="r34-toggle-btn active" id="btnR34DriveMode" title="Switch Highway Drive or 360° Showroom">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Highway Run
              </button>

              <button class="r34-toggle-btn active" id="btnR34Neon" title="Toggle 2 Fast 2 Furious Blue Neon Underglow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"></path></svg>
                Blue Underglow
              </button>

              <button class="r34-toggle-btn active" id="btnR34Lights" title="Toggle Xenon Headlights & Halo Taillights">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line></svg>
                Headlights
              </button>

              <button class="r34-toggle-btn active" id="btnR34Sound" title="Toggle Turbo & NOS Synthesized Sound Effects">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                Audio: ON
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Metrics Ribbon -->
    <div class="container">
      <div class="metrics-ribbon">
        <div class="metric-item">
          <div class="metric-number" data-counter-target="99.99" data-counter-suffix="%">99.99%</div>
          <div class="metric-label">Guaranteed System Reliability</div>
        </div>
        <div class="metric-item">
          <div class="metric-number" data-counter-target="15" data-counter-prefix="< " data-counter-suffix="ms">< 15ms</div>
          <div class="metric-label">Average Server Response Time</div>
        </div>
        <div class="metric-item">
          <div class="metric-number" data-counter-target="256" data-counter-suffix="-bit">256-bit</div>
          <div class="metric-label">Cryptographic Protection</div>
        </div>
        <div class="metric-item">
          <div class="metric-number" data-counter-target="0" data-counter-suffix=" Bloat">0 Bloat</div>
          <div class="metric-label">Pure Native Web Tech</div>
        </div>
      </div>
    </div>

    <!-- Core Features Section -->
    <section id="features" class="section">
      <div class="container">
        <div class="section-header">
          <div class="eyebrow">BUILT FOR SPEED & RELIABILITY</div>
          <h2 class="section-title">Engineered with Precision</h2>
          <p class="section-desc">
            SkyLine Hub replaces heavyweight bloatware with crisp, efficient PHP and MySQL architecture designed for maximum speed and simplicity.
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m18 16 4-4-4-4"></path>
                <path d="m6 8-4 4 4 4"></path>
                <path d="m14.5 4-5 16"></path>
              </svg>
            </div>
            <h3>Modern PHP 8 Core</h3>
            <p>Strict typing, fast PDO prepared statements, and zero framework overhead ensure near-instantaneous page generation.</p>
            <span class="card-badge">PHP 8.1+ Strict</span>
          </div>

          <div class="feature-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
            </div>
            <h3>Optimized MySQL 8 Storage</h3>
            <p>Full utf8mb4 multi-language unicode charset, structured indexing, and isolated least-privilege database user permissions.</p>
            <span class="card-badge">InnoDB + utf8mb4</span>
          </div>

          <div class="feature-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3>CSRF & Session Security</h3>
            <p>Automated cryptographic token verification for state mutations, SameSite cookie protection, and session regeneration on login.</p>
            <span class="card-badge">Strict Security</span>
          </div>

          <div class="feature-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <h3>Apache 2.4 Ready</h3>
            <p>Production-tailored VirtualHost configuration with directory traversal safeguards, symbolic link controls, and custom error logs.</p>
            <span class="card-badge">VirtualHost Config</span>
          </div>

          <div class="feature-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20"></path>
                <path d="m17 5-5-3-5 3"></path>
                <path d="m17 19-5 3-5-3"></path>
                <path d="M2 12h20"></path>
                <path d="m5 7-3 5 3 5"></path>
                <path d="m19 7 3 5-3 5"></path>
              </svg>
            </div>
            <h3>Glassmorphic Responsive UI</h3>
            <p>Sleek dark-mode aesthetic with hardware-accelerated backdrop blur, dynamic micro-interactions, and responsive layouts on all screens.</p>
            <span class="card-badge">Pure Vanilla CSS</span>
          </div>

          <div class="feature-card">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h3>Instant Extensibility</h3>
            <p>Clean modular code foundation that easily scales from a single portal into enterprise SaaS dashboards or API gateways.</p>
            <span class="card-badge">Modular Architecture</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Architecture & Code Showcase -->
    <section id="architecture" class="section">
      <div class="container">
        <div class="section-header">
          <div class="eyebrow">DEPLOYMENT & ARCHITECTURE</div>
          <h2 class="section-title">Production Code Ready</h2>
          <p class="section-desc">
            Explore the clean configuration files that power SkyLine Hub on Ubuntu Linux.
          </p>
        </div>

        <div class="architecture-tabs-container">
          <div class="tabs-nav">
            <div class="tab-buttons">
              <button class="tab-btn active" data-tab="tab-apache">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                pake-portal.conf
              </button>
              <button class="tab-btn" data-tab="tab-sql">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                database/schema.sql
              </button>
              <button class="tab-btn" data-tab="tab-bootstrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                bootstrap.php
              </button>
              <button class="tab-btn" data-tab="tab-config">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                config.example.php
              </button>
            </div>
            <button class="copy-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Copy Code</span>
            </button>
          </div>

          <!-- Tab Pane 1: Apache Conf -->
          <div id="tab-apache" class="tab-pane active">
            <pre class="code-pre"><code><span class="comment"># /etc/apache2/sites-available/pake-portal.conf</span>
&lt;VirtualHost *:80&gt;
    ServerName <span class="string">YOUR_SERVER_IP_OR_DOMAIN</span>
    DocumentRoot <span class="string">/var/www/pake-portal/public</span>

    &lt;Directory <span class="string">/var/www/pake-portal/public</span>&gt;
        <span class="keyword">Options</span> -Indexes +FollowSymLinks
        <span class="keyword">AllowOverride</span> None
        <span class="keyword">Require</span> all granted
    &lt;/Directory&gt;

    <span class="comment"># Logging configuration</span>
    ErrorLog ${APACHE_LOG_DIR}/pake-portal-error.log
    CustomLog ${APACHE_LOG_DIR}/pake-portal-access.log combined
&lt;/VirtualHost&gt;</code></pre>
          </div>

          <!-- Tab Pane 2: SQL Schema -->
          <div id="tab-sql" class="tab-pane">
            <pre class="code-pre"><code><span class="comment">-- MySQL UTF8MB4 Schema Setup</span>
<span class="keyword">CREATE DATABASE</span> pake_portal <span class="keyword">CHARACTER SET</span> utf8mb4 <span class="keyword">COLLATE</span> utf8mb4_unicode_ci;

<span class="keyword">CREATE TABLE</span> users (
    id <span class="var">INT UNSIGNED AUTO_INCREMENT PRIMARY KEY</span>,
    name <span class="var">VARCHAR(100) NOT NULL</span>,
    email <span class="var">VARCHAR(190) NOT NULL UNIQUE</span>,
    password_hash <span class="var">VARCHAR(255) NOT NULL</span>,
    created_at <span class="var">TIMESTAMP DEFAULT CURRENT_TIMESTAMP</span>
) <span class="keyword">ENGINE</span>=InnoDB <span class="keyword">DEFAULT CHARSET</span>=utf8mb4;</code></pre>
          </div>

          <!-- Tab Pane 3: Bootstrap PHP -->
          <div id="tab-bootstrap" class="tab-pane">
            <pre class="code-pre"><code><span class="keyword">&lt;?php</span>
<span class="keyword">declare</span>(strict_types=1);

<span class="var">$config</span> = <span class="keyword">require</span> <span class="func">dirname</span>(__DIR__) . <span class="string">'/config.php'</span>;

<span class="var">$pdo</span> = <span class="keyword">new</span> <span class="func">PDO</span>(
    <span class="string">'mysql:host='</span> . <span class="var">$config</span>[<span class="string">'db_host'</span>] . <span class="string">';dbname='</span> . <span class="var">$config</span>[<span class="string">'db_name'</span>] . <span class="string">';charset=utf8mb4'</span>,
    <span class="var">$config</span>[<span class="string">'db_user'</span>],
    <span class="var">$config</span>[<span class="string">'db_pass'</span>],
    [
        <span class="func">PDO::ATTR_ERRMODE</span> => <span class="func">PDO::ERRMODE_EXCEPTION</span>,
        <span class="func">PDO::ATTR_DEFAULT_FETCH_MODE</span> => <span class="func">PDO::FETCH_ASSOC</span>,
        <span class="func">PDO::ATTR_EMULATE_PREPARES</span> => <span class="keyword">false</span>,
    ]
);

<span class="comment">// Secure session initialization</span>
<span class="func">ini_set</span>(<span class="string">'session.use_strict_mode'</span>, <span class="string">'1'</span>);
<span class="func">session_start</span>();</code></pre>
          </div>

          <!-- Tab Pane 4: Config PHP -->
          <div id="tab-config" class="tab-pane">
            <pre class="code-pre"><code><span class="keyword">&lt;?php</span>
<span class="comment">// config.php - Keep outside public root, do NOT commit to Git</span>
<span class="keyword">return</span> [
    <span class="string">'db_host'</span> => <span class="string">'127.0.0.1'</span>,
    <span class="string">'db_name'</span> => <span class="string">'pake_portal'</span>,
    <span class="string">'db_user'</span> => <span class="string">'pake_user'</span>,
    <span class="string">'db_pass'</span> => <span class="string">'YOUR_NEW_STRONG_PASSWORD'</span>,
];</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Security Spotlight -->
    <section id="security" class="section">
      <div class="container">
        <div class="security-section">
          <div class="security-list">
            <div class="eyebrow">UNCOMPROMISING PROTECTION</div>
            <h2 class="section-title" style="text-align: left; margin-bottom: 20px;">Built for Defensive Security</h2>

            <div class="security-item">
              <div class="security-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div>
                <h4>CSRF Shield</h4>
                <p>Every POST request requires a cryptographically strong anti-forgery token, preventing unauthorized actions from third-party sites.</p>
              </div>
            </div>

            <div class="security-item">
              <div class="security-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <h4>Zero SQL Injection Vector</h4>
                <p>Emulated prepares are explicitly disabled (`PDO::ATTR_EMULATE_PREPARES => false`), forcing native prepared statements at the MySQL protocol level.</p>
              </div>
            </div>

            <div class="security-item">
              <div class="security-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
              </div>
              <div>
                <h4>Adaptive Password Hashing</h4>
                <p>Passwords are never stored in plaintext. Hashed using PHP's native `PASSWORD_DEFAULT` (Bcrypt) with automated salt generation.</p>
              </div>
            </div>

            <div class="security-item">
              <div class="security-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><path d="m14.83 14.83 4.24 4.24"></path><path d="m9.17 14.83-4.24 4.24"></path></svg>
              </div>
              <div>
                <h4>Strict Session Governance</h4>
                <p>Enforces `session.use_strict_mode = 1`, `HttpOnly = true`, and `SameSite = Lax` flags to neutralize XSS cookie exfiltration.</p>
              </div>
            </div>
          </div>

          <div class="security-card-visual">
            <div class="visual-badge">
              <span class="pulse-dot" style="width:6px;height:6px"></span>
              Secured Environment
            </div>
            <h3>Hardened By Design</h3>
            <p>
              Unlike bloated CMS portals with thousands of unchecked third-party plugins, SkyLine Hub provides an airtight attack surface with direct, auditable code.
            </p>
            <div style="background: rgba(10, 16, 30, 0.7); border-radius: 12px; padding: 18px; border: 1px solid var(--edge);">
              <div style="font-family: var(--font-mono); font-size: 13px; color: #38bdf8; margin-bottom: 8px;">✓ Apache Options -Indexes</div>
              <div style="font-family: var(--font-mono); font-size: 13px; color: #38bdf8; margin-bottom: 8px;">✓ Credentials isolated outside /public</div>
              <div style="font-family: var(--font-mono); font-size: 13px; color: #38bdf8; margin-bottom: 8px;">✓ HTML entities sanitization with ENT_QUOTES</div>
              <div style="font-family: var(--font-mono); font-size: 13px; color: #38bdf8;">✓ Timing attack mitigated password verify</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Frequently Asked Questions -->
    <section id="faq" class="section">
      <div class="container">
        <div class="section-header">
          <div class="eyebrow">GOT QUESTIONS?</div>
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-desc">
            Everything you need to know about setting up and running SkyLine Hub.
          </p>
        </div>

        <div class="faq-grid">
          <div class="faq-item">
            <button class="faq-question">
              <span>How do I deploy SkyLine Hub on Ubuntu Apache?</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer">
              Clone this repository into <code>/var/www/pake-portal</code>, import <code>database/schema.sql</code> into your MySQL server, copy <code>config.example.php</code> to <code>config.php</code> with your database credentials, and point an Apache VirtualHost to the <code>/public</code> directory.
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-question">
              <span>Why is the configuration file outside the public directory?</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer">
              Keeping <code>config.php</code> outside the <code>public/</code> DocumentRoot ensures database credentials and API secrets can never be leaked or accessed over HTTP, even in the event of an Apache misconfiguration.
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-question">
              <span>Can I customize the dashboard and add custom pages?</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer">
              Yes! SkyLine Hub is designed as a clean foundational architecture. You can easily add new PHP endpoints in <code>public/</code> and simply include <code>bootstrap.php</code> to inherit authenticated sessions, PDO queries, and security helpers.
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-question">
              <span>Does SkyLine Hub support HTTPS / SSL?</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer">
              Yes. The session handler automatically detects HTTPS traffic and enables the <code>Secure</code> cookie attribute flag, preventing session cookie transmission over unencrypted connections. You can easily enable Let's Encrypt Certbot on Apache.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Banner -->
    <section class="section" style="padding-top: 20px;">
      <div class="container">
        <div class="cta-banner">
          <h2>Ready to Launch Your High-Performance Portal?</h2>
          <p>
            Deploy SkyLine Hub to your production environment in minutes with zero dependencies and maximum reliability.
          </p>
          <div class="actions" style="justify-content: center;">
            <a class="btn" href="<?= $isLoggedIn ? '/dashboard.php' : '/register.php' ?>">
              <?= $isLoggedIn ? 'Go to Dashboard →' : 'Create Free Account →' ?>
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Modern Footer -->
  <footer>
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="logo" href="/">
            <span class="logo-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </span>
            SkyLine<span>Hub</span>
          </a>
          <p>
            A high-performance PHP 8 & MySQL starter portal engine built for security, speed, and modern developer ergonomics.
          </p>
        </div>

        <div class="footer-links-group">
          <div class="footer-col">
            <h5>Product</h5>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#architecture">Architecture</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h5>Account</h5>
            <ul>
              <?php if ($isLoggedIn): ?>
                <li><a href="/dashboard.php">Dashboard</a></li>
              <?php else: ?>
                <li><a href="/login.php">Sign In</a></li>
                <li><a href="/register.php">Create Account</a></li>
              <?php endif; ?>
            </ul>
          </div>

          <div class="footer-col">
            <h5>Stack</h5>
            <ul>
              <li><span style="color:var(--muted)">Ubuntu Linux</span></li>
              <li><span style="color:var(--muted)">Apache 2.4</span></li>
              <li><span style="color:var(--muted)">PHP 8.1+</span></li>
              <li><span style="color:var(--muted)">MySQL 8</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div>© <?= date('Y') ?> SkyLine Hub. All rights reserved.</div>
        <div class="status-indicator">
          <span class="pulse-dot" style="width:6px;height:6px"></span>
          <span>All Systems Operational</span>
        </div>
      </div>
    </div>
  </footer>

  <!-- Interactive Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
  <script src="/assets/r34_viewer.js"></script>
  <script src="/assets/landing.js"></script>
</body>
</html>
