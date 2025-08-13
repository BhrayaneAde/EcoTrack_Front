import React from 'react';
import { Typography, Paper, Box, Button, TextField, Grid } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

const EditTransaction = () => {
  const { id } = useParams();
  
  return (
    <Box p={{ xs: 1, md: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>Modifier la transaction</Typography>
        <Button component={Link} to="/transactions" variant="outlined" sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1.2, fontSize: 16 }}>
          Retour à la liste
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, boxShadow: '0 2px 16px 0 rgba(25, 118, 210, 0.08)', bgcolor: 'background.paper' }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
          Modification de la transaction #{id}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Description" margin="normal" defaultValue="Sample Transaction" sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Montant" type="number" margin="normal" defaultValue="100.00" sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1.2, fontSize: 16, boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.08)', mr: 2 }}>
              Mettre à jour
            </Button>
            <Button component={Link} to="/transactions" variant="outlined" sx={{ borderRadius: 3, fontWeight: 600, px: 3, py: 1.2, fontSize: 16 }}>
              Annuler
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EditTransaction;
