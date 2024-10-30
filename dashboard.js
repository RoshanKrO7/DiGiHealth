import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB77lnFZqn46ul5U1Q8vTOk44STUhjhcIU",
    authDomain: "digital-health-passport-16ce0.firebaseapp.com",
    projectId: "digital-health-passport-16ce0",
    storageBucket: "digital-health-passport-16ce0.appspot.com",
    messagingSenderId: "798632054158",
    appId: "1:798632054158:web:05299092d5281dd45e68df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'menu-overlay';
document.body.appendChild(overlay);

// Handle menu interactions
const menuItems = document.querySelectorAll('.menu-item');
let activeMenuItem = null;

function closeAllMenus(immediate = false) {
    if (immediate) {
        menuItems.forEach(item => {
            const subMenu = item.querySelector('.sub-menu');
            if (subMenu) {
                subMenu.style.display = 'none';
                setTimeout(() => {
                    subMenu.style.display = '';
                }, 300);
            }
        });
    }
    
    menuItems.forEach(item => item.classList.remove('active'));
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    activeMenuItem = null;
}

function openMenu(item) {
    if (activeMenuItem === item) {
        closeAllMenus();
        return;
    }
    
    closeAllMenus(true);
    
    setTimeout(() => {
        item.classList.add('active');
        overlay.classList.add('active');
        activeMenuItem = item;
        
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
    }, immediate ? 50 : 0);
}

// Handle menu text clicks
menuItems.forEach(item => {
    const menuText = item.querySelector('.menu-text');
    
    menuText.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openMenu(item);
    });
});

// Handle icon box clicks with improved touch handling
const iconBoxes = document.querySelectorAll('.icon-box');
iconBoxes.forEach(box => {
    let touchStartTime;
    let touchStartY;
    
    box.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
        touchStartY = e.touches[0].clientY;
        box.style.backgroundColor = 'rgba(93, 139, 255, 0.15)';
    }, { passive: true });
    
    box.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const touchDuration = Date.now() - touchStartTime;
        const touchDistance = Math.abs(touchEndY - touchStartY);
        
        box.style.backgroundColor = '';
        
        // Only trigger click if it was a tap (short duration, small movement)
        if (touchDuration < 500 && touchDistance < 10) {
            e.preventDefault();
            handleIconBoxClick(box);
        }
    });
    
    // Regular click handler for non-touch devices
    box.addEventListener('click', (e) => {
        e.stopPropagation();
        handleIconBoxClick(box);
    });
});

function handleIconBoxClick(box) {
    const title = box.querySelector('.title').textContent.toLowerCase();
    
    if (title.includes('logout')) {
        logout();
        return;
    }
    
    // Handle other menu items
    const menuItem = box.closest('.menu-item');
    if (menuItem) {
        closeAllMenus();
        // Add your navigation logic here
        console.log('Clicked:', box.querySelector('.title').textContent);
    }
}

// Close menu when clicking overlay
overlay.addEventListener('click', () => closeAllMenus());

// Prevent submenu scroll from propagating to body
const subMenus = document.querySelectorAll('.sub-menu');
subMenus.forEach(menu => {
    menu.addEventListener('touchmove', (e) => {
        if (menu.scrollHeight > menu.clientHeight) {
            e.stopPropagation();
        } else {
            e.preventDefault();
        }
    }, { passive: false });
});

// Logout function
window.logout = function() {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    }).catch(error => {
        console.error("Error signing out: ", error);
    });
};

// Auth state change listener
document.addEventListener('DOMContentLoaded', () => {
    const userEmailSpan = document.getElementById('user-email');

    onAuthStateChanged(auth, async user => {
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    userEmailSpan.textContent = `Welcome ${userData.firstName} ${userData.lastName}`;
                }
            } catch (error) {
                console.error("Error fetching user document: ", error);
            }
        } else {
            window.location.href = 'index.html';
        }
    });
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/DiGiHealth/sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.body.style.overflow = '';
        closeAllMenus();
    }
});