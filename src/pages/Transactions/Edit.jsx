import React from 'react';
import { Typography, Paper, Box, Button, TextField, Grid } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

const EditTransaction = () => {
  const { id } = useParams();
  
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Edit Transaction</Typography>
        <Button component={Link} to="/transactions" variant="outlined">
          Back to List
        </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Editing Transaction #{id}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Description" margin="normal" defaultValue="Sample Transaction" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Amount" type="number" margin="normal" defaultValue="100.00" />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" sx={{ mr: 2 }}>
              Update
            </Button>
            <Button component={Link} to="/transactions" variant="outlined">
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EditTransaction;
