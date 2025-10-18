import { apiService } from './api.service';
import { storageService } from './storage.service';
import { API_CONFIG } from '../config/api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Usuario,
} from '../types';

class AuthService {
  // Registrar novo usuário
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.REGISTER,
      data
    );
    
    // Salvar token e usuário
    await storageService.setToken(response.token);
    await storageService.setUser(response.usuario);
    
    return response;
  }

  // Login
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.LOGIN,
      data
    );
    
    // Salvar token e usuário
    await storageService.setToken(response.token);
    await storageService.setUser(response.usuario);
    
    return response;
  }

  // Logout
  async logout(): Promise<void> {
    await storageService.clearAuth();
  }

  // Obter perfil do usuário autenticado
  async getMe(): Promise<Usuario> {
    const response = await apiService.get<Usuario>(API_CONFIG.ENDPOINTS.ME);
    await storageService.setUser(response);
    return response;
  }

  // Atualizar perfil
  async updateProfile(data: Partial<RegisterRequest>): Promise<Usuario> {
    const response = await apiService.put<Usuario>(
      API_CONFIG.ENDPOINTS.UPDATE_PROFILE,
      data
    );
    await storageService.setUser(response);
    return response;
  }

  // Verificar se está autenticado
  async isAuthenticated(): Promise<boolean> {
    const token = await storageService.getToken();
    return !!token;
  }

  // Obter usuário do storage
  async getCurrentUser(): Promise<Usuario | null> {
    return await storageService.getUser();
  }

  // Upload de foto de perfil
  async uploadFotoPerfil(imageUri: string): Promise<{ fotoUrl: string }> {
    const formData = new FormData();
    
    // Extrair nome e tipo do arquivo
    const filename = imageUri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('foto', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    return await apiService.uploadFile<{ fotoUrl: string }>(
      API_CONFIG.ENDPOINTS.UPLOAD_FOTO_PERFIL,
      formData
    );
  }

  // Remover foto de perfil
  async deleteFotoPerfil(): Promise<void> {
    await apiService.delete(API_CONFIG.ENDPOINTS.DELETE_FOTO_PERFIL);
  }
}

export const authService = new AuthService();
