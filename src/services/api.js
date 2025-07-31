// Import des mocks pour simuler les appels API
import {
  mockCategoriesApi,
  mockExpensesApi,
  mockRevenuesApi,
  mockUserConfigApi,
  mockBillsApi,
  mockCreditsApi,
  mockSavingsApi,
} from './mockData';

// mock data interne pour crédits
let credits = [
  {
    id: 1,
    montant: 100000,
    tauxInteret: 5,
    dateDebut: '2024-01-01',
    dateFin: '2025-01-01',
    mensualite: 9000,
    description: 'Crédit personnel',
  },
  // ...
];

// Simule délai
const simulateDelay = (data, delay = 300) => new Promise(res => setTimeout(() => res(data), delay));




export const savingsApi = {
  getSavings: mockSavingsApi.getSavings,
  addSaving: mockSavingsApi.addSaving,
  deleteSaving: mockSavingsApi.deleteSaving,
};

// Gestion des erreurs
const handleError = (error) => {
  console.error('Erreur API:', error);
  throw new Error(error.message || 'Une erreur est survenue');
};

// Catégories
export const categoriesApi = {
  getCategories: async (type) => {
    try {
      return await mockCategoriesApi.getCategories(type);
    } catch (error) {
      return handleError(error);
    }
  },
  addCategory: async (type, name) => {
    try {
      return await mockCategoriesApi.addCategory(type, name);
    } catch (error) {
      return handleError(error);
    }
  },
};

// Dépenses
export const expensesApi = {
  getExpenses: async (filters = {}) => {
    try {
      let result = await mockExpensesApi.getExpenses();

      if (filters.month) {
        result = result.filter(expense => (new Date(expense.date).getMonth() + 1) === parseInt(filters.month));
      }
      if (filters.year) {
        result = result.filter(expense => new Date(expense.date).getFullYear() === parseInt(filters.year));
      }
      if (filters.category) {
        result = result.filter(expense => expense.categorie.toLowerCase() === filters.category.toLowerCase());
      }
      return result;
    } catch (error) {
      return handleError(error);
    }
  },
  addExpense: async (expenseData) => {
    try {
      return await mockExpensesApi.addExpense(expenseData);
    } catch (error) {
      return handleError(error);
    }
  },
  updateExpense: async (id, expenseData) => {
    try {
      return await mockExpensesApi.updateExpense(id, expenseData);
    } catch (error) {
      return handleError(error);
    }
  },
  deleteExpense: async (id) => {
    try {
      return await mockExpensesApi.deleteExpense(id);
    } catch (error) {
      return handleError(error);
    }
  },
};

// Revenus
export const revenuesApi = {
  getRevenues: async (filters = {}) => {
    try {
      let result = await mockRevenuesApi.getRevenues();

      if (filters.month) {
        result = result.filter(revenue => (new Date(revenue.date).getMonth() + 1) === parseInt(filters.month));
      }
      if (filters.year) {
        result = result.filter(revenue => new Date(revenue.date).getFullYear() === parseInt(filters.year));
      }
      if (filters.category) {
        result = result.filter(revenue => revenue.categorie.toLowerCase() === filters.category.toLowerCase());
      }
      return result;
    } catch (error) {
      return handleError(error);
    }
  },
  addRevenue: async (revenueData) => {
    try {
      return await mockRevenuesApi.addRevenue(revenueData);
    } catch (error) {
      return handleError(error);
    }
  },
  updateRevenue: async (id, revenueData) => {
    try {
      return await mockRevenuesApi.updateRevenue(id, revenueData);
    } catch (error) {
      return handleError(error);
    }
  },
  deleteRevenue: async (id) => {
    try {
      return await mockRevenuesApi.deleteRevenue(id);
    } catch (error) {
      return handleError(error);
    }
  },
};

// Configuration utilisateur
// Configuration utilisateur (anciennement userConfigApi)
export const settingsApi = {
  getConfig: async () => {
    try {
      return await mockUserConfigApi.getConfig();
    } catch (error) {
      return handleError(error);
    }
  },

  updateConfig: async (updates) => {
    try {
      return await mockUserConfigApi.updateConfig(updates);
    } catch (error) {
      return handleError(error);
    }
  },
};


// Formatage d'une devise (devise dynamique possible)
export const formatCurrency = (amount, currency = 'XOF') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Formatage de date
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Renvoie mois et année courants
export const getCurrentMonth = () => new Date().getMonth() + 1;
export const getCurrentYear = () => new Date().getFullYear();

// Factures (Bills)
export const billsApi = {
  getBills: async (filters = {}) => {
    try {
      let result = await mockBillsApi.getBills();

      if (filters.month) {
        result = result.filter(bill => (new Date(bill.date).getMonth() + 1) === parseInt(filters.month));
      }
      if (filters.year) {
        result = result.filter(bill => new Date(bill.date).getFullYear() === parseInt(filters.year));
      }
      if (filters.category) {
        result = result.filter(bill => bill.categorie.toLowerCase() === filters.category.toLowerCase());
      }
      return result;
    } catch (error) {
      return handleError(error);
    }
  },
  addBill: async (data) => {
    try {
      return await mockBillsApi.addBill(data);
    } catch (error) {
      return handleError(error);
    }
  },
  updateBill: async (id, data) => {
    try {
      return await mockBillsApi.updateBill(id, data);
    } catch (error) {
      return handleError(error);
    }
  },
  deleteBill: async (id) => {
    try {
      return await mockBillsApi.deleteBill(id);
    } catch (error) {
      return handleError(error);
    }
  },
};

// Crédits (Credits)
export const creditsApi = {
  getCredits: async (filters = {}) => {
    try {
      let result = await mockCreditsApi.getCredits();

      if (filters.month) {
        result = result.filter(c => (new Date(c.dateDebut).getMonth() + 1) === parseInt(filters.month));
      }
      if (filters.year) {
        result = result.filter(c => new Date(c.dateDebut).getFullYear() === parseInt(filters.year));
      }
      if (filters.category) {
        result = result.filter(c => c.categorie && c.categorie.toLowerCase() === filters.category.toLowerCase());
      }
      return result;
    } catch (error) {
      return handleError(error);
    }
  },
  addCredit: async (data) => {
    try {
      return await mockCreditsApi.addCredit(data);
    } catch (error) {
      return handleError(error);
    }
  },
  updateCredit: async (id, data) => {
    try {
      return await mockCreditsApi.updateCredit(id, data);
    } catch (error) {
      return handleError(error);
    }
  },
  deleteCredit: async (id) => {
    try {
      return await mockCreditsApi.deleteCredit(id);
    } catch (error) {
      return handleError(error);
    }
  },
};
