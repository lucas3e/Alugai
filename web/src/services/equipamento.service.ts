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
    // Primeiro criar o equipamento sem imagens
    const equipamentoData = {
      titulo: data.titulo,
      descricao: data.descricao,
      categoria: data.categoria,
      precoPorDia: data.precoPorDia,
      cidade: data.cidade,
      uf: data.uf,
      endereco: data.endereco,
    };

    const equipamento = await apiService.post<Equipamento>(
      API_CONFIG.ENDPOINTS.EQUIPAMENTOS,
      equipamentoData
    );

    // Se houver imagens, fazer upload separadamente
    if (data.imagens && data.imagens.length > 0) {
      const formData = new FormData();
      data.imagens.forEach((imagem) => {
        formData.append('imagens', imagem);
      });

      await apiService.post(
        `${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${equipamento.id}/imagens`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }

    return equipamento;
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
