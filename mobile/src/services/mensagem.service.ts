import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import { Mensagem, SendMensagemRequest } from '../types';

class MensagemService {
  // Listar mensagens de um aluguel
  async list(aluguelId: number): Promise<Mensagem[]> {
    return await apiService.get<Mensagem[]>(
      API_CONFIG.ENDPOINTS.MENSAGENS(aluguelId)
    );
  }

  // Enviar mensagem
  async send(aluguelId: number, data: SendMensagemRequest): Promise<Mensagem> {
    return await apiService.post<Mensagem>(
      API_CONFIG.ENDPOINTS.MENSAGENS(aluguelId),
      data
    );
  }

  // Obter contagem de mensagens não lidas
  async getUnreadCount(): Promise<{ count: number }> {
    return await apiService.get<{ count: number }>(
      API_CONFIG.ENDPOINTS.MENSAGENS_NAO_LIDAS
    );
  }
}

export const mensagemService = new MensagemService();
