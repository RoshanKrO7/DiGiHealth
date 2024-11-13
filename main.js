import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://aqdzmfhakqdwquszaqle.supabase.co';
const SUPABASE_PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHptZmhha3Fkd3F1c3phcWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MDgyNTAsImV4cCI6MjA0Njk4NDI1MH0.4euPXQKyddaJuGhf5Etqdla8LF-h-p-gs1uVxw6dutQ';
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

// Rest of your main.js content remains the same
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  checkAuthState();

  // Signup Form Submission
  const signupForm = document.getElementById('signup-form');
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = signupForm.querySelector('input[name="firstname"]').value;
    const lastName = signupForm.querySelector('input[name="lastname"]').value;
    const email = signupForm.querySelector('input[name="email"]').value;
    const password = signupForm.querySelector('input[name="password"]').value;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) throw error;

      // Insert user profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email
        }]);

      if (profileError) throw profileError;

      showNotification('Account created successfully!');
      window.location.href = '/dashboard.html';
    } catch (error) {
      console.error('Signup error:', error.message);
      showNotification(error.message, 'error');
    }
  });

  // Login Form Submission
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[name="email"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      showNotification('Login successful!');
      window.location.href = './dashboard.html';
    } catch (error) {
      console.error('Login error:', error.message);
      showNotification(error.message, 'error');
    }
  });
});

// Check authentication state
async function checkAuthState() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session && window.location.pathname === '/index.html') {
    window.location.href = '/dashboard.html';
  } else if (!session && window.location.pathname === '/dashboard.html') {
    window.location.href = '/index.html';
  }
}

// Show notification
function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => container.removeChild(notification), 500);
    }, 3000);
}