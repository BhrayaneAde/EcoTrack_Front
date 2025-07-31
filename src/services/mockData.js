// Données factices pour les catégories de dépenses
const expenseCategories = [
  { id: 1, name: 'Alimentation' },
  { id: 2, name: 'Transport' },
  { id: 3, name: 'Loisirs' },
  { id: 4, name: 'Logement' },
  { id: 5, name: 'Santé' },
  { id: 6, name: 'Éducation' },
];

// Données factices pour les catégories de revenus
const revenueCategories = [
  { id: 1, name: 'Salaire' },
  { id: 2, name: 'Prime' },
  { id: 3, name: 'Vente' },
  { id: 4, name: 'Cadeau' },
  { id: 5, name: 'Investissement' },
  { id: 6, name: 'Autre' },
];

// Données factices pour les dépenses
let expenses = [
  {
    id: 1,
    montant: 150.50,
    categorie: 'Alimentation',
    date: '2025-07-30',
    description: 'Courses hebdomadaires',
  },
  {
    id: 2,
    montant: 45.20,
    categorie: 'Transport',
    date: '2025-07-29',
    description: 'Essence',
  },
];

// Données factices pour les revenus
let revenues = [
  {
    id: 1,
    montant: 2500.00,
    categorie: 'Salaire',
    date: '2025-07-25',
    description: 'Salaire du mois',
  },
  {
    id: 2,
    montant: 150.00,
    categorie: 'Vente',
    date: '2025-07-20',
    description: 'Vente d\'objets',
  },
];

// Configuration de l'utilisateur
const userConfig = {
  defaultCurrency: 'XOF',
  salary: {
    amount: 2500,
    label: 'Salaire principal',
    date: '25',
    frequency: 'Mensuel',
  },
};

// Fonctions pour simuler des appels API asynchrones
const simulateApiCall = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Opérations pour les catégories
export const mockCategoriesApi = {
  getCategories: async (type) => {
    const categories = type === 'expenses' ? expenseCategories : revenueCategories;
    return simulateApiCall([...categories]);
  },
  
  addCategory: async (type, name) => {
    const categories = type === 'expenses' ? expenseCategories : revenueCategories;
    const newCategory = {
      id: Math.max(0, ...categories.map(c => c.id)) + 1,
      name: name.trim()
    };
    
    categories.push(newCategory);
    return simulateApiCall(newCategory);
  },
};

// Opérations pour les dépenses
export const mockExpensesApi = {
  getExpenses: async () => {
    return simulateApiCall([...expenses]);
  },
  
  addExpense: async (expense) => {
    const newExpense = {
      ...expense,
      id: Math.max(0, ...expenses.map(e => e.id)) + 1,
    };
    
    expenses = [newExpense, ...expenses];
    return simulateApiCall(newExpense);
  },
  
  updateExpense: async (id, updates) => {
    expenses = expenses.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    );
    return simulateApiCall(expenses.find(e => e.id === id));
  },
  
  deleteExpense: async (id) => {
    const deleted = expenses.find(e => e.id === id);
    expenses = expenses.filter(e => e.id !== id);
    return simulateApiCall(deleted);
  },
};

// Opérations pour les revenus
export const mockRevenuesApi = {
  getRevenues: async () => {
    return simulateApiCall([...revenues]);
  },
  
  addRevenue: async (revenue) => {
    const newRevenue = {
      ...revenue,
      id: Math.max(0, ...revenues.map(r => r.id)) + 1,
    };
    
    revenues = [newRevenue, ...revenues];
    return simulateApiCall(newRevenue);
  },
  
  updateRevenue: async (id, updates) => {
    revenues = revenues.map(revenue => 
      revenue.id === id ? { ...revenue, ...updates } : revenue
    );
    return simulateApiCall(revenues.find(r => r.id === id));
  },
  
  deleteRevenue: async (id) => {
    const deleted = revenues.find(r => r.id === id);
    revenues = revenues.filter(r => r.id !== id);
    return simulateApiCall(deleted);
  },
};

// Opérations pour la configuration utilisateur
export const mockUserConfigApi = {
  getConfig: async () => {
    return simulateApiCall({ ...userConfig });
  },
  
  updateConfig: async (updates) => {
    Object.assign(userConfig, updates);
    return simulateApiCall({ ...userConfig });
  },
};

// Données factices pour les factures (Bills)
let bills = [
  {
    id: 1,
    montant: 75000,
    categorie: 'Électricité',
    date: '2025-07-15',
    description: 'Facture EDF',
    statut: 'payée',   // payée / en attente
  },
  {
    id: 2,
    montant: 45000,
    categorie: 'Internet',
    date: '2025-07-20',
    description: 'Abonnement Internet',
    statut: 'en attente',
  },
];

// Données factices pour les crédits (Credits)
let credits = [
  {
    id: 1,
    montant: 500000,
    tauxInteret: 5, // en pourcentage
    dateDebut: '2025-01-01',
    dateFin: '2026-01-01',
    mensualite: 43000,
    description: 'Crédit voiture',
  },
  {
    id: 2,
    montant: 1200000,
    tauxInteret: 3.5,
    dateDebut: '2024-06-01',
    dateFin: '2027-06-01',
    mensualite: 35000,
    description: 'Crédit immobilier',
  },
];

// Opérations pour les factures (Bills)
export const mockBillsApi = {
  getBills: async () => {
    return simulateApiCall([...bills]);
  },

  addBill: async (bill) => {
    const newBill = {
      ...bill,
      id: Math.max(0, ...bills.map(b => b.id)) + 1,
    };
    bills = [newBill, ...bills];
    return simulateApiCall(newBill);
  },

  updateBill: async (id, updates) => {
    bills = bills.map(bill => bill.id === id ? { ...bill, ...updates } : bill);
    return simulateApiCall(bills.find(b => b.id === id));
  },

  deleteBill: async (id) => {
    const deleted = bills.find(b => b.id === id);
    bills = bills.filter(b => b.id !== id);
    return simulateApiCall(deleted);
  },
};

// Opérations pour les crédits (Credits)
export const mockCreditsApi = {
  getCredits: async () => {
    return simulateApiCall([...credits]);
  },

  addCredit: async (credit) => {
    const newCredit = {
      ...credit,
      id: Math.max(0, ...credits.map(c => c.id)) + 1,
    };
    credits = [newCredit, ...credits];
    return simulateApiCall(newCredit);
  },

  updateCredit: async (id, updates) => {
    credits = credits.map(credit => credit.id === id ? { ...credit, ...updates } : credit);
    return simulateApiCall(credits.find(c => c.id === id));
  },

  deleteCredit: async (id) => {
    const deleted = credits.find(c => c.id === id);
    credits = credits.filter(c => c.id !== id);
    return simulateApiCall(deleted);
  },
};

// Dans mockData.js

let savings = [
  // Exemple de données initiales
  {
    id: 1,
    montant: 100000,
    categorie_id: 1,
    date: '2025-07-01',
    description: 'Épargne pour vacances',
  },
  
];

// Opérations pour l’épargne
export const mockSavingsApi = {
  getSavings: async () => {
    return simulateApiCall([...savings]);
  },
  addSaving: async (saving) => {
    const newSaving = {
      ...saving,
      id: Math.max(0, ...savings.map(s => s.id)) + 1,
    };
    savings = [newSaving, ...savings];
    return simulateApiCall(newSaving);
  },
  deleteSaving: async (id) => {
    const deleted = savings.find(s => s.id === id);
    savings = savings.filter(s => s.id !== id);
    return simulateApiCall(deleted);
  },
};




