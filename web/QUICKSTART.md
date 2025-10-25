# 🚀 Guia Rápido - Alugai Web

Este guia vai te ajudar a rodar a aplicação web em **menos de 5 minutos**!

## ⚡ Início Rápido

### 1️⃣ Instale as dependências

```bash
cd web
npm install
```

### 2️⃣ Configure a API

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

O arquivo já vem configurado para desenvolvimento local:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3️⃣ Certifique-se que a API está rodando

Em outro terminal, na pasta raiz do projeto:

```bash
cd ..
dotnet run
```

A API deve estar em `http://localhost:5000`

### 4️⃣ Inicie a aplicação web

```bash
npm start
```

A aplicação abrirá automaticamente em `http://localhost:3000` 🎉

## 📱 Testando a Aplicação

### Criar uma conta

1. Acesse `http://localhost:3000`
2. Clique em "Não tem uma conta? Cadastre-se"
3. Preencha o formulário:
   - Nome: Seu nome
   - Email: seu@email.com
   - Senha: senha123
   - Cidade: São Paulo
   - UF: SP
4. Clique em "Criar Conta"

### Fazer login

1. Use o email e senha cadastrados
2. Clique em "Entrar"

### Navegar pela aplicação

- **Início**: Veja equipamentos disponíveis
- **Meus Equipamentos**: Gerencie seus equipamentos
- **Meus Aluguéis**: Veja seus aluguéis
- **Perfil**: Visualize seu perfil

## 🛠️ Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm start

# Criar build de produção
npm run build

# Executar testes
npm test
```

## 🐛 Problemas Comuns

### Erro: "Cannot connect to API"

**Causa**: A API backend não está rodando

**Solução**:
```bash
# Em outro terminal, na pasta raiz
cd ..
dotnet run
```

### Erro: "Port 3000 is already in use"

**Solução**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Erro de instalação

**Solução**:
```bash
# Limpe o cache
rm -rf node_modules package-lock.json
npm install
```

## 📚 Próximos Passos

- Leia o [README.md](README.md) completo para mais detalhes
- Explore a [documentação da API](../API_DOCUMENTATION.md)
- Veja a estrutura do projeto no README

## 💡 Dicas

- Use **Chrome DevTools** para debugging
- Instale a extensão **React Developer Tools**
- Use **Redux DevTools** se adicionar Redux no futuro
- Configure o **ESLint** e **Prettier** para melhor qualidade de código

## 🎨 Customização Rápida

### Mudar cores do tema

Edite `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#6200ee' },  // Sua cor
    secondary: { main: '#03dac6' }, // Sua cor
  },
});
```

### Mudar título da aplicação

Edite `public/index.html`:

```html
<title>Seu Título</title>
```

## ✅ Checklist de Desenvolvimento

- [ ] API backend rodando
- [ ] Dependências instaladas
- [ ] Arquivo .env configurado
- [ ] Aplicação iniciada com `npm start`
- [ ] Conta de teste criada
- [ ] Login funcionando
- [ ] Navegação testada

## 🚀 Deploy Rápido

### Vercel (Mais fácil)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```

---

**Pronto!** Você está rodando o Alugai Web! 🎉

Para mais informações, consulte o [README.md](README.md) completo.
