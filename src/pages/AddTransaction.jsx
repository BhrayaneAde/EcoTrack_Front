import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const categoriesByType = {
  Revenu: ['Salaire', 'Investissements', 'Autres revenus'],
  Dépense: ['Alimentation', 'Transport', 'Logement', 'Divertissement'],
  Crédit: ['Prêt bancaire', 'Carte de crédit', 'Autres crédits'],
};

const AddTransaction = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    label: '',
    amount: '',
    type: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (!form.type) {
      setCategories([]);
      setForm(prev => ({ ...prev, category: '' }));
      return;
    }

    // Simuler un chargement (optionnel)
    setLoadingCategories(true);
    setTimeout(() => {
      setCategories(categoriesByType[form.type] || []);
      setForm(prev => ({ ...prev, category: '' }));
      setLoadingCategories(false);
    }, 300); // délai simulé 300ms
  }, [form.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.label || !form.amount || !form.type || !form.category) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      // Ici tu ferais ton appel API réel, par ex:
      // await axios.post('/api/transactions', form);
      console.log('Transaction ajoutée (mock):', form);
      alert('Transaction ajoutée avec succès');
      navigate('/transactions');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout de la transaction');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Ajouter une transaction</Typography>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Libellé"
            name="label"
            value={form.label}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Montant"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={form.type}
              onChange={handleChange}
              label="Type"
            >
              <MenuItem value="Revenu">Revenu</MenuItem>
              <MenuItem value="Dépense">Dépense</MenuItem>
              <MenuItem value="Crédit">Crédit</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            required
            disabled={!form.type || loadingCategories}
          >
            <InputLabel>Catégorie</InputLabel>
            <Select
              name="category"
              value={form.category}
              onChange={handleChange}
              label="Catégorie"
            >
              {loadingCategories && <MenuItem disabled>Chargement...</MenuItem>}
              {!loadingCategories && categories.length === 0 && (
                <MenuItem disabled>Aucune catégorie disponible</MenuItem>
              )}
              {!loadingCategories &&
                categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => navigate('/transactions')}>
              Annuler
            </Button>
            <Button variant="contained" type="submit" color="primary">
              Enregistrer
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddTransaction;
