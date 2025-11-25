import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { equipamentoService } from '../../services/equipamento.service';
import { authService } from '../../services/auth.service';
import { Equipamento } from '../../types';

export default function MeusEquipamentosPage() {
  const navigate = useNavigate();

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    equipamento?: Equipamento;
  }>({ open: false });

  const carregarEquipamentos = async () => {
    try {
      setLoading(true);
      setError('');

      // const usuario = await authService.getProfile();
      const data = await equipamentoService.getMeus();
      setEquipamentos(data);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao carregar seus equipamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  const handleDelete = async () => {
    if (!confirmDelete.equipamento) return;
    try {
      await equipamentoService.delete(confirmDelete.equipamento.id);
      setConfirmDelete({ open: false });
      carregarEquipamentos();
    } catch (err) {
      console.error(err);
      setError('Erro ao excluir equipamento.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Cabeçalho */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Meus Equipamentos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/equipamento/novo')}
        >
          Adicionar Equipamento
        </Button>
      </Box>

      {/* Loading / Erro / Lista */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : equipamentos.length === 0 ? (
        <Typography>Nenhum equipamento cadastrado ainda.</Typography>
      ) : (
        <Grid container spacing={2}>
          {equipamentos.map((equip) => (
            <Grid item xs={12} sm={6} md={4} key={equip.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={equip.imagem || '/placeholder-image.png'}
                  alt={equip.titulo}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {equip.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {equip.descricao}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    R$ {equip.precoPorDia.toFixed(2)} / dia
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/equipamento/${equip.id}`)}
                  >
                    Ver
                  </Button>
                  <Button
                    size="small"
                    color="warning"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/equipamento/editar/${equip.id}`)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() =>
                      setConfirmDelete({ open: true, equipamento: equip })
                    }
                  >
                    Excluir
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal de confirmação de exclusão */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false })}
      >
        <DialogTitle>Excluir Equipamento</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir{' '}
            <strong>{confirmDelete.equipamento?.titulo}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false })}>
            Cancelar
          </Button>
          <Button color="error" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
