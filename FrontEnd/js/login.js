// @ts-nocheck
/*****page de connexion js*****/

// Sélection des éléments DOM importants
const form = document.querySelector("form"); // Sélectionne le formulaire
const email = document.getElementById("email"); // Sélectionne l'input d'email
const password = document.getElementById("password"); // Sélectionne l'input de mot de passe
const logOut = document.getElementById("login-link"); // Sélectionne le lien de déconnexion

/********Ecouteur d'évènement du Form de connexion***********/
// Écouteur d'événement pour soumettre le formulaire de connexion
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Empêche l'envoi du formulaire par défaut
  const userEmail = email.value; // Récupère la valeur de l'email depuis l'input
  const userPassword = password.value; // Récupère la valeur du mot de passe depuis l'input
  const login = {
    email: userEmail,
    password: userPassword,
  };
  const user = JSON.stringify(login); // Convertit l'objet login en chaîne JSON

  /****Envoi de la requete****/
  fetch("http://localhost:5678/api/users/login", {
    method: "POST", // Méthode POST pour soumettre les données
    mode: "cors", // Mode de requête CORS
    credentials: "same-origin", // Utilisation des mêmes informations d'identification
    headers: { "Content-Type": "application/json" }, // En-tête de type JSON
    body: user, // Corps de la requête contenant les données de connexion au format JSON
  })
    .then((response) => {
      // Gestion de la réponse de la requête
      // console.log(response);
      if (!response.ok) {
        // Si la réponse n'est pas OK (status 200-299)
        email.style.border = "2px solid #FF0000"; // Met en évidence l'input d'email avec une bordure rouge
        password.style.border = "2px solid #FF0000"; // Met en évidence l'input de mot de passe avec une bordure rouge
        const errorLogin = document.querySelector("p"); // Sélectionne le paragraphe d'erreur
        errorLogin.textContent =
          "Le mot de passe ou l'identifiant que vous avez fourni est incorrect."; // Affiche un message d'erreur pour l'utilisateur
        throw new Error("Le mot de passe ou l'identifiant que vous avez fourni est incorrect."); // Lance une erreur pour interrompre la chaîne de promesses
      }
      return response.json(); // Parse la réponse JSON de la requête
    })
    .then((data) => {
      // Récupération des données Token et ID utilisateur depuis la réponse
      // console.log(data);
      const userId = data.userId; // Récupère l'ID utilisateur depuis la réponse JSON
      const userToken = data.token; // Récupère le token utilisateur depuis la réponse JSON
      window.sessionStorage.setItem("token", userToken); // Stocke le token utilisateur dans le sessionStorage
      window.sessionStorage.setItem("userId", userId); // Stocke l'ID utilisateur dans le sessionStorage
      window.location.href = "index.html"; // Redirige l'utilisateur vers la page d'accueil après connexion réussie
    })
    .catch((error) => {
      // Gestion des erreurs potentielles lors de la requête
      console.error("Une erreur est survenue : ", error); // Affiche l'erreur dans la console
    });
});
