import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { equipamentoService } from '../../services/equipamento.service';
import { aluguelService } from '../../services/aluguel.service';
import { Equipamento } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function EquipamentoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [solicitando, setSolicitando] = useState(false);

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

  const calcularValorTotal = () => {
    if (!dataInicio || !dataFim || !equipamento) return 0;
    
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    
    return dias > 0 ? dias * equipamento.precoPorDia : 0;
  };

  const handleSolicitarAluguel = async () => {
    if (!user) {
      alert('Você precisa estar logado para solicitar um aluguel');
      navigate('/login');
      return;
    }

    if (!dataInicio || !dataFim) {
      alert('Por favor, preencha as datas de início e fim');
      return;
    }

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    if (fim <= inicio) {
      alert('A data de fim deve ser posterior à data de início');
      return;
    }

    try {
      setSolicitando(true);
      // Converter datas para formato ISO completo
      const dataInicioISO = new Date(dataInicio + 'T00:00:00').toISOString();
      const dataFimISO = new Date(dataFim + 'T23:59:59').toISOString();
      
      await aluguelService.create({
        equipamentoId: Number(id),
        dataInicio: dataInicioISO,
        dataFim: dataFimISO,
      });
      
      alert('Solicitação de aluguel enviada com sucesso!');
      setOpenDialog(false);
      navigate('/meus-alugueis');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao solicitar aluguel');
    } finally {
      setSolicitando(false);
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

  const isProprietario = user?.id === equipamento.usuarioId;

  return (
    <Box>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Voltar
      </Button>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <img
              src={equipamento.imagem || '/placeholder.png'}
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
              Localização: {equipamento.cidadeProprietario}, {equipamento.ufProprietario}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Proprietário: {equipamento.nomeProprietario}
            </Typography>
            {!isProprietario && equipamento.disponivel && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => setOpenDialog(true)}
              >
                Solicitar Aluguel
              </Button>
            )}
            {isProprietario && (
              <Alert severity="info" sx={{ mt: 3 }}>
                Este é seu equipamento
              </Alert>
            )}
            {!equipamento.disponivel && (
              <Alert severity="warning" sx={{ mt: 3 }}>
                Equipamento indisponível no momento
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Dialog para solicitar aluguel */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Solicitar Aluguel</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Data de Início"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Data de Fim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: dataInicio || new Date().toISOString().split('T')[0] }}
              sx={{ mb: 2 }}
            />
            {dataInicio && dataFim && (
              <Alert severity="info">
                Valor Total: R$ {calcularValorTotal().toFixed(2)}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleSolicitarAluguel}
            variant="contained"
            disabled={solicitando || !dataInicio || !dataFim}
          >
            {solicitando ? 'Enviando...' : 'Confirmar Solicitação'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
