const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    },

    getCallLogs: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/calls`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    getDashboardStats: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    getReports: async (range) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/reports?range=${range}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }
};

export default api;