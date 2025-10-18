import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import { Avaliacao, CreateAvaliacaoRequest, AvaliacoesResponse } from '../types';

class AvaliacaoService {
  // Criar avaliação
  async create(data: CreateAvaliacaoRequest): Promise<Avaliacao> {
    return await apiService.post<Avaliacao>(
      API_CONFIG.ENDPOINTS.AVALIACOES,
      data
    );
  }

  // Obter avaliação por ID
  async getById(id: number): Promise<Avaliacao> {
    return await apiService.get<Avaliacao>(
      API_CONFIG.ENDPOINTS.AVALIACAO(id)
    );
  }

  // Listar avaliações de um equipamento
  async listByEquipamento(equipamentoId: number): Promise<AvaliacoesResponse> {
    return await apiService.get<AvaliacoesResponse>(
      API_CONFIG.ENDPOINTS.AVALIACOES_EQUIPAMENTO(equipamentoId)
    );
  }

  // Listar avaliações de um usuário
  async listByUsuario(usuarioId: number): Promise<AvaliacoesResponse> {
    return await apiService.get<AvaliacoesResponse>(
      API_CONFIG.ENDPOINTS.AVALIACOES_USUARIO(usuarioId)
    );
  }

  // Deletar avaliação
  async delete(id: number): Promise<void> {
    await apiService.delete(API_CONFIG.ENDPOINTS.AVALIACAO(id));
  }
}

export const avaliacaoService = new AvaliacaoService();
