// Mock API for Static Site Demo
// Since GitHub Pages cannot run a Python backend, we simulate the API here.

class MockAPI {
    constructor() {
        this.simulatedDelay = 800; // ms
        this.currentUser = JSON.parse(localStorage.getItem('user')) || null;
    }

    async _mockRequest(data, errorRate = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < errorRate) {
                    reject(new Error('Simulated network error'));
                } else {
                    resolve(data);
                }
            }, this.simulatedDelay);
        });
    }

    getToken() {
        return localStorage.getItem("token");
    }

    // Authentication
    async login(username, password) {
        // Simulate login
        let role = 'user';
        if (username.toLowerCase().includes('admin')) role = 'admin';
        if (username.toLowerCase().includes('helper')) role = 'helper';

        const user = {
            user_id: 123,
            username: username,
            email: `${username}@example.com`,
            role: role,
            is_active: true,
            created_at: new Date().toISOString()
        };

        this.currentUser = user;
        return this._mockRequest({
            token: 'mock-jwt-token-' + Date.now(),
            user: user
        });
    }

    async register(userData) {
        return this._mockRequest({
            message: "User registered successfully",
            user_id: Date.now()
        });
    }

    async logout() {
        this.currentUser = null;
        return this._mockRequest({ message: "Logged out" });
    }

    // Services
    async getAllServicesAdmin() {
        return this._mockRequest(this._getMockServices());
    }
    
    // Public services (same as admin for mock)
    async request(endpoint) {
        // Handle the dynamic service fetching used in dashboard
        if (endpoint === '/services') {
            return this._mockRequest(this._getMockServices());
        }
        return this._mockRequest({});
    }

    _getMockServices() {
        return [
            {
                contact_id: 1,
                service_name: "National Emergency Service",
                phone_number: "999",
                category: "Emergency",
                description: "Police, Ambulance, and Fire Service",
                is_active: true,
                image_path: "static/assets/emergency.png"
            },
            {
                contact_id: 2,
                service_name: "National Help Desk",
                phone_number: "333",
                category: "Government",
                description: "Government Information & Services",
                is_active: true,
                image_path: "static/assets/emergency.png"
            },
            {
                contact_id: 3,
                service_name: "Child Helpline",
                phone_number: "1098",
                category: "Helpline",
                description: "Child protection and support",
                is_active: true,
                image_path: "static/assets/emergency.png"
            },
            {
                contact_id: 4,
                service_name: "Women & Children Helpline",
                phone_number: "109",
                category: "Helpline",
                description: "Support for women and children",
                is_active: true,
                image_path: "static/assets/emergency.png"
            },
            {
                contact_id: 5,
                service_name: "Disaster Warning",
                phone_number: "1090",
                category: "Emergency",
                description: "Weather and disaster updates",
                is_active: true,
                image_path: "static/assets/emergency.png"
            }
        ];
    }

    async createService(serviceData) { return this._mockRequest({ message: "Service created" }); }
    async updateService(id, data) { return this._mockRequest({ message: "Service updated" }); }
    async deleteService(id) { return this._mockRequest({ message: "Service deleted" }); }
    async createServiceWithImage(formData) { return this._mockRequest({ message: "Service created" }); }
    async updateServiceWithImage(id, formData) { return this._mockRequest({ message: "Service updated" }); }

    // Users
    async getAllUsers() {
        return this._mockRequest([
            { user_id: 1, username: "admin", email: "admin@example.com", role: "admin", is_active: true, created_at: new Date().toISOString() },
            { user_id: 2, username: "helper", email: "helper@example.com", role: "helper", is_active: true, created_at: new Date().toISOString() },
            { user_id: 3, username: "user", email: "user@example.com", role: "user", is_active: true, created_at: new Date().toISOString() }
        ]);
    }
    async updateUserRole(id, role) { return this._mockRequest({ message: "Role updated" }); }
    async getUsersCount() { return this._mockRequest({ total_users: 3 }); }

    // Calls
    async getAllCalls() {
        return this._mockRequest([
            { call_id: 101, user_username: "user", service_name: "National Emergency Service", caller_number: "01700000000", receiver_number: "999", duration_seconds: 120, created_at: new Date().toISOString(), notes: "Emergency reported" }
        ]);
    }

    // Chat
    async createChatSession() { return this._mockRequest({ session_id: 123, status: 'waiting' }); }
    async getWaitingSessions() { return this._mockRequest([]); }
    async getMySessions() { return this._mockRequest([]); }
    async assignSession(id) { return this._mockRequest({ success: true }); }
    async getMessages(id) { return this._mockRequest([]); }
    async sendMessage(id, msg) { return this._mockRequest({ success: true }); }
    async closeSession(id) { return this._mockRequest({ success: true }); }

    // Favorites
    async getFavorites() { return this._mockRequest([]); }
    async addFavorite(id) { return this._mockRequest({ success: true }); }
    async removeFavorite(id) { return this._mockRequest({ success: true }); }
}

// Replace the global API instance
const API = new MockAPI();

// Auth helpers
function isAuthenticated() {
  return !!localStorage.getItem("token");
}

function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}
