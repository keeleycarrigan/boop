import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import { Subscribe } from 'unstated';

import {
    cartStateContainer,
    inventoryStateContainer,
} from '../../stores';

const styles = {
  root: {
    // marginTop: -12,
    // marginRight: -12,
    // marginLeft: -12,
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
    marginLeft: -12,
    marginRight: 20,
  },
};

function Navbar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
        <Subscribe to={[cartStateContainer]} className={classes.root}>
            {cart => (
                <AppBar position="static">
                    <Toolbar>
                    <Typography variant="h6" color="inherit" className={classes.grow}>
                        Store
                    </Typography>
                    <Button component={Link} to={'/cart/'} className={classes.menuButton} color="inherit" aria-label="Menu">
                        <ShoppingCart />
                        {cart.state.totalItems}
                    </Button>
                    </Toolbar>
                </AppBar>
            )}
        </Subscribe>
    </div>
  );
}


export default withStyles(styles)(Navbar);