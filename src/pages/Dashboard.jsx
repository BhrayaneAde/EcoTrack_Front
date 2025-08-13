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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EventIcon from '@mui/icons-material/Event';
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
    <Box p={{ xs: 1, md: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 3, textAlign: 'left' }}>
        Tableau de bord des Transactions
      </Typography>

      <Box mb={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => navigate('/transactions/add-transaction')}
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            px: 3,
            py: 1.2,
            fontSize: 16,
            boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.08)',
          }}
        >
          Ajouter une transaction
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{
            p: 2.5,
            bgcolor: 'primary.main',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 3,
            boxShadow: '0 2px 16px 0 rgba(25, 118, 210, 0.10)',
          }}>
            <AttachMoneyIcon color="inherit" fontSize="large" />
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Revenus</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 22 }}>+{totalRevenus} {currency}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{
            p: 2.5,
            bgcolor: 'error.main',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 3,
            boxShadow: '0 2px 16px 0 rgba(229, 57, 53, 0.10)',
          }}>
            <MoneyOffIcon color="inherit" fontSize="large" />
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Dépenses</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 22 }}>{totalDepenses} {currency}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{
            p: 2.5,
            bgcolor: 'warning.main',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 3,
            boxShadow: '0 2px 16px 0 rgba(255, 167, 38, 0.10)',
          }}>
            <CreditCardIcon color="inherit" fontSize="large" />
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Crédits</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 22 }}>{totalCredits} {currency}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{
            p: 2.5,
            bgcolor: soldeNet >= 0 ? 'success.main' : 'error.main',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 3,
            boxShadow: '0 2px 16px 0 rgba(67, 160, 71, 0.10)',
          }}>
            <AccountBalanceWalletIcon color="inherit" fontSize="large" />
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Solde Net</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 22 }}>
                {soldeNet >= 0 ? '+' : ''}{soldeNet} {currency}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {Object.keys(groupedTransactions).map((category) => {
        let icon;
        if (category === 'Revenu') icon = <AttachMoneyIcon color="success" />;
        else if (category === 'Dépense') icon = <MoneyOffIcon color="error" />;
        else if (category === 'Crédit') icon = <CreditCardIcon color="warning" />;
        else icon = <AccountBalanceWalletIcon color="primary" />;

        return (
          <Box key={category} sx={{ mt: 5 }}>
            <Box display="flex" alignItems="center" gap={1}>
              {icon}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                {category}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(60,72,100,0.07)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Libellé</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Montant</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedTransactions[category].map((txn, idx) => (
                    <TableRow
                      key={txn.id}
                      sx={{
                        bgcolor: idx % 2 === 0 ? 'background.default' : '#fff',
                        transition: 'background 0.2s',
                        '&:hover': { bgcolor: 'primary.50' },
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <EventIcon fontSize="small" color="action" />
                          <span style={{ fontWeight: 500 }}>{txn.label}</span>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: txn.amount < 0 ? 'error.main' : 'success.main', fontWeight: 700, fontSize: 16 }}>
                        {txn.amount < 0 ? '-' : '+'}{Math.abs(txn.amount)} {currency}
                      </TableCell>
                      <TableCell>
                        <EventIcon fontSize="small" color="disabled" sx={{ mr: 0.5 }} />
                        <span style={{ fontWeight: 500 }}>{txn.date}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}
    </Box>
  );
};

export default Dashboard;
