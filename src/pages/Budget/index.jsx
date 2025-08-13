import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { 
  expensesApi, 
  categoriesApi, 
  formatCurrency, 
  getCurrentMonth, 
  getCurrentYear 
} from '../../services/api';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: ''
  });

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger les catégories de dépenses
        const expenseCategories = await categoriesApi.getCategories('expenses');
        setCategories(expenseCategories);
        
        // Charger les dépenses du mois sélectionné
        const expensesData = await expensesApi.getExpenses({
          month: selectedMonth,
          year: selectedYear
        });
        
        setExpenses(expensesData);
        
        // Charger les budgets (dans une vraie application, cela viendrait d'une API)
        // Pour l'instant, nous simulons des budgets
        const mockBudgets = [
          { id: 1, category: 'Alimentation', amount: 150000, categoryId: 'nourriture' },
          { id: 2, category: 'Transport', amount: 50000, categoryId: 'transport' },
          { id: 3, category: 'Loisirs', amount: 50000, categoryId: 'loisirs' },
        ];
        
        setBudgets(mockBudgets);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données du budget');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedMonth, selectedYear]);

  // Calculer le total des dépenses par catégorie
  const calculateCategorySpending = (categoryId) => {
    return expenses
      .filter(expense => expense.categorieId === categoryId)
      .reduce((total, expense) => total + parseFloat(expense.montant || 0), 0);
  };

  // Calculer le pourcentage de budget utilisé
  const calculateBudgetPercentage = (categoryId, budgetAmount) => {
    const spent = calculateCategorySpending(categoryId);
    return Math.min(100, Math.round((spent / budgetAmount) * 100));
  };

  // Gérer l'ajout d'un nouveau budget
  const handleAddBudget = async () => {
    if (!newBudget.category || !newBudget.amount) return;
    
    try {
      setLoading(true);
      
      // Dans une vraie application, on appellerait une API pour créer le budget
      const category = categories.find(cat => cat.id === newBudget.category);
      
      if (category) {
        const newBudgetItem = {
          id: Date.now(),
          category: category.name,
          categoryId: category.id,
          amount: parseFloat(newBudget.amount)
        };
        
        setBudgets([...budgets, newBudgetItem]);
        setNewBudget({ category: '', amount: '' });
      }
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout du budget:', err);
      setError('Erreur lors de l\'ajout du budget');
    } finally {
      setLoading(false);
    }
  };

  // Gérer la suppression d'un budget
  const handleDeleteBudget = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
      setBudgets(budgets.filter(budget => budget.id !== id));
    }
  };

  // Calculer le total des budgets
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  
  // Calculer le total des dépenses
  const totalSpent = expenses.reduce((sum, expense) => sum + parseFloat(expense.montant || 0), 0);
  
  // Calculer le pourcentage du budget total utilisé
  const totalBudgetPercentage = totalBudget > 0 
    ? Math.min(100, Math.round((totalSpent / totalBudget) * 100))
    : 0;

  return (
    <Box p={{ xs: 1, md: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', textAlign: 'left' }}>Budget</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120, borderRadius: 2 }}>
            <InputLabel>Mois</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Mois"
              sx={{ borderRadius: 2 }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(2000, i, 1).toLocaleString('fr-FR', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120, borderRadius: 2 }}>
            <InputLabel>Année</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Année"
              sx={{ borderRadius: 2 }}
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
        </Box>
      </Box>

      {/* Résumé du budget */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 3, boxShadow: '0 2px 16px 0 rgba(25, 118, 210, 0.08)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>Budget total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(totalBudget)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 3, boxShadow: '0 2px 16px 0 rgba(229, 57, 53, 0.08)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>Dépenses totales</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: totalSpent > totalBudget ? 'error.main' : 'primary.main' }}>{formatCurrency(totalSpent)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 3, boxShadow: '0 2px 16px 0 rgba(67, 160, 71, 0.08)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>Budget restant</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: totalBudget - totalSpent < 0 ? 'error.main' : 'success.main' }}>{formatCurrency(totalBudget - totalSpent)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barre de progression du budget global */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography sx={{ fontWeight: 600 }}>Utilisation du budget global</Typography>
          <Typography sx={{ fontWeight: 600 }}>{totalBudgetPercentage}%</Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={totalBudgetPercentage} 
          color={totalBudgetPercentage > 90 ? 'error' : 'primary'}
          sx={{ height: 12, borderRadius: 5, boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.08)' }}
        />
      </Box>

      {/* Ajouter un nouveau budget */}
      <Paper elevation={3} sx={{
        p: { xs: 2, md: 3 },
        mb: 4,
        borderRadius: 3,
        boxShadow: '0 2px 16px 0 rgba(25, 118, 210, 0.08)',
        bgcolor: 'background.paper',
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>Ajouter un budget</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <FormControl fullWidth size="small" sx={{ borderRadius: 2 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={newBudget.category}
                onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                label="Catégorie"
                sx={{ borderRadius: 2 }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Montant"
              type="number"
              value={newBudget.amount}
              onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
              InputProps={{
                startAdornment: <span style={{ color: '#1976d2', fontWeight: 600 }}>FCFA</span>,
                sx: { borderRadius: 2, fontWeight: 600 }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddBudget}
              disabled={!newBudget.category || !newBudget.amount}
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
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Liste des budgets */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 2, fontSize: 16 }}>{error}</Alert>
      ) : budgets.length === 0 ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 3, boxShadow: '0 2px 16px 0 rgba(25, 118, 210, 0.08)' }}>
          <Typography color="textSecondary">
            Aucun budget défini pour le moment. Ajoutez votre premier budget ci-dessus.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(60,72,100,0.07)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Catégorie</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Budget</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Dépensé</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Reste</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Progression</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgets.map((budget, idx) => {
                const spent = calculateCategorySpending(budget.categoryId);
                const remaining = budget.amount - spent;
                const percentage = calculateBudgetPercentage(budget.categoryId, budget.amount);
                return (
                  <TableRow
                    key={budget.id}
                    sx={{
                      bgcolor: idx % 2 === 0 ? 'background.default' : '#fff',
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: 'primary.50' },
                    }}
                  >
                    <TableCell>
                      <Chip 
                        label={budget.category} 
                        size="small" 
                        color={percentage > 90 ? 'error' : 'default'}
                        sx={{ fontWeight: 600, fontSize: 15, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>{formatCurrency(budget.amount)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'error.main', fontSize: 16 }}>{formatCurrency(spent)}</TableCell>
                    <TableCell 
                      align="right"
                      sx={{ fontWeight: 700, color: remaining < 0 ? 'error.main' : 'success.main', fontSize: 16 }}
                    >
                      {formatCurrency(remaining)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={percentage} 
                            color={percentage > 90 ? 'error' : 'primary'}
                            sx={{ height: 8, borderRadius: 2 }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="textSecondary">
                            {percentage}%
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" sx={{ borderRadius: 2 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteBudget(budget.id)}
                        color="error"
                        sx={{ borderRadius: 2 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Budget;
