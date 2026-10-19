/**
 * BASITHA NINDUWARA FERNANDO — ULTIMATE DEVELOPER PORTFOLIO ENGINE
 * Interactive Systems, WebGL Three.js hooks, Audio Synthesis, CLI Terminal & Workflows
 */

(function () {
  'use strict';

  // State Management
  const state = {
    audioEnabled: false,
    currentRoleIndex: 0,
    activeSkillCategory: 'all',
    activeProjectCategory: 'all',
    activePipelineStep: 0,
    rpaSimRunning: false,
    fivemOnline: true,
  };

  // DOM Content Loaded Initializer
  document.addEventListener('DOMContentLoaded', () => {
    initBootloader();
    initAudioSystem();
    initCustomCursor();
    initRoleTypewriter();
    initSectionScrollspy();
    initParticleCanvas();
    initHeroMiniTerminal();
    initSkillsFilterAndSearch();
    initProjectsSystem();
    initFiveMShowcase();
    initAutomationPipeline();
    initRpaSimulator();
    initContactForm();
    initModalsAndShortcuts();
    initCyberChatbot();
  });

  /* =============================================================================
   * 1. SYSTEM BOOTLOADER
   * ============================================================================= */
  function initBootloader() {
    const bootloader = document.getElementById('system-bootloader');
    const progressBar = document.getElementById('bootloader-progress');
    const logsContainer = document.getElementById('bootloader-logs');
    if (!bootloader) return;

    const logMessages = [
      { text: '> [OK] BIOS Kernel Initialized (v4.8)', class: 'log-cyan' },
      { text: '> [OK] Initializing Neural HUD & Canvas Engine...', class: 'log-purple' },
      { text: '> [OK] Loading Three.js WebGL & GLTF Subsystems...', class: 'log-cyan' },
      { text: '> [OK] Mounting Architecture Modules (Full-Stack, RPA, FiveM)...', class: 'log-green' },
      { text: '> [SYS_READY] Welcome, Operator. Basitha Ninduwara Fernando Portfolio Online.', class: 'log-green' }
    ];

    let currentLog = 0;
    let progress = 10;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 15;
      if (progress > 100) progress = 100;
      if (progressBar) progressBar.style.width = progress + '%';

      if (currentLog < logMessages.length && logsContainer) {
        const p = document.createElement('div');
        p.className = logMessages[currentLog].class || '';
        p.textContent = logMessages[currentLog].text;
        logsContainer.appendChild(p);
        currentLog++;
      }

      if (progress >= 100 && currentLog >= logMessages.length) {
        clearInterval(interval);
        setTimeout(() => {
          bootloader.classList.add('boot-complete');
          playAudio('success');
        }, 350);
      }
    }, 140);
  }

  /* =============================================================================
   * 2. PROCEDURAL WEB AUDIO SYNTHESIZER
   * ============================================================================= */
  let audioCtx = null;

  function initAudioSystem() {
    const audioBtn = document.getElementById('btnToggleAudio');
    const savedAudio = localStorage.getItem('basitha_audio_enabled');
    state.audioEnabled = savedAudio === 'true';

    if (audioBtn) {
      updateAudioButtonState(audioBtn);
      audioBtn.addEventListener('click', () => {
        state.audioEnabled = !state.audioEnabled;
        localStorage.setItem('basitha_audio_enabled', state.audioEnabled);
        updateAudioButtonState(audioBtn);
        if (state.audioEnabled) {
          ensureAudioContext();
          playAudio('success');
          showToast('Cyber Audio: ENABLED');
        } else {
          showToast('Cyber Audio: MUTED');
        }
      });
    }

    // Attach sound feedback to all interactive cyber buttons
    document.querySelectorAll('.cyber-btn, .skill-tab-btn, .project-filter-btn, .flow-step-node, .hud-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => playAudio('hover'));
      btn.addEventListener('click', () => playAudio('click'));
    });
  }

  function updateAudioButtonState(btn) {
    if (state.audioEnabled) {
      btn.classList.add('active');
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Audio: ON`;
    } else {
      btn.classList.remove('active');
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg> Audio: MUTED`;
    }
  }

  function ensureAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playAudio(type) {
    if (!state.audioEnabled) return;
    ensureAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.045);
      } else if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(680, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.19);
      } else if (type === 'modal') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.15);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.21);
      }
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  }

  /* =============================================================================
   * 3. CUSTOM CYBER CURSOR
   * ============================================================================= */
  function initCustomCursor() {
    const dot = document.querySelector('.custom-cursor-dot');
    const ring = document.querySelector('.custom-cursor-ring');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    // Hover state over interactive elements
    const interactiveSelectors = 'a, button, input, textarea, select, .skill-card, .project-card, .specialty-card, .flow-step-node, .hud-btn';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* =============================================================================
   * 4. ROTATING ROLES TYPEWRITER
   * ============================================================================= */
  function initRoleTypewriter() {
    const roleElem = document.getElementById('heroRoleText');
    if (!roleElem) return;

    const roles = [
      'Full-Stack Software Developer',
      'RPA Automation Developer',
      'UiPath Developer',
      'Power Apps Developer',
      'FiveM Full-Stack Developer',
      'Game Server Developer',
      'DevOps & Infrastructure Enthusiast'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function type() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        roleElem.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 35;
      } else {
        roleElem.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 75;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        typingSpeed = 2200; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 450; // Pause before typing new word
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  /* =============================================================================
   * 5. SECTION SCROLLSPY & SCROLL PROGRESS
   * ============================================================================= */
  function initSectionScrollspy() {
    const navHeader = document.querySelector('.nav-header');
    const scrollBar = document.querySelector('.scroll-progress-bar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hudDots = document.querySelectorAll('.hud-dot');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollY / docHeight) * 100;

      // Update top progress bar
      if (scrollBar) {
        scrollBar.style.width = `${scrollPercent}%`;
      }

      // Sticky header class
      if (navHeader) {
        if (scrollY > 60) {
          navHeader.classList.add('scrolled');
        } else {
          navHeader.classList.remove('scrolled');
        }
      }

      // Active Section Highlighting
      let currentSectionId = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          }
        });

        hudDots.forEach(dot => {
          dot.classList.remove('active');
          if (dot.getAttribute('data-section') === currentSectionId) {
            dot.classList.add('active');
          }
        });
      }
    });

    // Mobile nav toggle
    const mobileBtn = document.getElementById('mobileNavToggle');
    const navLinksContainer = document.querySelector('.nav-links');
    if (mobileBtn && navLinksContainer) {
      mobileBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('mobile-open');
      });
      // Close on link click
      navLinksContainer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          navLinksContainer.classList.remove('mobile-open');
        });
      });
    }
  }

  /* =============================================================================
   * 6. HIGH PERFORMANCE PARTICLE CANVAS
   * ============================================================================= */
  function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const count = Math.min(Math.floor((width * height) / 18000), 70);
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.45 ? 'rgba(0, 240, 255,' : 'rgba(157, 78, 221,';
        this.alpha = Math.random() * 0.45 + 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Proximity push
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= Math.cos(angle) * force * 1.6;
            this.y -= Math.sin(angle) * force * 1.6;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Connect lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 125) {
            const alpha = (1 - dist / 125) * 0.18;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* =============================================================================
   * 7. HERO CODE TERMINAL & INTERACTIVE CLI
   * ============================================================================= */
  function initHeroMiniTerminal() {
    const input = document.getElementById('heroTerminalInput');
    const outputContainer = document.getElementById('heroTerminalOutput');
    if (input && outputContainer) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = input.value.trim().toLowerCase();
          if (!cmd) return;
          executeTerminalCommand(cmd, outputContainer);
          input.value = '';
        }
      });
    }

    const modalInput = document.getElementById('modalTerminalInput');
    const modalOutput = document.getElementById('modalTerminalOutput');
    if (modalInput && modalOutput) {
      modalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = modalInput.value.trim().toLowerCase();
          if (!cmd) return;
          executeTerminalCommand(cmd, modalOutput);
          modalInput.value = '';
        }
      });
    }
  }

  function executeTerminalCommand(cmd, container) {
    playAudio('click');
    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="term-prompt">$</span> <span class="term-cmd">${escapeHtml(cmd)}</span>`;
    container.appendChild(userLine);

    const resLine = document.createElement('div');
    resLine.className = 'term-line';

    switch (cmd) {
      case 'help':
        resLine.innerHTML = `<span class="term-ok">> Available:</span> <span class="term-val">skills, projects, fivem, rpa, contact, cv, clear, matrix</span>`;
        break;
      case 'skills':
        resLine.innerHTML = `<span class="term-ok">> Stack:</span> <span class="term-val">PHP/Laravel, MySQL, SQL Server, UiPath, Power Apps, Docker, Linux, Lua, Qbox/QBCore</span>`;
        break;
      case 'projects':
        resLine.innerHTML = `<span class="term-ok">> Featured:</span> <span class="term-val">Enterprise RPA Platform, PAKE FiveM Server, Business ERP, Automation Monitor</span>`;
        break;
      case 'fivem':
        resLine.innerHTML = `<span class="term-ok">> PAKE FiveM:</span> <span class="term-val">Qbox/QBCore, ox_lib, custom NUI, 64Hz tick rate, low latency MariaDB</span>`;
        break;
      case 'rpa':
        resLine.innerHTML = `<span class="term-ok">> RPA Engine:</span> <span class="term-val">UiPath Studio/Orchestrator, Unattended Bots, REFramework, 99.9% Queue Success</span>`;
        break;
      case 'cv':
        openCvModal();
        resLine.innerHTML = `<span class="term-ok">> [SYSTEM] Opening CV Viewer Modal...</span>`;
        break;
      case 'contact':
        resLine.innerHTML = `<span class="term-ok">> Contact:</span> <span class="term-val">Scroll to #contact or use mailto:basitha.fernando@example.com</span>`;
        break;
      case 'clear':
        container.innerHTML = '';
        return;
      case 'matrix':
        triggerMatrixEffect();
        resLine.innerHTML = `<span class="term-ok">> [CYBER_OVERRIDE] Wake up, Neo... Matrix mode engaged.</span>`;
        break;
      default:
        resLine.innerHTML = `<span style="color:#ef4444;">> Command not recognized. Type 'help' for available commands.</span>`;
    }

    container.appendChild(resLine);
    container.scrollTop = container.scrollHeight;
  }

  function triggerMatrixEffect() {
    const origBodyBg = document.body.style.backgroundColor;
    document.body.style.boxShadow = 'inset 0 0 100px rgba(0, 255, 136, 0.4)';
    setTimeout(() => {
      document.body.style.boxShadow = '';
    }, 2500);
    showToast('Matrix Protocol Engaged');
  }

  /* =============================================================================
   * 8. TECHNICAL SKILLS FILTER & LIVE SEARCH
   * ============================================================================= */
  function initSkillsFilterAndSearch() {
    const tabs = document.querySelectorAll('.skill-tab-btn');
    const searchInput = document.getElementById('skillSearchInput');
    const skillCards = document.querySelectorAll('.skill-card');
    const countDisplay = document.getElementById('skillsCountBadge');

    function filterSkills() {
      const activeTab = document.querySelector('.skill-tab-btn.active');
      const category = activeTab ? activeTab.getAttribute('data-category') : 'all';
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();

      let visibleCount = 0;

      skillCards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        const cardName = (card.querySelector('.skill-name')?.textContent || '').toLowerCase();

        const matchesCat = (category === 'all' || cardCat.includes(category));
        const matchesQuery = (!query || cardName.includes(query) || cardCat.toLowerCase().includes(query));

        if (matchesCat && matchesQuery) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countDisplay) {
        countDisplay.textContent = `${visibleCount} Skills Displayed`;
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        playAudio('click');
        filterSkills();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        filterSkills();
      });
    }

    // Initial count
    filterSkills();
  }

  /* =============================================================================
   * 9. PROJECTS SYSTEM & ARCHITECTURE MODAL
   * ============================================================================= */
  const projectsData = {
    'rpa-platform': {
      title: 'Enterprise RPA Automation Platform',
      category: 'RPA & Enterprise Automation',
      stack: ['UiPath Studio', 'UiPath Orchestrator', 'SQL Server', 'REST APIs', 'Power Automate'],
      overview: 'End-to-end robotic process automation platform designed for enterprise workflow execution. Built using the UiPath Robotic Enterprise Framework (REFramework) to process hundreds of daily transaction queue items with comprehensive retry policies, state machine architecture, and business exception isolation.',
      architecture: [
        'Dispatcher Component: Scheduled robot scans incoming enterprise emails, SAP export drops, and ERP webhooks to validate payloads and dispatch Transaction Items to UiPath Orchestrator Queues.',
        'Performer Component: Distributed unattended robots consume queued transactions, execute multi-system data entry (CRM, legacy Win32, and web portals), and commit transactional audits into SQL Server.',
        'Error Handling & Retry: Automated self-healing with exponential backoff on network timeouts, capturing desktop screenshot snapshots and alerting DevOps via Microsoft Teams webhook upon business exceptions.'
      ],
      metrics: 'Eliminated 18+ hours of repetitive manual data entry per week with 99.8% transactional accuracy across 45,000+ queue items processed.'
    },
    'business-webapp': {
      title: 'Full-Stack Business Web Application',
      category: 'Full-Stack Web Development',
      stack: ['PHP 8.2', 'Laravel', 'MySQL 8', 'RESTful API', 'Tailored CSS', 'JavaScript'],
      overview: 'Production-ready operational platform designed for enterprise resource management, role-based access control (RBAC), and automated business reporting.',
      architecture: [
        'Secure Backend: Strict MVC separation with Laravel Eloquent ORM, parameterized queries, CSRF token validation, rate-limiting middleware, and hashed password credentials.',
        'API Architecture: RESTful endpoints consumed by administrative modules and mobile clients with JSON schema validation.',
        'Database Optimization: Indexed foreign key relations, partitioned operational audit logs, and optimized MySQL views for complex analytical aggregation.'
      ],
      metrics: 'Sub-40ms database query response time with scalable multi-tenant architecture and automated session security.'
    },
    'docker-deployment': {
      title: 'Dockerized Web Application Deployment',
      category: 'DevOps & Server Administration',
      stack: ['Docker', 'Docker Compose', 'Nginx', 'PHP-FPM', 'MySQL', 'Ubuntu Linux', 'Certbot SSL'],
      overview: 'High-availability containerized hosting infrastructure automating deployment of web apps with isolated networking, SSL termination, and resource constraints.',
      architecture: [
        'Multi-Container Stack: Composed of Nginx reverse proxy, PHP-FPM execution container, isolated MySQL service, and Redis caching tier.',
        'Security Hardening: Non-root container execution, read-only root filesystems, automated Let’s Encrypt Certbot SSL renewal cron jobs, and UFW firewall configuration.',
        'DevOps CI/CD: Automated git hook pipelines executing tests, building optimized images, and performing zero-downtime container updates.'
      ],
      metrics: 'Zero-downtime rolling deploys, 99.98% server uptime, and reproducible container images for local and production staging.'
    },
    'automation-dashboard': {
      title: 'Automation Monitoring Dashboard',
      category: 'RPA & Full-Stack',
      stack: ['PHP', 'JavaScript', 'UiPath Orchestrator API', 'SQL Server', 'Chart.js', 'WebSockets'],
      overview: 'Real-time telemetry and health monitoring portal tracking robot job executions, queue turnaround time, system performance, and exception breakdowns.',
      architecture: [
        'Telemetry Harvester: Scheduled workers poll UiPath Orchestrator REST APIs and SQL transactional tables to compute rolling MTTR and success rates.',
        'Live UI Dashboard: High-contrast dashboard with live status indicators, throughput charts, and instant queue item inspection.',
        'Incident Dispatcher: Triggers automated SMS and Discord notifications when queue latency exceeds SLA thresholds.'
      ],
      metrics: 'Reduced incident resolution time by 65% by surfacing robot failure reasons and stack traces immediately.'
    },
    'pake-fivem': {
      title: 'PAKE FiveM Gaming Server',
      category: 'FiveM Game Development',
      stack: ['Lua 5.4', 'Qbox Framework', 'QBCore', 'ox_lib', 'ox_inventory', 'MariaDB', 'txAdmin'],
      overview: 'Custom GTA V FiveM multiplayer server featuring bespoke roleplay systems, balanced economies, low-latency client scripts, and custom NUI game interfaces.',
      architecture: [
        'Core Engine: Qbox / QBCore hybrid framework utilizing ox_lib for ultra-optimized native invoking and decoupled resource dependencies.',
        'Database Pipeline: Async MariaDB connections with prepared statements preventing server hitching and ensuring sub-5ms query resolution.',
        'Security & Anticheat: Client-side event obfuscation, server-side parameter authorization, and automated txAdmin player backups.'
      ],
      metrics: 'Stable 64-tick performance with 0.02ms client resmon usage across 80+ simultaneous players.'
    },
    'fivem-admin-dashboard': {
      title: 'FiveM Custom Admin Dashboard',
      category: 'FiveM & Web Development',
      stack: ['PHP', 'MySQL', 'REST API', 'JavaScript', 'txAdmin API', 'Discord OAuth2'],
      overview: 'Web-based administration suite bridging real-time game server data with web management. Allows administrators to inspect player records, manage bans, view inventories, and execute server commands remotely.',
      architecture: [
        'Bi-directional Sync: Web portal communicates with live FiveM server through secure authenticated HTTP endpoints and txAdmin RPC.',
        'Role-Based Staff Access: Discord OAuth2 login with server role verification to restrict sensitive administrative actions.',
        'Live Auditing: All staff actions, player kicks, and item spawns are logged into MariaDB with discord webhook forwarding.'
      ],
      metrics: 'Managed 5,000+ player identities with real-time inventory inspection and instantaneous command dispatch.'
    },
    'fivem-nui': {
      title: 'Custom FiveM NUI Systems',
      category: 'FiveM & Frontend Development',
      stack: ['HTML5', 'CSS3', 'JavaScript', 'Lua NUI Callbacks', 'Web Audio API'],
      overview: 'Bespoke in-game graphical user interfaces (NUI) including interactive vehicle dealership catalogs, custom banking portals, dynamic speedometers, and inventory overlays.',
      architecture: [
        'NUI Messaging Bridge: Low-latency JSON message exchange between FiveM client Lua and browser runtime using `SendNUIMessage` and `RegisterNUICallback`.',
        'Responsive Cyber UI: Cyberpunk-styled glassmorphic panels rendered with hardware acceleration at 60+ FPS inside GTA V game engine.',
        'Sound & Haptic Feedback: Procedural UI sounds integrated using Web Audio API for immersive interaction.'
      ],
      metrics: 'Zero frame-rate drop when opening complex in-game menus, compliant with FiveM CEF memory constraints.'
    }
  };

  function initProjectsSystem() {
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playAudio('click');

        const cat = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
          const cardCat = card.getAttribute('data-category') || '';
          if (cat === 'all' || cardCat.includes(cat)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Architecture Modal Trigger
    document.querySelectorAll('.project-arch-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = link.getAttribute('data-project');
        openProjectModal(projectId);
      });
    });
  }

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    playAudio('modal');
    const modal = document.getElementById('projectArchModal');
    const titleEl = document.getElementById('modalProjectTitle');
    const bodyEl = document.getElementById('modalProjectBody');
    if (!modal || !titleEl || !bodyEl) return;

    titleEl.textContent = data.title;

    let archHtml = data.architecture.map(a => `<li style="margin-bottom:8px;">${a}</li>`).join('');
    let stackHtml = data.stack.map(s => `<span class="spec-tag" style="margin-right:6px; margin-bottom:6px; display:inline-block;">${s}</span>`).join('');

    bodyEl.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span class="hud-pill-tag">${data.category}</span>
      </div>
      <div style="margin-bottom: 20px;">
        <h4 style="font-family:var(--font-display); color:#fff; font-size:1.1rem; margin-bottom:8px;">System Overview</h4>
        <p style="color:var(--text-muted); line-height:1.7;">${data.overview}</p>
      </div>
      <div style="margin-bottom: 20px;">
        <h4 style="font-family:var(--font-display); color:#fff; font-size:1.1rem; margin-bottom:8px;">Technology Stack</h4>
        <div style="display:flex; flex-wrap:wrap;">${stackHtml}</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h4 style="font-family:var(--font-display); color:#fff; font-size:1.1rem; margin-bottom:8px;">Architecture & Design Decisions</h4>
        <ul style="color:var(--text-muted); padding-left:20px; line-height:1.7;">${archHtml}</ul>
      </div>
      <div style="background:rgba(0, 240, 255, 0.05); border:1px solid var(--border-subtle); border-radius:8px; padding:16px;">
        <h4 style="font-family:var(--font-mono); color:var(--cyan); font-size:0.85rem; text-transform:uppercase; margin-bottom:6px;">Performance & Reliability Impact</h4>
        <p style="color:#ffffff; font-size:0.92rem;">${data.metrics}</p>
      </div>
    `;

    modal.classList.add('active');
  }

  /* =============================================================================
   * 10. FIVEM SHOWCASE & LIVE SERVER MONITOR
   * ============================================================================= */
  function initFiveMShowcase() {
    // Live Server Status Simulation with realistic ping jitter
    const pingEl = document.getElementById('fivemPingDisplay');
    const playersEl = document.getElementById('fivemPlayersDisplay');

    if (pingEl) {
      setInterval(() => {
        const ping = Math.floor(Math.random() * 8) + 14; // 14-22ms
        pingEl.textContent = `${ping} ms (Ultra-Low)`;
      }, 3000);
    }

    if (playersEl) {
      setInterval(() => {
        const jitter = Math.floor(Math.random() * 5) - 2;
        let count = 48 + jitter;
        playersEl.textContent = `${count} / 128 Active Slots`;
      }, 7000);
    }
  }

  /* =============================================================================
   * 11. AUTOMATION & RPA INTERACTIVE PIPELINE
   * ============================================================================= */
  const pipelineStepsData = [
    {
      title: 'Stage 1: Business Request Ingestion',
      system: 'Outlook Email, Webhooks, Scheduled Triggers, Power Automate',
      tech: 'JSON Payloads, MimeMessage Parser, Regex Tokenization',
      details: 'The workflow initiates when an enterprise document or trigger is ingested. The Dispatcher robot validates attachment extensions, verifies sender permissions against Active Directory, and extracts high-priority business metadata before creating an Orchestrator Queue Item.'
    },
    {
      title: 'Stage 2: UiPath Robot Queue Orchestration',
      system: 'UiPath Orchestrator, Dispatcher & Performer REFramework',
      tech: 'Transactional Queues, In-Memory Assets, Encrypted Credentials',
      details: 'Items enter the processing queue where unattended robots acquire item locks. The REFramework state machine handles Init, Get Transaction Data, Process Transaction, and End Process, maintaining strict exception handling boundaries and transaction isolation.'
    },
    {
      title: 'Stage 3: Enterprise API & Database Transactions',
      system: 'SQL Server Stored Procedures, REST / SOAP Web Services',
      tech: 'Parameterized SQL, OAuth 2.0 Client Credentials, JSON Schema Validation',
      details: 'The robot communicates with backend services using authenticated REST APIs or direct database stored procedures. Atomic SQL transactions guarantee that partial writes are rolled back if an intermittent endpoint failure occurs.'
    },
    {
      title: 'Stage 4: Core Business Systems Execution',
      system: 'SAP ERP, CRM Platforms, Legacy Win32 Desktop Applications',
      tech: 'Computer Vision, UI Selectors, Active Accessibility',
      details: 'For legacy systems lacking direct APIs, the robot navigates application UI with high-precision UI Selectors and fuzzy matching algorithms. Robust element-exist checks prevent desktop lockups.'
    },
    {
      title: 'Stage 5: Automated Audit & Reporting Dashboard',
      system: 'PowerBI, SQL Audit Tables, Automated Management Email Reports',
      tech: 'Real-time Telemetry, MTTR Tracking, SLA Compliance Logging',
      details: 'Upon completion, transaction status is written to the audit database. Daily summary reports, MTTR statistics, and executive dashboards update automatically, providing 100% transparency into process ROI and efficiency.'
    }
  ];

  function initAutomationPipeline() {
    const nodes = document.querySelectorAll('.flow-step-node');
    const inspector = document.getElementById('pipelineInspector');
    if (!nodes.length || !inspector) return;

    function selectStep(index) {
      nodes.forEach((n, i) => {
        n.classList.toggle('active', i === index);
      });

      const data = pipelineStepsData[index];
      if (!data) return;

      inspector.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
          <strong style="color:var(--cyan); font-family:var(--font-display); font-size:1.05rem;">${data.title}</strong>
          <span style="font-size:0.75rem; color:var(--emerald); background:rgba(0,255,136,0.1); padding:2px 8px; border-radius:4px; border:1px solid rgba(0,255,136,0.2);">Stage ${index + 1} of 5</span>
        </div>
        <div style="margin-bottom:8px;">
          <span class="inspector-highlight">Connected Systems:</span> ${data.system}
        </div>
        <div style="margin-bottom:8px;">
          <span class="inspector-highlight">Technology & Protocols:</span> ${data.tech}
        </div>
        <div style="color:var(--text-muted); line-height:1.65; margin-top:8px;">
          <span class="inspector-highlight">Operational Logic:</span> ${data.details}
        </div>
      `;
    }

    nodes.forEach((node, idx) => {
      node.addEventListener('click', () => {
        playAudio('click');
        selectStep(idx);
      });
    });

    // Default to step 0
    selectStep(0);
  }

  /* =============================================================================
   * 12. LIVE RPA QUEUE SIMULATOR
   * ============================================================================= */
  function initRpaSimulator() {
    const btnRun = document.getElementById('btnRunRpaSim');
    const screen = document.getElementById('rpaSimScreen');
    if (!btnRun || !screen) return;

    btnRun.addEventListener('click', () => {
      if (state.rpaSimRunning) return;
      state.rpaSimRunning = true;
      btnRun.disabled = true;
      btnRun.innerHTML = `<span class="status-ping-dot"></span> Robot Executing...`;
      playAudio('click');

      screen.innerHTML = `
        <div class="sim-log-cyan">> [SYS_INIT] Connecting to UiPath Orchestrator Production Cluster...</div>
      `;

      const simLogs = [
        { text: '> [ORCHESTRATOR] Authenticated via OAuth2 Bearer Token. Tenant: Enterprise_Automation_Prod', class: 'sim-log-cyan', delay: 400 },
        { text: '> [QUEUE_DISPATCHER] Polling queue \'INVOICE_PROCESSING_QUEUE\' for New items...', class: '', delay: 900 },
        { text: '> [QUEUE_PERFORMER] Acquired Lock on Transaction Item #TX-9042 (Priority: High)', class: 'sim-log-green', delay: 1500 },
        { text: '> [RE_FRAMEWORK] Transitioning to \'Process Transaction\' state. Parsing payload...', class: '', delay: 2000 },
        { text: '> [DATA_VALIDATION] Vendor Tax ID: Verified. Line items total $14,850.00 matches PO #8821.', class: 'sim-log-cyan', delay: 2600 },
        { text: '> [DB_ADAPTER] Executing SQL Stored Procedure `sp_CommitLedgerTransaction`...', class: '', delay: 3200 },
        { text: '> [ERP_INTEGRATION] SAP BAPI Call `BAPI_INCOMINGINVOICE_CREATE` returned SUCCESS (Doc #49001204)', class: 'sim-log-green', delay: 3900 },
        { text: '> [QUEUE_STATUS] Setting Transaction #TX-9042 Status -> SUCCESS. Duration: 1.48s (0 Exceptions)', class: 'sim-log-green', delay: 4600 },
        { text: '> [METRICS] Audit log synced. Ready for next queue item. All systems nominal.', class: 'sim-log-cyan', delay: 5200 }
      ];

      simLogs.forEach(item => {
        setTimeout(() => {
          const div = document.createElement('div');
          if (item.class) div.className = item.class;
          div.textContent = item.text;
          screen.appendChild(div);
          screen.scrollTop = screen.scrollHeight;
          playAudio('hover');
        }, item.delay);
      });

      setTimeout(() => {
        state.rpaSimRunning = false;
        btnRun.disabled = false;
        btnRun.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Run RPA Robot Simulation`;
        playAudio('success');
        showToast('RPA Queue Transaction Completed: 100% Success');
      }, 5500);
    });
  }

  /* =============================================================================
   * 13. CONTACT FORM & CLIPBOARD COPY
   * ============================================================================= */
  function initContactForm() {
    const form = document.getElementById('portfolioContactForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (document.getElementById('contactName')?.value || '').trim();
        const email = (document.getElementById('contactEmail')?.value || '').trim();
        const subject = (document.getElementById('contactSubject')?.value || '').trim();
        const msg = (document.getElementById('contactMessage')?.value || '').trim();

        if (!name || !email || !msg) {
          showToast('Please fill out all required fields.');
          playAudio('click');
          return;
        }

        // Generate mailto link
        const mailtoUrl = `mailto:basitha.fernando@example.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(`Hi Basitha,\n\n${msg}\n\nFrom: ${name} (${email})`)}`;
        
        playAudio('success');
        showToast('Opening email client...');
        window.location.href = mailtoUrl;

        form.reset();
      });
    }

    // 1-Click Copy Email to Clipboard
    const copyBtns = document.querySelectorAll('.copy-email-btn');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = 'basitha.fernando@example.com';
        navigator.clipboard.writeText(email).then(() => {
          playAudio('success');
          showToast('Email Copied to Clipboard!');
        }).catch(() => {
          showToast('Email: basitha.fernando@example.com');
        });
      });
    });
  }

  /* =============================================================================
   * 14. MODALS & GLOBAL SHORTCUTS
   * ============================================================================= */
  function initModalsAndShortcuts() {
    // Close modal handlers
    document.querySelectorAll('.cyber-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('active');
          playAudio('click');
        }
      });
    });

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.cyber-modal-backdrop');
        if (modal) {
          modal.classList.remove('active');
          playAudio('click');
        }
      });
    });

    // CV Modal Trigger Buttons
    document.querySelectorAll('.btn-open-cv').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCvModal();
      });
    });

    // Terminal Modal Trigger
    document.querySelectorAll('.btn-open-terminal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openTerminalModal();
      });
    });

    // Global keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Escape closes any open modal
      if (e.key === 'Escape') {
        document.querySelectorAll('.cyber-modal-backdrop.active').forEach(m => m.classList.remove('active'));
      }
      // Ctrl + K or ~ opens terminal
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || e.key === '`') {
        e.preventDefault();
        openTerminalModal();
      }
      // M toggles audio
      if (e.key.toLowerCase() === 'm' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        const audioBtn = document.getElementById('btnToggleAudio');
        if (audioBtn) audioBtn.click();
      }
    });
  }

  function openCvModal() {
    playAudio('modal');
    const modal = document.getElementById('cvModal');
    if (modal) modal.classList.add('active');
  }

  function openTerminalModal() {
    playAudio('modal');
    const modal = document.getElementById('terminalModal');
    if (modal) {
      modal.classList.add('active');
      const input = document.getElementById('modalTerminalInput');
      if (input) setTimeout(() => input.focus(), 100);
    }
  }

  // Toast Helper
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('cyber-toast');
    if (!toast) return;

    toast.innerHTML = `<span class="status-ping-dot"></span> <span>${escapeHtml(message)}</span>`;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  /* =============================================================================
   * 15. CYBER AI CHATBOT ENGINE ("NEXUS-AI // BASITHA COPILOT")
   * ============================================================================= */
  function initCyberChatbot() {
    const chatWidget = document.getElementById('cyberChatWidget');
    const chatTeaser = document.getElementById('chatWidgetTeaser');
    const chatBtn = document.getElementById('chatWidgetBtn');
    const chatWindow = document.getElementById('cyberChatWindow');
    const chatCloseBtn = document.getElementById('btnChatClose');
    const chatClearBtn = document.getElementById('btnChatClear');
    const chatSoundBtn = document.getElementById('btnChatSound');
    const chatMessages = document.getElementById('chatMessagesContainer');
    const chatInput = document.getElementById('chatInputField');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatChips = document.querySelectorAll('.chat-chip');

    if (!chatWindow || !chatMessages || !chatInput) return;

    let chatSoundActive = true;

    // Toggle Chat Window
    function toggleChat(open) {
      const isOpen = open !== undefined ? open : !chatWindow.classList.contains('open');
      if (isOpen) {
        chatWindow.classList.add('open');
        playAudio('modal');
        setTimeout(() => chatInput.focus(), 150);
      } else {
        chatWindow.classList.remove('open');
        playAudio('click');
      }
    }

    if (chatBtn) chatBtn.addEventListener('click', () => toggleChat());
    if (chatTeaser) chatTeaser.addEventListener('click', () => toggleChat(true));
    if (chatCloseBtn) chatCloseBtn.addEventListener('click', () => toggleChat(false));

    // Sound toggle
    if (chatSoundBtn) {
      chatSoundBtn.addEventListener('click', () => {
        chatSoundActive = !chatSoundActive;
        chatSoundBtn.style.color = chatSoundActive ? 'var(--cyan)' : 'var(--text-dim)';
        showToast(chatSoundActive ? 'Chat Audio: ENABLED' : 'Chat Audio: MUTED');
      });
    }

    // Clear Conversation
    if (chatClearBtn) {
      chatClearBtn.addEventListener('click', () => {
        chatMessages.innerHTML = '';
        renderWelcomeMessage();
        playAudio('click');
        showToast('Chat history cleared');
      });
    }

    // Quick suggestion chips
    chatChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query') || chip.textContent.trim();
        chatInput.value = query;
        handleUserSend();
      });
    });

    // Send on button click or Enter key
    if (chatSendBtn) {
      chatSendBtn.addEventListener('click', handleUserSend);
    }
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleUserSend();
      }
    });

    // Delegate Action Buttons clicked inside Chatbot messages
    chatMessages.addEventListener('click', (e) => {
      const target = e.target.closest('.chat-action-btn');
      if (!target) return;
      const action = target.getAttribute('data-action');
      handleChatAction(action);
    });

    function handleChatAction(action) {
      playAudio('click');
      switch (action) {
        case 'projects':
          scrollToSection('projects');
          showToast('Navigating to Featured Projects...');
          break;
        case 'fivem':
          scrollToSection('fivem');
          showToast('Navigating to FiveM Showcase...');
          break;
        case 'skills':
          scrollToSection('skills');
          showToast('Navigating to Technical Skills...');
          break;
        case 'automation':
          scrollToSection('automation');
          showToast('Navigating to Automation & RPA Pipeline...');
          break;
        case 'contact':
          scrollToSection('contact');
          showToast('Navigating to Contact Section...');
          break;
        case 'cv':
          openCvModal();
          break;
        case 'email':
          navigator.clipboard.writeText('basitha.fernando@example.com').then(() => {
            showToast('Email copied! Opening mail client...');
            setTimeout(() => {
              window.location.href = 'mailto:basitha.fernando@example.com?subject=Project%20Inquiry%20via%20Portfolio';
            }, 500);
          });
          break;
        case 'nos':
          if (window.triggerNosBoost) {
            window.triggerNosBoost();
            showToast('Twin-Turbo Nitrous Oxide Purge Engaged! 🚀');
          }
          break;
        case 'rpasim':
          scrollToSection('automation');
          const runBtn = document.getElementById('btnRunRpaSim');
          if (runBtn) {
            setTimeout(() => runBtn.click(), 600);
          }
          break;
      }
    }

    function scrollToSection(id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        // Close on mobile
        if (window.innerWidth < 640) {
          toggleChat(false);
        }
      }
    }

    function handleUserSend() {
      const text = chatInput.value.trim();
      if (!text) return;

      appendMessage('user', text);
      chatInput.value = '';
      if (chatSoundActive) playAudio('click');

      // Show typing indicator
      const typingEl = showTypingIndicator();

      // Simulate thoughtful response delay
      const responseDelay = Math.min(Math.max(text.length * 15, 450), 900);
      setTimeout(() => {
        if (typingEl && typingEl.parentNode) {
          typingEl.parentNode.removeChild(typingEl);
        }
        const reply = generateAiResponse(text);
        appendMessage('bot', reply.text, reply.actions);
        if (chatSoundActive) playAudio('success');
      }, responseDelay);
    }

    function appendMessage(sender, content, actions = []) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${sender}`;

      let actionsHtml = '';
      if (actions && actions.length > 0) {
        actionsHtml = `
          <div class="chat-action-tray">
            ${actions.map(a => `<button class="chat-action-btn" data-action="${a.action}">${a.label}</button>`).join('')}
          </div>
        `;
      }

      msgDiv.innerHTML = `
        <div class="chat-bubble">
          <div>${content}</div>
          ${actionsHtml}
          <div class="chat-msg-time">${timeStr}</div>
        </div>
      `;

      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
      const div = document.createElement('div');
      div.className = 'chat-msg bot';
      div.innerHTML = `
        <div class="chat-typing-indicator">
          <div class="chat-typing-dot"></div>
          <div class="chat-typing-dot"></div>
          <div class="chat-typing-dot"></div>
        </div>
      `;
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return div;
    }

    function renderWelcomeMessage() {
      appendMessage('bot', `
        <strong>Greetings! I am Nexus AI</strong>, Basitha Ninduwara Fernando's interactive portfolio copilot. 
        <br><br>
        I have full access to his verified technical architecture across <strong>Full-Stack Web Development</strong>, <strong>Enterprise RPA Automation (UiPath)</strong>, and <strong>FiveM Game Server Architecture</strong>.
        <br><br>
        How can I assist you with your project today?
      `, [
        { label: '💼 View Skills', action: 'skills' },
        { label: '📁 Featured Projects', action: 'projects' },
        { label: '🎮 FiveM Worlds', action: 'fivem' },
        { label: '🤖 RPA Pipeline', action: 'automation' },
        { label: '📄 Open CV', action: 'cv' },
        { label: '✉️ Contact Basitha', action: 'contact' }
      ]);
    }

    // Knowledge Base Decision Engine
    function generateAiResponse(rawQuery) {
      const q = rawQuery.toLowerCase();

      // 1. Identity & Overview
      if (q.includes('who are you') || q.includes('who is basitha') || q.includes('about basitha') || q.includes('what do you do') || q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        return {
          text: `<strong>Basitha Ninduwara Fernando</strong> is a multi-disciplinary software engineer specializing in three high-impact disciplines:<br><br>
          • <strong>Full-Stack Web Platforms</strong> (PHP 8.2, Laravel, MySQL, REST APIs)<br>
          • <strong>Intelligent Enterprise Automation</strong> (UiPath Studio, Orchestrator, REFramework, Unattended Bots)<br>
          • <strong>FiveM Multiplayer Game Systems</strong> (Lua 5.4, Qbox/QBCore, ox_lib, Custom NUI)<br><br>
          He is based in <strong>Colombo, Sri Lanka</strong> and works with clients and enterprises globally.`,
          actions: [
            { label: '📁 Explore Projects', action: 'projects' },
            { label: '📄 View CV', action: 'cv' },
            { label: '✉️ Get in Touch', action: 'contact' }
          ]
        };
      }

      // 2. Technical Skills & Stack
      if (q.includes('skill') || q.includes('stack') || q.includes('technolog') || q.includes('language') || q.includes('tools')) {
        return {
          text: `Basitha's <strong>technical arsenal</strong> includes:<br><br>
          • <strong>Backend & Web:</strong> PHP 8.2, Laravel, REST API Architecture, HTML5, CSS3, JavaScript, Web Security & CSRF hardening.<br>
          • <strong>Database Systems:</strong> MySQL, Microsoft SQL Server, Stored Procedures, Index Tuning, Partitioning.<br>
          • <strong>RPA Automation:</strong> UiPath Studio, Orchestrator, REFramework, Power Apps, API Automation, Unattended Bots.<br>
          • <strong>Gaming & FiveM:</strong> Lua 5.4, Qbox Framework, QBCore, ox_lib, ox_inventory, Custom NUI (CEF), txAdmin.<br>
          • <strong>DevOps:</strong> Docker, Docker Compose, Linux, Ubuntu Server, Nginx, Apache, SSL / Certbot.`,
          actions: [
            { label: '⚡ Jump to Skills Section', action: 'skills' },
            { label: '📄 Inspect Resume', action: 'cv' }
          ]
        };
      }

      // 3. Full-Stack Web Development
      if (q.includes('full stack') || q.includes('fullstack') || q.includes('php') || q.includes('laravel') || q.includes('web dev') || q.includes('backend') || q.includes('frontend') || q.includes('api') || q.includes('mysql') || q.includes('sql server') || q.includes('database')) {
        return {
          text: `In <strong>Full-Stack Development</strong>, Basitha engineers robust business software:<br><br>
          • <strong>MVC & API Architecture:</strong> Strict separation of concerns in PHP/Laravel with parameterized Eloquent ORM, secure authentication, and rate-limited REST endpoints.<br>
          • <strong>Database Optimization:</strong> Sub-40ms query execution in MySQL and Microsoft SQL Server utilizing stored procedures, foreign key indexing, and optimized transaction boundaries.<br>
          • <strong>Security First:</strong> Hardened against SQL Injection, CSRF, and XSS vulnerabilities.`,
          actions: [
            { label: '📁 View Full-Stack Project', action: 'projects' },
            { label: '✉️ Inquire for Web Development', action: 'contact' }
          ]
        };
      }

      // 4. RPA & UiPath Automation
      if (q.includes('rpa') || q.includes('uipath') || q.includes('automation') || q.includes('orchestrator') || q.includes('reframework') || q.includes('bot') || q.includes('robot') || q.includes('power app') || q.includes('unattended')) {
        return {
          text: `In <strong>Robotic Process Automation (RPA)</strong>, Basitha specializes in enterprise-grade software robots:<br><br>
          • <strong>UiPath REFramework:</strong> State-machine architecture enforcing clean separation between System Exceptions (auto-retry with exponential backoff) and Business Exceptions.<br>
          • <strong>Transactional Queues:</strong> Scalable Dispatcher & Performer models distributing items across robot clusters with 99.8% transactional accuracy.<br>
          • <strong>Legacy & Cloud Integration:</strong> Automating desktop Win32 applications, ERPs (SAP), web portals, and SQL audit tables.<br>
          • <strong>Proven Metric:</strong> Over 45,000+ queue items processed, saving 18+ hours per week in repetitive overhead!`,
          actions: [
            { label: '🤖 Explore RPA Pipeline', action: 'automation' },
            { label: '⚡ Run Live Robot Simulation', action: 'rpasim' }
          ]
        };
      }

      // 5. FiveM / GTA V Game Development
      if (q.includes('fivem') || q.includes('gta') || q.includes('gaming') || q.includes('lua') || q.includes('pake') || q.includes('qbox') || q.includes('qbcore') || q.includes('ox_lib') || q.includes('ox_inventory') || q.includes('nui') || q.includes('server')) {
        return {
          text: `Basitha is a renowned <strong>FiveM Game Server Developer</strong> and lead architect of the <strong>PAKE FiveM Server</strong>:<br><br>
          • <strong>High-Performance Framework:</strong> Engineered with Qbox / QBCore hybrid core and ox_lib running at <strong>64Hz tick rate</strong> with sub-0.03ms client resmon.<br>
          • <strong>Custom NUI Systems:</strong> Responsive, hardware-accelerated interfaces (dealership catalogs, banking tablets, dynamic HUDs) rendered at 60 FPS in CEF.<br>
          • <strong>Full Server Infrastructure:</strong> MariaDB async database pooling, custom MLO map collision tuning, custom vehicles, txAdmin automation, and DDoS protection.`,
          actions: [
            { label: '🎮 View FiveM Showcase', action: 'fivem' },
            { label: '🚀 Test 3D Skyline NOS Boost', action: 'nos' }
          ]
        };
      }

      // 6. Featured Projects
      if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('showcase') || q.includes('built') || q.includes('case study')) {
        return {
          text: `Basitha has engineered <strong>7 featured production platforms</strong> on this website:<br><br>
          1. <strong>Enterprise RPA Automation Platform</strong> (UiPath REFramework & Orchestrator)<br>
          2. <strong>Full-Stack Business Web Application</strong> (PHP 8.2, Laravel, MySQL 8)<br>
          3. <strong>Dockerized Web Application Deployment</strong> (Docker Compose, Nginx, SSL)<br>
          4. <strong>Automation Monitoring Dashboard</strong> (UiPath REST API & Live Metrics)<br>
          5. <strong>PAKE FiveM Gaming Server</strong> (Lua 5.4, Qbox, ox_lib, 64Hz)<br>
          6. <strong>FiveM Custom Admin Dashboard</strong> (Staff Portal & Discord OAuth2)<br>
          7. <strong>Custom FiveM NUI Systems</strong> (In-game 60 FPS CEF interfaces)<br><br>
          Click below to inspect full system architecture diagrams for each project!`,
          actions: [
            { label: '📁 Jump to Projects Grid', action: 'projects' },
            { label: '📄 Open Resume', action: 'cv' }
          ]
        };
      }

      // 7. CV / Resume
      if (q.includes('cv') || q.includes('resume') || q.includes('download cv') || q.includes('pdf') || q.includes('experience')) {
        return {
          text: `You can review Basitha Ninduwara Fernando's complete <strong>Curriculum Vitae</strong> directly inside the portfolio! It includes all employment history, verified core competencies, project metrics, and technical proficiencies.<br><br>
          You can also print or export it directly to PDF.`,
          actions: [
            { label: '📄 Open Interactive CV Viewer', action: 'cv' },
            { label: '✉️ Request Full Dossier', action: 'contact' }
          ]
        };
      }

      // 8. Contact & Hire
      if (q.includes('hire') || q.includes('contact') || q.includes('email') || q.includes('available') || q.includes('rate') || q.includes('freelance') || q.includes('cost') || q.includes('quote') || q.includes('location') || q.includes('sri lanka')) {
        return {
          text: `Basitha is currently <strong>ONLINE & AVAILABLE</strong> for enterprise contract engagements, RPA automation consultation, full-stack web builds, and FiveM game server architecture!<br><br>
          • <strong>Location:</strong> Colombo, Sri Lanka (UTC +5:30) • Works seamlessly with global remote teams.<br>
          • <strong>Email:</strong> <code>basitha.fernando@example.com</code><br>
          • <strong>GitHub:</strong> <a href="https://github.com/BasithaFdo" target="_blank" style="color:var(--cyan);">github.com/BasithaFdo</a><br>
          • <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/basitha-fernando/" target="_blank" style="color:var(--cyan);">linkedin.com/in/basitha-fernando</a>`,
          actions: [
            { label: '✉️ Jump to Contact Form', action: 'contact' },
            { label: '📋 Copy Email & Dispatch', action: 'email' }
          ]
        };
      }

      // 9. Easter Eggs
      if (q.includes('nos') || q.includes('car') || q.includes('skyline') || q.includes('r34') || q.includes('boost') || q.includes('drift')) {
        if (window.triggerNosBoost) window.triggerNosBoost();
        return {
          text: `🚀 <strong>Nitrous Oxide (NOS) purge initiated!</strong> Twin-turbocharged RB26DETT spooled up with procedural blow-off valve flutter! Check out the 3D Skyline canvas in the FiveM section.`,
          actions: [
            { label: '🎮 View 3D R34 Skyline', action: 'fivem' },
            { label: '🚀 Purge NOS Again', action: 'nos' }
          ]
        };
      }

      if (q.includes('matrix')) {
        triggerMatrixEffect();
        return {
          text: `🕶️ <em>"Wake up, Neo... The Matrix has you. Follow the white rabbit."</em><br><br>Matrix protocol visual overlay active!`,
          actions: [
            { label: '💻 Open Terminal [Ctrl+K]', action: 'projects' }
          ]
        };
      }

      if (q.includes('joke')) {
        return {
          text: `😄 <strong>Developer Humor:</strong><br><br>
          • Why do programmers always prefer dark mode?<br>
          <em>Because light attracts bugs!</em><br><br>
          • There are 10 types of people in the world: those who understand binary, and those who don't.`,
          actions: [
            { label: '💼 View Real Skills', action: 'skills' }
          ]
        };
      }

      // Default Fallback
      return {
        text: `I am trained on all technical aspects of <strong>Basitha Ninduwara Fernando's</strong> engineering portfolio.<br><br>
        Feel free to ask me about his <strong>Full-Stack web expertise</strong>, <strong>UiPath RPA automation</strong>, <strong>FiveM GTA V game server engineering</strong>, <strong>specific project architectures</strong>, or <strong>how to hire him</strong> for your project!`,
        actions: [
          { label: '💼 Technical Stack', action: 'skills' },
          { label: '📁 Featured Projects', action: 'projects' },
          { label: '🎮 FiveM Worlds', action: 'fivem' },
          { label: '🤖 RPA Pipeline', action: 'automation' },
          { label: '📄 View CV', action: 'cv' },
          { label: '✉️ Contact Basitha', action: 'contact' }
        ]
      };
    }

    // Initial greeting
    renderWelcomeMessage();
  }

  // Expose global helpers
  window.BasithaPortfolio = {
    openCvModal,
    openTerminalModal,
    showToast,
    playAudio
  };

})();
