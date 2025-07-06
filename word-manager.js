// Word Manager Module
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';

// Initialize Firebase (if not already done elsewhere)
const auth = getAuth();
const db = getFirestore();

let words = [];

// Utility function to validate words
function sanitizeWords(wordArray) {
  return wordArray.map(w => w.trim().replace(/[<>]/g, '')).filter(Boolean);
}

async function saveWordList() {
  try {
    if (!auth.currentUser) {
      showNotification("Please login first to save words", "error");
      return;
    }

    const userEmail = auth.currentUser.email;
    await setDoc(doc(db, "wordLists", userEmail), { words });
    showNotification("Words saved to cloud!", "success");
  } catch (err) {
    console.error("Save error:", err);
    showNotification("Failed to save words. Please try again later.", "error");
  }
}

async function loadWordList() {
  try {
    if (!auth.currentUser) {
      showNotification("Please login first to load words", "error");
      return;
    }

    const userEmail = auth.currentUser.email;
    const docSnap = await getDoc(doc(db, "wordLists", userEmail));
    
    if (docSnap.exists()) {
      words = docSnap.data().words || [];
      showNotification(`Loaded ${words.length} words from cloud!`, "success");
    } else {
      showNotification("No saved word list found", "info");
    }
  } catch (err) {
    console.error("Load error:", err);
    showNotification("Error loading words. Please check your connection.", "error");
  }
}

function clearWordList() {
  if (confirm("Are you sure you want to clear all words?")) {
    words = [];
    showNotification("Word list cleared", "success");
  }
}

function addCustomWords() {
  const input = document.getElementById("wordInput").value.trim();
  if (!input) {
    showNotification("Please enter some words first", "error");
    return;
  }

  words = sanitizeWords(input.split(/[\n,]+/));
  document.getElementById("wordInput").value = "";
  showNotification(`${words.length} words added!`, "success");
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  const ext = file.name.split('.').pop().toLowerCase();

  if (!['txt', 'pdf', 'docx'].includes(ext)) {
    showNotification("Only TXT, PDF, and DOCX files are supported", "error");
    return;
  }

  try {
    const text = await new Promise((resolve, reject) => {
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;

      if (ext === 'pdf' || ext === 'docx') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });

    let extractedText = '';
    
    if (ext === 'txt') {
      extractedText = text;
    } else if (ext === 'pdf') {
      const pdf = await pdfjsLib.getDocument(text).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        extractedText += content.items.map(item => item.str).join(' ') + '\n';
      }
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ arrayBuffer: text });
      extractedText = result.value;
    }

    words = sanitizeWords(extractedText.split(/[\n,]+/));
    showNotification(`${words.length} words loaded from file!`, "success");
  } catch (error) {
    console.error("File processing error:", error);
    showNotification(`Failed to process file: ${error.message}`, "error");
  } finally {
    // Reset file input
    event.target.value = '';
  }
}

function initWordManager() {
  // Event Listeners
  document.getElementById("saveWordsBtn")?.addEventListener("click", saveWordList);
  document.getElementById("loadWordsBtn")?.addEventListener("click", loadWordList);
  document.getElementById("clearWordsBtn")?.addEventListener("click", clearWordList);
  document.getElementById("addWordsBtn")?.addEventListener("click", addCustomWords);
  document.getElementById("fileInput")?.addEventListener("change", handleFileUpload);

  // Exam Selection
  document.getElementById("examSelect")?.addEventListener("change", function() {
    if (this.value === "OET" && window.oetWordList) {
      words = [...window.oetWordList];
      showNotification(`Loaded ${words.length} OET words`, "success");
    } else if (this.value === "IELTS" && window.ieltsWordList) {
      words = [...window.ieltsWordList];
      showNotification(`Loaded ${words.length} IELTS words`, "success");
    } else {
      words = [];
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initWordManager);
