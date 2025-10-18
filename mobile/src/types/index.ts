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

// Tipos de Autenticação
export interface AuthResponse {
  token: string;
  expiresAt: string;
  usuario: Usuario;
}

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

// Tipos de Equipamento
export interface Equipamento {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  precoPorDia: number;
  cidade: string;
  uf: string;
  endereco?: string;
  imagens: string[];
  disponivel: boolean;
  usuarioId: number;
  nomeProprietario: string;
  fotoPerfilProprietario: string | null;
  mediaAvaliacoes: number | null;
  totalAvaliacoes: number;
  dataCriacao: string;
}

export interface CreateEquipamentoRequest {
  titulo: string;
  descricao: string;
  categoria: string;
  precoPorDia: number;
  cidade: string;
  uf: string;
  endereco?: string;
}

export interface UpdateEquipamentoRequest {
  titulo?: string;
  descricao?: string;
  precoPorDia?: number;
  disponivel?: boolean;
}

export interface EquipamentosResponse {
  data: Equipamento[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Tipos de Aluguel
export type AluguelStatus = 
  | 'Pendente' 
  | 'Aceito' 
  | 'Recusado' 
  | 'EmAndamento' 
  | 'Concluido' 
  | 'Cancelado';

export interface Aluguel {
  id: number;
  equipamentoId: number;
  tituloEquipamento: string;
  imagensEquipamento: string[];
  locatarioId: number;
  nomeLocatario: string;
  fotoPerfilLocatario: string | null;
  proprietarioId: number;
  nomeProprietario: string;
  fotoPerfilProprietario: string | null;
  dataInicio: string;
  dataFim: string;
  valorTotal: number;
  status: AluguelStatus;
  dataSolicitacao: string;
  dataResposta: string | null;
  observacaoProprietario: string | null;
  podeAvaliar: boolean;
  jaAvaliado: boolean;
}

export interface CreateAluguelRequest {
  equipamentoId: number;
  dataInicio: string;
  dataFim: string;
}

// Tipos de Mensagem
export interface Mensagem {
  id: number;
  aluguelId: number;
  remetenteId: number;
  nomeRemetente: string;
  fotoPerfilRemetente: string | null;
  conteudo: string;
  dataEnvio: string;
  lida: boolean;
  dataLeitura: string | null;
}

export interface SendMensagemRequest {
  conteudo: string;
}

// Tipos de Avaliação
export type TipoAvaliacao = 'Equipamento' | 'Usuario';

export interface Avaliacao {
  id: number;
  nota: number;
  comentario: string | null;
  nomeAvaliador: string;
  fotoPerfilAvaliador: string | null;
  dataAvaliacao: string;
}

export interface CreateAvaliacaoRequest {
  aluguelId: number;
  nota: number;
  comentario?: string;
  tipoAvaliacao: TipoAvaliacao;
}

export interface AvaliacoesResponse {
  avaliacoes: Avaliacao[];
  mediaNotas: number;
  totalAvaliacoes: number;
}

// Tipos de Transação
export type TransacaoStatus = 'Pendente' | 'Aprovado' | 'Recusado' | 'Cancelado';

export interface Transacao {
  id: number;
  aluguelId: number;
  valorPago: number;
  status: TransacaoStatus;
  mercadoPagoId: string | null;
  dataCriacao: string;
  dataAtualizacao: string | null;
}

// Tipos de Filtros
export interface EquipamentoFilters {
  categoria?: string;
  cidade?: string;
  uf?: string;
  precoMin?: number;
  precoMax?: number;
  busca?: string;
  page?: number;
  pageSize?: number;
}

// Categorias de Equipamentos
export const CATEGORIAS = [
  'Ferramentas',
  'Eletrônicos',
  'Jardinagem',
  'Construção',
  'Esportes',
  'Festa',
  'Outros'
] as const;

export type Categoria = typeof CATEGORIAS[number];

// Estados do Brasil
export const ESTADOS = [
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
  { sigla: 'TO', nome: 'Tocantins' }
] as const;
