const header = document.querySelector("[data-site-header]");
const menuButton = document.querySelector("[data-menu-button]");
const primaryNav = document.querySelector("[data-primary-nav]");
const briefForm = document.querySelector("[data-brief-form]");
const briefSelect = document.querySelector("[data-brief-select]");
const packageButtons = document.querySelectorAll("[data-package]");

const packages = {
  audit: {
    name: "Lead Leak Audit",
    price: "$49 USD",
    time: "1â€“3 business days"
  },
  cta: {
    name: "Mobile CTA Cleanup",
    price: "$99 USD",
    time: "3â€“7 business days"
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

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 16);
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

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

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
    document.querySelector("#brief")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
