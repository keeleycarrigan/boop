import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';



export default function ConfirmationView (props) {

  return (
    <Grid container item xs={12} spacing={24} alignContent={'center'} justify={'center'}>
      <Grid item xs={12} md={6}>
        <Typography component="h5" variant="h4">Order Complete!</Typography>
      </Grid>
    </Grid>
  );
}