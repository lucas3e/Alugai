# 🏠 Alugai - API de Aluguel de Equipamentos entre Vizinhos

API REST desenvolvida em **C# com ASP.NET Core 8.0** para um aplicativo MVP de aluguel de equipamentos entre vizinhos.

## 🎯 Sobre o Projeto

O **Alugai** é uma plataforma que conecta vizinhos para aluguel de equipamentos, ferramentas e outros itens. A API fornece todas as funcionalidades necessárias para:

- Cadastro e autenticação de usuários
- Gerenciamento de equipamentos
- Sistema de solicitação e aprovação de aluguéis
- Chat entre locador e locatário
- Sistema de avaliações
- Integração com Mercado Pago para pagamentos

## 🚀 Tecnologias Utilizadas

- **[.NET 8.0](https://dotnet.microsoft.com/)** - Framework principal
- **[ASP.NET Core Web API](https://docs.microsoft.com/aspnet/core/)** - Framework web
- **[Entity Framework Core 8.0](https://docs.microsoft.com/ef/core/)** - ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados
- **[JWT Bearer](https://jwt.io/)** - Autenticação
- **[AutoMapper](https://automapper.org/)** - Mapeamento de objetos
- **[BCrypt.Net](https://github.com/BcryptNet/bcrypt.net)** - Hash de senhas
- **[Serilog](https://serilog.net/)** - Logging
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação da API

## ✨ Funcionalidades

### 🔐 Autenticação
- ✅ Registro de usuários com email e senha
- ✅ Login com geração de token JWT
- ✅ Perfil de usuário com foto, localização e avaliações
- ✅ Atualização de perfil

### 📦 Equipamentos
- ✅ CRUD completo de equipamentos
- ✅ Upload de múltiplas imagens
- ✅ Categorização de equipamentos
- ✅ Filtros por categoria, localização e preço
- ✅ Busca por texto

### 📆 Sistema de Aluguel
- ✅ Solicitação de aluguel com datas
- ✅ Aprovação/recusa pelo proprietário
- ✅ Verificação de disponibilidade
- ✅ Cálculo automático de valores
- ✅ Controle de status do aluguel

### 💬 Comunicação
- ✅ Chat entre locador e locatário
- ✅ Histórico de mensagens
- ✅ Notificação de mensagens não lidas

### 🌟 Avaliações
- ✅ Avaliação de equipamentos
- ✅ Avaliação de usuários
- ✅ Cálculo de média de avaliações
- ✅ Comentários

### 💰 Pagamentos
- ✅ Integração com Mercado Pago (preparado)
- ✅ Webhook para notificações
- ✅ Histórico de transações

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- **[.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)** ou superior
- **[PostgreSQL 14+](https://www.postgresql.org/download/)** 
- **[Git](https://git-scm.com/downloads)**
- Um editor de código (recomendado: [Visual Studio 2022](https://visualstudio.microsoft.com/) ou [VS Code](https://code.visualstudio.com/))

### Verificar instalações:

```bash
# Verificar .NET
dotnet --version

# Verificar PostgreSQL
psql --version

# Verificar Git
git --version
```

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/alugai-api.git
cd alugai-api
```

### 2. Instalar dependências

```bash
dotnet restore
```

### 3. Configurar o Banco de Dados PostgreSQL

#### Opção A: Usando PostgreSQL local

1. Crie um banco de dados:

```sql
CREATE DATABASE alugai_db;
```

2. Crie um usuário (opcional):

```sql
CREATE USER alugai_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE alugai_db TO alugai_user;
```

#### Opção B: Usando Docker

```bash
docker run --name postgres-alugai -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=alugai_db -p 5432:5432 -d postgres:14
```

### 4. Configurar variáveis de ambiente

Edite o arquivo `appsettings.json` ou `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=alugai_db;Username=postgres;Password=sua_senha"
  },
  "JwtSettings": {
    "SecretKey": "sua-chave-secreta-super-segura-com-no-minimo-32-caracteres",
    "Issuer": "AluguelEquipamentosApi",
    "Audience": "AluguelEquipamentosApp",
    "ExpirationInMinutes": 1440
  }
}
```

⚠️ **IMPORTANTE**: 
- Altere a `SecretKey` para uma chave segura e única
- Nunca commite senhas ou chaves secretas no Git
- Use variáveis de ambiente em produção

### 5. Executar Migrations

```bash
# Criar a migration inicial
dotnet ef migrations add InitialCreate

# Aplicar migrations ao banco de dados
dotnet ef database update
```

Se você não tiver o `dotnet-ef` instalado:

```bash
dotnet tool install --global dotnet-ef
```

## ▶️ Executando o Projeto

### Modo Desenvolvimento

```bash
dotnet run
```

Ou com hot reload:

```bash
dotnet watch run
```

A API estará disponível em:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`
- **Swagger**: `http://localhost:5000` ou `https://localhost:5001`

### Modo Produção

```bash
dotnet run --configuration Release
```

## 📁 Estrutura do Projeto

```
AluguelEquipamentosApi/
├── Controllers/              # Controladores da API
│   ├── AuthController.cs
│   ├── EquipamentosController.cs
│   ├── AlugueisController.cs
│   ├── AvaliacoesController.cs
│   ├── MensagensController.cs
│   ├── PagamentosController.cs
│   └── UsuariosController.cs
├── Models/                   # Modelos de dados
│   ├── Usuario.cs
│   ├── Equipamento.cs
│   ├── Aluguel.cs
│   ├── Avaliacao.cs
│   ├── Mensagem.cs
│   └── Transacao.cs
├── DTOs/                     # Data Transfer Objects
│   ├── Requests/
│   └── Responses/
├── Services/                 # Serviços de negócio
│   ├── AuthService.cs
│   ├── PagamentoService.cs
│   ├── StorageService.cs
│   └── EmailService.cs
├── Data/                     # Contexto do banco de dados
│   └── AppDbContext.cs
├── Helpers/                  # Classes auxiliares
│   ├── AutoMapperProfile.cs
│   ├── JwtHelper.cs
│   └── PasswordHelper.cs
├── Migrations/               # Migrations do EF Core
├── wwwroot/                  # Arquivos estáticos
│   └── uploads/              # Imagens uploadadas
├── logs/                     # Logs da aplicação
├── appsettings.json          # Configurações
├── Program.cs                # Ponto de entrada
└── README.md                 # Este arquivo
```

## 🔌 Endpoints da API

### 🔐 Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrar novo usuário | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Obter perfil do usuário autenticado | ✅ |
| PUT | `/api/auth/me` | Atualizar perfil | ✅ |

### 👤 Usuários

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/usuarios/{id}` | Obter perfil público | ❌ |
| GET | `/api/usuarios/{id}/equipamentos` | Listar equipamentos do usuário | ❌ |
| POST | `/api/usuarios/foto-perfil` | Upload de foto de perfil | ✅ |
| DELETE | `/api/usuarios/foto-perfil` | Remover foto de perfil | ✅ |

### 📦 Equipamentos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/equipamentos` | Listar equipamentos (com filtros) | ❌ |
| GET | `/api/equipamentos/{id}` | Obter equipamento por ID | ❌ |
| POST | `/api/equipamentos` | Criar equipamento | ✅ |
| PUT | `/api/equipamentos/{id}` | Atualizar equipamento | ✅ |
| DELETE | `/api/equipamentos/{id}` | Deletar equipamento | ✅ |
| POST | `/api/equipamentos/{id}/imagens` | Upload de imagens | ✅ |
| DELETE | `/api/equipamentos/{id}/imagens` | Remover imagem | ✅ |

### 📆 Aluguéis

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/alugueis` | Listar meus aluguéis | ✅ |
| GET | `/api/alugueis/{id}` | Obter aluguel por ID | ✅ |
| POST | `/api/alugueis` | Solicitar aluguel | ✅ |
| PUT | `/api/alugueis/{id}/aceitar` | Aceitar solicitação | ✅ |
| PUT | `/api/alugueis/{id}/recusar` | Recusar solicitação | ✅ |
| PUT | `/api/alugueis/{id}/cancelar` | Cancelar aluguel | ✅ |
| PUT | `/api/alugueis/{id}/concluir` | Concluir aluguel | ✅ |

### 💬 Mensagens

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/alugueis/{aluguelId}/mensagens` | Listar mensagens | ✅ |
| POST | `/api/alugueis/{aluguelId}/mensagens` | Enviar mensagem | ✅ |
| GET | `/api/mensagens/nao-lidas` | Contagem de não lidas | ✅ |

### 🌟 Avaliações

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/avaliacoes` | Criar avaliação | ✅ |
| GET | `/api/avaliacoes/{id}` | Obter avaliação | ❌ |
| GET | `/api/avaliacoes/equipamento/{id}` | Listar por equipamento | ❌ |
| GET | `/api/avaliacoes/usuario/{id}` | Listar por usuário | ❌ |
| DELETE | `/api/avaliacoes/{id}` | Deletar avaliação | ✅ |

### 💰 Pagamentos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/pagamentos/iniciar/{aluguelId}` | Iniciar pagamento | ✅ |
| POST | `/api/pagamentos/webhook` | Webhook Mercado Pago | ❌ |
| GET | `/api/pagamentos/{id}` | Obter transação | ✅ |
| GET | `/api/pagamentos/usuario/minhas-transacoes` | Minhas transações | ✅ |

## ⚙️ Configurações

### JWT Settings

```json
"JwtSettings": {
  "SecretKey": "sua-chave-secreta-minimo-32-caracteres",
  "Issuer": "AluguelEquipamentosApi",
  "Audience": "AluguelEquipamentosApp",
  "ExpirationInMinutes": 1440
}
```

### Mercado Pago (Opcional)

Para habilitar pagamentos reais, configure:

```json
"MercadoPago": {
  "AccessToken": "seu-access-token-do-mercado-pago",
  "PublicKey": "sua-public-key-do-mercado-pago"
}
```

Obtenha suas credenciais em: https://www.mercadopago.com.br/developers

### Storage (Upload de Imagens)

```json
"Storage": {
  "Type": "Local",
  "LocalPath": "wwwroot/uploads"
}
```

Para usar Azure Blob Storage:

```json
"Storage": {
  "Type": "Azure",
  "AzureBlobConnectionString": "sua-connection-string",
  "AzureBlobContainerName": "equipamentos"
}
```

### Email (Opcional)

```json
"Email": {
  "SmtpHost": "smtp.gmail.com",
  "SmtpPort": 587,
  "SmtpUsername": "seu-email@gmail.com",
  "SmtpPassword": "sua-senha-de-app",
  "FromEmail": "noreply@alugai.com",
  "FromName": "Alugai"
}
```

## 🗄️ Migrations

### Criar nova migration

```bash
dotnet ef migrations add NomeDaMigration
```

### Aplicar migrations

```bash
dotnet ef database update
```

### Reverter migration

```bash
dotnet ef database update NomeDaMigrationAnterior
```

### Remover última migration

```bash
dotnet ef migrations remove
```

### Gerar script SQL

```bash
dotnet ef migrations script
```

## 🧪 Testes

### Testar com Swagger

1. Execute o projeto
2. Acesse `http://localhost:5000`
3. Use a interface do Swagger para testar os endpoints

### Testar com cURL

```bash
# Registrar usuário
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "senha123",
    "cidade": "São Paulo",
    "uf": "SP"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123"
  }'
```

### Testar com Postman

1. Importe a coleção do Swagger: `http://localhost:5000/swagger/v1/swagger.json`
2. Configure a autenticação Bearer Token
3. Execute as requisições

## 🚀 Deploy

### Deploy no Azure

1. Crie um App Service no Azure
2. Configure a connection string do PostgreSQL
3. Configure as variáveis de ambiente
4. Publique:

```bash
dotnet publish -c Release -o ./publish
```

### Deploy no Heroku

1. Crie um app no Heroku
2. Adicione o buildpack do .NET
3. Configure as variáveis de ambiente
4. Faça o deploy via Git

### Deploy com Docker

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["AluguelEquipamentosApi.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AluguelEquipamentosApi.dll"]
```

```bash
docker build -t alugai-api .
docker run -p 8080:80 alugai-api
```

## 📝 Variáveis de Ambiente (Produção)

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET_KEY=sua-chave-secreta-super-segura
JWT_ISSUER=AluguelEquipamentosApi
JWT_AUDIENCE=AluguelEquipamentosApp

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu-token
MERCADOPAGO_PUBLIC_KEY=sua-chave

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=seu-email
SMTP_PASSWORD=sua-senha
```