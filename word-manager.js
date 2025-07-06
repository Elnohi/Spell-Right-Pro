import { db } from './firebase-config.js';
import { showNotification, getUserEmail } from './app.js';
import { resetSession } from './trainer.js';

let words = [];

// Save words to Firestore
export function saveWordList() {
  const email = getUserEmail();
  if (!email) {
    showNotification("Login first", "error");
    return;
  }

  if (words.length === 0) {
    showNotification("No words to save", "error");
    return;
  }

  db.collection("wordLists").doc(email).set({ words })
    .then(() => showNotification("Words saved to cloud!", "success"))
    .catch(err => showNotification("Failed to save words: " + err.message, "error"));
}

// Load words from Firestore
export function loadWordList() {
  const email = getUserEmail();
  if (!email) {
    showNotification("Login first", "error");
    return;
  }

  db.collection("wordLists").doc(email).get()
    .then(doc => {
      if (doc.exists) {
        words = doc.data().words || [];
        resetSession();
        showNotification("Words loaded from cloud!", "success");
      } else {
        showNotification("No saved list found in cloud", "info");
      }
    })
    .catch(err => showNotification("Error loading words: " + err.message, "error"));
}

// Clear word list
export function clearWordList() {
  if (words.length === 0 || confirm("Are you sure you want to clear the word list?")) {
    words = [];
    resetSession();
    showNotification("Word list cleared", "success");
  }
}

// Add custom words
export function addCustomWords() {
  const input = document.getElementById("wordInput").value.trim();
  if (!input) {
    showNotification("Enter some words", "error");
    return;
  }

  words = input.split(/[\n,]+/)
    .map(w => w.trim())
    .filter(w => w.length > 0);
  
  document.getElementById("wordInput").value = "";
  resetSession();
  showNotification(`${words.length} custom words added!`, "success");
}

// Handle file upload
export async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const ext = file.name.split(".").pop().toLowerCase();
  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      let text = "";
      
      if (ext === "txt") {
        text = e.target.result;
      } else if (ext === "pdf") {
        const pdf = await pdfjsLib.getDocument(e.target.result).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(" ") + "\n";
        }
      } else if (ext === "docx") {
        const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
        text = result.value;
      } else {
        showNotification("Unsupported file type", "error");
        return;
      }

      words = text.split(/[\n,]+/)
        .map(w => w.trim())
        .filter(w => w.length > 0);
      
      resetSession();
      showNotification(`${words.length} words loaded from file!`, "success");
    } catch (error) {
      showNotification("Error processing file: " + error.message, "error");
    }
  };

  if (ext === "pdf" || ext === "docx") {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }
}

// Get current word list
export function getWords() {
  return words;
}

// Set word list (for exam selection)
export function setWords(newWords) {
  words = [...newWords];
  resetSession();
}

// Track built-in list usage
function trackBuiltInList(listName) {
  if (typeof gtag === 'function') {
    gtag('event', 'use_built_in_list', {
      'event_category': 'Word Source',
      'event_label': listName,
    });
  }
}

// Initialize word manager listeners
export function initWordManagerListeners() {
  document.getElementById("saveWordsBtn").addEventListener("click", saveWordList);
  document.getElementById("loadWordsBtn").addEventListener("click", loadWordList);
  document.getElementById("clearWordsBtn").addEventListener("click", clearWordList);
  document.getElementById("addWordsBtn").addEventListener("click", addCustomWords);
  document.getElementById("fileInput").addEventListener("change", handleFileUpload);
  
  document.getElementById("examSelect").addEventListener("change", (e) => {
    switch(e.target.value) {
      case "OET":
        setWords(window.oetWordList || []);
        trackBuiltInList("OET");
        showNotification("OET word list loaded!", "success");
        break;
      case "IELTS":
        setWords(window.ieltsWordList || []);
        trackBuiltInList("IELTS");
        showNotification("IELTS word list loaded!", "success");
        break;
      default:
        setWords([]);
        showNotification("Word list cleared", "info");
    }
  });
}
