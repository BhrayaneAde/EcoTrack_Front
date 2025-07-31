import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  List, ListItem, ListItemIcon, ListItemText, Drawer, Toolbar, Divider, ListItemButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalanceWallet as TransactionsIcon,
  AccountBalance as BudgetIcon,
  Savings as SavingsIcon,
  CreditCard as CreditsIcon,
  Receipt as BillsIcon,
  Settings as SettingsIcon,
  Money as MoneyIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Dépenses', icon: <MoneyIcon />, path: '/expenses' },
  { text: 'Revenus', icon: <RevenueIcon />, path: '/revenues' },
  { divider: true },
  { text: 'Transactions', icon: <TransactionsIcon />, path: '/transactions' },
  { text: 'Budget', icon: <BudgetIcon />, path: '/budget' },
  { text: 'Épargne', icon: <SavingsIcon />, path: '/savings' },
  { text: 'Crédits', icon: <CreditsIcon />, path: '/credits' },
  { text: 'Factures', icon: <BillsIcon />, path: '/bills' },
  { divider: true },
  { text: 'Paramètres', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item, index) =>
          item.divider ? (
            <Divider key={`divider-${index}`} sx={{ my: 1 }} />
          ) : (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
