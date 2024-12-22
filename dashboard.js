import { supabase } from './main.js';
import { showNotification, updateUserName } from './utils.js';
import { getUser } from './auth.js';

async function fetchUserProfile() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            window.location.href = '/index.html';
            return;
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;

        if (profile) {
            updateUserName(profile.first_name, profile.last_name);
            showNotification(`Welcome back, ${profile.first_name}!`);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        showNotification('Error loading profile', 'error');
    }
}

function setupMenuListeners() {
    const menuItems = {
        'health-overview': 'view-reports.html',
        'medical-history': 'medical-history.html',
        'chronic-disease-management': 'chronic-disease-management.html',
        'vaccination-history': 'vaccination-history.html',
        'medication-tracker': 'medication-tracker.html',
        'upcoming-appointments': 'upcoming-appointments.html',
        'appointment-history': 'appointment-history.html',
        'telehealth-consultations': 'telehealth-consultations.html',
        'appointment-reminders': 'appointment-reminders.html',
        'help-center': 'help-center.html',
        'contact-support': 'contact-support.html',
        'live-chat': 'live-chat.html',
        'view-reports':'view-reports.html',
        'add-report': 'add-report.html',
        'delete-report': 'delete-report.html',
        'update-report': 'update-report.html',
        'upcoming-appointments-card': 'upcoming-appointments.html',
        'vaccination-records-card': 'vaccination-history.html',
        'health-records-card': 'medical-history.html',
        'heart-health-card': 'chronic-disease-management.html',
        'doctor-consultations-card': 'telehealth-consultations.html',
        'medication-history-card': 'medication-tracker.html',
        'bone-health-card': 'chronic-disease-management.html',
        'emergency-contacts-card' : 'emergency-contacts.html'  // Added menu item
    };

    Object.entries(menuItems).forEach(([id, url]) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = url;
            });
        }
    });
}

// Function to load the QR code on the dashboard
async function loadQRCode() {
    const user = await getUser();
    if (!user || !user.user_metadata) {
        console.error('User metadata is missing');
        return;
    }

    const { id: user_id } = user;

    const { data, error } = await supabase
        .from('emergency_contacts')
        .select('qr_code_url')
        .eq('user_id', user_id)
        .single();

    if (error) {
        console.error('Error fetching QR code URL:', error);
        return;
    }

    if (data && data.qr_code_url) {
        const qrCodeContainer = document.getElementById('qrCodeCard');
        qrCodeContainer.innerHTML = `<img src="${data.qr_code_url}" alt="QR Code" />`;
    }
}

// Call the function to load the QR code when the dashboard loads
document.addEventListener('DOMContentLoaded', loadQRCode);

function setupLogoutListener() {
    const logoutDiv = document.getElementById('logout-div');
    if (logoutDiv) {
        logoutDiv.addEventListener('click', async () => {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                window.location.href = '/index.html';
            } catch (error) {
                console.error('Logout error:', error);
                showNotification('Error during logout', 'error');
            }
        });
    }
}

function closeAllMenus() {
    const menuItems = document.querySelectorAll('.menu-item');
    const overlay = document.querySelector('.overlay');
    menuItems.forEach(item => item.classList.remove('active'));
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchUserProfile();
        setupMenuListeners();
        setupLogoutListener();
        
        // Listen for auth state changes
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                window.location.href = '/index.html';
            }
        });
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('Error initializing dashboard', 'error');
    }
});