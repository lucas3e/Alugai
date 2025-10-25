export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/me',
    
    // Equipamentos
    EQUIPAMENTOS: '/equipamentos',
    EQUIPAMENTO_BY_ID: (id: number) => `/equipamentos/${id}`,
    MEUS_EQUIPAMENTOS: '/equipamentos/meus',
    
    // Aluguéis
    ALUGUEIS: '/alugueis',
    ALUGUEL_BY_ID: (id: number) => `/alugueis/${id}`,
    MEUS_ALUGUEIS: '/alugueis/meus',
    APROVAR_ALUGUEL: (id: number) => `/alugueis/${id}/aprovar`,
    RECUSAR_ALUGUEL: (id: number) => `/alugueis/${id}/recusar`,
    CANCELAR_ALUGUEL: (id: number) => `/alugueis/${id}/cancelar`,
    CONCLUIR_ALUGUEL: (id: number) => `/alugueis/${id}/concluir`,
    
    // Mensagens
    MENSAGENS: '/mensagens',
    MENSAGENS_ALUGUEL: (aluguelId: number) => `/mensagens/aluguel/${aluguelId}`,
    MARCAR_LIDA: (id: number) => `/mensagens/${id}/marcar-lida`,
    
    // Avaliações
    AVALIACOES: '/avaliacoes',
    AVALIACOES_EQUIPAMENTO: (equipamentoId: number) => `/avaliacoes/equipamento/${equipamentoId}`,
    AVALIACOES_USUARIO: (usuarioId: number) => `/avaliacoes/usuario/${usuarioId}`,
    
    // Usuários
    USUARIO_BY_ID: (id: number) => `/usuarios/${id}`,
    
    // Pagamentos
    INICIAR_PAGAMENTO: (aluguelId: number) => `/pagamentos/iniciar/${aluguelId}`,
    PAGAMENTO_BY_ID: (id: number) => `/pagamentos/${id}`,
    MINHAS_TRANSACOES: '/pagamentos/usuario/minhas-transacoes',
  },
};
