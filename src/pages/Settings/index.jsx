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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Configuration</Typography>

      {status.error && <Alert severity="error" sx={{ mb: 2 }}>{status.error}</Alert>}
      {status.success && <Alert severity="success" sx={{ mb: 2 }}>{status.success}</Alert>}

      <Paper component="form" onSubmit={handleSave} sx={{ p: 3, mb: 3 }}>
        {/* Devise par défaut */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="currency-label">Devise par défaut</InputLabel>
          <Select
            labelId="currency-label"
            id="defaultCurrency"
            name="defaultCurrency"
            value={formData.defaultCurrency}
            onChange={handleFormChange}
            label="Devise par défaut"
          >
            {/* Tu peux remplacer par données dynamiques récupérées */}
            {['EUR', 'USD', 'XOF', 'GBP'].map(currency => (
              <MenuItem key={currency} value={currency}>
                {currency} {currency === 'EUR' ? '(€)' : currency === 'USD' ? '($)' : currency === 'XOF' ? '(CFA)' : '(£)'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Catégories */}
        <Typography variant="h6" gutterBottom>Catégories personnalisées</Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {categorySections.map(({ type, label, color, categories }) => (
            <Grid item xs={12} md={4} key={type}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" color={`${color}.main`} gutterBottom>{label}</Typography>
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
                  sx={{ mb: 1 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  color={color}
                  onClick={() => handleAdd(type)}
                  sx={{ mb: 2 }}
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
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Paramètres de salaire */}
        <Typography variant="h6" gutterBottom>Paramètres de salaire</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="salaryFrequency-label">Fréquence</InputLabel>
              <Select
                labelId="salaryFrequency-label"
                id="salaryFrequency"
                name="salaryFrequency"
                value={formData.salaryFrequency}
                onChange={handleFormChange}
                label="Fréquence"
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
        >
          {status.loading ? 'Enregistrement...' : 'Enregistrer la configuration'}
        </Button>
      </Paper>
    </Box>
  );
}
