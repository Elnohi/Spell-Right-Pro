import { initAuth, initAuthListeners, getUserEmail } from './auth.js';
import { initWordManagerListeners } from './word-manager.js';
import { initTrainerListeners } from './trainer.js';

// Show notification
export function showNotification(message, type = "info") {
  const note = document.createElement("div");
  note.className = `notification ${type}`;
  note.innerHTML = `<i class="fas fa-${
    type === 'error' ? 'exclamation-circle' : 
    type === 'success' ? 'check-circle' : 'info-circle'
  }"></i> <span>${message}</span>`;
  
  const notificationArea = document.getElementById("notificationArea");
  notificationArea.appendChild(note);
  
  setTimeout(() => note.classList.add("show"), 10);
  setTimeout(() => {
    note.classList.remove("show");
    setTimeout(() => note.remove(), 300);
  }, 3000);
}

// Initialize dark mode
function initDarkMode() {
  const body = document.body;
  const icon = document.getElementById("modeIcon");
  const darkMode = localStorage.getItem('darkMode') === 'enabled';
  
  if (darkMode) {
    body.classList.add("dark-mode");
    icon.className = "fas fa-sun";
  }
  
  document.getElementById("modeToggle").addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
  });
}

// Initialize accent selection
function initAccentSelection() {
  document.getElementById("accentSelect").addEventListener("change", (e) => {
    const text = e.target.selectedOptions[0].text;
    showNotification(`Accent set to ${text}`, "info");
  });
}

// Initialize feedback form
function initFeedbackForm() {
  document.getElementById("feedbackForm").addEventListener("submit", (e) => {
    const email = getUserEmail();
    if (!email) {
      e.preventDefault();
      showNotification("Please login with your email before submitting the comment", "error");
      return false;
    }
    document.getElementById("formHiddenEmail").value = email;
    return true;
  });
}

// Initialize application
function initApp() {
  initAuth();
  initAuthListeners();
  initWordManagerListeners();
  initTrainerListeners();
  initDarkMode();
  initAccentSelection();
  initFeedbackForm();
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
