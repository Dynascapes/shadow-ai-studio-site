const header = document.querySelector("[data-site-header]");
const menuButton = document.querySelector("[data-menu-button]");
const primaryNav = document.querySelector("[data-primary-nav]");
const briefForm = document.querySelector("[data-brief-form]");
const briefSelect = document.querySelector("[data-brief-select]");
const packageButtons = document.querySelectorAll("[data-package]");
const pageProgress = document.querySelector("[data-page-progress]");
const decodeText = document.querySelector("[data-decode]");
const motionCard = document.querySelector("[data-motion-card]");
const pathButtons = document.querySelectorAll("[data-path-step]");
const findingPanel = document.querySelector("[data-finding-panel]");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
const motionAllowed = !reducedMotionQuery.matches;

const packages = {
  audit: {
    name: "Lead Leak Audit",
    price: "$49 USD",
    time: "1\u20133 business days"
  },
  cta: {
    name: "Mobile CTA Cleanup",
    price: "$99 USD",
    time: "3\u20137 business days"
  },
  followup: {
    name: "Follow-Up Setup",
    price: "$149 USD",
    time: "Scope dependent"
  },
  form: {
    name: "Intake Form Setup",
    price: "$299 USD",
    time: "Scope dependent"
  },
  unsure: {
    name: "Starting-point recommendation",
    price: "Scope first",
    time: "Confirmed in writing"
  }
};

const findingDetails = {
  visit: {
    index: "01",
    kicker: "Discovery signal",
    title: "The offer is not clear quickly enough",
    impact: "Medium impact",
    tone: "clear"
  },
  tap: {
    index: "02",
    kicker: "Mobile friction",
    title: "The strongest quote action is buried",
    impact: "Med-high impact",
    tone: "warning"
  },
  submit: {
    index: "03",
    kicker: "Submission friction",
    title: "The next step after submit is unclear",
    impact: "High impact",
    tone: "warning"
  },
  reply: {
    index: "04",
    kicker: "Highest-priority leak",
    title: "No instant follow-up after the contact form",
    impact: "High impact",
    tone: "critical"
  }
};

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const setProgressState = () => {
  if (!pageProgress) return;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(Math.max(window.scrollY / scrollRange, 0), 1) : 0;
  pageProgress.style.transform = `scaleX(${progress})`;
};

const closeMenu = () => {
  if (!menuButton || !primaryNav) return;
  menuButton.setAttribute("aria-expanded", "false");
  primaryNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

const openMenu = () => {
  if (!menuButton || !primaryNav) return;
  menuButton.setAttribute("aria-expanded", "true");
  primaryNav.classList.add("is-open");
  document.body.classList.add("menu-open");
};

const updateBriefSummary = (key) => {
  const selectedPackage = packages[key] || packages.audit;
  const name = document.querySelector("[data-brief-name]");
  const price = document.querySelector("[data-brief-price]");
  const time = document.querySelector("[data-brief-time]");

  if (name) name.textContent = selectedPackage.name;
  if (price) price.textContent = selectedPackage.price;
  if (time) time.textContent = selectedPackage.time;
};

const runDecode = () => {
  if (!decodeText) return;

  const target = decodeText.dataset.decode || decodeText.textContent || "";
  if (!motionAllowed) {
    decodeText.textContent = target;
    return;
  }

  const glyphs = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const totalFrames = 18;
  let frame = 0;

  decodeText.classList.add("is-decoding");

  const drawFrame = () => {
    const resolvedThrough = Math.floor((frame / totalFrames) * target.length);
    const scrambleThrough = resolvedThrough + 4;

    decodeText.textContent = Array.from(target, (character, index) => {
      if (!/[a-z0-9]/i.test(character)) return character;
      if (index < resolvedThrough || index > scrambleThrough) return character;
      return glyphs[Math.floor(Math.random() * glyphs.length)];
    }).join("");

    frame += 1;
    if (frame <= totalFrames) {
      window.setTimeout(drawFrame, 30);
      return;
    }

    decodeText.textContent = target;
    decodeText.classList.remove("is-decoding");
  };

  drawFrame();
};

const prepareReveals = () => {
  const revealGroups = [
    ".hero-copy > *",
    ".hero-proof",
    ".trust-grid > *",
    ".section-heading > *",
    ".leak-grid > *",
    ".sample-copy > *",
    ".audit-preview",
    ".pricing-heading > *",
    ".package-grid > *",
    ".process-intro > *",
    ".process-list > *",
    ".brief-copy > *",
    ".brief-form",
    ".faq-intro > *",
    ".faq-list > *",
    ".final-cta-inner > *"
  ];

  revealGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node, index) => {
      const usesScale = node.matches(".hero-proof, .leak-card, .audit-preview, .package-card, .brief-form");
      node.dataset.reveal = usesScale ? "scale" : "up";
      node.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 72}ms`);
    });
  });

  const revealNodes = document.querySelectorAll("[data-reveal]");
  if (!motionAllowed || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  revealNodes.forEach((node) => observer.observe(node));
};

let findingTimer;

const selectPathStep = (key) => {
  const detail = findingDetails[key];
  if (!detail || !findingPanel) return;

  pathButtons.forEach((button) => {
    const selected = button.dataset.pathStep === key;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  window.clearTimeout(findingTimer);
  findingPanel.classList.add("is-changing");

  findingTimer = window.setTimeout(() => {
    const index = findingPanel.querySelector("[data-finding-index]");
    const kicker = findingPanel.querySelector("[data-finding-kicker]");
    const title = findingPanel.querySelector("[data-finding-title]");
    const impact = findingPanel.querySelector("[data-finding-impact]");

    if (index) index.textContent = detail.index;
    if (kicker) kicker.textContent = detail.kicker;
    if (title) title.textContent = detail.title;
    if (impact) impact.textContent = detail.impact;
    findingPanel.dataset.tone = detail.tone;
    findingPanel.classList.remove("is-changing");
  }, motionAllowed ? 110 : 0);
};

const addPointerEffects = () => {
  if (!motionAllowed || !finePointerQuery.matches) return;

  if (motionCard) {
    motionCard.addEventListener("pointermove", (event) => {
      const bounds = motionCard.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;

      motionCard.classList.add("is-pointer-active");
      motionCard.style.setProperty("--tilt-x", `${((0.5 - y) * 4).toFixed(2)}deg`);
      motionCard.style.setProperty("--tilt-y", `${(-5 + (x - 0.5) * 5).toFixed(2)}deg`);
      motionCard.style.setProperty("--glow-x", `${(x * 100).toFixed(1)}%`);
      motionCard.style.setProperty("--glow-y", `${(y * 100).toFixed(1)}%`);
    });

    motionCard.addEventListener("pointerleave", () => {
      motionCard.classList.remove("is-pointer-active");
      motionCard.style.setProperty("--tilt-x", "0deg");
      motionCard.style.setProperty("--tilt-y", "-5deg");
      motionCard.style.setProperty("--glow-x", "70%");
      motionCard.style.setProperty("--glow-y", "20%");
    });
  }

  document.querySelectorAll(".package-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.classList.add("is-pointer-active");
      card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-pointer-active");
      card.style.removeProperty("--pointer-x");
      card.style.removeProperty("--pointer-y");
    });
  });
};

setHeaderState();
setProgressState();

let viewportFrame = 0;
const requestViewportUpdate = () => {
  if (viewportFrame) return;
  viewportFrame = window.requestAnimationFrame(() => {
    setHeaderState();
    setProgressState();
    viewportFrame = 0;
  });
};

window.addEventListener("scroll", requestViewportUpdate, { passive: true });
window.addEventListener("resize", requestViewportUpdate, { passive: true });

if (motionAllowed) document.documentElement.classList.add("motion-enabled");
prepareReveals();
addPointerEffects();
window.setTimeout(runDecode, motionAllowed ? 420 : 0);

pathButtons.forEach((button, index) => {
  button.addEventListener("click", () => selectPathStep(button.dataset.pathStep));
  button.addEventListener("keydown", (event) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;

    event.preventDefault();
    let targetIndex = index;
    if (event.key === "ArrowLeft") targetIndex = (index - 1 + pathButtons.length) % pathButtons.length;
    if (event.key === "ArrowRight") targetIndex = (index + 1) % pathButtons.length;
    if (event.key === "Home") targetIndex = 0;
    if (event.key === "End") targetIndex = pathButtons.length - 1;

    const target = pathButtons[targetIndex];
    target?.focus();
    if (target?.dataset.pathStep) selectPathStep(target.dataset.pathStep);
  });
});

if (menuButton && primaryNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMenu();
    else openMenu();
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeMenu();
  });
}

if (briefSelect) {
  briefSelect.addEventListener("change", () => {
    updateBriefSummary(briefSelect.value);
  });
  updateBriefSummary(briefSelect.value);
}

packageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.package;
    if (briefSelect && packages[key]) briefSelect.value = key;
    updateBriefSummary(key);
    document.querySelector("#brief")?.scrollIntoView({
      behavior: motionAllowed ? "smooth" : "auto",
      block: "start"
    });
  });
});

if (briefForm) {
  briefForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(briefForm);
    const key = String(formData.get("service") || "audit");
    const selectedPackage = packages[key] || packages.audit;
    const business = String(formData.get("business") || "").trim();
    const website = String(formData.get("url") || "").trim();
    const goal = String(formData.get("goal") || "").trim();
    const timeline = String(formData.get("timeline") || "Flexible");

    const subject = selectedPackage.name + " request";
    const body = [
      "Hi Quote Intake Studio,",
      "",
      "I'd like help with: " + selectedPackage.name,
      "Business type: " + (business || "Not added yet"),
      "Public website: " + (website || "Not added yet"),
      "What visitors should do / what feels weak:",
      goal || "Not added yet",
      "",
      "Ideal timeline: " + timeline,
      "Displayed starting point: " + selectedPackage.price,
      "",
      "Please confirm fit, scope, price, timeline, and deliverables before payment."
    ].join("\n");

    window.location.href =
      "mailto:hello@quoteintakestudio.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
  });
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
