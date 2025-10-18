// Configuração da API
// Para desenvolvimento local, use o IP da sua máquina ao invés de localhost
// quando testar em dispositivo físico

export const API_CONFIG = {
  // Altere para o IP da sua máquina se estiver testando em dispositivo físico
  // Exemplo: 'http://192.168.1.100:5000/api'
  BASE_URL: 'http://localhost:5000/api',
  
  TIMEOUT: 30000, // 30 segundos
  
  ENDPOINTS: {
    // Auth
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/me',
    
    // Usuários
    USUARIO: (id: number) => `/usuarios/${id}`,
    USUARIO_EQUIPAMENTOS: (id: number) => `/usuarios/${id}/equipamentos`,
    UPLOAD_FOTO_PERFIL: '/usuarios/foto-perfil',
    DELETE_FOTO_PERFIL: '/usuarios/foto-perfil',
    
    // Equipamentos
    EQUIPAMENTOS: '/equipamentos',
    EQUIPAMENTO: (id: number) => `/equipamentos/${id}`,
    EQUIPAMENTO_IMAGENS: (id: number) => `/equipamentos/${id}/imagens`,
    
    // Aluguéis
    ALUGUEIS: '/alugueis',
    ALUGUEL: (id: number) => `/alugueis/${id}`,
    ACEITAR_ALUGUEL: (id: number) => `/alugueis/${id}/aceitar`,
    RECUSAR_ALUGUEL: (id: number) => `/alugueis/${id}/recusar`,
    CANCELAR_ALUGUEL: (id: number) => `/alugueis/${id}/cancelar`,
    CONCLUIR_ALUGUEL: (id: number) => `/alugueis/${id}/concluir`,
    
    // Mensagens
    MENSAGENS: (aluguelId: number) => `/alugueis/${aluguelId}/mensagens`,
    MENSAGENS_NAO_LIDAS: '/mensagens/nao-lidas',
    
    // Avaliações
    AVALIACOES: '/avaliacoes',
    AVALIACAO: (id: number) => `/avaliacoes/${id}`,
    AVALIACOES_EQUIPAMENTO: (id: number) => `/avaliacoes/equipamento/${id}`,
    AVALIACOES_USUARIO: (id: number) => `/avaliacoes/usuario/${id}`,
    
    // Pagamentos
    INICIAR_PAGAMENTO: (aluguelId: number) => `/pagamentos/iniciar/${aluguelId}`,
    TRANSACAO: (id: number) => `/pagamentos/${id}`,
    MINHAS_TRANSACOES: '/pagamentos/usuario/minhas-transacoes',
  }
};
