import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import Loading from '../components/Loading';
import AddTransaction from '../pages/AddTransaction';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Transactions = React.lazy(() => import('../pages/Transactions'));
const CreateTransaction = React.lazy(() => import('../pages/Transactions/Create'));
const EditTransaction = React.lazy(() => import('../pages/Transactions/Edit'));
const Budget = React.lazy(() => import('../pages/Budget'));
const Savings = React.lazy(() => import('../pages/Savings'));
const Credits = React.lazy(() => import('../pages/Credits'));
const Bills = React.lazy(() => import('../pages/Bills'));
const Settings = React.lazy(() => import('../pages/Settings'));
const Expenses = React.lazy(() => import('../pages/Expenses'));
const Revenues = React.lazy(() => import('../pages/Revenues'));

const AppRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions">
  <Route index element={<Transactions />} />
  <Route path="add-transaction" element={<AddTransaction />} /> {/* ✅ FIX */}
  <Route path="create" element={<CreateTransaction />} />
  <Route path=":id/edit" element={<EditTransaction />} />
</Route>

          <Route path="budget" element={<Budget />} />
          <Route path="savings" element={<Savings />} />
          <Route path="credits" element={<Credits />} />
          <Route path="bills" element={<Bills />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="revenues" element={<Revenues />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
