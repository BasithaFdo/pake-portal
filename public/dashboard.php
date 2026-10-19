<?php
require __DIR__ . '/bootstrap.php';
if (!isset($_SESSION['user_id'])) {
    redirect('/login.php');
}

$stmt = $pdo->prepare('SELECT id, name, email, created_at FROM users WHERE id=? LIMIT 1');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user) {
    session_unset();
    session_destroy();
    redirect('/login.php');
}

$initial = strtoupper(substr($user['name'], 0, 1));
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SkyLine Cloud Drive | Private Storage</title>
  <meta name="description" content="SkyLine Hub Private Cloud Storage & Drive Console. Secure personal files, encrypted vaults, and storage management.">
  <link rel="icon" type="image/svg+xml" href="/assets/skyline-mark.svg">
  <link rel="alternate icon" href="/favicon.ico">
  <link rel="stylesheet" href="/assets/style.css">
  <link rel="stylesheet" href="/assets/cloud.css">
</head>
<body>

  <!-- Background Ambient Glow -->
  <div class="ambient-orb orb-1"></div>
  <div class="ambient-orb orb-2"></div>

  <div class="cloud-app">
    <!-- Sidebar -->
    <aside class="cloud-sidebar">
      <div>
        <div class="cloud-sidebar-brand">
          <a class="logo" href="/" style="display:flex; align-items:center; gap:10px;">
            <span class="logo-badge" style="background:transparent; border:none; padding:0; width:28px; height:28px;">
              <img src="/assets/skyline-mark.svg" alt="SkyLine Hub" width="28" height="28" style="display:block;">
            </span>
            SkyLine<span>Cloud</span>
          </a>
          <span class="cloud-vault-tag">
            <span class="pulse-dot" style="width:6px;height:6px"></span>
            Private
          </span>
        </div>

        <ul class="cloud-nav">
          <li class="cloud-nav-item active" data-filter="all">
            <button onclick="SkyLineCloud.switchFilter('all')">
              <span class="nav-label-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                All Files
              </span>
              <span class="nav-badge" id="badgeAll">7</span>
            </button>
          </li>
          <li class="cloud-nav-item" data-filter="starred">
            <button onclick="SkyLineCloud.switchFilter('starred')">
              <span class="nav-label-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Starred
              </span>
              <span class="nav-badge" id="badgeStarred">4</span>
            </button>
          </li>
          <li class="cloud-nav-item" data-filter="vault">
            <button onclick="SkyLineCloud.switchFilter('vault')">
              <span class="nav-label-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Security Vault
              </span>
              <span class="nav-badge" id="badgeVault">1</span>
            </button>
          </li>
          <li class="cloud-nav-item" data-filter="recent">
            <button onclick="SkyLineCloud.switchFilter('recent')">
              <span class="nav-label-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Recent Uploads
              </span>
            </button>
          </li>
        </ul>

        <!-- Storage Quota Widget -->
        <div class="cloud-quota-card">
          <div class="quota-header">
            <span class="quota-title">Cloud Storage</span>
            <span class="quota-pct" id="quotaPctText">34.2%</span>
          </div>
          <div class="quota-progress-track">
            <div class="quota-progress-fill" id="quotaFill"></div>
          </div>
          <div class="quota-text">
            <strong id="quotaUsedText">34.2 GB</strong> of 100 GB used
          </div>
          <div class="quota-breakdown">
            <div class="quota-item"><span class="quota-dot blue"></span> Database</div>
            <div class="quota-item"><span class="quota-dot purple"></span> Media</div>
            <div class="quota-item"><span class="quota-dot orange"></span> Backups</div>
            <div class="quota-item"><span class="quota-dot green"></span> Docs</div>
          </div>
        </div>
      </div>

      <!-- User Profile & Logout -->
      <div class="sidebar-user">
        <div class="user-meta">
          <div class="user-avatar"><?= h($initial) ?></div>
          <div class="user-details">
            <div class="user-name"><?= h($user['name']) ?></div>
            <div class="user-role">Cloud Member</div>
          </div>
        </div>
        <form action="/logout.php" method="post" class="inline">
          <input type="hidden" name="csrf" value="<?= h(csrf()) ?>">
          <button class="logout-icon-btn" type="submit" title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </form>
      </div>
    </aside>

    <!-- Main Workspace -->
    <main class="cloud-main">
      <!-- Topbar Header -->
      <header class="cloud-topbar">
        <div style="display:flex;align-items:center;gap:14px;">
          <button class="mobile-sidebar-toggle" onclick="SkyLineCloud.toggleSidebar()" title="Toggle Sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <div class="search-container">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input class="search-input" id="searchInput" type="text" placeholder="Search files, folders or tags..." autocomplete="off">
            <span class="search-shortcut">Ctrl+K</span>
          </div>
        </div>

        <div class="topbar-actions">
          <div class="view-switcher">
            <button class="view-btn active" id="viewBtnGrid" onclick="SkyLineCloud.switchView('grid')" title="Grid View">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
            <button class="view-btn" id="viewBtnList" onclick="SkyLineCloud.switchView('list')" title="List View">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
          </div>

          <button class="ghostbutton" onclick="SkyLineCloud.openNewFolderModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
            New Folder
          </button>

          <button class="btn small" onclick="SkyLineCloud.triggerUpload()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Upload File
          </button>
        </div>
      </header>

      <!-- Drive Workspace Canvas -->
      <div class="cloud-workspace">
        <!-- Breadcrumb & Directory Status -->
        <div class="workspace-controls">
          <div class="breadcrumb-list" id="breadcrumbContainer"></div>
          <div style="font-size:12.5px;color:var(--muted);font-family:var(--font-mono)">
            Protected with AES-256 Storage Encryption
          </div>
        </div>

        <!-- Drag & Drop Upload Zone -->
        <div class="dropzone-banner" id="dropzoneBanner" onclick="SkyLineCloud.triggerUpload()">
          <div class="dropzone-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          </div>
          <div class="dropzone-title">Drag & drop files here to upload to Private Cloud</div>
          <div class="dropzone-sub">or click to browse from your device (any format up to 2 GB)</div>
        </div>

        <!-- Folders Section -->
        <div id="foldersSection" style="margin-bottom: 32px;">
          <div class="section-label">
            Folders
          </div>
          <div class="folders-grid" id="foldersGrid"></div>
        </div>

        <!-- Files Section -->
        <div>
          <div class="section-label">
            Files
          </div>
          <!-- Grid View -->
          <div class="files-grid" id="filesGrid"></div>

          <!-- Table List View -->
          <div class="files-table-container" id="filesTableContainer">
            <table class="files-table" id="filesTable"></table>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Hidden Native File Input -->
  <input type="file" multiple id="hiddenFileInput" style="display:none">

  <!-- New Folder Modal -->
  <div class="modal-backdrop" id="newFolderModal">
    <div class="modal-box">
      <div class="modal-header">
        <h3 class="modal-title">Create New Folder</h3>
        <button class="modal-close-btn" onclick="SkyLineCloud.closeNewFolderModal()">&times;</button>
      </div>
      <p style="color:var(--muted);font-size:14px;margin-top:0;margin-bottom:16px">Enter a name for your private cloud directory:</p>
      <input type="text" class="modal-input" id="newFolderNameInput" placeholder="Folder name (e.g. Invoices, Logs, Assets)" onkeydown="if(event.key==='Enter') SkyLineCloud.submitNewFolder()">
      <div class="modal-actions">
        <button class="ghostbutton" onclick="SkyLineCloud.closeNewFolderModal()">Cancel</button>
        <button class="btn small" onclick="SkyLineCloud.submitNewFolder()">Create Folder</button>
      </div>
    </div>
  </div>

  <!-- Upload Progress Simulation Modal -->
  <div class="modal-backdrop" id="uploadProgressModal">
    <div class="modal-box" style="text-align:center;">
      <div style="font-size:36px;margin-bottom:12px">⚡</div>
      <h3 class="modal-title" style="margin-bottom:6px">Encrypting & Uploading to Private Cloud</h3>
      <p style="color:var(--muted);font-size:13.5px;margin-bottom:20px" id="uploadProgressFileName">filename.dat</p>

      <div class="quota-progress-track" style="height:10px;margin-bottom:10px">
        <div class="quota-progress-fill" id="uploadProgressBarFill" style="width:0%"></div>
      </div>
      <div style="font-family:var(--font-mono);font-size:13px;color:#38bdf8;font-weight:700" id="uploadProgressPercent">0%</div>
    </div>
  </div>

  <!-- File Details Modal -->
  <div class="modal-backdrop" id="fileDetailsModal">
    <div class="modal-box">
      <div class="modal-header">
        <h3 class="modal-title" id="detailFileName">file-name.ext</h3>
        <button class="modal-close-btn" onclick="SkyLineCloud.closeDetails()">&times;</button>
      </div>
      <div style="margin-bottom:24px">
        <div class="details-row">
          <span class="details-label">Format:</span>
          <span class="details-val" id="detailFileType">PDF</span>
        </div>
        <div class="details-row">
          <span class="details-label">Size:</span>
          <span class="details-val" id="detailFileSize">14.2 MB</span>
        </div>
        <div class="details-row">
          <span class="details-label">Storage Path:</span>
          <span class="details-val" id="detailFilePath">/Documents/file.pdf</span>
        </div>
        <div class="details-row">
          <span class="details-label">Last Modified:</span>
          <span class="details-val" id="detailFileModified">2026-10-18</span>
        </div>
        <div class="details-row">
          <span class="details-label">Security:</span>
          <span class="details-val" style="color:#10b981">AES-256 Verified</span>
        </div>
        <div class="details-row">
          <span class="details-label">SHA-256 Checksum:</span>
          <span class="details-val" style="font-size:11px" id="detailFileSha">5e884898da2...</span>
        </div>
      </div>

      <div class="modal-actions" style="justify-content:space-between">
        <button class="ghostbutton" style="color:#f87171;border-color:rgba(239,68,68,0.3)" onclick="SkyLineCloud.deleteActiveFile()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Delete
        </button>
        <div style="display:flex;gap:10px">
          <button class="ghostbutton" onclick="SkyLineCloud.closeDetails()">Close</button>
          <button class="btn small" onclick="SkyLineCloud.downloadActiveFile()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="/assets/cloud.js"></script>
</body>
</html>
