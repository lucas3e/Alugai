# 🚀 Início Rápido com Docker

Execute o projeto Alugai completo (API + Web + PostgreSQL) em minutos usando Docker!

## ⚡ Início Rápido (3 passos)

### 1. Clone o repositório
```bash
git clone https://github.com/lucas3e/alugai-api.git
cd alugai-api
```

### 2. Execute com Docker Compose
```bash
docker-compose up -d
```

### 3. Acesse as aplicações
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger

## 🎯 Comandos Essenciais

### Iniciar
```bash
# Produção
docker-compose up -d

# Desenvolvimento (com hot reload)
docker-compose -f docker-compose.dev.yml up -d
```

### Parar
```bash
docker-compose down

# Remover também os dados do banco
docker-compose down -v
```

### Ver Logs
```bash
# Todos os serviços
docker-compose logs -f

# Apenas API
docker-compose logs -f api

# Apenas Web
docker-compose logs -f web
```

### Reiniciar
```bash
# Todos os serviços
docker-compose restart

# Apenas um serviço
docker-compose restart api
```

### Rebuild
```bash
# Rebuild e reiniciar
docker-compose up -d --build

# Rebuild sem cache
docker-compose build --no-cache
docker-compose up -d
```

## 🗄️ Banco de Dados

### Acessar PostgreSQL
```bash
docker-compose exec postgres psql -U postgres -d alugai_db
```

### Backup
```bash
docker-compose exec postgres pg_dump -U postgres alugai_db > backup.sql
```

### Restore
```bash
docker-compose exec -T postgres psql -U postgres alugai_db < backup.sql
```

## 🔧 Troubleshooting

### Porta já em uso
```bash
# Verificar o que está usando a porta
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # Linux/Mac

# Parar containers
docker-compose down
```

### Limpar tudo e recomeçar
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

### Ver uso de recursos
```bash
docker stats
```

## 📖 Documentação Completa

Para mais detalhes, consulte:
- [Guia Docker Completo](DOCKER.md)
- [README Principal](README.md)

