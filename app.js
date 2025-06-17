// DOM Elements
const trainerDiv = document.getElementById("trainer");
const scoreDisplay = document.getElementById("scoreDisplay");
const startBtn = document.getElementById("startBtn");
const loginBtn = document.getElementById("loginBtn");
const accentSelect = document.getElementById("accentSelect");
const examSelect = document.getElementById("examSelect");
const wordInput = document.getElementById("wordInput");
const phraseToggle = document.getElementById("phraseToggle");
const addWordsBtn = document.getElementById("addWordsBtn");
const fileUpload = document.getElementById("fileUpload");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const clearBtn = document.getElementById("clearBtn");
const userEmail = document.getElementById("userEmail");
const loginStatus = document.getElementById("loginStatus");

// Word lists and app state
let words = [];
let currentAccent = 'en-GB';
let currentWordIndex = 0;
let correctCount = 0;
let flaggedWords = [];
let incorrectWords = [];
let previousWords = [];
let isReviewMode = false;

const examWordLists = {
  OET: [
    // Priority words
    "Jaundice", "Cirrhosis", "Dark", "Bilirubin", "Septicemia",
    "Prostatic cancer", "Bring up", "Work", "Constipation", "Hepatitis",
    "Exercise", "Stiff", "Abdominal cramps", "Vegetarian", "Stress",
    "Graphic designer", "Down syndrome", "Blurred vision", "Alcohol",
    "Cognitive behaviour", "Tennis ball", "Spasm", "Surveyor",
    "Crowded places", "Pneumonia",
    
    // Additional OET words
    "Asking", "Nausea", "Indigestion", "Full blood count", "Cloudy",
    "Cold compress", "Lethargic", "Confidence", "Popping", "Clicking",
    "Heel", "Osteoarthritis", "Deep vein thrombosis", "Atrial fibrillation",
    "Swollen", "Yoga", "Aerobic exercises", "Physiotherapy session", "Calf",
    "Calves", "Crutches", "Translator", "Mouth ulcers", "Infection",
    "Compartment syndrome", "Painkillers", "Antisocial", "Chills",
    "Fingertips", "B12 deficiency", "Angina", "Rib cage", "Swallowing",
    "Drained", "Confusion", "Shivering", "Stinging", "Bloating",
    "Tonsillectomy", "Potassium level", "Overactive thyroid", "Gymnastics",
    "Anaemia", "Indoor exercises", "Tongue-tie", "Crusty mucus",
    "Dyspepsia", "Crowded places", "White crusts", "Antihistamine",
    "Breathless", "Infertile", "Night sweats", "Sticky", "Strangulation",
    "Lying flat", "Surveyor", "Clockwise", "Left calf", "Punctured lung",
    "Social gatherings", "Tinnitus", "Vomited", "Injection",
    "Hearing loss", "Stomach", "Groin", "Gastric bypass", "Concentration",
    "Fluid retention", "Wheeze", "Murmur", "Endoscopy", "Physiotherapist",
    "Breathing difficulty", "Heart failure", "Stroke", "Seizures", "Fracture",
    "Abdominal pain", "Urinary retention", "Chest infection", "Asthma",
    "Hypertension", "Diabetes", "Thyroid problem", "Kidney disease",
    "Liver disease", "Gallstones", "Coughing blood", "Blood in urine",
    "Swelling in legs", "Palpitations", "Syncope", "Sudden weight loss",
    "Sudden weight gain", "Dizziness", "Vertigo", "Fatigue", "Loss of appetite",
    "Vomiting blood", "Dark stools", "Difficulty swallowing", "Persistent cough",
    "Fever", "Night chills", "Weight loss", "Pain during urination",
    "Shortness of breath", "Wheezing", "Joint pain", "Back pain", "Neck pain",
    "Shoulder pain", "Hip pain", "Knee pain", "Ankle pain", "Foot pain",
    "Hand pain", "Elbow pain", "Wrist pain", "Chest pain", "Lower abdominal pain",
    "Upper abdominal pain", "Diarrhoea", "Constipation", "Bloating", "Heartburn",
    "Nausea and vomiting", "Jaundice", "Frequent urination", "Urgency",
    "Incontinence", "Painful urination", "Blood in stool", "Change in bowel habits",
    "Skin rash", "Itching", "Bruising", "Bleeding", "Numbness", "Tingling",
    "Muscle weakness", "Memory loss", "Speech difficulties", "Vision problems",
    "Hearing problems", "Balance problems", "Depression", "Anxiety", "Sleep disturbances"
  ],
  IELTS: ['confidence', 'lethargic', 'philosophy', 'resilience', 'environment'],
  TOEFL: ['academic', 'theory', 'hypothesis', 'phenomenon', 'research']
};

// Initialize the app
document.addEventListener("DOMContentLoaded", function() {
  // Set up event listeners
  loginBtn.addEventListener("click", loginUser);
  accentSelect.addEventListener("change", changeAccent);
  examSelect.addEventListener("change", loadExamWords);
  startBtn.addEventListener("click", startTrainer);
  addWordsBtn.addEventListener("click", addCustomWords);
  fileUpload.addEventListener("change", handleFileUpload);
  saveBtn.addEventListener("click", saveWordList);
  loadBtn.addEventListener("click", loadWordList);
  clearBtn.addEventListener("click", clearWordList);
  
  // Initialize UI
  trainerDiv.innerHTML = '<p>Select an exam and click "Start Training"</p>';
  startBtn.disabled = true;
});

function loginUser() {
  const email = userEmail.value.trim();
  if (email) {
    loginStatus.textContent = `Logged in as ${email}`;
    loginStatus.style.color = "green";
  } else {
    loginStatus.textContent = "Please enter a valid email";
    loginStatus.style.color = "red";
  }
}

function changeAccent() {
  currentAccent = accentSelect.value;
}

function loadExamWords() {
  const exam = examSelect.value;
  if (exam && examWordLists[exam]) {
    words = [...examWordLists[exam]];
    startBtn.disabled = false;
    trainerDiv.innerHTML = `<p>Loaded ${words.length} words for ${exam}. Click "Start Training" to begin.</p>`;
  } else {
    words = [];
    startBtn.disabled = true;
    trainerDiv.innerHTML = '<p>Select an exam to begin</p>';
  }
}

function startTrainer() {
  if (words.length === 0) {
    alert("Please select an exam first!");
    return;
  }
  
  currentWordIndex = 0;
  correctCount = 0;
  incorrectWords = [];
  previousWords = [];
  flaggedWords = [];
  isReviewMode = false;
  scoreDisplay.textContent = '';
  presentWord();
}

function presentWord() {
  trainerDiv.innerHTML = '';
  const word = words[currentWordIndex];

  const box = document.createElement("div");
  box.className = "word-box";
  if (flaggedWords.includes(currentWordIndex)) {
    box.classList.add("flagged");
  }

  const title = document.createElement("div");
  title.innerHTML = `<strong>Word ${currentWordIndex + 1} of ${words.length}</strong>`;

  const speakBtn = document.createElement("button");
  speakBtn.textContent = "🔊 Speak";
  speakBtn.addEventListener("click", () => speak(word));

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Type what you heard...";
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkAnswer(input, word);
  });

  const checkBtn = document.createElement("button");
  checkBtn.textContent = "✔️ Check";
  checkBtn.addEventListener("click", () => checkAnswer(input, word));

  const flagBtn = document.createElement("button");
  flagBtn.textContent = flaggedWords.includes(currentWordIndex) ? "🚩 Unflag" : "🚩 Flag";
  flagBtn.addEventListener("click", () => {
    const index = flaggedWords.indexOf(currentWordIndex);
    if (index === -1) {
      flaggedWords.push(currentWordIndex);
      flagBtn.textContent = "🚩 Unflag";
      box.classList.add("flagged");
    } else {
      flaggedWords.splice(index, 1);
      flagBtn.textContent = "🚩 Flag";
      box.classList.remove("flagged");
    }
  });

  const backBtn = document.createElement("button");
  backBtn.textContent = "↩️ Back";
  backBtn.disabled = previousWords.length === 0;
  backBtn.addEventListener("click", () => {
    if (previousWords.length > 0) {
      currentWordIndex = previousWords.pop();
      presentWord();
    }
  });

  const status = document.createElement("span");
  status.className = "status";

  box.appendChild(title);
  box.appendChild(speakBtn);
  box.appendChild(document.createElement("br"));
  box.appendChild(input);
  box.appendChild(checkBtn);
  box.appendChild(flagBtn);
  
  const controlsDiv = document.createElement("div");
  controlsDiv.className = "controls";
  controlsDiv.appendChild(backBtn);
  box.appendChild(controlsDiv);
  
  box.appendChild(status);
  trainerDiv.appendChild(box);
  
  // Auto-speak the word
  speak(word);
}

function checkAnswer(input, word) {
  const typed = input.value.trim().toLowerCase();
  const expected = word.toLowerCase();
  const status = document.querySelector(".status");
  
  previousWords.push(currentWordIndex);

  if (typed === expected) {
    status.textContent = "✅ Correct";
    status.style.color = "green";
    correctCount++;
  } else {
    status.textContent = `❌ Wrong. Correct: ${word}`;
    status.style.color = "red";
    incorrectWords.push({
      word: word,
      typed: typed
    });
  }

  setTimeout(() => {
    currentWordIndex++;
    if (currentWordIndex < words.length) {
      presentWord();
    } else {
      showScore();
    }
  }, 1500);
}

function showScore() {
  scoreDisplay.innerHTML = `
    <div>You got ${correctCount} out of ${words.length} correct! (${Math.round(correctCount/words.length*100)}%)</div>
  `;

  if (incorrectWords.length > 0) {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review-section";
    reviewDiv.innerHTML = "<h3>Words to Review:</h3>";
    
    incorrectWords.forEach(item => {
      const reviewItem = document.createElement("div");
      reviewItem.className = "review-item";
      reviewItem.textContent = `You wrote "${item.typed}" instead of "${item.word}"`;
      reviewDiv.appendChild(reviewItem);
    });

    const retryBtn = document.createElement("button");
    retryBtn.textContent = "🔄 Retry Incorrect Words";
    retryBtn.addEventListener("click", () => {
      words = incorrectWords.map(item => item.word);
      incorrectWords = [];
      correctCount = 0;
      currentWordIndex = 0;
      previousWords = [];
      isReviewMode = true;
      scoreDisplay.innerHTML = "";
      presentWord();
    });
    reviewDiv.appendChild(retryBtn);

    scoreDisplay.appendChild(reviewDiv);
  }

  if (flaggedWords.length > 0) {
    const flaggedDiv = document.createElement("div");
    flaggedDiv.className = "review-section";
    flaggedDiv.style.backgroundColor = "#fff3cd";
    flaggedDiv.innerHTML = "<h3>Flagged Words:</h3>";
    
    flaggedWords.forEach(index => {
      const flaggedItem = document.createElement("div");
      flaggedItem.className = "review-item";
      flaggedItem.textContent = words[index];
      flaggedDiv.appendChild(flaggedItem);
    });

    const practiceFlaggedBtn = document.createElement("button");
    practiceFlaggedBtn.textContent = "🔖 Practice Flagged Words";
    practiceFlaggedBtn.addEventListener("click", () => {
      words = flaggedWords.map(index => words[index]);
      incorrectWords = [];
      correctCount = 0;
      currentWordIndex = 0;
      previousWords = [];
      isReviewMode = true;
      scoreDisplay.innerHTML = "";
      presentWord();
    });
    flaggedDiv.appendChild(practiceFlaggedBtn);

    scoreDisplay.appendChild(flaggedDiv);
  }
}

function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentAccent;
    speechSynthesis.speak(utterance);
  } else {
    alert("Text-to-speech not supported in your browser");
  }
}

function addCustomWords() {
  const input = wordInput.value.trim();
  const asPhrases = phraseToggle.checked;
  if (!input) return;

  let newWords = [];
  if (asPhrases) {
    newWords = input.split(/[\n,\/\-]+/).map(w => w.trim()).filter(Boolean);
  } else {
    newWords = input
      .split(/[\n,\/\-]+|\s{2,}/g)
      .flatMap(phrase => phrase.trim().split(/\s+/))
      .filter(Boolean);
  }

  words = newWords;
  wordInput.value = "";
  startTrainer();
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  const asPhrases = phraseToggle.checked;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    let newWords = [];

    if (asPhrases) {
      newWords = content.split(/[\n,\/\-]+/).map(w => w.trim()).filter(Boolean);
    } else {
      newWords = content
        .split(/[\n,\/\-]+|\s{2,}/g)
        .flatMap(phrase => phrase.trim().split(/\s+/))
        .filter(Boolean);
    }

    words = newWords;
    startTrainer();
  };
  reader.readAsText(file);
}

function saveWordList() {
  const email = userEmail.value.trim();
  if (!email) {
    alert("Please login with your email to save.");
    return;
  }
  
  localStorage.setItem(`spellright-list-${email}`, JSON.stringify(words));
  alert("Word list saved!");
}

function loadWordList() {
  const email = userEmail.value.trim();
  if (!email) {
    alert("Please login with your email to load.");
    return;
  }
  
  const saved = localStorage.getItem(`spellright-list-${email}`);
  if (saved) {
    words = JSON.parse(saved);
    startTrainer();
    alert("Word list loaded!");
  } else {
    alert("No saved list found for this email.");
  }
}

function clearWordList() {
  if (confirm("Are you sure you want to clear all words?")) {
    words = [];
    trainerDiv.innerHTML = '<p>Word list cleared. Add new words or select an exam.</p>';
    scoreDisplay.textContent = '';
  }
}
