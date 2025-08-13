import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Divider,
  FormControl, InputLabel, Select, MenuItem, Chip, Grid, Alert
} from '@mui/material';

export default function Settings() {
  // États pour les catégories
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [revenueCategories, setRevenueCategories] = useState([]);
  const [creditCategories, setCreditCategories] = useState([]);

  // États pour la configuration (devise, salaire)
  const [formData, setFormData] = useState({
    defaultCurrency: 'XOF',
    salaryFrequency: 'Mensuel',
    salaryAmount: '',
    salaryDate: '',
    salaryLabel: ''
  });

  // Inputs temporaires pour ajouter catégories
  const [inputValues, setInputValues] = useState({
    expense: '',
    revenue: '',
    credit: ''
  });

  // États pour notifications / erreurs / succès / chargement
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null
  });

  // Simuler un chargement initial (exemple : récupérer les données depuis API)
  useEffect(() => {
    setStatus(prev => ({ ...prev, loading: true }));
    // Ici tu peux appeler ton API pour charger les données initiales, exemple mock :
    setTimeout(() => {
      setExpenseCategories(['Courses', 'Transport', 'Logement']);
      setRevenueCategories(['Salaire', 'Freelance']);
      setCreditCategories(['Crédit bancaire']);

      setFormData({
        defaultCurrency: 'XOF',
        salaryFrequency: 'Mensuel',
        salaryAmount: '500000',
        salaryDate: '2025-07-25',
        salaryLabel: 'Salaire principal'
      });

      setStatus(prev => ({ ...prev, loading: false }));
    }, 1000);
  }, []);

  // Ajouter une catégorie (expense, revenue, credit)
  const handleAdd = (type) => {
    const value = inputValues[type].trim();
    if (!value) return;

    if (type === 'expense' && !expenseCategories.includes(value)) {
      setExpenseCategories(prev => [...prev, value]);
    } else if (type === 'revenue' && !revenueCategories.includes(value)) {
      setRevenueCategories(prev => [...prev, value]);
    } else if (type === 'credit' && !creditCategories.includes(value)) {
      setCreditCategories(prev => [...prev, value]);
    }

    setInputValues(prev => ({ ...prev, [type]: '' }));
  };

  // Supprimer une catégorie
  const handleRemove = (type, idx) => {
    if (type === 'expense') {
      setExpenseCategories(prev => prev.filter((_, i) => i !== idx));
    } else if (type === 'revenue') {
      setRevenueCategories(prev => prev.filter((_, i) => i !== idx));
    } else if (type === 'credit') {
      setCreditCategories(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // Sauvegarder la configuration (mock)
  const handleSave = (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    // Simuler requête API
    setTimeout(() => {
      // Tu peux ici envoyer formData et catégories à ton backend
      setStatus({ loading: false, error: null, success: 'Configuration enregistrée avec succès' });

      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: null }));
      }, 3000);
    }, 1000);
  };

  // Gérer les changements dans les champs formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const categorySections = [
    { type: 'expense', label: 'Dépenses', color: 'primary', categories: expenseCategories },
    { type: 'revenue', label: 'Revenus', color: 'success', categories: revenueCategories },
    { type: 'credit', label: 'Crédits', color: 'warning', categories: creditCategories }
  ];

  return (
    <Box p={{ xs: 1, md: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>Configuration</Typography>

      {status.error && <Alert severity="error" sx={{ borderRadius: 2, fontSize: 16, mb: 2 }}>{status.error}</Alert>}
      {status.success && <Alert severity="success" sx={{ borderRadius: 2, fontSize: 16, mb: 2 }}>{status.success}</Alert>}

      <Paper component="form" onSubmit={handleSave} elevation={3} sx={{
        p: { xs: 2, md: 3 },
        mb: 4,
        borderRadius: 3,
        boxShadow: '0 2px 16px 0 rgba(25, 118, 210, 0.08)',
        bgcolor: 'background.paper',
      }}>
        {/* Devise par défaut */}
        <FormControl fullWidth sx={{ mb: 3, borderRadius: 2 }}>
          <InputLabel id="currency-label">Devise par défaut</InputLabel>
          <Select
            labelId="currency-label"
            id="defaultCurrency"
            name="defaultCurrency"
            value={formData.defaultCurrency}
            onChange={handleFormChange}
            label="Devise par défaut"
            sx={{ borderRadius: 2 }}
          >
            {['EUR', 'USD', 'XOF', 'GBP'].map(currency => (
              <MenuItem key={currency} value={currency}>
                {currency} {currency === 'EUR' ? '(€)' : currency === 'USD' ? '($)' : currency === 'XOF' ? '(CFA)' : '(£)'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Catégories */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>Catégories personnalisées</Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {categorySections.map(({ type, label, color, categories }) => (
            <Grid item xs={12} md={4} key={type}>
              <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.06)' }}>
                <Typography variant="subtitle1" color={`${color}.main`} gutterBottom sx={{ fontWeight: 600 }}>{label}</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ajouter une catégorie et appuyer sur Entrée"
                  value={inputValues[type]}
                  onChange={(e) => setInputValues(prev => ({ ...prev, [type]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAdd(type);
                    }
                  }}
                  sx={{ mb: 1, borderRadius: 2 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  color={color}
                  onClick={() => handleAdd(type)}
                  sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }}
                >
                  Ajouter
                </Button>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: '40px' }}>
                  {categories.map((cat, idx) => (
                    <Chip
                      key={idx}
                      label={cat}
                      onDelete={() => handleRemove(type, idx)}
                      color={color}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 600, fontSize: 15, borderRadius: 2 }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Paramètres de salaire */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>Paramètres de salaire</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ borderRadius: 2 }}>
              <InputLabel id="salaryFrequency-label">Fréquence</InputLabel>
              <Select
                labelId="salaryFrequency-label"
                id="salaryFrequency"
                name="salaryFrequency"
                value={formData.salaryFrequency}
                onChange={handleFormChange}
                label="Fréquence"
                sx={{ borderRadius: 2 }}
              >
                {['Mensuel', 'Quinzaine', 'Hebdomadaire'].map(freq => (
                  <MenuItem key={freq} value={freq}>{freq}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Montant"
              type="number"
              name="salaryAmount"
              value={formData.salaryAmount}
              onChange={handleFormChange}
              placeholder="Montant du salaire"
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Date de versement"
              type="date"
              name="salaryDate"
              value={formData.salaryDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Libellé du salaire"
              name="salaryLabel"
              value={formData.salaryLabel}
              onChange={handleFormChange}
              placeholder="Ex: Salaire principal"
              sx={{ borderRadius: 2 }}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={status.loading}
          sx={{ borderRadius: 3, fontWeight: 700, fontSize: 18, py: 1.5, boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.08)' }}
        >
          {status.loading ? 'Enregistrement...' : 'Enregistrer la configuration'}
        </Button>
      </Paper>
    </Box>
  );
}
