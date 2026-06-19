const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const themeToggles = document.querySelectorAll("[data-theme-toggle]");
const themeToggleText = document.querySelectorAll("[data-theme-toggle-text]");
const themeColorMeta = document.querySelector("meta[name='theme-color']");

root.classList.add("js-ready");

const getActiveTheme = () => (root.dataset.theme === "dark" ? "dark" : "light");

const syncThemeControls = () => {
  const activeTheme = getActiveTheme();
  const nextLabel = activeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  root.style.colorScheme = activeTheme;
  themeColorMeta?.setAttribute("content", activeTheme === "dark" ? "#07111d" : "#0d1b2a");
  themeToggles.forEach((toggle) => {
    toggle.setAttribute("aria-label", nextLabel);
    toggle.setAttribute("aria-pressed", String(activeTheme === "dark"));
  });
  themeToggleText.forEach((label) => {
    label.textContent = activeTheme === "dark" ? "Light mode" : "Dark mode";
  });
};

const setTheme = (theme) => {
  const nextTheme = theme === "dark" ? "dark" : "light";
  root.dataset.theme = nextTheme;
  try {
    window.localStorage.setItem("quoteintake-theme", nextTheme);
  } catch {
    // Theme persistence is optional; the visible toggle should still work.
  }
  syncThemeControls();
};

if (!root.dataset.theme) {
  setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
} else {
  syncThemeControls();
}

const progress = document.querySelector(".scroll-progress");
const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll("[data-reveal]");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("nav a[href^='#']");
const tiltTarget = document.querySelector("[data-tilt]");
const heroStatus = document.querySelector("[data-hero-status]");
const heroStatusTitle = document.querySelector("[data-hero-status-title]");
const heroStatusLabel = document.querySelector("[data-hero-status-label]");
const heroStatusProgress = document.querySelector("[data-hero-status-progress]");
const heroStatusSteps = heroStatus?.querySelectorAll("[data-hero-status-step]") || [];
const spotlightTargets = document.querySelectorAll("[data-spotlight]");
const hoverCards = document.querySelectorAll("[data-hover-card]");
const serviceGrid = document.querySelector("[data-service-grid]");
const serviceCards = serviceGrid?.querySelectorAll("[data-service-card]") || [];
const deliveryBoard = document.querySelector("[data-delivery-board]");
const deliveryRows = deliveryBoard?.querySelectorAll("[data-delivery-row]") || [];
const deliveryState = document.querySelector("[data-delivery-state]");
const showcaseShell = document.querySelector(".showcase-shell");
const showcaseTabs = document.querySelectorAll("[data-showcase]");
const showcaseTabsContainer = document.querySelector(".showcase-tabs");
const showcasePanel = document.querySelector(".showcase-panel");
const showcaseCta = document.querySelector("[data-showcase-cta]");
const showcaseRailSteps = document.querySelectorAll(".showcase-rail span");
const previewStageSteps = document.querySelectorAll(".preview-stage span");
const pricingGrid = document.querySelector("[data-pricing-grid]");
const pricingCards = pricingGrid?.querySelectorAll("[data-price-card]") || [];
const pricingGuide = document.querySelector("[data-pricing-guide]");
const pricingGuideSteps = pricingGuide?.querySelectorAll("[data-pricing-guide-step]") || [];
const pricingFocus = document.querySelector("[data-pricing-focus]");
const pricingFocusTitle = document.querySelector("[data-pricing-focus-title]");
const pricingFocusLabel = document.querySelector("[data-pricing-focus-label]");
const pricingFocusCopy = document.querySelector("[data-pricing-focus-copy]");
const pricingFocusPrice = document.querySelector("[data-pricing-focus-price]");
const pricingFocusTime = document.querySelector("[data-pricing-focus-time]");
const pricingFocusFit = document.querySelector("[data-pricing-focus-fit]");
const pricingFocusMeter = document.querySelector("[data-pricing-focus-meter]");
const pricingFocusTags = [
  document.querySelector("[data-pricing-focus-tag-1]"),
  document.querySelector("[data-pricing-focus-tag-2]"),
  document.querySelector("[data-pricing-focus-tag-3]"),
];
const detailCards = document.querySelectorAll("[data-detail-card]");
const detailFocus = document.querySelector("[data-detail-focus]");
const detailFocusTitle = document.querySelector("[data-detail-focus-title]");
const detailFocusLabel = document.querySelector("[data-detail-focus-label]");
const detailFocusCopy = document.querySelector("[data-detail-focus-copy]");
const detailFocusCheck = document.querySelector("[data-detail-focus-check]");
const detailFocusAction = document.querySelector("[data-detail-focus-action]");
const detailFocusRecord = document.querySelector("[data-detail-focus-record]");
const detailFocusMeter = document.querySelector("[data-detail-focus-meter]");
const detailFocusTags = [
  document.querySelector("[data-detail-focus-tag-1]"),
  document.querySelector("[data-detail-focus-tag-2]"),
  document.querySelector("[data-detail-focus-tag-3]"),
];
const faqList = document.querySelector("[data-faq-list]");
const faqDetails = faqList?.querySelectorAll("[data-faq-item]") || [];
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const briefButtons = document.querySelectorAll("[data-brief]");
const briefOptionsContainer = document.querySelector(".brief-options");
const briefOutput = document.querySelector(".brief-output");
const intakeGoal = document.getElementById("intake-goal");
const intakeLink = document.getElementById("intake-link");
const intakeTimeline = document.getElementById("intake-timeline");
const copyBriefBtn = document.querySelector("[data-copy-brief-btn]");
let currentBriefKey = "audit";
const pricingBriefLinks = document.querySelectorAll("[data-pricing-brief]");
const actionDock = document.querySelector(".action-dock");
const backTopButton = document.querySelector("[data-back-top]");
const copyEmailButton = document.querySelector("[data-copy-email]");
const magneticButtons = document.querySelectorAll(".button");
const dockGuardTargets = document.querySelectorAll("#services, #work, #process, #pricing, #payments, #faq, #brief, #contact, .site-footer");
const actionDockItems = actionDock?.querySelectorAll("a, button") || [];
const processTrack = document.querySelector("[data-process-track]");
const processSteps = processTrack?.querySelectorAll("[data-process-step]") || [];
const processFocus = document.querySelector("[data-process-focus]");
const processFocusTitle = document.querySelector("[data-process-focus-title]");
const processFocusLabel = document.querySelector("[data-process-focus-label]");
const processFocusCopy = document.querySelector("[data-process-focus-copy]");
const processFocusProof = document.querySelector("[data-process-focus-proof]");
const processFocusAction = document.querySelector("[data-process-focus-action]");
const processFocusRecord = document.querySelector("[data-process-focus-record]");
const processFocusMeter = document.querySelector("[data-process-focus-meter]");
const processFocusTags = [
  document.querySelector("[data-process-focus-tag-1]"),
  document.querySelector("[data-process-focus-tag-2]"),
  document.querySelector("[data-process-focus-tag-3]"),
];
const workflowSnapshot = document.querySelector("[data-workflow-snapshot]");
const workflowSteps = document.querySelectorAll("[data-workflow-step]");
const paymentFlow = document.querySelector("[data-payment-flow]");
const paymentSteps = paymentFlow?.querySelectorAll("[data-payment-step]") || [];
const contactRoute = document.querySelector("[data-contact-route]");
const contactSteps = contactRoute?.querySelectorAll("[data-contact-step]") || [];
const contactBox = document.querySelector(".contact-box");
const contactStatus = document.querySelector("[data-contact-status]");
const contactSubject = document.querySelector("[data-contact-subject]");
const contactFields = document.querySelector("[data-contact-fields]");
const contactLink = document.querySelector("[data-contact-link]");
let ticking = false;
let menuCloseTimer;
let actionDockVisible;
let workflowStepIndex = 0;
let serviceSequencePlayed = false;
let serviceSequenceTimers = [];
let deliverySequencePlayed = false;
let deliverySequenceTimers = [];
let showcaseSequencePlayed = false;
let showcaseSequenceTimers = [];
let showcaseUserControlled = false;
let showcaseCommittedKey = "site";
let showcaseIsPreviewing = false;
let processFocusIndex = -1;
let paymentFlowPlayed = false;
let contactRoutePlayed = false;
let pricingSequencePlayed = false;
let pricingUserLocked = false;
let pricingSequenceTimers = [];
let faqSyncing = false;
let scopeHandoffTimer;
let scopeHandoffQueueTimers = [];
let contactDraftTimer;
const workflowDuration = 2300;

const heroStatusData = [
  { title: "Quote path reviewed", label: "Step 01" },
  { title: "Mobile CTAs active", label: "Step 02" },
  { title: "Replies set up", label: "Step 03" },
];

const pricingBriefKeys = ["audit", "website", "automation", "fix"];

const showcaseData = {
  site: {
    kind: "Lead leak audit",
    title: "Prioritized fix checklist",
    copy: "Review forms, sticky headers, touch targets, and missed-call follow-ups to stop losing leads.",
    items: ["Mobile CTA visual check", "Intake form fields check", "Missed-call reply test"],
    label: "Audit checklist",
    state: "Ready",
    progress: "78%",
    bars: ["88%", "68%", "78%"],
    foot: ["CTAs reviewed", "Touch targets check"],
    artifacts: ["Lead leak map", "CTA recommendations", "Response copy"],
    previewCards: ["Lead leak checklist", "Mobile CTA layout check"],
    stages: ["Scope", "Checks", "Handoff"],
    stageIndex: 2,
    module: "Audit packet",
    score: "78%",
    notes: ["CTA height checked", "Response times checked", "Form fields count pass"],
    cta: "Request Audit",
    briefKey: "audit",
  },
  rescue: {
    kind: "Mobile CTA pass",
    title: "Add call buttons and clean layout",
    copy: "Implement sticky phone headers, thumb-friendly call buttons, and responsive touch adjustments.",
    items: ["Sticky header build", "Dial action verify", "Mobile viewport QA"],
    label: "CTA setup board",
    state: "Active",
    progress: "64%",
    bars: ["76%", "86%", "54%"],
    foot: ["Buttons active", "Dial pass verified"],
    artifacts: ["Sticky CTA code", "Touch QA report", "Setup guides"],
    previewCards: ["Call button active", "Touch target pass"],
    stages: ["Scope", "Design", "Code"],
    stageIndex: 1,
    module: "CTA packet",
    score: "64%",
    notes: ["Sticky headers code", "Dial targets pass", "Handoff ready"],
    cta: "Request CTA Cleanup",
    briefKey: "website",
  },
  automation: {
    kind: "Auto-responder",
    title: "SMS text-back & email setup",
    copy: "Connect quote forms to instant auto-replies so leads get a message in under 60 seconds.",
    items: ["SMS/Email trigger map", "Message copy written", "Form routing confirmed"],
    label: "Responder run",
    state: "Active",
    progress: "86%",
    bars: ["92%", "62%", "82%"],
    foot: ["Replies active", "Alerts tested"],
    artifacts: ["Response triggers", "Copy templates", "Usage notes"],
    previewCards: ["SMS notification active", "Email responder active"],
    stages: ["Trigger", "Copy", "Active"],
    stageIndex: 2,
    module: "Follow-up packet",
    score: "86%",
    notes: ["Triggers verified", "Email templates set", "SMS test pass"],
    cta: "Request Follow-Up Setup",
    briefKey: "automation",
  },
};

const briefData = {
  audit: {
    title: "Lead Leak Audit",
    copy: "A prioritized review of your website's contact form, mobile layouts, and response times to find lost leads.",
    price: "$49 USD",
    time: "1-3 business days",
    emailGoal: "Find quote path leaks and mobile conversion bugs",
    items: ["Quote path review", "Prioritized fix list", "Response time check"],
    subject: "Lead Leak Audit Request",
    article: "a",
    meter: {
      complexity: ["Light", "38%"],
      turnaround: ["Fast", "82%"],
      handoff: ["Checklist", "55%"],
    },
  },
  website: {
    title: "Mobile CTA Cleanup",
    copy: "Make it easy for mobile visitors to contact you. Adds sticky call/quote buttons and touch-target checks.",
    price: "$99 USD",
    time: "3-7 business days",
    emailGoal: "Implement sticky call buttons and optimize mobile viewport layouts",
    items: ["Sticky call/quote buttons", "Tap target optimization", "Header/footer QA pass"],
    subject: "Mobile CTA Cleanup Request",
    article: "a",
    meter: {
      complexity: ["Moderate", "64%"],
      turnaround: ["Planned", "58%"],
      handoff: ["Launch notes", "72%"],
    },
  },
  automation: {
    title: "Follow-Up Setup",
    copy: "Connect your forms to instant email or SMS auto-replies so leads get a response in under 60 seconds.",
    price: "$149 USD",
    time: "Scope dependent",
    emailGoal: "Setup SMS text-back and email auto-responder workflows",
    items: ["Auto-reply trigger rules", "SMS/Email copy templates", "Notification routing"],
    subject: "Follow-Up Setup Request",
    article: "a",
    meter: {
      complexity: ["Workflow", "72%"],
      turnaround: ["Scoped", "48%"],
      handoff: ["Setup notes", "78%"],
    },
  },
  fix: {
    title: "Intake Form Setup",
    copy: "Setup a custom, multi-step quote request form that qualifies leads and maps fields to CRM/Sheets.",
    price: "$299 USD",
    time: "Scope dependent",
    emailGoal: "Setup a custom multi-step qualifying quote form",
    items: ["Multi-step layout build", "CRM/Spreadsheet mapping", "Field validation rules"],
    subject: "Intake Form Setup Request",
    article: "an",
    meter: {
      complexity: ["Deep", "88%"],
      turnaround: ["Focused", "46%"],
      handoff: ["Fix report", "86%"],
    },
  },
};

const pricingFocusData = [
  {
    title: "Lead Leak Audit",
    label: "Lowest-risk start",
    copy: "A prioritized review of your quote path, mobile layouts, and response times to find lost leads.",
    price: "$49 USD",
    time: "1-3 business days",
    fit: "Finding conversion leaks",
    level: "38%",
    tags: ["Lead leak map", "CTA recommendations", "Response copy"],
  },
  {
    title: "Mobile CTA Cleanup",
    label: "Suggested start",
    copy: "Adds high-visibility call/quote buttons and optimizes mobile layouts for local visitors.",
    price: "$99 USD",
    time: "3-7 business days",
    fit: "Mobile lead conversion",
    level: "58%",
    tags: ["Sticky buttons", "Touch targets", "Header/footer QA"],
  },
  {
    title: "Follow-Up Setup",
    label: "Workflow build",
    copy: "Connect quote forms to instant SMS or email auto-replies so leads get immediate replies.",
    price: "$149 USD",
    time: "Scope dependent",
    fit: "Instant response speed",
    level: "72%",
    tags: ["SMS text-back", "Email templates", "Trigger routing"],
  },
  {
    title: "Intake Form Setup",
    label: "Deepest scope",
    copy: "Build a multi-step quote form that qualifies service leads and maps inputs to CRM or spreadsheet.",
    price: "$299 USD",
    time: "Scope dependent",
    fit: "Custom qualifying steps",
    level: "88%",
    tags: ["Multi-step form", "CRM mapping", "Input validation"],
  },
];

const detailFocusData = [
  {
    title: "Payment terms",
    label: "Before payment",
    copy: "Written price, timeline, and deliverables are confirmed before any payment details are shared.",
    check: "Scope confirmed first",
    action: "Review written quote",
    record: "Price and timeline saved",
    level: "78%",
    tags: ["Written quote", "Scope first", "No surprise hourly billing"],
  },
  {
    title: "No surprise billing",
    label: "Clear approval",
    copy: "You review the written quote, timeline, and deliverables before choosing whether to move forward.",
    check: "Quote approved first",
    action: "Confirm by email",
    record: "Approval saved",
    level: "88%",
    tags: ["Written approval", "Scope first", "No public pay-now link"],
  },
  {
    title: "Delivery timeline",
    label: "Written handoff",
    copy: "Small audits have a typical delivery window, while build and fix work is scheduled around the agreed scope.",
    check: "Timeline stated",
    action: "Confirm delivery path",
    record: "Files and notes included",
    level: "72%",
    tags: ["Delivery notes", "Shared files", "Scope dependent"],
  },
  {
    title: "Customer support",
    label: "Support channel",
    copy: "Project support stays anchored to email so requests, updates, and next steps remain easy to reference.",
    check: "Support email visible",
    action: "Send project update",
    record: "Reply path documented",
    level: "82%",
    tags: ["Email support", "Clear next steps", "Request history"],
  },
];

const processFocusData = [
  {
    title: "Discuss",
    label: "Intake",
    copy: "Goals, current setup, access needs, and success criteria are gathered before scope is written.",
    proof: "Goal and access list",
    action: "Share project links",
    record: "Intake notes saved",
    level: "25%",
    tags: ["Goals", "Access needs", "Success criteria"],
  },
  {
    title: "Plan",
    label: "Fixed scope",
    copy: "The project is translated into a written quote with price, timeline, deliverables, and constraints.",
    proof: "Quote and timeline",
    action: "Approve written scope",
    record: "Scope packet confirmed",
    level: "50%",
    tags: ["Fixed price", "Timeline", "Deliverables"],
  },
  {
    title: "Build",
    label: "Execution",
    copy: "The scoped work is completed, tested against the brief, and kept focused on the agreed outcome.",
    proof: "QA pass recorded",
    action: "Review progress update",
    record: "Build notes captured",
    level: "75%",
    tags: ["Implementation", "Testing", "Progress notes"],
  },
  {
    title: "Deliver",
    label: "Handoff",
    copy: "Final files, included revisions, support expectations, and next steps are packaged for review.",
    proof: "Files and notes sent",
    action: "Review final handoff",
    record: "Delivery summary saved",
    level: "100%",
    tags: ["Files", "Revisions", "Next steps"],
  },
];

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
    const activeIndex =
      processProgress > 0.03
        ? Math.min(processSteps.length - 1, Math.floor(processProgress * (processSteps.length - 1) + 0.001))
        : -1;

    setProcessStep(activeIndex, processProgress);
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

const setProcessStep = (activeIndex, progressValue, options = {}) => {
  if (!processSteps.length) return;

  const activeStep = activeIndex >= 0 ? Math.min(processSteps.length - 1, activeIndex) : -1;
  const focusIndex = activeStep >= 0 ? activeStep : 0;
  const fallbackProgress = processSteps.length > 1 ? focusIndex / (processSteps.length - 1) : 1;
  const processProgress = typeof progressValue === "number" ? progressValue : fallbackProgress;

  if (options.syncProgress !== false) {
    processTrack?.style.setProperty("--process-progress", processProgress.toFixed(3));
  }

  processSteps.forEach((step, index) => {
    const stepPoint = processSteps.length === 1 ? 1 : index / (processSteps.length - 1);
    const isActive = index === activeStep;

    step.classList.toggle("is-process-active", isActive);
    step.classList.toggle("is-process-complete", processProgress >= stepPoint);
    if (isActive) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  });

  const focusData = processFocusData[focusIndex];
  if (!processFocus || !focusData) return;

  const shouldSwap = processFocusIndex !== focusIndex || options.force;
  processFocusIndex = focusIndex;
  processFocus.style.setProperty("--process-focus-level", focusData.level);
  if (processFocusTitle) processFocusTitle.textContent = focusData.title;
  if (processFocusLabel) processFocusLabel.textContent = focusData.label;
  if (processFocusCopy) processFocusCopy.textContent = focusData.copy;
  if (processFocusProof) processFocusProof.textContent = focusData.proof;
  if (processFocusAction) processFocusAction.textContent = focusData.action;
  if (processFocusRecord) processFocusRecord.textContent = focusData.record;
  processFocusMeter?.style.setProperty("--process-focus-level", focusData.level);
  processFocusTags.forEach((tag, index) => {
    if (tag) tag.textContent = focusData.tags[index];
  });

  if (shouldSwap) {
    processFocus.classList.remove("is-swapping");
    void processFocus.offsetWidth;
    processFocus.classList.add("is-swapping");
  }
};

const setServiceCard = (activeIndex) => {
  serviceCards.forEach((card, index) => {
    card.classList.toggle("is-service-active", index === activeIndex);
  });
};

const clearServiceSequence = () => {
  serviceSequenceTimers.forEach((timer) => window.clearTimeout(timer));
  serviceSequenceTimers = [];
};

const playServiceSequence = () => {
  if (!serviceCards.length || serviceSequencePlayed) return;
  serviceSequencePlayed = true;
  clearServiceSequence();

  if (window.innerWidth <= 940) {
    setServiceCard(0);
    return;
  }

  [0, 1, 2, 3, 1].forEach((cardIndex, sequenceIndex) => {
    serviceSequenceTimers.push(window.setTimeout(() => setServiceCard(cardIndex), sequenceIndex * 430));
  });
};

const setDeliveryRow = (activeIndex) => {
  deliveryRows.forEach((row, index) => {
    row.classList.toggle("is-delivery-active", index === activeIndex);
    row.classList.toggle("is-delivery-complete", index < activeIndex);
  });

  if (deliveryBoard && deliveryRows.length) {
    deliveryBoard.style.setProperty("--delivery-progress", ((activeIndex + 1) / deliveryRows.length).toFixed(3));
  }

  if (deliveryState) {
    deliveryState.textContent = `Milestone ${activeIndex + 1} of ${deliveryRows.length}`;
  }
};

const clearDeliverySequence = () => {
  deliverySequenceTimers.forEach((timer) => window.clearTimeout(timer));
  deliverySequenceTimers = [];
};

const playDeliverySequence = () => {
  if (!deliveryRows.length || deliverySequencePlayed) return;
  deliverySequencePlayed = true;
  clearDeliverySequence();

  deliveryRows.forEach((_, index) => {
    deliverySequenceTimers.push(window.setTimeout(() => setDeliveryRow(index), index * 520));
  });
};

const setPaymentStep = (activeIndex) => {
  paymentSteps.forEach((step, index) => {
    const isActive = index === activeIndex;
    step.classList.toggle("is-active", isActive);
    step.classList.toggle("is-complete", index < activeIndex);
    if (isActive) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  });
};

const playPaymentFlow = () => {
  if (!paymentSteps.length || paymentFlowPlayed) return;
  paymentFlowPlayed = true;
  paymentSteps.forEach((_, index) => {
    window.setTimeout(() => setPaymentStep(index), index * 620);
  });
};

const setContactStep = (activeIndex) => {
  const progress = contactSteps.length > 1 ? activeIndex / (contactSteps.length - 1) : 0;

  contactRoute?.style.setProperty("--route-progress", progress.toFixed(3));
  contactSteps.forEach((step, index) => {
    const isActive = index === activeIndex;
    step.classList.toggle("is-active", isActive);
    step.classList.toggle("is-complete", index < activeIndex);
    if (isActive) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  });
};

const playContactRoute = () => {
  if (!contactSteps.length || contactRoutePlayed) return;
  contactRoutePlayed = true;
  setContactStep(0);
  contactSteps.forEach((_, index) => {
    window.setTimeout(() => {
      setContactStep(index);
      if (index === contactSteps.length - 1) {
        contactBox?.classList.add("is-contact-ready");
      }
    }, index * 620);
  });
};

const setPricingCard = (activeIndex) => {
  const progress = pricingCards.length > 1 ? activeIndex / (pricingCards.length - 1) : 1;
  const focusData = pricingFocusData[activeIndex];

  pricingGrid?.style.setProperty("--pricing-progress", progress.toFixed(3));
  pricingGuide?.style.setProperty("--pricing-progress", progress.toFixed(3));
  pricingCards.forEach((card, index) => {
    const isActive = index === activeIndex;
    card.classList.toggle("is-price-active", isActive);
    if (isActive) {
      card.setAttribute("aria-current", "true");
    } else {
      card.removeAttribute("aria-current");
    }
  });
  pricingGuideSteps.forEach((step, index) => {
    const isActive = index === activeIndex;
    step.classList.toggle("is-pricing-guide-active", isActive);
    step.classList.toggle("is-pricing-guide-complete", index <= activeIndex);
    if (isActive) {
      step.setAttribute("aria-current", "true");
    } else {
      step.removeAttribute("aria-current");
    }
  });

  if (pricingFocus && focusData) {
    pricingFocus.classList.remove("is-swapping");
    void pricingFocus.offsetWidth;
    pricingFocus.classList.add("is-swapping");
    pricingFocus.style.setProperty("--pricing-focus-level", focusData.level);
    if (pricingFocusTitle) pricingFocusTitle.textContent = focusData.title;
    if (pricingFocusLabel) pricingFocusLabel.textContent = focusData.label;
    if (pricingFocusCopy) pricingFocusCopy.textContent = focusData.copy;
    if (pricingFocusPrice) pricingFocusPrice.textContent = focusData.price;
    if (pricingFocusTime) pricingFocusTime.textContent = focusData.time;
    if (pricingFocusFit) pricingFocusFit.textContent = focusData.fit;
    pricingFocusMeter?.style.setProperty("--pricing-focus-level", focusData.level);
    pricingFocusTags.forEach((tag, index) => {
      if (tag) tag.textContent = focusData.tags[index] || "";
    });
  }
};

const getPreferredPricingIndex = () => Math.min(1, pricingCards.length - 1);

const clearPricingSequence = () => {
  pricingSequenceTimers.forEach((timer) => window.clearTimeout(timer));
  pricingSequenceTimers = [];
};

const lockPricingSequence = () => {
  pricingUserLocked = true;
  pricingSequencePlayed = true;
  clearPricingSequence();
};

const clearShowcaseSequence = () => {
  showcaseSequenceTimers.forEach((timer) => window.clearTimeout(timer));
  showcaseSequenceTimers = [];
};

const markShowcaseUserControlled = () => {
  showcaseUserControlled = true;
  clearShowcaseSequence();
};

const triggerScopeHandoff = () => {
  const confirmStep = paymentSteps[0];
  if (!confirmStep && !contactBox) return;

  setPaymentStep(0);
  confirmStep?.classList.remove("is-packet-highlight");
  contactBox?.classList.remove("is-scope-synced");
  window.clearTimeout(scopeHandoffTimer);

  if (reduceMotion) return;

  void confirmStep?.offsetWidth;
  confirmStep?.classList.add("is-packet-highlight");
  contactBox?.classList.add("is-scope-synced");
  scopeHandoffTimer = window.setTimeout(() => {
    confirmStep?.classList.remove("is-packet-highlight");
    contactBox?.classList.remove("is-scope-synced");
  }, 1500);
};

const scheduleScopeHandoff = ({ extended = false } = {}) => {
  scopeHandoffQueueTimers.forEach((timer) => window.clearTimeout(timer));
  scopeHandoffQueueTimers = [];
  triggerScopeHandoff();

  if (reduceMotion) return;

  const replayDelays = extended ? [720, 1320, 2200, 3200] : [720, 1320];
  replayDelays.forEach((delay) => {
    scopeHandoffQueueTimers.push(window.setTimeout(triggerScopeHandoff, delay));
  });
};

const playPricingSequence = () => {
  if (!pricingCards.length || pricingSequencePlayed || pricingUserLocked) return;
  pricingSequencePlayed = true;
  clearPricingSequence();

  setPricingCard(getPreferredPricingIndex());
};

const setDetailCard = (activeIndex) => {
  const focusData = detailFocusData[activeIndex];

  detailCards.forEach((card, index) => {
    const isActive = index === activeIndex;
    card.classList.toggle("is-detail-active", isActive);
    if (isActive) {
      card.setAttribute("aria-current", "true");
    } else {
      card.removeAttribute("aria-current");
    }
  });

  if (detailFocus && focusData) {
    detailFocus.classList.remove("is-swapping");
    void detailFocus.offsetWidth;
    detailFocus.classList.add("is-swapping");
    detailFocus.style.setProperty("--detail-focus-level", focusData.level);
    if (detailFocusTitle) detailFocusTitle.textContent = focusData.title;
    if (detailFocusLabel) detailFocusLabel.textContent = focusData.label;
    if (detailFocusCopy) detailFocusCopy.textContent = focusData.copy;
    if (detailFocusCheck) detailFocusCheck.textContent = focusData.check;
    if (detailFocusAction) detailFocusAction.textContent = focusData.action;
    if (detailFocusRecord) detailFocusRecord.textContent = focusData.record;
    detailFocusMeter?.style.setProperty("--detail-focus-level", focusData.level);
    detailFocusTags.forEach((tag, index) => {
      if (tag) tag.textContent = focusData.tags[index] || "";
    });
  }
};

const syncFaqState = (activeDetails) => {
  if (!faqDetails.length) return;
  const activeIndex = Math.max(0, Array.from(faqDetails).indexOf(activeDetails));
  const progress = faqDetails.length > 1 ? activeIndex / (faqDetails.length - 1) : 1;

  faqList?.style.setProperty("--faq-progress", progress.toFixed(3));
  faqDetails.forEach((details, index) => {
    const isActive = details.open;
    details.classList.toggle("is-faq-active", isActive);
    details.querySelector("summary")?.setAttribute("aria-expanded", String(isActive));
    if (isActive) {
      details.querySelector("summary")?.setAttribute("aria-current", "true");
    } else {
      details.querySelector("summary")?.removeAttribute("aria-current");
    }
    details.style.setProperty("--faq-index", String(index));
  });
};

const playShowcaseSequence = () => {
  if (!showcaseTabs.length || showcaseSequencePlayed || showcaseUserControlled) return;

  showcaseSequencePlayed = true;
  ["rescue", "automation", "site"].forEach((key, index) => {
    const timer = window.setTimeout(() => {
      if (!showcaseUserControlled) updateShowcase(key, { source: "auto" });
    }, 1400 + index * 1500);
    showcaseSequenceTimers.push(timer);
  });
};

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  if (processSteps.length) setProcessStep(0, 0, { force: true });
  if (serviceCards.length) setServiceCard(window.innerWidth <= 940 ? 0 : 1);
  if (deliveryRows.length) setDeliveryRow(deliveryRows.length - 1);
  if (pricingCards.length) setPricingCard(getPreferredPricingIndex());
  if (detailCards.length) setDetailCard(0);
  if (paymentSteps.length) setPaymentStep(paymentSteps.length - 1);
  if (contactSteps.length) setContactStep(0);
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
          if (entry.target === serviceCards[0]) playServiceSequence();
          if (entry.target === deliveryBoard) playDeliverySequence();
          if (entry.target === showcaseShell) playShowcaseSequence();
          if (entry.target === pricingGuide || entry.target === pricingCards[0]) playPricingSequence();
          if (entry.target === paymentFlow) playPaymentFlow();
          if (entry.target === contactRoute) playContactRoute();
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (serviceCards.length && !reduceMotion) {
  serviceCards.forEach((card, index) => {
    card.addEventListener("pointerenter", () => {
      clearServiceSequence();
      setServiceCard(index);
    });
    card.addEventListener("focusin", () => {
      clearServiceSequence();
      setServiceCard(index);
    });
  });
}

if (processSteps.length) {
  processSteps.forEach((step, index) => {
    step.addEventListener("pointerenter", () => setProcessStep(index));
    step.addEventListener("focusin", () => setProcessStep(index));
  });
}

if (deliveryRows.length && !reduceMotion) {
  deliveryRows.forEach((row, index) => {
    row.addEventListener("pointerenter", () => {
      clearDeliverySequence();
      setDeliveryRow(index);
    });
  });
}

if (pricingCards.length && !reduceMotion) {
  pricingCards.forEach((card, index) => {
    card.addEventListener("pointerenter", () => {
      lockPricingSequence();
      setPricingCard(index);
    });
    card.addEventListener("focusin", () => {
      lockPricingSequence();
      setPricingCard(index);
      updateBrief(pricingBriefKeys[index], { extended: true });
    });
  });
}

if (detailCards.length && !reduceMotion) {
  detailCards.forEach((card, index) => {
    card.addEventListener("pointerenter", () => setDetailCard(index));
    card.addEventListener("focusin", () => setDetailCard(index));
    card.addEventListener("click", () => setDetailCard(index));
  });
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

  // Fix jump scroll reveal bug: instantly reveal sections when clicked
  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        // Force the target section and any reveal children inside it to become visible instantly
        targetSection.classList.add("is-visible");
        targetSection.querySelectorAll("[data-reveal]").forEach((child) => {
          child.classList.add("is-visible");
        });

        // Trigger animations immediately if they are targeted
        if (targetSection.id === "services" && serviceCards.length) playServiceSequence();
        if (targetSection.querySelector("[data-delivery-board]") || targetSection.id === "process") playDeliverySequence();
        if (targetSection.querySelector(".showcase-shell")) playShowcaseSequence();
        if (targetSection.id === "pricing" && pricingCards.length) playPricingSequence();
        if (targetSection.querySelector("[data-payment-flow]")) playPaymentFlow();
        if (targetSection.id === "contact" && contactRoute) playContactRoute();
      }
    });
  });
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
    const updateButtonMagnet = (event) => {
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      const glowX = ((event.clientX - bounds.left) / bounds.width) * 100;
      const glowY = ((event.clientY - bounds.top) / bounds.height) * 100;

      button.style.setProperty("--button-x", `${(x * 5).toFixed(2)}px`);
      button.style.setProperty("--button-y", `${(y * 4).toFixed(2)}px`);
      button.style.setProperty("--button-glow-x", `${glowX.toFixed(1)}%`);
      button.style.setProperty("--button-glow-y", `${glowY.toFixed(1)}%`);
    };

    const resetButtonMagnet = () => {
      button.style.setProperty("--button-x", "0px");
      button.style.setProperty("--button-y", "0px");
      button.style.setProperty("--button-glow-x", "50%");
      button.style.setProperty("--button-glow-y", "50%");
    };

    button.addEventListener("pointermove", updateButtonMagnet);
    button.addEventListener("mousemove", updateButtonMagnet);
    button.addEventListener("pointerleave", resetButtonMagnet);
    button.addEventListener("mouseleave", resetButtonMagnet);
  });
}

const setHeroStatus = (nextIndex) => {
  if (!heroStatus || !heroStatusSteps.length) return;

  const activeIndex = Math.min(heroStatusSteps.length - 1, Math.max(0, nextIndex));
  const statusData = heroStatusData[activeIndex] || heroStatusData[0];
  const progressValue = heroStatusSteps.length > 1 ? activeIndex / (heroStatusSteps.length - 1) : 1;

  heroStatus.style.setProperty("--hero-status-progress", progressValue.toFixed(3));
  if (heroStatusTitle) heroStatusTitle.textContent = statusData.title;
  if (heroStatusLabel) heroStatusLabel.textContent = statusData.label;
  heroStatusProgress?.style.setProperty("--hero-status-progress", progressValue.toFixed(3));

  heroStatusSteps.forEach((step, index) => {
    step.classList.toggle("is-hero-status-active", index === activeIndex);
    step.classList.toggle("is-hero-status-complete", index < activeIndex);
  });

  heroStatus.classList.remove("is-swapping");
  void heroStatus.offsetWidth;
  heroStatus.classList.add("is-swapping");
};

const setWorkflowStep = (nextIndex) => {
  workflowStepIndex = nextIndex;
  setHeroStatus(workflowStepIndex);
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

const setShowcaseStage = (activeIndex) => {
  const stageCount = Math.max(showcaseRailSteps.length, previewStageSteps.length);
  if (!stageCount) return;

  const stageIndex = Math.min(stageCount - 1, Math.max(0, activeIndex));
  const progress = stageCount > 1 ? stageIndex / (stageCount - 1) : 1;

  showcaseShell?.style.setProperty("--showcase-stage-progress", progress.toFixed(3));

  const syncStepState = (step, index) => {
    step.classList.toggle("is-stage-active", index === stageIndex);
    step.classList.toggle("is-stage-complete", index < stageIndex);
    if (index === stageIndex) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  };

  showcaseRailSteps.forEach(syncStepState);
  previewStageSteps.forEach(syncStepState);
};

const updateShowcase = (key, options = {}) => {
  const data = showcaseData[key];
  if (!data || !showcasePanel) return;

  const isPreview = options.source === "preview";
  const shouldCommit = options.commit !== false;
  const shouldAnimate = options.animate !== false && !reduceMotion;

  if (options.source !== "auto" && options.markUser !== false) markShowcaseUserControlled();
  if (shouldCommit) {
    showcaseCommittedKey = key;
    showcaseIsPreviewing = false;
  } else {
    showcaseIsPreviewing = true;
  }

  showcaseTabs.forEach((tab) => {
    const isActive = tab.dataset.showcase === key;
    tab.classList.toggle("is-active", isActive);
    tab.classList.toggle("is-previewed", isPreview && isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });
  const activeShowcaseTab = document.querySelector(".showcase-tab.is-active");
  if (activeShowcaseTab?.id) {
    showcasePanel.setAttribute("aria-labelledby", activeShowcaseTab.id);
  }
  showcasePanel.dataset.briefKey = data.briefKey;
  syncActiveIndicator(showcaseTabsContainer, activeShowcaseTab);
  setShowcaseStage(data.stageIndex ?? data.stages.length - 1);

  if (shouldAnimate) {
    showcaseShell?.classList.remove("is-showcase-settling");
    showcasePanel.classList.remove("is-swapping");
    void showcasePanel.offsetWidth;
    showcaseShell?.classList.add("is-showcase-settling");
    showcasePanel.classList.add("is-swapping");
  }

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
  document.querySelector("[data-showcase-artifact-1]").textContent = data.artifacts[0];
  document.querySelector("[data-showcase-artifact-2]").textContent = data.artifacts[1];
  document.querySelector("[data-showcase-artifact-3]").textContent = data.artifacts[2];
  document.querySelector("[data-preview-card-1]").textContent = data.previewCards[0];
  document.querySelector("[data-preview-card-2]").textContent = data.previewCards[1];
  document.querySelector("[data-showcase-rail-1]").textContent = data.stages[0];
  document.querySelector("[data-showcase-rail-2]").textContent = data.stages[1];
  document.querySelector("[data-showcase-rail-3]").textContent = data.stages[2];
  document.querySelector("[data-preview-stage-1]").textContent = data.stages[0];
  document.querySelector("[data-preview-stage-2]").textContent = data.stages[1];
  document.querySelector("[data-preview-stage-3]").textContent = data.stages[2];
  document.querySelector("[data-preview-module]").textContent = data.module;
  document.querySelector("[data-preview-score]").textContent = data.score;
  document.querySelector("[data-preview-note-1]").textContent = data.notes[0];
  document.querySelector("[data-preview-note-2]").textContent = data.notes[1];
  document.querySelector("[data-preview-note-3]").textContent = data.notes[2];
  if (showcaseCta) {
    showcaseCta.textContent = data.cta;
  }
  const preview = document.querySelector(".interface-preview");
  if (preview) {
    preview.dataset.previewMode = key;
    preview.style.setProperty("--preview-progress", data.progress);
    preview.querySelectorAll(".preview-bars span").forEach((bar, index) => {
      bar.style.setProperty("--bar-width", data.bars[index] || "72%");
    });
    if (shouldAnimate) {
      preview.classList.remove("is-morphing");
      void preview.offsetWidth;
      preview.classList.add("is-morphing");
    }
  }
};

if (showcaseTabs.length) {
  showcaseShell?.addEventListener("pointerenter", markShowcaseUserControlled);
  showcaseShell?.addEventListener("focusin", markShowcaseUserControlled);
  showcaseShell?.addEventListener("pointerleave", () => {
    if (showcaseIsPreviewing) {
      updateShowcase(showcaseCommittedKey, { source: "restore", markUser: false, animate: true });
    }
  });

  showcaseTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => updateShowcase(tab.dataset.showcase, { source: "user" }));
    tab.addEventListener("focusin", () => updateShowcase(tab.dataset.showcase, { source: "user" }));
    tab.addEventListener("pointerenter", () => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        updateShowcase(tab.dataset.showcase, { source: "preview", commit: false });
      }
    });

    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + showcaseTabs.length) % showcaseTabs.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % showcaseTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = showcaseTabs.length - 1;

      showcaseTabs[nextIndex].focus();
      updateShowcase(showcaseTabs[nextIndex].dataset.showcase, { source: "user" });
    });
  });

  updateShowcase(showcaseCommittedKey, { source: "init", markUser: false, animate: false });
}

const syncBriefInputs = () => {
  const data = briefData[currentBriefKey];
  if (!data) return;

  const goalVal = intakeGoal?.value.trim() || data.emailGoal;
  const linkVal = intakeLink?.value.trim() || "None provided";
  const timelineVal = intakeTimeline?.value || data.time;

  const emailGoalEl = document.querySelector("[data-brief-email-goal]");
  if (emailGoalEl) emailGoalEl.textContent = goalVal;

  const emailTimelineEl = document.querySelector("[data-brief-email-timeline]");
  if (emailTimelineEl) emailTimelineEl.textContent = timelineVal;

  const body = `Hi Quote Intake Studio,\n\nI'd like help with ${data.article} ${data.title}.\n\nBusiness type & services: ${goalVal}\nWebsite Link: ${linkVal}\nTarget timeline: ${timelineVal}\nPackage or project type: ${data.title}\nBudget range: Starting at ${data.price}\n`;
  const mailtoHref = `mailto:hello@quoteintakestudio.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;

  document.querySelector("[data-brief-link]")?.setAttribute("href", mailtoHref);

  if (contactLink) contactLink.setAttribute("href", mailtoHref);
  if (contactFields) {
    contactFields.textContent = `Business, Link, ${data.title}, budget`;
  }
};

if (intakeGoal) intakeGoal.addEventListener("input", syncBriefInputs);
if (intakeLink) intakeLink.addEventListener("input", syncBriefInputs);
if (intakeTimeline) intakeTimeline.addEventListener("change", syncBriefInputs);

if (copyBriefBtn) {
  copyBriefBtn.addEventListener("click", () => {
    const data = briefData[currentBriefKey];
    if (!data) return;

    const goalVal = intakeGoal?.value.trim() || data.emailGoal;
    const linkVal = intakeLink?.value.trim() || "None provided";
    const timelineVal = intakeTimeline?.value || data.time;

    const textToCopy = `Quote Intake Studio - Project Brief
================================
Package: ${data.title}
Business & Services: ${goalVal}
Website Link: ${linkVal}
Timeline: ${timelineVal}
Budget: Starting at ${data.price}

Deliverables:
- ${data.items[0]}
- ${data.items[1]}
- ${data.items[2]}
`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalText = copyBriefBtn.textContent;
      copyBriefBtn.textContent = "✓ Brief Copied!";
      copyBriefBtn.classList.add("is-success");
      setTimeout(() => {
        copyBriefBtn.textContent = originalText;
        copyBriefBtn.classList.remove("is-success");
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  });
}

const updateBrief = (key, handoffOptions = {}) => {
  const data = briefData[key];
  if (!data || !briefOutput) return;
  currentBriefKey = key;
  const pricingIndex = pricingBriefKeys.indexOf(key);

  if (pricingIndex >= 0 && pricingCards.length) {
    lockPricingSequence();
    setPricingCard(pricingIndex);
  }

  briefButtons.forEach((button) => {
    const isActive = button.dataset.brief === key;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  syncActiveIndicator(briefOptionsContainer, document.querySelector(".brief-option.is-active"));

  const shouldAnimate = !reduceMotion;
  briefOutput.classList.remove("is-swapping");
  briefOptionsContainer?.classList.remove("is-settling");
  if (shouldAnimate) {
    void briefOutput.offsetWidth;
    briefOutput.classList.add("is-swapping");
    briefOptionsContainer?.classList.add("is-settling");
  }

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
  document.querySelector("[data-brief-email-subject]").textContent = data.subject;
  document.querySelector("[data-brief-email-goal]").textContent = data.emailGoal;
  document.querySelector("[data-brief-email-timeline]").textContent = data.time;
  document.querySelector("[data-brief-email-budget]").textContent = `Starting at ${data.price}`;
  document
    .querySelector("[data-brief-meter-complexity-bar]")
    ?.style.setProperty("--meter-width", data.meter.complexity[1]);
  document
    .querySelector("[data-brief-meter-turnaround-bar]")
    ?.style.setProperty("--meter-width", data.meter.turnaround[1]);
  document
    .querySelector("[data-brief-meter-handoff-bar]")
    ?.style.setProperty("--meter-width", data.meter.handoff[1]);

  if (intakeGoal) {
    intakeGoal.placeholder = `e.g., ${data.emailGoal}`;
  }
  if (intakeTimeline) {
    if (key === "audit") intakeTimeline.value = "1-3 business days";
    else if (key === "website") intakeTimeline.value = "1-2 weeks";
    else if (key === "automation") intakeTimeline.value = "Flexible";
    else if (key === "fix") intakeTimeline.value = "ASAP (critical fix)";
  }

  syncBriefInputs();

  contactBox?.classList.remove("is-draft-updating");
  if (shouldAnimate && contactBox) {
    void contactBox.offsetWidth;
    contactBox.classList.add("is-draft-updating");
    window.clearTimeout(contactDraftTimer);
    contactDraftTimer = window.setTimeout(() => {
      contactBox.classList.remove("is-draft-updating");
    }, 900);
  }

  if (contactStatus) contactStatus.textContent = `${data.title} ready`;
  if (contactSubject) contactSubject.textContent = data.subject;

  scheduleScopeHandoff(handoffOptions);
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

pricingBriefLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const briefKey = link.dataset.pricingBrief;
    updateBrief(briefKey, { extended: true });
  });
});

showcaseCta?.addEventListener("click", () => {
  const briefKey = showcasePanel?.dataset.briefKey;
  if (briefKey) updateBrief(briefKey);
});

backTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

themeToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    setTheme(getActiveTheme() === "dark" ? "light" : "dark");
  });
});

copyEmailButton?.addEventListener("click", async () => {
  const originalText = copyEmailButton.textContent;
  try {
    await navigator.clipboard.writeText("hello@quoteintakestudio.com");
    copyEmailButton.textContent = "Copied";
    copyEmailButton.classList.add("is-copied");
    window.setTimeout(() => {
      copyEmailButton.textContent = originalText;
      copyEmailButton.classList.remove("is-copied");
    }, 1600);
  } catch {
    copyEmailButton.textContent = "Email shown";
    window.setTimeout(() => {
      copyEmailButton.textContent = originalText;
    }, 1600);
  }
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

faqDetails.forEach((details) => {
  const summary = details.querySelector("summary");
  summary?.setAttribute("aria-expanded", String(details.open));

  summary?.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    if (!details.open) {
      details.open = true;
    }
    syncFaqState(details);
  });

  details.addEventListener("toggle", () => {
    if (faqSyncing) return;
    summary?.setAttribute("aria-expanded", String(details.open));
    if (!details.open) {
      const openDetails = document.querySelector("[data-faq-item][open]");
      if (!openDetails) {
        faqSyncing = true;
        details.open = true;
        faqSyncing = false;
        syncFaqState(details);
        return;
      }
      syncFaqState(openDetails);
      return;
    }

    faqSyncing = true;
    faqDetails.forEach((openDetails) => {
      if (openDetails !== details) {
        openDetails.removeAttribute("open");
        openDetails.querySelector("summary")?.setAttribute("aria-expanded", "false");
      }
    });
    faqSyncing = false;
    syncFaqState(details);
  });
});

syncFaqState(document.querySelector("[data-faq-item][open]") || faqDetails[0]);

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
window.addEventListener("resize", () => {
  window.requestAnimationFrame(syncAllActiveIndicators);
  });
  updateScrollState();
  syncAllActiveIndicators();

  // --- Custom Cursor Logic ---
  const cursor = document.querySelector(".custom-cursor");
  const cursorLabel = cursor?.querySelector(".cursor-label");
  const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
  if (cursor && hasFinePointer) {
    document.documentElement.classList.add("has-custom-cursor");
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    
    document.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      if (reduceMotion) {
        cursor.style.setProperty("--cursor-x", `${targetX}px`);
        cursor.style.setProperty("--cursor-y", `${targetY}px`);
      }
    });

    if (!reduceMotion) {
      const updateCursorPosition = () => {
        const ease = 0.15; // smooth interpolation coefficient
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;
        
        cursor.style.setProperty("--cursor-x", `${currentX.toFixed(1)}px`);
        cursor.style.setProperty("--cursor-y", `${currentY.toFixed(1)}px`);
        
        window.requestAnimationFrame(updateCursorPosition);
      };
      window.requestAnimationFrame(updateCursorPosition);
    }

    const interactiveSelectors = "a, button, [role='tab'], summary, .theme-toggle";
    
    document.body.addEventListener("mouseover", (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (!target) return;
      
      // Show "View" label for specific report/sample links
      const isSampleLink = 
        target.getAttribute("href") === "lead-leak-audit-sample.html" || 
        target.classList.contains("hero-sample-link") ||
        target.closest(".deliverable-preview-card .button") ||
        target.closest(".hero-actions") && target.getAttribute("href") === "lead-leak-audit-sample.html";
        
      if (isSampleLink) {
        cursor.classList.add("has-view-label");
        if (cursorLabel) cursorLabel.textContent = "View";
      }
      
      if (target.classList.contains("button") || target.classList.contains("dock-primary")) {
        cursor.classList.add("is-magnetic");
      } else {
        cursor.classList.add("is-hovering");
      }
    });

    document.body.addEventListener("mouseout", (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (!target) return;
      cursor.classList.remove("is-hovering", "is-magnetic", "has-view-label");
      if (cursorLabel) cursorLabel.textContent = "";
    });

    const magneticBtns = document.querySelectorAll(".button, .dock-primary");
    magneticBtns.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Slightly stronger coefficient (0.18 instead of 0.15) for high-end feel
        btn.style.setProperty("--button-x", `${x * 0.18}px`);
        btn.style.setProperty("--button-y", `${y * 0.18}px`);
        btn.style.setProperty("--button-glow-x", `${e.clientX - rect.left}px`);
        btn.style.setProperty("--button-glow-y", `${e.clientY - rect.top}px`);
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.setProperty("--button-x", `0px`);
        btn.style.setProperty("--button-y", `0px`);
        btn.style.setProperty("--button-glow-x", `50%`);
        btn.style.setProperty("--button-glow-y", `50%`);
      });
    });
  }

  // --- Text Scramble Effect ---
  const scrambleChars = "!<>-_/[]{}—=+*^?#_0101";
  const scrambleElements = document.querySelectorAll("[data-scramble]");

  const scrambleText = (el) => {
    if (el.dataset.scrambled === "true" || reduceMotion) return;
    el.dataset.scrambled = "true";
    
    const originalText = el.textContent.trim();
    if (!originalText) return;
    const length = originalText.length;
    let iteration = 0;
    
    const interval = setInterval(() => {
      el.textContent = originalText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          if (letter === " ") return " ";
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join("");
        
      if (iteration >= length) {
        clearInterval(interval);
        el.textContent = originalText;
      }
      
      iteration += 1 / 3;
    }, 25);
  };

  const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => scrambleText(entry.target), 150);
        scrambleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  scrambleElements.forEach((el) => scrambleObserver.observe(el));
