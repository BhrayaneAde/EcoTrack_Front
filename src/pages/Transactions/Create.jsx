import React from 'react';
import { Typography, Paper, Box, Button, TextField, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const CreateTransaction = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">New Transaction</Typography>
        <Button component={Link} to="/transactions" variant="outlined">
          Back to List
        </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Description" margin="normal" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Amount" type="number" margin="normal" />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Save Transaction
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CreateTransaction;
