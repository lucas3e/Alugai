import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import Payment from '@mui/icons-material/Payment';
import { aluguelService } from '../../services/aluguel.service';
import { AlugueisResponse, Aluguel } from '../../types';
import { useNavigate } from 'react-router-dom';

export default function MeusAlugueisPage() {
  const navigate = useNavigate();

  const [alugueis, setAlugueis] = useState<Aluguel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tipo, setTipo] = useState<'locatario' | 'proprietario'>('locatario');



  const carregarAlugueis = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await aluguelService.getMeus(tipo);
      setAlugueis(response);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao carregar seus aluguéis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAlugueis();
  }, [tipo]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'warning';
      case 'Aceito':
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

  return (
    <Box sx={{ p: 2 }}>
      {/* Cabeçalho */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        Meus Aluguéis
      </Typography>

      <Tabs
        value={tipo}
        onChange={(e, newValue) => setTipo(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Como Locatário" value="locatario" />
        <Tab label="Como Proprietário" value="proprietario" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : alugueis.length === 0 ? (
        <Typography>Nenhum aluguel encontrado.</Typography>
      ) : (
        <Grid container spacing={2}>
          {alugueis.map((a: Aluguel) => (
            <Grid item xs={12} sm={6} md={4} key={a.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={a.imagemEquipamento || '/placeholder-image.png'}
                  alt={a.equipamentoTitulo}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {a.equipamentoTitulo}
                  </Typography>
                  <Chip
                    label={a.status}
                    color={getStatusColor(a.status)}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2">
                    <strong>Período:</strong>{' '}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Valor total:</strong> R$ {a.valorTotal.toFixed(2)}
                  </Typography>

                  {tipo === 'locatario' ? (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Proprietário:</strong> {a.proprietarioNome}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Locatário:</strong> {a.locatarioNome}
                    </Typography>
                  )}
                </CardContent>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/aluguel/${a.id}`)}
                  >
                    Detalhes
                  </Button>

                  {/* Botão de pagamento para locatário */}
                  {tipo === 'locatario' && a.status == "Aceito"  && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<Payment />}
                      onClick={() => navigate(`/pagamento/${a.id}`)}
                    >
                      Pagar
                    </Button>
                  )}

                  {/* Ações do proprietário */}
                  {tipo === 'proprietario' && a.status === 'Pendente' && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={async () => {
                          await aluguelService.aprovar(a.id);
                          carregarAlugueis();
                        }}
                      >
                        Aceitar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={async () => {
                          await aluguelService.recusar(a.id);
                          carregarAlugueis();
                        }}
                      >
                        Recusar
                      </Button>
                    </>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
