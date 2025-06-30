import apiService from './api.js';

class DataService {
  constructor() {
    this.isInitialized = false;
    this.initializeService();
  }

  async initializeService() {
    try {
      await apiService.healthCheck();
      this.isInitialized = true;
      console.log('✅ Connected to SocialSync backend API');
    } catch (error) {
      console.error('Failed to initialize API service:', error);
      // Don't throw error, just mark as not initialized
      // This allows the app to work with mock data when backend is unavailable
      this.isInitialized = false;
      console.warn('⚠️ Backend API is not available. Using mock data mode.');
    }
  }

  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initializeService();
    }
    // If still not initialized after trying, we'll work with mock data
    if (!this.isInitialized) {
      console.warn('⚠️ Working with mock data - backend unavailable');
    }
  }

  // Authentication methods
  async login(email, password) {
    await this.ensureInitialized();
    try {
      const response = await apiService.login(email, password);
      
      // Handle different response structures from backend
      const token = response.token || response.data?.token;
      const user = response.user || response.data?.user || response.data;
      
      if (token) {
        // Store the auth token
        localStorage.setItem('authToken', token);
        
        // Store user data
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        return {
          success: true,
          user: user,
          token: token
        };
      } else {
        return {
          success: false,
          error: response.error || response.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  async register(email, name, password) {
    await this.ensureInitialized();
    try {
      const response = await apiService.register(email, name, password);
      return { success: true, user: response.user, token: response.token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser() {
    await this.ensureInitialized();
    try {
      const response = await apiService.getCurrentUser();
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  logout() {
    apiService.logout();
  }

  // Posts methods
  async getPosts(status = null) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      const posts = JSON.parse(localStorage.getItem('socialScheduler_posts') || '[]');
      return status ? posts.filter(post => post.status === status) : posts;
    }
    try {
      const response = await apiService.getPosts(status);
      return response.posts || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Fallback to localStorage
      const posts = JSON.parse(localStorage.getItem('socialScheduler_posts') || '[]');
      return status ? posts.filter(post => post.status === status) : posts;
    }
  }

  async getPost(id) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.getPost(id);
    return response.post;
  }

  async getDrafts() {
    return this.getPosts('draft');
  }

  async savePost(postData, status = 'draft') {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      // Fallback to localStorage when backend is unavailable
      const posts = JSON.parse(localStorage.getItem('socialScheduler_posts') || '[]');
      
      const postPayload = {
        ...postData,
        status,
        id: postData.id || Date.now(),
        createdAt: postData.createdAt || new Date().toISOString(),
        scheduledDate: postData.scheduledDate,
        scheduledTime: postData.scheduledTime
      };

      if (postData.id && posts.find(p => p.id === postData.id)) {
        // Update existing post
        const updatedPosts = posts.map(p => p.id === postData.id ? postPayload : p);
        localStorage.setItem('socialScheduler_posts', JSON.stringify(updatedPosts));
      } else {
        // Create new post
        posts.push(postPayload);
        localStorage.setItem('socialScheduler_posts', JSON.stringify(posts));
      }
      
      return postPayload;
    }
    
    const postPayload = {
      ...postData,
      status,
      scheduledDate: postData.scheduledDate,
      scheduledTime: postData.scheduledTime
    };

    if (postData.id && postData.id !== Date.now()) {
      const response = await apiService.updatePost(postData.id, postPayload);
      return response.post;
    } else {
      const response = await apiService.createPost(postPayload);
      return response.post;
    }
  }

  async deletePost(postId) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      const posts = JSON.parse(localStorage.getItem('socialScheduler_posts') || '[]');
      const updatedPosts = posts.filter(p => p.id !== postId);
      localStorage.setItem('socialScheduler_posts', JSON.stringify(updatedPosts));
      return;
    }
    try {
      await apiService.deletePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
      // Fallback to localStorage
      const posts = JSON.parse(localStorage.getItem('socialScheduler_posts') || '[]');
      const updatedPosts = posts.filter(p => p.id !== postId);
      localStorage.setItem('socialScheduler_posts', JSON.stringify(updatedPosts));
    }
  }

  async getCalendarPosts(year, month) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.getCalendarPosts(year, month);
    return response.posts || [];
  }

  // Analytics methods
  async getAnalytics(range = '30d') {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.getAnalytics(range);
    return response;
  }

  async getPlatformAnalytics() {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.getPlatformAnalytics();
    return response.platforms;
  }

  async addAnalytics(analyticsData) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    await apiService.addAnalytics(analyticsData);
  }

  // Settings methods
  async getSettings() {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.getSettings();
    return response.settings;
  }

  async updateSettings(settings) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    await apiService.updateSettings(settings);
  }

  async updateProfile(profileData) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.updateProfile(profileData);
    return response.user;
  }

  async getTeamUsers() {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.getTeamUsers();
    return response.users || [];
  }

  async addTeamUser(userData) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    await apiService.addTeamUser(userData);
  }

  async removeTeamUser(userId) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    await apiService.removeTeamUser(userId);
  }

  // Connected accounts methods
  async getConnectedAccounts() {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.getConnectedAccounts();
    return response.accounts || [];
  }

  async connectAccount(accountData) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.connectAccount(accountData);
    return response.account;
  }

  async updateAccount(id, accountData) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.updateAccount(id, accountData);
    return response.account;
  }

  async disconnectAccount(accountId) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    await apiService.disconnectAccount(accountId);
  }

  async getAccountStats(accountId) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.getAccountStats(accountId);
    return response.stats;
  }

  // Files methods
  async getFiles() {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.getFiles();
    return response.files || [];
  }

  async createFile(fileData) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.createFile(fileData);
    return response.file;
  }

  async getFile(id) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.getFile(id);
    return response.file;
  }

  async updateFile(id, fileData) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.updateFile(id, fileData);
    return response.file;
  }

  async deleteFile(id) {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    await apiService.deleteFile(id);
  }

  async getDashboardStats() {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.getDashboardStats();
    return {
      totalReach: response.totalReach || 0,
      totalPosts: response.totalPosts || 0,
      scheduledPosts: response.scheduledPosts || 0,
      publishedPosts: response.publishedPosts || 0
    };
  }

  async getAnalyticsPreview() {
    await this.ensureInitialized();
    if (!this.isInitialized) {
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
    const response = await apiService.getAnalyticsPreview();
    return response.preview;
  }
}

// Create and export a singleton instance
const dataService = new DataService();
export default dataService;
export { DataService }; 