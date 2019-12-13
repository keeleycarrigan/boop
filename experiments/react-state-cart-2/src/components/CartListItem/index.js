import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const styles = theme => ({
  card: {
    display: 'flex',
    marginBottom: theme.spacing.unit,
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
    },
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    height: 150,
    [theme.breakpoints.up('md')]: {
        height: 'auto',
        width: 150,
    },
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  price: {
    width: 150,
    paddingRight: theme.spacing.unit,
    textAlign: 'right',
  },
  quantityField: {
    width: 50,
    textAlign: 'center',
  },
});

function CartListItem ({ classes, theme, item, onRemoveItem, onUpdateQuantity } ) {
    function decreaseQuantity () {
        onUpdateQuantity(item.id, -1);
    }
    function increaseQuantity () {
        onUpdateQuantity(item.id, 1);
    }
    function replaceQuantity (e) {
        onUpdateQuantity(item.id, e.target.value, true);
    }

  return (
    <Card className={classes.card}>
        <CardMedia
            className={classes.cover}
            image={item.image}
            title={item.name}
        />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {item.name}
          </Typography>
          <Button color={'primary'} onClick={onRemoveItem}>Remove Item</Button>
        </CardContent>
        <div className={classes.controls}>
          <IconButton aria-label="Minus" onClick={decreaseQuantity}>
            <RemoveIcon />
          </IconButton>
          <TextField
                id={`item-${item.id}-quantity`}
                className={classes.quantityField}
                value={item.count}
                onChange={replaceQuantity}
                margin={'normal'}
                variant={'outlined'}
            />
          <IconButton aria-label="Add" onClick={increaseQuantity}>
            <AddIcon />
          </IconButton>
        </div>
        <div className={classes.price}>
            <Typography component="h5" variant="h5">{item.priceTxt}</Typography>
        </div>
      </div>
    </Card>
  );
}

CartListItem.defaultProps = {
    onRemoveItem: () => {},
    onUpdateQuantity: () => {},
}

export default withStyles(styles, { withTheme: true })(CartListItem);