let currentPage = 1;  // Page actuelle
let pdfDoc = null;    // Référence au document PDF

// Gestion du clic sur l'image "couverture" pour afficher le menu
document.getElementById('cover-img').addEventListener('click', function() {
    document.querySelector('.welcome-page').style.display = 'none';  // Cacher la page d'accueil
    document.getElementById('menu').style.display = 'block';  // Afficher le menu
    document.getElementById('livret-title-menu').style.display = 'block';  // Afficher le titre sur la page du menu
    populateMenu();  // Remplir le menu avec les liens des PDF
});

function renderPage(pageNum) {
  const viewer = document.getElementById('pdfViewer');

  // Vérifier les limites des pages
  if (pageNum < 1 || pageNum > pdfDoc.numPages) return;

  pdfDoc.getPage(pageNum).then(page => {
    const canvas = document.createElement('canvas');
    viewer.innerHTML = ''; // Réinitialiser la vue avant d'ajouter une nouvelle page
    viewer.appendChild(canvas);

    const context = canvas.getContext('2d');
    const scale = 0.75;  // Ajuster l'échelle pour la mise en page du PDF
    const dpi = window.devicePixelRatio || 2; // Haute résolution pour les écrans modernes
    const viewport = page.getViewport({ scale: scale });

    // Ajuster la taille du canvas pour correspondre à la densité de pixels
    canvas.width = viewport.width * dpi;
    canvas.height = viewport.height * dpi;

    // Ajuster le contexte pour la densité de pixels
    context.setTransform(dpi, 0, 0, dpi, 0, 0);

    // Rendu de la page sur le canvas
    page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
      // Mettre à jour la page actuelle
      currentPage = pageNum;
    });
  });
}


// 1. Définir la fonction renderHome pour afficher la page d'accueil
function renderHome() {
    const appContainer = document.getElementById("app");

    // Effacer le contenu existant
    appContainer.innerHTML = "";
}

// 2. Déclaration de la fonction openPDF
export function openPDF(pdfPath) {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
        console.error("Le conteneur avec l'ID 'app' n'a pas été trouvé.");
        return;
    }

    // Vider l'élément #app avant de charger le PDF
    appContainer.innerHTML = "";

    // Créer un conteneur pour afficher le PDF
    const pdfViewer = document.createElement("div");
    pdfViewer.id = "pdfViewer";
    appContainer.appendChild(pdfViewer);

    // Ajouter un log pour vérifier l'URL du PDF
    console.log("Tentative de chargement du PDF : ", pdfPath);

    // Modifier l'URL pour refléter l'ouverture du PDF
    const pdfName = pdfPath.split("/").pop().split(".")[0];  // Exemple : "antibiorein" pour antibiotique rénal
    history.pushState(null, '', `#/${pdfName}`);

    console.log('Current URL:', window.location.href);

    // Créer les boutons de navigation pour les PDF
    const navContainer = document.createElement("div");
    navContainer.classList.add("pdf-nav");

    const prevButton = document.createElement("button");
    prevButton.textContent = "Précédent";
    prevButton.addEventListener("click", () => goToPage(currentPage - 1));

    const nextButton = document.createElement("button");
    nextButton.textContent = "Suivant";
    nextButton.addEventListener("click", () => goToPage(currentPage + 1));

    navContainer.appendChild(prevButton);
    navContainer.appendChild(nextButton);
    appContainer.appendChild(navContainer);


    // Ajouter un événement "click" au bouton
   const backButton = document.createElement("button");
backButton.textContent = "Retour";
backButton.classList.add("btn"); // Utilise la classe btn pour un bon style
backButton.addEventListener("click", () => {
    window.location.href = "https://antoine-briz.github.io/livret-pwa-rules/";  // Chemin absolu vers la page d'accueil
});

// Ajouter le bouton "Retour" en dessous des autres boutons
appContainer.appendChild(backButton);

    
    // Cacher le menu et les autres éléments, afficher uniquement le PDF
    document.getElementById('menu').style.display = 'none';  // Masquer le menu
    document.querySelector('.welcome-page').style.display = 'none';  // Masquer la page d'accueil

    // Charger le PDF sans utiliser de worker
    const pdfUrl = './pdf/' + pdfPath;
    console.log("URL complète du PDF : ", pdfUrl);

    // Créer un iframe pour afficher le PDF
    const iframe = document.createElement("iframe");
    iframe.src = pdfUrl;
    iframe.style.width = "100%"; // Ajuster la largeur pour occuper tout l'espace disponible
    iframe.style.height = "100vh"; // Ajuster la hauteur pour occuper tout l'espace visible, en tenant compte de l'écran
    iframe.style.border = "none";  // Enlever les bordures

    // Appliquer un zoom dézoommant si nécessaire pour les écrans mobiles
    iframe.style.transform = "scale(0.9)";  // Ajuste le zoom si nécessaire
    iframe.style.transformOrigin = "top left"; // Centrer le zoom en haut à gauche

    // Permettre le défilement horizontal et vertical si nécessaire
    iframe.style.overflow = "auto"; // Permet le défilement horizontal et vertical

    // Ajouter l'iframe à l'élément #pdfViewer
    pdfViewer.appendChild(iframe);

    // Correctement gérer les promesses avec `then` et `catch`
// Correctement gérer les promesses avec `then` et `catch`
pdfjsLib.getDocument(pdfUrl).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;  // Initialiser pdfDoc avec le document PDF
    const scale = window.innerWidth < 768 ? 0.65 : 0.75;  // Zoom plus faible sur les petits écrans
    renderPage(1, scale);  // Afficher la première page du PDF avec le zoom calculé
}).catch((error) => {
    console.error("Erreur lors du chargement du PDF :", error);
});
}


// 4. Fonction pour aller à une page spécifique
function goToPage(pageNum) {
    renderPage(pageNum);
}


// 5. Fonction pour remplir le menu avec les liens vers les PDFs
function populateMenu() {
    const imgList = [
        { name: 'Echographie pratique', pdf: 'echographie.pdf', image: 'echographie.png' },
        { name: 'Ventilation mécanique', pdf: 'ventilation.pdf', image: 'ventilation.png' },
        { name: 'Bactériologie clinique', pdf: 'bacterio.pdf', image: 'bacterio.png' },
        { name: 'Epuration extra-rénale', pdf: 'dialyse.pdf', image: 'dialyse.png' },
        { name: 'EEG continu', pdf: 'eeg.pdf', image: 'eeg.png' },
        { name: 'Maladies de système', pdf: 'systeme.pdf', image: 'systeme.png' },
        { name: 'Médicaments et posologies', pdf: 'medicaments.pdf', image: 'medicaments.png' }
    ];

    const imgContainer = document.getElementById('image-list');
    imgContainer.innerHTML = '';  // Effacer tout le contenu précédent

    imgList.forEach(item => {
        // Créer un élément div pour chaque image et son titre
        let imgDiv = document.createElement('div');
        imgDiv.classList.add('image-container');

        // Créer l'élément image
        let imgElement = document.createElement('img');
        imgElement.src = 'img/' + item.image;
        imgElement.alt = item.name;
        imgElement.classList.add('image-item');

        // Ajouter l'image et le titre à l'élément div
        imgDiv.appendChild(imgElement);

        // Ajouter un événement pour ouvrir le PDF lorsque l'image est cliquée
        imgDiv.addEventListener('click', () => openPDF(item.pdf));

        // Ajouter l'élément div au conteneur du menu
        imgContainer.appendChild(imgDiv);
    });
  
    // Attacher les gestionnaires d'événements aux boutons "Table des matières" et "Table des abréviations"
    document.getElementById("table-of-contents").addEventListener("click", function() {
        openPDF("tablemetiere.pdf");  // Ouvrir le PDF des tables des matières
    });

    document.getElementById("abbreviations").addEventListener("click", function() {
        openPDF("tableabrev.pdf");  // Ouvrir le PDF des tables des abréviations
    });
}

// 6. Fonction pour monter le contenu en fonction du hash dans l'URL
function mount() {
    const route = routes[location.hash] || renderHome; // fallback si hash non défini
    route(); // affiche la page correspondante
}

// Routes de l'application
// Routes de l'application
const routes = {
    "#/": renderHome, // La route pour la page d'accueil
    "#/echographie.pdf": () => openPDF("echographie.pdf"),
    "#/ventilation.pdf": () => openPDF("ventilation.pdf"),
    "#/bacterio.pdf": () => openPDF("bacterio.pdf"),
    "#/dialyse.pdf": () => openPDF("dialyse.pdf"),
    "#/eeg.pdf": () => openPDF("eeg.pdf"),
    "#/systeme.pdf": () => openPDF("systeme.pdf"),
    "#/medicaments.pdf": () => openPDF("medicaments.pdf"),
    "#/tablemetiere.pdf": () => openPDF("tablemetiere.pdf"),
    "#/tableabrev.pdf": () => openPDF("tableabrev.pdf"),
};

// 7. Ajout des écouteurs d'événements pour détecter les changements dans l'URL et charger la bonne page
window.addEventListener("hashchange", mount); // Met à jour la page quand le hash change
window.addEventListener("load", mount);  // Met à jour la page au chargement de la page

// Ajout manuel des fichiers au cache après l'enregistrement du service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/livret-pwa-rules/sw.js')
 // Assurez-vous que le fichier sw.js est à la racine
      .then((registration) => {
        console.log('Service Worker enregistré avec succès:', registration);

        // Une fois le service worker enregistré, ajoutez les fichiers manuellement au cache
        if (navigator.serviceWorker.controller) {
          // Ajouter les fichiers manuellement au cache
          const filesToAdd = [
            '/img/couverture.png',
            '/img/echographie.png',
            '/img/ventilation.png',
            '/img/bacterio.png',
            '/img/dialyse.png',
            '/img/eeg.png',
            '/img/systeme.png',
            '/img/medicaments.png',
            '/img/titre.png',
            '/pdf/echographie.pdf',
            '/pdf/ventilation.pdf',
            '/pdf/bacterio.pdf',
            '/pdf/dialyse.pdf',
            '/pdf/eeg.pdf',
            '/pdf/systeme.pdf',
            '/pdf/medicaments.pdf',
            '/pdf/tablemetiere.pdf',
            '/pdf/tableabrev.pdf'
          ];

          // Ouvrir le cache et ajouter les fichiers
          caches.open('livret-pwa-cache-v1').then((cache) => {
            cache.addAll(filesToAdd).then(() => {
              console.log('Fichiers ajoutés manuellement au cache');
            }).catch((err) => {
              console.error('Erreur lors de l\'ajout des fichiers au cache:', err);
            });
          });
        }
      })
      .catch((error) => {
        console.log('Échec de l\'enregistrement du Service Worker:', error);
      });
  });
}

let currentZoom = 0.75; // Valeur initiale du zoom
let initialDistance = 0; // Distance initiale entre les deux doigts lors du premier toucher

// Fonction pour calculer la distance entre les deux doigts (en pixels)
function getDistance(touch1, touch2) {
    const dx = touch1.pageX - touch2.pageX;
    const dy = touch1.pageY - touch2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Ajout d'un écouteur d'événements pour détecter le zoom tactile
document.getElementById('pdfViewer').addEventListener('touchstart', function(event) {
    if (event.touches.length === 2) {
        // Calculer la distance initiale entre les deux doigts au début du toucher
        initialDistance = getDistance(event.touches[0], event.touches[1]);
    }
}, false);

document.getElementById('pdfViewer').addEventListener('touchmove', function(event) {
    if (event.touches.length === 2) {
        // Calculer la distance actuelle entre les deux doigts pendant le mouvement
        const currentDistance = getDistance(event.touches[0], event.touches[1]);

        // Si la distance change, on applique un zoom
        if (currentDistance !== initialDistance) {
            const zoomChange = currentDistance / initialDistance; // Le facteur de zoom
            currentZoom = Math.max(0.5, Math.min(2, currentZoom * zoomChange)); // Limiter le zoom entre 0.5 et 2
            initialDistance = currentDistance; // Mettre à jour la distance initiale pour le prochain mouvement

            console.log("Zoom actuel : ", currentZoom);
            renderPage(currentPage, currentZoom); // Re-render la page avec le nouveau zoom
        }
    }
}, false);

// Si l'utilisateur relâche les doigts, réinitialiser la distance
document.getElementById('pdfViewer').addEventListener('touchend', function(event) {
    if (event.touches.length < 2) {
        initialDistance = 0; // Réinitialiser la distance lorsqu'il n'y a plus que 1 doigt
    }
}, false);

