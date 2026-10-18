/**
 * SkyLine Hub - Brian's Nissan Skyline GT-R R34 (2 Fast 2 Furious)
 * Full Interactive WebGL 3D Animation Engine
 * Built with Three.js & GLTFLoader
 */

(function () {
  'use strict';

  // Core Three.js variables
  let scene, camera, renderer, carGroup;
  let wheelNodes = [];
  let underglowLights = [];
  let headlightObjects = [];
  let taillightObjects = [];
  let groundGrid, roadGroup, speedLinesGroup;
  let nosParticles = [];
  let exhaustParticles = [];
  let totalDistance = 0;

  // Animation & state flags
  let isDrivingMode = true; // true = Highway Drive, false = Showroom Turntable
  let isOrbiting = false;
  let headlightsOn = true;
  let underglowOn = true;
  let soundEnabled = true;
  let isNosActive = false;
  let currentSpeed = 128; // MPH
  let targetSpeed = 128;
  let currentRpm = 6800;
  let targetRpm = 6800;
  let steerAngle = 0;
  let currentCameraView = 'chase'; // 'orbit', 'chase', 'hood', 'low'

  // Model URL resolver (works across file://, local dev, and Apache production)
  const MODEL_URL = (function () {
    if (window.location.protocol === 'file:' || !window.location.pathname.startsWith('/')) {
      return 'assets/models/brians_r34_from_2_fast_2_furious.glb';
    }
    return '/assets/models/brians_r34_from_2_fast_2_furious.glb';
  })();

  // Audio Context for Procedural Turbo, BOV & NOS Sound Synthesis
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Synthesize turbo blow-off valve flutter (Stututu) and NOS hiss
  function playNosSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;

      // 1. High-pressure NOS Purge Hiss (White noise burst)
      const bufferSize = audioCtx.sampleRate * 1.4;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(3.0, now);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.35, now + 0.1);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      whiteNoise.start(now);

      // 2. Twin-Turbo Spool Whine (High frequency sine sweep)
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(2200, now + 0.9);

      oscGain.gain.setValueAtTime(0.01, now);
      oscGain.gain.linearRampToValueAtTime(0.12, now + 0.5);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 1.2);

      // 3. Blow-Off Valve Compressor Surge (Stututu flutter after purge)
      setTimeout(() => {
        if (!audioCtx) return;
        const flutterTime = audioCtx.currentTime;
        for (let i = 0; i < 4; i++) {
          const chirp = audioCtx.createOscillator();
          const chirpGain = audioCtx.createGain();
          chirp.type = 'triangle';
          const t = flutterTime + i * 0.08;
          chirp.frequency.setValueAtTime(1400 - i * 150, t);
          chirp.frequency.exponentialRampToValueAtTime(700 - i * 100, t + 0.06);

          chirpGain.gain.setValueAtTime(0.18 / (i + 1), t);
          chirpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

          chirp.connect(chirpGain);
          chirpGain.connect(audioCtx.destination);
          chirp.start(t);
          chirp.stop(t + 0.07);
        }
      }, 700);
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }

  let container;

  function initR34Viewer() {
    container = document.getElementById('r34-3d-canvas');
    if (!container) return;

    if (typeof THREE === 'undefined') {
      setTimeout(initR34Viewer, 200);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a14, 0.028);

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 150);
    setCameraView('chase');

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting & Environment
    setupLighting();

    // 5. Dynamic Highway & Cyber Road
    buildDynamicRoad();

    // 6. NOS & Exhaust Particle Systems
    initParticleEffects();

    // 7. Load Brian's Nissan Skyline GT-R R34 Model
    loadBriansR34();

    // 8. Setup Controls & Interactivity
    setupControls();
    setupUIControls();

    // 9. Resize Listener
    window.addEventListener('resize', onWindowResize);

    // 10. Start Animation Loop
    animate();
  }

  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Key Overhead Floodlight (Silver pearlescent reflection)
    const overhead = new THREE.DirectionalLight(0xffffff, 1.8);
    overhead.position.set(6, 12, 6);
    overhead.castShadow = true;
    overhead.shadow.mapSize.width = 2048;
    overhead.shadow.mapSize.height = 2048;
    overhead.shadow.bias = -0.0004;
    scene.add(overhead);

    // Electric Blue Rim Light (Iconic 2F2F Blue theme)
    const blueRim = new THREE.DirectionalLight(0x00d4ff, 2.2);
    blueRim.position.set(-8, 4, -6);
    scene.add(blueRim);

    // Front Warm Streetlamp Glare
    const frontWarm = new THREE.DirectionalLight(0x93c5fd, 1.2);
    frontWarm.position.set(0, 5, 10);
    scene.add(frontWarm);
  }

  function buildDynamicRoad() {
    roadGroup = new THREE.Group();

    // Infinite Asphalt Floor
    const roadGeo = new THREE.PlaneGeometry(24, 180, 1, 32);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x070b14,
      metalness: 0.85,
      roughness: 0.35
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.y = -0.02;
    roadMesh.receiveShadow = true;
    roadGroup.add(roadMesh);

    // Contact shadow underneath car to ground it on asphalt
    const shadowGeo = new THREE.PlaneGeometry(2.3, 4.8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(64, 128, 15, 64, 128, 70);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
    sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 128, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.8 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.003, 0);
    scene.add(shadowMesh);

    // Moving Neon Center Road Lines (Cyan Speed Lines)
    const lineMatCyan = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const lineMatWhite = new THREE.MeshBasicMaterial({ color: 0xf1f5f9 });

    for (let i = -80; i < 80; i += 8) {
      const dashGeo = new THREE.PlaneGeometry(0.25, 4.5);
      const dash = new THREE.Mesh(dashGeo, lineMatCyan);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.005, i);
      roadGroup.add(dash);
    }

    // Side Neon Shoulder Barriers
    [-5.5, 5.5].forEach((xSide) => {
      const railGeo = new THREE.PlaneGeometry(0.18, 180);
      const rail = new THREE.Mesh(railGeo, lineMatWhite);
      rail.rotation.x = -Math.PI / 2;
      rail.position.set(xSide, 0.005, 0);
      roadGroup.add(rail);

      // Neon Highway Light Pillars
      for (let z = -70; z < 70; z += 20) {
        const pillarGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.5, 8);
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(xSide * 1.3, 2.25, z);

        const lampGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const lampMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.position.set(xSide * 1.3, 4.5, z);
        roadGroup.add(pillar);
        roadGroup.add(lamp);
      }
    });

    scene.add(roadGroup);

    // Speed Lines Group for NOS Warp Speed
    speedLinesGroup = new THREE.Group();
    const lineGeo = new THREE.BufferGeometry();
    const lineCount = 120;
    const positions = new Float32Array(lineCount * 6);

    for (let i = 0; i < lineCount; i++) {
      const lx = (Math.random() - 0.5) * 16;
      const ly = Math.random() * 4 + 0.3;
      const lz = (Math.random() - 0.5) * 60;
      const len = Math.random() * 6 + 4;

      positions[i * 6] = lx;
      positions[i * 6 + 1] = ly;
      positions[i * 6 + 2] = lz;

      positions[i * 6 + 3] = lx;
      positions[i * 6 + 4] = ly;
      positions[i * 6 + 5] = lz - len;
    }

    lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const speedLines = new THREE.LineSegments(lineGeo, lineMat);
    speedLinesGroup.add(speedLines);
    speedLinesGroup.visible = false;
    scene.add(speedLinesGroup);
  }

  function initParticleEffects() {
    // NOS Purge Mist Particles (shoot from hood cowl vents)
    const nosCount = 60;
    for (let i = 0; i < nosCount; i++) {
      const pGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({
        color: 0xe0f7ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });
      const p = new THREE.Mesh(pGeo, pMat);
      p.visible = false;
      scene.add(p);
      nosParticles.push({
        mesh: p,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        side: i % 2 === 0 ? -1 : 1
      });
    }

    // Exhaust Boost Flames (shoot from rear titanium exhaust tip)
    const flameCount = 40;
    for (let i = 0; i < flameCount; i++) {
      const fGeo = new THREE.SphereGeometry(0.07, 8, 8);
      const fMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });
      const f = new THREE.Mesh(fGeo, fMat);
      f.visible = false;
      scene.add(f);
      exhaustParticles.push({
        mesh: f,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0
      });
    }
  }

  // Load Brian's R34 from GLTF
  function loadBriansR34() {
    const loadingOverlay = document.getElementById('r34LoadingOverlay');
    const loadingBar = document.getElementById('r34LoadingBar');
    const loadingText = document.getElementById('r34LoadingText');

    if (typeof THREE.GLTFLoader === 'undefined') {
      console.error('GLTFLoader not loaded!');
      return;
    }

    const loader = new THREE.GLTFLoader();

    loader.load(
      MODEL_URL,
      (gltf) => {
        carGroup = new THREE.Group();
        const model = gltf.scene;

        // Auto-compute bounding box to center & ground properly
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Target length ~4.6 units
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 4.6 / maxDim;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Re-calculate after scaling
        box.setFromObject(model);
        box.getCenter(center);
        model.position.x = -center.x;
        model.position.y = -box.min.y;
        model.position.z = -center.z;

        carGroup.add(model);
        scene.add(carGroup);

        // Identify ONLY the 4 exact root wheel parent nodes (so sub-meshes are never detached)
        wheelNodes = [];
        const EXACT_WHEEL_NAMES = [
          '3DWheel Front L',
          '3DWheel Front R',
          '3DWheel Rear L',
          '3DWheel Rear R'
        ];

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Enhance Brian's platinum silver & blue stripes paint
            if (child.material) {
              child.material.roughness = 0.22;
              child.material.metalness = 0.82;
              if (child.material.map) {
                child.material.map.anisotropy = 16;
              }
            }
          }

          if (EXACT_WHEEL_NAMES.includes(child.name)) {
            // Save initial local socket position and quaternion
            wheelNodes.push({
              node: child,
              name: child.name,
              initialPos: child.position.clone(),
              initialQuat: child.quaternion.clone(),
              isRight: child.name.includes(' R'),
              isFront: child.name.includes('Front')
            });
          }
        });

        // Add 2 Fast 2 Furious Signature Electric Blue Underglow
        buildUnderglowLights();

        // Add Headlight & Taillight Beams
        buildCarLighting();

        // Hide loading overlay
        if (loadingOverlay) {
          loadingOverlay.style.opacity = '0';
          setTimeout(() => {
            loadingOverlay.style.display = 'none';
          }, 400);
        }

        const statusText = document.getElementById('r34RevStatus');
        if (statusText) {
          statusText.textContent = '⚡ BRIAN\'S R34 GT-R ACTIVE • 2 FAST 2 FURIOUS SPEC';
        }
      },
      (xhr) => {
        if (xhr.lengthComputable && loadingBar && loadingText) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          loadingBar.style.width = `${pct}%`;
          loadingText.textContent = `⚡ Loading Brian's R34 GT-R: ${pct}% (${(xhr.loaded / 1048576).toFixed(1)} MB)`;
        }
      },
      (error) => {
        console.error('Failed to load GLTF model:', error);
        if (loadingText) {
          loadingText.textContent = '⚡ Error loading GLB model. Falling back to procedural engine.';
        }
      }
    );
  }

  function buildUnderglowLights() {
    underglowLights = [];
    const positions = [
      { x: -0.85, y: 0.18, z: 0 },   // Left side tube
      { x: 0.85, y: 0.18, z: 0 },    // Right side tube
      { x: 0, y: 0.18, z: 1.5 },     // Front lip glow
      { x: 0, y: 0.18, z: -1.5 }     // Rear diffuser glow
    ];

    positions.forEach((pos) => {
      const neonLight = new THREE.PointLight(0x00f0ff, 2.8, 3.2, 1.8);
      neonLight.position.set(pos.x, pos.y, pos.z);
      carGroup.add(neonLight);
      underglowLights.push(neonLight);
    });
  }

  function buildCarLighting() {
    headlightObjects = [];
    taillightObjects = [];

    // Twin Xenon Headlight Spotlights
    [-0.65, 0.65].forEach((xSide) => {
      const spot = new THREE.SpotLight(0xe0f7ff, 3.5, 30, Math.PI / 6, 0.4, 1.2);
      spot.position.set(xSide, 0.65, 2.1);
      spot.target.position.set(xSide * 0.4, 0, 18);
      carGroup.add(spot);
      carGroup.add(spot.target);
      headlightObjects.push(spot);
    });

    // Ruby Red Halo Taillights (Signature R34 Quad Halos)
    [-0.62, -0.32, 0.32, 0.62].forEach((xPos) => {
      const tail = new THREE.PointLight(0xff0033, 1.6, 2.2);
      tail.position.set(xPos, 0.72, -2.25);
      carGroup.add(tail);
      taillightObjects.push(tail);
    });
  }

  // Camera Presets
  function setCameraView(viewName) {
    currentCameraView = viewName;
    const views = {
      chase: { x: 0, y: 1.8, z: -6.2, lookY: 0.7, lookZ: 2.0 },
      orbit: { x: 5.2, y: 2.0, z: 5.2, lookY: 0.5, lookZ: 0 },
      hood: { x: 0, y: 1.15, z: 0.5, lookY: 0.75, lookZ: 8 },
      low: { x: -3.2, y: 0.45, z: 2.5, lookY: 0.35, lookZ: 0 }
    };

    const v = views[viewName] || views.chase;
    targetCamPos.set(v.x, v.y, v.z);
    targetCamLook.set(0, v.lookY, v.lookZ);

    const buttons = document.querySelectorAll('.r34-cam-btn');
    buttons.forEach((b) => {
      if (b.getAttribute('data-view') === viewName) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  }

  const targetCamPos = new THREE.Vector3(0, 1.8, -6.2);
  const targetCamLook = new THREE.Vector3(0, 0.7, 2.0);
  let camLookAt = new THREE.Vector3(0, 0.7, 2.0);

  // Mouse & Touch Controls
  let isDragging = false;
  let previousMouse = { x: 0, y: 0 };
  let orbitAngleY = 0.8;
  let orbitAngleX = 0.22;

  function setupControls() {
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouse.x;
      const deltaY = e.clientY - previousMouse.y;

      orbitAngleY += deltaX * 0.008;
      orbitAngleX = Math.max(0.05, Math.min(Math.PI / 2.8, orbitAngleX + deltaY * 0.005));

      previousMouse = { x: e.clientX, y: e.clientY };
    });

    // Touch support
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMouse.x;
      const deltaY = e.touches[0].clientY - previousMouse.y;

      orbitAngleY += deltaX * 0.008;
      orbitAngleX = Math.max(0.05, Math.min(Math.PI / 2.8, orbitAngleX + deltaY * 0.005));

      previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Keyboard Arrow Keys for Steering
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        steerAngle = Math.max(-0.45, steerAngle - 0.12);
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        steerAngle = Math.min(0.45, steerAngle + 0.12);
      }
      if (e.code === 'Space') {
        triggerNosBoost();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) {
        steerAngle = 0;
      }
    });
  }

  // UI Button Bindings
  function setupUIControls() {
    // NOS Purge & Boost Button
    const btnNos = document.getElementById('btnR34Nos');
    if (btnNos) {
      btnNos.addEventListener('click', () => {
        triggerNosBoost();
      });
    }

    // Drive Mode / Showroom Toggle Button
    const btnDriveMode = document.getElementById('btnR34DriveMode');
    if (btnDriveMode) {
      btnDriveMode.addEventListener('click', () => {
        isDrivingMode = !isDrivingMode;
        if (isDrivingMode) {
          btnDriveMode.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Highway Run
          `;
          btnDriveMode.classList.add('active');
          setCameraView('chase');
        } else {
          btnDriveMode.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
            Showroom 360°
          `;
          btnDriveMode.classList.remove('active');
          setCameraView('orbit');
        }
      });
    }

    // Underglow Toggle
    const btnNeon = document.getElementById('btnR34Neon');
    if (btnNeon) {
      btnNeon.addEventListener('click', () => {
        underglowOn = !underglowOn;
        underglowLights.forEach((l) => {
          l.intensity = underglowOn ? 2.8 : 0;
        });
        btnNeon.classList.toggle('active', underglowOn);
      });
    }

    // Headlights Toggle
    const btnLights = document.getElementById('btnR34Lights');
    if (btnLights) {
      btnLights.addEventListener('click', () => {
        headlightsOn = !headlightsOn;
        headlightObjects.forEach((h) => {
          h.intensity = headlightsOn ? 3.5 : 0;
        });
        btnLights.classList.toggle('active', headlightsOn);
      });
    }

    // Sound FX Toggle
    const btnSound = document.getElementById('btnR34Sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        btnSound.classList.toggle('active', soundEnabled);
        btnSound.innerHTML = soundEnabled
          ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Audio: ON`
          : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg> Audio: MUTED`;
      });
    }

    // Camera View Buttons
    const camButtons = document.querySelectorAll('.r34-cam-btn');
    camButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        setCameraView(view);
      });
    });
  }

  // Trigger 2 Fast 2 Furious Nitrous Oxide Purge & Boost
  function triggerNosBoost() {
    if (isNosActive) return;
    isNosActive = true;
    playNosSound();

    // Spurt NOS Mist Particles from Base of Hood (Cowl Vent Nozzles)
    nosParticles.forEach((p) => {
      p.mesh.visible = true;
      p.mesh.scale.set(0.12, 0.12, 0.12);
      p.mesh.position.set(p.side * 0.35, 0.68, 0.85);
      p.vx = p.side * (Math.random() * 0.4 + 0.3);
      p.vy = Math.random() * 0.6 + 0.4;
      p.vz = (Math.random() - 0.5) * 0.1 + 0.15;
      p.life = 0.9;
      p.mesh.material.opacity = 0.65;
    });

    // Spurt Exhaust Flame Particles from Rear Titanium Tip
    exhaustParticles.forEach((f) => {
      f.mesh.visible = true;
      f.mesh.scale.set(0.15, 0.15, 0.15);
      f.mesh.position.set(-0.68 + (Math.random() - 0.5) * 0.06, 0.22, -2.28);
      f.vx = (Math.random() - 0.5) * 0.05;
      f.vy = (Math.random() - 0.5) * 0.04;
      f.vz = -(Math.random() * 0.8 + 0.8);
      f.life = 1.0;
      f.mesh.material.opacity = 0.9;
    });

    // Speed lines visible
    if (speedLinesGroup) speedLinesGroup.visible = true;

    // Boost speed & RPM
    targetSpeed = 168;
    targetRpm = 8600;

    const revText = document.getElementById('r34RevStatus');
    if (revText) {
      revText.textContent = '🔥 NOS PURGE ACTIVE • 168 MPH • TWIN TURBO 26 PSI BOOST';
      revText.style.color = '#00f0ff';
    }

    // Neon flash
    underglowLights.forEach((l) => {
      l.intensity = 5.5;
      l.color.setHex(0x00ffff);
    });

    setTimeout(() => {
      isNosActive = false;
      targetSpeed = 128;
      targetRpm = 6800;
      if (speedLinesGroup) speedLinesGroup.visible = false;
      underglowLights.forEach((l) => {
        l.intensity = underglowOn ? 2.8 : 0;
        l.color.setHex(0x00f0ff);
      });
      if (revText) {
        revText.textContent = '⚡ BRIAN\'S R34 GT-R ACTIVE • 2 FAST 2 FURIOUS SPEC';
        revText.style.color = '#38bdf8';
      }
    }, 2800);
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // Animation Loop
  let lastTime = performance.now();
  let roadOffset = 0;

  function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    // Smooth speed & RPM interpolation
    currentSpeed += (targetSpeed - currentSpeed) * 0.08;
    currentRpm += (targetRpm - currentRpm) * 0.08;

    // Update Telemetry Displays
    const speedEl = document.getElementById('r34SpeedMph');
    const rpmEl = document.getElementById('r34RpmValue');
    if (speedEl) speedEl.textContent = Math.round(currentSpeed);
    if (rpmEl) rpmEl.textContent = Math.round(currentRpm).toLocaleString();

    // 1. Driving Mode Logic
    if (isDrivingMode) {
      const roadSpeed = (currentSpeed / 60) * 12; // Speed in units/sec
      roadOffset = (roadOffset + roadSpeed * dt) % 8;

      if (roadGroup) {
        roadGroup.position.z = roadOffset;
      }

      // Roll all wheels realistically inside their wheel wells
      totalDistance += roadSpeed * dt;
      const rollAngle = totalDistance / 0.35; // v = w * r

      wheelNodes.forEach((w) => {
        // LOCK POSITION INSIDE THE WHEEL WELL SOCKET (PREVENTS MIGRATION TO ROOF)
        w.node.position.copy(w.initialPos);

        // Roll around wheel's local axle (X axis)
        const rollAxis = new THREE.Vector3(w.isRight ? -1 : 1, 0, 0);
        const rollQuat = new THREE.Quaternion().setFromAxisAngle(rollAxis, rollAngle);

        if (w.isFront) {
          const steerAxis = new THREE.Vector3(0, 1, 0);
          const steerQuat = new THREE.Quaternion().setFromAxisAngle(steerAxis, steerAngle);
          w.node.quaternion.copy(w.initialQuat).multiply(steerQuat).multiply(rollQuat);
        } else {
          w.node.quaternion.copy(w.initialQuat).multiply(rollQuat);
        }
      });

      // Subtle suspension micro-bounce and chassis sway
      if (carGroup) {
        carGroup.position.y = Math.sin(now * 0.015) * 0.005 + (isNosActive ? Math.random() * 0.012 - 0.006 : 0);
        carGroup.rotation.z = -steerAngle * 0.06; // Lean into corners
        carGroup.rotation.x = isNosActive ? -0.015 : 0; // Squat on acceleration
        carGroup.position.x = steerAngle * 1.2;
      }
    } else {
      // Showroom Turntable Mode: Auto-rotate car
      if (carGroup) {
        carGroup.rotation.y += 0.008;
        carGroup.position.set(0, 0, 0);
        carGroup.rotation.z = 0;
        carGroup.rotation.x = 0;
      }
      wheelNodes.forEach((w) => {
        w.node.position.copy(w.initialPos);
        w.node.quaternion.copy(w.initialQuat);
      });
    }

    // 2. Animate NOS Mist Particles
    if (isNosActive) {
      nosParticles.forEach((p) => {
        if (p.mesh.visible) {
          p.mesh.position.x += p.vx * dt * 4;
          p.mesh.position.y += p.vy * dt * 4;
          p.mesh.position.z += p.vz * dt * 4;
          p.life -= dt * 1.5;
          p.mesh.material.opacity = Math.max(0, p.life * 0.65);
          p.mesh.scale.multiplyScalar(1.04);

          if (p.life <= 0) {
            p.mesh.position.set(p.side * 0.35, 0.68, 0.85);
            p.mesh.scale.set(0.12, 0.12, 0.12);
            p.life = 0.85;
          }
        }
      });

      // Animate Exhaust Flame Particles
      exhaustParticles.forEach((f) => {
        if (f.mesh.visible) {
          f.mesh.position.x += f.vx * dt * 6;
          f.mesh.position.y += f.vy * dt * 6;
          f.mesh.position.z += f.vz * dt * 8;
          f.life -= dt * 4.0;
          f.mesh.material.opacity = Math.max(0, f.life);
          f.mesh.scale.multiplyScalar(1.03);

          if (f.life <= 0) {
            f.mesh.position.set(-0.68 + (Math.random() - 0.5) * 0.06, 0.22, -2.28);
            f.mesh.scale.set(0.15, 0.15, 0.15);
            f.life = 1.0;
          }
        }
      });
    }

    // 3. Camera Interpolation
    if (currentCameraView === 'orbit') {
      const distance = 7.5;
      camera.position.x = distance * Math.sin(orbitAngleY) * Math.cos(orbitAngleX);
      camera.position.y = Math.max(0.5, distance * Math.sin(orbitAngleX));
      camera.position.z = distance * Math.cos(orbitAngleY) * Math.cos(orbitAngleX);
      camera.lookAt(0, 0.55, 0);
    } else {
      camera.position.lerp(targetCamPos, 0.08);
      camLookAt.lerp(targetCamLook, 0.08);
      camera.lookAt(camLookAt);

      // Subtle camera shake during NOS
      if (isNosActive) {
        camera.position.x += (Math.random() - 0.5) * 0.03;
        camera.position.y += (Math.random() - 0.5) * 0.03;
      }
    }

    renderer.render(scene, camera);
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initR34Viewer);
  } else {
    initR34Viewer();
  }

  window.initR34Viewer = initR34Viewer;
  window.triggerNosBoost = triggerNosBoost;
})();
