// KSP Mission Manual — shared site chrome (sidebar nav + mission clock)

const SITE_NAV = [
  {
    group: "Foundations",
    items: [
      { id: "getting-started", label: "Getting Started", href: "pages/getting-started.html", ico: "01" },
      { id: "building-rockets", label: "Building Rockets", href: "pages/building-rockets.html", ico: "02" },
      { id: "aerodynamics-flight", label: "Aerodynamics & Flight", href: "pages/aerodynamics-flight.html", ico: "03" },
      { id: "vab-advanced-techniques", label: "VAB Advanced Techniques", href: "pages/vab-advanced-techniques.html", ico: "04" },
      { id: "orbital-mechanics", label: "Orbital Mechanics", href: "pages/orbital-mechanics.html", ico: "05" },
    ],
  },
  {
    group: "Crewed Operations",
    items: [
      { id: "docking-rendezvous", label: "Rendezvous & Docking", href: "pages/docking-rendezvous.html", ico: "06" },
      { id: "space-stations", label: "Space Stations", href: "pages/space-stations.html", ico: "07" },
      { id: "rovers-surface-ops", label: "Rovers & Surface Ops", href: "pages/rovers-surface-ops.html", ico: "08" },
    ],
  },
  {
    group: "Uncrewed & Science",
    items: [
      { id: "satellites", label: "Satellites & Probes", href: "pages/satellites.html", ico: "09" },
      { id: "science-research", label: "Science & Research", href: "pages/science-research.html", ico: "10" },
    ],
  },
  {
    group: "Going Further",
    items: [
      { id: "interplanetary-travel", label: "Interplanetary Travel", href: "pages/interplanetary-travel.html", ico: "11" },
      { id: "advanced-maneuvers", label: "Advanced Maneuvers", href: "pages/advanced-maneuvers.html", ico: "12" },
      { id: "landing-return", label: "Landing & Return", href: "pages/landing-return.html", ico: "13" },
      { id: "isru-mining", label: "ISRU & Mining", href: "pages/isru-mining.html", ico: "14" },
      { id: "bases-colonies", label: "Bases & Colonies", href: "pages/bases-colonies.html", ico: "15" },
    ],
  },
  {
    group: "Career & Progression",
    items: [
      { id: "career-mode", label: "Career Mode", href: "pages/career-mode.html", ico: "16" },
      { id: "dlc-overview", label: "DLC Overview", href: "pages/dlc-overview.html", ico: "17" },
    ],
  },
  {
    group: "Reference",
    items: [
      { id: "planet-guides", label: "Planet-by-Planet Guide", href: "pages/planet-guides.html", ico: "18" },
      { id: "delta-v-map", label: "Delta-v Map", href: "pages/delta-v-map.html", ico: "19" },
      { id: "challenges", label: "Challenges & Achievements", href: "pages/challenges.html", ico: "20" },
      { id: "keyboard-shortcuts", label: "Keyboard Shortcuts", href: "pages/keyboard-shortcuts.html", ico: "21" },
      { id: "troubleshooting", label: "Troubleshooting", href: "pages/troubleshooting.html", ico: "22" },
      { id: "tips-mods", label: "Tips & Mods", href: "pages/tips-mods.html", ico: "23" },
    ],
  },
];

function siteRoot() {
  const script = document.currentScript || document.querySelector('script[src*="main.js"]');
  const src = script && script.src ? script.src : window.location.href;
  return src.replace(/\/js\/main\.js(\?.*)?$/, "");
}

function buildSidebar(root, currentPage) {
  const groups = SITE_NAV.map((g) => {
    const links = g.items
      .map((item) => {
        const active = item.id === currentPage ? " active" : "";
        return `<a href="${root}/${item.href}" data-page="${item.id}" class="${active.trim()}"><span class="ico">${item.ico}</span>${item.label}</a>`;
      })
      .join("");
    return `<div class="nav-group"><div class="nav-group-title">${g.group}</div>${links}</div>`;
  }).join("");

  return `
    <a class="brand" href="${root}/index.html"><span class="navball-icon"></span><span>KSP Mission Manual</span></a>
    <div class="mission-clock" id="mission-clock"><span class="lbl">Mission Elapsed Time</span>Y1, D001, 00:00:00</div>
    <nav class="side-nav">${groups}</nav>
  `;
}

function startMissionClock() {
  const el = document.getElementById("mission-clock");
  if (!el) return;
  const label = '<span class="lbl">Mission Elapsed Time</span>';
  const start = Date.now();
  const SEC_PER_DAY = 6 * 3600; // Kerbin day
  const DAYS_PER_YEAR = 426; // Kerbin year
  function tick() {
    const elapsed = Math.floor((Date.now() - start) / 1000) * 120; // accelerated for visible effect
    const year = 1 + Math.floor(elapsed / (SEC_PER_DAY * DAYS_PER_YEAR));
    const dayOfYear = 1 + Math.floor((elapsed % (SEC_PER_DAY * DAYS_PER_YEAR)) / SEC_PER_DAY);
    const secOfDay = elapsed % SEC_PER_DAY;
    const h = Math.floor(secOfDay / 3600);
    const m = Math.floor((secOfDay % 3600) / 60);
    const s = secOfDay % 60;
    const pad = (n, w) => String(n).padStart(w, "0");
    el.innerHTML = `${label}Y${year}, D${pad(dayOfYear, 3)}, ${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}`;
  }
  tick();
  setInterval(tick, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  const root = siteRoot();
  const currentPage = document.body.getAttribute("data-page");
  const mount = document.getElementById("sidebar-root");

  if (mount) {
    const aside = document.createElement("aside");
    aside.className = "sidebar";
    aside.id = "site-sidebar";
    aside.innerHTML = buildSidebar(root, currentPage);
    mount.replaceWith(aside);

    const scrim = document.createElement("div");
    scrim.className = "sidebar-scrim";
    scrim.id = "sidebar-scrim";
    aside.after(scrim);

    const toggle = document.createElement("button");
    toggle.className = "sidebar-toggle";
    toggle.id = "sidebar-toggle";
    toggle.setAttribute("aria-label", "Toggle navigation");
    toggle.textContent = "☰";
    document.body.prepend(toggle);

    function closeSidebar() {
      aside.classList.remove("open");
      scrim.classList.remove("open");
    }
    toggle.addEventListener("click", () => {
      aside.classList.toggle("open");
      scrim.classList.toggle("open");
    });
    scrim.addEventListener("click", closeSidebar);
    aside.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeSidebar));

    startMissionClock();
  }
});
