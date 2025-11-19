import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  MenuItem,
} from '@mui/material';
import { equipamentoService } from '../../services/equipamento.service';
import { CATEGORIAS_EQUIPAMENTOS } from '../../types';

export default function AddEquipamentoPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    precoPorDia: '',
    cidade: '',
    uf: '',
    endereco: '',
  });
  const [imagens, setImagens] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagens(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await equipamentoService.create({
        ...formData,
        precoPorDia: parseFloat(formData.precoPorDia),
        imagens,
      });

      setSuccess('Equipamento cadastrado com sucesso!');
      setFormData({
        titulo: '',
        descricao: '',
        categoria: '',
        precoPorDia: '',
        cidade: '',
        uf: '',
        endereco: '',
      });
      setImagens([]);

      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar equipamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Adicionar Equipamento
          </Typography>

          {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2, mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="titulo"
              label="Título"
              name="titulo"
              autoFocus
              value={formData.titulo}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="descricao"
              label="Descrição"
              name="descricao"
              multiline
              rows={4}
              value={formData.descricao}
              onChange={handleChange}
            />
            <TextField
              select
              margin="normal"
              required
              fullWidth
              id="categoria"
              label="Categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
            >
              {CATEGORIAS_EQUIPAMENTOS.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              id="precoPorDia"
              label="Preço por Dia (R$)"
              name="precoPorDia"
              type="number"
              inputProps={{ step: '0.01', min: 0 }}
              value={formData.precoPorDia}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="cidade"
              label="Cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="uf"
              label="UF"
              name="uf"
              inputProps={{ maxLength: 2 }}
              value={formData.uf}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="endereco"
              label="Endereço"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Upload de Imagens
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {imagens.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {imagens.length} arquivo(s) selecionado(s)
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Cadastrar Equipamento'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
