import { supabase } from './main.js';

export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
export async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        window.location.href = './index.html';
        return null;
    }
    return user;
}

export async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = './index.html';
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}