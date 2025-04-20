let cards = [];

fetch("noms.json")
  .then((response) => response.json())
  .then((data) => {
    console.log("Données chargées :", data); // Vérifiez les données ici
    cards = data;
    if (cards.length > 0) {
      updateCardContent(); // Initialise la première carte
    } else {
      console.error("Le tableau 'cards' est vide !");
    }
  })
  .catch((error) => console.error("Erreur lors du chargement des données :", error));

let currentIndex = 0;
let currentStep = 0; // 0 = arabe, 1 = translit, 2 = trad

function updateCardContent() {
  if (!cards || cards.length === 0) {
    console.error("Le tableau 'cards' est vide ou non défini !");
    return;
  }

  const content = document.getElementById("card-content");
  if (!content) {
    console.error("L'élément avec l'ID 'card-content' est introuvable !");
    return;
  }

  const currentCard = cards[currentIndex];
  if (!currentCard) {
    console.error("Carte introuvable pour l'index :", currentIndex);
    return;
  }

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
    nextCard(); // passe à la carte suivante
  } else {
    updateCardContent(); // affiche l'étape suivante
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



// 🧠 Données quizz
let quizIndex = 0;
let quizScore = 0;
let shuffledCards = [];
let currentQuestionType = ""; // "trad", "translit", "arabe"

// 🧠 Lancer le quizz
function startQuiz() {
  // Cacher les éléments du mode carte
  document.querySelector(".card-container").style.display = "none";
  document.querySelector(".buttons").style.display = "none";
  document.getElementById("progression").style.display = "none";

  // Afficher le bloc quizz
  document.getElementById("quiz").style.display = "block";
  document.getElementById("quiz-feedback").textContent = "";

  // Réinitialiser score et questions
  quizIndex = 0;
  quizScore = 0;
  shuffledCards = [...cards].sort(() => Math.random() - 0.5);

  showQuizQuestion();
}

// 🧠 Afficher une question
function showQuizQuestion() {
  const current = shuffledCards[quizIndex];

  // Tirage au sort du type de question
  const questionTypes = ["toTrad", "toArabe", "toTranslit"];
  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  let questionText = "";
  let displayValue = "";
  let correctAnswer = "";
  let allAnswers = [];

  if (type === "toTrad") {
    questionText = "❓ Que signifie ce nom ?";
    displayValue = current.arabe;
    correctAnswer = current.trad;
    allAnswers = cards.map((c) => c.trad);
  } else if (type === "toArabe") {
    questionText = "❓ Quel est le nom en arabe correspondant ?";
    displayValue = current.trad;
    correctAnswer = current.arabe;
    allAnswers = cards.map((c) => c.arabe);
  } else if (type === "toTranslit") {
    questionText = "❓ Quelle est la translittération de ce nom ?";
    displayValue = current.arabe;
    correctAnswer = current.translit;
    allAnswers = cards.map((c) => c.translit);
  }

  // Mise à jour de l'affichage
  document.getElementById("quiz-question").textContent = questionText;
  document.getElementById("quiz-nom").textContent = displayValue;
  document.getElementById("quiz-feedback").textContent = "";

  // Créer les options
  const options = [correctAnswer];
  while (options.length < 3) {
    const random = allAnswers[Math.floor(Math.random() * allAnswers.length)];
    if (!options.includes(random)) options.push(random);
  }

  // Mélanger et afficher
  const container = document.getElementById("quiz-options");
  container.innerHTML = "";

  options.sort(() => Math.random() - 0.5);
  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option, correctAnswer);
    container.appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  const feedback = document.getElementById("quiz-feedback");
  const buttons = document
    .getElementById("quiz-options")
    .querySelectorAll("button");

  buttons.forEach((btn) => {
    btn.disabled = true;

    if (btn.textContent === correct) {
      btn.classList.add("correct");
    }

    if (btn.textContent === selected && selected !== correct) {
      btn.classList.add("incorrect");
    }
  });

  if (selected === correct) {
    feedback.textContent = "✅ Bonne réponse !";
    feedback.style.color = "green";
    quizScore++;
  } else {
    feedback.textContent = `❌ Mauvaise réponse. C'était : "${correct}"`;
    feedback.style.color = "red";
  }
}

function nextQuizQuestion() {
  quizIndex++;

  if (quizIndex >= shuffledCards.length) {
    const container = document.getElementById("quiz-options");
    const question = document.getElementById("quiz-question");
    const feedback = document.getElementById("quiz-feedback");

    question.textContent = `🎉 Quizz terminé !`;
    container.innerHTML = `<p>Tu as obtenu <strong>${quizScore}</strong> bonne${
      quizScore > 1 ? "s" : ""
    } réponse${quizScore > 1 ? "s" : ""} sur <strong>${
      shuffledCards.length
    }</strong>.</p>`;

    feedback.textContent = "";

    const replayBtn = document.createElement("button");
    replayBtn.textContent = "Rejouer le quizz 🔁";
    replayBtn.onclick = startQuiz;
    container.appendChild(replayBtn);
  } else {
    showQuizQuestion();
  }
}

function exitQuiz() {
  // Cacher le quizz
  document.getElementById("quiz").style.display = "none";

  // Afficher les éléments du mode carte
  document.querySelector(".card-container").style.display = "block";
  document.querySelector(".buttons").style.display = "block";
  document.getElementById("progression").style.display = "block";

  // Réinitialiser la carte actuelle
  updateCardContent();
}

function showCards() {
  // Initialisation
  updateCardContent();
  document.getElementById("quiz").style.display = "none";
  document.querySelector(".card-container").style.display = "block";
  document.querySelector(".buttons").style.display = "block";
  document.getElementById("progression").style.display = "block";

  currentStep = 0;
  updateCardContent();
}

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

  // Masque les autres sections si elles existent
  const cardContainer = document.querySelector(".card-container");
  if (cardContainer) {
    cardContainer.style.display = "none";
  }

  const buttons = document.querySelector(".buttons");
  if (buttons) {
    buttons.style.display = "none";
  }

  const progression = document.getElementById("progression");
  if (progression) {
    progression.style.display = "none";
  }

  const quiz = document.getElementById("quiz");
  if (quiz) {
    quiz.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cards-section")) {
    updateCardContent();
  }

  if (document.getElementById("quiz")) {
    startQuiz();
  }

  if (document.getElementById("all-cards")) {
    showAllCards();
  }
});
