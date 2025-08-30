import { storageService } from './storageService.js';

export const authService = {
  /**
   * Login with email and password
   * Returns JWT token on success
   */
  async login(email, password) {
    try {
      console.log('Attempting login with email:', email);
      
      const loginData = { email, password };
      console.log('Login data being sent:', loginData);
      
      // Use direct fetch for authentication to avoid adding auth headers
      const response = await fetch(`http://localhost:8092/admins/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        throw new Error(errorText || 'Login failed');
      }
      
      const token = await response.text();
      console.log('Token received:', token ? 'Yes' : 'No');
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Store the token in sessionStorage
      storageService.setItem('jwt_token', token);
      
      // Decode token to get user info (basic implementation)
      const userInfo = this.decodeToken(token);
      console.log('Decoded user info:', userInfo);
      
      // Extract role from token - backend sends role in uppercase
      if (userInfo.role) {
        userInfo.role = userInfo.role.toUpperCase();
      } else {
        // This is a fallback - ideally the role should come from the JWT token
        userInfo.role = 'HR'; // Default fallback
      }
      
      storageService.setUser(userInfo);
      
      return { token, user: userInfo };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register new admin user
   */
  async register(adminData) {
    try {
      console.log('Attempting registration with data:', adminData);
      
      // Use direct fetch for registration to avoid adding auth headers
      const response = await fetch(`http://localhost:8092/admins/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(adminData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration failed:', errorText);
        throw new Error(errorText || 'Registration failed');
      }
      
      const result = await response.text();
      console.log('Registration result:', result);
      return { message: result };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Onboard new user (SuperAdmin only)
   */
  async onboardUser(onboardData) {
    try {
      console.log('Attempting to onboard user with data:', onboardData);
      
      const response = await fetch(`http://localhost:8092/admins/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(onboardData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Onboarding failed:', errorText);
        throw new Error(errorText || 'Onboarding failed');
      }
      
      const result = await response.text();
      console.log('Onboarding result:', result);
      return { message: result };
    } catch (error) {
      console.error('Onboarding error:', error);
      throw error;
    }
  },

  /**
   * Get all interviewers (SuperAdmin and HR only)
   */
  async getAllInterviewers() {
    try {
      const response = await fetch(`http://localhost:8092/admins/interviewers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...this.getAuthHeader()
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch interviewers:', errorText);
        throw new Error(errorText || 'Failed to fetch interviewers');
      }
      
      const interviewers = await response.json();
      return interviewers;
    } catch (error) {
      console.error('Error fetching interviewers:', error);
      throw error;
    }
  },

  /**
   * Logout - clear stored tokens and user data
   */
  logout() {
    storageService.removeItem('jwt_token');
    storageService.removeUser();
  },

  /**
   * Get stored JWT token
   */
  getToken() {
    return storageService.getItem('jwt_token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    try {
      const decoded = this.decodeToken(token);
      return decoded && decoded.exp > Date.now() / 1000;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  },

  /**
   * Decode JWT token (basic implementation)
   * In production, you might want to use a library like jwt-decode
   */
  decodeToken(token) {
    try {
      if (!token || typeof token !== 'string') {
        return null;
      }
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Handle padding
      const pad = base64.length % 4;
      const paddedBase64 = pad ? base64 + new Array(5 - pad).join('=') : base64;
      
      const jsonPayload = decodeURIComponent(
        atob(paddedBase64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      
      const decoded = JSON.parse(jsonPayload);
      
      // Add some basic user info if not present
      if (!decoded.name && decoded.fullName) {
        decoded.name = decoded.fullName;
      } else if (!decoded.name && decoded.sub) {
        decoded.name = decoded.sub;
      }
      
      // Extract email from JWT - in our backend, email is stored in 'sub' field
      if (!decoded.email && decoded.sub) {
        decoded.email = decoded.sub;
      }
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  /**
   * Get authorization header with JWT token
   */
  getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};
