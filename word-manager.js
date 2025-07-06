// Word Manager Module
let words = [];

function saveWordList() {
  if (!auth.currentUser) {
    showNotification("Login first", "error");
    return;
  }

  const userEmail = auth.currentUser.email;
  db.collection("wordLists").doc(userEmail).set({ words })
    .then(() => showNotification("Words saved to cloud!", "success"))
    .catch(err => showNotification("Failed to save words: " + err.message, "error"));
}

function loadWordList() {
  if (!auth.currentUser) {
    showNotification("Login first", "error");
    return;
  }

  const userEmail = auth.currentUser.email;
  db.collection("wordLists").doc(userEmail).get()
    .then(doc => {
      if (doc.exists) {
        words = doc.data().words || [];
        showNotification("Words loaded from cloud!", "success");
      } else {
        showNotification("No saved list found", "info");
      }
    })
    .catch(err => showNotification("Error loading words: " + err.message, "error"));
}

function clearWordList() {
  if (confirm("Clear all words?")) {
    words = [];
    showNotification("Word list cleared", "success");
  }
}

function addCustomWords() {
  const input = document.getElementById("wordInput").value.trim();
  if (!input) {
    showNotification("Enter some words", "error");
    return;
  }

  words = input.split(/[\n,]+/).map(w => w.trim()).filter(Boolean);
  document.getElementById("wordInput").value = "";
  showNotification(words.length + " words added!", "success");
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  const ext = file.name.split('.').pop().toLowerCase();

  reader.onload = async function(e) {
    try {
      let text = '';
      if (ext === 'txt') {
        text = e.target.result;
      } else if (ext === 'pdf') {
        const pdf = await pdfjsLib.getDocument(e.target.result).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ') + '\n';
        }
      } else if (ext === 'docx') {
        const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
        text = result.value;
      } else {
        throw new Error("Unsupported file type");
      }

      words = text.split(/[\n,]+/).map(w => w.trim()).filter(Boolean);
      showNotification(words.length + " words loaded from file!", "success");
    } catch (error) {
      showNotification("Error: " + error.message, "error");
    }
  };

  if (ext === 'pdf' || ext === 'docx') {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }
}

function initWordManager() {
  // Event Listeners
  document.getElementById("saveWordsBtn").addEventListener("click", saveWordList);
  document.getElementById("loadWordsBtn").addEventListener("click", loadWordList);
  document.getElementById("clearWordsBtn").addEventListener("click", clearWordList);
  document.getElementById("addWordsBtn").addEventListener("click", addCustomWords);
  document.getElementById("fileInput").addEventListener("change", handleFileUpload);

  // Exam Selection
  document.getElementById("examSelect").addEventListener("change", function() {
    if (this.value === "OET") {
      words = window.oetWordList ? [...window.oetWordList] : [];
      showNotification("OET words loaded", "success");
    } else if (this.value === "IELTS") {
      words = window.ieltsWordList ? [...window.ieltsWordList] : [];
      showNotification("IELTS words loaded", "success");
    } else {
      words = [];
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initWordManager);
