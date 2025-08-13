import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Grid, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress, InputAdornment
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { expensesApi, categoriesApi, settingsApi } from '../../services/api';

export default function Expenses() {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [expenses, setExpenses] = useState([]);
  const [currency, setCurrency] = useState('XOF');
  const [categories, setCategories] = useState([]);
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
        const categoriesData = await categoriesApi.getCategories('expenses');
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setFormData(prev => ({ ...prev, category: categoriesData[0].name || categoriesData[0] }));
        }

        const expensesData = await expensesApi.getExpenses();
        setExpenses(expensesData);

        const settings = await settingsApi.getConfig();
        if (settings && settings.currency) setCurrency(settings.currency);

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

    if (!formData.amount || !formData.category) {
      setStatus({ success: false, error: 'Veuillez remplir tous les champs obligatoires' });
      return;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true }));

      const expenseData = {
        montant: parseFloat(formData.amount),
        categorie: formData.category,
        date: formData.date || new Date().toISOString().split('T')[0],
        description: formData.description || ''
      };

      const newExpense = await expensesApi.addExpense(expenseData);

      setExpenses(prev => [newExpense, ...prev]);

      setFormData({
        amount: '',
        category: categories[0]?.name || categories[0] || '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });

      setStatus({ loading: false, success: 'Dépense enregistrée avec succès', error: null });
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: null }));
      }, 3000);

    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la dépense:', err);
      setStatus({
        loading: false,
        success: false,
        error: err.message || 'Erreur lors de l\'enregistrement de la dépense'
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      try {
        setStatus(prev => ({ ...prev, loading: true }));
        await expensesApi.deleteExpense(id);
        setExpenses(prev => prev.filter(expense => expense.id !== id));
        setStatus({ loading: false, success: 'Dépense supprimée avec succès', error: null });
        setTimeout(() => {
          setStatus(prev => ({ ...prev, success: null }));
        }, 3000);
      } catch (err) {
        console.error('Erreur lors de la suppression de la dépense:', err);
        setStatus({ loading: false, success: false, error: err.message || 'Erreur lors de la suppression de la dépense' });
      }
    }
  };

  const handleEdit = (expense) => {
    navigate(`/expenses/edit/${expense.id}`, { state: { expense } });
  };

  return (
    <Box p={{ xs: 1, md: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'error.main', mb: 3, textAlign: 'left' }}>
        Dépenses
      </Typography>

      {status.loading && <Box display="flex" justifyContent="center" my={2}><CircularProgress /></Box>}
      {status.error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: 16 }} onClose={() => setStatus(prev => ({ ...prev, error: null }))}>{status.error}</Alert>}
      {status.success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2, fontSize: 16 }} onClose={() => setStatus(prev => ({ ...prev, success: null }))}>{status.success}</Alert>}

      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{
        p: { xs: 2, md: 3 },
        mb: 4,
        borderRadius: 3,
        boxShadow: '0 2px 16px 0 rgba(229, 57, 53, 0.08)',
        bgcolor: 'background.paper',
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'error.main', mb: 2 }}>
          Ajouter une dépense
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth required label="Montant" name="amount" type="number"
              value={formData.amount} onChange={handleChange}
              inputProps={{ step: '0.01', min: '0' }}
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ color: 'error.main', fontWeight: 600 }}>{currency}</InputAdornment>,
                sx: { borderRadius: 2, fontWeight: 600 }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth required sx={{ borderRadius: 2 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Catégorie"
                sx={{ borderRadius: 2 }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.name || cat} value={cat.name || cat}>{cat.name || cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth label="Date" name="date" type="date"
              value={formData.date} onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth label="Description" name="description"
              value={formData.description} onChange={handleChange}
              placeholder="Facultatif"
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: { xs: 'center', md: 'right' }, mt: 2 }}>
            <Button type="submit" variant="contained" color="error" startIcon={<AddIcon />}
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                px: 3,
                py: 1.2,
                fontSize: 16,
                boxShadow: '0 2px 8px 0 rgba(229, 57, 53, 0.08)',
              }}
            >Ajouter la dépense</Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        boxShadow: '0 2px 16px 0 rgba(229, 57, 53, 0.08)',
        bgcolor: 'background.paper',
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'error.main', mb: 2 }}>
          Historique des dépenses
        </Typography>
        {expenses.length === 0 ? (
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
            Aucune dépense enregistrée pour le moment
          </Typography>
        ) : (
          <TableContainer sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(60,72,100,0.07)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 700, color: 'error.main', fontSize: 16 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'error.main', fontSize: 16 }}>Catégorie</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'error.main', fontSize: 16 }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'error.main', fontSize: 16 }}>Montant</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'error.main', fontSize: 16 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((exp, idx) => (
                  <TableRow
                    key={exp.id}
                    sx={{
                      bgcolor: idx % 2 === 0 ? 'background.default' : '#fff',
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: 'error.50' },
                    }}
                  >
                    <TableCell>{exp.date ? new Date(exp.date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{exp.category || exp.categorie}</TableCell>
                    <TableCell>{exp.description || '-'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'error.main', fontSize: 16 }}>
                      {Number(exp.amount || exp.montant || 0).toLocaleString('fr-FR', {
                        style: 'currency', currency,
                        minimumFractionDigits: 0, maximumFractionDigits: 0
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(exp)} color="error" sx={{ borderRadius: 2 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(exp.id)} color="primary" sx={{ borderRadius: 2 }}>
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
