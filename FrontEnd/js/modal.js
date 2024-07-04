// @ts-nocheck
// Variables Globales
// Sélectionne le contenu de la modale principale
const modalContent = document.getElementById("modalContent");
// Sélectionne la galerie de la modale
const modalGallery = document.querySelector(".modalGallery");

// Variables pour l'affichage de la deuxième modale partie
// Bouton pour ajouter une photo
const buttonAddPhoto = document.querySelector(".container-button button");
// Sélectionne la modale du portfolio
const modalPortfolio = document.querySelector(".modalPortfolio");
// Sélectionne la modale pour ajouter des travaux
const modalAddWorks = document.querySelector(".modalAddWorks");

// Variables Pour le formulaire
// Sélectionne le formulaire pour ajouter des travaux
const formAddWorks = document.querySelector("#formAddWorks");
// Sélectionne l'étiquette du fichier dans le formulaire
const labelFile = document.querySelector("#formAddWorks label");
// Sélectionne le paragraphe associé au fichier dans le formulaire
const paragraphFile = document.querySelector("#formAddWorks p");
// Sélectionne le champ de titre
const inputTitle = document.querySelector("#title");
// Sélectionne le champ de catégorie
const inputCategory = document.querySelector("#categoryInput");
// Sélectionne le champ de fichier
const inputFile = document.querySelector("#file");
// Sélectionne l'image de prévisualisation
const previewImage = document.getElementById("previewImage");

// Fonction Principale pour l'affichage des works dans la Modale
function mainModal() {
  displayCategoryModal();
  if (user) { // Si l'utilisateur est connecté
    displayModal(); // Affiche la modale principale
    displayWorksModal(); // Affiche les travaux dans la modale
    closeModalGallery(); // Gère la fermeture de la modale
    displayModalAddWorks(); // Gère l'affichage de la modale d'ajout de travaux
    returnToModalPortfolio(); // Retourne à la modale du portfolio
    addWorks(); // Ajoute des travaux
    prevImg(); // Prévisualise l'image avant de la télécharger
    verifFormCompleted(); // Vérifie que tous les champs du formulaire sont remplis
  }
}
mainModal(); // Appel de la fonction principale

// Affichage de la Modale uniquement si connecté grâce au clic sur le bouton modifié
function displayModal() {
  const modeEdition = document.querySelector(".div-edit span");
  modeEdition.addEventListener("click", () => {
    modalContent.style.display = "flex"; // Affiche le contenu de la modale
    modalPortfolio.style.display = "flex"; // Affiche le portfolio
    modalAddWorks.style.display = "none"; // Cache la modale d'ajout de travaux
  });
}

// Récupération des works & appel de la fonction de création de works dans la galerie de la modale
function displayWorksModal() {
  modalGallery.innerHTML = ""; // Vide le contenu de la galerie de la modale
  getWorks().then((works) => {
    works.forEach((work) => { // Boucle qui parcourt nos works
      createWorkModal(work); // Crée et affiche chaque work dans la modale
    });
    deleteWork(); // Ajoute la fonctionnalité de suppression de works
  });
}

// Création des balises et injection des données à partir du fetchWorks
function createWorkModal(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const span = document.createElement("span");
  const trash = document.createElement("i");
  trash.classList.add("fa-solid", "fa-trash-can"); // Ajoute les classes pour l'icône de poubelle
  trash.id = work.id; // Assigne l'ID du work à l'icône de poubelle
  img.src = work.imageUrl; // Définit la source de l'image
  img.alt = work.title; // Définit le texte alternatif de l'image
  span.appendChild(trash); // Ajoute l'icône de poubelle au span
  figure.appendChild(img); // Ajoute l'image à la figure
  figure.appendChild(span); // Ajoute le span à la figure
  modalGallery.appendChild(figure); // Ajoute la figure à la galerie de la modale
}

// Gestion de la fermeture des modales
function closeModalGallery() {
  // Fermeture de la modale sur la croix 1
  const xmarkModal = document.querySelector(".modalPortfolio span .fa-xmark");
  xmarkModal.addEventListener("click", () => {
    modalContent.style.display = "none"; // Cache le contenu de la modale
  });

  // Fermeture de la modale sur la croix 2
  const xmarkModal2 = document.querySelector(".modalAddWorks span .fa-xmark");
  xmarkModal2.addEventListener("click", () => {
    inputFile.value = ""; // Réinitialise le champ de fichier
    previewImage.style.display = "none"; // Cache l'image de prévisualisation
    modalContent.style.display = "none"; // Cache le contenu de la modale
  });

  // Fermeture de la modale sur le container grisé
  body.addEventListener("click", (e) => {
    if (e.target == modalContent) {
      inputFile.value = ""; // Réinitialise le champ de fichier
      previewImage.style.display = "none"; // Cache l'image de prévisualisation
      modalContent.style.display = "none"; // Cache le contenu de la modale
    }
  });
}

// Suppression des works grâce à la méthode DELETE & au Token user depuis la poubelle de la modale
// Objet de paramétrage pour requête DELETE avec token
const deleteWorkID = {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`, // Ajoute le token pour l'authentification
    "Content-Type": "application/json",
  },
  mode: "cors",
  credentials: "same-origin",
};

// Suppression au clic sur la poubelle et mise à jour modale et galerie principale
function deleteWork() {
  const trashs = document.querySelectorAll(".fa-trash-can");
  trashs.forEach(trash => {
    trash.addEventListener("click", (e) => {
      const workID = trash.id; // Récupère l'ID du work à supprimer
      fetch(`http://localhost:5678/api/works/${workID}`, deleteWorkID).then(
        () => {
          displayWorksModal(); // Met à jour la galerie de la modale
          displayWorksGallery(); // Met à jour la galerie principale
        }
      );
    });
  });
}

// Fonction d'affichage au clic sur btn:"ajouter-photo" de la modalAddWorks
function displayModalAddWorks() {
  buttonAddPhoto.addEventListener("click", () => {
    modalPortfolio.style.display = "none"; // Cache la modale du portfolio
    modalAddWorks.style.display = "flex"; // Affiche la modale d'ajout de travaux
  });
}

// Retour sur modalPortfolio depuis la flèche de la modalAddWorks
function returnToModalPortfolio() {
  const arrowLeftModalWorks = document.querySelector(".modalAddWorks .fa-arrow-left");
  arrowLeftModalWorks.addEventListener("click", () => {
    inputFile.value = ""; // Réinitialise le champ de fichier
    previewImage.style.display = "none"; // Cache l'image de prévisualisation
    modalPortfolio.style.display = "flex"; // Affiche la modale du portfolio
    modalAddWorks.style.display = "none"; // Cache la modale d'ajout de travaux
  });
}

// Fonction d'ajout d'un nouveau projet
function addWorks() {
  formAddWorks.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche l'envoi par défaut du formulaire
    const formData = new FormData(formAddWorks); // Récupère les données du formulaire
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData, // Envoie les données du formulaire
      headers: {
        Authorization: `Bearer ${token}`, // Ajoute le token pour l'authentification
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du fichier"); // Gère les erreurs d'envoi
      }
      return response.json();
    })
    .then((data) => {
      displayWorksModal(); // Met à jour la galerie de la modale
      displayWorksGallery(); // Met à jour la galerie principale
      formAddWorks.reset(); // Réinitialise le formulaire
      modalPortfolio.style.display = "flex"; // Affiche la modale du portfolio
      modalAddWorks.style.display = "none"; // Cache la modale d'ajout de travaux
      previewImage.style.display = "none"; // Cache l'image de prévisualisation
    })
    .catch((error) => {
      console.error("Erreur :", error); // Affiche l'erreur dans la console
    });
  });
}

// Fonction qui génère les catégories dynamiquement pour la modale
async function displayCategoryModal() {
  const select = document.querySelector("form select");
  const categorys = await getCategory(); // Récupère les catégories
  categorys.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id; // Assigne l'ID de la catégorie
    option.textContent = category.name; // Assigne le nom de la catégorie
    select.appendChild(option); // Ajoute l'option au select
  });
}

// Fonction prévisualisation de l'image
function prevImg() {
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0]; // Récupère le fichier sélectionné
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result; // Affiche l'image sélectionnée
        previewImage.style.display = "block"; // Affiche l'élément de prévisualisation
      };
      reader.readAsDataURL(file); // Lit le fichier sélectionné
    } else {
      previewImage.style.display = "none"; // Cache l'image de prévisualisation
    }
    updateButtonState();
  });
}

// Fonction qui vérifie si tous les inputs sont remplis
function verifFormCompleted() {
  const buttonValidForm = document.querySelector(".container-button-add-work button");
  formAddWorks.addEventListener("input", () => {
    if (!inputTitle.value == "" && !inputFile.files[0] == "") { // Vérifie si les champs sont remplis
      buttonValidForm.classList.remove("button-add-work");
      buttonValidForm.classList.add("buttonValidForm"); // Active le bouton si les champs sont remplis
    } else {
      buttonValidForm.classList.remove("buttonValidForm");
      buttonValidForm.classList.add("button-add-work"); // Désactive le bouton si les champs ne sont pas remplis
    }
  });
}
