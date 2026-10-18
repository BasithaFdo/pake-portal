/**
 * SkyLine Hub - Modern Interactive Landing Page Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initScrollEffects();
  initCardTilt();
  initTabSwitching();
  initCopyButtons();
  initFaqAccordion();
  initNumberCounters();
  initTerminalPing();
});

/* -------------------------------------------------------------
 * 1. High Performance Particle Canvas System
 * ----------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
  const mouse = { x: null, y: null, radius: 140 };

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
      this.alpha = Math.random() * 0.5 + 0.2;
      this.baseAlpha = this.alpha;
      this.color = Math.random() > 0.4 ? 'rgba(96, 165, 250,' : 'rgba(168, 85, 247,';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
          this.alpha = Math.min(1, this.baseAlpha + 0.4);
        } else {
          this.alpha = this.baseAlpha;
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

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const lineAlpha = (1 - dist / 110) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(147, 197, 253, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* -------------------------------------------------------------
 * 2. Scroll Progress Bar & Nav Header Blur
 * ----------------------------------------------------------- */
function initScrollEffects() {
  const header = document.querySelector('.nav-header');
  const progressBar = document.querySelector('.scroll-progress-bar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (header) {
      if (scrollY > 25) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

/* -------------------------------------------------------------
 * 3. 3D Tilt & Mouse Spotlight for Feature Cards
 * ----------------------------------------------------------- */
function initCardTilt() {
  const cards = document.querySelectorAll('.feature-card, .hero-mockup');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (card.classList.contains('hero-mockup')) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (card.classList.contains('hero-mockup')) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      }
    });
  });
}

/* -------------------------------------------------------------
 * 4. Interactive Architecture Code Tabs
 * ----------------------------------------------------------- */
function initTabSwitching() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 5. Copy Code Snippet Buttons
 * ----------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.architecture-tabs-container');
      const activePane = container ? container.querySelector('.tab-pane.active') : null;
      if (!activePane) return;

      const codeElement = activePane.querySelector('pre') || activePane;
      const textToCopy = codeElement.innerText;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span style="color: #10b981">Copied!</span>
        `;
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2000);
      }).catch((err) => {
        console.error('Failed to copy: ', err);
      });
    });
  });
}

/* -------------------------------------------------------------
 * 6. FAQ Accordion
 * ----------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
        }
      });

      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 7. Animated Number Counters
 * ----------------------------------------------------------- */
function initNumberCounters() {
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseFloat(target.getAttribute('data-counter-target'));
        const prefix = target.getAttribute('data-counter-prefix') || '';
        const suffix = target.getAttribute('data-counter-suffix') || '';
        const isDecimal = finalValue % 1 !== 0;
        const duration = 1600;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = easeProgress * finalValue;

          if (isDecimal) {
            target.textContent = `${prefix}${currentValue.toFixed(2)}${suffix}`;
          } else {
            target.textContent = `${prefix}${Math.floor(currentValue).toLocaleString()}${suffix}`;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            target.textContent = `${prefix}${isDecimal ? finalValue.toFixed(2) : finalValue.toLocaleString()}${suffix}`;
          }
        }

        requestAnimationFrame(updateCount);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------
 * 8. Simulated Terminal Ping
 * ----------------------------------------------------------- */
function initTerminalPing() {
  const latencyDisplay = document.getElementById('live-latency');
  const queriesDisplay = document.getElementById('live-queries');
  if (!latencyDisplay) return;

  setInterval(() => {
    const randomLatency = Math.floor(Math.random() * 6) + 11; // 11-16ms
    latencyDisplay.textContent = `${randomLatency}ms`;
    if (queriesDisplay) {
      const current = parseInt(queriesDisplay.textContent.replace(/,/g, ''), 10) || 12840;
      queriesDisplay.textContent = (current + Math.floor(Math.random() * 3) + 1).toLocaleString();
    }
  }, 3500);
}
