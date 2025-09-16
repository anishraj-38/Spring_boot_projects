import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Spring Boot backend URL

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true // send cookies (JWT is stored here)
});

const generateUserColor = () => {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const authService = {
    signup: async (username, email, password) => {
        try {
            const response = await api.post('/auth/signup', { username, email, password });
            return { success: true, user: response.data };
        } catch (error) {
            console.error('Signup failed', error);
            const errorMessage = error.response?.data?.message || 'Signup failed, please try again';
            throw new Error(errorMessage);
        }
    },

    login: async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });

            const userColor = generateUserColor();
            const userData = {
                ...response.data, 
                color: userColor,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('currentUser', JSON.stringify(userData));
            return { success: true, user: userData };
        } catch (error) {
            console.error('Login failed', error);
            const errorMessage = error.response?.data?.message || 'Login failed, check your credentials';
            throw new Error(errorMessage);
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem('currentUser');
        }
    },

    fetchCurrentUser: async () => {
        try {
            const response = await api.get('/auth/getcurrentuser');
            return response.data;
        } catch (error) {
            console.error('Error fetching current user', error);
            if (error.response && error.response.status === 401) {
                await authService.logout();
            }
            throw error;
        }
    },

    fetchOnlineUsers: async () => {
        try {
            const response = await api.get('/auth/getonlineusers');
            return response.data;
        } catch (error) {
            console.error('Error fetching online users', error);
            throw error;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('currentUser');
    }
};
