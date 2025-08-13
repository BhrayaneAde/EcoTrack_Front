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
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #1976d2 0%, #43a047 100%)',
          color: '#fff',
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          boxShadow: '2px 0 16px 0 rgba(25, 118, 210, 0.08)',
          border: 'none',
        },
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', minHeight: 80 }}>
        <img src="/vite.svg" alt="EcoTrack" style={{ height: 38, marginRight: 8 }} />
        <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>EcoTrack</span>
      </Toolbar>
      <List sx={{ mt: 2 }}>
        {menuItems.map((item, index) =>
          item.divider ? (
            <Divider key={`divider-${index}`} sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.15)' }} />
          ) : (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 8,
                  mx: 1,
                  background: location.pathname === item.path ? 'rgba(255,255,255,0.18)' : 'transparent',
                  boxShadow: location.pathname === item.path ? '0 2px 8px 0 rgba(60,72,100,0.10)' : 'none',
                  color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.85)',
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.10)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
