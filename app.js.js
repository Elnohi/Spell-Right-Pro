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
        "Fuzzy", "Injection", "Lunch time", "Hearing loss", "Swallow", "Vocabulary",
        "Vascular", "Eating", "Some sort of food", "Urinalysis", "Deafness",
        "Magazine editor", "Lethargic", "Visual perception", "Heartbeats", "Tightness",
        "Financial problems", "Cut two fingers", "Nausea", "Lung expansion", "Tantrum",
        "Groin area", "Jaundice", "Cirrhosis", "Bilirubin", "Septicemia"
    ],
    IELTS: [
        "confidence", "lethargic", "philosophy", "resilience", "environment",
        "academic", "theory", "hypothesis", "phenomenon", "research"
    ]
};

// App state
let words = [];
let currentWordIndex = 0;
let correctCount = 0;
let currentAccent = 'en-GB';

// Initialize
startBtn.addEventListener("click", startTraining);
examSelect.addEventListener("change", () => {
    startBtn.disabled = !examSelect.value;
});

function startTraining() {
    const exam = examSelect.value;
    if (!exam) return;
    
    words = [...examWordLists[exam]];
    currentWordIndex = 0;
    correctCount = 0;
    scoreDisplay.style.display = "none";
    
    if (words.length === 0) {
        trainerDiv.innerHTML = "<p>No words available for this exam</p>";
        return;
    }
    
    presentWord();
}

function presentWord() {
    if (currentWordIndex >= words.length) {
        showResults();
        return;
    }
    
    const word = words[currentWordIndex];
    trainerDiv.innerHTML = `
        <div>
            <strong>Word ${currentWordIndex + 1} of ${words.length}</strong>
            <div class="controls">
                <button id="speakBtn">🔊 Speak</button>
                <button id="flagBtn">🚩 Flag</button>
            </div>
            <input type="text" id="wordInput" placeholder="Type what you heard...">
            <button id="checkBtn">✔️ Check</button>
            <span id="status" class="status"></span>
        </div>
    `;
    
    document.getElementById("speakBtn").addEventListener("click", () => speak(word));
    document.getElementById("checkBtn").addEventListener("click", checkAnswer);
    document.getElementById("wordInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") checkAnswer();
    });
    
    // Auto-speak the word
    speak(word);
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentAccent;
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Text-to-speech not supported in your browser");
    }
}

function checkAnswer() {
    const input = document.getElementById("wordInput");
    const status = document.getElementById("status");
    const word = words[currentWordIndex];
    const isCorrect = input.value.trim().toLowerCase() === word.toLowerCase();
    
    status.textContent = isCorrect ? "✅ Correct" : `❌ Wrong. Correct: ${word}`;
    status.style.color = isCorrect ? "green" : "red";
    
    if (isCorrect) correctCount++;
    
    setTimeout(() => {
        currentWordIndex++;
        presentWord();
    }, 1500);
}

function showResults() {
    scoreDisplay.style.display = "block";
    scoreDisplay.innerHTML = `
        <h3>Results</h3>
        <p>You got ${correctCount} out of ${words.length} correct!</p>
        <p>Score: ${Math.round((correctCount/words.length)*100)}%</p>
        <button id="restartBtn">Restart Training</button>
    `;
    trainerDiv.innerHTML = "<p>Training complete!</p>";
    
    document.getElementById("restartBtn").addEventListener("click", () => {
        scoreDisplay.style.display = "none";
        startTraining();
    });
}