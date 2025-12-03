import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import { Avaliacao, CreateAvaliacaoRequest, AvaliacoesResponse } from '../types';

class AvaliacaoService {
  async createAvaliacao(request: CreateAvaliacaoRequest): Promise<Avaliacao> {
    return apiService.post<Avaliacao>(
      API_CONFIG.ENDPOINTS.AVALIACOES,
      request
    );
  }

  async getAvaliacaoById(id: number): Promise<Avaliacao> {
    return apiService.get<Avaliacao>(
      API_CONFIG.ENDPOINTS.AVALIACAO_BY_ID(id)
    );
  }

  async getAvaliacoesByEquipamento(equipamentoId: number): Promise<AvaliacoesResponse> {
    return apiService.get<AvaliacoesResponse>(
      API_CONFIG.ENDPOINTS.AVALIACOES_EQUIPAMENTO(equipamentoId)
    );
  }

  async getAvaliacoesByUsuario(usuarioId: number): Promise<AvaliacoesResponse> {
    return apiService.get<AvaliacoesResponse>(
      API_CONFIG.ENDPOINTS.AVALIACOES_USUARIO(usuarioId)
    );
  }

  async deleteAvaliacao(id: number): Promise<void> {
    return apiService.delete(
      API_CONFIG.ENDPOINTS.DELETE_AVALIACAO(id)
    );
  }
}

export const avaliacaoService = new AvaliacaoService();
