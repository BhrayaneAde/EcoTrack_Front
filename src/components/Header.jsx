
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ onMenuClick }) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#fff',
        color: '#1976d2',
        boxShadow: '0 2px 12px 0 rgba(60,72,100,0.07)',
        borderBottom: '1px solid #e3e6ef',
      }}
    >
      <Toolbar>
        <IconButton
          color="primary"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <img src="/vite.svg" alt="EcoTrack" style={{ height: 32, marginRight: 10 }} />
        <Typography variant="h5" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: 1, color: '#1976d2' }}>
          EcoTrack
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Profil utilisateur">
          <Avatar sx={{ bgcolor: '#43a047', color: '#fff', fontWeight: 700, width: 38, height: 38, fontSize: 18 }}>
            E
          </Avatar>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
