import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Décommenter quand tu as un backend

const mockTransactions = [
  { id: 1, label: 'Salaire', amount: 50000, type: 'Revenu', date: '2025-07-01' },
  { id: 2, label: 'Courses', amount: -15000, type: 'Dépense', date: '2025-07-02' },
  { id: 3, label: 'Crédit Orange', amount: -5000, type: 'Crédit', date: '2025-07-05' },
  { id: 4, label: 'Freelance', amount: 40000, type: 'Revenu', date: '2025-07-03' },
  { id: 5, label: 'Transport', amount: -2000, type: 'Dépense', date: '2025-07-04' },
];

const groupByCategory = (transactions) => {
  return transactions.reduce((acc, txn) => {
    if (!acc[txn.type]) acc[txn.type] = [];
    acc[txn.type].push(txn);
    return acc;
  }, {});
};

const sumAmount = (transactions, type) => {
  return transactions
    .filter(txn => txn.type === type)
    .reduce((sum, txn) => sum + txn.amount, 0);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions] = useState(mockTransactions);
  const [currency, setCurrency] = useState('FCFA'); // Valeur par défaut

  useEffect(() => {
    // Exemple futur de récupération depuis le backend
    // axios.get('/api/user/currency').then(response => {
    //   setCurrency(response.data.currency);
    // });

    // Pour l’instant, on laisse FCFA en local
    setCurrency('FCFA');
  }, []);

  const groupedTransactions = groupByCategory(transactions);
  const totalRevenus = sumAmount(transactions, 'Revenu');
  const totalDepenses = sumAmount(transactions, 'Dépense');
  const totalCredits = sumAmount(transactions, 'Crédit');
  const soldeNet = totalRevenus + totalDepenses + totalCredits;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord des Transactions
      </Typography>

      <Box mb={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={() => navigate('/transactions/add-transaction')}>
          Ajouter une transaction
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, bgcolor: '#e8f5e9' }}>
            <Typography variant="subtitle2">Revenus</Typography>
            <Typography variant="h6" color="success.main">+{totalRevenus} {currency}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, bgcolor: '#ffebee' }}>
            <Typography variant="subtitle2">Dépenses</Typography>
            <Typography variant="h6" color="error.main">{totalDepenses} {currency}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, bgcolor: '#fff3e0' }}>
            <Typography variant="subtitle2">Crédits</Typography>
            <Typography variant="h6" color="warning.main">{totalCredits} {currency}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Solde Net</Typography>
            <Typography variant="h6" color={soldeNet >= 0 ? 'success.main' : 'error.main'}>
              {soldeNet >= 0 ? '+' : ''}{soldeNet} {currency}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {Object.keys(groupedTransactions).map((category) => (
        <Box key={category} sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            {category}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Libellé</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedTransactions[category].map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{txn.label}</TableCell>
                    <TableCell sx={{ color: txn.amount < 0 ? 'error.main' : 'success.main' }}>
                      {txn.amount < 0 ? '-' : '+'}{Math.abs(txn.amount)} {currency}
                    </TableCell>
                    <TableCell>{txn.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
};

export default Dashboard;
