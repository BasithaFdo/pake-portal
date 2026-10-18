/**
 * SkyLine Hub - Nissan Skyline GT-R R34 3D Interactive WebGL Engine
 * Built with Three.js (Procedural BNR34 Architecture + Custom GLTF Loader support)
 */

(function () {
  'use strict';

  let scene, camera, renderer, carGroup, wheels = [];
  let isOrbiting = true;
  let headlightsOn = true;
  let underglowOn = true;
  let underglowColor = 0x00f0ff; // Neon cyan
  let carColor = 0x0044cc; // Iconic Bayside Blue
  let carMaterials = [];
  let lightMaterials = [];
  let underglowLights = [];
  let exhaustParticles = [];
  let isRevving = false;
  let container;

  // Color Presets for Nissan Skyline GT-R R34
  const COLOR_PRESETS = {
    baysideBlue: 0x0044cc,
    midnightPurple: 0x3d1a54,
    millenniumJade: 0x6e7f72,
    kuroBlack: 0x11161f,
    activeRed: 0xbb1122,
    nismoWhite: 0xf0f3f6,
    sonicSilver: 0x8a939e
  };

  function initR34Viewer() {
    container = document.getElementById('r34-3d-canvas');
    if (!container) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js not yet loaded, waiting...');
      setTimeout(initR34Viewer, 200);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.035);

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(5.5, 2.2, 5.5);

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting Setup
    setupLighting();

    // 5. Build Showroom Floor
    buildShowroomFloor();

    // 6. Build Nissan Skyline GT-R R34
    buildSkylineR34();

    // 7. Setup Mouse & Touch Controls
    setupControls();

    // 8. Setup UI Listeners
    setupUIControls();

    // 9. Resize Listener
    window.addEventListener('resize', onWindowResize);

    // 10. Animation Loop
    animate();
  }

  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Key Light (overhead showroom flood)
    const overheadLight = new THREE.DirectionalLight(0xffffff, 1.4);
    overheadLight.position.set(5, 8, 4);
    overheadLight.castShadow = true;
    overheadLight.shadow.mapSize.width = 1024;
    overheadLight.shadow.mapSize.height = 1024;
    overheadLight.shadow.bias = -0.0005;
    scene.add(overheadLight);

    // Fill Light (electric blue rim light)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-6, 3, -4);
    scene.add(rimLight);

    // Rear Specular Light (violet halo)
    const rearLight = new THREE.DirectionalLight(0xa855f7, 0.9);
    rearLight.position.set(0, 4, -6);
    scene.add(rearLight);
  }

  function buildShowroomFloor() {
    // Reflective Turntable Disc
    const discGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.08, 64);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x0b1324,
      metalness: 0.85,
      roughness: 0.25
    });
    const turntable = new THREE.Mesh(discGeo, discMat);
    turntable.position.y = -0.04;
    turntable.receiveShadow = true;
    scene.add(turntable);

    // Neon Rim on Turntable
    const ringGeo = new THREE.RingGeometry(4.18, 4.25, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    // Cyber Grid Floor
    const grid = new THREE.GridHelper(30, 30, 0x1e3a8a, 0x0f172a);
    grid.position.y = -0.05;
    scene.add(grid);
  }

  function buildSkylineR34() {
    carGroup = new THREE.Group();
    wheels = [];
    carMaterials = [];
    lightMaterials = [];

    // Metallic Car Paint Material (Bayside Blue)
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: carColor,
      metalness: 0.75,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9
    });
    carMaterials.push(bodyMaterial);

    const darkTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x111620,
      metalness: 0.9,
      roughness: 0.4
    });

    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x181818,
      metalness: 0.5,
      roughness: 0.6
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0a101d,
      transmission: 0.8,
      opacity: 0.85,
      transparent: true,
      roughness: 0.05,
      ior: 1.5
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.98,
      roughness: 0.1
    });

    // 1. MAIN CHASSIS & LOWER BODY
    const lowerBodyGeo = new THREE.BoxGeometry(1.85, 0.42, 4.4);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMaterial);
    lowerBody.position.set(0, 0.45, 0);
    lowerBody.castShadow = true;
    carGroup.add(lowerBody);

    // Front Bumper with R34 Aero Splitter
    const frontBumperGeo = new THREE.BoxGeometry(1.86, 0.32, 0.55);
    const frontBumper = new THREE.Mesh(frontBumperGeo, bodyMaterial);
    frontBumper.position.set(0, 0.36, 2.3);
    frontBumper.castShadow = true;
    carGroup.add(frontBumper);

    // Front Intercooler Grille
    const icGeo = new THREE.BoxGeometry(1.1, 0.22, 0.08);
    const icMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.3 });
    const intercooler = new THREE.Mesh(icGeo, icMat);
    intercooler.position.set(0, 0.32, 2.58);
    carGroup.add(intercooler);

    // Front Carbon Lip Splitter
    const splitterGeo = new THREE.BoxGeometry(1.92, 0.05, 0.5);
    const splitter = new THREE.Mesh(splitterGeo, carbonMaterial);
    splitter.position.set(0, 0.2, 2.35);
    carGroup.add(splitter);

    // 2. MUSCULAR R34 WIDEBODY HOOD & FENDERS
    const hoodGeo = new THREE.BoxGeometry(1.78, 0.15, 1.55);
    const hood = new THREE.Mesh(hoodGeo, bodyMaterial);
    hood.position.set(0, 0.65, 1.35);
    hood.rotation.x = -0.04;
    hood.castShadow = true;
    carGroup.add(hood);

    // R34 NACA Hood Duct
    const nacaGeo = new THREE.ConeGeometry(0.08, 0.2, 3);
    const naca = new THREE.Mesh(nacaGeo, darkTrimMaterial);
    naca.rotation.x = Math.PI / 2;
    naca.position.set(-0.35, 0.73, 1.45);
    carGroup.add(naca);

    // Flared Widebody Wheel Arches (Front & Rear)
    [-0.95, 0.95].forEach((sideX) => {
      // Front flare
      const fArchGeo = new THREE.BoxGeometry(0.12, 0.35, 0.95);
      const fArch = new THREE.Mesh(fArchGeo, bodyMaterial);
      fArch.position.set(sideX, 0.5, 1.35);
      carGroup.add(fArch);

      // Rear flare (signature muscular GT-R hips)
      const rArchGeo = new THREE.BoxGeometry(0.14, 0.4, 1.05);
      const rArch = new THREE.Mesh(rArchGeo, bodyMaterial);
      rArch.position.set(sideX, 0.55, -1.25);
      carGroup.add(rArch);

      // Side Skirt Aero Extension
      const skirtGeo = new THREE.BoxGeometry(0.08, 0.1, 2.2);
      const skirt = new THREE.Mesh(skirtGeo, carbonMaterial);
      skirt.position.set(sideX * 1.02, 0.25, 0);
      carGroup.add(skirt);
    });

    // 3. CABIN & GREENHOUSE (TINTED GLASS & PILLARS)
    const cabinGeo = new THREE.BoxGeometry(1.55, 0.55, 2.1);
    const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
    cabin.position.set(0, 0.92, -0.15);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Roof Panel
    const roofGeo = new THREE.BoxGeometry(1.48, 0.06, 1.6);
    const roof = new THREE.Mesh(roofGeo, bodyMaterial);
    roof.position.set(0, 1.21, -0.2);
    roof.castShadow = true;
    carGroup.add(roof);

    // 4. REAR TRUNK & BUMPER
    const trunkGeo = new THREE.BoxGeometry(1.78, 0.35, 0.95);
    const trunk = new THREE.Mesh(trunkGeo, bodyMaterial);
    trunk.position.set(0, 0.65, -1.75);
    trunk.castShadow = true;
    carGroup.add(trunk);

    const rearBumperGeo = new THREE.BoxGeometry(1.85, 0.38, 0.45);
    const rearBumper = new THREE.Mesh(rearBumperGeo, bodyMaterial);
    rearBumper.position.set(0, 0.42, -2.25);
    rearBumper.castShadow = true;
    carGroup.add(rearBumper);

    // Rear Carbon Diffuser
    const diffuserGeo = new THREE.BoxGeometry(1.65, 0.12, 0.35);
    const diffuser = new THREE.Mesh(diffuserGeo, carbonMaterial);
    diffuser.position.set(0, 0.22, -2.35);
    carGroup.add(diffuser);

    // Titanium Exhaust Tips with Blued Finish
    [-0.65, -0.5].forEach((exX) => {
      const exhaustGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 16);
      const exhaustMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.95,
        roughness: 0.15
      });
      const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
      exhaust.rotation.x = Math.PI / 2;
      exhaust.position.set(exX, 0.22, -2.48);
      carGroup.add(exhaust);
    });

    // 5. ICONIC NISSAN SKYLINE R34 GT-R REAR WING / SPOILER
    [-0.65, 0.65].forEach((uprightX) => {
      const uprightGeo = new THREE.BoxGeometry(0.05, 0.38, 0.22);
      const upright = new THREE.Mesh(uprightGeo, darkTrimMaterial);
      upright.position.set(uprightX, 0.98, -1.95);
      carGroup.add(upright);
    });

    // Main Carbon Wing Blade with Endplates
    const wingGeo = new THREE.BoxGeometry(1.82, 0.05, 0.36);
    const wing = new THREE.Mesh(wingGeo, carbonMaterial);
    wing.position.set(0, 1.18, -1.98);
    wing.rotation.x = -0.06;
    wing.castShadow = true;
    carGroup.add(wing);

    // Wing Endplates
    [-0.91, 0.91].forEach((epX) => {
      const epGeo = new THREE.BoxGeometry(0.04, 0.22, 0.42);
      const ep = new THREE.Mesh(epGeo, carbonMaterial);
      ep.position.set(epX, 1.18, -1.98);
      carGroup.add(ep);
    });

    // 6. ICONIC QUAD ROUND SKYLINE TAILLIGHTS (SIGNATURE HALO)
    const tailPositions = [
      { x: -0.62, r: 0.12 }, // Outer left
      { x: -0.32, r: 0.09 }, // Inner left
      { x: 0.32, r: 0.09 },  // Inner right
      { x: 0.62, r: 0.12 }   // Outer right
    ];

    tailPositions.forEach((pos) => {
      const tailGeo = new THREE.CylinderGeometry(pos.r, pos.r, 0.06, 32);
      const tailMat = new THREE.MeshStandardMaterial({
        color: 0xff0022,
        emissive: 0xff0022,
        emissiveIntensity: 1.8,
        roughness: 0.2
      });
      lightMaterials.push(tailMat);
      const tailMesh = new THREE.Mesh(tailGeo, tailMat);
      tailMesh.rotation.x = Math.PI / 2;
      tailMesh.position.set(pos.x, 0.62, -2.48);
      carGroup.add(tailMesh);
    });

    // 7. FRONT XENON HEADLIGHTS
    [-0.68, 0.68].forEach((hlX) => {
      const hlHousingGeo = new THREE.BoxGeometry(0.38, 0.14, 0.12);
      const hlHousingMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 });
      const hlHousing = new THREE.Mesh(hlHousingGeo, hlHousingMat);
      hlHousing.position.set(hlX, 0.56, 2.52);
      hlHousing.rotation.y = hlX > 0 ? -0.15 : 0.15;
      carGroup.add(hlHousing);

      // Xenon Bulb
      const bulbGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const bulbMat = new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        emissive: 0x38bdf8,
        emissiveIntensity: 2.2,
        roughness: 0.1
      });
      lightMaterials.push(bulbMat);
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(hlX, 0.56, 2.58);
      carGroup.add(bulb);
    });

    // 8. NISMO LMGT4 6-SPOKE WHEELS & BRAKES
    const wheelPositions = [
      { x: -0.92, z: 1.35 },  // Front Left
      { x: 0.92, z: 1.35 },   // Front Right
      { x: -0.94, z: -1.25 }, // Rear Left
      { x: 0.94, z: -1.25 }   // Rear Right
    ];

    wheelPositions.forEach((pos) => {
      const wheelAssembly = buildNismoWheel(pos.x > 0);
      wheelAssembly.position.set(pos.x, 0.35, pos.z);
      carGroup.add(wheelAssembly);
      wheels.push(wheelAssembly);
    });

    // 9. UNDERGLOW NEON LIGHTS
    underglowLights = [];
    const underPositions = [
      { x: 0, z: 1.2 },
      { x: 0, z: -1.0 },
      { x: -0.7, z: 0 },
      { x: 0.7, z: 0 }
    ];

    underPositions.forEach((p) => {
      const light = new THREE.PointLight(underglowColor, 2.8, 2.6);
      light.position.set(p.x, 0.12, p.z);
      carGroup.add(light);
      underglowLights.push(light);
    });

    // GT-R Front & Rear Chrome Badges
    const badgeGeo = new THREE.BoxGeometry(0.14, 0.06, 0.02);
    const badgeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8, roughness: 0.2 });
    const badgeFront = new THREE.Mesh(badgeGeo, badgeMat);
    badgeFront.position.set(0.35, 0.5, 2.58);
    carGroup.add(badgeFront);

    const badgeRear = new THREE.Mesh(badgeGeo, badgeMat);
    badgeRear.position.set(0.35, 0.65, -2.48);
    carGroup.add(badgeRear);

    scene.add(carGroup);
  }

  function buildNismoWheel(isRightSide) {
    const wheelGroup = new THREE.Group();

    // Rubber Tire with tread profile
    const tireGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.24, 32);
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.1
    });
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Alloy Rim Outer Ring
    const rimRingGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.25, 32);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.92,
      roughness: 0.2
    });
    const rim = new THREE.Mesh(rimRingGeo, rimMat);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // 6-Spoke NISMO LMGT4 Pattern
    const spokeGeo = new THREE.BoxGeometry(0.04, 0.23, 0.05);
    for (let i = 0; i < 6; i++) {
      const spoke = new THREE.Mesh(spokeGeo, rimMat);
      spoke.rotation.x = (i * Math.PI) / 3;
      spoke.position.x = isRightSide ? 0.06 : -0.06;
      wheelGroup.add(spoke);
    }

    // Drilled Disc Rotor
    const discGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.03, 24);
    const discMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.3 });
    const brakeDisc = new THREE.Mesh(discGeo, discMat);
    brakeDisc.rotation.z = Math.PI / 2;
    wheelGroup.add(brakeDisc);

    // Gold Brembo Caliper
    const caliperGeo = new THREE.BoxGeometry(0.06, 0.12, 0.08);
    const caliperMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.3 });
    const caliper = new THREE.Mesh(caliperGeo, caliperMat);
    caliper.position.set(0, 0.14, 0.08);
    wheelGroup.add(caliper);

    return wheelGroup;
  }

  // Interactive Orbit & Touch Controls
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotationY = 0.8;
  let targetRotationX = 0.25;

  function setupControls() {
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      isOrbiting = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(0.05, Math.min(Math.PI / 3, targetRotationX + deltaY * 0.005));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch Support
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        isOrbiting = false;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(0.05, Math.min(Math.PI / 3, targetRotationX + deltaY * 0.005));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Zoom on wheel
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.004;
      const dist = camera.position.length();
      if ((zoomDelta > 0 && dist < 12) || (zoomDelta < 0 && dist > 3.5)) {
        camera.position.multiplyScalar(1 + zoomDelta);
      }
    }, { passive: false });
  }

  // Setup UI Controls (Color pickers, lights, rev mode)
  function setupUIControls() {
    // Color Swatches
    const swatches = document.querySelectorAll('.r34-color-swatch');
    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        const colorKey = swatch.getAttribute('data-color');
        if (COLOR_PRESETS[colorKey]) {
          carColor = COLOR_PRESETS[colorKey];
          carMaterials.forEach((m) => {
            m.color.setHex(carColor);
          });
          swatches.forEach((s) => s.classList.remove('active'));
          swatch.classList.add('active');
        }
      });
    });

    // Headlights Toggle
    const btnLights = document.getElementById('btnR34Lights');
    if (btnLights) {
      btnLights.addEventListener('click', () => {
        headlightsOn = !headlightsOn;
        lightMaterials.forEach((m) => {
          m.emissiveIntensity = headlightsOn ? 1.8 : 0;
        });
        btnLights.classList.toggle('active', headlightsOn);
      });
    }

    // Underglow Neon Toggle
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

    // Auto-Rotate Turntable Toggle
    const btnTurntable = document.getElementById('btnR34Turntable');
    if (btnTurntable) {
      btnTurntable.addEventListener('click', () => {
        isOrbiting = !isOrbiting;
        btnTurntable.classList.toggle('active', isOrbiting);
      });
    }

    // Rev & Boost Engine
    const btnRev = document.getElementById('btnR34Rev');
    if (btnRev) {
      btnRev.addEventListener('click', () => {
        triggerRevMode();
      });
    }

    // Custom .GLB File Import
    const glbInput = document.getElementById('r34GlbInput');
    if (glbInput) {
      glbInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && typeof THREE.GLTFLoader !== 'undefined') {
          loadCustomGlb(file);
        }
      });
    }
  }

  function triggerRevMode() {
    isRevving = true;
    const revSoundText = document.getElementById('r34RevStatus');
    if (revSoundText) {
      revSoundText.textContent = '🔥 8,200 RPM • RB26DETT TWIN TURBO BOOST ACTIVE';
      revSoundText.style.color = '#f97316';
    }

    // Flash exhaust flames
    const originalColors = underglowLights.map((l) => l.color.getHex());
    underglowLights.forEach((l) => {
      l.color.setHex(0xff3300);
      l.intensity = 5.0;
    });

    setTimeout(() => {
      isRevving = false;
      underglowLights.forEach((l, idx) => {
        l.color.setHex(originalColors[idx] || underglowColor);
        l.intensity = underglowOn ? 2.8 : 0;
      });
      if (revSoundText) {
        revSoundText.textContent = '⚡ IDLE: 950 RPM • READY TO LAUNCH';
        revSoundText.style.color = '#38bdf8';
      }
    }, 2400);
  }

  function loadCustomGlb(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      const loader = new THREE.GLTFLoader();
      loader.parse(contents, '', (gltf) => {
        if (carGroup) scene.remove(carGroup);
        carGroup = gltf.scene;
        // Scale and center
        carGroup.scale.set(1.5, 1.5, 1.5);
        carGroup.position.set(0, 0, 0);
        scene.add(carGroup);
      }, (err) => {
        console.error('Error loading custom GLB:', err);
      });
    };
    reader.readAsArrayBuffer(file);
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    requestAnimationFrame(animate);

    if (isOrbiting) {
      targetRotationY += 0.007;
    }

    if (isRevving) {
      // Rapid wheel spin
      wheels.forEach((w) => {
        w.rotation.x += 0.45;
      });
      // Subtle chassis shake
      if (carGroup) {
        carGroup.position.y = Math.sin(Date.now() * 0.08) * 0.015;
      }
    } else {
      // Idle wheel roll
      wheels.forEach((w) => {
        w.rotation.x += 0.02;
      });
      if (carGroup) {
        carGroup.position.y = 0;
      }
    }

    // Camera positioning based on spherical coordinates
    const distance = 7.5;
    camera.position.x = distance * Math.sin(targetRotationY) * Math.cos(targetRotationX);
    camera.position.y = Math.max(0.6, distance * Math.sin(targetRotationX));
    camera.position.z = distance * Math.cos(targetRotationY) * Math.cos(targetRotationX);
    camera.lookAt(0, 0.45, 0);

    renderer.render(scene, camera);
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initR34Viewer);
  } else {
    initR34Viewer();
  }

  window.initR34Viewer = initR34Viewer;
})();
