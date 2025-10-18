# 📱 Alugai Mobile - Frontend React Native

Aplicativo móvel para aluguel de equipamentos entre vizinhos, desenvolvido com React Native, Expo e TypeScript.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Telas do Aplicativo](#telas-do-aplicativo)
- [Integração com a API](#integração-com-a-api)
- [Build e Deploy](#build-e-deploy)
- [Troubleshooting](#troubleshooting)

## 🎯 Sobre o Projeto

O **Alugai Mobile** é o aplicativo móvel que conecta vizinhos para aluguel de equipamentos, ferramentas e outros itens. Desenvolvido com React Native e Expo para facilitar o desenvolvimento e distribuição.

## 🚀 Tecnologias Utilizadas

- **[React Native](https://reactnative.dev/)** - Framework para desenvolvimento mobile
- **[Expo](https://expo.dev/)** - Plataforma para desenvolvimento React Native
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[React Navigation](https://reactnavigation.org/)** - Navegação entre telas
- **[React Native Paper](https://callstack.github.io/react-native-paper/)** - Biblioteca de componentes Material Design
- **[Axios](https://axios-http.com/)** - Cliente HTTP para requisições à API
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** - Armazenamento local persistente

## ✨ Funcionalidades

### 🔐 Autenticação
- ✅ Tela de Login
- ✅ Tela de Registro
- ✅ Autenticação persistente com JWT
- ✅ Logout

### 🏠 Home
- ✅ Listagem de equipamentos disponíveis
- ✅ Busca de equipamentos
- ✅ Filtros por categoria, localização e preço
- ✅ Visualização de detalhes do equipamento

### 📦 Meus Equipamentos
- ✅ Listagem dos meus equipamentos
- ✅ Adicionar novo equipamento
- ✅ Editar equipamento
- ✅ Upload de imagens
- ✅ Excluir equipamento

### 📆 Aluguéis
- ✅ Listar meus aluguéis (como locatário e proprietário)
- ✅ Solicitar aluguel
- ✅ Aceitar/Recusar solicitações
- ✅ Acompanhar status do aluguel
- ✅ Avaliar equipamento/usuário

### 💬 Chat
- ✅ Conversar com locador/locatário
- ✅ Histórico de mensagens
- ✅ Notificações de mensagens não lidas

### 👤 Perfil
- ✅ Visualizar perfil
- ✅ Editar informações
- ✅ Upload de foto de perfil
- ✅ Visualizar avaliações recebidas

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado:

### Obrigatório:
- **[Node.js](https://nodejs.org/)** (versão 18 ou superior)
- **[npm](https://www.npmjs.com/)** ou **[Yarn](https://yarnpkg.com/)**
- **[Git](https://git-scm.com/)**

### Para testar no dispositivo físico:
- **[Expo Go](https://expo.dev/client)** - Aplicativo disponível na App Store e Google Play

### Para testar em emulador (opcional):
- **[Android Studio](https://developer.android.com/studio)** - Para emulador Android
- **[Xcode](https://developer.apple.com/xcode/)** - Para emulador iOS (apenas macOS)

### Verificar instalações:

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Git
git --version
```

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/alugai.git
cd alugai/mobile
```

### 2. Instalar dependências

```bash
npm install
```

Ou com Yarn:

```bash
yarn install
```

### 3. Instalar Expo CLI globalmente (opcional)

```bash
npm install -g expo-cli
```

## ⚙️ Configuração

### 1. Configurar a URL da API

Edite o arquivo `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  // Para desenvolvimento local no emulador Android
  BASE_URL: 'http://10.0.2.2:5000/api',
  
  // Para desenvolvimento local no emulador iOS
  // BASE_URL: 'http://localhost:5000/api',
  
  // Para testar em dispositivo físico, use o IP da sua máquina
  // BASE_URL: 'http://192.168.1.100:5000/api',
  
  // Para produção
  // BASE_URL: 'https://api.alugai.com/api',
  
  TIMEOUT: 30000,
};
```

### 2. Descobrir o IP da sua máquina (para testar em dispositivo físico)

**Windows:**
```bash
ipconfig
```
Procure por "Endereço IPv4" na seção da sua conexão de rede.

**macOS/Linux:**
```bash
ifconfig
```
Procure por "inet" na seção da sua conexão de rede.

### 3. Configurar variáveis de ambiente (opcional)

Crie um arquivo `.env` na raiz do projeto mobile:

```env
API_URL=http://192.168.1.100:5000/api
```

## ▶️ Executando o Projeto

### Iniciar o servidor de desenvolvimento

```bash
npm start
```

Ou:

```bash
npx expo start
```

Isso abrirá o Expo Dev Tools no seu navegador.

### Executar no dispositivo físico

1. Instale o aplicativo **Expo Go** no seu smartphone:
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Escaneie o QR Code que aparece no terminal ou no navegador:
   - **iOS**: Use o aplicativo Câmera nativo
   - **Android**: Use o aplicativo Expo Go

3. Aguarde o aplicativo carregar no seu dispositivo

### Executar no emulador Android

```bash
npm run android
```

Ou:

```bash
npx expo start --android
```

**Requisitos:**
- Android Studio instalado
- Emulador Android configurado e em execução

### Executar no emulador iOS (apenas macOS)

```bash
npm run ios
```

Ou:

```bash
npx expo start --ios
```

**Requisitos:**
- Xcode instalado
- Simulador iOS configurado

### Executar no navegador (web)

```bash
npm run web
```

Ou:

```bash
npx expo start --web
```

## 📁 Estrutura do Projeto

```
mobile/
├── src/
│   ├── config/              # Configurações
│   │   └── api.ts           # Configuração da API
│   ├── contexts/            # Contextos React
│   │   └── AuthContext.tsx  # Contexto de autenticação
│   ├── navigation/          # Navegação
│   │   └── index.tsx        # Configuração de rotas
│   ├── screens/             # Telas do aplicativo
│   │   ├── Auth/            # Telas de autenticação
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── Home/            # Tela inicial
│   │   │   └── HomeScreen.tsx
│   │   ├── Equipamento/     # Telas de equipamentos
│   │   │   ├── EquipamentoDetailScreen.tsx
│   │   │   ├── MeusEquipamentosScreen.tsx
│   │   │   └── AddEquipamentoScreen.tsx
│   │   ├── Aluguel/         # Telas de aluguéis
│   │   │   ├── MeusAlugueisScreen.tsx
│   │   │   └── AluguelDetailScreen.tsx
│   │   ├── Chat/            # Tela de chat
│   │   │   └── ChatScreen.tsx
│   │   └── Perfil/          # Tela de perfil
│   │       └── PerfilScreen.tsx
│   ├── services/            # Serviços de API
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   ├── equipamento.service.ts
│   │   ├── aluguel.service.ts
│   │   ├── mensagem.service.ts
│   │   ├── avaliacao.service.ts
│   │   └── storage.service.ts
│   ├── theme/               # Tema e estilos
│   │   └── index.ts
│   └── types/               # Tipos TypeScript
│       └── index.ts
├── assets/                  # Imagens e recursos
├── App.tsx                  # Componente raiz
├── app.json                 # Configuração do Expo
├── package.json             # Dependências
├── tsconfig.json            # Configuração TypeScript
└── README.md                # Este arquivo
```

## 📱 Telas do Aplicativo

### Autenticação
- **Login**: Email e senha
- **Registro**: Cadastro de novo usuário

### Principal
- **Home**: Lista de equipamentos disponíveis com busca e filtros
- **Detalhes do Equipamento**: Informações completas, fotos, avaliações
- **Meus Equipamentos**: Gerenciar equipamentos cadastrados
- **Adicionar Equipamento**: Cadastrar novo equipamento com fotos
- **Meus Aluguéis**: Visualizar aluguéis como locatário e proprietário
- **Detalhes do Aluguel**: Status, datas, valores, ações
- **Chat**: Conversar sobre o aluguel
- **Perfil**: Informações do usuário, avaliações, configurações

## 🔌 Integração com a API

O aplicativo se comunica com a API REST desenvolvida em C# ASP.NET Core.

### Endpoints principais utilizados:

- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter perfil
- `GET /api/equipamentos` - Listar equipamentos
- `GET /api/equipamentos/{id}` - Detalhes do equipamento
- `POST /api/equipamentos` - Criar equipamento
- `GET /api/alugueis` - Listar aluguéis
- `POST /api/alugueis` - Solicitar aluguel
- `GET /api/alugueis/{id}/mensagens` - Listar mensagens
- `POST /api/avaliacoes` - Criar avaliação

### Autenticação

O aplicativo usa JWT (JSON Web Tokens) para autenticação:

1. Após login/registro, o token é armazenado localmente
2. Todas as requisições autenticadas incluem o header: `Authorization: Bearer {token}`
3. O token é automaticamente incluído pelo interceptor do Axios

## 📦 Build e Deploy

### Build para Android (APK)

```bash
# Build de desenvolvimento
eas build --platform android --profile development

# Build de produção
eas build --platform android --profile production
```

### Build para iOS (IPA)

```bash
# Build de desenvolvimento
eas build --platform ios --profile development

# Build de produção
eas build --platform ios --profile production
```

### Publicar no Expo

```bash
expo publish
```

### Configurar EAS Build

1. Instale o EAS CLI:
```bash
npm install -g eas-cli
```

2. Faça login:
```bash
eas login
```

3. Configure o projeto:
```bash
eas build:configure
```

## 🐛 Troubleshooting

### Erro: "Unable to resolve module"

```bash
# Limpar cache e reinstalar
rm -rf node_modules
npm install
npx expo start --clear
```

### Erro de conexão com a API

1. Verifique se a API está rodando
2. Confirme o IP/URL correto em `src/config/api.ts`
3. Verifique se o firewall não está bloqueando a conexão
4. Para Android, use `10.0.2.2` ao invés de `localhost`

### Aplicativo não carrega no Expo Go

1. Certifique-se de que o dispositivo e o computador estão na mesma rede Wi-Fi
2. Tente usar o modo Tunnel: `npx expo start --tunnel`
3. Verifique se o firewall não está bloqueando a conexão

### Erro de TypeScript

```bash
# Limpar cache do TypeScript
rm -rf .expo
npx expo start --clear
```

### Problemas com imagens

1. Verifique se a URL da API está correta
2. Confirme que as imagens estão sendo servidas corretamente pela API
3. Verifique permissões de câmera/galeria no dispositivo

## 📝 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar no navegador
npm run web

# Limpar cache
npx expo start --clear

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 🔒 Segurança

- Tokens JWT armazenados de forma segura com AsyncStorage
- Senhas nunca são armazenadas localmente
- Comunicação HTTPS em produção
- Validação de entrada em todos os formulários

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ para conectar vizinhos e promover economia compartilhada.

## 📞 Suporte

- Email: contato@alugai.com
- Issues: [GitHub Issues](https://github.com/seu-usuario/alugai/issues)

---

## 🚀 Próximos Passos

- [ ] Implementar notificações push
- [ ] Adicionar modo offline
- [ ] Implementar geolocalização
- [ ] Adicionar filtros avançados
- [ ] Implementar chat em tempo real
- [ ] Adicionar suporte a múltiplos idiomas
- [ ] Implementar dark mode

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!
