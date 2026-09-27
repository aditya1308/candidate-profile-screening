import { candidateStorageService } from './candidateStorageService.js';

const API_BASE_URL = 'http://localhost:8092';

export const candidateAuthService = {
  /**
   * Login candidate with email/username and password
   * @param {string} email - Email or username
   * @param {string} password - Password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(email, password) {
    try {
      const payload = {
        email: email.trim(),
        username: email.trim(),
        password: password
      };

      const response = await fetch(`${API_BASE_URL}/api/candidate/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Login failed';

        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorJson.error) {
            errorMessage = errorJson.error;
          }
        } catch {
          errorMessage = errorText || `HTTP error! status: ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      const rawResponse = await response.text();
      let token = rawResponse.trim();
      let userInfo = null;

      try {
        const parsed = JSON.parse(rawResponse);
        if (parsed.token) {
          token = parsed.token;
          userInfo = {
            id: parsed.id,
            email: parsed.email,
            name: parsed.name,
            role: parsed.role || 'CANDIDATE'
          };
        }
      } catch {
        // Plain text token response
      }

      if (!token) {
        throw new Error('No authentication token received');
      }

      // Store token
      candidateStorageService.setToken(token);

      // Decode token for user details if not already present from response
      if (!userInfo) {
        userInfo = this.decodeToken(token) || {
          email: email.trim(),
          name: email.trim(),
          role: 'CANDIDATE'
        };
      }

      candidateStorageService.setUser(userInfo);

      return { token, user: userInfo };
    } catch (error) {
      console.error('Candidate login error:', error);
      throw error;
    }
  },

  /**
   * Register new candidate account
   * @param {object} candidateData - { name, email, password, phoneNumber }
   */
  async register(candidateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/candidate/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify(candidateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Registration failed';
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorJson.error) {
            errorMessage = errorJson.error;
          }
        } catch {
          errorMessage = errorText || `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const text = await response.text();
      return { success: true, message: text };
    } catch (error) {
      console.error('Candidate registration error:', error);
      throw error;
    }
  },

  /**
   * Get candidate profile using stored JWT
   */
  async getProfile() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/candidate/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching candidate profile:', error);
      throw error;
    }
  },

  /**
   * Decode JWT token
   */
  decodeToken(token) {
    try {
      if (!token || typeof token !== 'string') return null;
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      const paddedBase64 = pad ? base64 + new Array(5 - pad).join('=') : base64;

      const jsonPayload = decodeURIComponent(
        atob(paddedBase64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded = JSON.parse(jsonPayload);
      return {
        email: decoded.sub || decoded.email,
        name: decoded.fullName || decoded.name || decoded.sub,
        role: decoded.role || 'CANDIDATE',
        exp: decoded.exp
      };
    } catch (err) {
      console.error('Failed to decode token:', err);
      return null;
    }
  },

  /**
   * Check if candidate is authenticated
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = this.decodeToken(token);
      if (!decoded) return false;
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  getToken() {
    return candidateStorageService.getToken();
  },

  getUser() {
    return candidateStorageService.getUser();
  },

  async getApplications(candidateId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/applications/candidate/${candidateId}`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  logout() {
    candidateStorageService.clear();
  }
};
