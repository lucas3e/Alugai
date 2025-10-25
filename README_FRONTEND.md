# 🎨 Alugai - Frontends (Mobile & Web)

Este documento descreve os dois frontends disponíveis para o projeto Alugai.

## 📱 Aplicativo Mobile (React Native + Expo)

### Localização
```
mobile/
```

### Tecnologias
- React Native
- Expo
- TypeScript
- React Navigation
- React Native Paper

### Como Executar

```bash
cd mobile
npm install
npm start
```

Leia mais: [mobile/README.md](mobile/README.md)

---

## 🌐 Aplicação Web (React)

### Localização
```
web/
```

### Tecnologias
- React 18
- TypeScript
- Material-UI
- React Router
- Axios

### Como Executar

```bash
cd web
npm install
npm start
```

Leia mais: [web/README.md](web/README.md)

---

## 🚀 Início Rápido

### 1. Backend (API)

Primeiro, inicie a API backend:

```bash
# Na raiz do projeto
dotnet run
```

A API estará disponível em `http://localhost:5000`

### 2. Frontend Mobile

```bash
cd mobile
npm install
npm start
```

Escaneie o QR code com o app Expo Go no seu celular.

### 3. Frontend Web

```bash
cd web
npm install
npm start
```

Acesse `http://localhost:3000` no navegador.

---

## 📊 Comparação

| Característica | Mobile | Web |
|---------------|--------|-----|
| **Plataforma** | iOS, Android | Navegadores |
| **Framework** | React Native | React |
| **UI Library** | React Native Paper | Material-UI |
| **Navegação** | React Navigation | React Router |
| **Build** | Expo | Create React App |
| **Deploy** | App Stores | Vercel, Netlify |

---

## 🎯 Funcionalidades Implementadas

### ✅ Ambos (Mobile & Web)

- [x] Autenticação (Login/Registro)
- [x] Listagem de equipamentos
- [x] Busca e filtros
- [x] Detalhes do equipamento
- [x] Perfil do usuário
- [x] Gerenciamento de equipamentos
- [x] Gerenciamento de aluguéis

### 📱 Exclusivo Mobile

- [x] Notificações push (preparado)
- [x] Câmera integrada
- [x] Geolocalização (preparado)

### 🌐 Exclusivo Web

- [x] Interface desktop otimizada
- [x] Navegação por teclado
- [x] SEO otimizado

---

## 🛠️ Desenvolvimento

### Estrutura Comum

Ambos os frontends compartilham:
- Mesma API backend
- Mesmos tipos TypeScript (sincronizados)
- Mesma lógica de negócio
- Mesmos endpoints

### Diferenças

- **Mobile**: Otimizado para telas pequenas e touch
- **Web**: Otimizado para desktop e mouse/teclado

---

## 📦 Dependências Principais

### Mobile
```json
{
  "expo": "~51.0.0",
  "react-native": "0.74.0",
  "react-navigation": "^6.x",
  "react-native-paper": "^5.x"
}
```

### Web
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "@mui/material": "^5.14.20",
  "axios": "^1.6.2"
}
```

---

## 🚀 Deploy

### Mobile

**iOS:**
```bash
cd mobile
eas build --platform ios
```

**Android:**
```bash
cd mobile
eas build --platform android
```

### Web

**Vercel:**
```bash
cd web
vercel
```

**Netlify:**
```bash
cd web
npm run build
netlify deploy --prod --dir=build
```

---

## 📚 Documentação Completa

- [Mobile README](mobile/README.md)
- [Mobile Quickstart](mobile/QUICKSTART.md)
- [Web README](web/README.md)
- [Web Quickstart](web/QUICKSTART.md)
- [API Documentation](API_DOCUMENTATION.md)

