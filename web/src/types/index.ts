// Tipos de Usuário
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cidade: string;
  uf: string;
  fotoPerfil: string | null;
  telefone: string | null;
  mediaAvaliacoes: number | null;
  totalAvaliacoes: number;
  dataCriacao: string;
}

// Tipos de Equipamento
export interface Equipamento {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  precoPorDia: number;
  cidade: string;
  uf: string;
  endereco: string | null;
  disponivel: boolean;
  usuarioId: number;
  nomeProprietario: string;
  fotoPerfilProprietario: string | null;
  cidadeProprietario: string;
  ufProprietario: string;
  imagens: string[];
  mediaAvaliacoes: number | null;
  totalAvaliacoes: number;
  dataCriacao: string;
}

// Tipos de Aluguel
export interface Aluguel {
  id: number;
  equipamentoId: number;
  equipamentoTitulo: string;
  equipamentoImagem: string | null;
  locatarioId: number;
  locatarioNome: string;
  locatarioFoto: string | null;
  proprietarioId: number;
  proprietarioNome: string;
  proprietarioFoto: string | null;
  dataInicio: string;
  dataFim: string;
  valorTotal: number;
  status: 'Pendente' | 'Aprovado' | 'Recusado' | 'EmAndamento' | 'Concluido' | 'Cancelado';
  dataSolicitacao: string;
}

// Tipos de Mensagem
export interface Mensagem {
  id: number;
  aluguelId: number;
  remetenteId: number;
  remetenteNome: string;
  destinatarioId: number;
  destinatarioNome: string;
  conteudo: string;
  dataEnvio: string;
  lida: boolean;
}

// Tipos de Avaliação
export interface Avaliacao {
  id: number;
  aluguelId: number;
  avaliadorId: number;
  avaliadoId: number;
  nota: number;
  comentario: string | null;
  tipoAvaliacao: 'Equipamento' | 'Usuario';
  dataAvaliacao: string;
  nomeAvaliador: string;
  fotoPerfilAvaliador: string | null;
}

// Tipos de Transação
export interface Transacao {
  id: number;
  aluguelId: number;
  valorPago: number;
  status: 'Pendente' | 'Aprovado' | 'Recusado' | 'Cancelado';
  mercadoPagoId: string | null;
  dataCriacao: string;
}

// DTOs de Request
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  cidade: string;
  uf: string;
  telefone?: string;
}

export interface CreateEquipamentoRequest {
  titulo: string;
  descricao: string;
  categoria: string;
  precoPorDia: number;
  cidade: string;
  uf: string;
  endereco?: string;
  imagens?: File[];
}

export interface UpdateEquipamentoRequest {
  titulo?: string;
  descricao?: string;
  categoria?: string;
  precoPorDia?: number;
  disponivel?: boolean;
}

export interface CreateAluguelRequest {
  equipamentoId: number;
  dataInicio: string;
  dataFim: string;
}

export interface CreateAvaliacaoRequest {
  aluguelId: number;
  nota: number;
  comentario?: string;
  tipoAvaliacao: 'Equipamento' | 'Usuario';
}

export interface SendMensagemRequest {
  aluguelId: number;
  destinatarioId: number;
  conteudo: string;
}

// DTOs de Response
export interface AuthResponse {
  token: string;
  expiresAt: string;
  usuario: Usuario;
}

export interface EquipamentosResponse {
  data: Equipamento[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AlugueisResponse {
  alugueis: Aluguel[];
  total: number;
}

export interface MensagensResponse {
  mensagens: Mensagem[];
  total: number;
}

export interface AvaliacoesResponse {
  avaliacoes: Avaliacao[];
  mediaNotas: number;
  totalAvaliacoes: number;
}

// Filtros
export interface EquipamentoFilters {
  categoria?: string;
  cidade?: string;
  uf?: string;
  precoMin?: number;
  precoMax?: number;
  busca?: string;
  pagina?: number;
  itensPorPagina?: number;
}

// Estados brasileiros
export const ESTADOS_BRASILEIROS = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
];

// Categorias de equipamentos
export const CATEGORIAS_EQUIPAMENTOS = [
  'Ferramentas',
  'Eletrônicos',
  'Jardinagem',
  'Construção',
  'Esportes',
  'Festa',
  'Cozinha',
  'Limpeza',
  'Outros',
];
