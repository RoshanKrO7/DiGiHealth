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

export async function handleHealthOverview() {
    updateMainContent('Reports Management', `
        <div class="reports-management">
            <div class="menu-card" id="view-reports">
                <div class="card-icon"><i class="fa fa-eye"></i></div>
                <div class="card-text">View Reports</div>
            </div>
            <div class="menu-card" id="add-report">
                <div class="card-icon"><i class="fa fa-plus"></i></div>
                <div class="card-text">Add New Report</div>
            </div>
            <div class="menu-card" id="delete-report">
                <div class="card-icon"><i class="fa fa-trash"></i></div>
                <div class="card-text">Delete Report</div>
            </div>
            <div class="menu-card" id="update-report">
                <div class="card-icon"><i class="fa fa-edit"></i></div>
                <div class="card-text">Update Report</div>
            </div>
        </div>
    `);

    document.getElementById('view-reports').addEventListener('click', viewReports);
    document.getElementById('add-report').addEventListener('click', addReport);
    document.getElementById('delete-report').addEventListener('click', deleteReport);
    document.getElementById('update-report').addEventListener('click', updateReport);

async function viewReports() {
    try {
        const { data: reports, error } = await supabase
            .from('reports')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const content = `
            <div class="reports-grid">
                ${reports?.length ? reports.map(report => `
                    <div class="report-card">
                        <div class="report-header">
                            <h3>${report.title}</h3>
                            <span class="date">${new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                        <p>${report.description}</p>
                    </div>
                `).join('') : '<p class="no-data">No reports found</p>'}
            </div>
        `;

        updateMainContent('View Reports', content);
    } catch (error) {
        console.error('Error:', error);
        console.log('Error:', error);
        showNotification('Error loading reports', 'error');
    }
}

async function addReport() {
    // Logic to add a new report
    showNotification('Add Report functionality not implemented yet', 'info');
}

async function deleteReport() {
    // Logic to delete a report
    showNotification('Delete Report functionality not implemented yet', 'info');
}

async function updateReport() {
    // Logic to update a report
    showNotification('Update Report functionality not implemented yet', 'info');
}
}

export async function handleMedicalHistory() {
    try {
        const { data: history, error } = await supabase
            .from('medical_history')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        const content = `
            <div class="history-timeline">
                ${history?.length ? history.map(record => `
                    <div class="history-item">
                        <div class="history-date">
                            ${new Date(record.date).toLocaleDateString()}
                        </div>
                        <div class="history-content">
                            <h3>${record.condition}</h3>
                            <p>${record.details}</p>
                        </div>
                    </div>
                `).join('') : '<p class="no-data">No medical history records found</p>'}
            </div>
        `;

        updateMainContent('Medical History', content);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error loading medical history', 'error');
    }
}

export function handleChronicDiseaseManagement() {
    updateMainContent('Chronic Disease Management', `
        <div class="chronic-disease-management">
            <div class="management-cards">
                <div class="management-card">
                    <h3>Disease Tracking</h3>
                    <p>Track and monitor your chronic conditions</p>
                </div>
                <div class="management-card">
                    <h3>Medication Schedule</h3>
                    <p>View and manage your medication schedule</p>
                </div>
                <div class="management-card">
                    <h3>Symptom Journal</h3>
                    <p>Record and track your symptoms</p>
                </div>
            </div>
        </div>
    `);
}

export function handleVaccinationHistory() {
    updateMainContent('Vaccination History', `
        <div class="vaccination-history">
            <div class="vaccination-cards">
                <div class="vaccination-card">
                    <h3>Recent Vaccinations</h3>
                    <p>View your recent vaccination records</p>
                </div>
                <div class="vaccination-card">
                    <h3>Upcoming Vaccinations</h3>
                    <p>Check your vaccination schedule</p>
                </div>
            </div>
        </div>
    `);
}

export function handleMedicationTracker() {
    updateMainContent('Medication Tracker', `
        <div class="medication-tracker">
            <div class="medication-list">
                <h3>Current Medications</h3>
                <p>Track your current medications and schedules</p>
            </div>
        </div>
    `);
}

export function handleHealthAnalytics() {
    updateMainContent('Health Analytics', `
        <div class="health-analytics">
            <div class="analytics-dashboard">
                <h3>Health Trends</h3>
                <p>View your health metrics and trends</p>
            </div>
        </div>
    `);
}

export function handleUpcomingAppointments() {
    updateMainContent('Upcoming Appointments', `
        <div class="appointments">
            <div class="appointment-list">
                <h3>Scheduled Appointments</h3>
                <p>View and manage your upcoming appointments</p>
            </div>
        </div>
    `);
}

export function handleAppointmentHistory() {
    updateMainContent('Appointment History', `
        <div class="appointment-history">
            <div class="history-list">
                <h3>Past Appointments</h3>
                <p>Review your previous appointments</p>
            </div>
        </div>
    `);
}

export function handleTelehealthConsultations() {
    updateMainContent('Telehealth Consultations', `
        <div class="telehealth">
            <div class="consultation-options">
                <h3>Virtual Consultations</h3>
                <p>Schedule and manage your telehealth appointments</p>
            </div>
        </div>
    `);
}

export function handleAppointmentReminders() {
    updateMainContent('Appointment Reminders', `
        <div class="reminders">
            <div class="reminder-settings">
                <h3>Reminder Preferences</h3>
                <p>Manage your appointment reminder settings</p>
            </div>
        </div>
    `);
}

export function handleHelpCenter() {
    updateMainContent('Help Center', `
        <div class="help-center">
            <div class="help-resources">
                <h3>Support Resources</h3>
                <p>Access helpful guides and documentation</p>
            </div>
        </div>
    `);
}

export function handleContactSupport() {
    updateMainContent('Contact Support', `
        <div class="contact-support">
            <div class="support-options">
                <h3>Support Channels</h3>
                <p>Get in touch with our support team</p>
            </div>
        </div>
    `);
}

export function handleLiveChat() {
    updateMainContent('Live Chat', `
        <div class="live-chat">
            <div class="chat-interface">
                <h3>Chat Support</h3>
                <p>Connect with our support team in real-time</p>
            </div>
        </div>
    `);
}

export function handleProfileSettings() {
    updateMainContent('Profile Settings', `
        <div class="profile-settings">
            <div class="settings-form">
                <h3>Personal Information</h3>
                <p>Update your profile information</p>
            </div>
        </div>
    `);
}

export function handleSecuritySettings() {
    updateMainContent('Security Settings', `
        <div class="security-settings">
            <div class="security-options">
                <h3>Security Preferences</h3>
                <p>Manage your account security settings</p>
            </div>
        </div>
    `);
}

export function handleDataBackup() {
    updateMainContent('Data Backup & Export', `
        <div class="data-backup">
            <div class="backup-options">
                <h3>Data Management</h3>
                <p>Backup and export your health data</p>
            </div>
        </div>
    `);
}