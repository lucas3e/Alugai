# 🌐 Alugai Web - Frontend React

Aplicação web desenvolvida em **React com TypeScript** para o sistema de aluguel de equipamentos entre vizinhos.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Build para Produção](#build-para-produção)

## 🎯 Sobre o Projeto

O **Alugai Web** é a interface web do sistema Alugai, permitindo que usuários:

- Cadastrem-se e façam login
- Naveguem e busquem equipamentos disponíveis
- Gerenciem seus próprios equipamentos
- Solicitem e gerenciem aluguéis
- Visualizem perfis e avaliações

## 🚀 Tecnologias Utilizadas

- **[React 18](https://react.dev/)** - Biblioteca JavaScript para interfaces
- **[TypeScript 4.9](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Material-UI 5](https://mui.com/)** - Biblioteca de componentes React
- **[React Router 6](https://reactrouter.com/)** - Roteamento para React
- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[Context API](https://react.dev/reference/react/useContext)** - Gerenciamento de estado

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **API Backend** rodando (veja o README principal do projeto)

## 🔧 Instalação

### 1. Clone o repositório (se ainda não fez)

```bash
git clone https://github.com/seu-usuario/alugai.git
cd alugai/web
```

### 2. Instale as dependências

```bash
npm install
```

ou com yarn:

```bash
yarn install
```

## ⚙️ Configuração

### 1. Configure a URL da API

Crie um arquivo `.env` na raiz da pasta `web`:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Importante:** 
- Para desenvolvimento local, use `http://localhost:5000/api`
- Para produção, substitua pela URL da sua API em produção

### 2. Verifique a API Backend

Certifique-se de que a API backend está rodando:

```bash
# Na pasta raiz do projeto
cd ..
dotnet run
```

A API deve estar disponível em `http://localhost:5000`

## 🚀 Executando o Projeto

### Modo Desenvolvimento

```bash
npm start
```

ou

```bash
yarn start
```

A aplicação será aberta automaticamente em [http://localhost:3000](http://localhost:3000)

### Características do Modo Desenvolvimento

- ✅ Hot reload automático
- ✅ Mensagens de erro detalhadas
- ✅ Source maps para debugging
- ✅ Validação de tipos TypeScript em tempo real

## 📁 Estrutura do Projeto

```
web/
├── public/                 # Arquivos públicos estáticos
│   ├── index.html         # HTML principal
│   ├── manifest.json      # Configuração PWA
│   └── robots.txt         # SEO
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   └── Layout/        # Componentes de layout
│   │       └── MainLayout.tsx
│   ├── contexts/          # Contextos React (estado global)
│   │   └── AuthContext.tsx
│   ├── pages/             # Páginas da aplicação
│   │   ├── Auth/          # Páginas de autenticação
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── Home/          # Página inicial
│   │   │   └── HomePage.tsx
│   │   ├── Equipamento/   # Páginas de equipamentos
│   │   │   ├── EquipamentoDetailPage.tsx
│   │   │   ├── MeusEquipamentosPage.tsx
│   │   │   └── AddEquipamentoPage.tsx
│   │   ├── Aluguel/       # Páginas de aluguéis
│   │   │   ├── MeusAlugueisPage.tsx
│   │   │   └── AluguelDetailPage.tsx
│   │   └── Perfil/        # Página de perfil
│   │       └── PerfilPage.tsx
│   ├── services/          # Serviços de API
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   ├── equipamento.service.ts
│   │   └── aluguel.service.ts
│   ├── types/             # Definições TypeScript
│   │   └── index.ts
│   ├── config/            # Configurações
│   │   └── api.ts
│   ├── routes/            # Configuração de rotas
│   │   └── index.tsx
│   ├── App.tsx            # Componente principal
│   └── index.tsx          # Ponto de entrada
├── .env.example           # Exemplo de variáveis de ambiente
├── .gitignore            # Arquivos ignorados pelo Git
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração TypeScript
└── README.md             # Este arquivo
```

## ✨ Funcionalidades

### 🔐 Autenticação
- ✅ Login com email e senha
- ✅ Registro de novos usuários
- ✅ Autenticação persistente (localStorage)
- ✅ Proteção de rotas privadas
- ✅ Logout

### 🏠 Página Inicial
- ✅ Listagem de equipamentos disponíveis
- ✅ Busca por texto
- ✅ Filtro por categoria
- ✅ Cards com informações dos equipamentos
- ✅ Navegação para detalhes

### 📦 Equipamentos
- ✅ Visualização de detalhes
- ✅ Informações do proprietário
- ✅ Preço por dia
- ✅ Localização
- ✅ Imagens

### 👤 Perfil
- ✅ Visualização de dados do usuário
- ✅ Informações de contato
- ✅ Localização

### 🎨 Interface
- ✅ Design responsivo (mobile e desktop)
- ✅ Material Design (Material-UI)
- ✅ Tema customizado
- ✅ Feedback visual (loading, erros)
- ✅ Navegação intuitiva

## 📜 Scripts Disponíveis

### `npm start`
Inicia o servidor de desenvolvimento.

### `npm test`
Executa os testes (quando implementados).

### `npm run build`
Cria a build de produção na pasta `build/`.

### `npm run eject`
**Atenção:** Operação irreversível! Ejeta as configurações do Create React App.

## 🏗️ Build para Produção

### 1. Criar build otimizada

```bash
npm run build
```

Isso criará uma pasta `build/` com os arquivos otimizados para produção:
- ✅ Código minificado
- ✅ Assets otimizados
- ✅ Cache busting
- ✅ Source maps

### 2. Testar build localmente

```bash
# Instale o serve globalmente (se ainda não tiver)
npm install -g serve

# Sirva a build
serve -s build
```

Acesse em [http://localhost:3000](http://localhost:3000)

### 3. Deploy

#### Opção 1: Vercel (Recomendado)

```bash
# Instale o Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Opção 2: Netlify

```bash
# Instale o Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

#### Opção 3: Servidor próprio

Copie o conteúdo da pasta `build/` para seu servidor web (Apache, Nginx, etc.)

**Configuração Nginx exemplo:**

```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/alugai-web/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Variáveis de Ambiente

### Desenvolvimento (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Produção (.env.production)
```env
REACT_APP_API_URL=https://api.alugai.com/api
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to API"

**Solução:**
1. Verifique se a API backend está rodando
2. Confirme a URL da API no arquivo `.env`
3. Verifique se há problemas de CORS na API

### Erro: "Module not found"

**Solução:**
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro de TypeScript

**Solução:**
```bash
# Verifique os tipos
npm run build
```

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1440px+)

## 🎨 Customização

### Alterar cores do tema

Edite `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ee', // Sua cor primária
    },
    secondary: {
      main: '#03dac6', // Sua cor secundária
    },
  },
});
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Suporte

- Email: contato@alugai.com
- Issues: [GitHub Issues](https://github.com/seu-usuario/alugai/issues)

---

⭐ Desenvolvido com React e TypeScript para conectar vizinhos!
