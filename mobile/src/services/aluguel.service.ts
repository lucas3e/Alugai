import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import { Aluguel, CreateAluguelRequest, AluguelStatus } from '../types';

class AluguelService {
  // Listar meus aluguéis
  async list(tipo?: 'locatario' | 'proprietario', status?: AluguelStatus): Promise<Aluguel[]> {
    const params: any = {};
    if (tipo) params.tipo = tipo;
    if (status) params.status = status;

    return await apiService.get<Aluguel[]>(
      API_CONFIG.ENDPOINTS.ALUGUEIS,
      params
    );
  }

  // Obter aluguel por ID
  async getById(id: number): Promise<Aluguel> {
    return await apiService.get<Aluguel>(
      API_CONFIG.ENDPOINTS.ALUGUEL(id)
    );
  }

  // Solicitar aluguel
  async create(data: CreateAluguelRequest): Promise<Aluguel> {
    return await apiService.post<Aluguel>(
      API_CONFIG.ENDPOINTS.ALUGUEIS,
      data
    );
  }

  // Aceitar solicitação (proprietário)
  async accept(id: number, observacao?: string): Promise<Aluguel> {
    return await apiService.put<Aluguel>(
      API_CONFIG.ENDPOINTS.ACEITAR_ALUGUEL(id),
      observacao
    );
  }

  // Recusar solicitação (proprietário)
  async reject(id: number, observacao?: string): Promise<Aluguel> {
    return await apiService.put<Aluguel>(
      API_CONFIG.ENDPOINTS.RECUSAR_ALUGUEL(id),
      observacao
    );
  }

  // Cancelar aluguel
  async cancel(id: number): Promise<Aluguel> {
    return await apiService.put<Aluguel>(
      API_CONFIG.ENDPOINTS.CANCELAR_ALUGUEL(id)
    );
  }

  // Concluir aluguel (proprietário)
  async complete(id: number): Promise<Aluguel> {
    return await apiService.put<Aluguel>(
      API_CONFIG.ENDPOINTS.CONCLUIR_ALUGUEL(id)
    );
  }
}

export const aluguelService = new AluguelService();
