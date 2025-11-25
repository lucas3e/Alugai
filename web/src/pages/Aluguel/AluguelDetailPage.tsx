import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Divider,
  Card,
  CardMedia,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Payment from '@mui/icons-material/Payment';
import { aluguelService } from '../../services/aluguel.service';
import { Aluguel } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function AluguelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [aluguel, setAluguel] = useState<Aluguel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadAluguel();
  }, [id]);

  const loadAluguel = async () => {
    try {
      setLoading(true);
      const data = await aluguelService.getById(Number(id));
      setAluguel(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar aluguel');
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async () => {
    try {
      setActionLoading(true);
      await aluguelService.aprovar(Number(id));
      await loadAluguel();
      alert('Aluguel aprovado com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao aprovar aluguel');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecusar = async () => {
    try {
      setActionLoading(true);
      await aluguelService.recusar(Number(id));
      await loadAluguel();
      alert('Aluguel recusado');
    } catch (err: any) {
      alert(err.message || 'Erro ao recusar aluguel');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelar = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar este aluguel?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      await aluguelService.cancelar(Number(id));
      await loadAluguel();
      alert('Aluguel cancelado');
    } catch (err: any) {
      alert(err.message || 'Erro ao cancelar aluguel');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'warning';
      case 'Aprovado':
      case 'EmAndamento':
        return 'info';
      case 'Concluido':
        return 'success';
      case 'Recusado':
      case 'Cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !aluguel) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Voltar
        </Button>
        <Alert severity="error">{error || 'Aluguel não encontrado'}</Alert>
      </Box>
    );
  }

  const isProprietario = user?.id === aluguel.proprietarioId;
  const isLocatario = user?.id === aluguel.locatarioId;

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Voltar
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Detalhes do Aluguel
          </Typography>
          <Chip
            label={aluguel.status}
            color={getStatusColor(aluguel.status)}
            size="medium"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Informações do Equipamento */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Equipamento
            </Typography>
            {aluguel.imagemEquipamento && (
              <Card sx={{ mb: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={aluguel.imagemEquipamento}
                  alt={aluguel.equipamentoTitulo}
                />
              </Card>
            )}
            <Typography variant="body1" gutterBottom>
              <strong>Título:</strong> {aluguel.equipamentoTitulo}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/equipamento/${aluguel.equipamentoId}`)}
              sx={{ mt: 1 }}
            >
              Ver Equipamento
            </Button>
          </Grid>

          {/* Informações do Aluguel */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informações do Aluguel
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Data de Início:</strong> {formatDate(aluguel.dataInicio)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Data de Fim:</strong> {formatDate(aluguel.dataFim)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Valor Total:</strong> R$ {aluguel.valorTotal.toFixed(2)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Data da Solicitação:</strong> {formatDate(aluguel.dataSolicitacao)}
            </Typography>
          </Grid>

          {/* Informações das Partes */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Proprietário
            </Typography>
            <Typography variant="body1" gutterBottom>
              {aluguel.proprietarioNome}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Locatário
            </Typography>
            <Typography variant="body1" gutterBottom>
              {aluguel.locatarioNome}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Ações */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {isProprietario && aluguel.status === 'Pendente' && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={handleAprovar}
                disabled={actionLoading}
              >
                Aprovar Aluguel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleRecusar}
                disabled={actionLoading}
              >
                Recusar Aluguel
              </Button>
            </>
          )}

          {isLocatario && aluguel.status == "Aceito" && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Payment />}
              onClick={() => navigate(`/pagamento/${aluguel.id}`)}
              size="large"
            >
              Realizar Pagamento
            </Button>
          )}

          {(isLocatario || isProprietario) && 
           (aluguel.status === 'Pendente' || aluguel.status === 'Aceito') && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelar}
              disabled={actionLoading}
            >
              Cancelar Aluguel
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
