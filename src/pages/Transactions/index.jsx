import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  AttachMoney as MoneyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { expensesApi, revenuesApi, formatCurrency, formatDate } from '../../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all', // 'expense', 'revenue', 'all'
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    search: ''
  });
  const [error, setError] = useState(null);

  // Charger les transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        // Récupérer à la fois les dépenses et les revenus
        const [expenses, revenues] = await Promise.all([
          expensesApi.getExpenses({
            month: filters.month,
            year: filters.year
          }),
          revenuesApi.getRevenues({
            month: filters.month,
            year: filters.year
          })
        ]);

        // Combiner et formater les transactions
        const formattedExpenses = expenses.map(expense => ({
          ...expense,
          type: 'expense',
          amount: -Math.abs(expense.montant)
        }));

        const formattedRevenues = revenues.map(revenue => ({
          ...revenue,
          type: 'revenue',
          amount: Math.abs(revenue.montant)
        }));

        // Trier par date (du plus récent au plus ancien)
        const allTransactions = [...formattedExpenses, ...formattedRevenues]
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(allTransactions);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des transactions:', err);
        setError('Erreur lors du chargement des transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filters.month, filters.year]);

  // Filtrer les transactions selon les critères
  const filteredTransactions = transactions.filter(transaction => {
    // Filtre par type
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Filtre par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesDescription = transaction.description?.toLowerCase().includes(searchLower);
      const matchesCategory = transaction.categorie?.toLowerCase().includes(searchLower);
      const matchesAmount = transaction.amount.toString().includes(filters.search);
      
      if (!matchesDescription && !matchesCategory && !matchesAmount) {
        return false;
      }
    }
    
    return true;
  });

  // Gérer la suppression d'une transaction
  const handleDelete = async (id, type) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      if (type === 'expense') {
        await expensesApi.deleteExpense(id);
      } else {
        await revenuesApi.deleteRevenue(id);
      }
      
      // Mettre à jour la liste des transactions
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression de la transaction:', err);
      setError('Erreur lors de la suppression de la transaction');
    } finally {
      setLoading(false);
    }
  };

  // Gérer le changement de filtre
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/transactions/add-transaction"
          startIcon={<MoneyIcon />}
        >
          Nouvelle transaction
        </Button>
      </Box>

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                label="Type"
              >
                <MenuItem value="all">Toutes</MenuItem>
                <MenuItem value="expense">Dépenses</MenuItem>
                <MenuItem value="revenue">Revenus</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Mois</InputLabel>
              <Select
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
                label="Mois"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleString('fr-FR', { month: 'long' })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Année</InputLabel>
              <Select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                label="Année"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              label="Rechercher..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Liste des transactions */}
      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box p={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : filteredTransactions.length === 0 ? (
          <Box p={2} textAlign="center">
            <Typography variant="body1" color="textSecondary">
              Aucune transaction trouvée
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell align="right">Montant</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={`${transaction.type}-${transaction.id}`}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description || 'Sans description'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.categorie} 
                        size="small"
                        color={transaction.type === 'expense' ? 'error' : 'success'}
                      />
                    </TableCell>
                    <TableCell 
                      align="right" 
                      sx={{
                        color: transaction.type === 'expense' ? 'error.main' : 'success.main',
                        fontWeight: 'medium'
                      }}
                    >
                      {formatCurrency(Math.abs(transaction.amount))}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        component={Link}
                        to={`/${transaction.type}s/edit/${transaction.id}`}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(transaction.id, transaction.type)}
                        color="error"
                      >
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
};

export default Transactions;
