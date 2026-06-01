const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

root.classList.add("js-ready");

const progress = document.querySelector(".scroll-progress");
const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll("[data-reveal]");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("nav a[href^='#']");
const tiltTarget = document.querySelector("[data-tilt]");
const spotlightTargets = document.querySelectorAll("[data-spotlight]");
const showcaseTabs = document.querySelectorAll("[data-showcase]");
const showcasePanel = document.querySelector(".showcase-panel");
let ticking = false;

const showcaseData = {
  site: {
    kind: "Website launch",
    title: "Stripe-ready service page",
    copy: "Clear offer, pricing, policy links, email path, and responsive checks before publishing.",
    items: ["Public business information", "Pricing and delivery terms", "Desktop and mobile QA"],
    label: "Launch checklist",
    state: "Ready",
    progress: "78%",
    foot: ["Policies linked", "Mobile checked"],
  },
  rescue: {
    kind: "AI app rescue",
    title: "From stuck prototype to usable handoff",
    copy: "Review the project, group errors by cause, fix the launch blockers, and leave readable notes.",
    items: ["Bug list and risk notes", "Deploy and form checks", "Clean handoff summary"],
    label: "Fix sprint board",
    state: "Mapped",
    progress: "64%",
    foot: ["Errors grouped", "Next steps written"],
  },
  automation: {
    kind: "Automation workflow",
    title: "One repeatable workflow with documentation",
    copy: "Connect the tools, test the trigger path, and document how to use or update the workflow later.",
    items: ["Trigger and output defined", "Test run recorded", "Setup notes delivered"],
    label: "Automation run",
    state: "Tested",
    progress: "86%",
    foot: ["Trigger checked", "Docs included"],
  },
};

const updateScrollState = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = pageHeight > 0 ? scrollTop / pageHeight : 0;

  if (progress) {
    progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
  }

  header?.classList.toggle("is-scrolled", scrollTop > 18);
  ticking = false;
};

const requestScrollUpdate = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollState);
    ticking = true;
  }
};

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-reveal-delay");
          if (delay) {
            entry.target.style.transitionDelay = `${Number(delay) || 0}ms`;
          }
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
        navLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (tiltTarget && !reduceMotion) {
  tiltTarget.addEventListener("pointermove", (event) => {
    const bounds = tiltTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    tiltTarget.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
    tiltTarget.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
    tiltTarget.style.setProperty("--media-x", `${(x * 10).toFixed(2)}px`);
    tiltTarget.style.setProperty("--media-y", `${(y * 10).toFixed(2)}px`);
  });

  tiltTarget.addEventListener("pointerleave", () => {
    tiltTarget.style.setProperty("--tilt-x", "0deg");
    tiltTarget.style.setProperty("--tilt-y", "0deg");
    tiltTarget.style.setProperty("--media-x", "0px");
    tiltTarget.style.setProperty("--media-y", "0px");
  });
}

if (spotlightTargets.length && !reduceMotion) {
  spotlightTargets.forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      const bounds = target.getBoundingClientRect();
      const ratio = (event.clientX - bounds.left) / bounds.width;
      target.style.setProperty("--shine-x", `${Math.round(ratio * 150 - 28)}%`);
    });

    target.addEventListener("pointerleave", () => {
      target.style.setProperty("--shine-x", "-140%");
    });
  });
}

const updateShowcase = (key) => {
  const data = showcaseData[key];
  if (!data || !showcasePanel) return;

  showcaseTabs.forEach((tab) => {
    const isActive = tab.dataset.showcase === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  showcasePanel.classList.remove("is-swapping");
  void showcasePanel.offsetWidth;
  showcasePanel.classList.add("is-swapping");

  document.querySelector("[data-showcase-kind]").textContent = data.kind;
  document.querySelector("[data-showcase-title]").textContent = data.title;
  document.querySelector("[data-showcase-copy]").textContent = data.copy;
  document.querySelector("[data-showcase-item-1]").textContent = data.items[0];
  document.querySelector("[data-showcase-item-2]").textContent = data.items[1];
  document.querySelector("[data-showcase-item-3]").textContent = data.items[2];
  document.querySelector("[data-preview-label]").textContent = data.label;
  document.querySelector("[data-preview-state]").textContent = data.state;
  document.querySelector("[data-preview-foot-1]").textContent = data.foot[0];
  document.querySelector("[data-preview-foot-2]").textContent = data.foot[1];
  document.querySelector(".interface-preview")?.style.setProperty("--preview-progress", data.progress);
};

if (showcaseTabs.length) {
  showcaseTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => updateShowcase(tab.dataset.showcase));

    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + showcaseTabs.length) % showcaseTabs.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % showcaseTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = showcaseTabs.length - 1;

      showcaseTabs[nextIndex].focus();
      updateShowcase(showcaseTabs[nextIndex].dataset.showcase);
    });
  });
}

document.querySelectorAll(".faq-list details").forEach((details) => {
  details.addEventListener("toggle", () => {
    if (!details.open) return;

    document.querySelectorAll(".faq-list details[open]").forEach((openDetails) => {
      if (openDetails !== details) {
        openDetails.removeAttribute("open");
      }
    });
  });
});

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
updateScrollState();
