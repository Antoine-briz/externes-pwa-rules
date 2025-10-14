/* externes-pwa-rules — SPA (canvas-only pdf.js)
   Flux :
   - Accueil (couverture) -> Menu (titre + sections) -> Section (liste PDF) -> PDF (canvas)
   - Hash routes : #/ , #/menu , #/section/<slug> , #/pdf/<fichier>
*/

const BASE = "https://antoine-briz.github.io/externes-pwa-rules/"; // URL absolue pour les boutons « Retour »

let currentPage = 1;
let pdfDoc = null;
let lastSectionSlug = null;

/* ---------------------------
   1) Données : sections & PDFs
--------------------------- */
const SECTIONS = {
  generalites: {
    label: "Généralités",
    items: [
      { title: "Critères d’admission en réanimation", file: "admission.pdf" },
      { title: "J’appelle la réanimation", file: "appelerea.pdf" },
      { title: "Les formules usuelles", file: "formules.pdf" },
      { title: "Le monitorage", file: "monitorage.pdf" },
      { title: "Les abords veineux", file: "abordveineux.pdf" },
    ],
  },
  techniques: {
    label: "Techniques en réanimation",
    items: [
      { title: "L’oxygénation", file: "oxygenation.pdf" },
      { title: "La ventilation non invasive", file: "vni.pdf" },
      { title: "L’intubation", file: "intubation.pdf" },
      { title: "La ventilation invasive", file: "ventilation.pdf" },
      { title: "L’extubation", file: "extubation.pdf" },
      { title: "Les drainages thoraciques", file: "drainthoracique.pdf" },
      { title: "Les drainages abdominaux", file: "drainabdo.pdf" },
      { title: "La dialyse", file: "dialyse.pdf" },
    ],
  },
  medicaments: {
    label: "Médicaments en réanimation",
    items: [
      { title: "Les sédations", file: "sedations.pdf" },
      { title: "La curarisation", file: "curarisation.pdf" },
      { title: "Les solutés de perfusion et remplissage", file: "perfusionremplissage.pdf" },
      { title: "Les catécholamines", file: "cathécholamines.pdf" },
      { title: "Les anticoagulants", file: "anticoagulation.pdf" },
      { title: "Les antibiotiques", file: "antibiotiques.pdf" },
      { title: "L’alimentation", file: "alimentation.pdf" },
    ],
  },
  infectio: {
    label: "Infectiologie et bactériologie",
    items: [
      { title: "Sepsis et choc septique", file: "sepsis.pdf" },
      { title: "Les bactéries", file: "bacterie.pdf" },
      { title: "Les antibiotiques", file: "antibiotiques.pdf" },
      { title: "Antibiothérapie probabiliste", file: "antibioprobabiliste.pdf" },
      { title: "Les PAVM", file: "pavm.pdf" },
    ],
  },
  anomalies: {
    label: "Anomalies métaboliques",
    items: [
      { title: "Acidose métabolique", file: "acidosemetabo.pdf" },
      { title: "Insuffisance rénale aiguë", file: "ira.pdf" },
      { title: "Les dysnatrémies", file: "dysnatremies.pdf" },
      { title: "Les dyskaliémies", file: "dyskaliemies.pdf" },
      { title: "La dialyse", file: "dialyse.pdf" },
    ],
  },
  respiratoires: {
    label: "Défaillances respiratoires",
    items: [
      { title: "Les détresses respiratoires aiguës", file: "detresserespi.pdf" },
      { title: "L’hypoxémie", file: "hypoxemie.pdf" },
      { title: "L’oxygénation", file: "oxygenation.pdf" },
      { title: "La ventilation non invasive", file: "vni.pdf" },
      { title: "L’intubation", file: "intubation.pdf" },
      { title: "La ventilation invasive", file: "ventilation.pdf" },
      { title: "L’extubation", file: "extubation.pdf" },
      { title: "Drainage thoracique", file: "drainthoracique.pdf" },
    ],
  },
  neuro: {
    label: "Défaillances neurologiques",
    items: [
      { title: "Le coma", file: "coma.pdf" },
      { title: "L’état de mal épileptique", file: "eme.pdf" },
      { title: "Arrêt cardio-circulatoire", file: "acr.pdf" },
    ],
  },
  hemodynamiques: {
    label: "Défaillances hémodynamiques",
    items: [
      { title: "Choc hémorragique", file: "chochemo.pdf" },
      { title: "Sepsis et choc septique", file: "sepsis.pdf" },
      { title: "Les solutés de perfusion et remplissage", file: "perfusionremplissage.pdf" },
      { title: "Evaluation de la volémie", file: "volémie.pdf" },
      { title: "Les catécholamines", file: "cathécholamines.pdf" },
    ],
  },
};

/* ---------------------------
   2) Utilitaires DOM
--------------------------- */
function qs(sel) { return document.querySelector(sel); }
function clear(el) { if (el) el.innerHTML = ""; }
function makeBtn(label, onClick, extraClasses = []) {
  const b = document.createElement("button");
  b.textContent = label;
  b.classList.add("btn", ...extraClasses);
  b.addEventListener("click", onClick);
  return b;
}

/* ----------------------------------------------------
   3) Accueil : clic sur couverture -> affichage du menu
---------------------------------------------------- */
const coverImg = document.getElementById("cover-img");
if (coverImg) {
  coverImg.addEventListener("click", () => {
    window.location.hash = "#/menu";
  });
}

/* ---------------------------
   4) Rendu des vues
--------------------------- */
function renderHome() {
  const welcome = qs(".welcome-page");
  const menu = qs("#menu");
  if (welcome) welcome.style.display = "flex";
  if (menu) menu.style.display = "none";
  clear(qs("#app"));
}

function renderMenu() {
  const welcome = qs(".welcome-page");
  const menu = qs("#menu");
  if (welcome) welcome.style.display = "none";
  if (menu) menu.style.display = "block";

  const titleImg = document.getElementById("livret-title-menu");
  if (titleImg) {
    titleImg.style.display = "block";
    if (!titleImg.getAttribute("src")) titleImg.setAttribute("src", "img/titre.png");
  }

  const list = document.getElementById("image-list");
  if (!list) return;
  clear(list);

  const sectionsWrap = document.createElement("div");
  sectionsWrap.className = "section-buttons";

  Object.entries(SECTIONS).forEach(([slug, section]) => {
    const sectionBtn = makeBtn(section.label, () => {
      window.location.hash = `#/section/${slug}`;
    }, ["btn-section"]);
    sectionsWrap.appendChild(sectionBtn);
  });
  list.appendChild(sectionsWrap);

  // Bouton « Retour » identique -> URL absolue accueil
  const backWrap = document.createElement("div");
  backWrap.className = "actions-bottom";
  backWrap.appendChild(
    makeBtn("Retour", () => { window.location.href = BASE; }, ["btn-secondary"])
  );
  list.appendChild(backWrap);

  clear(qs("#app"));
}

function renderSection(slug) {
  lastSectionSlug = slug;

  const welcome = qs(".welcome-page");
  const menu = qs("#menu");
  if (welcome) welcome.style.display = "none";
  if (menu) menu.style.display = "block";

  const titleImg = document.getElementById("livret-title-menu");
  if (titleImg) {
    titleImg.style.display = "block";
    if (!titleImg.getAttribute("src")) titleImg.setAttribute("src", "img/titre.png");
  }

  const list = document.getElementById("image-list");
  if (!list) return;
  clear(list);

  const section = SECTIONS[slug];
  if (!section) {
    list.textContent = "Section introuvable.";
    return;
  }

  const h2 = document.createElement("h2");
  h2.className = "section-title";
  h2.textContent = section.label;
  list.appendChild(h2);

  const linksWrap = document.createElement("div");
  linksWrap.className = "pdf-links";

  section.items.forEach(({ title, file }) => {
    const open = () => {
      window.location.hash = `#/pdf/${encodeURIComponent(file)}`;
    };
    linksWrap.appendChild(makeBtn(title, open, ["btn-link-like"]));
  });

  list.appendChild(linksWrap);

  // Bouton « Retour » identique -> URL absolue accueil
  const backWrap = document.createElement("div");
  backWrap.className = "actions-bottom";
  backWrap.appendChild(
    makeBtn("Retour", () => { window.location.href = BASE; }, ["btn-secondary"])
  );
  list.appendChild(backWrap);

  clear(qs("#app"));
}

/* ---------------------------
   5) Affichage PDF — pdf.js (canvas only, scale ≥ 3)
--------------------------- */
export function openPDF(pdfPath) {
  const appContainer = document.getElementById("app");
  if (!appContainer) return;

  // Cacher accueil + menu
  const welcome = qs(".welcome-page");
  const menu = qs("#menu");
  if (welcome) welcome.style.display = "none";
  if (menu) menu.style.display = "none";

  clear(appContainer);

  // Conteneur du viewer (un seul canvas)
  const pdfViewer = document.createElement("div");
  pdfViewer.id = "pdfViewer";
  appContainer.appendChild(pdfViewer);

  // Nav simple (Précédent / Suivant)
  const navContainer = document.createElement("div");
  navContainer.classList.add("pdf-nav");
  const prevButton = makeBtn("Précédent", () => renderPage(currentPage - 1));
  const nextButton = makeBtn("Suivant", () => renderPage(currentPage + 1));
  navContainer.appendChild(prevButton);
  navContainer.appendChild(nextButton);
  appContainer.appendChild(navContainer);

  // Bouton « Retour » identique (URL absolue vers l'accueil)
  const backButton = makeBtn("Retour", () => { window.location.href = BASE; }, ["btn-secondary"]);
  backButton.style.marginTop = "10px";
  appContainer.appendChild(backButton);

  const pdfUrl = "./pdf/" + pdfPath;

  // Chargement via pdf.js
  if (typeof pdfjsLib === "undefined" || !pdfjsLib.getDocument) {
    pdfViewer.textContent = "pdf.js introuvable. Assurez-vous d'inclure le script dans index.html.";
    return;
  }

  pdfjsLib.getDocument(pdfUrl).promise.then((pdf) => {
    pdfDoc = pdf;
    currentPage = 1;
    renderPage(currentPage);
  }).catch((err) => {
    console.error(err);
    pdfViewer.textContent = "Impossible de charger ce PDF.";
  });
}

/**
 * Rend une page en qualité élevée :
 * - affichage "fit-to-width" (la largeur s'adapte au conteneur),
 * - backing store ≥ 3 (qualité nette) sans changer la taille affichée.
 */
function renderPage(pageNum) {
  if (!pdfDoc) return;
  if (pageNum < 1 || pageNum > pdfDoc.numPages) return;

  const viewer = document.getElementById("pdfViewer");
  if (!viewer) return;

  // Nettoyer le viewer (un seul canvas)
  viewer.innerHTML = "";

  pdfDoc.getPage(pageNum).then((page) => {
    const containerWidth = Math.min(viewer.clientWidth || window.innerWidth, 1200); // limite confortable
    const unscaledViewport = page.getViewport({ scale: 1 });
    const fitWidthScale = containerWidth / unscaledViewport.width;

    // on veut un backing scale effectif >= 3
    const deviceScale = window.devicePixelRatio || 1;
    const outputScale = Math.max(3, deviceScale);

    // viewport à la taille d'affichage (fit-to-width)
    const viewport = page.getViewport({ scale: fitWidthScale });

    // Canvas
    const canvas = document.createElement("canvas");
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);

    const context = canvas.getContext("2d");
    context.setTransform(outputScale, 0, 0, outputScale, 0, 0);

    viewer.appendChild(canvas);

    const renderTask = page.render({
      canvasContext: context,
      viewport,
      intent: "display",
      enableWebGL: true,
      renderInteractiveForms: false,
    });

    renderTask.promise.then(() => {
      currentPage = pageNum;
    }).catch((e) => {
      console.error("Erreur rendu page:", e);
    });
  });
}

/* ---------------------------
   6) Routes (hash routing)
--------------------------- */
function mount() {
  const hash = window.location.hash || "#/";
  if (hash.startsWith("#/pdf/")) {
    const encoded = hash.replace("#/pdf/", "");
    const file = decodeURIComponent(encoded);
    openPDF(file);
    return;
  }
  if (hash.startsWith("#/section/")) {
    const slug = hash.replace("#/section/", "");
    renderSection(slug);
    return;
  }
  if (hash === "#/menu") {
    renderMenu();
    return;
  }
  renderHome();
}
window.addEventListener("hashchange", mount);
window.addEventListener("load", mount);

/* ---------------------------
   7) Service Worker & cache
--------------------------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/externes-pwa-rules/sw.js')
      .then((registration) => {
        console.log('Service Worker OK:', registration);
        if (navigator.serviceWorker.controller) {
          const pdfFiles = Object.values(SECTIONS).flatMap(s => s.items.map(it => `/pdf/${it.file}`));
          const filesToAdd = [
            '/img/couverture.png',
            '/img/titre.png',
            ...new Set(pdfFiles),
          ];
          caches.open('externes-pwa-cache-v1').then((cache) => {
            cache.addAll(filesToAdd).catch((err) => {
              console.error('Erreur addAll cache:', err);
            });
          });
        }
      })
      .catch((error) => {
        console.log('SW échec:', error);
      });
  });
}
