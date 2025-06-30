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
      throw new Error('Backend API is not available. Please ensure the Cloudflare Workers backend is running.');
    }
  }

  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initializeService();
    }
  }

  // Authentication methods
  async login(email, password) {
    await this.ensureInitialized();
    try {
      const response = await apiService.login(email, password);
      return { success: true, user: response.user, token: response.token };
    } catch (error) {
      return { success: false, error: error.message };
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
    const response = await apiService.getPosts(status);
    return response.posts || [];
  }

  async getPost(id) {
    await this.ensureInitialized();
    const response = await apiService.getPost(id);
    return response.post;
  }

  async getDrafts() {
    return this.getPosts('draft');
  }

  async savePost(postData, status = 'draft') {
    await this.ensureInitialized();
    
    const postPayload = {
      ...postData,
      status,
      scheduledDate: postData.scheduledDate,
      scheduledTime: postData.scheduledTime
    };

    if (postData.id && postData.id !== Date.now()) {
      // Update existing post
      const response = await apiService.updatePost(postData.id, postPayload);
      return response.post;
    } else {
      // Create new post
      const response = await apiService.createPost(postPayload);
      return response.post;
    }
  }

  async deletePost(postId) {
    await this.ensureInitialized();
    await apiService.deletePost(postId);
  }

  async getCalendarPosts(year, month) {
    await this.ensureInitialized();
    const response = await apiService.getCalendarPosts(year, month);
    return response.posts || [];
  }

  // Analytics methods
  async getAnalytics(range = '30d') {
    await this.ensureInitialized();
    const response = await apiService.getAnalytics(range);
    return response;
  }

  async getPlatformAnalytics() {
    await this.ensureInitialized();
    const response = await apiService.getPlatformAnalytics();
    return response.platforms;
  }

  async addAnalytics(analyticsData) {
    await this.ensureInitialized();
    await apiService.addAnalytics(analyticsData);
  }

  // Settings methods
  async getSettings() {
    await this.ensureInitialized();
    const response = await apiService.getSettings();
    return response.settings;
  }

  async updateSettings(settings) {
    await this.ensureInitialized();
    await apiService.updateSettings(settings);
  }

  async updateProfile(profileData) {
    await this.ensureInitialized();
    const response = await apiService.updateProfile(profileData);
    return response.user;
  }

  async getTeamUsers() {
    await this.ensureInitialized();
    const response = await apiService.getTeamUsers();
    return response.users || [];
  }

  async addTeamUser(userData) {
    await this.ensureInitialized();
    await apiService.addTeamUser(userData);
  }

  async removeTeamUser(userId) {
    await this.ensureInitialized();
    await apiService.removeTeamUser(userId);
  }

  // Connected accounts methods
  async getConnectedAccounts() {
    await this.ensureInitialized();
    const response = await apiService.getConnectedAccounts();
    return response.accounts || [];
  }

  async connectAccount(accountData) {
    await this.ensureInitialized();
    const response = await apiService.connectAccount(accountData);
    return response.account;
  }

  async updateAccount(id, accountData) {
    await this.ensureInitialized();
    const response = await apiService.updateAccount(id, accountData);
    return response.account;
  }

  async disconnectAccount(accountId) {
    await this.ensureInitialized();
    await apiService.disconnectAccount(accountId);
  }

  async getAccountStats(accountId) {
    await this.ensureInitialized();
    const response = await apiService.getAccountStats(accountId);
    return response.stats;
  }

  // Files methods
  async getFiles() {
    await this.ensureInitialized();
    const response = await apiService.getFiles();
    return response.files || [];
  }

  async createFile(fileData) {
    await this.ensureInitialized();
    const response = await apiService.createFile(fileData);
    return response.file;
  }

  async getFile(id) {
    await this.ensureInitialized();
    const response = await apiService.getFile(id);
    return response.file;
  }

  async updateFile(id, fileData) {
    await this.ensureInitialized();
    const response = await apiService.updateFile(id, fileData);
    return response.file;
  }

  async deleteFile(id) {
    await this.ensureInitialized();
    await apiService.deleteFile(id);
  }

  // Dashboard methods
  async getDashboardStats() {
    await this.ensureInitialized();
    const response = await apiService.getDashboardStats();
    return response.stats;
  }

  async getAnalyticsPreview() {
    await this.ensureInitialized();
    const response = await apiService.getAnalyticsPreview();
    return response.preview;
  }
}

// Create and export a singleton instance
const dataService = new DataService();
export default dataService; 