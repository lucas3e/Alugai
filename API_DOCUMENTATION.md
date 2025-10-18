# 📚 Documentação da API - Alugai

## 🔗 Base URL

- **Desenvolvimento**: `http://localhost:5000/api`
- **Produção**: `https://api.alugai.com/api`

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação. Após o login, inclua o token no header de todas as requisições protegidas:

```
Authorization: Bearer {seu_token_jwt}
```

---

## 📋 Endpoints

### 🔐 Autenticação

#### POST /auth/register
Registrar novo usuário.

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "cidade": "São Paulo",
  "uf": "SP",
  "telefone": "11999999999"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-02T00:00:00Z",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "cidade": "São Paulo",
    "uf": "SP",
    "fotoPerfil": null,
    "telefone": "11999999999",
    "mediaAvaliacoes": null,
    "totalAvaliacoes": 0,
    "dataCriacao": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /auth/login
Fazer login.

**Request Body:**
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-02T00:00:00Z",
  "usuario": { ... }
}
```

#### GET /auth/me
Obter perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "cidade": "São Paulo",
  "uf": "SP",
  "fotoPerfil": "/uploads/perfis/abc123.jpg",
  "telefone": "11999999999",
  "mediaAvaliacoes": 4.5,
  "totalAvaliacoes": 10,
  "dataCriacao": "2024-01-01T00:00:00Z"
}
```

#### PUT /auth/me
Atualizar perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nome": "João Silva Santos",
  "email": "joao.novo@example.com",
  "senha": "novaSenha123",
  "cidade": "Rio de Janeiro",
  "uf": "RJ",
  "telefone": "21999999999"
}
```

---

### 👤 Usuários

#### GET /usuarios/{id}
Obter perfil público de um usuário.

**Response (200):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "cidade": "São Paulo",
  "uf": "SP",
  "fotoPerfil": "/uploads/perfis/abc123.jpg",
  "mediaAvaliacoes": 4.5,
  "totalAvaliacoes": 10,
  "dataCriacao": "2024-01-01T00:00:00Z"
}
```

#### GET /usuarios/{id}/equipamentos
Listar equipamentos de um usuário.

**Response (200):**
```json
[
  {
    "id": 1,
    "titulo": "Furadeira Elétrica",
    "descricao": "Furadeira profissional 500W",
    "categoria": "Ferramentas",
    "precoPorDia": 25.00,
    "cidade": "São Paulo",
    "uf": "SP",
    "imagens": ["/uploads/equipamentos/img1.jpg"],
    "disponivel": true,
    "nomeProprietario": "João Silva",
    "fotoPerfilProprietario": "/uploads/perfis/abc123.jpg",
    "mediaAvaliacoes": 4.8,
    "totalAvaliacoes": 5
  }
]
```

#### POST /usuarios/foto-perfil
Upload de foto de perfil.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
```
foto: [arquivo de imagem]
```

**Response (200):**
```json
{
  "fotoUrl": "/uploads/perfis/abc123.jpg"
}
```

---

### 📦 Equipamentos

#### GET /equipamentos
Listar equipamentos com filtros.

**Query Parameters:**
- `categoria` (string): Filtrar por categoria
- `cidade` (string): Filtrar por cidade
- `uf` (string): Filtrar por UF
- `precoMin` (decimal): Preço mínimo por dia
- `precoMax` (decimal): Preço máximo por dia
- `busca` (string): Buscar no título e descrição
- `page` (int): Número da página (padrão: 1)
- `pageSize` (int): Itens por página (padrão: 10)

**Exemplo:**
```
GET /equipamentos?categoria=Ferramentas&cidade=São Paulo&page=1&pageSize=10
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "titulo": "Furadeira Elétrica",
      "descricao": "Furadeira profissional 500W",
      "categoria": "Ferramentas",
      "precoPorDia": 25.00,
      "cidade": "São Paulo",
      "uf": "SP",
      "imagens": ["/uploads/equipamentos/img1.jpg"],
      "disponivel": true,
      "nomeProprietario": "João Silva",
      "fotoPerfilProprietario": "/uploads/perfis/abc123.jpg",
      "mediaAvaliacoes": 4.8,
      "totalAvaliacoes": 5
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 50,
  "totalPages": 5
}
```

#### GET /equipamentos/{id}
Obter equipamento por ID.

**Response (200):**
```json
{
  "id": 1,
  "titulo": "Furadeira Elétrica",
  "descricao": "Furadeira profissional 500W",
  "categoria": "Ferramentas",
  "precoPorDia": 25.00,
  "cidade": "São Paulo",
  "uf": "SP",
  "endereco": "Rua das Flores, 123",
  "imagens": [
    "/uploads/equipamentos/img1.jpg",
    "/uploads/equipamentos/img2.jpg"
  ],
  "disponivel": true,
  "usuarioId": 1,
  "nomeProprietario": "João Silva",
  "fotoPerfilProprietario": "/uploads/perfis/abc123.jpg",
  "mediaAvaliacoes": 4.8,
  "totalAvaliacoes": 5,
  "dataCriacao": "2024-01-01T00:00:00Z"
}
```

#### POST /equipamentos
Criar novo equipamento.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "titulo": "Furadeira Elétrica",
  "descricao": "Furadeira profissional 500W",
  "categoria": "Ferramentas",
  "precoPorDia": 25.00,
  "cidade": "São Paulo",
  "uf": "SP",
  "endereco": "Rua das Flores, 123"
}
```

**Response (201):**
```json
{
  "id": 1,
  "titulo": "Furadeira Elétrica",
  ...
}
```

#### PUT /equipamentos/{id}
Atualizar equipamento.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "titulo": "Furadeira Elétrica Profissional",
  "descricao": "Furadeira profissional 500W com maleta",
  "precoPorDia": 30.00,
  "disponivel": true
}
```

#### DELETE /equipamentos/{id}
Deletar equipamento.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204):** No Content

#### POST /equipamentos/{id}/imagens
Upload de imagens do equipamento.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
```
imagens: [arquivo1, arquivo2, ...]
```

**Response (200):**
```json
{
  "imagens": [
    "/uploads/equipamentos/img1.jpg",
    "/uploads/equipamentos/img2.jpg"
  ]
}
```

---

### 📆 Aluguéis

#### GET /alugueis
Listar meus aluguéis.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `tipo` (string): "locatario" ou "proprietario"
- `status` (string): "Pendente", "Aceito", "Recusado", "EmAndamento", "Concluido", "Cancelado"

**Response (200):**
```json
[
  {
    "id": 1,
    "equipamentoId": 1,
    "tituloEquipamento": "Furadeira Elétrica",
    "imagensEquipamento": ["/uploads/equipamentos/img1.jpg"],
    "locatarioId": 2,
    "nomeLocatario": "Maria Santos",
    "fotoPerfilLocatario": "/uploads/perfis/maria.jpg",
    "proprietarioId": 1,
    "nomeProprietario": "João Silva",
    "fotoPerfilProprietario": "/uploads/perfis/joao.jpg",
    "dataInicio": "2024-01-10",
    "dataFim": "2024-01-15",
    "valorTotal": 125.00,
    "status": "Aceito",
    "dataSolicitacao": "2024-01-05T10:00:00Z",
    "dataResposta": "2024-01-05T14:00:00Z",
    "observacaoProprietario": "Equipamento disponível!",
    "podeAvaliar": false,
    "jaAvaliado": false
  }
]
```

#### POST /alugueis
Solicitar aluguel.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "equipamentoId": 1,
  "dataInicio": "2024-01-10",
  "dataFim": "2024-01-15"
}
```

**Response (201):**
```json
{
  "id": 1,
  "equipamentoId": 1,
  "valorTotal": 125.00,
  "status": "Pendente",
  ...
}
```

#### PUT /alugueis/{id}/aceitar
Aceitar solicitação de aluguel (proprietário).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
"Equipamento disponível! Pode retirar amanhã."
```

#### PUT /alugueis/{id}/recusar
Recusar solicitação de aluguel (proprietário).

**Request Body:**
```json
"Desculpe, equipamento não está disponível neste período."
```

#### PUT /alugueis/{id}/cancelar
Cancelar aluguel.

#### PUT /alugueis/{id}/concluir
Concluir aluguel (proprietário).

---

### 💬 Mensagens

#### GET /alugueis/{aluguelId}/mensagens
Listar mensagens de um aluguel.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "aluguelId": 1,
    "remetenteId": 1,
    "nomeRemetente": "João Silva",
    "fotoPerfilRemetente": "/uploads/perfis/joao.jpg",
    "conteudo": "Olá! Quando posso retirar o equipamento?",
    "dataEnvio": "2024-01-05T15:00:00Z",
    "lida": true,
    "dataLeitura": "2024-01-05T15:30:00Z"
  }
]
```

#### POST /alugueis/{aluguelId}/mensagens
Enviar mensagem.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "conteudo": "Olá! Quando posso retirar o equipamento?"
}
```

#### GET /mensagens/nao-lidas
Obter contagem de mensagens não lidas.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "count": 5
}
```

---

### 🌟 Avaliações

#### POST /avaliacoes
Criar avaliação.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "aluguelId": 1,
  "nota": 5,
  "comentario": "Excelente equipamento! Muito bem conservado.",
  "tipoAvaliacao": "Equipamento"
}
```

**Tipos de Avaliação:**
- `"Equipamento"`: Locatário avalia o equipamento/proprietário
- `"Usuario"`: Proprietário avalia o locatário

#### GET /avaliacoes/equipamento/{equipamentoId}
Listar avaliações de um equipamento.

**Response (200):**
```json
{
  "avaliacoes": [
    {
      "id": 1,
      "nota": 5,
      "comentario": "Excelente equipamento!",
      "nomeAvaliador": "Maria Santos",
      "fotoPerfilAvaliador": "/uploads/perfis/maria.jpg",
      "dataAvaliacao": "2024-01-16T10:00:00Z"
    }
  ],
  "mediaNotas": 4.8,
  "totalAvaliacoes": 5
}
```

#### GET /avaliacoes/usuario/{usuarioId}
Listar avaliações de um usuário.

---

### 💰 Pagamentos

#### POST /pagamentos/iniciar/{aluguelId}
Iniciar pagamento de um aluguel.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "aluguelId": 1,
  "valorPago": 125.00,
  "status": "Pendente",
  "mercadoPagoId": "MP-abc123",
  "dataCriacao": "2024-01-10T10:00:00Z"
}
```

#### POST /pagamentos/webhook
Webhook do Mercado Pago (uso interno).

#### GET /pagamentos/{id}
Obter transação por ID.

#### GET /pagamentos/usuario/minhas-transacoes
Listar minhas transações.

---

## 📊 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Requisição bem-sucedida sem conteúdo |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

## 🔒 Segurança

- Todas as senhas são criptografadas com BCrypt
- Tokens JWT expiram em 24 horas (configurável)
- HTTPS obrigatório em produção
- Validação de entrada em todos os endpoints
- Rate limiting recomendado em produção

## 📝 Notas

- Todas as datas estão em formato ISO 8601 (UTC)
- Valores monetários em decimal com 2 casas decimais
- Imagens limitadas a 5MB cada
- Formatos de imagem aceitos: JPG, JPEG, PNG, GIF, WEBP

---

**Documentação gerada automaticamente pelo Swagger em:** http://localhost:5000
