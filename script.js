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
const hoverCards = document.querySelectorAll("[data-hover-card]");
const showcaseTabs = document.querySelectorAll("[data-showcase]");
const showcaseTabsContainer = document.querySelector(".showcase-tabs");
const showcasePanel = document.querySelector(".showcase-panel");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const briefButtons = document.querySelectorAll("[data-brief]");
const briefOptionsContainer = document.querySelector(".brief-options");
const briefOutput = document.querySelector(".brief-output");
const actionDock = document.querySelector(".action-dock");
const backTopButton = document.querySelector("[data-back-top]");
const magneticButtons = document.querySelectorAll(".button");
const dockGuardTargets = document.querySelectorAll(
  "#services, .delivery-section, #work, #process, .quality-section, #pricing, #payments, #faq, #brief, #contact, .site-footer",
);
const actionDockItems = actionDock?.querySelectorAll("a, button") || [];
const processTrack = document.querySelector("[data-process-track]");
const processSteps = processTrack?.querySelectorAll("[data-process-step]") || [];
const workflowSnapshot = document.querySelector("[data-workflow-snapshot]");
const workflowSteps = document.querySelectorAll("[data-workflow-step]");
let ticking = false;
let menuCloseTimer;
let actionDockVisible;
let workflowStepIndex = 0;
const workflowDuration = 2300;

const showcaseData = {
  site: {
    kind: "Website launch",
    title: "Stripe-ready service page",
    copy: "Clear offer, pricing, policy links, email path, and responsive checks before publishing.",
    items: ["Public business information", "Pricing and delivery terms", "Desktop and mobile QA"],
    label: "Launch checklist",
    state: "Ready",
    progress: "78%",
    bars: ["88%", "68%", "78%"],
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
    bars: ["76%", "86%", "54%"],
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
    bars: ["92%", "62%", "82%"],
    foot: ["Trigger checked", "Docs included"],
  },
};

const briefData = {
  audit: {
    title: "Launch Audit",
    copy: "Review an AI-built app, website, or workflow and receive a clear fix list with next steps.",
    price: "$49 USD",
    time: "1-3 business days",
    items: ["Current setup review", "Prioritized fix list", "Next-step launch notes"],
    subject: "Launch Audit",
    article: "a",
    meter: {
      complexity: ["Light", "38%"],
      turnaround: ["Fast", "82%"],
      handoff: ["Checklist", "55%"],
    },
  },
  website: {
    title: "Starter Website",
    copy: "A compact public service website with responsive pages, contact paths, SEO basics, and launch checks.",
    price: "$99 USD",
    time: "3-7 business days",
    items: ["Up to three public pages", "Responsive layout and contact path", "Policy, pricing, and launch checks"],
    subject: "Starter Website",
    article: "a",
    meter: {
      complexity: ["Moderate", "64%"],
      turnaround: ["Planned", "58%"],
      handoff: ["Launch notes", "72%"],
    },
  },
  automation: {
    title: "Automation Workflow",
    copy: "One repeatable workflow that connects tools, reduces a manual task, and includes setup notes.",
    price: "$149 USD",
    time: "Scope dependent",
    items: ["Trigger and output defined", "Workflow setup and test run", "Usage notes for handoff"],
    subject: "Automation Project",
    article: "an",
    meter: {
      complexity: ["Workflow", "72%"],
      turnaround: ["Scoped", "48%"],
      handoff: ["Setup notes", "78%"],
    },
  },
  fix: {
    title: "Fix Sprint",
    copy: "Focused cleanup for bugs, deploy issues, broken forms, API errors, or reliability problems.",
    price: "$299 USD",
    time: "Scope dependent",
    items: ["Issue review and risk notes", "Focused fixes and verification", "Summary of changes and next steps"],
    subject: "Troubleshooting Request",
    article: "a",
    meter: {
      complexity: ["Deep", "88%"],
      turnaround: ["Focused", "46%"],
      handoff: ["Fix report", "86%"],
    },
  },
};

const updateScrollState = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = pageHeight > 0 ? scrollTop / pageHeight : 0;
  const dockBlocked = Array.from(dockGuardTargets).some((target) => {
    const bounds = target.getBoundingClientRect();
    return bounds.top < window.innerHeight - 72 && bounds.bottom > 96;
  });
  const shouldShowDock =
    window.innerWidth > 700 &&
    scrollTop > Math.max(420, window.innerHeight * 0.55) &&
    !dockBlocked &&
    !document.body.classList.contains("menu-open");
  let processProgress = 0;

  if (processTrack && processSteps.length) {
    const processBounds = processTrack.getBoundingClientRect();
    const start = window.innerHeight * 0.78;
    const end = window.innerHeight * 0.24;
    processProgress = (start - processBounds.top) / (start - end + processBounds.height * 0.45);
    processProgress = Math.min(Math.max(processProgress, 0), 1);
    processTrack.style.setProperty("--process-progress", processProgress.toFixed(3));
    const activeIndex =
      processProgress > 0.03
        ? Math.min(processSteps.length - 1, Math.floor(processProgress * (processSteps.length - 1) + 0.001))
        : -1;

    processSteps.forEach((step, index) => {
      const stepPoint = processSteps.length === 1 ? 1 : index / (processSteps.length - 1);

      step.classList.toggle("is-process-active", index === activeIndex);
      step.classList.toggle("is-process-complete", processProgress >= stepPoint);
    });
  }

  if (progress) {
    progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
  }

  header?.classList.toggle("is-scrolled", scrollTop > 18);

  if (actionDock && shouldShowDock !== actionDockVisible) {
    actionDock.classList.toggle("is-visible", shouldShowDock);
    actionDock.setAttribute("aria-hidden", String(!shouldShowDock));
    actionDockItems.forEach((item) => {
      item.tabIndex = shouldShowDock ? 0 : -1;
    });
    actionDockVisible = shouldShowDock;
  }

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
        const activeHash = `#${entry.target.id}`;
        navLinks.forEach((link) => link.classList.toggle("is-active", link.hash === activeHash));
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

if (hoverCards.length && !reduceMotion) {
  hoverCards.forEach((card) => {
    const updateHoverPosition = (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--hover-x", `${(event.clientX - bounds.left).toFixed(1)}px`);
      card.style.setProperty("--hover-y", `${(event.clientY - bounds.top).toFixed(1)}px`);
      card.classList.add("is-hovering");
    };

    card.addEventListener("pointermove", updateHoverPosition);
    card.addEventListener("pointerenter", updateHoverPosition);
    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-hovering");
    });
  });
}

if (magneticButtons.length && !reduceMotion) {
  magneticButtons.forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      button.style.setProperty("--button-x", `${(x * 5).toFixed(2)}px`);
      button.style.setProperty("--button-y", `${(y * 4).toFixed(2)}px`);
    });

    button.addEventListener("pointerleave", () => {
      button.style.setProperty("--button-x", "0px");
      button.style.setProperty("--button-y", "0px");
    });
  });
}

const setWorkflowStep = (nextIndex) => {
  workflowStepIndex = nextIndex;
  workflowSteps.forEach((step, index) => {
    const isActive = index === workflowStepIndex;
    step.classList.toggle("is-active", isActive);
    step.classList.toggle("is-complete", index < workflowStepIndex);
    if (isActive) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  });

  if (workflowSnapshot) {
    workflowSnapshot.style.setProperty("--workflow-duration", `${workflowDuration}ms`);
    workflowSnapshot.classList.remove("is-advancing");
    void workflowSnapshot.offsetWidth;
    workflowSnapshot.classList.add("is-advancing");
  }
};

if (workflowSteps.length) {
  setWorkflowStep(0);

  if (!reduceMotion) {
    window.setInterval(() => {
      setWorkflowStep((workflowStepIndex + 1) % workflowSteps.length);
    }, workflowDuration);
  }
}

const syncActiveIndicator = (container, activeItem) => {
  if (!container || !activeItem) return;

  const containerBounds = container.getBoundingClientRect();
  const activeBounds = activeItem.getBoundingClientRect();

  container.style.setProperty("--indicator-x", `${(activeBounds.left - containerBounds.left).toFixed(1)}px`);
  container.style.setProperty("--indicator-y", `${(activeBounds.top - containerBounds.top).toFixed(1)}px`);
  container.style.setProperty("--indicator-w", `${activeBounds.width.toFixed(1)}px`);
  container.style.setProperty("--indicator-h", `${activeBounds.height.toFixed(1)}px`);
};

const syncAllActiveIndicators = () => {
  syncActiveIndicator(showcaseTabsContainer, document.querySelector(".showcase-tab.is-active"));
  syncActiveIndicator(briefOptionsContainer, document.querySelector(".brief-option.is-active"));
};

const updateShowcase = (key) => {
  const data = showcaseData[key];
  if (!data || !showcasePanel) return;

  showcaseTabs.forEach((tab) => {
    const isActive = tab.dataset.showcase === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });
  const activeShowcaseTab = document.querySelector(".showcase-tab.is-active");
  if (activeShowcaseTab?.id) {
    showcasePanel.setAttribute("aria-labelledby", activeShowcaseTab.id);
  }
  syncActiveIndicator(showcaseTabsContainer, activeShowcaseTab);

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
  const preview = document.querySelector(".interface-preview");
  if (preview) {
    preview.dataset.previewMode = key;
    preview.style.setProperty("--preview-progress", data.progress);
    preview.classList.remove("is-morphing");
    void preview.offsetWidth;
    preview.classList.add("is-morphing");
    preview.querySelectorAll(".preview-bars span").forEach((bar, index) => {
      bar.style.setProperty("--bar-width", data.bars[index] || "72%");
    });
  }
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

const updateBrief = (key) => {
  const data = briefData[key];
  if (!data || !briefOutput) return;

  briefButtons.forEach((button) => {
    const isActive = button.dataset.brief === key;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  syncActiveIndicator(briefOptionsContainer, document.querySelector(".brief-option.is-active"));

  briefOutput.classList.remove("is-swapping");
  void briefOutput.offsetWidth;
  briefOutput.classList.add("is-swapping");

  document.querySelector("[data-brief-title]").textContent = data.title;
  document.querySelector("[data-brief-copy]").textContent = data.copy;
  document.querySelector("[data-brief-price]").textContent = data.price;
  document.querySelector("[data-brief-time]").textContent = data.time;
  document.querySelector("[data-brief-item-1]").textContent = data.items[0];
  document.querySelector("[data-brief-item-2]").textContent = data.items[1];
  document.querySelector("[data-brief-item-3]").textContent = data.items[2];
  document.querySelector("[data-brief-meter-complexity]").textContent = data.meter.complexity[0];
  document.querySelector("[data-brief-meter-turnaround]").textContent = data.meter.turnaround[0];
  document.querySelector("[data-brief-meter-handoff]").textContent = data.meter.handoff[0];
  document
    .querySelector("[data-brief-meter-complexity-bar]")
    ?.style.setProperty("--meter-width", data.meter.complexity[1]);
  document
    .querySelector("[data-brief-meter-turnaround-bar]")
    ?.style.setProperty("--meter-width", data.meter.turnaround[1]);
  document
    .querySelector("[data-brief-meter-handoff-bar]")
    ?.style.setProperty("--meter-width", data.meter.handoff[1]);

  const body = `Hi Shadow AI Studio,\n\nI'd like help with ${data.article} ${data.title}.\n\nGoal:\nCurrent site/app link:\nDeadline:\n`;
  document
    .querySelector("[data-brief-link]")
    ?.setAttribute(
      "href",
      `mailto:dynascapes@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`,
    );
};

if (briefButtons.length) {
  briefButtons.forEach((button) => {
    button.addEventListener("click", () => updateBrief(button.dataset.brief));

    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      const currentIndex = Array.from(briefButtons).indexOf(button);
      const columnCount = window.innerWidth <= 620 ? 2 : briefButtons.length;
      let nextIndex = currentIndex;

      if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + briefButtons.length) % briefButtons.length;
      if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % briefButtons.length;
      if (event.key === "ArrowUp") nextIndex = Math.max(0, currentIndex - columnCount);
      if (event.key === "ArrowDown") nextIndex = Math.min(briefButtons.length - 1, currentIndex + columnCount);
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = briefButtons.length - 1;

      briefButtons[nextIndex].focus();
      updateBrief(briefButtons[nextIndex].dataset.brief);
    });
  });
}

backTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

const setMenuOpen = (isOpen) => {
  if (!menuToggle || !mobileMenu) return;

  window.clearTimeout(menuCloseTimer);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.querySelector(".sr-only").textContent = isOpen ? "Close menu" : "Open menu";
  document.body.classList.toggle("menu-open", isOpen);
  updateScrollState();

  if (isOpen) {
    mobileMenu.hidden = false;
    window.requestAnimationFrame(() => {
      mobileMenu.classList.add("is-open");
    });
    return;
  }

  mobileMenu.classList.remove("is-open");
  if (reduceMotion) {
    mobileMenu.hidden = true;
    return;
  }

  menuCloseTimer = window.setTimeout(() => {
    if (menuToggle.getAttribute("aria-expanded") !== "true") {
      mobileMenu.hidden = true;
    }
  }, 190);

  updateScrollState();
};

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 940) {
      setMenuOpen(false);
    }
  });
}

document.querySelectorAll(".faq-list details").forEach((details) => {
  const summary = details.querySelector("summary");
  summary?.setAttribute("aria-expanded", String(details.open));

  details.addEventListener("toggle", () => {
    summary?.setAttribute("aria-expanded", String(details.open));
    if (!details.open) return;

    document.querySelectorAll(".faq-list details[open]").forEach((openDetails) => {
      if (openDetails !== details) {
        openDetails.removeAttribute("open");
        openDetails.querySelector("summary")?.setAttribute("aria-expanded", "false");
      }
    });
  });
});

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
window.addEventListener("resize", () => {
  window.requestAnimationFrame(syncAllActiveIndicators);
});
updateScrollState();
syncAllActiveIndicators();
