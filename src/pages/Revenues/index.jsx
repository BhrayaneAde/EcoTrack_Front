import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Grid, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { revenuesApi, categoriesApi, settingsApi } from '../../services/api';

export default function Revenues() {
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',    // on stocke l'id de catégorie
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [revenues, setRevenues] = useState([]);
  const [categories, setCategories] = useState([]); // liste d'objets {id, name}
  const [currency, setCurrency] = useState('XOF');
  const [status, setStatus] = useState({ 
    loading: false,
    success: null, 
    error: null 
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setStatus(prev => ({ ...prev, loading: true }));
      try {
        // Récupérer la config utilisateur (pour la devise)
        const configData = await settingsApi.getConfig();
        if (configData?.defaultCurrency) setCurrency(configData.defaultCurrency);

        // Récupérer les catégories de revenus
        const categoriesData = await categoriesApi.getCategories('revenues');
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: categoriesData[0].id })); // on met l'id
        }

        // Récupérer les revenus
        const revenuesData = await revenuesApi.getRevenues();
        setRevenues(revenuesData);

      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setStatus({ 
          loading: false, 
          success: false, 
          error: 'Erreur lors du chargement des données: ' + (err.message || 'Erreur inconnue')
        });
      } finally {
        setStatus(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.categoryId) {
      setStatus({ success: false, error: 'Veuillez remplir tous les champs obligatoires' });
      return;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true }));

      const revenueData = {
        montant: parseFloat(formData.amount),
        categorie_id: formData.categoryId,  // on envoie l'id de catégorie
        date: formData.date || new Date().toISOString().split('T')[0],
        description: formData.description || ''
      };

      const newRevenue = await revenuesApi.addRevenue(revenueData);

      setRevenues(prev => [newRevenue, ...prev]);

      setFormData({
        amount: '',
        categoryId: categories[0]?.id || '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });

      setStatus({
        loading: false,
        success: 'Revenu enregistré avec succès',
        error: null
      });

      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: null }));
      }, 3000);

    } catch (err) {
      console.error('Erreur lors de la sauvegarde du revenu:', err);
      setStatus({
        loading: false,
        success: false,
        error: err.message || 'Erreur lors de l\'enregistrement du revenu'
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce revenu ?')) {
      try {
        setStatus(prev => ({ ...prev, loading: true }));
        await revenuesApi.deleteRevenue(id);
        setRevenues(prev => prev.filter(revenue => revenue.id !== id));
        setStatus(prev => ({
          ...prev,
          loading: false,
          success: 'Revenu supprimé avec succès',
          error: null
        }));

        setTimeout(() => {
          setStatus(prev => ({ ...prev, success: null }));
        }, 3000);

      } catch (err) {
        console.error('Erreur lors de la suppression du revenu:', err);
        setStatus({
          loading: false,
          success: false,
          error: err.message || 'Erreur lors de la suppression du revenu'
        });
      }
    }
  };

  const handleEdit = (revenue) => {
    navigate(`/revenues/edit/${revenue.id}`, { state: { revenue } });
  };

  // Trouver le nom de catégorie depuis son id pour l'affichage dans le tableau
  const getCategoryNameById = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : 'Non défini';
  };

  return (
    <Box p={{ xs: 1, md: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 3, textAlign: 'left' }}>
        Revenus
      </Typography>

      {status.loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}
      {status.error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2, fontSize: 16 }}
          onClose={() => setStatus(prev => ({ ...prev, error: null }))}
        >
          {status.error}
        </Alert>
      )}
      {status.success && (
        <Alert
          severity="success"
          sx={{ mb: 2, borderRadius: 2, fontSize: 16 }}
          onClose={() => setStatus(prev => ({ ...prev, success: null }))}
        >
          {status.success}
        </Alert>
      )}

      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{
        p: { xs: 2, md: 3 },
        mb: 4,
        borderRadius: 3,
        boxShadow: '0 2px 16px 0 rgba(25, 118, 210, 0.08)',
        bgcolor: 'background.paper',
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
          Ajouter un revenu
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              required
              label="Montant"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              inputProps={{ step: '0.01', min: '0' }}
              InputProps={{
                startAdornment: <span style={{ color: '#1976d2', fontWeight: 600 }}>{currency}</span>,
                sx: { borderRadius: 2, fontWeight: 600 }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth required sx={{ borderRadius: 2 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                label="Catégorie"
                sx={{ borderRadius: 2 }}
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ borderRadius: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Facultatif"
              sx={{ borderRadius: 2 }}
            />
          </Grid>

          <Grid item xs={12} sx={{ textAlign: { xs: 'center', md: 'right' }, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                px: 3,
                py: 1.2,
                fontSize: 16,
                boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.08)',
              }}
            >
              Ajouter le revenu
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        boxShadow: '0 2px 16px 0 rgba(25, 118, 210, 0.08)',
        bgcolor: 'background.paper',
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
          Historique des revenus
        </Typography>

        {revenues.length === 0 ? (
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
            Aucun revenu enregistré pour le moment
          </Typography>
        ) : (
          <TableContainer sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(60,72,100,0.07)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Catégorie</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Montant</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {revenues.map((revenue, idx) => (
                  <TableRow
                    key={revenue.id}
                    sx={{
                      bgcolor: idx % 2 === 0 ? 'background.default' : '#fff',
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: 'primary.50' },
                    }}
                  >
                    <TableCell>{new Date(revenue.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getCategoryNameById(revenue.categorie_id)}</TableCell>
                    <TableCell>{revenue.description || '-'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main', fontSize: 16 }}>
                      {typeof revenue.montant === 'number' ? revenue.montant.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: currency,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }) : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(revenue)}
                        color="primary"
                        sx={{ borderRadius: 2 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(revenue.id)}
                        color="error"
                        sx={{ borderRadius: 2 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
