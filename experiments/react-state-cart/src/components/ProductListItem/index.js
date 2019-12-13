import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    media: {
        height: 150,
    },
};

function ProductListItem ({ name, image, priceTxt, classes, onAddClick }) {
    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    alt={name}
                    image={image}
                />
                <CardContent>
                <Typography gutterBottom variant={'h5'} component={'h2'}>{name} - {priceTxt}</Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
            <Button variant="contained" color="primary" onClick={onAddClick}>Add to Cart</Button>
            </CardActions>
        </Card>
    )
}

ProductListItem.defaultProps = {
    onAddClick: () => {}
}

export default withStyles(styles)(ProductListItem);