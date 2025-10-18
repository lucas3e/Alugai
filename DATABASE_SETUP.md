# 🗄️ Guia de Configuração do Banco de Dados - Alugai

Este guia contém todas as informações necessárias para estruturar o banco de dados PostgreSQL.

---

## 📋 Índice

1. [Instalação do PostgreSQL](#instalação-do-postgresql)
2. [Criação do Banco de Dados](#criação-do-banco-de-dados)
3. [Estrutura das Tabelas](#estrutura-das-tabelas)
4. [Relacionamentos](#relacionamentos)
5. [Índices](#índices)
6. [Scripts SQL](#scripts-sql)
7. [Migrations com Entity Framework](#migrations-com-entity-framework)

---

## 🔧 Instalação do PostgreSQL

### Opção 1: Docker (Recomendado)

```bash
# Baixar e executar PostgreSQL 14
docker run --name postgres-alugai \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=alugai_db \
  -p 5432:5432 \
  -d postgres:14

# Verificar se está rodando
docker ps

# Acessar o PostgreSQL
docker exec -it postgres-alugai psql -U postgres -d alugai_db
```

### Opção 2: Instalação Local

**Windows:**
1. Baixe: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. Defina senha para o usuário `postgres`
4. Porta padrão: 5432

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

---

## 🏗️ Criação do Banco de Dados

### Via psql (Terminal)

```sql
-- Conectar ao PostgreSQL
psql -U postgres

-- Criar banco de dados
CREATE DATABASE alugai_db;

-- Criar usuário (opcional)
CREATE USER alugai_user WITH PASSWORD 'senha_segura_123';

-- Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE alugai_db TO alugai_user;

-- Conectar ao banco
\c alugai_db

-- Verificar conexão
SELECT current_database();
```

### Via pgAdmin (Interface Gráfica)

1. Abra o pgAdmin
2. Clique com botão direito em "Databases"
3. Selecione "Create" > "Database"
4. Nome: `alugai_db`
5. Owner: `postgres`
6. Clique em "Save"

---

## 📊 Estrutura das Tabelas

### 1. Tabela: Usuarios

```sql
CREATE TABLE "Usuarios" (
    "Id" SERIAL PRIMARY KEY,
    "Nome" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(255) NOT NULL UNIQUE,
    "SenhaHash" VARCHAR(255) NOT NULL,
    "Cidade" VARCHAR(100) NOT NULL,
    "UF" VARCHAR(2) NOT NULL,
    "FotoPerfil" VARCHAR(500),
    "Telefone" VARCHAR(20),
    "Ativo" BOOLEAN NOT NULL DEFAULT TRUE,
    "DataCriacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DataAtualizacao" TIMESTAMP
);

-- Índices
CREATE INDEX "IX_Usuarios_Email" ON "Usuarios" ("Email");
CREATE INDEX "IX_Usuarios_Cidade_UF" ON "Usuarios" ("Cidade", "UF");
```

**Campos:**
- `Id`: Identificador único (auto-incremento)
- `Nome`: Nome completo do usuário
- `Email`: Email único para login
- `SenhaHash`: Senha criptografada com BCrypt
- `Cidade`: Cidade do usuário
- `UF`: Estado (2 letras)
- `FotoPerfil`: URL da foto de perfil
- `Telefone`: Telefone de contato
- `Ativo`: Se o usuário está ativo
- `DataCriacao`: Data de registro
- `DataAtualizacao`: Data da última atualização

---

### 2. Tabela: Equipamentos

```sql
CREATE TABLE "Equipamentos" (
    "Id" SERIAL PRIMARY KEY,
    "Titulo" VARCHAR(200) NOT NULL,
    "Descricao" TEXT NOT NULL,
    "Categoria" VARCHAR(50) NOT NULL,
    "PrecoPorDia" DECIMAL(10,2) NOT NULL,
    "Cidade" VARCHAR(100) NOT NULL,
    "UF" VARCHAR(2) NOT NULL,
    "Endereco" VARCHAR(500),
    "Imagens" TEXT[], -- Array de URLs
    "Disponivel" BOOLEAN NOT NULL DEFAULT TRUE,
    "UsuarioId" INTEGER NOT NULL,
    "DataCriacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DataAtualizacao" TIMESTAMP,
    
    CONSTRAINT "FK_Equipamentos_Usuarios" 
        FOREIGN KEY ("UsuarioId") 
        REFERENCES "Usuarios"("Id") 
        ON DELETE CASCADE
);

-- Índices
CREATE INDEX "IX_Equipamentos_UsuarioId" ON "Equipamentos" ("UsuarioId");
CREATE INDEX "IX_Equipamentos_Categoria" ON "Equipamentos" ("Categoria");
CREATE INDEX "IX_Equipamentos_Cidade_UF" ON "Equipamentos" ("Cidade", "UF");
CREATE INDEX "IX_Equipamentos_PrecoPorDia" ON "Equipamentos" ("PrecoPorDia");
CREATE INDEX "IX_Equipamentos_Disponivel" ON "Equipamentos" ("Disponivel");
```

**Campos:**
- `Id`: Identificador único
- `Titulo`: Nome do equipamento
- `Descricao`: Descrição detalhada
- `Categoria`: Categoria (Ferramentas, Eletrodomésticos, etc.)
- `PrecoPorDia`: Preço por dia de aluguel
- `Cidade`: Localização do equipamento
- `UF`: Estado
- `Endereco`: Endereço completo (opcional)
- `Imagens`: Array de URLs das imagens
- `Disponivel`: Se está disponível para aluguel
- `UsuarioId`: Proprietário do equipamento

---

### 3. Tabela: Alugueis

```sql
CREATE TABLE "Alugueis" (
    "Id" SERIAL PRIMARY KEY,
    "EquipamentoId" INTEGER NOT NULL,
    "LocatarioId" INTEGER NOT NULL,
    "DataInicio" DATE NOT NULL,
    "DataFim" DATE NOT NULL,
    "ValorTotal" DECIMAL(10,2) NOT NULL,
    "Status" VARCHAR(20) NOT NULL DEFAULT 'Pendente',
    "DataSolicitacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DataResposta" TIMESTAMP,
    "ObservacaoProprietario" TEXT,
    
    CONSTRAINT "FK_Alugueis_Equipamentos" 
        FOREIGN KEY ("EquipamentoId") 
        REFERENCES "Equipamentos"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "FK_Alugueis_Usuarios" 
        FOREIGN KEY ("LocatarioId") 
        REFERENCES "Usuarios"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "CHK_Alugueis_Status" 
        CHECK ("Status" IN ('Pendente', 'Aceito', 'Recusado', 'EmAndamento', 'Concluido', 'Cancelado'))
);

-- Índices
CREATE INDEX "IX_Alugueis_EquipamentoId" ON "Alugueis" ("EquipamentoId");
CREATE INDEX "IX_Alugueis_LocatarioId" ON "Alugueis" ("LocatarioId");
CREATE INDEX "IX_Alugueis_Status" ON "Alugueis" ("Status");
CREATE INDEX "IX_Alugueis_DataInicio_DataFim" ON "Alugueis" ("DataInicio", "DataFim");
```

**Campos:**
- `Id`: Identificador único
- `EquipamentoId`: Equipamento alugado
- `LocatarioId`: Quem está alugando
- `DataInicio`: Data de início do aluguel
- `DataFim`: Data de fim do aluguel
- `ValorTotal`: Valor total calculado
- `Status`: Status do aluguel (Pendente, Aceito, etc.)
- `DataSolicitacao`: Quando foi solicitado
- `DataResposta`: Quando foi aceito/recusado
- `ObservacaoProprietario`: Mensagem do proprietário

---

### 4. Tabela: Avaliacoes

```sql
CREATE TABLE "Avaliacoes" (
    "Id" SERIAL PRIMARY KEY,
    "AluguelId" INTEGER NOT NULL UNIQUE,
    "EquipamentoId" INTEGER NOT NULL,
    "UsuarioAvaliadorId" INTEGER NOT NULL,
    "UsuarioAvaliadoId" INTEGER NOT NULL,
    "Nota" INTEGER NOT NULL,
    "Comentario" TEXT,
    "TipoAvaliacao" VARCHAR(20) NOT NULL,
    "DataAvaliacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "FK_Avaliacoes_Alugueis" 
        FOREIGN KEY ("AluguelId") 
        REFERENCES "Alugueis"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "FK_Avaliacoes_Equipamentos" 
        FOREIGN KEY ("EquipamentoId") 
        REFERENCES "Equipamentos"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "FK_Avaliacoes_UsuarioAvaliador" 
        FOREIGN KEY ("UsuarioAvaliadorId") 
        REFERENCES "Usuarios"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "FK_Avaliacoes_UsuarioAvaliado" 
        FOREIGN KEY ("UsuarioAvaliadoId") 
        REFERENCES "Usuarios"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "CHK_Avaliacoes_Nota" 
        CHECK ("Nota" >= 1 AND "Nota" <= 5),
    
    CONSTRAINT "CHK_Avaliacoes_Tipo" 
        CHECK ("TipoAvaliacao" IN ('Equipamento', 'Usuario'))
);

-- Índices
CREATE INDEX "IX_Avaliacoes_AluguelId" ON "Avaliacoes" ("AluguelId");
CREATE INDEX "IX_Avaliacoes_EquipamentoId" ON "Avaliacoes" ("EquipamentoId");
CREATE INDEX "IX_Avaliacoes_UsuarioAvaliadoId" ON "Avaliacoes" ("UsuarioAvaliadoId");
```

**Campos:**
- `Id`: Identificador único
- `AluguelId`: Aluguel avaliado (único - uma avaliação por aluguel)
- `EquipamentoId`: Equipamento avaliado
- `UsuarioAvaliadorId`: Quem fez a avaliação
- `UsuarioAvaliadoId`: Quem recebeu a avaliação
- `Nota`: Nota de 1 a 5
- `Comentario`: Comentário opcional
- `TipoAvaliacao`: "Equipamento" ou "Usuario"
- `DataAvaliacao`: Data da avaliação

---

### 5. Tabela: Mensagens

```sql
CREATE TABLE "Mensagens" (
    "Id" SERIAL PRIMARY KEY,
    "AluguelId" INTEGER NOT NULL,
    "RemetenteId" INTEGER NOT NULL,
    "Conteudo" TEXT NOT NULL,
    "DataEnvio" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Lida" BOOLEAN NOT NULL DEFAULT FALSE,
    "DataLeitura" TIMESTAMP,
    
    CONSTRAINT "FK_Mensagens_Alugueis" 
        FOREIGN KEY ("AluguelId") 
        REFERENCES "Alugueis"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "FK_Mensagens_Usuarios" 
        FOREIGN KEY ("RemetenteId") 
        REFERENCES "Usuarios"("Id") 
        ON DELETE CASCADE
);

-- Índices
CREATE INDEX "IX_Mensagens_AluguelId" ON "Mensagens" ("AluguelId");
CREATE INDEX "IX_Mensagens_RemetenteId" ON "Mensagens" ("RemetenteId");
CREATE INDEX "IX_Mensagens_Lida" ON "Mensagens" ("Lida");
```

**Campos:**
- `Id`: Identificador único
- `AluguelId`: Aluguel relacionado
- `RemetenteId`: Quem enviou a mensagem
- `Conteudo`: Texto da mensagem
- `DataEnvio`: Data/hora de envio
- `Lida`: Se foi lida
- `DataLeitura`: Quando foi lida

---

### 6. Tabela: Transacoes

```sql
CREATE TABLE "Transacoes" (
    "Id" SERIAL PRIMARY KEY,
    "AluguelId" INTEGER NOT NULL,
    "ValorPago" DECIMAL(10,2) NOT NULL,
    "Status" VARCHAR(20) NOT NULL DEFAULT 'Pendente',
    "MercadoPagoId" VARCHAR(100),
    "MercadoPagoPaymentId" VARCHAR(100),
    "DetalhesResposta" TEXT,
    "DataCriacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DataAtualizacao" TIMESTAMP,
    
    CONSTRAINT "FK_Transacoes_Alugueis" 
        FOREIGN KEY ("AluguelId") 
        REFERENCES "Alugueis"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "CHK_Transacoes_Status" 
        CHECK ("Status" IN ('Pendente', 'Aprovado', 'Recusado', 'Cancelado', 'Reembolsado'))
);

-- Índices
CREATE INDEX "IX_Transacoes_AluguelId" ON "Transacoes" ("AluguelId");
CREATE INDEX "IX_Transacoes_Status" ON "Transacoes" ("Status");
CREATE INDEX "IX_Transacoes_MercadoPagoPaymentId" ON "Transacoes" ("MercadoPagoPaymentId");
```

**Campos:**
- `Id`: Identificador único
- `AluguelId`: Aluguel relacionado
- `ValorPago`: Valor da transação
- `Status`: Status do pagamento
- `MercadoPagoId`: ID da preferência no Mercado Pago
- `MercadoPagoPaymentId`: ID do pagamento no Mercado Pago
- `DetalhesResposta`: JSON com detalhes da resposta
- `DataCriacao`: Data de criação
- `DataAtualizacao`: Data de atualização

---

## 🔗 Relacionamentos

```
Usuarios (1) -----> (N) Equipamentos
    |                       |
    |                       |
    |                   (N) |
    |                       ↓
    +-----------------> Alugueis (N)
                           |
                           |
                           +-----> (1) Avaliacoes
                           |
                           +-----> (N) Mensagens
                           |
                           +-----> (N) Transacoes
```

### Descrição dos Relacionamentos:

1. **Usuario → Equipamentos** (1:N)
   - Um usuário pode ter vários equipamentos
   - Cada equipamento pertence a um usuário

2. **Usuario → Alugueis** (1:N)
   - Um usuário pode fazer vários aluguéis (como locatário)
   - Cada aluguel tem um locatário

3. **Equipamento → Alugueis** (1:N)
   - Um equipamento pode ter vários aluguéis
   - Cada aluguel é de um equipamento

4. **Aluguel → Avaliacao** (1:1)
   - Cada aluguel pode ter uma avaliação
   - Cada avaliação pertence a um aluguel

5. **Aluguel → Mensagens** (1:N)
   - Cada aluguel pode ter várias mensagens
   - Cada mensagem pertence a um aluguel

6. **Aluguel → Transacoes** (1:N)
   - Cada aluguel pode ter várias transações
   - Cada transação pertence a um aluguel

---

## 📈 Índices Criados

### Índices para Performance:

```sql
-- Usuarios
CREATE INDEX "IX_Usuarios_Email" ON "Usuarios" ("Email");
CREATE INDEX "IX_Usuarios_Cidade_UF" ON "Usuarios" ("Cidade", "UF");

-- Equipamentos
CREATE INDEX "IX_Equipamentos_UsuarioId" ON "Equipamentos" ("UsuarioId");
CREATE INDEX "IX_Equipamentos_Categoria" ON "Equipamentos" ("Categoria");
CREATE INDEX "IX_Equipamentos_Cidade_UF" ON "Equipamentos" ("Cidade", "UF");
CREATE INDEX "IX_Equipamentos_PrecoPorDia" ON "Equipamentos" ("PrecoPorDia");
CREATE INDEX "IX_Equipamentos_Disponivel" ON "Equipamentos" ("Disponivel");

-- Alugueis
CREATE INDEX "IX_Alugueis_EquipamentoId" ON "Alugueis" ("EquipamentoId");
CREATE INDEX "IX_Alugueis_LocatarioId" ON "Alugueis" ("LocatarioId");
CREATE INDEX "IX_Alugueis_Status" ON "Alugueis" ("Status");
CREATE INDEX "IX_Alugueis_DataInicio_DataFim" ON "Alugueis" ("DataInicio", "DataFim");

-- Avaliacoes
CREATE INDEX "IX_Avaliacoes_AluguelId" ON "Avaliacoes" ("AluguelId");
CREATE INDEX "IX_Avaliacoes_EquipamentoId" ON "Avaliacoes" ("EquipamentoId");
CREATE INDEX "IX_Avaliacoes_UsuarioAvaliadoId" ON "Avaliacoes" ("UsuarioAvaliadoId");

-- Mensagens
CREATE INDEX "IX_Mensagens_AluguelId" ON "Mensagens" ("AluguelId");
CREATE INDEX "IX_Mensagens_RemetenteId" ON "Mensagens" ("RemetenteId");
CREATE INDEX "IX_Mensagens_Lida" ON "Mensagens" ("Lida");

-- Transacoes
CREATE INDEX "IX_Transacoes_AluguelId" ON "Transacoes" ("AluguelId");
CREATE INDEX "IX_Transacoes_Status" ON "Transacoes" ("Status");
CREATE INDEX "IX_Transacoes_MercadoPagoPaymentId" ON "Transacoes" ("MercadoPagoPaymentId");
```

---

## 📝 Script SQL Completo

### Criar Todas as Tabelas de Uma Vez:

```sql
-- ============================================
-- Script de Criação do Banco de Dados Alugai
-- ============================================

-- Conectar ao banco
\c alugai_db

-- Limpar tabelas existentes (cuidado em produção!)
DROP TABLE IF EXISTS "Transacoes" CASCADE;
DROP TABLE IF EXISTS "Mensagens" CASCADE;
DROP TABLE IF EXISTS "Avaliacoes" CASCADE;
DROP TABLE IF EXISTS "Alugueis" CASCADE;
DROP TABLE IF EXISTS "Equipamentos" CASCADE;
DROP TABLE IF EXISTS "Usuarios" CASCADE;

-- 1. Tabela Usuarios
CREATE TABLE "Usuarios" (
    "Id" SERIAL PRIMARY KEY,
    "Nome" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(255) NOT NULL UNIQUE,
    "SenhaHash" VARCHAR(255) NOT NULL,
    "Cidade" VARCHAR(100) NOT NULL,
    "UF" VARCHAR(2) NOT NULL,
    "FotoPerfil" VARCHAR(500),
    "Telefone" VARCHAR(20),
    "Ativo" BOOLEAN NOT NULL DEFAULT TRUE,
    "DataCriacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DataAtualizacao" TIMESTAMP
);

CREATE INDEX "IX_Usuarios_Email" ON "Usuarios" ("Email");
CREATE INDEX "IX_Usuarios_Cidade_UF" ON "Usuarios" ("Cidade", "UF");

-- 2. Tabela Equipamentos
CREATE TABLE "Equipamentos" (
    "Id" SERIAL PRIMARY KEY,
    "Titulo" VARCHAR(200) NOT NULL,
    "Descricao" TEXT NOT NULL,
    "Categoria" VARCHAR(50) NOT NULL,
    "PrecoPorDia" DECIMAL(10,2) NOT NULL,
    "Cidade" VARCHAR(100) NOT NULL,
    "UF" VARCHAR(2) NOT NULL,
    "Endereco" VARCHAR(500),
    "Imagens" TEXT[],
    "Disponivel" BOOLEAN NOT NULL DEFAULT TRUE,
    "UsuarioId" INTEGER NOT NULL,
    "DataCriacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DataAtualizacao" TIMESTAMP,
    
    CONSTRAINT "FK_Equipamentos_Usuarios" 
        FOREIGN KEY ("UsuarioId") 
        REFERENCES "Usuarios"("Id") 
        ON DELETE CASCADE
);

CREATE INDEX "IX_Equipamentos_UsuarioId" ON "Equipamentos" ("UsuarioId");
CREATE INDEX "IX_Equipamentos_Categoria" ON "Equipamentos" ("Categoria");
CREATE INDEX "IX_Equipamentos_Cidade_UF" ON "Equipamentos" ("Cidade", "UF");
CREATE INDEX "IX_Equipamentos_PrecoPorDia" ON "Equipamentos" ("PrecoPorDia");
CREATE INDEX "IX_Equipamentos_Disponivel" ON "Equipamentos" ("Disponivel");

-- 3. Tabela Alugueis
CREATE TABLE "Alugueis" (
    "Id" SERIAL PRIMARY KEY,
    "EquipamentoId" INTEGER NOT NULL,
    "LocatarioId" INTEGER NOT NULL,
    "DataInicio" DATE NOT NULL,
    "DataFim" DATE NOT NULL,
    "ValorTotal" DECIMAL(10,2) NOT NULL,
    "Status" VARCHAR(20) NOT NULL DEFAULT 'Pendente',
    "DataSolicitacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DataResposta" TIMESTAMP,
    "ObservacaoProprietario" TEXT,
    
    CONSTRAINT "FK_Alugueis_Equipamentos" 
        FOREIGN KEY ("EquipamentoId") 
        REFERENCES "Equipamentos"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "FK_Alugueis_Usuarios" 
        FOREIGN KEY ("LocatarioId") 
        REFERENCES "Usuarios"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "CHK_Alugueis_Status" 
        CHECK ("Status" IN ('Pendente', 'Aceito', 'Recusado', 'EmAndamento', 'Concluido', 'Cancelado'))
);

CREATE INDEX "IX_Alugueis_EquipamentoId" ON "Alugueis" ("EquipamentoId");
CREATE INDEX "IX_Alugueis_LocatarioId" ON "Alugueis" ("LocatarioId");
CREATE INDEX "IX_Alugueis_Status" ON "Alugueis" ("Status");
CREATE INDEX "IX_Alugueis_DataInicio_DataFim" ON "Alugueis" ("DataInicio", "DataFim");

-- 4. Tabela Avaliacoes
CREATE TABLE "Avaliacoes" (
    "Id" SERIAL PRIMARY KEY,
    "AluguelId" INTEGER NOT NULL UNIQUE,
    "EquipamentoId" INTEGER NOT NULL,
    "UsuarioAvaliadorId" INTEGER NOT NULL,
    "UsuarioAvaliadoId" INTEGER NOT NULL,
    "Nota" INTEGER NOT NULL,
    "Comentario" TEXT,
    "TipoAvaliacao" VARCHAR(20) NOT NULL,
    "DataAvaliacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "FK_Avaliacoes_Alugueis" 
        FOREIGN KEY ("AluguelId") 
        REFERENCES "Alugueis"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "FK_Avaliacoes_Equipamentos" 
        FOREIGN KEY ("EquipamentoId") 
        REFERENCES "Equipamentos"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "FK_Avaliacoes_UsuarioAvaliador" 
        FOREIGN KEY ("UsuarioAvaliadorId") 
        REFERENCES "Usuarios"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "FK_Avaliacoes_UsuarioAvaliado" 
        FOREIGN KEY ("UsuarioAvaliadoId") 
        REFERENCES "Usuarios"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "CHK_Avaliacoes_Nota" 
        CHECK ("Nota" >= 1 AND "Nota" <= 5),
    
    CONSTRAINT "CHK_Avaliacoes_Tipo" 
        CHECK ("TipoAvaliacao" IN ('Equipamento', 'Usuario'))
);

CREATE INDEX "IX_Avaliacoes_AluguelId" ON "Avaliacoes" ("AluguelId");
CREATE INDEX "IX_Avaliacoes_EquipamentoId" ON "Avaliacoes" ("EquipamentoId");
CREATE INDEX "IX_Avaliacoes_UsuarioAvaliadoId" ON "Avaliacoes" ("UsuarioAvaliadoId");

-- 5. Tabela Mensagens
CREATE TABLE "Mensagens" (
    "Id" SERIAL PRIMARY KEY,
    "AluguelId" INTEGER NOT NULL,
    "RemetenteId" INTEGER NOT NULL,
    "Conteudo" TEXT NOT NULL,
    "DataEnvio" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Lida" BOOLEAN NOT NULL DEFAULT FALSE,
    "DataLeitura" TIMESTAMP,
    
    CONSTRAINT "FK_Mensagens_Alugueis" 
        FOREIGN KEY ("AluguelId") 
        REFERENCES "Alugueis"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "FK_Mensagens_Usuarios" 
        FOREIGN KEY ("RemetenteId") 
        REFERENCES "Usuarios"("Id") 
        ON DELETE CASCADE
);

CREATE INDEX "IX_Mensagens_AluguelId" ON "Mensagens" ("AluguelId");
CREATE INDEX "IX_Mensagens_RemetenteId" ON "Mensagens" ("RemetenteId");
CREATE INDEX "IX_Mensagens_Lida" ON "Mensagens" ("Lida");

-- 6. Tabela Transacoes
CREATE TABLE "Transacoes" (
    "Id" SERIAL PRIMARY KEY,
    "AluguelId" INTEGER NOT NULL,
    "ValorPago" DECIMAL(10,2) NOT NULL,
    "Status" VARCHAR(20) NOT NULL DEFAULT 'Pendente',
    "MercadoPagoId" VARCHAR(100),
    "MercadoPagoPaymentId" VARCHAR(100),
    "DetalhesResposta" TEXT,
    "DataCriacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DataAtualizacao" TIMESTAMP,
    
    CONSTRAINT "FK_Transacoes_Alugueis" 
        FOREIGN KEY ("AluguelId") 
        REFERENCES "Alugueis"("Id") 
        ON DELETE CASCADE,
    
    CONSTRAINT "CHK_Transacoes_Status" 
        CHECK ("Status" IN ('Pendente', 'Aprovado', 'Recusado', 'Cancelado', 'Reembolsado'))
);

CREATE INDEX "IX_Transacoes_AluguelId" ON "Transacoes" ("AluguelId");
CREATE INDEX "IX_Transacoes_Status" ON "Transacoes" ("Status");
CREATE INDEX "IX_Transacoes_MercadoPagoPaymentId" ON "Transacoes" ("MercadoPagoPaymentId");

-- Verificar tabelas criadas
\dt

-- Mensagem de sucesso
SELECT 'Banco de dados criado com sucesso!' AS status;
```

---

## 🚀 Migrations com Entity Framework

### Método Recomendado (Automático)

O Entity Framework Core criará automaticamente as tabelas baseado nos Models.

```bash
# 1. Instalar ferramenta EF (se necessário)
dotnet tool install --global dotnet-ef

# 2. Criar migration inicial
dotnet ef migrations add InitialCreate

# 3. Aplicar ao banco de dados
dotnet ef database update
```

### Verificar Migrations

```bash
# Listar migrations
dotnet ef migrations list

# Ver SQL que será executado
dotnet ef migrations script

# Reverter migration
dotnet ef database update NomeDaMigrationAnterior

# Remover última migration
dotnet ef migrations remove
```

---

## 🔍 Verificação e Testes

### Verificar Estrutura

```sql
-- Listar todas as tabelas
\dt

-- Ver estrutura de uma tabela
\d "Usuarios"

-- Ver todos os índices
\di

-- Ver todas as constraints
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = '"Usuarios"'::regclass;

-- Contar registros
SELECT 
    'Usuarios' as tabela, COUNT(*) as total FROM "Usuarios"
UNION ALL
SELECT 'Equipamentos', COUNT(*) FROM "Equipamentos"
UNION ALL
SELECT 'Alugueis', COUNT(*) FROM "Alugueis"
UNION ALL
SELECT 'Avaliacoes', COUNT(*) FROM "Avaliacoes"
UNION ALL
SELECT 'Mensagens', COUNT(*) FROM "Mensagens"
UNION ALL
SELECT 'Transacoes', COUNT(*) FROM "Transacoes";
```

### Dados de Teste

```sql
-- Inserir usuário de teste
INSERT INTO "Usuarios" ("Nome", "Email", "SenhaHash", "Cidade", "UF", "Telefone")
VALUES ('João Silva', 'joao@test.com', '$2a$11$hashedpassword', 'São Paulo', 'SP', '11999999999');

-- Inserir equipamento de teste
INSERT INTO "Equipamentos" ("Titulo", "Descricao", "Categoria", "PrecoPorDia", "Cidade", "UF", "UsuarioId")
VALUES ('Furadeira Teste', 'Furadeira para testes', 'Ferramentas', 25.00, 'São Paulo', 'SP', 1);

-- Verificar
SELECT * FROM "Usuarios";
SELECT * FROM "Equipamentos";
```

---

## 📊 Diagrama ER (Entidade-Relacionamento)

```
┌─────────────────┐
│    Usuarios     │
├─────────────────┤
│ Id (PK)         │
│ Nome            │
│ Email (UNIQUE)  │
│ SenhaHash       │
│ Cidade          │
│ UF              │
│ FotoPerfil      │
│ Telefone        │
│ Ativo           │
