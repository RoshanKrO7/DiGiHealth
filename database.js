import { createClient } from '@supabase/supabase-js';

let supabase;

// Initialize Supabase services with the passed URL and public key
export function initializeDatabase(url, publicKey) {
    supabase = createClient(url, publicKey);
}

// File Upload Helper
export async function uploadFile(file) {
    const user = supabase.auth.user();
    if (!user) throw new Error('User not authenticated');

    const filePath = `users/${user.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('DiGiHealth').upload(filePath, file);

    if (error) throw error;
    return data.Key;
}

// Health Records
export async function addHealthRecord(data) {
    const user = supabase.auth.user();
    if (!user) throw new Error('User not authenticated');

    try {
        const { data: record, error } = await supabase
            .from('healthRecords')
            .insert([{ ...data, user_id: user.id, timestamp: new Date().toISOString() }]);

        if (error) throw error;
        return record[0].id;
    } catch (error) {
        console.error('Error adding health record:', error);
        throw error;
    }
}

export async function getHealthRecords() {
    const user = supabase.auth.user();
    if (!user) throw new Error('User not authenticated');

    try {
        const { data: records, error } = await supabase
            .from('healthRecords')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false });

        if (error) throw error;
        return records;
    } catch (error) {
        console.error('Error fetching health records:', error);
        throw error;
    }
}

// Update Health Record
export async function updateHealthRecord(recordId, data) {
    const user = supabase.auth.user();
    if (!user) throw new Error('User not authenticated');

    try {
        const { data: record, error } = await supabase
            .from('healthRecords')
            .update(data)
            .eq('id', recordId)
            .eq('user_id', user.id);

        if (error) throw error;
        return record;
    } catch (error) {
        console.error('Error updating health record:', error);
        throw error;
    }
}

// Appointments
export async function addAppointment(appointmentData) {
    const user = supabase.auth.user();
    if (!user) throw new Error('User not authenticated');

    try {
        const { data: appointment, error } = await supabase
            .from('appointments')
            .insert([{ ...appointmentData, user_id: user.id, status: 'scheduled', createdAt: new Date().toISOString() }]);

        if (error) throw error;
        return appointment[0].id;
    } catch (error) {
        console.error('Error adding appointment:', error);
        throw error;
    }
}

export async function getAppointments(status = 'scheduled') {
    const user = supabase.auth.user();
    if (!user) throw new Error('User not authenticated');

    try {
        const { data: appointments, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', status)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return appointments;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
}

// Initialize the database with the provided URL and public key
initializeDatabase('https://aqdzmfhakqdwquszaqle.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHptZmhha3Fkd3F1c3phcWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MDgyNTAsImV4cCI6MjA0Njk4NDI1MH0.4euPXQKyddaJuGhf5Etqdla8LF-h-p-gs1uVxw6dutQ');
