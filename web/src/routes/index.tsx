import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Auth Pages
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';

// Main Pages
import HomePage from '../pages/Home/HomePage';
import EquipamentoDetailPage from '../pages/Equipamento/EquipamentoDetailPage';
import MeusEquipamentosPage from '../pages/Equipamento/MeusEquipamentosPage';
import AddEquipamentoPage from '../pages/Equipamento/AddEquipamentoPage';
import MeusAlugueisPage from '../pages/Aluguel/MeusAlugueisPage';
import AluguelDetailPage from '../pages/Aluguel/AluguelDetailPage';
import PerfilPage from '../pages/Perfil/PerfilPage';

// Layout
import MainLayout from '../components/Layout/MainLayout';

interface PrivateRouteProps {
  children: React.ReactElement;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

function Routes() {
  const { user } = useAuth();

  return (
    <RouterRoutes>
      {/* Rotas Públicas */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <RegisterPage />}
      />

      {/* Rotas Privadas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="equipamento/:id" element={<EquipamentoDetailPage />} />
        <Route path="meus-equipamentos" element={<MeusEquipamentosPage />} />
        <Route path="equipamento/novo" element={<AddEquipamentoPage />} />
        <Route path="equipamento/editar/:id" element={<AddEquipamentoPage />} />
        <Route path="meus-alugueis" element={<MeusAlugueisPage />} />
        <Route path="aluguel/:id" element={<AluguelDetailPage />} />
        <Route path="perfil" element={<PerfilPage />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </RouterRoutes>
  );
}

export default Routes;
