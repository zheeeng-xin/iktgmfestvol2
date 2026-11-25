/**
 * IKTGM FEST VOL. 2 — Choreographed Motion System
 * Powered by Lenis, GSAP, ScrollTrigger & Motion.dev
 */

(function () {
  'use strict';

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================================
  // 1. Lenis Smooth Scroll Setup
  // =========================================================================
  let lenisInstance = null;

  if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenisInstance;

    // Connect Lenis to GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      lenisInstance.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Anchor Link Smooth Navigation via Lenis
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        // Biarkan drawer mobile ditangani oleh handler khususnya agar animasi penutupan menu selesai lebih dulu
        if (this.closest('.mobile-drawer')) return;
        
        const href = this.getAttribute('href');
        if (href && href !== '#' && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenisInstance.scrollTo(target, { offset: -72 });
          }
        }
      });
    });
  }

  // If user prefers reduced motion, leave elements naturally visible and return
  if (prefersReducedMotion) {
    return;
  }

  // =========================================================================
  // 2. GSAP & ScrollTrigger Animations
  // =========================================================================
  if (typeof gsap === 'undefined') return;

  // Hero Entrance Timeline
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTL
    .from('.hero-meta-row', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.2
    })
    .from('.hero-title .title-line', {
      opacity: 0,
      y: 36,
      duration: 0.9,
      stagger: 0.15
    }, '-=0.5')
    .from('.hero-description', {
      opacity: 0,
      y: 24,
      duration: 0.8
    }, '-=0.6')
    .from('.hero-actions .btn', {
      opacity: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.1
    }, '-=0.5')
    .from('.hero-logo-showcase', {
      opacity: 0,
      scale: 0.85,
      rotation: -8,
      duration: 1,
      ease: 'back.out(1.4)'
    }, '-=0.7')
    .from('.hero-card-preview', {
      opacity: 0,
      y: 30,
      duration: 0.9
    }, '-=0.8')
    .from('.petal-item', {
      opacity: 0,
      scale: 0.6,
      stagger: 0.08,
      duration: 1
    }, '-=0.8')
    .from('.hero-scroll-indicator', {
      opacity: 0,
      y: 10,
      duration: 0.8
    }, '-=0.4');

  // Parallax on Floating Petals using ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    const petals = document.querySelectorAll('.petal-item');
    petals.forEach((petal) => {
      const speed = parseFloat(petal.getAttribute('data-speed')) || 0.2;
      gsap.to(petal, {
        y: () => speed * 300,
        rotation: () => speed * 120,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    });

    // Section Scroll Reveals: Intro / Story
    gsap.from('.intro-text-column', {
      scrollTrigger: {
        trigger: '.intro-section',
        start: 'top 80%',
      },
      opacity: 0,
      y: 36,
      duration: 0.9,
      ease: 'power2.out'
    });

    gsap.from('.intro-stats-column .stat-card', {
      scrollTrigger: {
        trigger: '.intro-section',
        start: 'top 75%',
      },
      opacity: 0,
      y: 28,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out'
    });

    // Highlights Cards Reveal
    gsap.from('.highlight-card', {
      scrollTrigger: {
        trigger: '.highlights-section',
        start: 'top 75%',
      },
      opacity: 0,
      y: 32,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    });

    // Merch Cards Reveal
    gsap.from('.product-card', {
      scrollTrigger: {
        trigger: '.merch-section',
        start: 'top 75%',
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power2.out'
    });

    // Sponsor Cards Reveal
    gsap.from('.tier-card', {
      scrollTrigger: {
        trigger: '.sponsor-section',
        start: 'top 75%',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out'
    });

    gsap.from('.sponsor-form-wrapper', {
      scrollTrigger: {
        trigger: '.sponsor-section',
        start: 'top 70%',
      },
      opacity: 0,
      y: 36,
      duration: 0.9,
      ease: 'power2.out'
    });

    // Gallery Items Reveal
    gsap.from('.gallery-item', {
      scrollTrigger: {
        trigger: '.gallery-section',
        start: 'top 80%',
      },
      opacity: 0,
      scale: 0.94,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power2.out'
    });

    // Final CTA Box Reveal
    gsap.from('.final-cta-container', {
      scrollTrigger: {
        trigger: '.final-cta-section',
        start: 'top 85%',
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out'
    });
  }

  // =========================================================================
  // 3. Motion (motion.dev) Micro-Interactions
  // =========================================================================
  // Add subtle interactive spring reactions to primary action buttons
  if (typeof Motion !== 'undefined' && Motion.animate) {
    const interactiveBtns = document.querySelectorAll('.btn-primary, .btn-secondary');
    interactiveBtns.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        Motion.animate(btn, { scale: 1.02 }, { duration: 0.2, easing: [0.16, 1, 0.3, 1] });
      });
      btn.addEventListener('mouseleave', () => {
        Motion.animate(btn, { scale: 1 }, { duration: 0.2, easing: [0.16, 1, 0.3, 1] });
      });
      btn.addEventListener('mousedown', () => {
        Motion.animate(btn, { scale: 0.97 }, { duration: 0.1 });
      });
      btn.addEventListener('mouseup', () => {
        Motion.animate(btn, { scale: 1.02 }, { duration: 0.15 });
      });
    });
  }

  // =========================================================================
  // 4. Falling Petals (Scroll-Driven) - Two Layers: Behind & In Front
  // =========================================================================
  function initFallingPetals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Layer 1: Behind content (z-index: 0)
    const backContainer = document.createElement('div');
    backContainer.className = 'falling-petals-back';
    backContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    `;
    document.body.insertBefore(backContainer, document.body.firstChild);

    // Layer 2: In front of content (z-index: 1000)
    const frontContainer = document.createElement('div');
    frontContainer.className = 'falling-petals-front';
    frontContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
      overflow: hidden;
    `;
    document.body.appendChild(frontContainer);

    const BACK_COUNT = 20;
    const FRONT_COUNT = 4;
    const allPetals = [];

    function createPetals(count, container, baseZ) {
      const petals = [];
      for (let i = 0; i < count; i++) {
        const petal = document.createElement('img');
        petal.src = 'assets/graphics/petal.svg';
        petal.alt = '';
        const size = 16 + Math.random() * 22;
        const opacity = 0.25 + Math.random() * 0.3;
        petal.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: auto;
          opacity: ${opacity};
          transform-origin: center center;
          will-change: transform, opacity;
        `;
        container.appendChild(petal);

        petals.push({
          el: petal,
          startX: Math.random() * window.innerWidth,
          delay: Math.random() * 3,
          sway: 40 + Math.random() * 120,
          rotationSpeed: 200 + Math.random() * 600,
          size,
          baseZ,
        });
      }
      return petals;
    }

    allPetals.push(...createPetals(BACK_COUNT, backContainer, 0));
    allPetals.push(...createPetals(FRONT_COUNT, frontContainer, 1000));

    function animatePetals() {
      const scrollY = window.lenis ? window.lenis.scroll : window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);

      allPetals.forEach((p, i) => {
        const easedProgress = Math.min((progress + p.delay * 0.15) % 1, 1);
        const y = easedProgress * (window.innerHeight + p.size + 120);
        const x = p.startX + Math.sin(easedProgress * Math.PI * 3.5 + i * 0.8) * p.sway * easedProgress;
        const rotation = easedProgress * p.rotationSpeed;

        gsap.set(p.el, {
          x: x - p.size / 2,
          y: y - p.size / 2,
          rotation: rotation,
        });
      });

      requestAnimationFrame(animatePetals);
    }

    animatePetals();

    window.addEventListener('resize', () => {
      allPetals.forEach(p => {
        p.startX = Math.random() * window.innerWidth;
      });
    });
  }

  // Initialize after Lenis is ready
  if (!prefersReducedMotion) {
    if (typeof Lenis !== 'undefined') {
      setTimeout(initFallingPetals, 100);
    } else {
      document.addEventListener('DOMContentLoaded', initFallingPetals);
    }
  }

})();
