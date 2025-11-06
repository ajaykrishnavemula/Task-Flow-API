import api from './api';
import type {
  User,
  AuthUser,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyEmailData,
  ApiResponse,
} from '@/types';

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthUser>> {
    const response = await api.post<ApiResponse<AuthUser>>('/auth/register', data);
    if (response.data.data) {
      this.setAuthData(response.data.data);
    }
    return response.data;
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    const response = await api.post<ApiResponse<AuthUser>>('/auth/login', credentials);
    if (response.data.data) {
      this.setAuthData(response.data.data);
    }
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    const response = await api.patch<ApiResponse<User>>('/auth/profile', data);
    if (response.data.data) {
      const currentUser = this.getStoredUser();
      if (currentUser) {
        this.setStoredUser({ ...currentUser, ...response.data.data });
      }
    }
    return response.data;
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>('/auth/change-password', data);
    return response.data;
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>('/auth/forgot-password', data);
    return response.data;
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>('/auth/reset-password', data);
    return response.data;
  }

  /**
   * Verify email with token
   */
  async verifyEmail(data: VerifyEmailData): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>('/auth/verify-email', data);
    return response.data;
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>('/auth/resend-verification');
    return response.data;
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatar: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<ApiResponse<{ avatar: string }>>(
      '/auth/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.data) {
      const currentUser = this.getStoredUser();
      if (currentUser) {
        this.setStoredUser({ ...currentUser, avatar: response.data.data.avatar });
      }
    }

    return response.data;
  }

  /**
   * Delete avatar
   */
  async deleteAvatar(): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>('/auth/avatar');
    
    const currentUser = this.getStoredUser();
    if (currentUser) {
      this.setStoredUser({ ...currentUser, avatar: '' });
    }

    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Get stored user
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Set authentication data in localStorage
   */
  private setAuthData(authUser: AuthUser): void {
    localStorage.setItem('token', authUser.token);
    const { token, ...user } = authUser;
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Set stored user
   */
  private setStoredUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear authentication data from localStorage
   */
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export default new AuthService();

