import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

export default function MeusEquipamentosPage() {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Meus Equipamentos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/equipamento/novo')}
        >
          Adicionar Equipamento
        </Button>
      </Box>
      <Typography>Lista de equipamentos em desenvolvimento...</Typography>
    </Box>
  );
}
