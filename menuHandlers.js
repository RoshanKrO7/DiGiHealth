import { supabase } from './auth.js';
import { showNotification } from './utils.js';

function updateMainContent(title, content) {
    const container = document.querySelector('.container');
    if (!container) return;

    container.innerHTML = `
        <div class="home-header">
            <h1>${title}</h1>
        </div>
        <div class="content-wrapper">
            ${content}
        </div>
    `;
}
export function setupMenuListeners() {
    const menuItems = document.querySelectorAll('.menu-item');
    const overlay = document.querySelector('.overlay');
    menuItems.forEach(item => {
        const handler = item.dataset.handler;
        if (handler) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                window[handler]();
                closeAllMenus();
            });
        }
    });

    overlay?.addEventListener('click', closeAllMenus);
}
document.addEventListener('DOMContentLoaded', () => {
    const healthOverview = document.getElementById('health-overview');
    if (healthOverview) {
        healthOverview.addEventListener('click', () => {
            window.location.href = 'view-reports.html';
        });
    }

    const medicalHistory = document.getElementById('medical-history');
    if (medicalHistory) {
        medicalHistory.addEventListener('click', () => {
            window.location.href = 'medical-history.html';
        });
    }

    const chronicDiseaseManagement = document.getElementById('chronic-disease-management');
    if (chronicDiseaseManagement) {
        chronicDiseaseManagement.addEventListener('click', () => {
            window.location.href = 'chronic-disease-management.html';
        });
    }

    const vaccinationHistory = document.getElementById('vaccination-history');
    if (vaccinationHistory) {
        vaccinationHistory.addEventListener('click', () => {
            window.location.href = 'vaccination-history.html';
        });
    }

    const medicationTracker = document.getElementById('medication-tracker');
    if (medicationTracker) {
        medicationTracker.addEventListener('click', () => {
            window.location.href = 'medication-tracker.html';
        });
    }

    const upcomingAppointments = document.getElementById('upcoming-appointments');
    if (upcomingAppointments) {
        upcomingAppointments.addEventListener('click', () => {
            window.location.href = 'upcoming-appointments.html';
        });
    }

    const appointmentHistory = document.getElementById('appointment-history');
    if (appointmentHistory) {
        appointmentHistory.addEventListener('click', () => {
            window.location.href = 'appointment-history.html';
        });
    }

    const telehealthConsultations = document.getElementById('telehealth-consultations');
    if (telehealthConsultations) {
        telehealthConsultations.addEventListener('click', () => {
            window.location.href = 'telehealth-consultations.html';
        });
    }

    const appointmentReminders = document.getElementById('appointment-reminders');
    if (appointmentReminders) {
        appointmentReminders.addEventListener('click', () => {
            window.location.href = 'appointment-reminders.html';
        });
    }

    const helpCenter = document.getElementById('help-center');
    if (helpCenter) {
        helpCenter.addEventListener('click', () => {
            window.location.href = 'help-center.html';
        });
    }

    const contactSupport = document.getElementById('contact-support');
    if (contactSupport) {
        contactSupport.addEventListener('click', () => {
            window.location.href = 'contact-support.html';
        });
    }

    const liveChat = document.getElementById('live-chat');
    if (liveChat) {
        liveChat.addEventListener('click', () => {
            window.location.href = 'live-chat.html';
        });
    }

    const viewReports = document.getElementById('view-reports');
    if (viewReports) {
        viewReports.addEventListener('click', () => {
            window.location.href = 'view-reports.html';
        });
    }

    const addReport = document.getElementById('add-report');
    if (addReport) {
        addReport.addEventListener('click', () => {
            window.location.href = 'add-report.html';
        });
    }

    const deleteReport = document.getElementById('delete-report');
    if (deleteReport) {
        deleteReport.addEventListener('click', () => {
            window.location.href = 'delete-report.html';
        });
    }

    const updateReport = document.getElementById('update-report');
    if (updateReport) {
        updateReport.addEventListener('click', () => {
            window.location.href = 'update-report.html';
        });
    }
});
