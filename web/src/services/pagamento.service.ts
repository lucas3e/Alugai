import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import { Transacao } from '../types';

class PagamentoService {
  async iniciarPagamento(aluguelId: number): Promise<Transacao> {
    return apiService.post<Transacao>(
      API_CONFIG.ENDPOINTS.INICIAR_PAGAMENTO(aluguelId)
    );
  }

  async getTransacaoById(id: number): Promise<Transacao> {
    return apiService.get<Transacao>(
      API_CONFIG.ENDPOINTS.PAGAMENTO_BY_ID(id)
    );
  }

  async getMinhasTransacoes(): Promise<Transacao[]> {
    return apiService.get<Transacao[]>(
      API_CONFIG.ENDPOINTS.MINHAS_TRANSACOES
    );
  }

  async getTransacaoByAluguelId(aluguelId: number): Promise<Transacao | null> {
    try {
      const transacoes = await this.getMinhasTransacoes();
      return transacoes.find(t => t.aluguelId === aluguelId) || null;
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      return null;
    }
  }
}

export const pagamentoService = new PagamentoService();
