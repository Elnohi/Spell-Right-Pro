// DOM Elements
const trainerDiv = document.getElementById("trainer");
const scoreDisplay = document.getElementById("scoreDisplay");
const examSelect = document.getElementById("examSelect");
const startBtn = document.getElementById("startBtn");

// Word lists
const examWordLists = {
    OET: [
        "Strawberry tongue", "Irritable", "Washing hair", "Sepsis", "Pneumonia",
        "Diabetes", "Knife and fork", "Scarlet fever", "Bloodshot", "Fingertips",
        "Cracked lips", "Japan", "Epilepsy", "Concentrate", "Booster injection",
        "Febrile convulsion", "Pressure sores", "Physiotherapy", "Events manager",
        "Sticky", "Change dressing", "Chubby", "Judge distance", "Multiple sclerosis",
        "Administrator", "Preventer", "Steroid", "Menstruation", "Car accident",
        "Fuzzy", "Injection", "Lunch time", "Hearing loss", "Swallow", "Vocabulary"
    ],
    IELTS: ['confidence', 'lethargic', 'philosophy', 'resilience', 'environment']
};

// App state
let words = [];
let currentWordIndex = 0;
let correctCount = 0;

// Initialize safely
if (startBtn) {
    startBtn.addEventListener("click", startTrainer);
}

function startTrainer() {
    const exam = examSelect.value;
    if (!exam) {
        alert("Please select an exam first!");
        return;
    }

    words = examWordLists[exam] || [];
    if (words.length === 0) {
        trainerDiv.innerHTML = "<p>No words available for this exam</p>";
        return;
    }

    currentWordIndex = 0;
    correctCount = 0;
    scoreDisplay.textContent = "";
    presentWord();
}

function presentWord() {
    if (currentWordIndex >= words.length) {
        showScore();
        return;
    }

    const word = words[currentWordIndex];
    trainerDiv.innerHTML = `
        <div class="word-box">
            <div><strong>Word ${currentWordIndex + 1} of ${words.length}</strong></div>
            <button id="speakBtn">🔊 Speak</button>
            <input type="text" id="wordInput" placeholder="Type what you heard...">
            <button id="checkBtn">✔️ Check</button>
            <span id="status" class="status"></span>
        </div>
    `;

    // Attach event to check button
    const checkBtn = document.getElementById("checkBtn");
    if (checkBtn) {
        checkBtn.addEventListener("click", checkAnswer);
    }

    // Auto-speak the word
    speak(word);
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Text-to-speech not supported in your browser");
    }
}

function checkAnswer() {
    const input = document.getElementById("wordInput");
    const status = document.getElementById("status");
    const word = words[currentWordIndex];

    if (input.value.trim().toLowerCase() === word.toLowerCase()) {
        status.textContent = "✅ Correct";
        status.style.color = "green";
        correctCount++;
    } else {
        status.textContent = `❌ Wrong. Correct: ${word}`;
        status.style.color = "red";
    }

    setTimeout(() => {
        currentWordIndex++;
        presentWord();
    }, 1500);
}

function showScore() {
    scoreDisplay.innerHTML = `
        <div>You got ${correctCount} out of ${words.length} correct! (${Math.round(correctCount / words.length * 100)}%)</div>
    `;
    trainerDiv.innerHTML = "<p>Training complete! Select an exam to start again.</p>";
}
