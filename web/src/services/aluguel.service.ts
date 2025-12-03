import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import {
  Aluguel,
  AlugueisResponse,
  CreateAluguelRequest,
} from '../types';

class AluguelService {
  async list(): Promise<AlugueisResponse> {
    return await apiService.get<AlugueisResponse>(
      API_CONFIG.ENDPOINTS.ALUGUEIS
    );
  }

  async getById(id: number): Promise<Aluguel> {
    return await apiService.get<Aluguel>(
      API_CONFIG.ENDPOINTS.ALUGUEL_BY_ID(id)
    );
  }

getMeus(tipo: "locatario" | "proprietario"): Promise<Aluguel[]> {
    return apiService.get(`${API_CONFIG.ENDPOINTS.MEUS_ALUGUEIS}?tipo=${tipo}`);
}


  async create(data: CreateAluguelRequest): Promise<Aluguel> {
    return await apiService.post<Aluguel>(
      API_CONFIG.ENDPOINTS.ALUGUEIS,
      data
    );
  }

  async aprovar(id: number): Promise<Aluguel> {
    return await apiService.put<Aluguel>(
      API_CONFIG.ENDPOINTS.APROVAR_ALUGUEL(id),
      {}
    );
  }

  async recusar(id: number): Promise<Aluguel> {
    return await apiService.put<Aluguel>(
      API_CONFIG.ENDPOINTS.RECUSAR_ALUGUEL(id),
      {}
    );
  }

  async cancelar(id: number): Promise<Aluguel> {
    return await apiService.put<Aluguel>(
      API_CONFIG.ENDPOINTS.CANCELAR_ALUGUEL(id),
      {}
    );
  }

  async concluir(id: number): Promise<Aluguel> {
    return await apiService.put<Aluguel>(
      API_CONFIG.ENDPOINTS.CONCLUIR_ALUGUEL(id),
      {}
    );
  }

  async confirmarDevolucao(id: number): Promise<Aluguel> {
    return await apiService.put<Aluguel>(
      API_CONFIG.ENDPOINTS.CONFIRMAR_DEVOLUCAO(id),
      {}
    );
  }
}

export const aluguelService = new AluguelService();
