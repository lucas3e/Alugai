# 🐳 Guia Docker - Alugai

Este guia explica como executar o projeto Alugai (API + Web) usando Docker e Docker Compose.

## 📋 Pré-requisitos

- **[Docker](https://docs.docker.com/get-docker/)** 20.10 ou superior
- **[Docker Compose](https://docs.docker.com/compose/install/)** 2.0 ou superior

### Verificar instalações:

```bash
docker --version
docker-compose --version
```

## 🚀 Início Rápido

### 1. Clone o repositório

```bash
git clone https://github.com/lucas3e/alugai-api.git
cd alugai-api
```

### 2. Execute com Docker Compose

```bash
# Modo produção (build otimizado)
docker-compose up -d

# Ou modo desenvolvimento (com hot reload)
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Acesse as aplicações

- **Web (Frontend)**: http://localhost:3000
- **API (Backend)**: http://localhost:5000
- **Swagger (Documentação)**: http://localhost:5000/swagger
- **PostgreSQL**: localhost:5432

### 4. Parar os containers

```bash
docker-compose down

# Para remover também os volumes (dados do banco)
docker-compose down -v
```

## 📦 Serviços Disponíveis

O Docker Compose configura 3 serviços:

### 1. **postgres** - Banco de Dados
- Imagem: `postgres:16-alpine`
- Porta: `5432`
- Database: `alugai_db`
- Usuário: `postgres`
- Senha: `postgres`

### 2. **api** - Backend ASP.NET Core
- Build: `./Dockerfile`
- Porta: `5000`
- Ambiente: Docker/Development
- Dependências: PostgreSQL

### 3. **web** - Frontend React
- Build: `./web/Dockerfile`
- Porta: `3000`
- Servidor: Nginx (produção) ou Node (desenvolvimento)
- Dependências: API

## 🔧 Configurações

### Variáveis de Ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Database
POSTGRES_DB=alugai_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# API
ASPNETCORE_ENVIRONMENT=Docker
JWT_SECRET_KEY=sua-chave-secreta-super-segura-com-no-minimo-32-caracteres

# Web
REACT_APP_API_URL=http://localhost:5000/api
```

### Usar arquivo .env com Docker Compose

```bash
docker-compose --env-file .env up -d
```

## 🛠️ Comandos Úteis

### Gerenciamento de Containers

```bash
# Listar containers em execução
docker-compose ps

# Ver logs de todos os serviços
docker-compose logs

# Ver logs de um serviço específico
docker-compose logs api
docker-compose logs web
docker-compose logs postgres

# Seguir logs em tempo real
docker-compose logs -f api

# Reiniciar um serviço
docker-compose restart api

# Parar um serviço específico
docker-compose stop web

# Iniciar um serviço específico
docker-compose start web
```

### Build e Rebuild

```bash
# Rebuild de todos os serviços
docker-compose build

# Rebuild de um serviço específico
docker-compose build api

# Rebuild sem cache
docker-compose build --no-cache

# Build e iniciar
docker-compose up -d --build
```

### Executar Comandos nos Containers

```bash
# Acessar shell do container da API
docker-compose exec api sh

# Acessar shell do container do PostgreSQL
docker-compose exec postgres psql -U postgres -d alugai_db

# Executar migrations manualmente
docker-compose exec api dotnet ef database update

# Ver logs do container
docker-compose exec api cat /app/logs/log-$(date +%Y%m%d).txt
```

### Gerenciamento de Volumes

```bash
# Listar volumes
docker volume ls

# Inspecionar volume
docker volume inspect alugai_postgres_data

# Remover volumes não utilizados
docker volume prune

# Backup do banco de dados
docker-compose exec postgres pg_dump -U postgres alugai_db > backup.sql

# Restaurar banco de dados
docker-compose exec -T postgres psql -U postgres alugai_db < backup.sql
```

## 🔄 Modo Desenvolvimento vs Produção

### Modo Produção (docker-compose.yml)

**Características:**
- Build otimizado para produção
- Imagens menores
- Sem hot reload
- Nginx para servir o frontend
- Melhor performance

**Uso:**
```bash
docker-compose up -d
```

### Modo Desenvolvimento (docker-compose.dev.yml)

**Características:**
- Hot reload habilitado
- Volumes montados para código fonte
- Logs mais verbosos
- Desenvolvimento mais rápido
- Node.js dev server para frontend

**Uso:**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

## 🗄️ Gerenciamento do Banco de Dados

### Acessar PostgreSQL

```bash
# Via docker-compose
docker-compose exec postgres psql -U postgres -d alugai_db

# Via cliente local (se tiver psql instalado)
psql -h localhost -p 5432 -U postgres -d alugai_db
```

### Comandos SQL Úteis

```sql
-- Listar tabelas
\dt

-- Descrever tabela
\d usuarios

-- Ver dados
SELECT * FROM usuarios;

-- Limpar dados (cuidado!)
TRUNCATE TABLE usuarios CASCADE;
```

### Migrations

```bash
# Aplicar migrations
docker-compose exec api dotnet ef database update

# Criar nova migration
docker-compose exec api dotnet ef migrations add NomeDaMigration

# Reverter migration
docker-compose exec api dotnet ef database update MigrationAnterior

# Gerar script SQL
docker-compose exec api dotnet ef migrations script > migration.sql
```

### Backup e Restore

```bash
# Backup completo
docker-compose exec postgres pg_dump -U postgres alugai_db > backup_$(date +%Y%m%d).sql

# Backup apenas schema
docker-compose exec postgres pg_dump -U postgres --schema-only alugai_db > schema.sql

# Backup apenas dados
docker-compose exec postgres pg_dump -U postgres --data-only alugai_db > data.sql

# Restore
docker-compose exec -T postgres psql -U postgres alugai_db < backup.sql
```

## 🐛 Troubleshooting

### Problema: Porta já em uso

```bash
# Verificar o que está usando a porta
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :5000
lsof -i :3000

# Matar processo
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

### Problema: Container não inicia

```bash
# Ver logs detalhados
docker-compose logs api

# Verificar status
docker-compose ps

# Reiniciar serviço
docker-compose restart api

# Rebuild completo
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Problema: Banco de dados não conecta

```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps postgres

# Ver logs do PostgreSQL
docker-compose logs postgres

# Testar conexão
docker-compose exec postgres pg_isready -U postgres

# Reiniciar PostgreSQL
docker-compose restart postgres
```

### Problema: Migrations não aplicadas

```bash
# Verificar status das migrations
docker-compose exec api dotnet ef migrations list

# Aplicar migrations manualmente
docker-compose exec api dotnet ef database update

# Se necessário, dropar e recriar banco
docker-compose down -v
docker-compose up -d
```

### Problema: Imagens muito grandes

```bash
# Ver tamanho das imagens
docker images

# Limpar imagens não utilizadas
docker image prune -a

# Rebuild com cache limpo
docker-compose build --no-cache
```

### Problema: Volumes com dados antigos

```bash
# Remover volumes e recriar
docker-compose down -v
docker-compose up -d

# Ou remover volume específico
docker volume rm alugai_postgres_data
docker-compose up -d
```

## 🔒 Segurança

### Produção

Para ambiente de produção, **SEMPRE**:

1. **Altere as senhas padrão**:
```env
POSTGRES_PASSWORD=senha_forte_e_unica
JWT_SECRET_KEY=chave-super-secreta-minimo-32-caracteres
```

2. **Use secrets do Docker**:
```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt
```

3. **Não exponha portas desnecessárias**:
```yaml
# Remova ou comente
ports:
  - "5432:5432"  # PostgreSQL não precisa ser exposto
```

4. **Use HTTPS**:
```yaml
environment:
  - ASPNETCORE_URLS=https://+:443;http://+:80
  - ASPNETCORE_Kestrel__Certificates__Default__Path=/https/cert.pfx
  - ASPNETCORE_Kestrel__Certificates__Default__Password=senha_cert
```

5. **Configure CORS adequadamente**:
```csharp
// Não use AllowAnyOrigin em produção
policy.WithOrigins("https://seudominio.com")
```

## 📊 Monitoramento

### Ver uso de recursos

```bash
# Uso de CPU e memória
docker stats

# Uso de disco
docker system df

# Informações detalhadas
docker-compose top
```

### Health Checks

```bash
# Verificar saúde dos containers
docker-compose ps

# Ver logs de health check
docker inspect --format='{{json .State.Health}}' alugai-api
```

## 🚀 Deploy em Produção

### Docker Swarm

```bash
# Inicializar swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml alugai

# Listar serviços
docker service ls

# Ver logs
docker service logs alugai_api
```

### Kubernetes

```bash
# Converter docker-compose para kubernetes
kompose convert

# Aplicar configurações
kubectl apply -f .

# Ver pods
kubectl get pods

# Ver logs
kubectl logs -f deployment/api
```

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [ASP.NET Core Docker](https://docs.microsoft.com/aspnet/core/host-and-deploy/docker/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Nginx Docker](https://hub.docker.com/_/nginx)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs`
2. Consulte a seção de Troubleshooting acima

