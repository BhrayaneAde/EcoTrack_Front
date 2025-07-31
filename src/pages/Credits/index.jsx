import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Grid, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { creditsApi, settingsApi, formatCurrency } from '../../services/api';

export default function Credits() {
  const [credits, setCredits] = useState([]);
  const [currency, setCurrency] = useState('XOF');
  const [statusMsg, setStatusMsg] = useState({ loading: false, error: null, success: null });

  const [formData, setFormData] = useState({
    amount: '',
    interestRate: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    monthlyPayment: '',
    description: '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setStatusMsg({ loading: true, error: null, success: null });
        const config = await settingsApi.getConfig();
        if (config.defaultCurrency) setCurrency(config.defaultCurrency);

        const loadedCredits = await creditsApi.getCredits();
        setCredits(loadedCredits);
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
    if (!formData.amount || !formData.interestRate || !formData.startDate || !formData.endDate || !formData.monthlyPayment) {
      setStatusMsg({ loading: false, error: 'Veuillez remplir tous les champs obligatoires', success: null });
      return;
    }
    try {
      setStatusMsg({ loading: true, error: null, success: null });
      const newCredit = await mockCreditsApi.addCredit({
        montant: parseFloat(formData.amount),
        tauxInteret: parseFloat(formData.interestRate),
        dateDebut: formData.startDate,
        dateFin: formData.endDate,
        mensualite: parseFloat(formData.monthlyPayment),
        description: formData.description,
      });
      setCredits(c => [newCredit, ...c]);
      setFormData({
        amount: '',
        interestRate: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        monthlyPayment: '',
        description: '',
      });
      setStatusMsg({ loading: false, success: 'Crédit ajouté', error: null });
      setTimeout(() => setStatusMsg(s => ({ ...s, success: null })), 3000);
    } catch (err) {
      setStatusMsg({ loading: false, error: err.message || 'Erreur ajout crédit', success: null });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce crédit ?')) return;
    try {
      setStatusMsg(s => ({ ...s, loading: true }));
      await mockCreditsApi.deleteCredit(id);
      setCredits(c => c.filter(credit => credit.id !== id));
      setStatusMsg({ loading: false, success: 'Crédit supprimé', error: null });
      setTimeout(() => setStatusMsg(s => ({ ...s, success: null })), 3000);
    } catch (err) {
      setStatusMsg({ loading: false, error: err.message || 'Erreur suppression', success: null });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Crédits</Typography>

      {statusMsg.loading && <CircularProgress />}
      {statusMsg.error && <Alert severity="error" onClose={() => setStatusMsg(s => ({ ...s, error: null }))}>{statusMsg.error}</Alert>}
      {statusMsg.success && <Alert severity="success" onClose={() => setStatusMsg(s => ({ ...s, success: null }))}>{statusMsg.success}</Alert>}

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Ajouter un crédit</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Taux d'intérêt (%)"
              name="interestRate"
              type="number"
              fullWidth
              required
              value={formData.interestRate}
              onChange={handleChange}
              inputProps={{ step: "0.01", min: "0" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Date début"
              name="startDate"
              type="date"
              fullWidth
              required
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Date fin"
              name="endDate"
              type="date"
              fullWidth
              required
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Mensualité"
              name="monthlyPayment"
              type="number"
              fullWidth
              required
              value={formData.monthlyPayment}
              onChange={handleChange}
              InputProps={{ startAdornment: currency + ' ' }}
              inputProps={{ step: "0.01", min: "0" }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
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
              Ajouter le crédit
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Historique des crédits</Typography>
        {credits.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 4 }} color="textSecondary">Aucun crédit enregistré.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Montant</TableCell>
                  <TableCell>Taux d'intérêt (%)</TableCell>
                  <TableCell>Date début</TableCell>
                  <TableCell>Date fin</TableCell>
                  <TableCell>Mensualité</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {credits.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{formatCurrency(c.montant)}</TableCell>
                    <TableCell>{c.tauxInteret}</TableCell>
                    <TableCell>{new Date(c.dateDebut).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(c.dateFin).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(c.mensualite)}</TableCell>
                    <TableCell>{c.description || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleDelete(c.id)} color="error">
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
