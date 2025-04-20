import { fetchCardsData } from '../utils/utils.js';

let cards = [];
let currentIndex = 0;
let currentStep = 0; // 0 = arabe, 1 = translit, 2 = trad

const url = '../assets/noms.json';
fetchCardsData(url).then((data) => {
  cards = data;
  updateCardContent();
}).catch((error) => console.error("Erreur lors du chargement des données :", error));

function updateCardContent() {
  if (!cards || cards.length === 0) return;

  const currentCard = cards[currentIndex];
  const content = document.getElementById("card-content");
  if (!currentCard || !content) return;

  if (currentStep === 0) {
    content.textContent = currentCard.arabe;
  } else if (currentStep === 1) {
    content.textContent = currentCard.translit;
  } else if (currentStep === 2) {
    content.textContent = currentCard.trad;
  }

  const progression = document.getElementById("progression");
  if (progression) {
    progression.textContent = `Carte ${currentIndex + 1} sur ${cards.length}`;
  }
}

function toggleCard() {
  currentStep++;
  if (currentStep > 2) {
    currentStep = 0;
    nextCard();
  } else {
    updateCardContent();
  }
}

function nextCard() {
  currentIndex = (currentIndex + 1) % cards.length;
  currentStep = 0;
  updateCardContent();
}

function previousCard() {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  currentStep = 0;
  updateCardContent();
}

function randomCard() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * cards.length);
  } while (randomIndex === currentIndex);

  currentIndex = randomIndex;
  currentStep = 0;
  updateCardContent();
}

// Rendre les fonctions accessibles globalement
window.toggleCard = toggleCard;
window.nextCard = nextCard;
window.previousCard = previousCard;
window.randomCard = randomCard;

// Affiche les éléments une fois le DOM chargé
window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cards-section");
  const buttons = document.getElementById("cards-buttons");
  if (container) container.style.display = "block";
  if (buttons) buttons.style.display = "block";
});