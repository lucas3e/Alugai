import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types';

const KEYS = {
  TOKEN: '@alugai:token',
  USER: '@alugai:user',
};

class StorageService {
  // Token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.TOKEN, token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  }

  // Usuário
  async getUser(): Promise<Usuario | null> {
    try {
      const userJson = await AsyncStorage.getItem(KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  }

  async setUser(user: Usuario): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  }

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.USER);
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
    }
  }

  // Limpar tudo
  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KEYS.TOKEN, KEYS.USER]);
    } catch (error) {
      console.error('Erro ao limpar autenticação:', error);
    }
  }
}

export const storageService = new StorageService();
