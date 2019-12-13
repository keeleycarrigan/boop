import React from 'react';
import { Subscribe } from 'unstated';

import {
    cartStateContainer,
} from '../../stores';
import CardListItem from '../../components/CartListItem';

function _onUpdateQuantity(cart, ...args) {
    cart.updateQuantity.apply(null, args);
}
function _onRemoveItem(cart, id) {
    cart.removeItem(id);
}

export default function ReviewItemsView (props) {
    return (
        <Subscribe to={[cartStateContainer]}>
            {(cart) => (
                <React.Fragment>
                    {cart.state.items.map(item => <CardListItem key={item.id} item={item} onRemoveItem={_onRemoveItem.bind(null, cart, item.id)} onUpdateQuantity={_onUpdateQuantity.bind(null, cart)} />)}
                </React.Fragment>
            )}
        </Subscribe>
    );
}