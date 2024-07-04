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

// Récupération des works & appel de la fonction de création de works dans la galerie de la modale
function displayWorksModal() {
  modalGallery.innerHTML = "";
  getWorks().then((works) => {
    works.forEach((work) => {
      createWorkModal(work);
    });
    deleteWork();
  });
}

// Création des balises et injection des données à partir du fetchWorks
function createWorkModal(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const span = document.createElement("span");
  const trash = document.createElement("i");
  trash.classList.add("fa-solid", "fa-trash-can");
  trash.id = work.id;
  img.src = work.imageUrl;
  img.alt = work.title;
  span.appendChild(trash);
  figure.appendChild(img);
  figure.appendChild(span);
  modalGallery.appendChild(figure);
}

// Gestion de la fermeture des modales
function closeModalGallery() {
  const xmarkModal = document.querySelector(".modalPortfolio span .fa-xmark");
  xmarkModal.addEventListener("click", () => {
    modalContent.style.display = "none";
  });

  const xmarkModal2 = document.querySelector(".modalAddWorks span .fa-xmark");
  xmarkModal2.addEventListener("click", () => {
    inputFile.value = "";
    previewImage.style.display = "none";
    modalContent.style.display = "none";
    updateButtonState(); // Assurez-vous de mettre à jour l'état du bouton après la fermeture de la modale d'ajout de travaux
  });

  modalContent.addEventListener("click", (e) => {
    if (e.target === modalContent) {
      inputFile.value = "";
      previewImage.style.display = "none";
      modalContent.style.display = "none";
      updateButtonState(); // Assurez-vous de mettre à jour l'état du bouton après la fermeture de la modale d'ajout de travaux
    }
  });
}

// Suppression des works grâce à la méthode DELETE & au Token user depuis la poubelle de la modale
const deleteWorkID = {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  mode: "cors",
  credentials: "same-origin",
};

// Suppression au clic sur la poubelle et mise à jour modale et galerie principale
function deleteWork() {
  const trashs = document.querySelectorAll(".fa-trash-can");
  trashs.forEach(trash => {
    trash.addEventListener("click", () => {
      const workID = trash.id;
      fetch(`http://localhost:5678/api/works/${workID}`, deleteWorkID).then(
        () => {
          displayWorksModal();
          displayWorksGallery();
        }
      );
    });
  });
}

// Fonction d'affichage au clic sur btn:"ajouter-photo" de la modalAddWorks
function displayModalAddWorks() {
  buttonAddPhoto.addEventListener("click", () => {
    modalPortfolio.style.display = "none";
    modalAddWorks.style.display = "flex";
    updateButtonState(); // Assurez-vous de mettre à jour l'état du bouton lors de l'affichage de la modale d'ajout de travaux
  });
}

// Retour sur modalPortfolio depuis la flèche de la modalAddWorks
function returnToModalPortfolio() {
  const arrowLeftModalWorks = document.querySelector(".modalAddWorks .fa-arrow-left");
  arrowLeftModalWorks.addEventListener("click", () => {
    inputFile.value = "";
    previewImage.style.display = "none";
    modalPortfolio.style.display = "flex";
    modalAddWorks.style.display = "none";
    updateButtonState(); // Assurez-vous de mettre à jour l'état du bouton après le retour à la modale du portfolio
  });
}

// Fonction d'ajout d'un nouveau projet
function addWorks() {
  formAddWorks.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formAddWorks);
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
      displayWorksModal();
      displayWorksGallery();
      formAddWorks.reset();
      modalPortfolio.style.display = "flex";
      modalAddWorks.style.display = "none";
      previewImage.style.display = "none";
      updateButtonState(); // Assurez-vous de mettre à jour l'état du bouton après l'ajout de travaux
    })
    .catch((error) => {
      console.error("Erreur :", error);
    });
  });
}

// Fonction qui génère les catégories dynamiquement pour la modale
async function displayCategoryModal() {
  const select = document.querySelector("form select");
  const categories = await getCategory();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

// Fonction prévisualisation de l'image
function prevImg() {
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        updateButtonState(); // Assurez-vous de mettre à jour l'état du bouton après la prévisualisation de l'image
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.style.display = "none";
      updateButtonState(); // Assurez-vous de mettre à jour l'état du bouton si aucun fichier n'est sélectionné
    }
  });
}

// Fonction pour mettre à jour l'état du bouton de validation
function updateButtonState() {
  if (inputTitle.value.trim() !== "" && inputFile.files.length > 0) {
    buttonValidForm.classList.remove("button-add-work");
    buttonValidForm.classList.add("buttonValidForm");
  } else {
    buttonValidForm.classList.remove("buttonValidForm");
    buttonValidForm.classList.add("button-add-work");
  }
}

// Vérification des champs dans verifFormCompleted
function verifFormCompleted() {
  formAddWorks.addEventListener("input", () => {
    updateButtonState(); // Assurez-vous de mettre à jour l'état du bouton à chaque modification du formulaire
  });
}
