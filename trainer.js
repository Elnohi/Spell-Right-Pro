import { showNotification, getUserEmail } from './app.js';
import { getWords } from './word-manager.js';

let currentWordIndex = 0;
let correctCount = 0;
let flaggedWords = [];
let incorrectWords = [];
let previousWords = [];
let mode = "";
const storageKey = "spellrightpro-progress";

// Reset training session
export function resetSession() {
  currentWordIndex = 0;
  correctCount = 0;
  flaggedWords = [];
  incorrectWords = [];
  previousWords = [];
  document.getElementById("scoreDisplay").innerHTML = "";
}

// Start practice session
export function startPractice() {
  const words = getWords();
  if (words.length === 0) {
    showNotification("Please load words first", "error");
    return;
  }
  
  mode = "practice";
  resetSession();
  presentWord();
}

// Start test session
export function startTest() {
  const words = getWords();
  if (words.length === 0) {
    showNotification("Please load words first", "error");
    return;
  }
  
  mode = "test";
  setWords(shuffle([...words]).slice(0, 24));
  resetSession();
  presentWord();
}

// Shuffle array
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Speak text
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = document.getElementById("accentSelect").value;
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
}

// Present current word
export function presentWord() {
  const words = getWords();
  const word = words[currentWordIndex];
  const trainer = document.getElementById("trainer");
  trainer.innerHTML = "";

  const box = document.createElement("div");
  box.className = "word-box";
  
  const title = document.createElement("h3");
  title.textContent = `Word ${currentWordIndex + 1} of ${words.length}`;
  
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Type what you heard...";
  input.setAttribute("aria-label", "Spelling input");
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") checkSpelling();
  });
  
  const status = document.createElement("div");
  status.className = "status";

  const checkBtn = document.createElement("button");
  checkBtn.textContent = "Check";
  checkBtn.className = "btn btn-success";
  checkBtn.addEventListener("click", checkSpelling);

  const speakBtn = document.createElement("button");
  speakBtn.innerHTML = '<i class="fas fa-volume-up"></i> Speak';
  speakBtn.className = "btn btn-info";
  speakBtn.addEventListener("click", () => speak(word));

  function checkSpelling() {
    const typed = input.value.trim().toLowerCase();
    const correct = word.toLowerCase();
    previousWords.push(currentWordIndex);
    
    if (typed === correct) {
      status.textContent = "Correct!";
      status.className = "status correct";
      correctCount++;
    } else {
      status.textContent = `Incorrect. It was: ${word}`;
      status.className = "status incorrect";
      incorrectWords.push({ word, typed });
    }
    
    saveProgress();
    setTimeout(advance, 1500);
  }

  function advance() {
    currentWordIndex++;
    if (currentWordIndex < words.length) {
      presentWord();
    } else {
      showScore();
    }
  }

  const flagBtn = document.createElement("button");
  flagBtn.className = flaggedWords.includes(currentWordIndex) ? "btn btn-warning" : "btn";
  flagBtn.innerHTML = flaggedWords.includes(currentWordIndex)
    ? '<i class="fas fa-flag"></i> Unflag'
    : '<i class="far fa-flag"></i> Flag';
  flagBtn.addEventListener("click", () => {
    const index = flaggedWords.indexOf(currentWordIndex);
    if (index === -1) {
      flaggedWords.push(currentWordIndex);
    } else {
      flaggedWords.splice(index, 1);
    }
    presentWord();
  });

  const backBtn = document.createElement("button");
  backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
  backBtn.className = "btn";
  backBtn.disabled = previousWords.length === 0;
  backBtn.addEventListener("click", () => {
    if (previousWords.length > 0) {
      currentWordIndex = previousWords.pop();
      presentWord();
    }
  });

  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Next';
  nextBtn.className = "btn";
  nextBtn.addEventListener("click", () => {
    previousWords.push(currentWordIndex);
    currentWordIndex++;
    if (currentWordIndex < words.length) presentWord();
    else showScore();
  });

  const controls = document.createElement("div");
  controls.className = "controls";
  controls.append(flagBtn, backBtn, nextBtn);

  box.append(title, speakBtn, input, checkBtn, status, controls);
  trainer.appendChild(box);
  setTimeout(() => speak(word), 500);
  input.focus();
}

// Show final score
function showScore() {
  const words = getWords();
  const percent = Math.round((correctCount / words.length) * 100);
  let html = `<div class="card"><h2>Test Complete</h2><p>You scored ${correctCount} out of ${words.length} (${percent}%)</p>`;
  
  if (incorrectWords.length > 0) {
    html += `<h3>Incorrect Words</h3><ul>`;
    incorrectWords.forEach(w => {
      html += `<li><strong>${w.word}</strong> — You typed: <em>${w.typed}</em></li>`;
    });
    html += `</ul>`;
  }
  
  if (flaggedWords.length > 0) {
    html += `<h3>Flagged Words</h3><ul>`;
    flaggedWords.forEach(i => {
      html += `<li>${words[i]}</li>`;
    });
    html += `</ul>`;
  }
  
  html += `<button onclick="location.reload()" class="btn btn-info"><i class="fas fa-redo"></i> Start New Session</button></div>`;
  
  document.getElementById("scoreDisplay").innerHTML = html;
  localStorage.removeItem(storageKey);
}

// Save progress to localStorage
function saveProgress() {
  if (mode === "practice") {
    localStorage.setItem(storageKey, JSON.stringify({
      words: getWords(),
      currentWordIndex,
      correctCount,
      flaggedWords,
      incorrectWords,
      previousWords
    }));
  }
}

// Load progress from localStorage
function loadProgress() {
  const saved = localStorage.getItem(storageKey);
  if (saved && mode === "practice") {
    const progress = JSON.parse(saved);
    currentWordIndex = progress.currentWordIndex || 0;
    correctCount = progress.correctCount || 0;
    flaggedWords = progress.flaggedWords || [];
    incorrectWords = progress.incorrectWords || [];
    previousWords = progress.previousWords || [];
  }
}

// Initialize trainer listeners
export function initTrainerListeners() {
  document.getElementById("practiceBtn").addEventListener("click", startPractice);
  document.getElementById("testBtn").addEventListener("click", startTest);
  
  // Load progress if any
  window.addEventListener("load", () => {
    if (mode === "practice") {
      loadProgress();
    }
  });
}
