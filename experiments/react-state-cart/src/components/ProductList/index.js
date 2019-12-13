import React from 'react';
import { Subscribe } from 'unstated';
import Grid from '@material-ui/core/Grid';

import { Row } from '../../layout';
import {
    cartStateContainer,
    inventoryStateContainer,
} from '../../stores';
import ProductListItem from '../../components/ProductListItem';

function renderListItem (cart, item) {
    function addProductToCart () {
        cart.addCartItem(item);
    }
    return (
        <Grid key={item.id} item xs={12} sm={6} md={4}>
            <ProductListItem {...item} onAddClick={addProductToCart} />
        </Grid>
    )
}

export default function ProductList (props) {
    return (
        <Subscribe to={[ cartStateContainer, inventoryStateContainer ]}>
            {(cart, inventory) => (
                <Row>
                    {inventory.state.items.map(renderListItem.bind(null, cart))}
                </Row>
            )}
        </Subscribe>
    )
}