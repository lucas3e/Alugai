import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import { Mensagem, SendMensagemRequest } from '../types';

class MensagemService {
  async getMensagensByAluguel(aluguelId: number): Promise<Mensagem[]> {
    return apiService.get<Mensagem[]>(
      API_CONFIG.ENDPOINTS.MENSAGENS_ALUGUEL(aluguelId)
    );
  }

  async enviarMensagem(aluguelId: number, conteudo: string): Promise<Mensagem> {
    const request: SendMensagemRequest = {
      aluguelId,
      destinatarioId: 0, // Will be determined by backend
      conteudo,
    };
    
    return apiService.post<Mensagem>(
      API_CONFIG.ENDPOINTS.ENVIAR_MENSAGEM(aluguelId),
      request
    );
  }

  async getMensagensNaoLidas(): Promise<{ count: number }> {
    return apiService.get<{ count: number }>(
      API_CONFIG.ENDPOINTS.MENSAGENS_NAO_LIDAS
    );
  }
}

export const mensagemService = new MensagemService();
