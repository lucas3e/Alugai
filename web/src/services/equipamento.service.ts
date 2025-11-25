import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import {
  Equipamento,
  EquipamentosResponse,
  CreateEquipamentoRequest,
  UpdateEquipamentoRequest,
  EquipamentoFilters,
} from '../types';

class EquipamentoService {
  async list(filters?: EquipamentoFilters): Promise<EquipamentosResponse> {
    return await apiService.get<EquipamentosResponse>(
      API_CONFIG.ENDPOINTS.EQUIPAMENTOS,
      filters
    );
  }

  async getById(id: number): Promise<Equipamento> {
    return await apiService.get<Equipamento>(
      API_CONFIG.ENDPOINTS.EQUIPAMENTO_BY_ID(id)
    );
  }

  async getMeus(): Promise<Equipamento[]> {
    return await apiService.get<Equipamento[]>(
      API_CONFIG.ENDPOINTS.MEUS_EQUIPAMENTOS
    );
  }

  async create(data: CreateEquipamentoRequest): Promise<Equipamento> {
    const equipamento = await apiService.post<Equipamento>(
      API_CONFIG.ENDPOINTS.EQUIPAMENTOS,
      data
    );

    return equipamento;
  }

  async uploadImagem(id: number, imagem: File): Promise<{ imagem: string }> {
    const formData = new FormData();
    formData.append('imagem', imagem);

    return await apiService.post<{ imagem: string }>(
      `${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${id}/imagem`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async removeImagem(id: number): Promise<void> {
    await apiService.delete(`${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${id}/imagem`);
  }

  async update(id: number, data: UpdateEquipamentoRequest): Promise<Equipamento> {
    return await apiService.put<Equipamento>(
      API_CONFIG.ENDPOINTS.EQUIPAMENTO_BY_ID(id),
      data
    );
  }

  async delete(id: number): Promise<void> {
    await apiService.delete(API_CONFIG.ENDPOINTS.EQUIPAMENTO_BY_ID(id));
  }
}

export const equipamentoService = new EquipamentoService();
