import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { equipamentoService } from '../../services/equipamento.service';
import { Equipamento } from '../../types';

export default function EquipamentoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEquipamento();
  }, [id]);

  const loadEquipamento = async () => {
    try {
      setLoading(true);
      const data = await equipamentoService.getById(Number(id));
      setEquipamento(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar equipamento');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !equipamento) {
    return <Alert severity="error">{error || 'Equipamento não encontrado'}</Alert>;
  }

  return (
    <Box>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Voltar
      </Button>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <img
              src={equipamento.imagens[0] || '/placeholder.png'}
              alt={equipamento.titulo}
              style={{ width: '100%', borderRadius: 8 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {equipamento.titulo}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              R$ {equipamento.precoPorDia.toFixed(2)}/dia
            </Typography>
            <Typography variant="body1" paragraph>
              {equipamento.descricao}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Categoria: {equipamento.categoria}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Localização: {equipamento.proprietarioCidade}, {equipamento.proprietarioUf}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Proprietário: {equipamento.proprietarioNome}
            </Typography>
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => alert('Funcionalidade de solicitar aluguel em desenvolvimento')}
            >
              Solicitar Aluguel
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
