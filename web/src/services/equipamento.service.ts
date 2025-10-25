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
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('descricao', data.descricao);
    formData.append('categoria', data.categoria);
    formData.append('precoPorDia', data.precoPorDia.toString());

    if (data.imagens && data.imagens.length > 0) {
      data.imagens.forEach((imagem) => {
        formData.append('imagens', imagem);
      });
    }

    return await apiService.post<Equipamento>(
      API_CONFIG.ENDPOINTS.EQUIPAMENTOS,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
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
