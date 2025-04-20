let cards = [];
let quizIndex = 0;
let quizScore = 0;
let shuffledCards = [];

// Charger les données
fetch("../noms.json")
  .then((response) => response.json())
  .then((data) => {
    cards = data;
    startQuiz();
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des données :", error)
  );

function startQuiz() {
  // Réinitialisation
  quizIndex = 0;
  quizScore = 0;
  shuffledCards = [...cards].sort(() => Math.random() - 0.5);

  showQuizQuestion();
}

function showQuizQuestion() {
  const current = shuffledCards[quizIndex];

  // Tirage du type de question
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

  // Affichage
  document.getElementById("quiz-question").textContent = questionText;
  document.getElementById("quiz-nom").textContent = displayValue;
  document.getElementById("quiz-feedback").textContent = "";

  // Options
  const options = [correctAnswer];
  while (options.length < 3) {
    const rand = allAnswers[Math.floor(Math.random() * allAnswers.length)];
    if (!options.includes(rand)) options.push(rand);
  }

  // Mélange et affichage des boutons
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
  window.location.href = "../cartes/cartes.html"; // Redirige vers la page des cartes
}
