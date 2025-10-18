import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Screens - Auth
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../screens/Auth/RegisterScreen';

// Screens - Main
import { HomeScreen } from '../screens/Home/HomeScreen';
import { EquipamentoDetailScreen } from '../screens/Equipamento/EquipamentoDetailScreen';
import { MeusEquipamentosScreen } from '../screens/Equipamento/MeusEquipamentosScreen';
import { AddEquipamentoScreen } from '../screens/Equipamento/AddEquipamentoScreen';
import { MeusAlugueisScreen } from '../screens/Aluguel/MeusAlugueisScreen';
import { AluguelDetailScreen } from '../screens/Aluguel/AluguelDetailScreen';
import { ChatScreen } from '../screens/Chat/ChatScreen';
import { PerfilScreen } from '../screens/Perfil/PerfilScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ title: 'Alugai' }}
      />
      <Stack.Screen 
        name="EquipamentoDetail" 
        component={EquipamentoDetailScreen}
        options={{ title: 'Detalhes' }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
}

function EquipamentosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MeusEquipamentosMain" 
        component={MeusEquipamentosScreen}
        options={{ title: 'Meus Equipamentos' }}
      />
      <Stack.Screen 
        name="AddEquipamento" 
        component={AddEquipamentoScreen}
        options={{ title: 'Adicionar Equipamento' }}
      />
      <Stack.Screen 
        name="EditEquipamento" 
        component={AddEquipamentoScreen}
        options={{ title: 'Editar Equipamento' }}
      />
    </Stack.Navigator>
  );
}

function AlugueisStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MeusAlugueisMain" 
        component={MeusAlugueisScreen}
        options={{ title: 'Meus Aluguéis' }}
      />
      <Stack.Screen 
        name="AluguelDetail" 
        component={AluguelDetailScreen}
        options={{ title: 'Detalhes do Aluguel' }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
}

function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PerfilMain" 
        component={PerfilScreen}
        options={{ title: 'Perfil' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6200ee',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="MeusEquipamentos" 
        component={EquipamentosStack}
        options={{ title: 'Equipamentos' }}
      />
      <Tab.Screen 
        name="MeusAlugueis" 
        component={AlugueisStack}
        options={{ title: 'Aluguéis' }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilStack}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

export function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
