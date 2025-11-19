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
  Stepper,
  Step,
  StepLabel,
  Card,
  CardMedia,
  IconButton,
  Chip,
  InputAdornment,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { equipamentoService } from '../../services/equipamento.service';
import { CATEGORIAS_EQUIPAMENTOS, ESTADOS_BRASILEIROS } from '../../types';

const steps = ['Informações Básicas', 'Localização', 'Imagens', 'Revisão'];

export default function AddEquipamentoPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImagens([...imagens, ...files]);

      // Criar previews
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagens(imagens.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
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
      setTimeout(() => navigate('/meus-equipamentos'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar equipamento');
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return formData.titulo && formData.descricao && formData.categoria && formData.precoPorDia;
      case 1:
        return formData.cidade && formData.uf;
      case 2:
        return imagens.length > 0;
      default:
        return true;
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Informações do Equipamento
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="titulo"
              label="Título do Equipamento"
              name="titulo"
              autoFocus
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: Furadeira Elétrica Profissional"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="descricao"
              label="Descrição Detalhada"
              name="descricao"
              multiline
              rows={4}
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva as características, estado de conservação e especificações técnicas..."
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  required
                  fullWidth
                  id="categoria"
                  label="Categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                >
                  {CATEGORIAS_EQUIPAMENTOS.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="precoPorDia"
                  label="Preço por Dia"
                  name="precoPorDia"
                  type="number"
                  inputProps={{ step: '0.01', min: 0 }}
                  value={formData.precoPorDia}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Localização
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  fullWidth
                  id="cidade"
                  label="Cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  placeholder="Ex: São Paulo"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  required
                  fullWidth
                  id="uf"
                  label="Estado"
                  name="uf"
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="endereco"
                  label="Endereço (Opcional)"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  placeholder="Rua, número, bairro..."
                  helperText="Você pode fornecer o endereço completo ou apenas o bairro"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Fotos do Equipamento
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Adicione fotos de qualidade para atrair mais locatários. Máximo 5MB por imagem.
            </Typography>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{
                py: 2,
                mb: 3,
                borderStyle: 'dashed',
                borderWidth: 2,
                '&:hover': {
                  borderStyle: 'dashed',
                  borderWidth: 2,
                },
              }}
            >
              Selecionar Imagens
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {imagePreviews.length > 0 && (
              <Grid container spacing={2}>
                {imagePreviews.map((preview, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Card sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={preview}
                        alt={`Preview ${index + 1}`}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                        }}
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {imagePreviews.length === 0 && (
              <Alert severity="info">
                Nenhuma imagem selecionada. Adicione pelo menos uma foto do equipamento.
              </Alert>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600, mb: 3 }}>
              Revisão Final
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                INFORMAÇÕES BÁSICAS
              </Typography>
              <Typography variant="h6" gutterBottom>{formData.titulo}</Typography>
              <Typography variant="body2" paragraph>{formData.descricao}</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={formData.categoria} color="primary" size="small" />
                <Chip label={`R$ ${parseFloat(formData.precoPorDia).toFixed(2)}/dia`} color="success" size="small" />
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                LOCALIZAÇÃO
              </Typography>
              <Typography variant="body1">
                {formData.cidade}, {formData.uf}
              </Typography>
              {formData.endereco && (
                <Typography variant="body2" color="text.secondary">
                  {formData.endereco}
                </Typography>
              )}
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                IMAGENS ({imagePreviews.length})
              </Typography>
              <Grid container spacing={1}>
                {imagePreviews.slice(0, 4).map((preview, index) => (
                  <Grid item xs={3} key={index}>
                    <CardMedia
                      component="img"
                      height="80"
                      image={preview}
                      alt={`Preview ${index + 1}`}
                      sx={{ borderRadius: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {success && (
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Cadastrar Novo Equipamento
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Preencha as informações abaixo para disponibilizar seu equipamento para aluguel
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            Voltar
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                disabled={!isStepValid(activeStep)}
              >
                Próximo
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? undefined : <CheckCircleIcon />}
              >
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
