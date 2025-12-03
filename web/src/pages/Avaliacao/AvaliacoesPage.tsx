import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Rating,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import StarIcon from '@mui/icons-material/Star';
import { aluguelService } from '../../services/aluguel.service';
import { avaliacaoService } from '../../services/avaliacao.service';
import { Aluguel, CreateAvaliacaoRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function AvaliacoesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [alugueisConcluidos, setAlugueisConcluidos] = useState<Aluguel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAluguel, setSelectedAluguel] = useState<Aluguel | null>(null);
  const [nota, setNota] = useState<number>(5);
  const [comentario, setComentario] = useState('');
  const [tipoAvaliacao, setTipoAvaliacao] = useState<'Equipamento' | 'Usuario'>('Equipamento');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAlugueis();
  }, []);

  const loadAlugueis = async () => {
    try {
      setLoading(true);
      const locatario = await aluguelService.getMeus('locatario');
      const proprietario = await aluguelService.getMeus('proprietario');
      
      // Filtrar apenas concluídos sem avaliação
      const concluidos = [...locatario, ...proprietario].filter(
        (a) => a.status === 'Concluido'
      );
      
      setAlugueisConcluidos(concluidos);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar aluguéis');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (aluguel: Aluguel, tipo: 'Equipamento' | 'Usuario') => {
    setSelectedAluguel(aluguel);
    setTipoAvaliacao(tipo);
    setNota(5);
    setComentario('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAluguel(null);
  };

  const handleSubmitAvaliacao = async () => {
    if (!selectedAluguel) return;

    try {
      setSubmitting(true);
      
      const request: CreateAvaliacaoRequest = {
        aluguelId: selectedAluguel.id,
        nota,
        comentario: comentario.trim() || undefined,
        tipoAvaliacao,
      };

      await avaliacaoService.createAvaliacao(request);
      
      alert('Avaliação enviada com sucesso!');
      handleCloseDialog();
      loadAlugueis();
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar avaliação');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isLocatario = (aluguel: Aluguel) => {
    return user?.id === aluguel.locatarioId;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Avaliações
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Avalie os aluguéis concluídos para ajudar outros usuários
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {alugueisConcluidos.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <StarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Você não possui aluguéis concluídos para avaliar
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {alugueisConcluidos.map((aluguel) => (
            <Grid item xs={12} key={aluguel.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {aluguel.equipamentoTitulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(aluguel.dataInicio)} - {formatDate(aluguel.dataFim)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {isLocatario(aluguel)
                          ? `Proprietário: ${aluguel.proprietarioNome}`
                          : `Locatário: ${aluguel.locatarioNome}`}
                      </Typography>
                    </Box>
                    <Chip label="Concluído" color="success" size="small" />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {isLocatario(aluguel) && (
                      <Button
                        variant="contained"
                        startIcon={<StarIcon />}
                        onClick={() => handleOpenDialog(aluguel, 'Equipamento')}
                      >
                        Avaliar Equipamento
                      </Button>
                    )}
                    
                    {!isLocatario(aluguel) && (
                      <Button
                        variant="contained"
                        startIcon={<StarIcon />}
                        onClick={() => handleOpenDialog(aluguel, 'Usuario')}
                      >
                        Avaliar Locatário
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/aluguel/${aluguel.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Avaliação */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {tipoAvaliacao === 'Equipamento' ? 'Avaliar Equipamento' : 'Avaliar Locatário'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedAluguel && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {tipoAvaliacao === 'Equipamento'
                  ? selectedAluguel.equipamentoTitulo
                  : selectedAluguel.locatarioNome}
              </Typography>
            )}

            <Typography component="legend" gutterBottom>
              Nota
            </Typography>
            <Rating
              value={nota}
              onChange={(_, newValue) => setNota(newValue || 5)}
              size="large"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Comentário (opcional)"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Compartilhe sua experiência..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitAvaliacao}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
