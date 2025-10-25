# 🚀 Guia Rápido - Alugai API

Este guia vai te ajudar a colocar a API rodando em **5 minutos**!

## ⚡ Início Rápido

### 1️⃣ Pré-requisitos

Certifique-se de ter instalado:
- ✅ [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- ✅ [PostgreSQL](https://www.postgresql.org/download/)

### 2️⃣ Configurar Banco de Dados

**Opção A: PostgreSQL Local**

```bash
# Criar banco de dados
psql -U postgres
CREATE DATABASE alugai_db;
\q
```

**Opção B: Docker (Recomendado)**

```bash
docker run --name postgres-alugai -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=alugai_db -p 5432:5432 -d postgres:14
```

### 3️⃣ Configurar a Aplicação

Edite o arquivo `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=alugai_db;Username=postgres;Password=postgres"
  },
  "JwtSettings": {
    "SecretKey": "minha-chave-super-secreta-com-32-caracteres-ou-mais"
  }
}
```

### 4️⃣ Instalar Dependências

```bash
dotnet restore
```

### 5️⃣ Criar o Banco de Dados

```bash
# Instalar ferramenta EF (se necessário)
dotnet tool install --global dotnet-ef

# Criar migration
dotnet ef migrations add InitialCreate

# Aplicar ao banco
dotnet ef database update
```

### 6️⃣ Executar a API

```bash
dotnet run
```

ou com hot reload:

```bash
dotnet watch run
```

### 7️⃣ Acessar o Swagger

Abra seu navegador em:
- **HTTP**: http://localhost:5000
- **HTTPS**: https://localhost:5001

## 🎯 Testando a API

### 1. Registrar um Usuário

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "senha123",
    "cidade": "São Paulo",
    "uf": "SP",
    "telefone": "11999999999"
  }'
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123"
  }'
```

Copie o `token` retornado!

### 3. Criar um Equipamento

```bash
curl -X POST http://localhost:5000/api/equipamentos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "titulo": "Furadeira Elétrica",
    "descricao": "Furadeira profissional 500W",
    "categoria": "Ferramentas",
    "precoPorDia": 25.00,
    "cidade": "São Paulo",
    "uf": "SP"
  }'
```

### 4. Listar Equipamentos

```bash
curl http://localhost:5000/api/equipamentos
```

## 🔧 Comandos Úteis

```bash
# Restaurar dependências
dotnet restore

# Compilar
dotnet build

# Executar
dotnet run

# Executar com hot reload
dotnet watch run

# Criar migration
dotnet ef migrations add NomeDaMigration

# Aplicar migrations
dotnet ef database update

# Reverter migration
dotnet ef database update NomeDaMigrationAnterior

# Limpar build
dotnet clean
```

## 📊 Estrutura de Dados

### Usuário
```json
{
  "nome": "string",
  "email": "string",
  "senha": "string",
  "cidade": "string",
  "uf": "string",
  "telefone": "string"
}
```

### Equipamento
```json
{
  "titulo": "string",
  "descricao": "string",
  "categoria": "string",
  "precoPorDia": 0,
  "cidade": "string",
  "uf": "string",
  "endereco": "string"
}
```

### Aluguel
```json
{
  "equipamentoId": 0,
  "dataInicio": "2024-01-01",
  "dataFim": "2024-01-05"
}
```

### Avaliação
```json
{
  "aluguelId": 0,
  "nota": 5,
  "comentario": "string",
  "tipoAvaliacao": "Equipamento"
}
```

## 🐛 Problemas Comuns

### Erro: "Cannot connect to PostgreSQL"
- Verifique se o PostgreSQL está rodando
- Confirme a connection string no `appsettings.json`

### Erro: "JWT SecretKey não configurada"
- Adicione uma chave secreta no `appsettings.json`
- Mínimo 32 caracteres

### Erro: "Migration pending"
- Execute: `dotnet ef database update`

### Porta já em uso
- Altere a porta no `launchSettings.json`
- Ou mate o processo: `netstat -ano | findstr :5000`

## 📚 Próximos Passos

1. ✅ Explore todos os endpoints no Swagger
2. ✅ Configure o Mercado Pago para pagamentos
3. ✅ Configure SMTP para envio de emails
4. ✅ Adicione Azure Blob Storage para imagens
5. ✅ Implemente testes unitários
6. ✅ Configure CI/CD
7. ✅ Faça deploy em produção

