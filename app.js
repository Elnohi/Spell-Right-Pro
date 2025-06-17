// Full OET word list (preloaded)
let words = [
  "Strawberry tongue", "Irritable", "Washing hair", "Sepsis", "Pneumonia", "Diabetes", "Knife and fork", "Scarlet fever", "Bloodshot",
  "Fingertips", "Cracked lips", "Japan", "Epilepsy", "Concentrate", "Booster injection", "Febrile convulsion", "Febrile convulsions",
  "Pressure sores", "Physiotherapy", "Events manager", "Sticky", "Change dressing", "Chubby", "Judge distance", "Multiple sclerosis",
  "Administrator", "Preventer", "Steroid", "Menstruation", "Car accident", "Fuzzy", "Injection", "Lunch time", "Hearing loss",
  "Swallow", "Vocabulary", "Vascular", "Eating", "Some sort of food", "Urinalysis", "Deafness", "Magazine editor", "Lethargic",
  "Visual perception", "Heartbeats", "Tightness", "Financial problems", "Cut two fingers", "Nausea", "Lung expansion", "Tantrum",
  "Groin area",

  // Existing words continue here
  "Asking", "Nausea", "Indigestion", "Full blood count", "Cloudy", "Cold compress", "Lethargic", "Confidence", "Popping", "Clicking", "Heel",
  "Osteoarthritis", "Deep vein thrombosis", "Atrial fibrillation", "Swollen", "Yoga", "Aerobic exercises", "Physiotherapy session", "Calf",
  "Calves", "Crutches", "Translator", "Mouth ulcers", "Infection", "Compartment syndrome", "Painkillers", "Antisocial", "Chills",
  "Fingertips", "B12 deficiency", "Angina", "Rib cage", "Swallowing", "Drained", "Confusion", "Shivering", "Stinging", "Bloating",
  "Tonsillectomy", "Potassium level", "Overactive thyroid", "Gymnastics", "Anaemia", "Indoor exercises", "Tongue-tie", "Crusty mucus",
  "Dyspepsia", "Crowded places", "White crusts", "Antihistamine", "Breathless", "Infertile", "Night sweats", "Sticky", "Strangulation",
  "Lying flat", "Surveyor", "Clockwise", "Left calf", "Punctured lung", "Social gatherings", "Tinnitus", "Vomited", "Injection",
  "Hearing loss", "Stomach", "Groin", "Gastric bypass", "Confidence", "Concentration", "Fluid retention", "Wheeze", "Murmur",
  "Endoscopy", "Physiotherapist", "Breathing difficulty", "Heart failure", "Stroke", "Seizures", "Fracture", "Abdominal pain",
  "Urinary retention", "Chest infection", "Asthma", "Hypertension", "Diabetes", "Thyroid problem", "Kidney disease", "Liver disease",
  "Gallstones", "Coughing blood", "Blood in urine", "Swelling in legs", "Palpitations", "Syncope", "Sudden weight loss", "Sudden weight gain",
  "Dizziness", "Vertigo", "Fatigue", "Loss of appetite", "Vomiting blood", "Dark stools", "Difficulty swallowing", "Persistent cough",
  "Fever", "Night chills", "Weight loss", "Pain during urination", "Shortness of breath", "Wheezing", "Joint pain", "Back pain",
  "Neck pain", "Shoulder pain", "Hip pain", "Knee pain", "Ankle pain", "Foot pain", "Hand pain", "Elbow pain", "Wrist pain",
  "Chest pain", "Lower abdominal pain", "Upper abdominal pain", "Diarrhoea", "Constipation", "Bloating", "Heartburn", "Nausea and vomiting",
  "Jaundice", "Frequent urination", "Urgency", "Incontinence", "Painful urination", "Blood in stool", "Change in bowel habits", "Skin rash",
  "Itching", "Bruising", "Bleeding", "Numbness", "Tingling", "Muscle weakness", "Memory loss", "Speech difficulties", "Vision problems",
  "Hearing problems", "Balance problems", "Depression", "Anxiety", "Sleep disturbances"
];

let userEmail = "";
let currentAccent = 'en-GB';
let currentWordIndex = 0;
let correctCount = 0;

const examWordLists = {
  OET: words,
  IELTS: ['confidence', 'lethargic', 'philosophy', 'resilience', 'environment'],
  TOEFL: ['academic', 'theory', 'hypothesis', 'phenomenon', 'research']
};

document.addEventListener("DOMContentLoaded", function () {
  trainerDiv = document.getElementById("trainer");
  scoreDisplay = document.getElementById("scoreDisplay");
  startTrainer();
});

function loginUser() {
  userEmail = document.getElementById("userEmail").value.trim();
  document.getElementById("loginStatus").textContent = userEmail ? `Logged in as ${userEmail}` : '';
}

function changeAccent() {
  currentAccent = document.getElementById("accentSelect").value;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentAccent;
  speechSynthesis.speak(utterance);
}

function startTrainer() {
  trainerDiv.innerHTML = '';
  if (words.length === 0) return;
  currentWordIndex = 0;
  correctCount = 0;
  scoreDisplay.textContent = '';
  presentWord();
}

function presentWord() {
  trainerDiv.innerHTML = '';
  const word = words[currentWordIndex];

  const box = document.createElement("div");
  box.className = "word-box";

  const title = document.createElement("div");
  title.innerHTML = `<strong>Word ${currentWordIndex + 1} of ${words.length}</strong>`;

  const speakBtn = document.createElement("button");
  speakBtn.textContent = "🔊 Speak";
  speakBtn.onclick = () => speak(word);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Type what you heard...";

  const checkBtn = document.createElement("button");
  checkBtn.textContent = "✔️ Check";

  const status = document.createElement("span");
  status.className = "status";

  checkBtn.onclick = () => {
    const typed = input.value.trim().toLowerCase();
    const expected = word.toLowerCase();

    if (typed === expected) {
      status.textContent = "✅ Correct";
      status.style.color = "green";
      correctCount++;
    } else {
      status.textContent = `❌ Wrong. Correct: ${word}`;
      status.style.color = "red";
    }

    setTimeout(() => {
      currentWordIndex++;
      if (currentWordIndex < words.length) {
        presentWord();
      } else {
        showScore();
      }
    }, 1500);
  };

  box.appendChild(title);
  box.appendChild(speakBtn);
  box.appendChild(input);
  box.appendChild(checkBtn);
  box.appendChild(status);

  trainerDiv.appendChild(box);
  speak(word);
}

function showScore() {
  scoreDisplay.textContent = `You got ${correctCount} out of ${words.length} correct!`;
}

function addCustomWords() {
  const input = document.getElementById("wordInput").value.trim();
  const asPhrases = document.getElementById("phraseToggle").checked;
  if (!input) return;

  let newWords = [];
  if (asPhrases) {
    newWords = input.split(/[
,\/\-]+/).map(w => w.trim()).filter(Boolean);
  } else {
    newWords = input
      .split(/[
,\/\-]+|\s{2,}/g)
      .flatMap(phrase => phrase.trim().split(/\s+/))
      .filter(Boolean);
  }

  words = newWords;
  document.getElementById("wordInput").value = "";
  startTrainer();
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  const asPhrases = document.getElementById("phraseToggle").checked;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    let newWords = [];

    if (asPhrases) {
      newWords = content.split(/[
,\/\-]+/).map(w => w.trim()).filter(Boolean);
    } else {
      newWords = content
        .split(/[
,\/\-]+|\s{2,}/g)
        .flatMap(phrase => phrase.trim().split(/\s+/))
        .filter(Boolean);
    }

    words = newWords;
    startTrainer();
  };
  reader.readAsText(file);
}

function suggestWords() {
  const exam = document.getElementById('examSelect').value;
  if (exam && examWordLists[exam]) {
    words = examWordLists[exam];
    startTrainer();
  }
}

function saveWordList() {
  if (!userEmail) return alert("Login with your email to save.");
  localStorage.setItem("spellright-list-" + userEmail, JSON.stringify(words));
  alert("Saved!");
}

function loadWordList() {
  if (!userEmail) return alert("Login with your email to load.");
  const saved = localStorage.getItem("spellright-list-" + userEmail);
  if (saved) {
    words = JSON.parse(saved);
    startTrainer();
    alert("Loaded!");
  } else {
    alert("No list found for this email.");
  }
}

function clearWordList() {
  words = [];
  trainerDiv.innerHTML = '';
  scoreDisplay.textContent = '';
}
