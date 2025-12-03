import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import { aluguelService } from '../../services/aluguel.service';
import { Aluguel } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function MensagensPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alugueis, setAlugueis] = useState<Aluguel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAlugueis();
  }, []);

  const loadAlugueis = async () => {
    try {
      setLoading(true);
      const data = await aluguelService.getMeus('locatario');
      const data2 = await aluguelService.getMeus('proprietario');

      // Combinar e remover duplicatas
      const combined = [...data, ...data2];
      const unique = combined.filter((aluguel, index, self) =>
        index === self.findIndex((a) => a.id === aluguel.id)
      );

      // Filtrar apenas aluguéis aceitos ou em andamento
      const filtered = unique.filter(
        (a) => a.status === 'Aceito' || a.status === 'EmAndamento' || a.status === 'Concluido'
      );

      setAlugueis(filtered);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

const getOtherUserName = (aluguel: Aluguel) => {
  if (!aluguel) return '?';

  if (user?.id === aluguel.locatarioId) {
    return aluguel.proprietarioNome || '?';
  }

  return aluguel.locatarioNome || '?';
};


  const getOtherUserPhoto = (aluguel: Aluguel) => {
    if (user?.id === aluguel.locatarioId) {
      return aluguel.proprietarioFoto;
    }
    return aluguel.locatarioFoto;
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mensagens
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {alugueis.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <MessageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Você ainda não possui conversas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            As conversas aparecem quando você tem aluguéis aceitos
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {alugueis.map((aluguel, index) => (
              <React.Fragment key={aluguel.id}>
                {index > 0 && <Divider />}
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => navigate(`/mensagens/${aluguel.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={getOtherUserPhoto(aluguel) || undefined}
                        alt={getOtherUserName(aluguel) || 'Usuário'}
                      >
                        {(getOtherUserName(aluguel) || '?').charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {getOtherUserName(aluguel)}
                          </Typography>
                          <Chip
                            label={aluguel.status}
                            size="small"
                            color={
                              aluguel.status === 'EmAndamento'
                                ? 'info'
                                : aluguel.status === 'Concluido'
                                  ? 'success'
                                  : 'default'
                            }
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {aluguel.equipamentoTitulo}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(aluguel.dataInicio)} - {formatDate(aluguel.dataFim)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
