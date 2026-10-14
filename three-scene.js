/**
 * Aakash Kumar Portfolio - 3D Motion Engine
 * Real-time Three.js WebGL Particle Constellation & Geometrical Cyber Core
 */

(function () {
  'use strict';

  const container = document.getElementById('webgl-container');
  const fpsDisplay = document.getElementById('fps-counter');
  const meshDisplay = document.getElementById('mesh-counter');
  const geometryToggleBtn = document.getElementById('geometry-toggle');

  if (!container) return;

  // Verify Three.js availability or fallback
  if (typeof THREE === 'undefined') {
    initCanvasFallback();
    return;
  }

  let scene, camera, renderer;
  let particles, particleGeo, particleMat;
  let cyberCoreGroup, coreWireframe, coreGlow;
  let currentShapeIndex = 0;
  const shapeNames = ['Torus Knot', 'Cyber Icosahedron', 'Quantum Sphere', 'Hypercube Cage'];

  // Mouse & Scroll coordinates
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = 0;
  let targetScrollY = 0;

  // Performance tracking
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;

  function initThree() {
    // 1. Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.0018);

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 45;

    // 3. Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x121215, 1.8);
    scene.add(ambientLight);

    const orangeLight = new THREE.PointLight(0xff5722, 3.8, 120);
    orangeLight.position.set(20, 20, 20);
    scene.add(orangeLight);

    const amberLight = new THREE.PointLight(0xfbbf24, 2.5, 100);
    amberLight.position.set(-20, -20, 20);
    scene.add(amberLight);

    // 5. Build 3D Particle Constellation
    createParticleConstellation();

    // 6. Build Cybernetic 3D Core
    cyberCoreGroup = new THREE.Group();
    buildCyberShape(currentShapeIndex);
    scene.add(cyberCoreGroup);

    // 7. Event Listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });

    if (geometryToggleBtn) {
      geometryToggleBtn.addEventListener('click', toggleGeometry);
    }

    // 8. Start Animation Loop
    animate();
  }

  function createParticleConstellation() {
    const particleCount = 2200;
    particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const orangeColor = new THREE.Color(0xff5722);
    const amberColor = new THREE.Color(0xff9800);
    const goldColor = new THREE.Color(0xfbbf24);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Distribute in a spherical galaxy spread
      const radius = 30 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);

      // Color variation
      const rand = Math.random();
      let chosenColor;
      if (rand < 0.45) chosenColor = orangeColor;
      else if (rand < 0.75) chosenColor = amberColor;
      else if (rand < 0.9) chosenColor = goldColor;
      else chosenColor = whiteColor;

      colors[i] = chosenColor.r;
      colors[i + 1] = chosenColor.g;
      colors[i + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material with round glow shader texture simulation
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,87,34,0.85)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);

    particleMat = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
  }

  function buildCyberShape(index) {
    // Clear existing meshes
    while (cyberCoreGroup.children.length > 0) {
      const obj = cyberCoreGroup.children[0];
      if (obj.geometry) obj.geometry.dispose();
      cyberCoreGroup.remove(obj);
    }

    let geometry;
    switch (index) {
      case 0:
        // Torus Knot
        geometry = new THREE.TorusKnotGeometry(9, 2.5, 120, 24, 2, 3);
        break;
      case 1:
        // Cyber Icosahedron
        geometry = new THREE.IcosahedronGeometry(12, 1);
        break;
      case 2:
        // Quantum Sphere
        geometry = new THREE.SphereGeometry(11, 28, 28);
        break;
      case 3:
        // Box Cage
        geometry = new THREE.BoxGeometry(14, 14, 14, 3, 3, 3);
        break;
      default:
        geometry = new THREE.TorusKnotGeometry(9, 2.5, 120, 24, 2, 3);
    }

    // Outer wireframe with vibrant orange glow
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xff5722,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending
    });
    coreWireframe = new THREE.Mesh(geometry, wireframeMat);
    cyberCoreGroup.add(coreWireframe);

    // Inner glowing core with amber gold
    const innerGeo = geometry.clone();
    innerGeo.scale(0.85, 0.85, 0.85);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });
    coreGlow = new THREE.Mesh(innerGeo, innerMat);
    cyberCoreGroup.add(coreGlow);

    // Position subtly to the right on desktop
    cyberCoreGroup.position.set(14, 0, -10);

    if (meshDisplay) {
      meshDisplay.textContent = shapeNames[index];
    }
  }

  function toggleGeometry() {
    currentShapeIndex = (currentShapeIndex + 1) % shapeNames.length;
    buildCyberShape(currentShapeIndex);

    // Audio SFX trigger if available
    if (window.soundFX && window.soundFX.playCyberShift) {
      window.soundFX.playCyberShift();
    }
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Responsive position shift
    if (window.innerWidth < 1024) {
      cyberCoreGroup.position.set(0, 5, -25);
    } else {
      cyberCoreGroup.position.set(12, 0, -10);
    }
  }

  function onMouseMove(e) {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onScroll() {
    targetScrollY = window.scrollY;
  }

  function animate() {
    requestAnimationFrame(animate);

    // Calculate FPS
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (now - lastTime));
      if (fpsDisplay) fpsDisplay.textContent = fps;
      frameCount = 0;
      lastTime = now;
    }

    // Smooth damping (lerp)
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;
    scrollY += (targetScrollY - scrollY) * 0.08;

    // Camera parallax reaction
    camera.position.x = mouse.x * 6;
    camera.position.y = mouse.y * 6 - (scrollY * 0.02);
    camera.lookAt(0, 0, 0);

    // Rotate Particles
    if (particles) {
      particles.rotation.y += 0.0007;
      particles.rotation.x += 0.0003;
    }

    // Rotate and pulse cyber core
    if (cyberCoreGroup) {
      cyberCoreGroup.rotation.x += 0.006 + (mouse.y * 0.01);
      cyberCoreGroup.rotation.y += 0.008 + (mouse.x * 0.01);
      cyberCoreGroup.rotation.z += 0.003;

      // Pulse breathing scale
      const time = now * 0.002;
      const scale = 1 + Math.sin(time) * 0.06;
      cyberCoreGroup.scale.set(scale, scale, scale);
    }

    renderer.render(scene, camera);
  }

  /**
   * Graceful 2D/WebGL Canvas Fallback in case Three.js CDN fails to load
   */
  function initCanvasFallback() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const dots = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(0, 243, 255, ' : 'rgba(168, 85, 247, '
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(0, 243, 255, ${0.2 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      dots.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color + '0.7)';
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }
    draw();
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThree);
  } else {
    initThree();
  }
})();
