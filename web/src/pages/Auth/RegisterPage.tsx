import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Paper,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { useAuth } from '../../contexts/AuthContext';
import { ESTADOS_BRASILEIROS } from '../../types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cidade: '',
    uf: '',
    telefone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const { confirmarSenha, ...registerData } = formData;
      await signUp(registerData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Alugai
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Criar Conta
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="nome"
              label="Nome Completo"
              value={formData.nome}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              name="telefone"
              label="Telefone (opcional)"
              value={formData.telefone}
              onChange={handleChange}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="cidade"
                  label="Cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  select
                  name="uf"
                  label="UF"
                  value={formData.uf}
                  onChange={handleChange}
                >
                  {ESTADOS_BRASILEIROS.map((estado) => (
                    <MenuItem key={estado.sigla} value={estado.sigla}>
                      {estado.sigla}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmarSenha"
              label="Confirmar Senha"
              type="password"
              value={formData.confirmarSenha}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Já tem uma conta? Entrar
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
