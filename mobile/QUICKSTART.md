# 🚀 Guia Rápido - Alugai Mobile

## Instalação Rápida

```bash
# 1. Navegar para a pasta mobile
cd mobile

# 2. Instalar dependências
npm install

# 3. Iniciar o projeto
npm start
```

## Configuração da API

Edite `src/config/api.ts` e configure a URL da API:

```typescript
// Para emulador Android
BASE_URL: 'http://10.0.2.2:5000/api'

// Para emulador iOS
BASE_URL: 'http://localhost:5000/api'

// Para dispositivo físico (substitua pelo IP da sua máquina)
BASE_URL: 'http://192.168.1.100:5000/api'
```

## Descobrir seu IP

**Windows:**
```bash
ipconfig
```

**macOS/Linux:**
```bash
ifconfig
```

## Executar no Dispositivo

1. Instale o **Expo Go** no seu smartphone
2. Execute `npm start`
3. Escaneie o QR Code com:
   - **iOS**: Câmera nativa
   - **Android**: App Expo Go

## Executar no Emulador

**Android:**
```bash
npm run android
```

**iOS (apenas macOS):**
```bash
npm run ios
```

## Estrutura Básica

```
mobile/
├── src/
│   ├── screens/      # Telas do app
│   ├── services/     # Serviços de API
│   ├── contexts/     # Contextos React
│   ├── navigation/   # Navegação
│   └── types/        # Tipos TypeScript
├── App.tsx           # Componente raiz
└── package.json      # Dependências
```

## Credenciais de Teste

Após iniciar a API, você pode criar uma conta ou usar:

```
Email: teste@alugai.com
Senha: senha123
```

## Problemas Comuns

### Erro de conexão com API
- Verifique se a API está rodando
- Confirme o IP correto em `src/config/api.ts`
- Use `10.0.2.2` para Android ao invés de `localhost`

### App não carrega no Expo Go
- Certifique-se de estar na mesma rede Wi-Fi
- Tente: `npx expo start --tunnel`

### Limpar cache
```bash
npx expo start --clear
```

## Próximos Passos

1. ✅ Instalar e configurar
2. ✅ Executar o app
3. ✅ Criar uma conta
4. ✅ Explorar funcionalidades
5. ✅ Adicionar equipamentos
6. ✅ Testar aluguéis

## Documentação Completa

Veja [README.md](README.md) para documentação detalhada.

## Suporte

- 📧 Email: contato@alugai.com
- 🐛 Issues: [GitHub](https://github.com/seu-usuario/alugai/issues)
