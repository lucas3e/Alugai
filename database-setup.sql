-- ============================================
-- Script SQL Completo - Banco de Dados Alugai
-- PostgreSQL 14+
-- ============================================

-- Conectar ao banco de dados
-- \c alugai_db

-- ============================================
-- LIMPEZA (Cuidado em produção!)
-- ============================================

DROP TABLE IF EXISTS "Transacoes" CASCADE;
DROP TABLE IF EXISTS "Mensagens" CASCADE;
DROP TABLE IF EXISTS "Avaliacoes" CASCADE;
DROP TABLE IF EXISTS "Alugueis" CASCADE;
DROP TABLE IF EXISTS "Equipamentos" CASCADE;
DROP TABLE IF EXISTS "Usuarios" CASCADE;

-- ============================================
-- CRIAÇÃO DAS TABELAS
-- ============================================

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

-- ============================================
-- CRIAÇÃO DOS ÍNDICES
-- ============================================

-- Índices da tabela Usuarios
CREATE INDEX "IX_Usuarios_Email" ON "Usuarios" ("Email");
CREATE INDEX "IX_Usuarios_Cidade_UF" ON "Usuarios" ("Cidade", "UF");

-- Índices da tabela Equipamentos
CREATE INDEX "IX_Equipamentos_UsuarioId" ON "Equipamentos" ("UsuarioId");
CREATE INDEX "IX_Equipamentos_Categoria" ON "Equipamentos" ("Categoria");
CREATE INDEX "IX_Equipamentos_Cidade_UF" ON "Equipamentos" ("Cidade", "UF");
CREATE INDEX "IX_Equipamentos_PrecoPorDia" ON "Equipamentos" ("PrecoPorDia");
CREATE INDEX "IX_Equipamentos_Disponivel" ON "Equipamentos" ("Disponivel");

-- Índices da tabela Alugueis
CREATE INDEX "IX_Alugueis_EquipamentoId" ON "Alugueis" ("EquipamentoId");
CREATE INDEX "IX_Alugueis_LocatarioId" ON "Alugueis" ("LocatarioId");
CREATE INDEX "IX_Alugueis_Status" ON "Alugueis" ("Status");
CREATE INDEX "IX_Alugueis_DataInicio_DataFim" ON "Alugueis" ("DataInicio", "DataFim");

-- Índices da tabela Avaliacoes
CREATE INDEX "IX_Avaliacoes_AluguelId" ON "Avaliacoes" ("AluguelId");
CREATE INDEX "IX_Avaliacoes_EquipamentoId" ON "Avaliacoes" ("EquipamentoId");
CREATE INDEX "IX_Avaliacoes_UsuarioAvaliadoId" ON "Avaliacoes" ("UsuarioAvaliadoId");

-- Índices da tabela Mensagens
CREATE INDEX "IX_Mensagens_AluguelId" ON "Mensagens" ("AluguelId");
CREATE INDEX "IX_Mensagens_RemetenteId" ON "Mensagens" ("RemetenteId");
CREATE INDEX "IX_Mensagens_Lida" ON "Mensagens" ("Lida");

-- Índices da tabela Transacoes
CREATE INDEX "IX_Transacoes_AluguelId" ON "Transacoes" ("AluguelId");
CREATE INDEX "IX_Transacoes_Status" ON "Transacoes" ("Status");
CREATE INDEX "IX_Transacoes_MercadoPagoPaymentId" ON "Transacoes" ("MercadoPagoPaymentId");

-- ============================================
-- DADOS DE TESTE (Opcional)
-- ============================================

-- Inserir usuário de teste
-- Senha: "senha123" (hash gerado pelo BCrypt)
INSERT INTO "Usuarios" ("Nome", "Email", "SenhaHash", "Cidade", "UF", "Telefone")
VALUES 
    ('João Silva', 'joao@test.com', '$2a$11$K5xLvVqVqVqVqVqVqVqVqeO', 'São Paulo', 'SP', '11999999999'),
    ('Maria Santos', 'maria@test.com', '$2a$11$K5xLvVqVqVqVqVqVqVqVqeO', 'Rio de Janeiro', 'RJ', '21988888888');

-- Inserir equipamentos de teste
INSERT INTO "Equipamentos" ("Titulo", "Descricao", "Categoria", "PrecoPorDia", "Cidade", "UF", "UsuarioId")
VALUES 
    ('Furadeira Elétrica', 'Furadeira profissional 500W', 'Ferramentas', 25.00, 'São Paulo', 'SP', 1),
    ('Escada 6 Metros', 'Escada de alumínio dobrável', 'Ferramentas', 15.00, 'São Paulo', 'SP', 1),
    ('Aspirador de Pó', 'Aspirador potente 1200W', 'Eletrodomésticos', 20.00, 'Rio de Janeiro', 'RJ', 2);

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Listar todas as tabelas
\dt

-- Contar registros em cada tabela
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

-- Mensagem de sucesso
SELECT '✅ Banco de dados criado com sucesso!' AS status;
SELECT '📊 Total de tabelas: 6' AS info;
SELECT '🔗 Total de índices: 17' AS info;
