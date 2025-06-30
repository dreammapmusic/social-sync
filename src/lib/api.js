// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses (like health check)
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        throw new ApiError(
          data.error || data.message || 'Request failed',
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      // Network errors or other fetch errors
      throw new ApiError(`Network error: ${error.message}`, 0, null);
    }
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(email, name, password) {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Posts methods
  async getPosts(status = null) {
    const params = status ? `?status=${status}` : '';
    return this.request(`/api/posts${params}`);
  }

  async getPost(id) {
    return this.request(`/api/posts/${id}`);
  }

  async createPost(postData) {
    return this.request('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id, postData) {
    return this.request(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(id) {
    return this.request(`/api/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async getCalendarPosts(year, month) {
    return this.request(`/api/posts/calendar/${year}/${month}`);
  }

  // Analytics methods
  async getAnalytics(range = '30d') {
    return this.request(`/api/analytics?range=${range}`);
  }

  async getPlatformAnalytics() {
    return this.request('/api/analytics/platforms');
  }

  async addAnalytics(analyticsData) {
    return this.request('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(analyticsData),
    });
  }

  // Settings methods
  async getSettings() {
    return this.request('/api/settings');
  }

  async updateSettings(settings) {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async updateProfile(profileData) {
    return this.request('/api/settings/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getTeamUsers() {
    return this.request('/api/settings/team');
  }

  async addTeamUser(userData) {
    return this.request('/api/settings/team', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async removeTeamUser(userId) {
    return this.request(`/api/settings/team/${userId}`, {
      method: 'DELETE',
    });
  }

  // Connected accounts methods
  async getConnectedAccounts() {
    return this.request('/api/accounts');
  }

  async connectAccount(accountData) {
    return this.request('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  async updateAccount(id, accountData) {
    return this.request(`/api/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    });
  }

  async disconnectAccount(id) {
    return this.request(`/api/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  async getAccountStats(id) {
    return this.request(`/api/accounts/${id}/stats`);
  }

  // Files methods
  async getFiles() {
    return this.request('/api/files');
  }

  async createFile(fileData) {
    return this.request('/api/files', {
      method: 'POST',
      body: JSON.stringify(fileData),
    });
  }

  async getFile(id) {
    return this.request(`/api/files/${id}`);
  }

  async updateFile(id, fileData) {
    return this.request(`/api/files/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fileData),
    });
  }

  async deleteFile(id) {
    return this.request(`/api/files/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 