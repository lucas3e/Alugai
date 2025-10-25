import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function PerfilPage() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Meu Perfil
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">{user?.nome}</Typography>
        <Typography variant="body1">{user?.email}</Typography>
        <Typography variant="body2">
          {user?.cidade}, {user?.uf}
        </Typography>
        {user?.telefone && (
          <Typography variant="body2">Telefone: {user.telefone}</Typography>
        )}
      </Paper>
    </Box>
  );
}
