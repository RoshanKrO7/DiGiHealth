import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { getFirestore, doc, setDoc, serverTimestamp, getDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyB77lnFZqn46ul5U1Q8vTOk44STUhjhcIU",
  authDomain: "digital-health-passport-16ce0.firebaseapp.com",
  projectId: "digital-health-passport-16ce0",
  storageBucket: "digital-health-passport-16ce0.appspot.com",
  messagingSenderId: "798632054158",
  appId: "1:798632054158:web:05299092d5281dd45e68df"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupButton = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');

// Event Listeners
showSignupButton.addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  signupForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// Login function
window.login = async function() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'dashboard.html'; // Redirect to dashboard
  } catch (error) {
    console.error("Error logging in: ", error);
    alert("Login failed: " + error.message);
  }
};

// Signup function
window.signup = async function(event) {
  event.preventDefault();
  const firstname = document.querySelector('input[name="firstname"]').value;
  const lastname = document.querySelector('input[name="lastname"]').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    await setDoc(doc(db, 'users', userId), {
      firstName: firstname,
      lastName: lastname,
      email,
      createdAt: serverTimestamp()
    });
    alert("Signup successful! Redirecting to dashboard...");
    window.location.href = 'dashboard.html'; // Redirect to dashboard
  } catch (error) {
    console.error("Error signing up: ", error);
    alert("Signup failed: " + error.message);
  }
};


// Function to log out the user
function logout() {
  signOut(auth).then(() => {
    // Redirect to index.html after successful logout
    window.location.href = 'index.html';
  }).catch(error => {
    console.error("Error signing out: ", error);
  });
}


// Auth state change listener
onAuthStateChanged(auth, user => {
  if (user) {
    // If user is signed in, redirect to dashboard
    window.location.href = 'dashboard.html';
  }
});


// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/DiGiHealth/sw.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed', err));
  });
}
