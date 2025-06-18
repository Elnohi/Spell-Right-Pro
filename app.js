document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const examSelect = document.getElementById('examSelect');
    const startBtn = document.getElementById('startBtn');
    const trainerDiv = document.getElementById('trainer');
    const resultsDiv = document.getElementById('results');
    const wordCountSpan = document.getElementById('wordCount');
    const totalWordsSpan = document.getElementById('totalWords');
    const speakBtn = document.getElementById('speakBtn');
    const flagBtn = document.getElementById('flagBtn');
    const wordInput = document.getElementById('wordInput');
    const checkBtn = document.getElementById('checkBtn');
    const statusDiv = document.getElementById('status');
    const scoreSpan = document.getElementById('score');
    const restartBtn = document.getElementById('restartBtn');

    // Word lists
    const wordLists = {
        OET: [
            "Strawberry tongue", "Irritable", "Sepsis", "Pneumonia", "Diabetes",
            "Scarlet fever", "Bloodshot", "Fingertips", "Cracked lips", "Epilepsy",
            "Booster injection", "Febrile convulsion", "Physiotherapy", "Multiple sclerosis",
            "Steroid", "Hearing loss", "Nausea", "Lethargic", "Jaundice", "Cirrhosis"
        ],
        IELTS: [
            "confidence", "lethargic", "philosophy", "resilience", "environment",
            "academic", "theory", "hypothesis", "phenomenon", "research"
        ]
    };

    // App state
    let currentWords = [];
    let currentIndex = 0;
    let score = 0;
    let flaggedWords = [];

    // Event listeners
    examSelect.addEventListener('change', function() {
        startBtn.disabled = !this.value;
    });

    startBtn.addEventListener('click', startTraining);
    speakBtn.addEventListener('click', speakCurrentWord);
    checkBtn.addEventListener('click', checkAnswer);
    wordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkAnswer();
    });
    restartBtn.addEventListener('click', resetApp);

    // Functions
    function startTraining() {
        currentWords = [...wordLists[examSelect.value]];
        currentIndex = 0;
        score = 0;
        flaggedWords = [];
        
        if (currentWords.length === 0) {
            alert('No words available for this exam!');
            return;
        }

        trainerDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
        updateWordDisplay();
        speakCurrentWord();
    }

    function updateWordDisplay() {
        wordCountSpan.textContent = currentIndex + 1;
        totalWordsSpan.textContent = currentWords.length;
        wordInput.value = '';
        statusDiv.textContent = '';
        statusDiv.className = 'status';
    }

    function speakCurrentWord() {
        if (!('speechSynthesis' in window)) {
            statusDiv.textContent = 'Speech not supported in your browser';
            statusDiv.className = 'status incorrect';
            return;
        }

        const utterance = new SpeechSynthesisUtterance(currentWords[currentIndex]);
        utterance.lang = 'en-GB';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }

    function checkAnswer() {
        const correctWord = currentWords[currentIndex];
        const userAnswer = wordInput.value.trim();
        const isCorrect = userAnswer.toLowerCase() === correctWord.toLowerCase();

        if (isCorrect) {
            statusDiv.textContent = '✓ Correct!';
            statusDiv.className = 'status correct';
            score++;
        } else {
            statusDiv.textContent = `✗ Incorrect. The correct spelling is: ${correctWord}`;
            statusDiv.className = 'status incorrect';
        }

        setTimeout(() => {
            currentIndex++;
            if (currentIndex < currentWords.length) {
                updateWordDisplay();
                speakCurrentWord();
            } else {
                showResults();
            }
        }, 1500);
    }

    function showResults() {
        trainerDiv.style.display = 'none';
        resultsDiv.style.display = 'block';
        const percentage = Math.round((score / currentWords.length) * 100);
        scoreSpan.textContent = percentage;
    }

    function resetApp() {
        trainerDiv.style.display = 'none';
        resultsDiv.style.display = 'none';
        examSelect.value = '';
        startBtn.disabled = true;
    }
});
