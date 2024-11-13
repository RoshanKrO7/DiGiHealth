import { supabase } from './main.js';
import { showNotification, updateUserName } from './utils.js';
import * as handlers from './menuHandlers.js';

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
        'health-overview': handlers.handleHealthOverview,
        'medical-history': handlers.handleMedicalHistory,
        'chronic-disease-management': handlers.handleChronicDiseaseManagement,
        'vaccination-history': handlers.handleVaccinationHistory,
        'medication-tracker': handlers.handleMedicationTracker,
        'health-analytics': handlers.handleHealthAnalytics,
        'upcoming-appointments': handlers.handleUpcomingAppointments,
        'appointment-history': handlers.handleAppointmentHistory,
        'telehealth-consultations': handlers.handleTelehealthConsultations,
        'appointment-reminders': handlers.handleAppointmentReminders,
        'help-center': handlers.handleHelpCenter,
        'contact-support': handlers.handleContactSupport,
        'live-chat': handlers.handleLiveChat,
        'profile-settings': handlers.handleProfileSettings,
        'security-settings': handlers.handleSecuritySettings,
        'data-backup': handlers.handleDataBackup
    };
    const cardItems = {
        'upcoming-appointments-card': handlers.handleUpcomingAppointments,
        'vaccination-records-card': handlers.handleVaccinationHistory,
        'health-records-card': handlers.handleHealthOverview,
        'heart-health-card': handlers.handleHealthAnalytics,
        'doctor-consultations-card': handlers.handleMedicalHistory,
        'medication-history-card': handlers.handleMedicationTracker,
        'bone-health-card': handlers.handleChronicDiseaseManagement,
        'emergency-contacts-card': handlers.handleContactSupport
    };

    Object.entries(cardItems).forEach(([id, handler]) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                handler();
                closeAllMenus();
            });
        }
    });


    Object.entries(menuItems).forEach(([id, handler]) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                handler();
                closeAllMenus();
            });
        }
    });
}

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