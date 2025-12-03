import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { mensagemService } from '../../services/mensagem.service';
import { aluguelService } from '../../services/aluguel.service';
import { Mensagem, Aluguel } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function ConversaPage() {
  const { aluguelId } = useParams<{ aluguelId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [aluguel, setAluguel] = useState<Aluguel | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (aluguelId) {
      loadData();
    }
  }, [aluguelId]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [aluguelData, mensagensData] = await Promise.all([
        aluguelService.getById(Number(aluguelId)),
        mensagemService.getMensagensByAluguel(Number(aluguelId)),
      ]);
      setAluguel(aluguelData);
      setMensagens(mensagensData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar conversa');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnviar = async () => {
    if (!novaMensagem.trim() || !aluguelId) return;

    try {
      setSending(true);
      const mensagem = await mensagemService.enviarMensagem(
        Number(aluguelId),
        novaMensagem.trim()
      );
      setMensagens([...mensagens, mensagem]);
      setNovaMensagem('');
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOtherUserName = () => {
    if (!aluguel) return '';
    const name = user?.id === aluguel.locatarioId
      ? aluguel.proprietarioNome
      : aluguel.locatarioNome;
    return name || '';
  };

  const getOtherUserPhoto = () => {
    if (!aluguel) return null;
    return user?.id === aluguel.locatarioId
      ? aluguel.proprietarioFoto
      : aluguel.locatarioFoto;
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
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/mensagens')} sx={{ mb: 2 }}>
          Voltar
        </Button>
        <Alert severity="error">{error || 'Conversa não encontrada'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/mensagens')} sx={{ mb: 2 }}>
          Voltar
        </Button>
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={getOtherUserPhoto() || undefined} alt={getOtherUserName()}>
            {getOtherUserName() ? getOtherUserName().charAt(0).toUpperCase() : '?'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{getOtherUserName()}</Typography>
            <Typography variant="body2" color="text.secondary">
              {aluguel.equipamentoTitulo}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/aluguel/${aluguel.id}`)}
          >
            Ver Aluguel
          </Button>
        </Paper>
      </Box>

      {/* Messages */}
      <Paper
        sx={{
          flex: 1,
          p: 2,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {mensagens.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Nenhuma mensagem ainda. Inicie a conversa!
            </Typography>
          </Box>
        ) : (
          mensagens.map((mensagem) => {
            const isMyMessage = mensagem.remetenteId === user?.id;
            return (
              <Box
                key={mensagem.id}
                sx={{
                  display: 'flex',
                  justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    bgcolor: isMyMessage ? 'primary.main' : 'grey.100',
                    color: isMyMessage ? 'white' : 'text.primary',
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {mensagem.conteudo}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      opacity: 0.8,
                      textAlign: 'right',
                    }}
                  >
                    {formatTime(mensagem.dataEnvio)}
                  </Typography>
                </Paper>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Digite sua mensagem..."
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={sending}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleEnviar}
          disabled={!novaMensagem.trim() || sending}
          sx={{ minWidth: 100 }}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  );
}
