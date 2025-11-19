import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import Grid from '@mui/material/GridLegacy';

import { equipamentoService } from '../../services/equipamento.service';
import { Equipamento, CATEGORIAS_EQUIPAMENTOS } from '../../types';

export default function HomePage() {
  const navigate = useNavigate();
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    loadEquipamentos();
  }, []);

  const loadEquipamentos = async () => {
    try {
      setLoading(true);
      const response = await equipamentoService.list({ busca, categoria });
      setEquipamentos(response?.data ?? []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar equipamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadEquipamentos();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Equipamentos Disponíveis
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Buscar equipamentos"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <TextField
          select
          label="Categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todas</MenuItem>
          {CATEGORIAS_EQUIPAMENTOS.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          startIcon={<Search />}
          onClick={handleSearch}
        >
          Buscar
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {equipamentos.map((equipamento) => (
            <Grid item xs={12} sm={6} md={4} key={equipamento.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={equipamento.imagens[0] || '/placeholder.png'}
                  alt={equipamento.titulo}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {equipamento.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {equipamento.descricao}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    R$ {equipamento.precoPorDia.toFixed(2)}/dia
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {equipamento.cidadeProprietario}, {equipamento.ufProprietario}
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/equipamento/${equipamento.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && equipamentos.length === 0 && (
        <Typography variant="body1" align="center" sx={{ py: 4 }}>
          Nenhum equipamento encontrado
        </Typography>
      )}
    </Box>
  );
}
