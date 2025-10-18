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
  // Listar equipamentos com filtros
  async list(filters?: EquipamentoFilters): Promise<EquipamentosResponse> {
    return await apiService.get<EquipamentosResponse>(
      API_CONFIG.ENDPOINTS.EQUIPAMENTOS,
      filters
    );
  }

  // Obter equipamento por ID
  async getById(id: number): Promise<Equipamento> {
    return await apiService.get<Equipamento>(
      API_CONFIG.ENDPOINTS.EQUIPAMENTO(id)
    );
  }

  // Criar equipamento
  async create(data: CreateEquipamentoRequest): Promise<Equipamento> {
    return await apiService.post<Equipamento>(
      API_CONFIG.ENDPOINTS.EQUIPAMENTOS,
      data
    );
  }

  // Atualizar equipamento
  async update(id: number, data: UpdateEquipamentoRequest): Promise<Equipamento> {
    return await apiService.put<Equipamento>(
      API_CONFIG.ENDPOINTS.EQUIPAMENTO(id),
      data
    );
  }

  // Deletar equipamento
  async delete(id: number): Promise<void> {
    await apiService.delete(API_CONFIG.ENDPOINTS.EQUIPAMENTO(id));
  }

  // Upload de imagens
  async uploadImages(id: number, imageUris: string[]): Promise<{ imagens: string[] }> {
    const formData = new FormData() as any;

    imageUris.forEach((uri, index) => {
      const filename = uri.split('/').pop() || `image${index}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('imagens', {
        uri,
        name: filename,
        type,
      });
    });

    return await apiService.uploadFile<{ imagens: string[] }>(
      API_CONFIG.ENDPOINTS.EQUIPAMENTO_IMAGENS(id),
      formData
    );
  }

  // Remover imagem
  async deleteImage(id: number, imageUrl: string): Promise<void> {
    await apiService.delete(
      `${API_CONFIG.ENDPOINTS.EQUIPAMENTO_IMAGENS(id)}?imageUrl=${encodeURIComponent(imageUrl)}`
    );
  }

  // Listar equipamentos de um usuário
  async listByUser(userId: number): Promise<Equipamento[]> {
    return await apiService.get<Equipamento[]>(
      API_CONFIG.ENDPOINTS.USUARIO_EQUIPAMENTOS(userId)
    );
  }
}

export const equipamentoService = new EquipamentoService();
