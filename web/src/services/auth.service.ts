import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Usuario,
} from '../types';

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.LOGIN,
      data
    );
    
    // Salvar token e usuário no localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.usuario));
    
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.REGISTER,
      data
    );
    
    // Salvar token e usuário no localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.usuario));
    
    return response;
  }

  async getProfile(): Promise<Usuario> {
    return await apiService.get<Usuario>(API_CONFIG.ENDPOINTS.ME);
  }

  async updateProfile(data: Partial<Usuario>): Promise<Usuario> {
    return await apiService.put<Usuario>(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): Usuario | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
