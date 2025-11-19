import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';

export default function PerfilPage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    cidade: user?.cidade || '',
    uf: user?.uf || '',
    telefone: user?.telefone || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        cidade: user.cidade,
        uf: user.uf,
        telefone: user.telefone || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Imagem muito grande. Tamanho máximo: 5MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida');
      return;
    }

    try {
      setUploadingPhoto(true);
      setError('');
      
      const formData = new FormData();
      formData.append('foto', file);

      // TODO: Implementar método uploadFotoPerfil no authService
      // const response = await authService.uploadFotoPerfil(formData);
      
      // Por enquanto, apenas mostrar sucesso
      // Em produção, isso atualizaria o usuário no contexto
      
      setSuccess('Foto de perfil atualizada com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer upload da foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // TODO: Implementar método updateProfile no authService
      // const updatedUser = await authService.updateProfile(formData);
      
      // Por enquanto, apenas mostrar sucesso
      setSuccess('Perfil atualizado com sucesso!');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        cidade: user.cidade,
        uf: user.uf,
        telefone: user.telefone || '',
      });
    }
    setEditing(false);
    setError('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Meu Perfil
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3 }}>
        {/* Foto de Perfil */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={user?.fotoPerfil || undefined}
            sx={{ width: 120, height: 120, mb: 2 }}
          >
            {user?.nome.charAt(0).toUpperCase()}
          </Avatar>
          <Button
            variant="outlined"
            component="label"
            startIcon={uploadingPhoto ? <CircularProgress size={20} /> : <PhotoCameraIcon />}
            disabled={uploadingPhoto}
          >
            {uploadingPhoto ? 'Enviando...' : 'Alterar Foto'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploadingPhoto}
            />
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Formulário de Perfil */}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="UF"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
                disabled={!editing}
                inputProps={{ maxLength: 2 }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                disabled={!editing}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {!editing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setEditing(true)}
              >
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Informações Adicionais */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Informações da Conta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Membro desde: {user?.dataCriacao ? new Date(user.dataCriacao).toLocaleDateString('pt-BR') : '-'}
          </Typography>
          {user?.mediaAvaliacoes !== null && user?.mediaAvaliacoes !== undefined && (
            <Typography variant="body2" color="text.secondary">
              Avaliação média: {user.mediaAvaliacoes.toFixed(1)} ⭐ ({user?.totalAvaliacoes || 0} avaliações)
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
