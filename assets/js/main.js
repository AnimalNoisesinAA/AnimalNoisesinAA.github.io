/* ============================================================
   main.js  ·  Project site animations & interactions
   Dependencies (CDN): GSAP, ScrollTrigger, Lenis
   ============================================================ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* 1. LENIS SMOOTH SCROLL */
  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.7,
    infinite: false,
    gestureOrientation: "vertical"
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  /* 2. GSAP REGISTER PLUGINS */
  gsap.registerPlugin(ScrollTrigger);

  /* 3. SET INITIAL STATES VIA JS (Prevents invisible text bug) */
  gsap.set("[data-reveal]", { opacity: 0, y: 24 });
  gsap.set("[data-reveal-scale]", { opacity: 0, scale: 0.9 });

  /* 4. NAVIGATION */
  const navTop = document.querySelector(".nav-top");
  const heroSection = document.querySelector(".section.cc-hero");

  if (navTop && heroSection) {
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
        gsap.fromTo(overlayLinks,
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

  /* 5. HERO ENTRANCE */
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    gsap.from(heroTitle, { opacity: 0, y: 40, duration: 1, ease: "power4.out" });
    gsap.from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.7, delay: 0.4 });
    gsap.from(".hero-meta", { opacity: 0, y: 20, duration: 0.7, delay: 0.5 });
  }

  /* 6. SCROLL-TRIGGERED REVEALS */
  const revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach((el) => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.75, delay: delay, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" }
    });
  });

  const scaleRevealEls = document.querySelectorAll("[data-reveal-scale]");
  scaleRevealEls.forEach((el) => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.to(el, {
      opacity: 1, scale: 1, duration: 0.8, delay: delay, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
    });
  });

  /* 7. CURSOR / HOVER FX */
  const cursor = document.querySelector(".cursor");
  if (cursor && !window.matchMedia("(hover: none)").matches) {
    document.addEventListener("mousemove", (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
    });

    const darkSections = document.querySelectorAll(".on-dark, .cc-hero, .marquee-section");
    darkSections.forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec, start: "top center", end: "bottom center",
        onEnter: () => cursor.classList.add("on-dark"),
        onLeave: () => cursor.classList.remove("on-dark"),
        onEnterBack: () => cursor.classList.add("on-dark"),
        onLeaveBack: () => cursor.classList.remove("on-dark"),
      });
    });

    const hoverEls = document.querySelectorAll("a, button, .project-card, .method-card");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });
  }

  /* 8. SMOOTH ANCHOR SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.2 });
      }
    });
  });

});
