import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';

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

const Transactions = () => {
  const [transactions] = useState(mockTransactions);
  const groupedTransactions = groupByCategory(transactions);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography>Catégories : Revenus, Dépenses, Crédits</Typography>
      </Paper>

      {Object.keys(groupedTransactions).map((category, index) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mt: index > 0 ? 4 : 0 }}>
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
                      {txn.amount < 0 ? '-' : '+'}{Math.abs(txn.amount)} FCFA
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

export default Transactions;
