# 📦 Guia de Instalação - Alugai Web

Guia detalhado para instalação e configuração da aplicação web.

## 📋 Pré-requisitos

### Obrigatórios

- **Node.js** 16.x ou superior
  - Download: https://nodejs.org/
  - Verificar: `node --version`

- **npm** 8.x ou superior (vem com Node.js)
  - Verificar: `npm --version`

### Opcionais

- **Yarn** (alternativa ao npm)
  - Instalar: `npm install -g yarn`
  - Verificar: `yarn --version`

- **Git** (para clonar o repositório)
  - Download: https://git-scm.com/

## 🚀 Instalação Passo a Passo

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/alugai.git
cd alugai/web
```

Ou se já tem o projeto:

```bash
cd alugai/web
```

### 2. Instale as Dependências

#### Usando npm:

```bash
npm install
```

#### Usando yarn:

```bash
yarn install
```

**Tempo estimado:** 2-5 minutos (dependendo da conexão)

### 3. Configure as Variáveis de Ambiente

Crie o arquivo `.env`:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edite o arquivo `.env` se necessário:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Verifique a API Backend

A aplicação web precisa da API rodando. Em outro terminal:

```bash
# Volte para a raiz do projeto
cd ..

# Execute a API
dotnet run
```

Verifique se a API está respondendo:
```bash
curl http://localhost:5000/api/health
```

### 5. Inicie a Aplicação

```bash
npm start
```

ou

```bash
yarn start
```

A aplicação abrirá automaticamente em `http://localhost:3000`

## ✅ Verificação da Instalação

### Checklist

- [ ] Node.js instalado (v16+)
- [ ] npm instalado (v8+)
- [ ] Dependências instaladas sem erros
- [ ] Arquivo `.env` criado
- [ ] API backend rodando
- [ ] Aplicação web iniciada
- [ ] Navegador abriu em `http://localhost:3000`
- [ ] Página de login apareceu

### Teste Rápido

1. Acesse `http://localhost:3000`
2. Clique em "Cadastre-se"
3. Preencha o formulário
4. Se conseguir criar conta, está tudo funcionando! ✅

## 🐛 Solução de Problemas

### Erro: "Cannot find module"

**Causa:** Dependências não instaladas corretamente

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 is already in use"

**Causa:** Porta 3000 já está sendo usada

**Solução 1 - Usar outra porta:**
```bash
# Windows
set PORT=3001 && npm start

# Linux/Mac
PORT=3001 npm start
```

**Solução 2 - Liberar a porta:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Erro: "Cannot connect to API"

**Causa:** API backend não está rodando

**Solução:**
```bash
# Em outro terminal, na raiz do projeto
cd ..
dotnet run
```

### Erro: "EACCES: permission denied"

**Causa:** Permissões insuficientes

**Solução:**
```bash
# Linux/Mac
sudo chown -R $USER ~/.npm
sudo chown -R $USER node_modules

# Ou use yarn
yarn install
```

### Erro de TypeScript

**Causa:** Versão incompatível do TypeScript

**Solução:**
```bash
npm install --save-dev typescript@4.9.5
```

### Erro: "Module not found: Can't resolve 'react'"

**Causa:** React não instalado corretamente

**Solução:**
```bash
npm install react react-dom
```

## 🔧 Configurações Avançadas

### Alterar Porta Padrão

Crie/edite `.env`:
```env
PORT=3001
```

### Configurar Proxy para API

Se a API estiver em outro domínio, adicione em `package.json`:

```json
{
  "proxy": "http://localhost:5000"
}
```

### Desabilitar Abertura Automática do Navegador

Adicione em `.env`:
```env
BROWSER=none
```

### Configurar HTTPS em Desenvolvimento

Adicione em `.env`:
```env
HTTPS=true
```

## 📦 Dependências Principais

### Produção

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "@mui/material": "^5.14.20",
  "@mui/icons-material": "^5.14.19",
  "axios": "^1.6.2"
}
```

### Desenvolvimento

```json
{
  "typescript": "^4.9.5",
  "@types/react": "^18.2.45",
  "@types/react-dom": "^18.2.18"
}
```

## 🔄 Atualizações

### Atualizar Dependências

```bash
# Verificar atualizações disponíveis
npm outdated

# Atualizar todas (cuidado!)
npm update

# Atualizar uma específica
npm install react@latest
```

### Atualizar Create React App

```bash
npm install react-scripts@latest
```

## 🧹 Limpeza

### Limpar Cache

```bash
# npm
npm cache clean --force

# yarn
yarn cache clean
```

### Remover node_modules

```bash
# Windows
rmdir /s /q node_modules

# Linux/Mac
rm -rf node_modules
```

### Reinstalar Tudo

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📊 Requisitos de Sistema

### Mínimos

- **RAM:** 4 GB
- **Espaço em Disco:** 500 MB
- **Processador:** Dual-core 2.0 GHz

### Recomendados

- **RAM:** 8 GB ou mais
- **Espaço em Disco:** 1 GB
- **Processador:** Quad-core 2.5 GHz ou superior
- **SSD** para melhor performance

## 🌐 Navegadores Suportados

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Internet Explorer: Não suportado

## 📱 Desenvolvimento Mobile

Para testar em dispositivos móveis na mesma rede:

1. Descubra seu IP local:
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

2. Acesse no celular:
```
http://SEU_IP:3000
```

Exemplo: `http://192.168.1.100:3000`

## 🚀 Próximos Passos

Após a instalação bem-sucedida:

1. ✅ Leia o [README.md](README.md) completo
2. ✅ Explore o [QUICKSTART.md](QUICKSTART.md)
3. ✅ Veja a [documentação da API](../API_DOCUMENTATION.md)
4. ✅ Comece a desenvolver!

## 📞 Suporte

Se encontrar problemas:

1. Verifique este guia novamente
2. Consulte as [Issues no GitHub](https://github.com/seu-usuario/alugai/issues)
3. Entre em contato: contato@alugai.com

---

✅ **Instalação concluída com sucesso!** Bom desenvolvimento! 🎉
