# 🚀 Instruções de Configuração - Alugai Mobile

## ✅ Checklist de Configuração

### 1. Pré-requisitos Instalados

- [ ] Node.js 18+ instalado
- [ ] npm ou Yarn instalado
- [ ] Git instalado
- [ ] Expo Go instalado no smartphone (para teste em dispositivo físico)

### 2. Instalação do Projeto

```bash
# Navegar para a pasta mobile
cd mobile

# Instalar dependências
npm install

# Aguardar conclusão (pode levar alguns minutos)
```

### 3. Configuração da API

**Editar arquivo**: `src/config/api.ts`

#### Opção A: Emulador Android
```typescript
BASE_URL: 'http://10.0.2.2:5000/api'
```

#### Opção B: Emulador iOS
```typescript
BASE_URL: 'http://localhost:5000/api'
```

#### Opção C: Dispositivo Físico
```typescript
// Substitua pelo IP da sua máquina
BASE_URL: 'http://192.168.1.100:5000/api'
```

**Como descobrir seu IP:**

Windows:
```bash
ipconfig
```

macOS/Linux:
```bash
ifconfig
```

### 4. Verificar Backend

Certifique-se de que a API backend está rodando:

```bash
# Na pasta raiz do projeto (não na pasta mobile)
cd ..
dotnet run
```

A API deve estar acessível em: `http://localhost:5000`

### 5. Iniciar o Aplicativo

```bash
# Na pasta mobile
npm start
```

Isso abrirá o Expo Dev Tools no navegador.

### 6. Executar no Dispositivo

#### Dispositivo Físico (Recomendado para iniciantes)

1. Instale o **Expo Go** no seu smartphone:
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Escaneie o QR Code:
   - **iOS**: Use o app Câmera nativo
   - **Android**: Use o app Expo Go

3. Aguarde o app carregar

#### Emulador Android

```bash
npm run android
```

**Requisitos:**
- Android Studio instalado
- Emulador Android configurado

#### Emulador iOS (apenas macOS)

```bash
npm run ios
```

**Requisitos:**
- Xcode instalado
- Simulador iOS configurado

## 🎯 Primeiro Uso

### 1. Criar uma Conta

1. Abra o aplicativo
2. Clique em "Não tem conta? Cadastre-se"
3. Preencha os dados:
   - Nome completo
   - Email
   - Telefone (opcional)
   - Cidade e Estado
   - Senha (mínimo 6 caracteres)
4. Clique em "Cadastrar"

### 2. Explorar o App

Após o login, você verá 4 abas principais:

- **Início**: Equipamentos disponíveis
- **Equipamentos**: Seus equipamentos
- **Aluguéis**: Seus aluguéis
- **Perfil**: Seu perfil

### 3. Adicionar um Equipamento

1. Vá para a aba "Equipamentos"
2. Clique no botão "+"
3. Preencha as informações
4. Adicione fotos (opcional)
5. Salve

### 4. Solicitar um Aluguel

1. Na aba "Início", encontre um equipamento
2. Clique no equipamento
3. Clique em "Solicitar Aluguel"
4. Selecione as datas
5. Confirme

## 🔧 Solução de Problemas

### Problema: "Unable to resolve module"

**Solução:**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### Problema: Erro de conexão com API

**Verificações:**
1. ✅ API está rodando?
2. ✅ URL correta em `src/config/api.ts`?
3. ✅ Firewall não está bloqueando?
4. ✅ Dispositivo e computador na mesma rede?

**Para Android Emulator:**
- Use `10.0.2.2` ao invés de `localhost`

**Para Dispositivo Físico:**
- Use o IP da sua máquina (ex: `192.168.1.100`)

### Problema: App não carrega no Expo Go

**Soluções:**
1. Certifique-se de estar na mesma rede Wi-Fi
2. Tente modo Tunnel:
   ```bash
   npx expo start --tunnel
   ```
3. Reinicie o Expo Go
4. Reinicie o servidor:
   ```bash
   npx expo start --clear
   ```

### Problema: Erros do TypeScript

**Solução:**
```bash
rm -rf .expo
npx expo start --clear
```

### Problema: Imagens não carregam

**Verificações:**
1. ✅ API está servindo imagens corretamente?
2. ✅ URL da API está correta?
3. ✅ Permissões de câmera/galeria concedidas?

## 📱 Testando Funcionalidades

### Checklist de Testes

- [ ] Login funciona
- [ ] Registro funciona
- [ ] Lista de equipamentos carrega
- [ ] Detalhes do equipamento abrem
- [ ] Busca funciona
- [ ] Navegação entre telas funciona
- [ ] Logout funciona

### Dados de Teste

Após criar sua conta, você pode:

1. **Adicionar equipamentos de teste**
2. **Solicitar aluguéis para si mesmo** (para testar o fluxo)
3. **Testar o chat**
4. **Adicionar avaliações**

## 🎨 Personalizando o App

### Alterar Cores

Edite `src/theme/index.ts`:

```typescript
export const colors = {
  primary: '#6200ee',      // Cor principal
  secondary: '#03dac6',    // Cor secundária
  // ...
};
```

### Alterar Nome do App

Edite `app.json`:

```json
{
  "expo": {
    "name": "Seu Nome Aqui",
    "slug": "seu-slug-aqui"
  }
}
```

### Adicionar Ícones

Coloque os arquivos na pasta `assets/`:
- `icon.png` (1024x1024px)
- `splash.png` (1284x2778px)

## 📚 Próximos Passos

1. ✅ **Explorar o código**
   - Veja `src/screens/` para as telas
   - Veja `src/services/` para a lógica de API

2. ✅ **Ler a documentação**
   - [README.md](README.md) - Documentação completa
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura
   - [QUICKSTART.md](QUICKSTART.md) - Guia rápido

3. ✅ **Desenvolver novas features**
   - Adicione novas telas
   - Implemente funcionalidades
   - Melhore o design

4. ✅ **Fazer build para produção**
   - Configure EAS Build
   - Gere APK/IPA
   - Publique nas lojas

## 🆘 Precisa de Ajuda?

### Recursos

- **Documentação React Native**: https://reactnative.dev/
- **Documentação Expo**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **TypeScript**: https://www.typescriptlang.org/

### Comunidade

- **Stack Overflow**: Tag `react-native`
- **Discord Expo**: https://chat.expo.dev/
- **GitHub Issues**: Reporte bugs

### Contato

- **Email**: contato@alugai.com
- **Issues**: [GitHub](https://github.com/seu-usuario/alugai/issues)

## ✨ Dicas Finais

1. **Sempre teste em dispositivo real** quando possível
2. **Use o modo Tunnel** se tiver problemas de rede
3. **Limpe o cache** se encontrar erros estranhos
4. **Leia os logs** no terminal para entender erros
5. **Consulte a documentação** quando em dúvida

## 🎉 Pronto!

Seu ambiente está configurado! Agora você pode:

- ✅ Desenvolver novas funcionalidades
- ✅ Testar o aplicativo
- ✅ Fazer melhorias
- ✅ Preparar para produção

**Boa sorte com o desenvolvimento! 🚀**

---

**Última atualização**: 2024
**Versão**: 1.0.0
