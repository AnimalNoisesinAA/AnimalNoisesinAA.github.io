/* ============================================================
   main.js  ·  Portfolio site animations & interactions
   Dependencies (CDN): GSAP, ScrollTrigger, SplitText, Lenis
   ============================================================ */

"use strict";

// ── Wait for DOM ────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  /* ──────────────────────────────────────────────────────────
     1. LENIS SMOOTH SCROLL
  ────────────────────────────────────────────────────────── */
  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.7,
    infinite: false,
    gestureOrientation: "vertical",
    normalizeWheel: false,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Hook Lenis into GSAP's ScrollTrigger ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);


  /* ──────────────────────────────────────────────────────────
     2. GSAP REGISTER PLUGINS
  ────────────────────────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger, SplitText);


  /* ──────────────────────────────────────────────────────────
     3. NAVIGATION — scroll behavior
  ────────────────────────────────────────────────────────── */
  const navTop = document.querySelector(".nav-top");
  const heroSection = document.querySelector(".section.cc-hero");

  if (navTop && heroSection) {
    // Start on-dark (transparent over hero)
    navTop.classList.add("on-dark");

    const navObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          navTop.classList.add("on-dark");
          navTop.classList.remove("scrolled");
        } else {
          navTop.classList.remove("on-dark");
          navTop.classList.add("scrolled");
        }
      },
      { threshold: 0.05 }
    );
    navObserver.observe(heroSection);
  }

  /* Mobile nav toggle */
  const hamburger = document.querySelector(".nav-hamburger");
  const navOverlay = document.querySelector(".nav-overlay");
  const overlayLinks = document.querySelectorAll(".nav-overlay-list a");

  if (hamburger && navOverlay) {
    hamburger.addEventListener("click", () => {
      navOverlay.classList.toggle("open");
      const isOpen = navOverlay.classList.contains("open");
      hamburger.setAttribute("aria-expanded", isOpen);
      if (isOpen) {
        lenis.stop();
        // Animate overlay links in
        gsap.fromTo(
          overlayLinks,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: "power3.out", delay: 0.2 }
        );
      } else {
        lenis.start();
      }
    });

    overlayLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navOverlay.classList.remove("open");
        lenis.start();
      });
    });
  }


  /* ──────────────────────────────────────────────────────────
     4. HERO SPLIT TEXT ENTRANCE
  ────────────────────────────────────────────────────────── */
  const heroTitle = document.querySelector(".hero-title");

  if (heroTitle && typeof SplitText !== "undefined") {
    // Split into chars with clip-mask wrapping (same as reference)
    const split = new SplitText(heroTitle, {
      type: "chars,words",
      mask: "chars",
      charsClass: "split-letter",
    });

    // Entrance tl
    const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

    heroTl
      .from(split.chars, {
        yPercent: 110,
        duration: 1,
        stagger: { each: 0.035, from: "start" },
      })
      .from(
        ".hero-eyebrow",
        { opacity: 0, y: 16, duration: 0.6 },
        "-=0.5"
      )
      .from(
        ".hero-subtitle",
        { opacity: 0, y: 20, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      )
      .from(
        ".hero-meta",
        { opacity: 0, y: 16, duration: 0.5 },
        "-=0.4"
      )
      .from(
        ".hero-scroll-indicator",
        { opacity: 0, duration: 0.5 },
        "-=0.2"
      );
  } else if (heroTitle) {
    // Fallback if SplitText unavailable
    gsap.from(heroTitle, { opacity: 0, y: 40, duration: 1, ease: "power4.out" });
    gsap.from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.7, delay: 0.4 });
  }


  /* ──────────────────────────────────────────────────────────
     5. SCROLL-TRIGGERED REVEALS — generic [data-reveal]
  ────────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll("[data-reveal]");

  revealEls.forEach((el) => {
    const delay = parseFloat(el.dataset.delay || 0);
    const duration = parseFloat(el.dataset.duration || 0.75);

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  /* Scale reveal for images */
  const scaleRevealEls = document.querySelectorAll("[data-reveal-scale]");
  scaleRevealEls.forEach((el) => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });


  /* ──────────────────────────────────────────────────────────
     6. SECTION HEADINGS — SplitText line-by-line reveal
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll("[data-split-heading]").forEach((el) => {
    if (typeof SplitText === "undefined") return;

    const split = new SplitText(el, {
      type: "lines",
      linesClass: "split-line",
    });

    gsap.from(split.lines, {
      opacity: 0,
      y: 28,
      duration: 0.75,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });


  /* ──────────────────────────────────────────────────────────
     7. PROJECT CARDS — staggered reveal
  ────────────────────────────────────────────────────────── */
  const projectCards = document.querySelectorAll(".project-card");

  if (projectCards.length) {
    gsap.from(projectCards, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".projects-grid",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }


  /* ──────────────────────────────────────────────────────────
     8. SKILL PILLS — staggered reveal
  ────────────────────────────────────────────────────────── */
  const skillPills = document.querySelectorAll(".skill-pill");

  if (skillPills.length) {
    gsap.from(skillPills, {
      opacity: 0,
      scale: 0.85,
      duration: 0.45,
      stagger: 0.04,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: ".skills-right",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }


  /* ──────────────────────────────────────────────────────────
     9. EXPERIENCE ITEMS — staggered reveal
  ────────────────────────────────────────────────────────── */
  const expItems = document.querySelectorAll(".experience-item");

  if (expItems.length) {
    gsap.from(expItems, {
      opacity: 0,
      x: -20,
      duration: 0.6,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".experience-list",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }


  /* ──────────────────────────────────────────────────────────
     10. INTRO STATS COUNTER
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll(".intro-stat-number[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: function () {
            const v = this.targets()[0].val;
            el.textContent = prefix + (Number.isInteger(target)
              ? Math.round(v)
              : v.toFixed(1)) + suffix;
          },
        });
      },
    });
  });


  /* ──────────────────────────────────────────────────────────
     11. CTA SECTION — large heading entrance
  ────────────────────────────────────────────────────────── */
  const ctaHeading = document.querySelector(".cta-heading");
  if (ctaHeading && typeof SplitText !== "undefined") {
    const split = new SplitText(ctaHeading, {
      type: "lines",
      linesClass: "split-line",
    });

    gsap.from(split.lines, {
      opacity: 0,
      y: 36,
      duration: 0.9,
      stagger: 0.15,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ctaHeading,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }


  /* ──────────────────────────────────────────────────────────
     12. MARQUEE — double content for seamless loop
  ────────────────────────────────────────────────────────── */
  const marqueeTrack = document.querySelector(".marquee-track");
  if (marqueeTrack) {
    // Clone children to create seamless loop
    const clone = marqueeTrack.cloneNode(true);
    marqueeTrack.parentElement.appendChild(clone);
  }


  /* ──────────────────────────────────────────────────────────
     13. CUSTOM CURSOR
  ────────────────────────────────────────────────────────── */
  const cursor = document.querySelector(".cursor");
  if (cursor && window.matchMedia("(hover: hover)").matches) {
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth follow
    gsap.ticker.add(() => {
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;
      gsap.set(cursor, { x: curX, y: curY });
    });

    // Toggle dark/light based on background
    const darkSections = document.querySelectorAll(
      ".section.cc-hero, .section.cc-cta, .site-footer"
    );

    darkSections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onEnter: () => cursor.classList.add("on-dark"),
        onLeave: () => cursor.classList.remove("on-dark"),
        onEnterBack: () => cursor.classList.add("on-dark"),
        onLeaveBack: () => cursor.classList.remove("on-dark"),
      });
    });

    // Hover state on interactive elements
    const hoverEls = document.querySelectorAll(
      "a, button, .project-card, .skill-pill, .btn-primary, .btn-secondary"
    );
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });
  }


  /* ──────────────────────────────────────────────────────────
     14. SMOOTH ANCHOR SCROLL (for nav links)
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.2 });
      }
    });
  });


  /* ──────────────────────────────────────────────────────────
     15. PARALLAX on hero bg elements
  ────────────────────────────────────────────────────────── */
  gsap.to(".hero-title", {
    yPercent: -15,
    ease: "none",
    scrollTrigger: {
      trigger: ".section.cc-hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

});
