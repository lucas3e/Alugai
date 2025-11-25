import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Card,
  CardMedia,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ArrowBack from '@mui/icons-material/ArrowBack';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import CreditCard from '@mui/icons-material/CreditCard';
import Pix from '@mui/icons-material/Pix';
import AccountBalance from '@mui/icons-material/AccountBalance';
import { aluguelService } from '../../services/aluguel.service';
import { pagamentoService } from '../../services/pagamento.service';
import { Aluguel, Transacao } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const steps = ['Revisão do Aluguel', 'Método de Pagamento', 'Confirmação'];

export default function PagamentoPage() {
  const { aluguelId } = useParams<{ aluguelId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [aluguel, setAluguel] = useState<Aluguel | null>(null);
  const [transacao, setTransacao] = useState<Transacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processando, setProcessando] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  const [pagamentoConcluido, setPagamentoConcluido] = useState(false);

  useEffect(() => {
    loadData();
  }, [aluguelId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const aluguelData = await aluguelService.getById(Number(aluguelId));
      setAluguel(aluguelData);

      // Verificar se já existe transação
      const transacaoExistente = await pagamentoService.getTransacaoByAluguelId(Number(aluguelId));
      if (transacaoExistente) {
        setTransacao(transacaoExistente);
        if (transacaoExistente.status === 'Aceito') {
          setPagamentoConcluido(true);
          setActiveStep(2);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleIniciarPagamento = async () => {
    try {
      setProcessando(true);
      setError('');
      
      const novaTransacao = await pagamentoService.iniciarPagamento(Number(aluguelId));
      setTransacao(novaTransacao);
      setPagamentoConcluido(true);
      handleNext();
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento');
    } finally {
      setProcessando(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calcularDias = () => {
    if (!aluguel) return 0;
    const inicio = new Date(aluguel.dataInicio);
    const fim = new Date(aluguel.dataFim);
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !aluguel) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Voltar
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!aluguel) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Voltar
        </Button>
        <Alert severity="error">Aluguel não encontrado</Alert>
      </Box>
    );
  }

  // Verificar se o usuário é o locatário
  if (user?.id !== aluguel.locatarioId) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Voltar
        </Button>
        <Alert severity="error">Você não tem permissão para acessar esta página</Alert>
      </Box>
    );
  }

  // Verificar se o aluguel está aprovado
  if (aluguel.status !== 'Aceito' && !pagamentoConcluido) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Voltar
        </Button>
        <Alert severity="warning">
          Este aluguel precisa ser aprovado pelo proprietário antes do pagamento
        </Alert>
      </Box>
    );
  }

  const dias = calcularDias();

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Voltar
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Pagamento do Aluguel
        </Typography>

        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Step 1: Revisão do Aluguel */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resumo do Aluguel
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
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
                  {aluguel.equipamentoTitulo}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Detalhes do Período
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Data de Início:</strong> {formatDate(aluguel.dataInicio)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Data de Fim:</strong> {formatDate(aluguel.dataFim)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Total de Dias:</strong> {dias} {dias === 1 ? 'dia' : 'dias'}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" color="primary" gutterBottom>
                  <strong>Valor Total:</strong> R$ {aluguel.valorTotal.toFixed(2)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Proprietário
                </Typography>
                <Typography variant="body1">
                  {aluguel.proprietarioNome}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                size="large"
              >
                Continuar para Pagamento
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 2: Método de Pagamento */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Escolha o Método de Pagamento
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Método de Pagamento</FormLabel>
              <RadioGroup
                value={metodoPagamento}
                onChange={(e) => setMetodoPagamento(e.target.value)}
              >
                <Paper sx={{ p: 2, mb: 2, cursor: 'pointer' }} elevation={metodoPagamento === 'pix' ? 3 : 1}>
                  <FormControlLabel
                    value="pix"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Pix />
                        <Box>
                          <Typography variant="body1" fontWeight="bold">PIX</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Pagamento instantâneo
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Paper>

                <Paper sx={{ p: 2, mb: 2, cursor: 'pointer' }} elevation={metodoPagamento === 'cartao' ? 3 : 1}>
                  <FormControlLabel
                    value="cartao"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CreditCard />
                        <Box>
                          <Typography variant="body1" fontWeight="bold">Cartão de Crédito</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Parcelamento disponível
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Paper>

                <Paper sx={{ p: 2, cursor: 'pointer' }} elevation={metodoPagamento === 'boleto' ? 3 : 1}>
                  <FormControlLabel
                    value="boleto"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalance />
                        <Box>
                          <Typography variant="body1" fontWeight="bold">Boleto Bancário</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Vencimento em 3 dias úteis
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2" color="info.dark">
                <strong>Valor a pagar:</strong> R$ {aluguel.valorTotal.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>
                Voltar
              </Button>
              <Button
                variant="contained"
                onClick={handleIniciarPagamento}
                disabled={processando}
                size="large"
              >
                {processando ? <CircularProgress size={24} /> : 'Confirmar Pagamento'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 3: Confirmação */}
        {activeStep === 2 && pagamentoConcluido && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleOutline sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Pagamento Iniciado com Sucesso!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Seu pagamento está sendo processado. Você receberá uma confirmação em breve.
            </Typography>

            {transacao && (
              <Paper sx={{ p: 3, mt: 3, textAlign: 'left', maxWidth: 500, mx: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  Detalhes da Transação
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" gutterBottom>
                  <strong>ID da Transação:</strong> #{transacao.id}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Valor:</strong> R$ {transacao.valorPago.toFixed(2)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Status:</strong> {transacao.status}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Data:</strong> {formatDate(transacao.dataCriacao)}
                </Typography>
                {transacao.mercadoPagoId && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Referência: {transacao.mercadoPagoId}
                  </Typography>
                )}
              </Paper>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/aluguel/${aluguelId}`)}
              >
                Ver Detalhes do Aluguel
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/meus-alugueis')}
              >
                Meus Aluguéis
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
