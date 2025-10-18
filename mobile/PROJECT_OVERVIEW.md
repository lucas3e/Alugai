# 📱 Alugai Mobile - Visão Geral do Projeto

## 🎯 Objetivo

Aplicativo móvel para conectar vizinhos que desejam alugar equipamentos, ferramentas e outros itens, promovendo economia compartilhada e sustentabilidade.

## 📊 Status do Projeto

✅ **Estrutura Completa Criada**

### Implementado

- ✅ Configuração do projeto Expo com TypeScript
- ✅ Estrutura de pastas organizada
- ✅ Sistema de navegação (Auth + Main Tabs)
- ✅ Contexto de autenticação
- ✅ Serviços de API completos
- ✅ Telas principais criadas
- ✅ Tema e estilos globais
- ✅ Tipos TypeScript definidos
- ✅ Documentação completa

### Próximos Passos

1. **Instalar Dependências**
   ```bash
   cd mobile
   npm install
   ```

2. **Configurar API**
   - Editar `src/config/api.ts` com URL da API
   - Garantir que a API backend está rodando

3. **Executar o App**
   ```bash
   npm start
   ```

4. **Testar Funcionalidades**
   - Login/Registro
   - Listagem de equipamentos
   - Navegação entre telas

## 🏗️ Arquitetura

```
┌─────────────────────────────────────┐
│         Camada de Apresentação      │
│  (Screens - React Native + Paper)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Camada de Estado Global        │
│        (Context API)                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Camada de Serviços             │
│   (API Services + Storage)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Backend API                 │
│    (C# ASP.NET Core)                │
└─────────────────────────────────────┘
```

## 📦 Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React Native | 0.74.0 | Framework mobile |
| Expo | ~51.0.0 | Plataforma de desenvolvimento |
| TypeScript | ^5.1.3 | Tipagem estática |
| React Navigation | ^6.x | Navegação |
| React Native Paper | ^5.11.3 | Componentes UI |
| Axios | ^1.6.2 | Cliente HTTP |
| AsyncStorage | 1.23.1 | Armazenamento local |

## 📱 Funcionalidades Principais

### 1. Autenticação
- Login com email/senha
- Registro de novos usuários
- Autenticação persistente com JWT
- Logout

### 2. Equipamentos
- Listagem com busca e filtros
- Visualização de detalhes
- Cadastro de equipamentos
- Upload de múltiplas imagens
- Edição e exclusão

### 3. Aluguéis
- Solicitação de aluguel
- Aprovação/Recusa (proprietário)
- Acompanhamento de status
- Histórico de aluguéis

### 4. Comunicação
- Chat entre locador e locatário
- Notificações de mensagens

### 5. Avaliações
- Avaliar equipamentos
- Avaliar usuários
- Visualizar avaliações recebidas

### 6. Perfil
- Visualizar e editar perfil
- Upload de foto de perfil
- Visualizar estatísticas

## 📂 Estrutura de Arquivos

```
mobile/
├── src/
│   ├── config/
│   │   └── api.ts                    # Configuração da API
│   ├── contexts/
│   │   └── AuthContext.tsx           # Contexto de autenticação
│   ├── navigation/
│   │   └── index.tsx                 # Configuração de rotas
│   ├── screens/
│   │   ├── Auth/                     # Telas de autenticação
│   │   ├── Home/                     # Tela inicial
│   │   ├── Equipamento/              # Telas de equipamentos
│   │   ├── Aluguel/                  # Telas de aluguéis
│   │   ├── Chat/                     # Tela de chat
│   │   └── Perfil/                   # Tela de perfil
│   ├── services/
│   │   ├── api.service.ts            # Cliente HTTP base
│   │   ├── auth.service.ts           # Serviço de autenticação
│   │   ├── equipamento.service.ts    # Serviço de equipamentos
│   │   ├── aluguel.service.ts        # Serviço de aluguéis
│   │   ├── mensagem.service.ts       # Serviço de mensagens
│   │   ├── avaliacao.service.ts      # Serviço de avaliações
│   │   └── storage.service.ts        # Armazenamento local
│   ├── theme/
│   │   └── index.ts                  # Tema e estilos
│   └── types/
│       └── index.ts                  # Tipos TypeScript
├── assets/                           # Recursos estáticos
├── App.tsx                           # Componente raiz
├── app.json                          # Configuração Expo
├── package.json                      # Dependências
├── tsconfig.json                     # Configuração TypeScript
├── README.md                         # Documentação principal
├── QUICKSTART.md                     # Guia rápido
├── ARCHITECTURE.md                   # Arquitetura detalhada
└── PROJECT_OVERVIEW.md               # Este arquivo
```

## 🔄 Fluxo de Trabalho

### 1. Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Executar em dispositivo/emulador
npm run android  # Android
npm run ios      # iOS (macOS apenas)
```

### 2. Teste em Dispositivo Físico

1. Instalar Expo Go no smartphone
2. Escanear QR Code
3. Testar funcionalidades

### 3. Build para Produção

```bash
# Configurar EAS
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

## 🔐 Segurança

- ✅ JWT para autenticação
- ✅ Tokens armazenados de forma segura
- ✅ HTTPS em produção
- ✅ Validação de entrada
- ✅ Timeout em requisições

## 📊 Métricas do Projeto

| Métrica | Valor |
|---------|-------|
| Telas | 10+ |
| Serviços | 6 |
| Tipos TypeScript | 20+ |
| Linhas de Código | ~2000 |
| Dependências | 15+ |

## 🎨 Design

### Cores Principais
- **Primary**: #6200ee (Roxo)
- **Secondary**: #03dac6 (Ciano)
- **Background**: #f5f5f5 (Cinza claro)
- **Surface**: #ffffff (Branco)

### Componentes UI
- Material Design (React Native Paper)
- Ícones: Material Icons
- Navegação: Bottom Tabs + Stack

## 📱 Compatibilidade

- **Android**: 5.0+ (API 21+)
- **iOS**: 13.0+
- **Expo SDK**: 51.0

## 🚀 Roadmap

### Fase 1 - MVP (Atual)
- [x] Estrutura base
- [x] Autenticação
- [x] CRUD de equipamentos
- [x] Sistema de aluguéis
- [x] Chat básico

### Fase 2 - Melhorias
- [ ] Notificações push
- [ ] Geolocalização
- [ ] Filtros avançados
- [ ] Modo offline
- [ ] Dark mode

### Fase 3 - Avançado
- [ ] Pagamentos integrados
- [ ] Chat em tempo real
- [ ] Análises e relatórios
- [ ] Gamificação
- [ ] Múltiplos idiomas

## 📚 Documentação

- **[README.md](README.md)** - Documentação completa
- **[QUICKSTART.md](QUICKSTART.md)** - Guia rápido de início
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitetura detalhada
- **[API_DOCUMENTATION.md](../API_DOCUMENTATION.md)** - Documentação da API

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📞 Suporte

- **Email**: contato@alugai.com
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/alugai/issues)
- **Documentação**: [Wiki](https://github.com/seu-usuario/alugai/wiki)

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Equipe

Desenvolvido com ❤️ para conectar vizinhos e promover economia compartilhada.

---

**Última atualização**: 2024
**Versão**: 1.0.0
**Status**: ✅ Pronto para desenvolvimento
