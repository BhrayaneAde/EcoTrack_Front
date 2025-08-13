import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Grid, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { savingsApi, categoriesApi, settingsApi } from '../../services/api';

export default function Savings() {
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [savings, setSavings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currency, setCurrency] = useState('XOF');
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  useEffect(() => {
    const fetchData = async () => {
      setStatus(prev => ({ ...prev, loading: true }));
      try {
        const configData = await settingsApi.getConfig();
        if (configData?.defaultCurrency) setCurrency(configData.defaultCurrency);

        const categoriesData = await categoriesApi.getCategories('savings');
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: categoriesData[0].id }));
        }

        const savingsData = await savingsApi.getSavings();
        setSavings(savingsData);
      } catch (err) {
        setStatus({ loading: false, success: false, error: 'Erreur: ' + err.message });
      } finally {
        setStatus(prev => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) {
      return setStatus({ success: false, error: 'Champs obligatoires manquants' });
    }

    try {
      setStatus({ ...status, loading: true });
      const data = {
        montant: parseFloat(formData.amount),
        categorie_id: formData.categoryId,
        date: formData.date,
        description: formData.description || ''
      };
      const newSaving = await savingsApi.addSaving(data);
      setSavings(prev => [newSaving, ...prev]);
      setFormData({ amount: '', categoryId: categories[0]?.id || '', date: new Date().toISOString().split('T')[0], description: '' });
      setStatus({ loading: false, success: 'Épargne enregistrée', error: null });
      setTimeout(() => setStatus(prev => ({ ...prev, success: null })), 3000);
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette épargne ?')) return;
    try {
      setStatus({ ...status, loading: true });
      await savingsApi.deleteSaving(id);
      setSavings(prev => prev.filter(s => s.id !== id));
      setStatus({ loading: false, success: 'Épargne supprimée', error: null });
      setTimeout(() => setStatus(prev => ({ ...prev, success: null })), 3000);
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  const getCategoryNameById = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : 'Non défini';
  };

  return (
    <Box p={{ xs: 1, md: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'secondary.main', mb: 3, textAlign: 'left' }}>
        Épargne
      </Typography>

      {status.loading && <Box display="flex" justifyContent="center" my={2}><CircularProgress /></Box>}
      {status.error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: 16 }} onClose={() => setStatus(prev => ({ ...prev, error: null }))}>{status.error}</Alert>}
      {status.success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2, fontSize: 16 }} onClose={() => setStatus(prev => ({ ...prev, success: null }))}>{status.success}</Alert>}

      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{
        p: { xs: 2, md: 3 },
        mb: 4,
        borderRadius: 3,
        boxShadow: '0 2px 16px 0 rgba(67, 160, 71, 0.08)',
        bgcolor: 'background.paper',
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'secondary.main', mb: 2 }}>
          Ajouter une épargne
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth required label="Montant" name="amount" type="number" value={formData.amount} onChange={handleChange} inputProps={{ step: '0.01', min: '0' }} InputProps={{ startAdornment: <span style={{ color: '#43a047', fontWeight: 600 }}>{currency}</span>, sx: { borderRadius: 2, fontWeight: 600 } }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth required sx={{ borderRadius: 2 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select name="categoryId" value={formData.categoryId} onChange={handleChange} label="Catégorie" sx={{ borderRadius: 2 }}>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth label="Date" name="date" type="date" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Facultatif" sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: { xs: 'center', md: 'right' }, mt: 2 }}>
            <Button type="submit" variant="contained" color="secondary" startIcon={<AddIcon />}
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                px: 3,
                py: 1.2,
                fontSize: 16,
                boxShadow: '0 2px 8px 0 rgba(67, 160, 71, 0.08)',
              }}
            >Ajouter</Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        boxShadow: '0 2px 16px 0 rgba(67, 160, 71, 0.08)',
        bgcolor: 'background.paper',
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'secondary.main', mb: 2 }}>
          Historique des épargnes
        </Typography>
        {savings.length === 0 ? (
          <Typography align="center" sx={{ py: 4 }}>Aucune épargne enregistrée</Typography>
        ) : (
          <TableContainer sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(60,72,100,0.07)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 700, color: 'secondary.main', fontSize: 16 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'secondary.main', fontSize: 16 }}>Catégorie</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'secondary.main', fontSize: 16 }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'secondary.main', fontSize: 16 }}>Montant</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'secondary.main', fontSize: 16 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savings.map((s, idx) => (
                  <TableRow
                    key={s.id}
                    sx={{
                      bgcolor: idx % 2 === 0 ? 'background.default' : '#fff',
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: 'secondary.50' },
                    }}
                  >
                    <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getCategoryNameById(s.categorie_id)}</TableCell>
                    <TableCell>{s.description || '-'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'secondary.main', fontSize: 16 }}>{s.montant.toLocaleString('fr-FR', { style: 'currency', currency, minimumFractionDigits: 0 })}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => handleDelete(s.id)} sx={{ borderRadius: 2 }}>
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
