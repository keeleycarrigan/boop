import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const rowStyles = theme => ({
    root: {
        maxWidth: 1100,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});

export const Row = withStyles(rowStyles)(props => (
    <div className={props.classes.root}>
        <Grid container spacing={24}>
            {props.children}
        </Grid>
    </div>
));