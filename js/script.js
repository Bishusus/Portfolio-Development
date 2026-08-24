/* ========================================================================== 
   1. UTILITY FUNCTIONS
   ========================================================================== */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* ========================================================================== 
   2. PORTFOLIO DATA MODEL & PAGE VIEWS REGISTRY
   ========================================================================== */
const Portfolio = {
  identity: {
    name: "Jennifer Hopkins",
    role: "Office Manager",
    location: "London, United Kingdom",
    intro:
      "We bring structure, calm, and efficiency to busy professional environments through thoughtful office operations and dependable client support.",
    github: "mailto:jennyhopkinszey@gmail.com",
    linkedin: "https://linkedin.com/in/jenniferhopkinszey",
  },
  people: [
    {
      role: "Office Manager",
      location: "London, United Kingdom",
      description:
        "An experienced office manager who brings structure, calm, and efficiency to busy professional environments.",
      language: "Office Management",
      tags: ["Office Operations", "Client Support", "Performance"],
      email: "jennyhopkinszey@gmail.com",
      image: "../portfolio.webp",
      featured: true,
      summary:
        "Office Manager with 8+ years of experience looking to take on new challenges. Skilled in office operations, supplier relationships, contract management, client support, and performance improvement.",
      workHistory: [
        {
          dates: "2017 - present",
          title: "Office Manager",
          company: "Semparare Accounting, London",
          achievements: [
            "Managed office operations and supervised a team of three assistants.",
            "Reduced annual office supply costs by 20% through contract negotiation and procurement controls.",
            "Introduced a 360-degree appraisal and feedback system for office assistants.",
            "Planned company travel and simplified the approval process, reducing business travel costs by 20%.",
          ],
        },
        {
          dates: "2012 - 2017",
          title: "Office Assistant",
          company: "Patel & Smythe, London",
          achievements: [
            "Organised and recorded appointments for the executive team.",
            "Created reports for senior management and improved report clarity.",
            "Managed phones, email enquiries, meetings, and accurate minutes.",
          ],
        },
      ],
      skills: [
        "Written communication skills",
        "Adaptability",
        "Contract management",
        "Analytical skills",
        "Performance management",
      ],
      languages: ["German - Advanced"],
      education: [
        "English, Maths, German, A levels - Forest Hill Comprehensive, London",
        "Maths and English, 9 GCSEs - Forest Hill Comprehensive, London",
      ],
    },
    {
      id: "marcus-reed",
      name: "Marcus Reed",
      role: "Operations Coordinator",
      location: "Manchester, United Kingdom",
      description:
        "A detail-focused operations coordinator who improves processes, supplier relationships, and team productivity.",
      language: "Operations",
      tags: ["Office Operations", "Analytics", "Communication"],
      email: "marcus.reed@example.com",
      featured: true,
      summary:
        "Operations coordinator experienced in improving administrative workflows, supporting cross-functional teams, and turning complex processes into dependable daily systems.",
      workHistory: [
        {
          dates: "2019 - present",
          title: "Operations Coordinator",
          company: "Northline Services, Manchester",
          achievements: [
            "Coordinated office workflows across three departments.",
            "Built reporting routines that helped managers identify delays and improve response times.",
            "Supported onboarding, supplier reviews, and team scheduling.",
          ],
        },
      ],
      skills: [
        "Process improvement",
        "Team coordination",
        "Reporting",
        "Supplier liaison",
      ],
      languages: ["English - Native", "French - Intermediate"],
      education: [
        "Business Administration, BA - Manchester Metropolitan University",
      ],
    },
    {
      id: "aisha-patel",
      name: "Aisha Patel",
      role: "Executive Assistant",
      location: "Birmingham, United Kingdom",
      description:
        "A confident executive assistant known for clear communication, precise scheduling, and thoughtful client and stakeholder support.",
      language: "Administration",
      tags: ["Client Support", "Communication", "Travel Coordination"],
      email: "aisha.patel@example.com",
      featured: false,
      summary:
        "Executive assistant with a strong record of supporting leadership teams, coordinating travel and events, and keeping confidential information organised and accessible.",
      workHistory: [
        {
          dates: "2020 - present",
          title: "Executive Assistant",
          company: "Cedar & Co, Birmingham",
          achievements: [
            "Managed complex executive calendars, travel bookings, and meeting preparation.",
            "Prepared correspondence, agendas, minutes, and follow-up actions.",
            "Maintained trusted relationships with clients and senior stakeholders.",
          ],
        },
      ],
      skills: [
        "Calendar management",
        "Client communication",
        "Travel planning",
        "Confidential administration",
      ],
      languages: ["English - Native", "Gujarati - Fluent"],
      education: ["Business and Administration Diploma - Birmingham College"],
    },
  ],
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let supabaseClient;
const AI_DESCRIPTION_ENDPOINT =
  window.DEVENGINE_AI_DESCRIPTION_ENDPOINT ||
  "http://localhost:3001/api/ai/improve-description";

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (!window.supabase?.createClient) {
    throw new Error("Supabase client has not loaded yet.");
  }
  if (
    !window.DEVENGINE_SUPABASE_URL ||
    window.DEVENGINE_SUPABASE_URL.includes("your-project-ref") ||
    !window.DEVENGINE_SUPABASE_ANON_KEY ||
    window.DEVENGINE_SUPABASE_ANON_KEY.includes("your-anon-public-key")
  ) {
    throw new Error(
      "Add your Supabase URL and anon key in js/supabase-config.js.",
    );
  }
  supabaseClient = window.supabase.createClient(
    window.DEVENGINE_SUPABASE_URL,
    window.DEVENGINE_SUPABASE_ANON_KEY,
  );
  return supabaseClient;
}

async function updateAuthUI() {
  const userEmail = document.getElementById("auth-user-email");
  const authButton = document.getElementById("auth-action-btn");
  const authOnlyLinks = document.querySelectorAll("[data-auth-only]");
  if (!userEmail || !authButton) return;

  try {
    const { data, error } = await getSupabaseClient().auth.getUser();
    if (error) throw error;
    const isLoggedIn = Boolean(data.user);
    authOnlyLinks.forEach((link) => {
      link.hidden = !isLoggedIn;
    });
    userEmail.textContent = isLoggedIn ? data.user.email : "";
    userEmail.hidden = !isLoggedIn;
    authButton.dataset.authState = isLoggedIn ? "logged-in" : "logged-out";
    authButton.querySelector(".auth-action-label").textContent = isLoggedIn
      ? "Logout"
      : "Login";
    authButton.querySelector(".auth-action-icon").textContent = isLoggedIn
      ? "↗"
      : "↪";
  } catch (error) {
    authOnlyLinks.forEach((link) => {
      link.hidden = true;
    });
    userEmail.hidden = true;
    authButton.dataset.authState = "logged-out";
    authButton.querySelector(".auth-action-label").textContent = "Login";
    authButton.querySelector(".auth-action-icon").textContent = "↪";
    if (!error.message.includes("Add your Supabase")) console.error(error);
  }
}

async function logoutUser() {
  const authButton = document.getElementById("auth-action-btn");
  if (authButton) authButton.disabled = true;
  try {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw error;
    await updateAuthUI();
    window.location.hash = "home";
  } catch (error) {
    console.error(error);
  } finally {
    if (authButton) authButton.disabled = false;
  }
}

const pagePaths = {
  home: "home.html",
  projects: "projects.html",
  builder: "builder.html",
  login: "login.html",
  contact: "contact.html",
  "my-portfolios": "my-portfolios.html",
};

const PortfolioTemplates = [
  {
    id: "flight-attendant",
    role: "Flight Attendant",
    industry: "Aviation & hospitality",
    name: "Kian Graham",
    image: "../images/bald-man.webp",
    headline:
      "Delivering exceptional service with calm, confident communication.",
    accent: "#38bdf8",
    skills: ["Customer service", "Safety care", "French fluency"],
    stats: ["3+ yrs experience", "2,000 flight hours"],
  },
  {
    id: "legal-assistant",
    role: "Legal Assistant",
    industry: "Legal services",
    name: "Leeanna Vega",
    image: "../images/Legal-Assistant-CV-Example.webp",
    headline: "Organising detail-heavy legal work with clarity and precision.",
    accent: "#5eead4",
    skills: ["Scheduling", "Document preparation", "Legal ethics"],
    stats: ["5 yrs experience", "8 core skills"],
  },
  {
    id: "office-manager",
    role: "Office Manager",
    industry: "Business operations",
    name: "Jennifer Hopkins",
    image: "../images/portfolio.webp",
    headline: "Bringing structure, calm, and efficiency to busy teams.",
    accent: "#fbbf24",
    skills: ["Office operations", "Client support", "Performance"],
    stats: ["8+ yrs experience", "20% cost savings"],
  },
];

function renderTemplateCards(filter = "all") {
  const templates = PortfolioTemplates.filter(
    (template) => filter === "all" || template.role === filter,
  );
  if (templates.length === 0) {
    return '<div class="empty-state">No templates are available for this category.</div>';
  }
  return templates
    .map(
      (template) => `
    <article class="template-card glass-card" style="--template-accent: ${template.accent}">
      <div class="template-card-preview">
        <img src="${escapeHtml(template.image)}" alt="${escapeHtml(template.role)} CV template example" class="template-card-image" />
        <span class="template-window-dot"></span><span class="template-window-dot"></span><span class="template-window-dot"></span>
        <div class="template-preview-mark">${escapeHtml(
          template.name
            .split(" ")
            .map((part) => part[0])
            .join(""),
        )}</div>
        <div><strong>${escapeHtml(template.name)}</strong><small>${escapeHtml(template.role)}</small></div>
        <div class="template-preview-line"></div><div class="template-preview-line short"></div>
      </div>
      <div class="template-card-content">
        <div class="project-card-top"><span class="project-language">${escapeHtml(template.industry)}</span><span class="template-status">Ready to personalize</span></div>
        <h3>${escapeHtml(template.role)}</h3>
        <p>${escapeHtml(template.headline)}</p>
        <div class="project-tags">${template.skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}</div>
        <button class="project-link template-preview-trigger" type="button" data-template-id="${escapeHtml(template.id)}">View portfolio <span aria-hidden="true">↗</span></button>
      </div>
    </article>
  `,
    )
    .join("");
}

function renderTemplatePreview(template) {
  return `<div class="live-preview"><div class="live-preview-top"><span class="badge-glow">Live sample preview</span><span>Sanitized dummy content</span></div>${renderFormattedPortfolio(template)}<a class="btn btn-gradient-primary preview-cta" href="#builder/${escapeHtml(template.id)}" data-close-modal>Use this template</a></div>`;
}

function toBuilderList(value, fallback = [], splitCommas = false) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "")
    .split(splitCommas ? /\r?\n|,/ : /\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .concat(value ? [] : fallback);
}

function renderBuilderEntries(value, fallback) {
  return toBuilderList(value, fallback)
    .map((entry) => {
      const parts = String(entry)
        .split("|")
        .map((part) => part.trim());
      return `<li>${parts.map((part) => escapeHtml(part)).join(" - ")}</li>`;
    })
    .join("");
}

function renderFormattedPortfolio(template, values = {}) {
  const name = values.name || template.name;
  const role = values.role || template.role;
  const location = values.location || template.industry;
  const headline = values.headline || template.headline;
  const email = values.email || "hello@reallygreatsite.com";
  const phone = values.phone || "+123-456-7890";
  const linkedin = values.linkedin || "linkedin.com/in/name";
  const website = values.website || "reallygreatsite.com";
  const github = values.github || "github.com/username";
  const skills = toBuilderList(values.skills, template.skills, true);
  const languages = toBuilderList(values.languages, ["English - Native"], true);
  const experience = toBuilderList(values.experience, [
    `${role} | ${location} | 2022-present | Delivered excellent work and supported team goals.`,
  ]);
  const education = toBuilderList(values.education, [
    `Professional qualification | University or institution | 2020`,
  ]);
  const certifications = toBuilderList(values.certifications, [
    "Professional certification | Issuing organisation | 2024",
  ]);
  const safeSkills = skills
    .map((skill) => `<li>${escapeHtml(skill)}</li>`)
    .join("");
  const safeLanguages = languages
    .map((language) => `<li>${escapeHtml(language)}</li>`)
    .join("");
  const safeExperience = renderBuilderEntries(experience, []);
  const safeEducation = renderBuilderEntries(education, []);
  const safeCertifications = renderBuilderEntries(certifications, []);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");

  if (template.id === "flight-attendant") {
    return `<article class="formatted-portfolio format-flight">
      <aside class="format-sidebar"><img src="${escapeHtml(template.image)}" alt="${escapeHtml(name)}" /><h2>${escapeHtml(name)}</h2><h3>${escapeHtml(role)}</h3><div class="format-contact"><p>in&nbsp; ${escapeHtml(linkedin)}</p><p>git&nbsp; ${escapeHtml(github)}</p><p>mail&nbsp; ${escapeHtml(email)}</p><p>tel&nbsp; ${escapeHtml(phone)}</p><p>web&nbsp; ${escapeHtml(website)}</p></div><h4>Relevant skills</h4><ul>${safeSkills}</ul><h4>Languages</h4><ul>${safeLanguages}</ul></aside>
      <div class="format-main"><section><h4>Work experience</h4><h3>✈ ${escapeHtml(role)}</h3><ul>${safeExperience}</ul></section><section><h4>Education history</h4><ul>${safeEducation}</ul></section><section><h4>Certifications</h4><ul>${safeCertifications}</ul></section></div>
    </article>`;
  }

  if (template.id === "legal-assistant") {
    return `<article class="formatted-portfolio format-legal"><header><div class="format-ribbon">${escapeHtml(initials)}</div><h2>${escapeHtml(name)}</h2></header><div class="format-columns"><aside><section><h4>Contact</h4><p>☎ ${escapeHtml(phone)}</p><p>✉ ${escapeHtml(email)}</p><p>⌖ ${escapeHtml(location)}</p><p>git ${escapeHtml(github)}</p></section><section><h4>Skills</h4><ul>${safeSkills}</ul></section><section><h4>Education</h4><ul>${safeEducation}</ul></section></aside><div class="format-main"><section><h4>Professional summary</h4><p>${escapeHtml(headline)}</p></section><section><h4>Work history</h4><ul>${safeExperience}</ul></section><section><h4>Certifications</h4><ul>${safeCertifications}</ul></section></div></div></article>`;
  }

  return `<article class="formatted-portfolio format-office"><aside class="format-sidebar"><h2>${escapeHtml(name)}</h2><h3>${escapeHtml(role)}</h3><section><h4>Personal Info</h4><p>Email<br /><strong>${escapeHtml(email)}</strong></p><p>Phone<br /><strong>${escapeHtml(phone)}</strong></p><p>LinkedIn<br /><strong>${escapeHtml(linkedin)}</strong></p><p>GitHub<br /><strong>${escapeHtml(github)}</strong></p><p>Website<br /><strong>${escapeHtml(website)}</strong></p></section><section><h4>Key Skills</h4><ul>${safeSkills}</ul></section><section><h4>Languages</h4><ul>${safeLanguages}</ul></section></aside><div class="format-main"><p class="format-intro">${escapeHtml(headline)}</p><section><h4>Work history</h4><ul>${safeExperience}</ul></section><section><h4>Education</h4><ul>${safeEducation}</ul></section><section><h4>Certifications</h4><ul>${safeCertifications}</ul></section></div></article>`;
}

function renderProjectCards(filter = "all") {
  const people = Portfolio.people.filter(
    (person) => filter === "all" || person.tags.includes(filter),
  );

  if (!people.length) {
    return '<div class="glass-card empty-state">No portfolios match this filter yet.</div>';
  }

  return people
    .map(
      (person) => `
        <article class="glass-card project-card">
          <div class="project-card-top">
            <span class="project-language">${escapeHtml(person.language)}</span>
            ${person.featured ? '<span class="project-featured">Featured</span>' : ""}
          </div>
          <h3>${escapeHtml(person.name)}</h3>
          <p class="project-role">${escapeHtml(person.role)} · ${escapeHtml(person.location)}</p>
          <p>${escapeHtml(person.description)}</p>
          <div class="project-tags">
            ${person.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
          <a class="project-link" href="#portfolio-${escapeHtml(person.id)}">View entire portfolio <span aria-hidden="true">↗</span></a>
        </article>
      `,
    )
    .join("");
}

function renderPortfolioDetail(person) {
  const workHistory = person.workHistory
    .map(
      (role) => `
        <article class="portfolio-role">
          <div class="portfolio-role-dates">${escapeHtml(role.dates)}</div>
          <div>
            <h3>${escapeHtml(role.title)}</h3>
            <p class="portfolio-company">${escapeHtml(role.company)}</p>
            <ul>${role.achievements.map((achievement) => `<li>${escapeHtml(achievement)}</li>`).join("")}</ul>
          </div>
        </article>
      `,
    )
    .join("");

  return `
    <section class="portfolio-detail page-section">
      <a class="portfolio-back" href="#projects">← Back to portfolios</a>
      <div class="portfolio-detail-header">
        ${person.image ? `<img src="${escapeHtml(person.image)}" alt="${escapeHtml(person.name)} resume" class="portfolio-detail-image">` : ""}
        <div>
          <span class="badge-glow">Complete Portfolio</span>
          <h2 class="section-title">${escapeHtml(person.name)}</h2>
          <p class="portfolio-detail-role">${escapeHtml(person.role)} · ${escapeHtml(person.location)}</p>
          <p class="portfolio-summary">${escapeHtml(person.summary)}</p>
          <a class="btn btn-gradient-primary" href="mailto:${escapeHtml(person.email)}">Contact ${escapeHtml(person.name.split(" ")[0])}</a>
        </div>
      </div>
      <div class="portfolio-detail-grid">
        <div>
          <section class="portfolio-detail-section">
            <h2>Work History</h2>
            ${workHistory}
          </section>
          <section class="portfolio-detail-section">
            <h2>Education</h2>
            <ul class="portfolio-list">${person.education.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </section>
        </div>
        <aside>
          <section class="portfolio-detail-section">
            <h2>Key Skills</h2>
            <ul class="portfolio-list">${person.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("")}</ul>
          </section>
          <section class="portfolio-detail-section">
            <h2>Languages</h2>
            <ul class="portfolio-list">${person.languages.map((language) => `<li>${escapeHtml(language)}</li>`).join("")}</ul>
          </section>
        </aside>
      </div>
    </section>
  `;
}

/* ==========================================================================
   2. SPA ROUTER ENGINE & EVENT HANDLERS
   ========================================================================== */

async function loadPartial(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  return response.text();
}

function hydrateIdentity() {
  const identity = Portfolio.identity;
  const textBindings = {
    "[data-identity-intro]": identity.intro,
    "[data-identity-name]": identity.name,
    "[data-identity-role]": identity.role,
    "[data-identity-location]": identity.location,
  };

  Object.entries(textBindings).forEach(([selector, value]) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  });

  document
    .querySelector("[data-identity-github]")
    ?.setAttribute("href", identity.github);
  document
    .querySelector("[data-identity-linkedin]")
    ?.setAttribute("href", identity.linkedin);
}

async function loadSavedPortfolio(slug) {
  const { data, error } = await getSupabaseClient()
    .from("portfolios")
    .select("template_id, title, slug, content")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  if (!data)
    throw new Error("This portfolio does not exist or is not published.");
  return data;
}

function showToast(message, iconSymbol = "✨") {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.innerHTML = `<span class="toast-icon">${escapeHtml(iconSymbol)}</span><span class="toast-message">${escapeHtml(message)}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-hiding");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function renderSavedPortfolio(portfolio) {
  const template = PortfolioTemplates.find(
    (item) => item.id === portfolio.template_id,
  );
  if (!template) throw new Error("This portfolio uses an unknown template.");
  const shareUrl = window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=${encodeURIComponent(shareUrl)}`;
  return `<section class="published-portfolio page-section"><a class="portfolio-back" href="#builder">← Build another portfolio</a><span class="badge-glow">Published portfolio</span><h1 class="section-title">${escapeHtml(portfolio.title)}</h1>${renderFormattedPortfolio(template, portfolio.content || {})}<aside class="portfolio-share-panel"><div><span class="badge-glow">Share your portfolio</span><h2>Take it with you.</h2><p>Scan this QR code or copy your live portfolio link below.</p><a class="project-link" href="${escapeHtml(shareUrl)}">${escapeHtml(shareUrl)}</a><div style="margin-top: 0.8rem;"><button class="btn btn-glass" type="button" id="copy-portfolio-link-btn">Copy Portfolio Link 📋</button></div></div><img class="portfolio-qr" src="${escapeHtml(qrUrl)}" alt="QR code for ${escapeHtml(portfolio.title)}" loading="eager" /></aside></section>`;
}

async function handleRouting() {
  const appContainer = document.getElementById("app");
  const rawHash = window.location.hash.replace("#", "").trim();
  const route = rawHash.toLowerCase() || "home";
  const builderRouteMatch = route.match(/^builder(?:\/(.+))?$/);
  const baseRoute = builderRouteMatch ? "builder" : route;
  const builderTemplateId = builderRouteMatch?.[1] || "";
  const editRouteMatch = route.match(/^edit-portfolio\/(.+)$/);
  const editPortfolioId = editRouteMatch?.[1] || "";
  const savedPortfolioSlug = route.startsWith("portfolio/")
    ? route.slice("portfolio/".length)
    : "";

  const selectedPerson = route.startsWith("portfolio-")
    ? Portfolio.people.find((person) => `portfolio-${person.id}` === route)
    : null;
  const pageRoute = editPortfolioId ? "builder" : baseRoute;
  try {
    appContainer.innerHTML = selectedPerson
      ? renderPortfolioDetail(selectedPerson)
      : savedPortfolioSlug
        ? renderSavedPortfolio(await loadSavedPortfolio(savedPortfolioSlug))
        : await loadPartial(`pages/${pagePaths[pageRoute] || pagePaths.home}`);
  } catch (error) {
    appContainer.innerHTML = `<section class="page-section"><span class="badge-glow">Portfolio unavailable</span><h2 class="section-title">This page could not be loaded.</h2><p class="section-subtitle">${escapeHtml(error.message || "Please try again or return to the builder.")}</p><a class="btn btn-gradient-primary" href="#builder">Return to builder</a></section>`;
    console.error(error);
  }

  hydrateIdentity();

  updateActiveNavLink(pageRoute);
  closeMobileMenu();

  if (pageRoute === "home") {
    initHomePage();
  }

  if (route === "projects") {
    initProjectFilters();
  }

  if (route === "login") {
    initAuthPage();
  }

  if (route === "contact") {
    initContactPage();
  }

  if (baseRoute === "builder" && !editPortfolioId) {
    initBuilderPage(builderTemplateId);
  }

  if (editPortfolioId) {
    try {
      await loadEditorPortfolio(editPortfolioId);
    } catch (error) {
      appContainer.innerHTML = `<section class="page-section"><span class="badge-glow">Portfolio unavailable</span><h2 class="section-title">This portfolio could not be opened.</h2><p class="section-subtitle">${escapeHtml(error.message || "Please return to your portfolio workspace.")}</p><a class="btn btn-gradient-primary" href="#my-portfolios">Back to your portfolios</a></section>`;
      console.error(error);
    }
  }

  if (baseRoute === "my-portfolios") {
    initMyPortfoliosPage();
  }
}

function updateActiveNavLink(currentRoute) {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    const linkRoute = link.getAttribute("href").replace("#", "").toLowerCase();
    if (linkRoute === currentRoute) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });
}

function initMobileNavigation() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const navContainer = document.getElementById("primary-navigation");

  toggleBtn?.addEventListener("click", () => {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", !isExpanded);
    navContainer?.classList.toggle("is-open", !isExpanded);
  });
}

function closeMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const navContainer = document.getElementById("primary-navigation");

  if (toggleBtn && navContainer) {
    toggleBtn.setAttribute("aria-expanded", "false");
    navContainer.classList.remove("is-open");
  }
}

async function submitAuthForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const mode = form.elements.mode.value;
  const status = document.getElementById("auth-status");
  const submit = document.getElementById("auth-submit");
  status.textContent = "Working...";
  submit.disabled = true;
  try {
    const client = getSupabaseClient();
    const credentials = {
      email: form.elements.email.value.trim(),
      password: form.elements.password.value,
    };
    const result =
      mode === "signup"
        ? await client.auth.signUp(credentials)
        : await client.auth.signInWithPassword(credentials);
    if (result.error) throw result.error;
    status.textContent =
      mode === "signup"
        ? "Account created. Check your email if confirmation is enabled."
        : `Signed in as ${result.data.user.email}.`;
    form.reset();
    await updateAuthUI();
    if (mode === "login") window.location.hash = "home";
  } catch (error) {
    status.textContent = error.message;
  } finally {
    submit.disabled = false;
  }
}

function initAuthPage() {
  const form = document.getElementById("auth-form");
  const toggle = document.getElementById("auth-toggle");
  const mode = document.getElementById("auth-mode");
  const submit = document.getElementById("auth-submit");
  if (!form || !toggle || !mode || !submit) return;
  form.addEventListener("submit", submitAuthForm);
  toggle.addEventListener("click", () => {
    const isSignup = mode.value === "signup";
    mode.value = isSignup ? "login" : "signup";
    submit.textContent = isSignup ? "Log in" : "Create account";
    toggle.textContent = isSignup ? "Create an account" : "Back to login";
  });
}

async function submitContactForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("contact-status");
  const submit = form.querySelector('button[type="submit"]');
  status.textContent = "Sending...";
  submit.disabled = true;
  try {
    const client = getSupabaseClient();
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      window.location.hash = "login";
      return;
    }
    const { error } = await client.from("contact_messages").insert({
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim(),
    });
    if (error) throw error;
    form.reset();
    status.textContent = "Message sent. We will get back to you soon.";
    showContactResult(
      "Message sent",
      "Thank you for contacting us. Your message has been securely saved.",
      true,
    );
  } catch (error) {
    const message = error.message || "Unable to send your message right now.";
    status.textContent = message;
    showContactResult("Message not sent", message, false);
  } finally {
    submit.disabled = false;
  }
}

function showContactResult(title, message, isSuccess) {
  const dialog = document.getElementById("contact-result");
  const badge = document.getElementById("contact-result-badge");
  const titleElement = document.getElementById("contact-result-title");
  const messageElement = document.getElementById("contact-result-message");
  if (!dialog || !badge || !titleElement || !messageElement) return;
  badge.textContent = isSuccess ? "Message received" : "Message status";
  dialog.dataset.result = isSuccess ? "success" : "error";
  titleElement.textContent = title;
  messageElement.textContent = message;
  dialog.hidden = false;
  dialog.querySelector("[data-close-contact-result]")?.focus();
}

function initContactResultDialog() {
  const dialog = document.getElementById("contact-result");
  document.querySelectorAll("[data-close-contact-result]").forEach((element) =>
    element.addEventListener("click", () => {
      if (dialog) dialog.hidden = true;
    }),
  );
}

function initHomePage() {
  const quickImportForm = document.getElementById("hero-quick-import-form");
  if (quickImportForm) {
    quickImportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById("hero-github-username");
      const username = usernameInput ? usernameInput.value.trim() : "";
      if (username) {
        sessionStorage.setItem("pendingGithubUsername", username);
        window.location.hash = "builder";
      }
    });
  }

  const tabButtons = document.querySelectorAll(".feature-tab-btn");
  const tabPanels = document.querySelectorAll(".feature-tab-panel");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTabId = btn.dataset.tab;
      tabButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      tabPanels.forEach((panel) => {
        panel.classList.remove("active");
        panel.hidden = true;
      });

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const targetPanel = document.getElementById(targetTabId);
      if (targetPanel) {
        targetPanel.hidden = false;
        targetPanel.classList.add("active");
      }
    });
  });

  // 4. Hero Title Typewriter Repeating Effect
  const typewriterEl = document.getElementById("hero-typewriter");
  if (typewriterEl) {
    const phrase = "High-Quality Portfolios";
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      if (isDeleting) {
        charIndex--;
        typewriterEl.textContent = phrase.substring(0, charIndex);
      } else {
        charIndex++;
        typewriterEl.textContent = phrase.substring(0, charIndex);
      }

      let typeSpeed = isDeleting ? 100 : 90;

      if (!isDeleting && charIndex === phrase.length) {
        typeSpeed = 3200; // Comfortable 3.2s pause on completion
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        typeSpeed = 600; // Pause before restarting typing loop
      }

      setTimeout(typeLoop, typeSpeed);
    }
    typeLoop();
  }
}

async function initContactPage() {
  const form = document.getElementById("contact-form");
  const authRequired = document.getElementById("contact-auth-required");
  if (!form || !authRequired) return;
  form.hidden = false;
  authRequired.hidden = true;
  form.addEventListener("submit", submitContactForm);
}

function initBuilderPage(templateId = "", portfolio = null) {
  const form = document.getElementById("builder-form");
  const templateSelect = document.getElementById("builder-template");
  const preview = document.getElementById("builder-preview-content");
  const status = document.getElementById("builder-status");
  if (!form || !templateSelect || !preview || !status) return;

  templateSelect.innerHTML = PortfolioTemplates.map(
    (template) =>
      `<option value="${escapeHtml(template.id)}">${escapeHtml(template.role)} - ${escapeHtml(template.industry)}</option>`,
  ).join("");
  if (PortfolioTemplates.some((template) => template.id === templateId)) {
    templateSelect.value = templateId;
  }

  const fields = [
    "name",
    "role",
    "location",
    "email",
    "phone",
    "linkedin",
    "website",
    "github",
    "headline",
    "skills",
    "experience",
    "education",
    "certifications",
    "languages",
  ];
  const selectedTemplate = () =>
    PortfolioTemplates.find(
      (template) => template.id === templateSelect.value,
    ) || PortfolioTemplates[0];
  const updatePreview = () => {
    const template = selectedTemplate();
    const values = Object.fromEntries(
      fields.map((field) => [field, form.elements[field].value.trim()]),
    );
    const skills = values.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    preview.innerHTML = renderFormattedPortfolio(template, {
      ...values,
      skills: skills.join(", "),
    });
  };

  const loadTemplateValues = (template) => {
    form.elements.name.value = template.name;
    form.elements.role.value = template.role;
    form.elements.location.value = template.industry;
    form.elements.email.value = "hello@reallygreatsite.com";
    form.elements.phone.value = "+123-456-7890";
    form.elements.linkedin.value = "https://linkedin.com/in/name";
    form.elements.website.value = "https://reallygreatsite.com";
    form.elements.github.value = "https://github.com/username";
    form.elements.headline.value = template.headline;
    form.elements.skills.value = template.skills.join(", ");
    form.elements.experience.value = `${template.role} | ${template.industry} | 2022-present | ${template.headline}`;
    form.elements.education.value =
      "Professional qualification | University or institution | 2020";
    form.elements.certifications.value =
      "Professional certification | Issuing organisation | 2024";
    form.elements.languages.value = "English - Native";
  };

  loadTemplateValues(selectedTemplate());
  if (portfolio) {
    form.dataset.portfolioId = portfolio.id;
    const savedValues = portfolio.content || {};
    Object.keys(savedValues).forEach((field) => {
      if (form.elements[field]) form.elements[field].value = savedValues[field];
    });
  }
  fields.forEach((field) =>
    form.elements[field].addEventListener("input", debounce(updatePreview, 300)),
  );
  document
    .getElementById("github-import-btn")
    ?.addEventListener("click", () =>
      importGithubProfile(form, status, updatePreview),
    );
  document
    .getElementById("github-load-more")
    ?.addEventListener("click", () =>
      loadMoreGithubProjects(form, status, updatePreview),
    );
  templateSelect.addEventListener("change", () => {
    const nextTemplate = selectedTemplate();
    loadTemplateValues(nextTemplate);
    updatePreview();
  });
  updatePreview();
  const pendingUsername = sessionStorage.getItem("pendingGithubUsername");
  if (pendingUsername) {
    sessionStorage.removeItem("pendingGithubUsername");
    if (form.elements.github) {
      form.elements.github.value = pendingUsername;
      importGithubProfile(form, status, updatePreview);
    }
  }
  const deviceBtns = document.querySelectorAll(".device-btn");
  deviceBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      deviceBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.dataset.device;
      if (mode === "mobile") {
        preview.classList.add("preview-mode-mobile");
      } else {
        preview.classList.remove("preview-mode-mobile");
      }
    });
  });
  form.addEventListener("submit", (event) =>
    saveBuilderPortfolio(event, status),
  );
}

async function loadEditorPortfolio(portfolioId) {
  const client = getSupabaseClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) {
    window.location.hash = "login";
    return;
  }
  const { data, error } = await client
    .from("portfolios")
    .select("id, template_id, content")
    .eq("id", portfolioId)
    .eq("user_id", userData.user.id)
    .single();
  if (error) throw error;
  initBuilderPage(data.template_id, data);
}

async function importGithubProfile(form, status, updatePreview) {
  const importButton = document.getElementById("github-import-btn");
  const loadMoreButton = document.getElementById("github-load-more");
  const rawValue = form.elements.github.value.trim();
  const username = rawValue
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0];
  if (!username) {
    status.textContent = "Enter a GitHub username or profile URL first.";
    return;
  }
  importButton.disabled = true;
  status.textContent = "Importing GitHub profile...";
  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? "That GitHub profile could not be found."
          : "GitHub is temporarily unavailable. Try again shortly.",
      );
    }
    const profile = await response.json();
    const repositories = await fetchGithubRepositories(username, 1);
    form.dataset.githubUsername = username;
    form.dataset.githubPage = "1";
    form.dataset.githubRepositories = JSON.stringify(repositories);
    const languages = [
      ...new Set(repositories.map((repo) => repo.language).filter(Boolean)),
    ];
    const projects = repositories.map(
      (repo) =>
        `${repo.name} | GitHub project | ${new Date(repo.updated_at).getFullYear()} | ${repo.description || "Open-source project"}`,
    );
    form.elements.name.value = profile.name || profile.login;
    form.elements.github.value = profile.html_url;
    form.elements.location.value =
      profile.location || form.elements.location.value;
    form.elements.email.value = profile.email || form.elements.email.value;
    form.elements.website.value = profile.blog || form.elements.website.value;
    form.elements.headline.value =
      profile.bio ||
      `${profile.name || profile.login} builds software in public.`;
    form.elements.skills.value = languages.length
      ? languages.join(", ")
      : form.elements.skills.value;
    form.elements.experience.value = projects.length
      ? projects.join("\n")
      : form.elements.experience.value;
    loadMoreButton.hidden = repositories.length < 6;
    renderGithubAiReview(form, status, updatePreview);
    status.textContent = `Imported ${repositories.length} GitHub project${repositories.length === 1 ? "" : "s"}. Review the details before publishing.`;
    showToast(`Imported ${repositories.length} GitHub repositories!`, "🐙");
    updatePreview();
  } catch (error) {
    status.textContent =
      error.message || "Unable to import this GitHub profile.";
  } finally {
    importButton.disabled = false;
  }
}

async function fetchGithubRepositories(username, page) {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6&page=${page}`,
    { headers: { Accept: "application/vnd.github+json" } },
  );
  if (!response.ok) throw new Error("GitHub repositories could not be loaded.");
  return response.json();
}

function githubExperienceLine(repo) {
  return `${repo.name} | GitHub project | ${new Date(repo.updated_at).getFullYear()} | ${repo.description || "Open-source project"}`;
}

function syncGithubExperience(form, repositories, updatePreview) {
  form.dataset.githubRepositories = JSON.stringify(repositories);
  form.elements.experience.value = repositories.map(githubExperienceLine).join("\n");
  updatePreview();
}

function renderGithubAiReview(form, status, updatePreview) {
  const section = document.getElementById("github-ai-review-section");
  const list = document.getElementById("github-imported-projects-list");
  if (!section || !list) return;

  const repositories = JSON.parse(form.dataset.githubRepositories || "[]");
  section.hidden = repositories.length === 0;
  list.innerHTML = repositories
    .map(
      (repo, index) => `<article class="ai-project-card" data-repo-index="${index}">
        <div><h5>${escapeHtml(repo.name)}</h5><p>${escapeHtml(repo.description || "No GitHub description provided.")}</p><span>${escapeHtml(repo.language || "Technology not specified")}</span></div>
        <button class="btn btn-glass ai-improve-btn" type="button" data-ai-improve="${index}">Improve description</button>
        <div class="ai-project-suggestion" hidden></div>
      </article>`,
    )
    .join("");

  list.querySelectorAll("[data-ai-improve]").forEach((button) => {
    button.addEventListener("click", () =>
      improveGithubDescription(form, Number(button.dataset.aiImprove), status, updatePreview),
    );
  });
}

async function improveGithubDescription(form, index, status, updatePreview) {
  const repositories = JSON.parse(form.dataset.githubRepositories || "[]");
  const repo = repositories[index];
  const card = document.querySelector(`[data-repo-index="${index}"]`);
  const button = card?.querySelector("[data-ai-improve]");
  const suggestion = card?.querySelector(".ai-project-suggestion");
  if (!repo || !button || !suggestion) return;

  button.disabled = true;
  button.textContent = "Improving...";
  try {
    const response = await fetch(AI_DESCRIPTION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: repo.name,
        description: repo.description || "",
        languages: [repo.language, ...Object.values(repo.languages || {})].filter(Boolean),
        notes: "Imported from a public GitHub repository.",
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data?.description) {
      throw new Error(result.error || "The AI service could not improve this description.");
    }
    if (result.data.source === "fallback") {
      throw new Error(result.data.warning || "Gemini is unavailable, so no AI-generated suggestion was returned.");
    }

    suggestion.hidden = false;
    suggestion.innerHTML = `<p><strong>Suggested description</strong></p><p>${escapeHtml(result.data.description)}</p><div class="ai-suggestion-actions"><button class="btn btn-gradient-primary" type="button" data-ai-apply>Use suggestion</button><button class="btn btn-glass" type="button" data-ai-dismiss>Keep original</button></div>`;
    suggestion.querySelector("[data-ai-apply]").addEventListener("click", () => {
      repositories[index].description = result.data.description;
      syncGithubExperience(form, repositories, updatePreview);
      renderGithubAiReview(form, status, updatePreview);
      status.textContent = `Applied the AI description for ${repo.name}.`;
    });
    suggestion.querySelector("[data-ai-dismiss]").addEventListener("click", () => {
      suggestion.hidden = true;
      button.disabled = false;
      button.textContent = "Improve description";
    });
  } catch (error) {
    status.textContent = error.message || "Unable to reach the AI description service.";
  } finally {
    if (!suggestion.hidden) return;
    button.disabled = false;
    button.textContent = "Improve description";
  }
}

async function loadMoreGithubProjects(form, status, updatePreview) {
  const button = document.getElementById("github-load-more");
  const username = form.dataset.githubUsername;
  if (!username) return;
  button.disabled = true;
  status.textContent = "Loading more GitHub projects...";
  try {
    const nextPage = Number(form.dataset.githubPage || 1) + 1;
    const nextRepositories = await fetchGithubRepositories(username, nextPage);
    const repositories = JSON.parse(
      form.dataset.githubRepositories || "[]",
    ).concat(nextRepositories);
    form.dataset.githubPage = String(nextPage);
    form.dataset.githubRepositories = JSON.stringify(repositories);
    form.elements.experience.value = repositories
      .map(
        (repo) =>
          `${repo.name} | GitHub project | ${new Date(repo.updated_at).getFullYear()} | ${repo.description || "Open-source project"}`,
      )
      .join("\n");
    const languages = [
      ...new Set(repositories.map((repo) => repo.language).filter(Boolean)),
    ];
    if (languages.length) form.elements.skills.value = languages.join(", ");
    button.hidden = nextRepositories.length < 6;
    renderGithubAiReview(form, status, updatePreview);
    status.textContent = `Imported ${repositories.length} GitHub projects.`;
    updatePreview();
  } catch (error) {
    status.textContent =
      error.message || "Unable to load more GitHub projects.";
  } finally {
    button.disabled = false;
  }
}

async function saveBuilderPortfolio(event, status) {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = event.submitter || form.querySelector('button[type="submit"]');
  const isPublishing = submit.dataset.builderAction === "publish";
  form.querySelectorAll('button[type="submit"]').forEach((button) => {
    button.disabled = true;
  });
  status.textContent = isPublishing
    ? "Publishing portfolio..."
    : "Saving draft...";
  try {
    const client = getSupabaseClient();
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      status.innerHTML =
        'Please <a href="#login">log in</a> before saving your portfolio.';
      return;
    }
    const values = Object.fromEntries(
      [
        "template",
        "name",
        "role",
        "location",
        "email",
        "phone",
        "linkedin",
        "website",
        "github",
        "headline",
        "skills",
        "experience",
        "education",
        "certifications",
        "languages",
      ].map((field) => [field, form.elements[field].value.trim()]),
    );
    const existingPortfolioId = form.dataset.portfolioId;
    const portfolioPayload = {
      user_id: userData.user.id,
      template_id: values.template,
      title: `${values.name} portfolio`,
      status: isPublishing ? "published" : "draft",
      content: {
        ...values,
      },
    };
    if (!existingPortfolioId) {
      portfolioPayload.slug = `${values.name}-${Date.now()}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    const query = existingPortfolioId
      ? client
          .from("portfolios")
          .update(portfolioPayload)
          .eq("id", existingPortfolioId)
          .eq("user_id", userData.user.id)
      : client.from("portfolios").insert(portfolioPayload);
    const { data: savedPortfolio, error } = await query
      .select("id, slug")
      .single();
    if (error) throw error;
    form.dataset.portfolioId = savedPortfolio.id;
    if (isPublishing) {
      showToast("Portfolio published successfully!", "🚀");
      window.location.hash = `portfolio/${savedPortfolio.slug}`;
      return;
    }
    status.textContent = "Draft saved to your account.";
    showToast("Draft saved to your account!", "💾");
  } catch (error) {
    status.textContent = error.message || "Unable to save this draft.";
  } finally {
    form.querySelectorAll('button[type="submit"]').forEach((button) => {
      button.disabled = false;
    });
  }
}

function renderPortfolioLibraryCard(portfolio) {
  const template = PortfolioTemplates.find(
    (item) => item.id === portfolio.template_id,
  );
  const content = portfolio.content || {};
  const title = content.name ? `${content.name} portfolio` : portfolio.title;
  const isPublished = portfolio.status === "published";
  const action = isPublished
    ? `<a class="project-link" href="#portfolio/${encodeURIComponent(portfolio.slug)}">Open portfolio <span aria-hidden="true">↗</span></a>`
    : `<a class="project-link" href="#edit-portfolio/${encodeURIComponent(portfolio.id)}">Continue building <span aria-hidden="true">→</span></a>`;
  const managementActions = `<div class="portfolio-management-actions"><a class="project-link" href="#edit-portfolio/${encodeURIComponent(portfolio.id)}">Edit</a>${isPublished ? '<button type="button" class="portfolio-action" data-portfolio-action="unpublish">Unpublish</button>' : ""}<button type="button" class="portfolio-action" data-portfolio-action="archive">Archive</button><button type="button" class="portfolio-action portfolio-action-danger" data-portfolio-action="delete">Delete</button><button type="button" class="portfolio-action" data-portfolio-export="csv">📊 CSV</button><button type="button" class="portfolio-action" data-portfolio-export="pdf">📄 PDF</button></div>`;
  return `<article class="glass-card portfolio-library-card" data-portfolio-id="${escapeHtml(portfolio.id)}"><div class="portfolio-library-card-top"><span class="project-language">${escapeHtml(template?.role || "Portfolio")}</span><span class="portfolio-status portfolio-status-${escapeHtml(portfolio.status)}">${escapeHtml(portfolio.status)}</span></div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(content.role || template?.industry || "Personal portfolio")}</p><p class="portfolio-library-date">Updated ${escapeHtml(new Date(portfolio.updated_at || portfolio.created_at).toLocaleDateString())}</p>${action}${managementActions}</article>`;
}

async function initMyPortfoliosPage() {
  const grid = document.getElementById("my-portfolios-grid");
  const status = document.getElementById("my-portfolios-status");
  if (!grid || !status) return;
  try {
    const client = getSupabaseClient();
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      status.innerHTML =
        'Please <a href="#login">log in</a> to see your portfolios.';
      return;
    }
    const { data, error } = await client
      .from("portfolios")
      .select(
        "id, template_id, title, slug, status, content, created_at, updated_at",
      )
      .eq("user_id", userData.user.id)
      .neq("status", "archived")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    if (!data?.length) {
      status.textContent = "You have not built a portfolio yet.";
      grid.innerHTML =
        '<a class="glass-card portfolio-empty-card" href="#builder"><h3>Build your first portfolio</h3><p>Choose one of the three layouts and start shaping your story.</p></a>';
      return;
    }
    status.textContent = `${data.length} portfolio${data.length === 1 ? "" : "s"} in your workspace.`;
    grid.innerHTML = data.map(renderPortfolioLibraryCard).join("");
    grid.querySelectorAll("[data-portfolio-action]").forEach((button) =>
      button.addEventListener("click", () =>
        managePortfolio(
          button.closest("[data-portfolio-id]").dataset.portfolioId,
          button.dataset.portfolioAction,
          status,
        ),
      ),
    );
    grid.querySelectorAll("[data-portfolio-export]").forEach((button) => {
      button.addEventListener("click", () => {
        const portfolioId = button.closest("[data-portfolio-id]").dataset.portfolioId;
        const portfolio = data.find((p) => p.id === portfolioId);
        if (portfolio) {
          const exportType = button.dataset.portfolioExport;
          if (exportType === "csv") {
            downloadCSV(portfolio);
          } else if (exportType === "pdf") {
            downloadPDF(portfolio);
          }
        }
      });
    });
  } catch (error) {
    status.textContent = error.message || "Unable to load your portfolios.";
  }
}

async function managePortfolio(portfolioId, action, status) {
  const messages = {
    unpublish: "Unpublish this portfolio? It will become a draft.",
    archive:
      "Archive this portfolio? It will leave your active portfolio list.",
    delete: "Delete this portfolio permanently? This cannot be undone.",
  };
  if (!window.confirm(messages[action])) return;
  try {
    const client = getSupabaseClient();
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) throw new Error("Please log in again.");
    const query = client.from("portfolios");
    const result =
      action === "delete"
        ? await query
            .delete()
            .eq("id", portfolioId)
            .eq("user_id", userData.user.id)
            .select("id")
            .maybeSingle()
        : await query
            .update({
              status: action === "unpublish" ? "draft" : "archived",
            })
            .eq("id", portfolioId)
            .eq("user_id", userData.user.id)
            .select("id, status")
            .maybeSingle();
    if (result.error) throw result.error;
    if (!result.data) throw new Error("Portfolio was not changed.");
    status.textContent =
      action === "delete"
        ? "Portfolio deleted."
        : `Portfolio ${action === "unpublish" ? "unpublished" : "archived"}.`;
    await initMyPortfoliosPage();
  } catch (error) {
    status.textContent = error.message || "Unable to update this portfolio.";
  }
}

function initAuthSession() {
  const authButton = document.getElementById("auth-action-btn");
  const logoutConfirmation = document.getElementById("logout-confirmation");
  const confirmLogoutButton = document.getElementById("confirm-logout-btn");
  const closeLogoutConfirmation = () => {
    if (logoutConfirmation) logoutConfirmation.hidden = true;
  };

  authButton?.addEventListener("click", () => {
    if (authButton.dataset.authState === "logged-in") {
      if (logoutConfirmation) {
        logoutConfirmation.hidden = false;
        confirmLogoutButton?.focus();
      }
    } else {
      window.location.hash = "login";
    }
  });
  document
    .querySelectorAll("[data-close-logout]")
    .forEach((element) =>
      element.addEventListener("click", closeLogoutConfirmation),
    );
  confirmLogoutButton?.addEventListener("click", async () => {
    closeLogoutConfirmation();
    await logoutUser();
  });
  try {
    const client = getSupabaseClient();
    client.auth.onAuthStateChange(() => {
      window.setTimeout(() => void updateAuthUI(), 0);
    });
    updateAuthUI();
  } catch (error) {
    if (!error.message.includes("Add your Supabase")) console.error(error);
  }
}

function initProjectFilters() {
  const grid = document.getElementById("projects-grid");
  const filterButtons = document.querySelectorAll("[data-filter]");
  let activeFilter = "all";

  if (!grid) return;

  const updateGrid = () => {
    grid.innerHTML = renderTemplateCards(activeFilter);
    bindTemplatePreviews();
  };

  const modal = document.getElementById("template-modal");
  const preview = document.getElementById("template-preview");
  const closeModal = () => {
    if (modal) modal.hidden = true;
  };
  document
    .querySelectorAll("[data-close-modal]")
    .forEach((element) => element.addEventListener("click", closeModal));

  const bindTemplatePreviews = () => {
    document.querySelectorAll(".template-preview-trigger").forEach((button) =>
      button.addEventListener("click", () => {
        const template = PortfolioTemplates.find(
          (item) => item.id === button.dataset.templateId,
        );
        if (template && modal && preview) {
          preview.innerHTML = renderTemplatePreview(template);
          modal.hidden = false;
          modal.querySelector(".template-modal-close")?.focus();
        }
      }),
    );
  };

  updateGrid();

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      updateGrid();

      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
    });
  });
}

/* ==========================================================================
   3. UTILITIES & CHART INITIALIZATION
   ========================================================================== */

function initThemeSwitcher() {
  const themeBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  const getTheme = () =>
    document.documentElement.getAttribute("data-theme") || "dark";

  const updateIcon = (theme) => {
    if (themeIcon) themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
  };

  updateIcon(getTheme());

  themeBtn?.addEventListener("click", () => {
    const newTheme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
  });
}

function initFooterMetadata() {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

/* ==========================================================================
   4. CSV & PDF EXPORT FUNCTIONS
   ========================================================================== */

function generateCSVFromPortfolio(portfolio) {
  const content = portfolio.content || {};
  const template = PortfolioTemplates.find(
    (item) => item.id === portfolio.template_id,
  );
  const title = content.name ? `${content.name} portfolio` : portfolio.title;

  const csvRows = [
    ["Portfolio Export"],
    ["Title", title],
    ["Status", portfolio.status],
    ["Created", new Date(portfolio.created_at).toLocaleDateString()],
    ["Updated", new Date(portfolio.updated_at).toLocaleDateString()],
    [],
    ["Personal Information"],
    ["Name", content.name || ""],
    ["Role", content.role || ""],
    ["Location", content.location || ""],
    ["Email", content.email || ""],
    ["Phone", content.phone || ""],
    ["LinkedIn", content.linkedin || ""],
    ["Website", content.website || ""],
    ["GitHub", content.github || ""],
    [],
    ["Headline", content.headline || ""],
    [],
    ["Skills"],
    ...(content.skills ? content.skills.split(",").map((skill) => [skill.trim()]) : []),
    [],
    ["Languages"],
    ...(content.languages ? content.languages.split(",").map((lang) => [lang.trim()]) : []),
    [],
    ["Work Experience"],
    ["Role", "Company/Organization", "Dates", "Description"],
    ...(content.experience ? content.experience.split("\n").map((exp) => {
      const parts = exp.split("|").map((part) => part.trim());
      return parts.slice(0, 4);
    }) : []),
    [],
    ["Education"],
    ["Qualification", "Institution", "Year"],
    ...(content.education ? content.education.split("\n").map((edu) => {
      const parts = edu.split("|").map((part) => part.trim());
      return parts.slice(0, 3);
    }) : []),
    [],
    ["Certifications"],
    ["Certification", "Issuing Organisation", "Year"],
    ...(content.certifications ? content.certifications.split("\n").map((cert) => {
      const parts = cert.split("|").map((part) => part.trim());
      return parts.slice(0, 3);
    }) : []),
  ];

  const csvContent = csvRows
    .map((row) => row.map((cell) => {
      const escaped = String(cell).replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(","))
    .join("\n");

  return csvContent;
}

function downloadCSV(portfolio) {
  try {
    const csvContent = generateCSVFromPortfolio(portfolio);
    const content = portfolio.content || {};
    const title = content.name ? `${content.name} portfolio` : portfolio.title;
    const filename = `${title.replace(/[^a-z0-9]/gi, "_")}_export.csv`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("CSV downloaded successfully!", "📊");
  } catch (error) {
    console.error("CSV download error:", error);
    showToast("Failed to download CSV", "❌");
  }
}

async function generatePDFFromPortfolio(portfolio) {
  const content = portfolio.content || {};
  const template = PortfolioTemplates.find(
    (item) => item.id === portfolio.template_id,
  );

  // Route to specific template generator
  if (template.id === "flight-attendant") {
    return generateFlightAttendantPDF(portfolio, template);
  } else if (template.id === "legal-assistant") {
    return generateLegalAssistantPDF(portfolio, template);
  } else {
    return generateOfficeManagerPDF(portfolio, template);
  }
}

async function getPdfImageData(imagePath) {
  try {
    const response = await fetch(imagePath);
    if (!response.ok) throw new Error("Image could not be loaded");
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("PDF profile image could not be embedded.", error);
    return null;
  }
}

async function generateFlightAttendantPDF(portfolio, template) {
  const content = portfolio.content || {};
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Flight attendant template colors
  // Matches .format-flight in css/style.css.
  const sidebarColor = [52, 126, 172]; // #347eac
  const sectionColor = [220, 238, 248]; // #dceef8
  const textWhite = [255, 255, 255];
  const textDark = [30, 41, 59];

  const sidebarWidth = pageWidth * 0.37;
  const mainContentX = sidebarWidth + 10;
  const mainContentWidth = pageWidth - mainContentX - 10;

  // Draw sidebar
  doc.setFillColor(...sidebarColor);
  doc.rect(0, 0, sidebarWidth, pageHeight, "F");

  let sidebarY = 15;
  let mainY = 15;

  // SIDEBAR - Flight Attendant Style
  doc.setTextColor(...textWhite);

  // The published template begins with a circular portrait.
  const name = content.name || template.name;
  const imageData = await getPdfImageData(template.image);
  if (imageData) {
    doc.addImage(imageData, "JPEG", 14, sidebarY, 32, 32);
  } else {
    doc.setFillColor(255, 255, 255);
    doc.circle(30, sidebarY + 16, 16, "F");
    doc.setTextColor(...sidebarColor);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(name.split(" ").map((part) => part[0]).join(""), 30, sidebarY + 18, { align: "center" });
    doc.setTextColor(...textWhite);
  }
  sidebarY += 42;

  // Name
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(name.toUpperCase(), 10, sidebarY);
  sidebarY += 10;

  // Role
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const role = content.role || template.role;
  doc.text(role, 10, sidebarY);
  sidebarY += 15;

  // Contact with icons
  doc.setFontSize(9);
  const contactItems = [
    { icon: "in", value: content.linkedin || "linkedin.com/in/name" },
    { icon: "git", value: content.github || "github.com/username" },
    { icon: "mail", value: content.email || "hello@reallygreatsite.com" },
    { icon: "tel", value: content.phone || "+123-456-7890" },
    { icon: "web", value: content.website || "reallygreatsite.com" },
  ];

  contactItems.forEach((item) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${item.icon} `, 10, sidebarY);
    doc.setFont("helvetica", "normal");
    const contactLines = doc.splitTextToSize(item.value, sidebarWidth - 20);
    doc.text(contactLines, 18, sidebarY);
    sidebarY += contactLines.length * 4 + 6;
  });

  sidebarY += 10;

  // Skills
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Relevant skills", 10, sidebarY);
  sidebarY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const skills = content.skills ? content.skills.split(",").map((s) => s.trim()) : template.skills;
  skills.forEach((skill) => {
    if (sidebarY > pageHeight - 15) {
      doc.addPage();
      doc.setFillColor(...sidebarColor);
      doc.rect(0, 0, sidebarWidth, pageHeight, "F");
      sidebarY = 15;
      mainY = 15;
    }
    const skillLines = doc.splitTextToSize(`• ${skill}`, sidebarWidth - 15);
    doc.text(skillLines, 10, sidebarY);
    sidebarY += skillLines.length * 3 + 3;
  });

  sidebarY += 8;

  // Languages
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Languages", 10, sidebarY);
  sidebarY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const languages = content.languages ? content.languages.split(",").map((l) => l.trim()) : ["English - Native"];
  languages.forEach((lang) => {
    if (sidebarY > pageHeight - 15) {
      doc.addPage();
      doc.setFillColor(...sidebarColor);
      doc.rect(0, 0, sidebarWidth, pageHeight, "F");
      sidebarY = 15;
      mainY = 15;
    }
    const langLines = doc.splitTextToSize(`• ${lang}`, sidebarWidth - 15);
    doc.text(langLines, 10, sidebarY);
    sidebarY += langLines.length * 3 + 3;
  });

  // MAIN CONTENT - Flight Attendant Style
  doc.setTextColor(...textDark);

  // Work Experience: the same pale-blue title band used by the web template.
  doc.setFillColor(...sectionColor);
  doc.rect(mainContentX - 3, mainY - 5, mainContentWidth + 3, 8, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Work experience", mainContentX, mainY);
  mainY += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`✈ ${role}`, mainContentX, mainY);
  mainY += 10;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const experiences = content.experience ? content.experience.split("\n").map((exp) => {
    const parts = exp.split("|").map((part) => part.trim());
    return parts.slice(0, 4);
  }) : [];

  experiences.forEach((exp) => {
    if (mainY > pageHeight - 25) {
      doc.addPage();
      doc.setFillColor(...sidebarColor);
      doc.rect(0, 0, sidebarWidth, pageHeight, "F");
      mainY = 15;
    }
    const expText = exp.join(" - ");
    const expLines = doc.splitTextToSize(expText, mainContentWidth);
    doc.text(expLines, mainContentX, mainY);
    mainY += expLines.length * 4 + 6;
  });

  mainY += 10;

  // Education
  doc.setFillColor(...sectionColor);
  doc.rect(mainContentX - 3, mainY - 5, mainContentWidth + 3, 8, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Education history", mainContentX, mainY);
  mainY += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const educations = content.education ? content.education.split("\n").map((edu) => {
    const parts = edu.split("|").map((part) => part.trim());
    return parts.slice(0, 3);
  }) : [];

  educations.forEach((edu) => {
    if (mainY > pageHeight - 25) {
      doc.addPage();
      doc.setFillColor(...sidebarColor);
      doc.rect(0, 0, sidebarWidth, pageHeight, "F");
      mainY = 15;
    }
    const eduText = edu.join(" - ");
    const eduLines = doc.splitTextToSize(eduText, mainContentWidth);
    doc.text(eduLines, mainContentX, mainY);
    mainY += eduLines.length * 4 + 6;
  });

  mainY += 10;

  // Certifications
  doc.setFillColor(...sectionColor);
  doc.rect(mainContentX - 3, mainY - 5, mainContentWidth + 3, 8, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Certifications", mainContentX, mainY);
  mainY += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const certifications = content.certifications ? content.certifications.split("\n").map((cert) => {
    const parts = cert.split("|").map((part) => part.trim());
    return parts.slice(0, 3);
  }) : [];

  certifications.forEach((cert) => {
    if (mainY > pageHeight - 25) {
      doc.addPage();
      doc.setFillColor(...sidebarColor);
      doc.rect(0, 0, sidebarWidth, pageHeight, "F");
      mainY = 15;
    }
    const certText = cert.join(" - ");
    const certLines = doc.splitTextToSize(certText, mainContentWidth);
    doc.text(certLines, mainContentX, mainY);
    mainY += certLines.length * 4 + 6;
  });

  return doc;
}

function generateLegalAssistantPDF(portfolio, template) {
  const content = portfolio.content || {};
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Matches .format-legal in css/style.css: white header and dark teal ribbon.
  const ribbonColor = [61, 105, 114]; // #3d6972
  const headingColor = [82, 112, 121]; // #527079
  const textColor = [30, 41, 59];
  const accentColor = [20, 184, 166]; // Darker teal

  let currentY = 15;

  // HEADER - Legal Assistant Style
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setDrawColor(213, 218, 221);
  doc.line(0, 30, pageWidth, 30);
  doc.setFillColor(...ribbonColor);
  doc.rect(0, 0, 22, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");

  // Initials in circle/ribbon
  const name = content.name || template.name;
  const initials = name.split(" ").map((n) => n[0]).join("");
  
  // Initials live directly in the rectangular ribbon on the web CV.
  doc.setFontSize(14);
  doc.text(initials, 11, 17, { align: "center" });
  
  // Name next to circle
  doc.setTextColor(...textColor);
  doc.setFontSize(20);
  doc.text(name.toUpperCase(), 30, 17);

  currentY = 40;

  // Two-column layout for body
  // Keep the PDF's column split aligned with .format-legal (35% / 65%).
  const leftColX = 15;
  const dividerX = pageWidth * 0.35;
  const leftColWidth = dividerX - leftColX - 8;
  const rightColX = dividerX + 15;
  const rightColWidth = pageWidth - rightColX - 15;
  const startLegalContinuationPage = () => {
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setDrawColor(213, 218, 221);
    doc.line(0, 30, pageWidth, 30);
    doc.setFillColor(...ribbonColor);
    doc.rect(0, 0, 22, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(initials, 11, 17, { align: "center" });
    doc.setTextColor(...textColor);
    doc.setFontSize(20);
    doc.text(name.toUpperCase(), 30, 17);
    doc.line(dividerX, 35, dividerX, pageHeight);
    return 40;
  };

  let leftY = currentY;
  let rightY = currentY;

  doc.setTextColor(...textColor);
  doc.setDrawColor(213, 218, 221);
  doc.line(dividerX, currentY - 5, dividerX, pageHeight);

  // LEFT COLUMN
  // Contact
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...headingColor);
  doc.text("Contact", 15, leftY);
  leftY += 7;

  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");
  
  const writeLeftValue = (value) => {
    const lines = doc.splitTextToSize(value, leftColWidth);
    doc.text(lines, leftColX, leftY);
    leftY += lines.length * 4 + 2;
  };

  // All values are wrapped to the left column, preventing divider overlap.
  writeLeftValue(`& ${content.phone || "+123-456-7890"}`);
  writeLeftValue(content.email || "hello@reallygreatsite.com");
  writeLeftValue(`# ${content.location || template.industry}`);
  const githubValue = content.github || "github.com/username";
  writeLeftValue(`git ${githubValue}`);
  leftY += 5;

  // Skills
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...headingColor);
  doc.text("Skills", 15, leftY);
  leftY += 7;

  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");
  const skills = content.skills ? content.skills.split(",").map((s) => s.trim()) : template.skills;
  skills.forEach((skill) => {
    if (leftY > pageHeight - 15) {
      doc.addPage();
      leftY = 15;
      rightY = 15;
    }
    doc.text(`• ${skill}`, 15, leftY);
    leftY += 4;
  });

  leftY += 10;

  // Education (left column for legal assistant)
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...headingColor);
  doc.text("Education", 15, leftY);
  leftY += 7;

  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");
  const educations = content.education ? content.education.split("\n").map((edu) => {
    const parts = edu.split("|").map((part) => part.trim());
    return parts.slice(0, 3);
  }) : [];

  educations.forEach((edu) => {
    if (leftY > pageHeight - 15) {
      doc.addPage();
      leftY = 15;
      rightY = 15;
    }
    const eduText = edu.join(" | ");
    const eduLines = doc.splitTextToSize(eduText, leftColWidth);
    doc.text(eduLines, leftColX, leftY);
    leftY += eduLines.length * 4 + 4;
  });

  // RIGHT COLUMN
  // Professional Summary
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...headingColor);
  doc.text("Professional summary", rightColX, rightY);
  rightY += 7;

  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");
  const headline = content.headline || template.headline;
  const headlineLines = doc.splitTextToSize(headline, rightColWidth);
  doc.text(headlineLines, rightColX, rightY);
  rightY += headlineLines.length * 4 + 12;

  // Work History
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...headingColor);
  doc.text("Work history", rightColX, rightY);
  rightY += 7;

  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");
  const experiences = content.experience ? content.experience.split("\n").map((exp) => {
    const parts = exp.split("|").map((part) => part.trim());
    return parts.slice(0, 4);
  }) : [];

  experiences.forEach((exp) => {
    // Format: Project Name | GitHub project | Year | Description
    const expText = exp.join(" | ");
    const expLines = doc.splitTextToSize(expText, rightColWidth);
    if (rightY + expLines.length * 4 + 6 > pageHeight - 15) {
      rightY = startLegalContinuationPage();
    }
    doc.text(expLines, rightColX, rightY);
    rightY += expLines.length * 4 + 6;
  });

  rightY += 10;

  // Certifications
  if (rightY > pageHeight - 30) {
    rightY = startLegalContinuationPage();
  }
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...headingColor);
  doc.text("Certifications", rightColX, rightY);
  rightY += 7;

  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");
  const certifications = content.certifications ? content.certifications.split("\n").map((cert) => {
    const parts = cert.split("|").map((part) => part.trim());
    return parts.slice(0, 3);
  }) : [];

  certifications.forEach((cert) => {
    const certText = cert.join(" | ");
    const certLines = doc.splitTextToSize(certText, rightColWidth);
    if (rightY + certLines.length * 4 + 6 > pageHeight - 15) {
      rightY = startLegalContinuationPage();
    }
    doc.text(certLines, rightColX, rightY);
    rightY += certLines.length * 4 + 6;
  });

  return doc;
}

function generateOfficeManagerPDF(portfolio, template) {
  const content = portfolio.content || {};
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Matches .format-office in css/style.css.
  const sidebarColor = [6, 99, 125]; // #06637d
  const mainBgColor = [255, 255, 255];
  const accentColor = [7, 83, 106]; // #07536a
  const textWhite = [255, 255, 255];
  const textDark = [44, 62, 80];

  const sidebarWidth = pageWidth * 0.31;
  const mainContentX = sidebarWidth + 10;
  const mainContentWidth = pageWidth - mainContentX - 10;

  // Draw sidebar background
  doc.setFillColor(...sidebarColor);
  doc.rect(0, 0, sidebarWidth, pageHeight, "F");

  // Draw main content background
  doc.setFillColor(...mainBgColor);
  doc.rect(sidebarWidth, 0, pageWidth - sidebarWidth, pageHeight, "F");

  let sidebarY = 20;
  let mainY = 20;

  // SIDEBAR CONTENT
  doc.setTextColor(...textWhite);

  // Name in sidebar
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const name = content.name || template.name;
  const nameLines = doc.splitTextToSize(name, sidebarWidth - 15);
  doc.text(nameLines, 10, sidebarY);
  sidebarY += nameLines.length * 8 + 10;

  // Role in sidebar
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const role = content.role || template.role;
  const roleLines = doc.splitTextToSize(role, sidebarWidth - 15);
  doc.text(roleLines, 10, sidebarY);
  sidebarY += roleLines.length * 6 + 15;

  // Personal Info
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Personal Info", 10, sidebarY);
  sidebarY += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const personalInfo = [
    { label: "Email", value: content.email || "hello@reallygreatsite.com" },
    { label: "Phone", value: content.phone || "+123-456-7890" },
    { label: "LinkedIn", value: content.linkedin || "linkedin.com/in/name" },
    { label: "GitHub", value: content.github || "github.com/username" },
    { label: "Website", value: content.website || "reallygreatsite.com" },
  ];

  personalInfo.forEach((info) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${info.label}`, 10, sidebarY);
    doc.setFont("helvetica", "normal");
    const valueLines = doc.splitTextToSize(info.value, sidebarWidth - 20);
    doc.text(valueLines, 10, sidebarY + 4);
    sidebarY += valueLines.length * 4 + 8;
  });

  sidebarY += 10;

  // Key Skills
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Key Skills", 10, sidebarY);
  sidebarY += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const skills = content.skills ? content.skills.split(",").map((s) => s.trim()) : template.skills;
  skills.forEach((skill) => {
    if (sidebarY > pageHeight - 20) {
      doc.addPage();
      doc.setFillColor(...sidebarColor);
      doc.rect(0, 0, sidebarWidth, pageHeight, "F");
      sidebarY = 20;
    }
    const skillLines = doc.splitTextToSize(`• ${skill}`, sidebarWidth - 15);
    doc.text(skillLines, 10, sidebarY);
    sidebarY += skillLines.length * 4 + 4;
  });

  sidebarY += 10;

  // Languages
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Languages", 10, sidebarY);
  sidebarY += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const languages = content.languages ? content.languages.split(",").map((l) => l.trim()) : ["English - Native"];
  languages.forEach((lang) => {
    if (sidebarY > pageHeight - 20) {
      doc.addPage();
      doc.setFillColor(...sidebarColor);
      doc.rect(0, 0, sidebarWidth, pageHeight, "F");
      sidebarY = 20;
    }
    const langLines = doc.splitTextToSize(`• ${lang}`, sidebarWidth - 15);
    doc.text(langLines, 10, sidebarY);
    sidebarY += langLines.length * 4 + 4;
  });

  // MAIN CONTENT AREA
  doc.setTextColor(...textDark);

  // Headline/Intro
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  const headline = content.headline || template.headline;
  const headlineLines = doc.splitTextToSize(headline, mainContentWidth);
  doc.text(headlineLines, mainContentX, mainY);
  mainY += headlineLines.length * 5 + 12;

  // Work History
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Work history", mainContentX, mainY);
  mainY += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const experiences = content.experience ? content.experience.split("\n").map((exp) => {
    const parts = exp.split("|").map((part) => part.trim());
    return {
      role: parts[0] || "",
      company: parts[1] || "",
      dates: parts[2] || "",
      description: parts[3] || ""
    };
  }) : [];

  experiences.forEach((exp) => {
    if (mainY > pageHeight - 30) {
      doc.addPage();
      doc.setFillColor(...sidebarColor);
      doc.rect(0, 0, sidebarWidth, pageHeight, "F");
      mainY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(exp.role, mainContentX, mainY);
    mainY += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...accentColor);
    doc.text(`${exp.company} | ${exp.dates}`, mainContentX, mainY);
    mainY += 6;

    doc.setTextColor(...textDark);
    doc.setFontSize(9);
    const descLines = doc.splitTextToSize(exp.description, mainContentWidth);
    doc.text(descLines, mainContentX, mainY);
    mainY += descLines.length * 4 + 10;
  });

  mainY += 10;

  // Education
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textDark);
  doc.text("Education", mainContentX, mainY);
  mainY += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const educations = content.education ? content.education.split("\n").map((edu) => {
    const parts = edu.split("|").map((part) => part.trim());
    return {
      qualification: parts[0] || "",
      institution: parts[1] || "",
      year: parts[2] || ""
    };
  }) : [];

  educations.forEach((edu) => {
    if (mainY > pageHeight - 25) {
      doc.addPage();
      doc.setFillColor(...sidebarColor);
      doc.rect(0, 0, sidebarWidth, pageHeight, "F");
      mainY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(edu.qualification, mainContentX, mainY);
    mainY += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...accentColor);
    doc.text(`${edu.institution} | ${edu.year}`, mainContentX, mainY);
    mainY += 10;
  });

  mainY += 10;

  // Certifications
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textDark);
  doc.text("Certifications", mainContentX, mainY);
  mainY += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const certifications = content.certifications ? content.certifications.split("\n").map((cert) => {
    const parts = cert.split("|").map((part) => part.trim());
    return {
      certification: parts[0] || "",
      organization: parts[1] || "",
      year: parts[2] || ""
    };
  }) : [];

  certifications.forEach((cert) => {
    if (mainY > pageHeight - 30) {
      doc.addPage();
      doc.setFillColor(...sidebarColor);
      doc.rect(0, 0, sidebarWidth, pageHeight, "F");
      doc.setFillColor(...mainBgColor);
      doc.rect(sidebarWidth, 0, pageWidth - sidebarWidth, pageHeight, "F");
      mainY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(cert.certification, mainContentX, mainY);
    mainY += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...accentColor);
    doc.text(`${cert.organization} | ${cert.year}`, mainContentX, mainY);
    mainY += 10;
  });

  return doc;
}

async function downloadPDF(portfolio) {
  try {
    if (!window.jspdf) {
      showToast("PDF library not loaded. Please refresh the page.", "❌");
      return;
    }

    const doc = await generatePDFFromPortfolio(portfolio);
    const content = portfolio.content || {};
    const title = content.name ? `${content.name} portfolio` : portfolio.title;
    const filename = `${title.replace(/[^a-z0-9]/gi, "_")}_export.pdf`;

    doc.save(filename);
    showToast("PDF downloaded successfully!", "📄");
  } catch (error) {
    console.error("PDF download error:", error);
    showToast("Failed to download PDF", "❌");
  }
}

 

function initChartHook() {
  const ctx = document.getElementById("skillsChart");
  if (!ctx || typeof Chart === "undefined") return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Performance",
        "Accessibility",
        "API Engineering",
        "Architecture",
        "AI Integration",
      ],
      datasets: [
        {
          label: "Platform Score",
          data: [98, 95, 90, 92, 88],
          backgroundColor: "#38bdf8",
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: "rgba(255, 255, 255, 0.05)" },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
}
document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    loadPartial("partials/header.html"),
    loadPartial("partials/footer.html"),
  ])
    .then(([header, footer]) => {
      document.getElementById("site-header").innerHTML = header;
      document.getElementById("site-footer").innerHTML = footer;
      initThemeSwitcher();
      initMobileNavigation();
      initFooterMetadata();
      initAuthSession();
      initContactResultDialog();

      window.addEventListener("hashchange", handleRouting);
      handleRouting();
    })
    .catch((error) => {
      console.error("Unable to load the site layout.", error);
    });
});
