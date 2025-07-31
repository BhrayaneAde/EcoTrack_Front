import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Grid, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { billsApi, categoriesApi, settingsApi, formatCurrency } from '../../services/api';

export default function Bills() {
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    status: 'en attente'
  });
  const [bills, setBills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currency, setCurrency] = useState('XOF');
  const [statusMsg, setStatusMsg] = useState({ loading: false, error: null, success: null });

  useEffect(() => {
    async function fetchData() {
      try {
        setStatusMsg({ loading: true, error: null, success: null });
        // Charger la config utilisateur (devise)
        const config = await settingsApi.getConfig();
        if (config.defaultCurrency) setCurrency(config.defaultCurrency);

        // Charger les catégories de dépenses (factures sont généralement des dépenses)
        const cats = await categoriesApi.getCategories('expenses');
        setCategories(cats);
        if (cats.length > 0) setFormData(f => ({ ...f, categoryId: cats[0].id }));

        // Charger les factures
        const loadedBills = await billsApi.getBills();
        setBills(loadedBills);
      } catch (err) {
        setStatusMsg({ loading: false, error: err.message || 'Erreur chargement', success: null });
      } finally {
        setStatusMsg(s => ({ ...s, loading: false }));
      }
    }
    fetchData();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId || !formData.date) {
      setStatusMsg({ loading: false, error: 'Veuillez remplir tous les champs obligatoires', success: null });
      return;
    }
    try {
      setStatusMsg({ loading: true, error: null, success: null });
      const newBill = await billsApi.addBill({
        montant: parseFloat(formData.amount),
        categorie: categories.find(c => c.id === formData.categoryId)?.name || 'Non défini',
        date: formData.date,
        description: formData.description,
        statut: formData.status,
      });
      setBills(b => [newBill, ...b]);
      setFormData({
        amount: '',
        categoryId: categories[0]?.id || '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        status: 'en attente'
      });
      setStatusMsg({ loading: false, success: 'Facture ajoutée', error: null });
      setTimeout(() => setStatusMsg(s => ({ ...s, success: null })), 3000);
    } catch (err) {
      setStatusMsg({ loading: false, error: err.message || 'Erreur ajout facture', success: null });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette facture ?')) return;
    try {
      setStatusMsg(s => ({ ...s, loading: true }));
      await billsApi.deleteBill(id);
      setBills(b => b.filter(bill => bill.id !== id));
      setStatusMsg({ loading: false, success: 'Facture supprimée', error: null });
      setTimeout(() => setStatusMsg(s => ({ ...s, success: null })), 3000);
    } catch (err) {
      setStatusMsg({ loading: false, error: err.message || 'Erreur suppression', success: null });
    }
  };

  const getCategoryNameById = id => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : 'Non défini';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Factures</Typography>

      {statusMsg.loading && <CircularProgress />}
      {statusMsg.error && <Alert severity="error" onClose={() => setStatusMsg(s => ({ ...s, error: null }))}>{statusMsg.error}</Alert>}
      {statusMsg.success && <Alert severity="success" onClose={() => setStatusMsg(s => ({ ...s, success: null }))}>{statusMsg.success}</Alert>}

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Ajouter une facture</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Montant"
              name="amount"
              type="number"
              fullWidth
              required
              value={formData.amount}
              onChange={handleChange}
              InputProps={{ startAdornment: currency + ' ' }}
              inputProps={{ step: "0.01", min: "0" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth required>
              <InputLabel>Catégorie</InputLabel>
              <Select name="categoryId" value={formData.categoryId} onChange={handleChange} label="Catégorie">
                {categories.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Date"
              name="date"
              type="date"
              fullWidth
              required
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth required>
              <InputLabel>Statut</InputLabel>
              <Select name="status" value={formData.status} onChange={handleChange} label="Statut">
                <MenuItem value="payée">Payée</MenuItem>
                <MenuItem value="en attente">En attente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              value={formData.description}
              onChange={handleChange}
              placeholder="Facultatif"
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button variant="contained" color="primary" type="submit" startIcon={<AddIcon />}>
              Ajouter la facture
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Historique des factures</Typography>
        {bills.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 4 }} color="textSecondary">Aucune facture enregistrée.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Montant</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills.map(bill => (
                  <TableRow key={bill.id}>
                    <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                    <TableCell>{bill.categorie}</TableCell>
                    <TableCell>{bill.description || '-'}</TableCell>
                    <TableCell>{bill.statut}</TableCell>
                    <TableCell align="right">{formatCurrency(bill.montant)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleDelete(bill.id)} color="error">
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
