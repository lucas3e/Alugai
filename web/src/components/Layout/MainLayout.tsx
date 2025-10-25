import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { useAuth } from '../../contexts/AuthContext';

export default function MainLayout() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
    navigate('/login');
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 0, cursor: 'pointer', mr: 4 }}
            onClick={() => navigate('/')}
          >
            Alugai
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
            >
              Início
            </Button>
            <Button
              color="inherit"
              startIcon={<BuildIcon />}
              onClick={() => navigate('/meus-equipamentos')}
            >
              Meus Equipamentos
            </Button>
            <Button
              color="inherit"
              startIcon={<AssignmentIcon />}
              onClick={() => navigate('/meus-alugueis')}
            >
              Meus Aluguéis
            </Button>
          </Box>

          <Box>
            <IconButton
              size="large"
              aria-label="conta do usuário"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">{user?.nome}</Typography>
              </MenuItem>
              <MenuItem onClick={() => { navigate('/perfil'); handleClose(); }}>
                Meu Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 Alugai - Aluguel de Equipamentos entre Vizinhos
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
