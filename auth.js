import { auth } from './firebase-config.js';
import { showNotification } from './app.js';

let userEmail = "";

// Initialize auth state listener
export function initAuth() {
  auth.onAuthStateChanged(user => {
    if (user) {
      userEmail = user.email;
      document.getElementById("loginStatus").textContent = `✔️ Logged in as ${userEmail}`;
      document.getElementById("formHiddenEmail").value = userEmail;
    } else {
      userEmail = "";
      document.getElementById("loginStatus").textContent = "❌ Not logged in";
      document.getElementById("formHiddenEmail").value = "";
    }
  });
}

// Login function
export function loginUser() {
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value;

  if (!email || !password) {
    showNotification("Email and password required", "error");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      showNotification("Login successful!", "success");
    })
    .catch(error => {
      handleAuthError(error);
    });
}

// Signup function
export function signUpUser() {
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value;

  if (!email || !password) {
    showNotification("Email and password required", "error");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      showNotification("Account created and signed in!", "success");
    })
    .catch(error => {
      handleAuthError(error);
    });
}

// Logout function
export function logoutUser() {
  auth.signOut()
    .then(() => {
      showNotification("You have logged out", "info");
    })
    .catch(error => {
      showNotification("Logout failed: " + error.message, "error");
    });
}

// Handle auth errors
function handleAuthError(error) {
  let message = "Authentication error";
  
  switch(error.code) {
    case "auth/user-not-found":
      message = "No user found with this email";
      break;
    case "auth/wrong-password":
      message = "Incorrect password";
      break;
    case "auth/email-already-in-use":
      message = "Email already in use";
      break;
    case "auth/weak-password":
      message = "Password should be at least 6 characters";
      break;
    case "auth/invalid-email":
      message = "Invalid email address";
      break;
    default:
      message = error.message;
  }
  
  showNotification(message, "error");
}

// Get current user email
export function getUserEmail() {
  return userEmail;
}

// Initialize event listeners
export function initAuthListeners() {
  document.getElementById("loginBtn").addEventListener("click", loginUser);
  document.getElementById("signupBtn").addEventListener("click", signUpUser);
  document.getElementById("logoutBtn").addEventListener("click", logoutUser);
}
