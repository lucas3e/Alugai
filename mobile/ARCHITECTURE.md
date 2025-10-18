# 🏗️ Arquitetura do Alugai Mobile

## Visão Geral

O Alugai Mobile segue uma arquitetura baseada em componentes com separação clara de responsabilidades.

## Estrutura de Pastas

```
mobile/
├── src/
│   ├── config/           # Configurações globais
│   ├── contexts/         # Contextos React (Estado Global)
│   ├── navigation/       # Configuração de navegação
│   ├── screens/          # Telas do aplicativo
│   ├── services/         # Camada de serviços (API)
│   ├── theme/            # Tema e estilos globais
│   └── types/            # Definições de tipos TypeScript
├── assets/               # Recursos estáticos
└── App.tsx               # Ponto de entrada
```

## Camadas da Aplicação

### 1. Apresentação (Screens)

**Responsabilidade**: Interface do usuário e interação

```
screens/
├── Auth/                 # Autenticação
├── Home/                 # Tela inicial
├── Equipamento/          # Gestão de equipamentos
├── Aluguel/              # Gestão de aluguéis
├── Chat/                 # Mensagens
└── Perfil/               # Perfil do usuário
```

**Características**:
- Componentes React funcionais
- Hooks para estado local
- Styled com React Native Paper
- Navegação via React Navigation

### 2. Lógica de Negócio (Services)

**Responsabilidade**: Comunicação com API e lógica de negócio

```typescript
// Exemplo: equipamento.service.ts
class EquipamentoService {
  async list(filters?: EquipamentoFilters): Promise<EquipamentosResponse> {
    return await apiService.get<EquipamentosResponse>(
      API_CONFIG.ENDPOINTS.EQUIPAMENTOS,
      filters
    );
  }
}
```

**Serviços disponíveis**:
- `api.service.ts` - Cliente HTTP base
- `auth.service.ts` - Autenticação
- `equipamento.service.ts` - Equipamentos
- `aluguel.service.ts` - Aluguéis
- `mensagem.service.ts` - Mensagens
- `avaliacao.service.ts` - Avaliações
- `storage.service.ts` - Armazenamento local

### 3. Estado Global (Contexts)

**Responsabilidade**: Gerenciamento de estado compartilhado

```typescript
// AuthContext.tsx
interface AuthContextData {
  user: Usuario | null;
  loading: boolean;
  signIn: (data: LoginRequest) => Promise<void>;
  signUp: (data: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
}
```

**Contextos**:
- `AuthContext` - Estado de autenticação

### 4. Navegação

**Responsabilidade**: Fluxo de navegação entre telas

```typescript
// Estrutura de navegação
- AuthStack (não autenticado)
  - Login
  - Register

- MainTabs (autenticado)
  - HomeStack
    - Home
    - EquipamentoDetail
  - EquipamentosStack
    - MeusEquipamentos
    - AddEquipamento
  - AlugueisStack
    - MeusAlugueis
    - AluguelDetail
  - PerfilStack
    - Perfil
```

## Fluxo de Dados

```
┌─────────────┐
│   Screen    │ ← Apresenta dados ao usuário
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Context   │ ← Gerencia estado global
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Service   │ ← Lógica de negócio
└──────┬──────┘
       │
       ↓
┌─────────────┐
│     API     │ ← Backend
└─────────────┘
```

## Padrões de Código

### 1. Componentes Funcionais

```typescript
export function HomeScreen({ navigation }: any) {
  const [data, setData] = useState<Equipamento[]>([]);
  
  useEffect(() => {
    loadData();
  }, []);
  
  async function loadData() {
    // Lógica
  }
  
  return (
    <View>
      {/* UI */}
    </View>
  );
}
```

### 2. Serviços

```typescript
class MyService {
  async getData(): Promise<Data> {
    return await apiService.get<Data>('/endpoint');
  }
}

export const myService = new MyService();
```

### 3. Tipos TypeScript

```typescript
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  // ...
}
```

### 4. Estilos

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
});
```

## Gerenciamento de Estado

### Estado Local (useState)

Para dados específicos de uma tela:

```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState<Data[]>([]);
```

### Estado Global (Context)

Para dados compartilhados entre telas:

```typescript
const { user, signOut } = useAuth();
```

### Armazenamento Persistente (AsyncStorage)

Para dados que devem persistir:

```typescript
await storageService.setToken(token);
const token = await storageService.getToken();
```

## Autenticação

### Fluxo de Autenticação

1. Usuário faz login/registro
2. API retorna token JWT
3. Token é armazenado localmente
4. Token é incluído em todas as requisições
5. Ao expirar, usuário é redirecionado para login

### Interceptor de Requisições

```typescript
// Adiciona token automaticamente
this.api.interceptors.request.use(async (config) => {
  const token = await storageService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Tratamento de Erros

### Padrão de Tratamento

```typescript
try {
  const data = await service.getData();
  setData(data);
} catch (error: any) {
  Alert.alert('Erro', error.message || 'Erro desconhecido');
} finally {
  setLoading(false);
}
```

### Erros da API

```typescript
private handleError(error: AxiosError): Error {
  if (error.response) {
    // Erro da API
    const message = error.response.data?.message || 'Erro ao processar';
    return new Error(message);
  } else if (error.request) {
    // Erro de rede
    return new Error('Erro de conexão');
  }
  return new Error('Erro desconhecido');
}
```

## Performance

### Otimizações Implementadas

1. **Lazy Loading**: Componentes carregados sob demanda
2. **Memoização**: Uso de `useMemo` e `useCallback` quando necessário
3. **FlatList**: Para listas longas com virtualização
4. **Image Caching**: Imagens são cacheadas automaticamente
5. **Debounce**: Em campos de busca

### Exemplo de Otimização

```typescript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

const handleSearch = useCallback(
  debounce((query: string) => {
    performSearch(query);
  }, 500),
  []
);
```

## Testes

### Estrutura de Testes (Planejado)

```
__tests__/
├── services/
│   ├── auth.service.test.ts
│   └── equipamento.service.test.ts
├── screens/
│   ├── LoginScreen.test.tsx
│   └── HomeScreen.test.tsx
└── utils/
    └── helpers.test.ts
```

### Executar Testes

```bash
npm test
```

## Boas Práticas

### 1. Nomenclatura

- **Componentes**: PascalCase (`HomeScreen.tsx`)
- **Serviços**: camelCase (`auth.service.ts`)
- **Tipos**: PascalCase (`Usuario`, `Equipamento`)
- **Funções**: camelCase (`loadData`, `handleSubmit`)

### 2. Organização de Imports

```typescript
// 1. Bibliotecas externas
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

// 2. Componentes de bibliotecas
import { Button, Text } from 'react-native-paper';

// 3. Serviços e utilitários
import { authService } from '../../services/auth.service';

// 4. Tipos
import { Usuario } from '../../types';

// 5. Estilos
import { colors, spacing } from '../../theme';
```

### 3. Componentização

- Componentes pequenos e focados
- Reutilização de código
- Props bem definidas
- Separação de lógica e apresentação

### 4. TypeScript

- Sempre tipar props e estados
- Evitar `any` quando possível
- Usar interfaces para objetos complexos
- Aproveitar inferência de tipos

## Segurança

### Práticas Implementadas

1. **JWT Storage**: Tokens armazenados de forma segura
2. **HTTPS**: Comunicação criptografada em produção
3. **Validação**: Validação de entrada em formulários
4. **Sanitização**: Dados sanitizados antes de envio
5. **Timeout**: Requisições com timeout configurado

## Próximas Melhorias

- [ ] Implementar testes unitários
- [ ] Adicionar testes de integração
- [ ] Implementar CI/CD
- [ ] Adicionar analytics
- [ ] Implementar crash reporting
- [ ] Adicionar feature flags
- [ ] Implementar A/B testing

## Recursos Adicionais

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
