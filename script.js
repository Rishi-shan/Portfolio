const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (window.gsap) {
  gsap.set([".site-header", ".hero-topline", ".eyebrow", ".hero h1", ".hero-meta", ".hero-stats", ".scroll-cue"], { opacity: 0, y: 55 });
  const introTimeline = gsap.timeline({ delay: 2, defaults: { ease: "power3.out" } })
    .to(".site-header", { opacity: 1, y: 0, duration: 0.8 })
    .to(".hero-topline", { opacity: 1, y: 0, duration: 0.7 }, "-=0.45")
    .to(".eyebrow", { opacity: 1, y: 0, duration: 0.7 }, "-=0.35")
    .to(".hero h1", { opacity: 1, y: 0, duration: 1 }, "-=0.45")
    .to(".hero-meta", { opacity: 1, y: 0, duration: 0.8 }, "-=0.55")
    .to(".hero-stats", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
    .to(".scroll-cue", { opacity: 1, y: 0, duration: 0.7 }, "-=0.45");
  introTimeline.timeScale(0.68);
}

const scrollCue = document.querySelector(".scroll-cue");
if (scrollCue) {
  let cueIsAtTop = true;

  const syncScrollCue = () => {
    const nextCueIsAtTop = window.scrollY <= 80;
    if (nextCueIsAtTop === cueIsAtTop) return;
    cueIsAtTop = nextCueIsAtTop;

    if (window.gsap) {
      gsap.killTweensOf(scrollCue);
      gsap.to(scrollCue, {
        opacity: cueIsAtTop ? 1 : 0,
        duration: 0.35,
        pointerEvents: cueIsAtTop ? "auto" : "none"
      });
    } else {
      scrollCue.classList.toggle("is-hidden", !cueIsAtTop);
    }
  };

  window.addEventListener("scroll", syncScrollCue, { passive: true });
}

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

if (cursorDot && cursorRing && window.matchMedia("(pointer:fine)").matches) {
  let pointerX = -100;
  let pointerY = -100;
  let ringX = pointerX;
  let ringY = pointerY;

  const renderCursor = () => {
    ringX += (pointerX - ringX) * 0.42;
    ringY += (pointerY - ringY) * 0.42;
    cursorDot.style.left = `${ringX}px`;
    cursorDot.style.top = `${ringY}px`;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  };

  document.addEventListener("mousemove", event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorDot.style.opacity = 1;
    cursorRing.style.opacity = 1;
  });

  document.addEventListener("mouseleave", () => {
    cursorDot.style.opacity = 0;
    cursorRing.style.opacity = 0;
  });

  document.querySelectorAll("a, .project-card").forEach(element => {
    element.addEventListener("mouseenter", () => {
      cursorRing.style.width = "54px";
      cursorRing.style.height = "54px";
      cursorRing.style.borderColor = "rgba(226,27,35,.9)";
    });
    element.addEventListener("mouseleave", () => {
      cursorRing.style.width = "30px";
      cursorRing.style.height = "30px";
      cursorRing.style.borderColor = "rgba(255,255,255,.5)";
    });
  });

  renderCursor();
}

// Subtle hero parallax — disabled on touch devices.
if (window.matchMedia("(pointer:fine)").matches) {
  const bg = document.querySelector(".hero-bg");
  window.addEventListener("scroll", () => {
    const y = Math.min(window.scrollY * 0.12, 100);
    bg.style.transform = `scale(1.02) translateY(${y}px)`;
  }, { passive: true });
}

// Reveal cards when they enter the viewport.
const revealTargets = document.querySelectorAll(".project-card, .process-item, .edu-row, .tags span");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 45, 250)}ms`;
  observer.observe(el);
});
