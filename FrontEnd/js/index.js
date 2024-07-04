// Variables globales pour les éléments DOM et les données utilisateur
const gallery = document.querySelector(".gallery"); // Sélectionne la galerie d'images
const containerFiltres = document.querySelector(".container-filtres"); // Sélectionne le conteneur des filtres
const logOut = document.getElementById("login-link"); // Sélectionne le lien de déconnexion
const sectionPortfolio = document.querySelector("#portfolio"); // Sélectionne la section portfolio
const sectionPortfolioH2 = document.querySelector("#portfolio h2"); // Sélectionne le titre de la section portfolio

// Fonction asynchrone pour récupérer les travaux depuis l'API
async function getWorks() {
  // Requête asynchrone pour récupérer les travaux
  const requete = await fetch("http://localhost:5678/api/works");
  return requete.json(); // Retourne les données au format JSON
}

// Fonction principale asynchrone pour l'initialisation
async function main() {
  displayWorksGallery(); // Affiche les travaux dans la galerie
  createAllButtons(); // Crée tous les boutons de filtre
  logginAdmin(); // Gère l'affichage administratif si l'utilisateur est connecté
  logoutAdmin(); // Gère la déconnexion de l'utilisateur
}

// Fonction pour afficher les travaux dans la galerie
function displayWorksGallery() {
  gallery.innerHTML = ""; // Vide la galerie actuelle
  getWorks().then((data) => {
    // Récupère les travaux depuis l'API
    data.forEach((work) => {
      createWork(work); // Crée chaque élément de travail dans la galerie
    });
  });
}

// Fonction pour créer un élément de travail dans la galerie
function createWork(work) {
  const figure = document.createElement("figure"); // Crée une balise <figure> pour chaque travail
  const img = document.createElement("img"); // Crée une balise <img> pour l'image du travail
  const figcaption = document.createElement("figcaption"); // Crée une balise <figcaption> pour le titre du travail
  figcaption.textContent = work.title; // Définit le titre du travail
  img.src = work.imageUrl; // Définit l'URL de l'image du travail
  img.alt = work.title; // Définit l'attribut alt de l'image
  figure.appendChild(img); // Ajoute l'image à la balise <figure>
  figure.appendChild(figcaption); // Ajoute le titre à la balise <figure>
  gallery.appendChild(figure); // Ajoute la balise <figure> à la galerie
}

// Fonction pour créer tous les boutons de filtre dynamiquement
function createAllButtons() {
  getCategory().then((data) => {
    // Récupère les catégories depuis l'API
    data.forEach((category) => {
      createButton(category); // Crée un bouton pour chaque catégorie
    });
  });
}

// Fonction pour créer un bouton de filtre
function createButton(category) {
  const btn = document.createElement("button"); // Crée un élément <button> pour chaque catégorie
  btn.classList.add("buttons-filtres"); // Ajoute la classe CSS pour les boutons de filtre
  btn.textContent = category.name; // Définit le texte du bouton avec le nom de la catégorie
  btn.id = category.id; // Définit l'ID du bouton avec l'ID de la catégorie
  containerFiltres.appendChild(btn); // Ajoute le bouton au conteneur des filtres
}

// Fonction pour afficher les travaux filtrés par catégorie
async function displayByCategory() {
  const works = await getWorks(); // Récupère tous les travaux depuis l'API
  const buttons = document.querySelectorAll(".container-filtres button"); // Sélectionne tous les boutons de filtre
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      buttons.forEach((btn) => {
        btn.classList.remove("active"); // Désactive tous les boutons de filtre
      });
      button.classList.add("active"); // Active le bouton cliqué
      const btnId = e.target.id; // Récupère l'ID du bouton cliqué
      gallery.innerHTML = ""; // Vide la galerie actuelle
      works.forEach((work) => {
        if (btnId == work.categoryId || btnId == "0") {
          // Affiche les travaux correspondant à la catégorie sélectionnée ou tous les travaux si "Tous" est sélectionné
          createWork(work);
        }
      });
    });
  });
}

// Fonction pour gérer l'affichage administratif si l'utilisateur est connecté
function logginAdmin() {
  if (user) {
    // Si l'utilisateur est connecté
    logOut.textContent = "logout"; // Modifie le texte du lien de déconnexion
    document.body.insertAdjacentHTML("afterbegin", adminConexionUP); // Insère du HTML avant le début du corps
    spanEdit.innerHTML = adminConexionDown; // Modifie le contenu de l'élément <span> pour l'administration
    divEdit.classList.add("div-edit"); // Ajoute une classe CSS à l'élément <div> pour l'édition
    divEdit.appendChild(sectionPortfolioH2); // Ajoute le titre de la section portfolio à l'élément <div>
    divEdit.appendChild(spanEdit); // Ajoute l'élément <span> à l'élément <div>
    sectionPortfolio.prepend(divEdit); // Insère l'élément <div> au début de la section portfolio
    containerFiltres.style = "display:none"; // Masque le conteneur des filtres
  } else {
    // Si l'utilisateur n'est pas connecté
    // console.log("L'utilisateur n'est pas connecté");
  }
}

// Fonction pour gérer la déconnexion de l'utilisateur
function logoutAdmin() {
  logOut.addEventListener("click", () => {
    if (user) {
      // Si l'utilisateur est connecté
      window.sessionStorage.setItem("token", ""); // Réinitialise le jeton dans le stockage de session
      logOut.textContent = "login"; // Modifie le texte du lien de déconnexion
      window.sessionStorage.setItem("userId", ""); // Réinitialise l'ID utilisateur dans le stockage de session
      window.location.href = "index.html"; // Redirige vers la page d'accueil
    } else {
      // Si l'utilisateur n'est pas connecté
      window.location.href = "login.html"; // Redirige vers la page de connexion
    }
  });
}
