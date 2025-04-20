import { fetchCardsData } from '../utils/utils.js';

let cards = [];

// Charger les données
const url = '../assets/noms.json';
fetchCardsData(url).then((data) => {
  console.log("Données chargées :", data); // Vérifiez les données ici
  cards = data;

  // Appeler showAllCards après le chargement des données
  showAllCards();
}).catch((error) => console.error("Erreur lors du chargement des données :", error));

function showAllCards() {
  const tableBody = document.getElementById("cards-table-body");
  if (!tableBody) {
    console.error("L'élément avec l'ID 'cards-table-body' est introuvable !");
    return;
  }

  tableBody.innerHTML = ""; // Réinitialise le contenu du tableau

  cards.forEach((card) => {
    const row = document.createElement("tr");

    const arabeCell = document.createElement("td");
    arabeCell.textContent = card.arabe;
    arabeCell.classList.add("arabic"); // Style pour le texte arabe

    const translitCell = document.createElement("td");
    translitCell.textContent = card.translit;

    const tradCell = document.createElement("td");
    tradCell.textContent = card.trad;

    row.appendChild(arabeCell);
    row.appendChild(translitCell);
    row.appendChild(tradCell);

    tableBody.appendChild(row);
  });

  // Affiche la section du tableau
  const allCardsSection = document.getElementById("all-cards");
  if (allCardsSection) {
    allCardsSection.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("all-cards")) {
    showAllCards();
  }
});
