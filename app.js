// Sample app.js for Spell Right Pro

let wordList = [];
let currentWordIndex = 0;
let score = 0;

const examSelect = document.getElementById('examSelect');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const startButton = document.getElementById('startButton');
const wordDisplay = document.getElementById('wordDisplay');
const userInput = document.getElementById('userInput');
const checkButton = document.getElementById('checkButton');
const resultDisplay = document.getElementById('result');
const scoreDisplay = document.getElementById('score');

examSelect.addEventListener('change', () => {
    if (examSelect.value === 'none') {
        wordList = [];
        wordDisplay.textContent = '';
        resultDisplay.textContent = '';
        scoreDisplay.textContent = '';
    } else if (examSelect.value === 'oet') {
        wordList = ["Jaundice", "Cirrhosis", "Bilirubin", "Hepatitis", "Septicemia"];
    } else if (examSelect.value === 'ielts') {
        wordList = ["Accommodation", "Environment", "Development", "Technology", "Education"];
    }
});

uploadButton.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const contents = e.target.result;
        wordList = contents.split(/\r?\n/).filter(word => word.trim() !== '');
    };
    reader.readAsText(file);
});

startButton.addEventListener('click', () => {
    if (wordList.length === 0) {
        alert('Please select an exam or upload a word list.');
        return;
    }
    currentWordIndex = 0;
    score = 0;
    scoreDisplay.textContent = '';
    displayWord();
});

checkButton.addEventListener('click', () => {
    const userAnswer = userInput.value.trim();
    if (userAnswer.toLowerCase() === wordList[currentWordIndex].toLowerCase()) {
        resultDisplay.textContent = 'Correct!';
        score++;
    } else {
        resultDisplay.textContent = `Incorrect. Correct spelling: ${wordList[currentWordIndex]}`;
    }
    currentWordIndex++;

    if (currentWordIndex < wordList.length) {
        displayWord();
    } else {
        wordDisplay.textContent = 'Training completed!';
        scoreDisplay.textContent = `Your score: ${score} / ${wordList.length}`;
    }
    userInput.value = '';
    userInput.focus();
});

function displayWord() {
    wordDisplay.textContent = wordList[currentWordIndex];
}
