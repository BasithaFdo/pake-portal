/**
 * SkyLine Hub - Private Cloud File Drive & Storage Manager
 */

(function () {
  'use strict';

  // Default seed files for the private cloud drive
  const DEFAULT_SEED_FILES = [
    {
      id: 'f-1',
      name: 'cloud-cluster-backup.sql',
      folder: '/',
      size: 48234496, // 46 MB
      type: 'code',
      ext: 'SQL',
      starred: true,
      modified: '2026-10-18 19:42',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      category: 'database'
    },
    {
      id: 'f-2',
      name: 'SkyLine-Infrastructure-Spec.pdf',
      folder: '/',
      size: 14680064, // 14 MB
      type: 'doc',
      ext: 'PDF',
      starred: true,
      modified: '2026-10-18 16:15',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      category: 'documents'
    },
    {
      id: 'f-3',
      name: 'apache-pake-portal.conf',
      folder: '/',
      size: 4096, // 4 KB
      type: 'code',
      ext: 'CONF',
      starred: false,
      modified: '2026-10-18 14:02',
      sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      category: 'config'
    },
    {
      id: 'f-4',
      name: 'docker-compose-production.yml',
      folder: '/DevOps',
      size: 8192, // 8 KB
      type: 'code',
      ext: 'YML',
      starred: true,
      modified: '2026-10-17 22:30',
      sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      category: 'devops'
    },
    {
      id: 'f-5',
      name: 'cloud-architecture-diagram.png',
      folder: '/',
      size: 8388608, // 8 MB
      type: 'img',
      ext: 'PNG',
      starred: false,
      modified: '2026-10-17 11:20',
      sha256: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      category: 'media'
    },
    {
      id: 'f-6',
      name: 'private-vault-keys.pem',
      folder: '/Security',
      size: 2048, // 2 KB
      type: 'sec',
      ext: 'PEM',
      starred: true,
      modified: '2026-10-16 09:12',
      sha256: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
      category: 'vault'
    },
    {
      id: 'f-7',
      name: 'site-archive-v1.tar.gz',
      folder: '/Backups',
      size: 89128960, // 85 MB
      type: 'zip',
      ext: 'ZIP',
      starred: false,
      modified: '2026-10-15 18:00',
      sha256: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
      category: 'backups'
    }
  ];

  const DEFAULT_SEED_FOLDERS = [
    { id: 'fol-1', name: 'DevOps', parent: '/', color: '#38bdf8' },
    { id: 'fol-2', name: 'Backups', parent: '/', color: '#fbbf24' },
    { id: 'fol-3', name: 'Security', parent: '/', color: '#f87171' },
    { id: 'fol-4', name: 'Documents', parent: '/', color: '#a855f7' }
  ];

  // Load from localStorage or use defaults
  let driveFiles = [];
  let driveFolders = [];

  try {
    const savedFiles = localStorage.getItem('skyline_cloud_files');
    const savedFolders = localStorage.getItem('skyline_cloud_folders');
    driveFiles = savedFiles ? JSON.parse(savedFiles) : [...DEFAULT_SEED_FILES];
    driveFolders = savedFolders ? JSON.parse(savedFolders) : [...DEFAULT_SEED_FOLDERS];
  } catch (e) {
    driveFiles = [...DEFAULT_SEED_FILES];
    driveFolders = [...DEFAULT_SEED_FOLDERS];
  }

  function saveState() {
    try {
      localStorage.setItem('skyline_cloud_files', JSON.stringify(driveFiles));
      localStorage.setItem('skyline_cloud_folders', JSON.stringify(driveFolders));
    } catch (e) {
      console.warn('Storage quota exceeded in browser localStorage');
    }
    updateQuota();
  }

  // Active view states
  let currentFolder = '/';
  let currentFilter = 'all'; // 'all', 'starred', 'vault', 'recent', 'trash'
  let currentSearch = '';
  let viewMode = 'grid'; // 'grid' or 'list'
  let activeSelectedFile = null;

  // DOM Elements
  const filesGrid = document.getElementById('filesGrid');
  const filesTable = document.getElementById('filesTable');
  const filesTableContainer = document.getElementById('filesTableContainer');
  const foldersGrid = document.getElementById('foldersGrid');
  const foldersSection = document.getElementById('foldersSection');
  const breadcrumbContainer = document.getElementById('breadcrumbContainer');
  const searchInput = document.getElementById('searchInput');
  const quotaFill = document.getElementById('quotaFill');
  const quotaPctText = document.getElementById('quotaPctText');
  const quotaUsedText = document.getElementById('quotaUsedText');
  const newFolderModal = document.getElementById('newFolderModal');
  const fileDetailsModal = document.getElementById('fileDetailsModal');
  const uploadProgressModal = document.getElementById('uploadProgressModal');
  const hiddenFileInput = document.getElementById('hiddenFileInput');
  const dropzoneBanner = document.getElementById('dropzoneBanner');

  // Helper: Format bytes
  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Helper: Get file type category
  function getFileTypeInfo(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'sql':
      case 'php':
      case 'js':
      case 'json':
      case 'html':
      case 'css':
      case 'yml':
      case 'yaml':
      case 'sh':
      case 'conf':
        return { type: 'code', ext: ext.toUpperCase() };
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'webp':
      case 'gif':
        return { type: 'img', ext: ext.toUpperCase() };
      case 'zip':
      case 'tar':
      case 'gz':
      case '7z':
      case 'rar':
        return { type: 'zip', ext: ext.toUpperCase() };
      case 'pem':
      case 'key':
      case 'crt':
        return { type: 'sec', ext: 'KEY' };
      default:
        return { type: 'doc', ext: ext.toUpperCase().slice(0, 4) || 'FILE' };
    }
  }

  // Helper: Pseudo SHA-256 for mock preview
  function generateMockSha(filename) {
    let hash = 0;
    for (let i = 0; i < filename.length; i++) {
      hash = (hash << 5) - hash + filename.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex}e49b81a2f6081c74d659a2feaac55ad015a3bf4f1b2b0b822cd15d6c`;
  }

  // Update Quota display
  function updateQuota() {
    const totalBytes = driveFiles.reduce((acc, f) => acc + (f.size || 0), 0);
    const maxQuota = 100 * 1024 * 1024 * 1024; // 100 GB
    const baseUsed = 34 * 1024 * 1024 * 1024; // 34 GB base cloud allocation
    const totalUsed = baseUsed + totalBytes;
    const pct = Math.min(100, ((totalUsed / maxQuota) * 100).toFixed(1));

    if (quotaFill) quotaFill.style.width = `${pct}%`;
    if (quotaPctText) quotaPctText.textContent = `${pct}%`;
    if (quotaUsedText) quotaUsedText.textContent = `${(totalUsed / (1024 * 1024 * 1024)).toFixed(1)} GB`;

    // Update navigation count badges
    const starredCount = driveFiles.filter((f) => f.starred).length;
    const vaultCount = driveFiles.filter((f) => f.type === 'sec' || f.category === 'vault').length;
    const badgeAll = document.getElementById('badgeAll');
    const badgeStarred = document.getElementById('badgeStarred');
    const badgeVault = document.getElementById('badgeVault');

    if (badgeAll) badgeAll.textContent = driveFiles.length;
    if (badgeStarred) badgeStarred.textContent = starredCount;
    if (badgeVault) badgeVault.textContent = vaultCount;
  }

  // Render Breadcrumbs
  function renderBreadcrumbs() {
    if (!breadcrumbContainer) return;

    if (currentFilter !== 'all') {
      const labels = {
        starred: '⭐ Starred Files',
        vault: '🔒 Private Security Vault',
        recent: '🕒 Recent Activity',
        trash: '🗑️ Trash'
      };
      breadcrumbContainer.innerHTML = `
        <div class="breadcrumb-item" onclick="SkyLineCloud.switchFilter('all')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          Root
        </div>
        <span class="breadcrumb-sep">/</span>
        <div class="breadcrumb-item current">${labels[currentFilter] || currentFilter}</div>
      `;
      return;
    }

    const parts = currentFolder.split('/').filter(Boolean);
    let html = `
      <div class="breadcrumb-item" onclick="SkyLineCloud.navigateToFolder('/')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
        Root
      </div>
    `;

    let accumulated = '';
    parts.forEach((p, idx) => {
      accumulated += `/${p}`;
      const isLast = idx === parts.length - 1;
      html += `
        <span class="breadcrumb-sep">/</span>
        <div class="breadcrumb-item ${isLast ? 'current' : ''}" ${!isLast ? `onclick="SkyLineCloud.navigateToFolder('${accumulated}')"` : ''}>
          ${p}
        </div>
      `;
    });

    breadcrumbContainer.innerHTML = html;
  }

  // Filter items based on active folder, category filter, and search text
  function getFilteredItems() {
    let files = [...driveFiles];
    let folders = [...driveFolders];

    if (currentFilter === 'starred') {
      files = files.filter((f) => f.starred);
      folders = [];
    } else if (currentFilter === 'vault') {
      files = files.filter((f) => f.type === 'sec' || f.category === 'vault' || f.folder === '/Security');
      folders = folders.filter((fol) => fol.name === 'Security');
    } else if (currentFilter === 'recent') {
      files.sort((a, b) => b.modified.localeCompare(a.modified));
      folders = [];
    } else {
      // 'all' folder view
      files = files.filter((f) => f.folder === currentFolder);
      folders = folders.filter((fol) => fol.parent === currentFolder);
    }

    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase();
      files = files.filter((f) => f.name.toLowerCase().includes(q));
      folders = folders.filter((fol) => fol.name.toLowerCase().includes(q));
    }

    return { files, folders };
  }

  // Render Folders & Files
  function renderDrive() {
    renderBreadcrumbs();
    const { files, folders } = getFilteredItems();

    // Folders section
    if (foldersSection && foldersGrid) {
      if (folders.length === 0) {
        foldersSection.style.display = 'none';
      } else {
        foldersSection.style.display = 'block';
        foldersGrid.innerHTML = folders.map((fol) => {
          const count = driveFiles.filter((f) => f.folder === `${fol.parent === '/' ? '' : fol.parent}/${fol.name}`).length;
          return `
            <div class="folder-card" onclick="SkyLineCloud.navigateToFolder('${fol.parent === '/' ? '' : fol.parent}/${fol.name}')">
              <div class="folder-meta">
                <div class="folder-icon" style="color: ${fol.color || '#38bdf8'}">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div>
                  <div class="folder-name">${fol.name}</div>
                  <div class="folder-count">${count} ${count === 1 ? 'item' : 'items'}</div>
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--subtle)"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          `;
        }).join('');
      }
    }

    // Files section
    if (filesGrid && filesTable) {
      if (files.length === 0 && folders.length === 0) {
        filesGrid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            </div>
            <h3>No files found</h3>
            <p>Drag and drop files here or click "Upload File" to store in this cloud folder.</p>
          </div>
        `;
        filesTable.innerHTML = '';
        return;
      }

      // Grid View Cards
      filesGrid.innerHTML = files.map((file) => `
        <div class="file-card" onclick="SkyLineCloud.openDetails('${file.id}')">
          <div class="file-card-top">
            <div class="file-type-icon type-${file.type}">
              ${file.ext}
            </div>
            <div class="file-quick-actions" onclick="event.stopPropagation()">
              <button class="star-btn ${file.starred ? 'starred' : ''}" onclick="SkyLineCloud.toggleStar('${file.id}')" title="Star file">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${file.starred ? '#fbbf24' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </button>
            </div>
          </div>
          <div>
            <div class="file-name" title="${file.name}">${file.name}</div>
            <div class="file-meta-row">
              <span>${formatBytes(file.size)}</span>
              <span>${file.modified.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      `).join('');

      // Table View Rows
      const tableBody = files.map((file) => `
        <tr onclick="SkyLineCloud.openDetails('${file.id}')">
          <td>
            <div class="table-file-name">
              <span class="file-type-icon type-${file.type}" style="width:28px;height:28px;font-size:10px;border-radius:7px;">${file.ext}</span>
              <span>${file.name}</span>
            </div>
          </td>
          <td style="font-family:var(--font-mono);font-size:12.5px;">${file.ext}</td>
          <td style="font-family:var(--font-mono);font-size:12.5px;">${formatBytes(file.size)}</td>
          <td style="color:var(--muted);">${file.modified}</td>
          <td onclick="event.stopPropagation()">
            <button class="star-btn ${file.starred ? 'starred' : ''}" onclick="SkyLineCloud.toggleStar('${file.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${file.starred ? '#fbbf24' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </button>
          </td>
        </tr>
      `).join('');

      filesTable.innerHTML = `
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Last Modified</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${tableBody}
        </tbody>
      `;
    }
  }

  // Public Interface for SkyLineCloud
  window.SkyLineCloud = {
    navigateToFolder(path) {
      currentFolder = path;
      currentFilter = 'all';
      this.updateActiveNav();
      renderDrive();
    },

    switchFilter(filter) {
      currentFilter = filter;
      this.updateActiveNav();
      renderDrive();
    },

    updateActiveNav() {
      const items = document.querySelectorAll('.cloud-nav-item');
      items.forEach((item) => {
        const itemFilter = item.getAttribute('data-filter');
        if (itemFilter === currentFilter) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    },

    toggleStar(fileId) {
      const file = driveFiles.find((f) => f.id === fileId);
      if (file) {
        file.starred = !file.starred;
        saveState();
        renderDrive();
      }
    },

    switchView(mode) {
      viewMode = mode;
      const btnGrid = document.getElementById('viewBtnGrid');
      const btnList = document.getElementById('viewBtnList');

      if (mode === 'grid') {
        if (filesGrid) filesGrid.style.display = 'grid';
        if (filesTableContainer) filesTableContainer.style.display = 'none';
        if (btnGrid) btnGrid.classList.add('active');
        if (btnList) btnList.classList.remove('active');
      } else {
        if (filesGrid) filesGrid.style.display = 'none';
        if (filesTableContainer) filesTableContainer.style.display = 'block';
        if (btnList) btnList.classList.add('active');
        if (btnGrid) btnGrid.classList.remove('active');
      }
    },

    openNewFolderModal() {
      if (newFolderModal) {
        newFolderModal.classList.add('open');
        const input = document.getElementById('newFolderNameInput');
        if (input) {
          input.value = '';
          input.focus();
        }
      }
    },

    closeNewFolderModal() {
      if (newFolderModal) newFolderModal.classList.remove('open');
    },

    submitNewFolder() {
      const input = document.getElementById('newFolderNameInput');
      const name = input ? input.value.trim() : '';
      if (!name) return;

      const newId = `fol-${Date.now()}`;
      driveFolders.push({
        id: newId,
        name: name,
        parent: currentFolder,
        color: '#60a5fa'
      });

      saveState();
      this.closeNewFolderModal();
      renderDrive();
    },

    triggerUpload() {
      if (hiddenFileInput) hiddenFileInput.click();
    },

    handleFilesSelected(files) {
      if (!files || !files.length) return;

      const progressBox = document.getElementById('uploadProgressPercent');
      const progressBar = document.getElementById('uploadProgressBarFill');
      const progressFileName = document.getElementById('uploadProgressFileName');

      if (uploadProgressModal) uploadProgressModal.classList.add('open');
      if (progressFileName) progressFileName.textContent = files.length === 1 ? files[0].name : `${files.length} files`;

      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressBox) progressBox.textContent = `${progress}%`;

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (uploadProgressModal) uploadProgressModal.classList.remove('open');

            // Add files to state
            Array.from(files).forEach((f) => {
              const info = getFileTypeInfo(f.name);
              driveFiles.unshift({
                id: `f-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                name: f.name,
                folder: currentFolder,
                size: f.size || 1048576,
                type: info.type,
                ext: info.ext,
                starred: false,
                modified: new Date().toISOString().slice(0, 16).replace('T', ' '),
                sha256: generateMockSha(f.name),
                category: 'upload'
              });
            });

            saveState();
            renderDrive();
          }, 400);
        }
      }, 120);
    },

    openDetails(fileId) {
      const file = driveFiles.find((f) => f.id === fileId);
      if (!file) return;
      activeSelectedFile = file;

      const nameEl = document.getElementById('detailFileName');
      const typeEl = document.getElementById('detailFileType');
      const sizeEl = document.getElementById('detailFileSize');
      const pathEl = document.getElementById('detailFilePath');
      const modEl = document.getElementById('detailFileModified');
      const shaEl = document.getElementById('detailFileSha');

      if (nameEl) nameEl.textContent = file.name;
      if (typeEl) typeEl.textContent = file.ext;
      if (sizeEl) sizeEl.textContent = formatBytes(file.size);
      if (pathEl) pathEl.textContent = `${file.folder === '/' ? '' : file.folder}/${file.name}`;
      if (modEl) modEl.textContent = file.modified;
      if (shaEl) shaEl.textContent = file.sha256.slice(0, 24) + '...';

      if (fileDetailsModal) fileDetailsModal.classList.add('open');
    },

    closeDetails() {
      if (fileDetailsModal) fileDetailsModal.classList.remove('open');
      activeSelectedFile = null;
    },

    downloadActiveFile() {
      if (!activeSelectedFile) return;
      // Generate client-side text blob download
      const content = `SkyLine Hub Private Cloud Storage\n=================================\nFile: ${activeSelectedFile.name}\nSize: ${activeSelectedFile.size} bytes\nSHA-256: ${activeSelectedFile.sha256}\nEncryption: AES-256-GCM Verified\nTimestamp: ${new Date().toISOString()}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeSelectedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    deleteActiveFile() {
      if (!activeSelectedFile) return;
      driveFiles = driveFiles.filter((f) => f.id !== activeSelectedFile.id);
      saveState();
      this.closeDetails();
      renderDrive();
    },

    toggleSidebar() {
      const sidebar = document.querySelector('.cloud-sidebar');
      if (sidebar) sidebar.classList.toggle('open');
    }
  };

  // Setup Event Listeners
  document.addEventListener('DOMContentLoaded', () => {
    // Search input handler
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderDrive();
      });

      // Keyboard shortcut Ctrl+K
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }

    // Hidden file input change
    if (hiddenFileInput) {
      hiddenFileInput.addEventListener('change', (e) => {
        SkyLineCloud.handleFilesSelected(e.target.files);
        hiddenFileInput.value = '';
      });
    }

    // Drag and drop overlay
    if (dropzoneBanner) {
      dropzoneBanner.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzoneBanner.classList.add('dragover');
      });

      dropzoneBanner.addEventListener('dragleave', () => {
        dropzoneBanner.classList.remove('dragover');
      });

      dropzoneBanner.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzoneBanner.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files) {
          SkyLineCloud.handleFilesSelected(e.dataTransfer.files);
        }
      });
    }

    // Initialize quota and render
    updateQuota();
    renderDrive();
  });
})();
