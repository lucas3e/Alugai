import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { pagamentoService } from '../../services/pagamento.service';
import { Transacao } from '../../types';

export default function TransacoesPage() {
  const navigate = useNavigate();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTransacoes();
  }, []);

  const loadTransacoes = async () => {
    try {
      setLoading(true);
      const data = await pagamentoService.getMinhasTransacoes();
      setTransacoes(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'warning';
      case 'Aprovado':
        return 'success';
      case 'Recusado':
      case 'Cancelado':
        return 'error';
      case 'Reembolsado':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
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
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Voltar
      </Button>

      <Typography variant="h4" gutterBottom>
        Minhas Transações
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {transacoes.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Você ainda não possui transações
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Aluguel</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transacoes.map((transacao) => (
                <TableRow key={transacao.id} hover>
                  <TableCell>#{transacao.id}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => navigate(`/aluguel/${transacao.aluguelId}`)}
                    >
                      Ver Aluguel #{transacao.aluguelId}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <strong>{formatCurrency(transacao.valorPago)}</strong>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transacao.status}
                      color={getStatusColor(transacao.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {transacao.metodoPagamento || 'Mercado Pago'}
                  </TableCell>
                  <TableCell>{formatDate(transacao.dataCriacao)}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/aluguel/${transacao.aluguelId}`)}
                    >
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
