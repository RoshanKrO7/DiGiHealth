// import './style.css';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js';

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
const storage = getStorage(app);

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const healthRecords = document.getElementById('health-records');
const showSignupButton = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const logoutButton = document.getElementById('logout-button');
const userEmailSpan = document.getElementById('user-email');
const contentArea = document.getElementById('content-area');
const backToDashboardButton = document.getElementById('back-to-dashboard');

// Event Listeners
document.getElementById('login-button').addEventListener('click', login);
signupForm.addEventListener('submit', signup);
showSignupButton.addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
});
showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  signupForm.style.display = 'none';
  loginForm.style.display = 'block';
});
logoutButton.addEventListener('click', logout);

// Dashboard item click events
document.getElementById('disease-journeys').addEventListener('click', () => showContent('disease-journeys'));
document.getElementById('appointments').addEventListener('click', () => showContent('appointments'));
document.getElementById('health-profile').addEventListener('click', () => showContent('health-profile'));

backToDashboardButton.addEventListener('click', () => {
  contentArea.style.display = 'none';
  backToDashboardButton.style.display = 'none';
  document.querySelector('.dashboard').style.display = 'flex';
});

// Login function
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
      await signInWithEmailAndPassword(auth, email, password);
      
  } catch (error) {
      console.error("Error logging in: ", error);
      alert("Login failed: " + error.message);
  }
}


// Signup function
async function signup(event) {
  event.preventDefault();
  const firstname = document.querySelector('input[name="firstname"]').value;
  const lastname = document.querySelector('input[name="lastname"]').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    await setDoc(doc(db, 'users', userId), {
      firstname,
      lastname,
      email,
      createdAt: serverTimestamp()
    });
    alert("Signup successful! Please login to continue.");
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
  } catch (error) {
    console.error("Error signing up: ", error);
    alert("Signup failed: " + error.message);
  }
}

// Logout function
function logout() {
  signOut(auth).then(() => {
    document.getElementById('login-signup').style.display = 'block';
    healthRecords.style.display = 'none';
  }).catch(error => {
    console.error("Error signing out: ", error);
  });
}

// Auth state change listener
onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById('login-signup').style.display = 'none';
    healthRecords.style.display = 'block';
    userEmailSpan.textContent = user.email;
  } else {
    document.getElementById('login-signup').style.display = 'block';
    healthRecords.style.display = 'none';
  }
});

// Show content for each dashboard item
function showContent(contentType) {
  const dashboard = document.querySelector('.dashboard');
  dashboard.style.display = 'none';
  contentArea.style.display = 'block';
  backToDashboardButton.style.display = 'block';

  let content = '';
  switch (contentType) {
    case 'disease-journeys':
      content = `
        <h3>Disease Journeys</h3>
        <p>Track and manage your health conditions over time.</p>
        <ul>
          <li>Create a new journey</li>
          <li>Update existing journeys</li>
          <li>View journey timeline</li>
          <li>Add symptoms, treatments, and notes</li>
        </ul>
        <button onclick="createNewJourney()">Create New Journey</button>
      `;
      break;
    case 'appointments':
      content = `
        <h3>Appointments</h3>
        <p>Schedule and manage your medical appointments.</p>
        <ul>
          <li>View upcoming appointments</li>
          <li>Schedule a new appointment</li>
          <li>Set reminders</li>
          <li>Add notes for each appointment</li>
        </ul>
        <button onclick="scheduleAppointment()">Schedule Appointment</button>
      `;
      break;
    case 'health-profile':
      content = `
        <h3>Health Profile</h3>
        <p>Manage your personal health information.</p>
        <ul>
          <li>Update personal details</li>
          <li>Manage allergies and conditions</li>
          <li>Update emergency contacts</li>
          <li>Manage medications</li>
        </ul>
        <button onclick="updateHealthProfile()">Update Profile</button>
      `;
      break;
  }
  contentArea.innerHTML = content;
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}