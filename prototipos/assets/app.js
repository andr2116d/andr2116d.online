(() => {
  "use strict";
  const { translations, projects, elements } = window.PORTFOLIO;
  const root = document.documentElement;
  let lang = root.lang === "en" ? "en" : "es";
  let filter = "all";
  let selectedElement = 0;
  let activeProject = null;
  let lastProjectTrigger = null;
  let toastTimer;
  const dialog = document.querySelector("#project-dialog");
  const t = (key) => translations[lang][key] || key;
  const escape = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const external = 'target="_blank" rel="noopener noreferrer"';
  function save(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {}
  }
  const icon = (paths, attrs = "") =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" ${attrs}>${paths}</svg>`;
  const chainIcon = icon(
    '<path d="m9 15 6-6M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 10a4 4 0 0 0 6 0l4-4a4 4 0 0 0-6-6l-1 1"/>',
  );
  const cloudIcon = icon(
    '<path d="M6 17a5 5 0 0 1-1-10 7 7 0 0 1 13 2 4 4 0 0 1 0 8Z"/>',
  );
  const boxIcon = icon(
    '<path d="m12 3 9 5v9l-9 5-9-5V8Zm0 10v9M3 8l9 5 9-5M7.5 5.5l9 5"/>',
  );
  const lambdaIcon = icon('<path d="M6 3h5l8 18M4 21l7-14M16 21h5"/>');

  function visual(project) {
    const p = project[lang];
    let content = "";
    if (project.visual === "deconsta")
      content = `<div class="deconsta-sheet"><div class="sheet-brand"><span class="deconsta-logo">d</span>deconsta</div><div class="sheet-title">${t("preview.payments")}</div><div class="sheet-item"><b class="sheet-check">✓</b><span>${t("preview.document")}</span></div><div class="sheet-item"><b class="sheet-check">↗</b><span>${t("preview.voucher")}</span><span class="sheet-status">${t("preview.review")}</span></div></div>`;
    if (project.visual === "quikko")
      content = `<div class="quikko-orbit"></div><div class="quikko-display"><div class="quikko-name">quikko<span>↗</span></div><div class="quikko-url">${chainIcon}<span>quikko.link / ideas</span><b>↗</b></div></div>`;
    if (project.visual === "unitru")
      content = `<div class="unitru-window"><div class="unitru-logo">${icon('<path d="m2 9 10-5 10 5-10 5Zm4 3v6c4 3 8 3 12 0v-6M22 9v7"/>')} UNITRU Academic</div><div class="unitru-subtitle">${t("preview.schedule")}</div><div class="schedule-art"><span></span><span></span><span></span><span></span><span></span></div></div>`;
    if (project.visual === "gemelo") {
      let contours = "";
      for (let i = 0; i < 11; i++) {
        const x = 40 + i * 13,
          y = 110 + i * 3;
        contours += `<path class="contour" d="M${x} 285 C${x - 80} 200 ${x + 150} ${y - 80} ${x + 190} ${y} S${x + 240} 250 ${x + 130} 285 S${x + 30} 180 ${x} 285Z"/>`;
      }
      content = `<svg class="gemelo-art" viewBox="0 0 550 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${contours}<g class="connections"><path d="m125 218 55-58 70 30 70-70 50 50-18 68-102-48-42 70-83-42 125-28M180 160l28 100 144-22M320 120l32 118M125 218l195-98"/></g><g><circle cx="125" cy="218" r="5"/><circle cx="180" cy="160" r="7"/><circle cx="250" cy="190" r="9"/><circle cx="320" cy="120" r="6"/><circle cx="370" cy="170" r="5"/><circle cx="352" cy="238" r="7"/><circle cx="208" cy="260" r="5"/></g></svg><div class="gemelo-caption">${t("preview.districts").split("\n").map(escape).join("<br>")}</div>`;
    }
    if (project.visual === "cloud")
      content = `<div class="cloud-flow"><div class="cloud-node">${cloudIcon}<span>API</span></div><span class="cloud-connector">→</span><div class="cloud-node">${boxIcon}<span>S3</span></div><span class="cloud-connector">→</span><div class="cloud-node">${lambdaIcon}<span>Lambda</span></div></div>`;
    if (project.visual === "previa")
      content =
        '<div class="pitch"></div><div class="pitch-label">la previa<span> ↗</span></div>';
    return `<span class="preview-category">${escape(p.type.split(" · ")[0])}</span>${content}<span class="preview-foot"><span>${t("preview." + project.visual)}</span></span><span class="open-project" aria-hidden="true">↗</span>`;
  }

  function renderProjects() {
    const grid = document.querySelector("#projects-grid");
    if (!grid) return;
    const visible = projects.filter(
      (project) => filter === "all" || project.category.includes(filter),
    );
    grid.classList.toggle("is-filtered", filter !== "all");
    grid.innerHTML = visible
      .map(
        (project) =>
          `<article class="project-card"><button class="project-preview visual-${project.visual}" type="button" data-project="${project.id}" aria-label="${t("case.open")} ${escape(project.name)}"><span aria-hidden="true">${visual(project)}</span></button><div class="project-info"><div class="project-title-row"><h3><button type="button" data-project="${project.id}" aria-label="${t("case.open")} ${escape(project.name)}">${escape(project.name)}</button></h3><span class="project-year">2026</span></div><p>${escape(project[lang].description)}</p><div class="project-tags">${project.tags.map((tag) => `<span>${escape(tag)}</span>`).join("")}</div></div></article>`,
      )
      .join("");
    document.querySelector("#project-count").textContent =
      `${visible.length} ${t(visible.length === 1 ? "projects.single" : "projects.count")}`;
  }

  function renderStack() {
    const table = document.querySelector("#periodic-table");
    if (!table) return;
    table.innerHTML = elements
      .map(
        (element, index) =>
          `<button class="element" type="button" data-element="${index}" data-group="${element.group}" aria-pressed="${selectedElement === index}" aria-label="${escape(element.name)}"><small aria-hidden="true">${String(index + 1).padStart(2, "0")}</small><b aria-hidden="true">${element.symbol}</b><span>${element.display || element.name}</span></button>`,
      )
      .join("");
    renderElement();
  }
  function renderElement() {
    const detail = document.querySelector("#element-detail");
    if (!detail) return;
    const element = elements[selectedElement];
    detail.innerHTML = `<span aria-hidden="true">↳</span><div><h3>${element.name}</h3><p>${escape(element[lang])}</p></div>`;
    document
      .querySelectorAll("[data-element]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(Number(button.dataset.element) === selectedElement),
        ),
      );
  }

  function renderCase(project) {
    const p = project[lang];
    document.querySelector("#dialog-content").innerHTML =
      `<div class="case-header"><p class="section-kicker">${escape(p.type)}</p><h2 id="dialog-title">${escape(project.name)}</h2><p>${escape(p.description)}</p></div><div class="case-visual visual-${project.visual}" aria-hidden="true">${visual(project)}</div><div class="case-body"><p class="case-note">${t("case.note")}</p><div class="case-columns"><div><h3>${t("case.context")}</h3><p>${escape(p.context)}</p></div><div><h3>${t("case.solution")}</h3><ul>${p.solution.map((item) => `<li>${escape(item)}</li>`).join("")}</ul></div></div><div class="case-pipeline" aria-label="${lang === "es" ? "Arquitectura" : "Architecture"}">${p.pipeline.map((item) => `<span>${escape(item)}</span>`).join('<span aria-hidden="true">→</span>')}</div>${p.team ? `<p class="case-team">${escape(p.team)}</p>` : ""}<div class="case-stack"><h3>${t("case.stack")}</h3><p>${project.stack.map(escape).join(" · ")}</p></div><div class="case-actions">${project.demo ? `<a class="button primary" href="${project.demo}" ${external}>${t("case.demo")} <span aria-hidden="true">↗</span></a>` : ""}<a class="button ${project.demo ? "secondary" : "primary"}" href="${project.repo}" ${external}>${t("case.source")} <span aria-hidden="true">↗</span></a></div><p class="case-footer">${t("case.evidence")} <a href="${project.repo}" ${external}>GitHub ↗</a></p></div>`;
  }
  function openProject(id, trigger) {
    const project = projects.find((item) => item.id === id);
    if (!project || !dialog) return;
    activeProject = project;
    lastProjectTrigger = trigger;
    renderCase(project);
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add("modal-open");
    dialog.querySelector(".dialog-close").focus();
  }
  function closeProject() {
    if (dialog?.open) dialog.close();
  }
  dialog?.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    activeProject = null;
    lastProjectTrigger?.focus();
  });
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        closeProject();
    }
  });
  document
    .querySelector(".dialog-close")
    ?.addEventListener("click", closeProject);

  function renderCV() {
    const container = document.querySelector("#cv-projects");
    if (!container) return;
    container.innerHTML = projects
      .filter((p) => p.id !== "previa")
      .map(
        (project) =>
          `<article class="cv-project"><h3><a href="${project.repo}" ${external}>${escape(project.name)} <span aria-hidden="true">↗</span></a></h3><p>${escape(project[lang].summary)}</p><p class="cv-tech">${project.tags.map(escape).join(" · ")}</p></article>`,
      )
      .join("");
  }
  function updateThemeLabel() {
    const button = document.querySelector(".theme-toggle");
    const light = root.dataset.theme === "light";
    button?.setAttribute("aria-label", t(light ? "theme.dark" : "theme.light"));
    button?.setAttribute("title", t(light ? "theme.dark" : "theme.light"));
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", light ? "#f7f6f9" : "#17171a");
  }
  function setLanguage(next, persist = true) {
    lang = next;
    root.lang = lang;
    if (persist) {
      save("av-language", lang);
      const currentURL = new URL(location.href);
      if (currentURL.searchParams.has("lang")) {
        currentURL.searchParams.set("lang", lang);
        history.replaceState(null, "", currentURL);
      }
    }
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAria));
    });
    document
      .querySelectorAll("[data-lang]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.lang === lang),
        ),
      );
    document.querySelectorAll("[data-cv-link]").forEach((link) => {
      link.href = `cv.html?lang=${lang}`;
    });
    document.querySelectorAll("[data-home-link]").forEach((link) => {
      link.href = `index.html?lang=${lang}`;
    });
    const isCV = document.body.classList.contains("cv-page");
    document.title = t(isCV ? "cv.title" : "page.title");
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t("page.description"));
    document
      .querySelector(".wordmark")
      ?.setAttribute(
        "aria-label",
        lang === "es" ? "Andreé, inicio" : "Andreé, home",
      );
    document
      .querySelector("#mobile-nav")
      ?.setAttribute(
        "aria-label",
        lang === "es" ? "Navegación móvil" : "Mobile navigation",
      );
    document
      .querySelector(".dialog-close")
      ?.setAttribute("aria-label", t("case.close"));
    document
      .querySelector(".menu-toggle")
      ?.setAttribute(
        "aria-label",
        t(
          document.querySelector("#mobile-nav")?.hidden
            ? "menu.open"
            : "menu.close",
        ),
      );
    updateThemeLabel();
    renderProjects();
    renderStack();
    renderCV();
    if (activeProject) renderCase(activeProject);
    updateClock();
    document.dispatchEvent(
      new CustomEvent("portfolio:language", {
        detail: { lang, translations: translations[lang] },
      }),
    );
  }
  function updateClock() {
    const clock = document.querySelector("#local-time");
    if (clock)
      clock.textContent = new Intl.DateTimeFormat(
        lang === "es" ? "es-PE" : "en-GB",
        {
          timeZone: "America/Lima",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
      ).format(new Date());
  }
  function toast(message) {
    const node = document.querySelector("#toast");
    if (!node) return;
    clearTimeout(toastTimer);
    node.textContent = message;
    node.classList.add("visible");
    toastTimer = setTimeout(() => node.classList.remove("visible"), 4000);
  }
  async function copyProfile() {
    const url = "https://github.com/andr2116d";
    let copied = false;
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch (_) {
      const field = document.createElement("textarea");
      field.value = url;
      field.style.cssText = "position:fixed;left:-10000px;top:0";
      document.body.append(field);
      field.select();
      try {
        copied = document.execCommand("copy");
      } catch (_) {}
      field.remove();
      document.querySelector(".copy-profile")?.focus();
    }
    toast(t(copied ? "copy.success" : "copy.error"));
  }
  function closeMenu() {
    const menu = document.querySelector("#mobile-nav");
    const toggle = document.querySelector(".menu-toggle");
    if (!menu || !toggle) return;
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", t("menu.open"));
  }
  document.addEventListener("click", (event) => {
    const languageButton = event.target.closest("[data-lang]");
    if (languageButton) setLanguage(languageButton.dataset.lang);
    const projectButton = event.target.closest("[data-project]");
    if (projectButton)
      openProject(projectButton.dataset.project, projectButton);
    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) {
      filter = filterButton.dataset.filter;
      document
        .querySelectorAll("[data-filter]")
        .forEach((button) =>
          button.setAttribute("aria-pressed", String(button === filterButton)),
        );
      renderProjects();
    }
    const elementButton = event.target.closest("[data-element]");
    if (elementButton) {
      selectedElement = Number(elementButton.dataset.element);
      renderElement();
    }
    if (event.target.closest("#mobile-nav a")) closeMenu();
    if (!event.target.closest("#mobile-nav, .menu-toggle")) closeMenu();
  });
  document.querySelector(".theme-toggle")?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    save("av-theme", root.dataset.theme);
    updateThemeLabel();
    document.dispatchEvent(new Event("portfolio:theme"));
  });
  document.querySelector(".menu-toggle")?.addEventListener("click", () => {
    const menu = document.querySelector("#mobile-nav");
    const toggle = document.querySelector(".menu-toggle");
    menu.hidden = !menu.hidden;
    toggle.setAttribute("aria-expanded", String(!menu.hidden));
    toggle.setAttribute(
      "aria-label",
      t(menu.hidden ? "menu.open" : "menu.close"),
    );
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const wasOpen = document.querySelector("#mobile-nav")?.hidden === false;
      closeMenu();
      if (wasOpen) document.querySelector(".menu-toggle").focus();
    }
  });
  matchMedia("(min-width: 641px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
  document
    .querySelector(".copy-profile")
    ?.addEventListener("click", copyProfile);
  document
    .querySelector("#print-cv")
    ?.addEventListener("click", () => window.print());
  window.addEventListener("storage", (event) => {
    if (event.key === "av-language" && ["es", "en"].includes(event.newValue))
      setLanguage(event.newValue, false);
    if (
      event.key === "av-theme" &&
      ["light", "dark"].includes(event.newValue)
    ) {
      root.dataset.theme = event.newValue;
      updateThemeLabel();
      document.dispatchEvent(new Event("portfolio:theme"));
    }
  });
  setLanguage(lang, false);
  setInterval(updateClock, 60000);
})();
