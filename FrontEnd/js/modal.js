// @ts-nocheck

// Variables Globales
const modalContent = document.getElementById("modalContent");
const modalGallery = document.querySelector(".modalGallery");

const buttonAddPhoto = document.querySelector(".container-button button");
const modalPortfolio = document.querySelector(".modalPortfolio");
const modalAddWorks = document.querySelector(".modalAddWorks");

const formAddWorks = document.querySelector("#formAddWorks");
const inputTitle = document.querySelector("#title");
const inputFile = document.querySelector("#file");
const previewImage = document.getElementById("previewImage");
const buttonValidForm = document.querySelector(".container-button-add-work button");

const deleteWorkID = {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
};




// Fonction Principale pour l'affichage des works dans la Modale
function mainModal() {
  displayCategoryModal();
  if (user) {
    displayModal();
    displayWorksModal();
    closeModalGallery();
    displayModalAddWorks();
    returnToModalPortfolio();
    addWorks();
    prevImg();
    verifFormCompleted();
    updateButtonState(); // Assurez-vous que l'état du bouton est correct au chargement initial
  }
}
mainModal();

// Affichage de la Modale uniquement si connecté grâce au clic sur le bouton modifié
function displayModal() {
  const modeEdition = document.querySelector(".div-edit span");
  modeEdition.addEventListener("click", () => {
    modalContent.style.display = "flex";
    modalPortfolio.style.display = "flex";
    modalAddWorks.style.display = "none";
  });
}

// Cette fonction récupère les œuvres depuis une source externe (API par exemple) et les affiche dans une galerie modale
function displayWorksModal() {
  // Nettoie le contenu actuel de la galerie modale
  modalGallery.innerHTML = "";
  
  // Récupère les œuvres et une fois la promesse résolue, itère sur chaque œuvre pour créer les éléments correspondants
  getWorks().then((works) => {
    works.forEach((work) => {
      createWorkModal(work); // Appelle createWorkModal pour chaque œuvre
    });
    deleteWork(); // Configure la fonction de suppression pour chaque œuvre
  });
}

function createWorkModal(work) {
  // Crée un élément <figure> pour encapsuler l'image et le bouton de suppression
  const figure = document.createElement("figure");

  // Crée un élément <img> pour afficher l'image de l'œuvre
  const img = document.createElement("img");

  // Crée un élément <span> qui contiendra l'icône de corbeille (bouton de suppression)
  const span = document.createElement("span");

  // Crée un élément <i> (icône) pour représenter le bouton de suppression de l'œuvre
  const trash = document.createElement("i");

 
  
  // Ajoute des classes à l'icône de corbeille
  trash.classList.add("fa-solid", "fa-trash-can");
  trash.id = work.id; // Assignation de l'ID de l'œuvre à l'icône de corbeille
  
  // Assignation de l'URL de l'image et du texte alternatif à l'image
  img.src = work.imageUrl;
  img.alt = work.title;
  
  // Structure les éléments dans l'ordre nécessaire
  span.appendChild(trash);
  figure.appendChild(img);
  figure.appendChild(span);
  
  // Ajoute la figure complète à la galerie modale
  modalGallery.appendChild(figure);
}

// Gère la fermeture des modales et les actions associées
function closeModalGallery() {
  // Écoute le clic sur l'icône de fermeture dans la modalPortfolio
  const xmarkModal = document.querySelector(".modalPortfolio span .fa-xmark");
  xmarkModal.addEventListener("click", () => {
    modalContent.style.display = "none"; // Masque la modalContent
  });

  // Écoute le clic sur l'icône de fermeture dans la modalAddWorks
  const xmarkModal2 = document.querySelector(".modalAddWorks span .fa-xmark");
  xmarkModal2.addEventListener("click", () => {
    // Réinitialise les éléments et masque la modalContent
    inputFile.value = "";
    previewImage.style.display = "none";
    modalContent.style.display = "none";
    updateButtonState(); // Met à jour l'état du bouton après la fermeture
  });

  // Écoute le clic sur le fond de la modalContent pour la fermer
  modalContent.addEventListener("click", (e) => {
    if (e.target === modalContent) {
      // Réinitialise les éléments et masque la modalContent
      inputFile.value = "";
      previewImage.style.display = "none";
      modalContent.style.display = "none";
      updateButtonState(); // Met à jour l'état du bouton après la fermeture
    }
  });
}

// Supprime une œuvre au clic sur l'icône de corbeille et met à jour la galerie modale et principale
function deleteWork() {
  const trashs = document.querySelectorAll(".fa-trash-can");
  trashs.forEach(trash => {
    trash.addEventListener("click", () => {
      const workID = trash.id;
      // Envoie une requête DELETE à l'API pour supprimer l'œuvre spécifiée
      fetch(`http://localhost:5678/api/works/${workID}`, deleteWorkID).then(
        () => {
          // Après la suppression réussie, met à jour la galerie modale et principale
          displayWorksModal();
          displayWorksGallery();
        }
      );
    });
  });
}

// Affiche la modalAddWorks au clic sur le bouton "ajouter-photo" et met à jour l'état du bouton
function displayModalAddWorks() {
  buttonAddPhoto.addEventListener("click", () => {
    modalPortfolio.style.display = "none"; // Masque modalPortfolio
    modalAddWorks.style.display = "flex"; // Affiche modalAddWorks
    updateButtonState(); // Met à jour l'état du bouton
  });
}

// Retourne à modalPortfolio au clic sur la flèche de retour dans modalAddWorks et met à jour l'état du bouton
function returnToModalPortfolio() {
  const arrowLeftModalWorks = document.querySelector(".modalAddWorks .fa-arrow-left");
  arrowLeftModalWorks.addEventListener("click", () => {
    // Réinitialise les éléments, masque modalAddWorks et affiche modalPortfolio
    inputFile.value = "";
    previewImage.style.display = "none";
    modalPortfolio.style.display = "flex";
    modalAddWorks.style.display = "none";
    updateButtonState(); // Met à jour l'état du bouton après le retour
  });
}

// Ajoute un nouveau projet en soumettant le formulaire formAddWorks
function addWorks() {
  formAddWorks.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formAddWorks);
    // Envoie les données du formulaire à l'API via une requête POST
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du fichier");
      }
      return response.json();
    })
    .then((data) => {
      // Après ajout réussi, met à jour la galerie modale et principale, réinitialise le formulaire et masque la modalAddWorks
      displayWorksModal();
      displayWorksGallery();
      formAddWorks.reset();
      modalPortfolio.style.display = "flex";
      modalAddWorks.style.display = "none";
      previewImage.style.display = "none";
      updateButtonState(); // Met à jour l'état du bouton après l'ajout
    })
    .catch((error) => {
      console.error("Erreur :", error);
    });
  });
}

// Affiche dynamiquement les catégories dans le formulaire de modalAddWorks
async function displayCategoryModal() {
  const select = document.querySelector("form select");
  const categories = await getCategory(); // Récupère les catégories depuis une source externe (API)
  categories.forEach((category) => {
    // Crée et ajoute des options dans le select pour chaque catégorie
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

// Prévisualise l'image sélectionnée avant l'ajout dans modalAddWorks et met à jour l'état du bouton
function prevImg() {
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // Affiche l'image prévisualisée
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        updateButtonState(); // Met à jour l'état du bouton après la prévisualisation
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.style.display = "none";
      updateButtonState(); // Met à jour l'état du bouton si aucun fichier n'est sélectionné
    }
  });
}

// Met à jour l'état du bouton de validation en fonction des entrées du formulaire
function updateButtonState() {
  if (inputTitle.value.trim() !== "" && inputFile.files.length > 0) {
    // Si le titre n'est pas vide et un fichier est sélectionné, active le bouton de validation
    buttonValidForm.classList.remove("button-add-work");
    buttonValidForm.classList.add("buttonValidForm");
  } else {
    // Sinon, désactive le bouton de validation
    buttonValidForm.classList.remove("buttonValidForm");
    buttonValidForm.classList.add("button-add-work");
  }
}

// Vérifie les champs du formulaire à chaque modification et met à jour l'état du bouton
function verifFormCompleted() {
  formAddWorks.addEventListener("input", () => {
    updateButtonState(); // Met à jour l'état du bouton à chaque modification du formulaire
  });
}
