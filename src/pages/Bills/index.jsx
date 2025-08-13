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
    <Box p={{ xs: 1, md: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>Factures</Typography>

      {statusMsg.loading && <Box display="flex" justifyContent="center" my={3}><CircularProgress /></Box>}
      {statusMsg.error && <Alert severity="error" sx={{ borderRadius: 2, fontSize: 16, mb: 2 }} onClose={() => setStatusMsg(s => ({ ...s, error: null }))}>{statusMsg.error}</Alert>}
      {statusMsg.success && <Alert severity="success" sx={{ borderRadius: 2, fontSize: 16, mb: 2 }} onClose={() => setStatusMsg(s => ({ ...s, success: null }))}>{statusMsg.success}</Alert>}

      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{
        p: { xs: 2, md: 3 },
        mb: 4,
        borderRadius: 3,
        boxShadow: '0 2px 16px 0 rgba(25, 118, 210, 0.08)',
        bgcolor: 'background.paper',
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>Ajouter une facture</Typography>
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
              InputProps={{
                startAdornment: <span style={{ color: '#1976d2', fontWeight: 600 }}>{currency}</span>,
                sx: { borderRadius: 2, fontWeight: 600 }
              }}
              inputProps={{ step: "0.01", min: "0" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth required sx={{ borderRadius: 2 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select name="categoryId" value={formData.categoryId} onChange={handleChange} label="Catégorie" sx={{ borderRadius: 2 }}>
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
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth required sx={{ borderRadius: 2 }}>
              <InputLabel>Statut</InputLabel>
              <Select name="status" value={formData.status} onChange={handleChange} label="Statut" sx={{ borderRadius: 2 }}>
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
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
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
              Ajouter la facture
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
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>Historique des factures</Typography>
        {bills.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 4, fontSize: 18 }} color="textSecondary">Aucune facture enregistrée.</Typography>
        ) : (
          <TableContainer sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(60,72,100,0.07)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Catégorie</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Statut</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Montant</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills.map((bill, idx) => (
                  <TableRow
                    key={bill.id}
                    sx={{
                      bgcolor: idx % 2 === 0 ? 'background.default' : '#fff',
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: 'primary.50' },
                    }}
                  >
                    <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                    <TableCell>{bill.categorie}</TableCell>
                    <TableCell>{bill.description || '-'}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {bill.statut === 'payée' ? (
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', color: 'success.main', fontWeight: 600 }}>
                            <span style={{ fontSize: 18, marginRight: 4 }}>✔</span> Payée
                          </Box>
                        ) : (
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', color: 'warning.main', fontWeight: 600 }}>
                            <span style={{ fontSize: 18, marginRight: 4 }}>⏳</span> En attente
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>{formatCurrency(bill.montant)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleDelete(bill.id)} color="error" sx={{ borderRadius: 2 }}>
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
