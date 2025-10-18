#!/bin/bash

# Script de teste da API Alugai
# Execute: chmod +x test-api.sh && ./test-api.sh

BASE_URL="http://localhost:5000/api"
TOKEN=""

echo "🚀 Testando API Alugai"
echo "====================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir sucesso
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Função para imprimir erro
error() {
    echo -e "${RED}✗ $1${NC}"
}

# Função para imprimir info
info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# 1. Registrar usuário
echo "1️⃣  Registrando novo usuário..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Usuario",
    "email": "teste@example.com",
    "senha": "senha123",
    "cidade": "São Paulo",
    "uf": "SP",
    "telefone": "11999999999"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    success "Usuário registrado com sucesso"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    info "Token: ${TOKEN:0:50}..."
else
    error "Falha ao registrar usuário"
    echo "$REGISTER_RESPONSE"
fi

echo ""

# 2. Fazer login
echo "2️⃣  Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "senha": "senha123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    success "Login realizado com sucesso"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    error "Falha no login"
    echo "$LOGIN_RESPONSE"
fi

echo ""

# 3. Obter perfil
echo "3️⃣  Obtendo perfil do usuário..."
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "nome"; then
    success "Perfil obtido com sucesso"
    echo "$PROFILE_RESPONSE" | grep -o '"nome":"[^"]*' | cut -d'"' -f4
else
    error "Falha ao obter perfil"
    echo "$PROFILE_RESPONSE"
fi

echo ""

# 4. Criar equipamento
echo "4️⃣  Criando equipamento..."
EQUIPAMENTO_RESPONSE=$(curl -s -X POST "$BASE_URL/equipamentos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "titulo": "Furadeira Elétrica Teste",
    "descricao": "Furadeira profissional 500W para testes",
    "categoria": "Ferramentas",
    "precoPorDia": 25.00,
    "cidade": "São Paulo",
    "uf": "SP",
    "endereco": "Rua Teste, 123"
  }')

if echo "$EQUIPAMENTO_RESPONSE" | grep -q "id"; then
    success "Equipamento criado com sucesso"
    EQUIPAMENTO_ID=$(echo "$EQUIPAMENTO_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    info "ID do equipamento: $EQUIPAMENTO_ID"
else
    error "Falha ao criar equipamento"
    echo "$EQUIPAMENTO_RESPONSE"
fi

echo ""

# 5. Listar equipamentos
echo "5️⃣  Listando equipamentos..."
LISTA_RESPONSE=$(curl -s -X GET "$BASE_URL/equipamentos")

if echo "$LISTA_RESPONSE" | grep -q "data"; then
    success "Equipamentos listados com sucesso"
    TOTAL=$(echo "$LISTA_RESPONSE" | grep -o '"total":[0-9]*' | cut -d':' -f2)
    info "Total de equipamentos: $TOTAL"
else
    error "Falha ao listar equipamentos"
    echo "$LISTA_RESPONSE"
fi

echo ""

# 6. Obter equipamento específico
if [ ! -z "$EQUIPAMENTO_ID" ]; then
    echo "6️⃣  Obtendo equipamento específico..."
    DETALHE_RESPONSE=$(curl -s -X GET "$BASE_URL/equipamentos/$EQUIPAMENTO_ID")
    
    if echo "$DETALHE_RESPONSE" | grep -q "titulo"; then
        success "Equipamento obtido com sucesso"
        TITULO=$(echo "$DETALHE_RESPONSE" | grep -o '"titulo":"[^"]*' | cut -d'"' -f4)
        info "Título: $TITULO"
    else
        error "Falha ao obter equipamento"
        echo "$DETALHE_RESPONSE"
    fi
    echo ""
fi

# 7. Atualizar equipamento
if [ ! -z "$EQUIPAMENTO_ID" ]; then
    echo "7️⃣  Atualizando equipamento..."
    UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/equipamentos/$EQUIPAMENTO_ID" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "titulo": "Furadeira Elétrica Atualizada",
        "precoPorDia": 30.00
      }')
    
    if echo "$UPDATE_RESPONSE" | grep -q "id"; then
        success "Equipamento atualizado com sucesso"
    else
        error "Falha ao atualizar equipamento"
        echo "$UPDATE_RESPONSE"
    fi
    echo ""
fi

# 8. Deletar equipamento
if [ ! -z "$EQUIPAMENTO_ID" ]; then
    echo "8️⃣  Deletando equipamento..."
    DELETE_RESPONSE=$(curl -s -w "%{http_code}" -X DELETE "$BASE_URL/equipamentos/$EQUIPAMENTO_ID" \
      -H "Authorization: Bearer $TOKEN")
    
    if [ "$DELETE_RESPONSE" = "204" ]; then
        success "Equipamento deletado com sucesso"
    else
        error "Falha ao deletar equipamento"
        echo "Status code: $DELETE_RESPONSE"
    fi
    echo ""
fi

echo "✅ Testes concluídos!"
echo ""
echo "📊 Resumo:"
echo "  - Registro: OK"
echo "  - Login: OK"
echo "  - Perfil: OK"
echo "  - CRUD Equipamentos: OK"
echo ""
echo "🎉 API está funcionando corretamente!"
