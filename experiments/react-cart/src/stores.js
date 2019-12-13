import { Container } from 'unstated';
import {
    cloneDeep,
    findIndex,
} from 'lodash';

import {
    getCleanNumber,
    getFormattedNumber,
    roundNumber,
} from './utilities/numbers';
import { LocalData } from './utilities/local-data';

const cartData = new LocalData('cartData', 'sessionStorage');

function getInitialCartState () {
    const storage = cartData.get();
    let defaultState = {
        activeStep: 0,
        items: [],
        totalItems: 0,
        total: 0.00,
        totalTxt: '$0.00',
    };

    return storage ? { ...storage } : defaultState;
}

function getTotal (items) {
    return roundNumber(items.reduce((prevTotal, item) => prevTotal + (item.price * item.count), 0), 2);
}

export class InventoryState extends Container {
    state = {
        items: [
            {
                id: 1,
                name: 'Something',
                image: 'https://images-na.ssl-images-amazon.com/images/I/61r-I5idV6L._SY355_.jpg',
                price: 2.25,
                priceTxt: '$2.25',
            },
            {
                id: 2,
                name: 'More Something',
                image: 'https://image.smythstoys.com/picture/desktop/168303003.jpg',
                price: 4.00,
                priceTxt: '$4.00',
            },
            {
                id: 3,
                name: 'Even More Something',
                image: 'https://medias.lagranderecre.fr/imgs/1/1200x/752874V11_01.jpg',
                price: 1.03,
                priceTxt: '$1.03',
            }
        ]
    }
}

export class CartState extends Container {
    state = getInitialCartState();

    goToStep = (activeStep) => {
        cartData.update({ activeStep });
        this.setState(state => ({
            activeStep,
        }));
    }

    goToNextStep = () => {
        this.goToStep(this.state.activeStep + 1);
    }

    goToPreviousStep = () => {
        this.goToStep(this.state.activeStep - 1);
    }

    addCartItem = (item) => {
        this.setState(state => {
            const itemsCopy = cloneDeep(state.items);
            const itemIdx = findIndex(itemsCopy, cartItem => cartItem.id === item.id);
            let newState = {};

            if (itemIdx > -1) {
                itemsCopy[itemIdx].count += 1;
            } else {
                itemsCopy.push({ ...item, count: 1 });
            }

            const total = getTotal(itemsCopy);
            newState = {
                activeStep: state.activeStep,
                items: itemsCopy,
                totalItems: state.totalItems += 1,
                total,
                totalTxt: getFormattedNumber(total, 2, '$'),
            };
            cartData.put(newState);

            return newState;
        }, () => console.log(`new cart state = `, this.state));
    }

    removeItem = (id) => {
        this.setState(state => {
            const itemsCopy = cloneDeep(state.items);
            const itemIdx = findIndex(itemsCopy, cartItem => cartItem.id === id);
            let newState = {}

            if (itemIdx > -1) {
                const totalItems = state.totalItems - itemsCopy[itemIdx].count;
                itemsCopy.splice(itemIdx, 1);

                const total = getTotal(itemsCopy);

                newState = {
                    activeStep: state.activeStep,
                    items: itemsCopy,
                    totalItems,
                    total,
                    totalTxt: getFormattedNumber(total, 2, '$'),
                };
                cartData.put(newState);
            }

            return newState;
        }, () => console.log(`new cart state = `, this.state));
    }

    updateQuantity = (id, quantity, overwrite) => {
        this.setState(state => {
            const itemsCopy = cloneDeep(state.items);
            const itemIdx = findIndex(itemsCopy, cartItem => cartItem.id === id);
            let newState = {}

            if (itemIdx > -1) {
                const currentCount = itemsCopy[itemIdx].count;
                const parsedQty = getCleanNumber(quantity);
                const newCount = overwrite ? parsedQty : currentCount + parsedQty;
                const totalItems = overwrite ? (state.totalItems - currentCount) + parsedQty : state.totalItems + parsedQty;

                if (newCount > 0) {
                    itemsCopy[itemIdx].count = newCount;

                    const total = getTotal(itemsCopy);

                    newState = {
                        activeStep: state.activeStep,
                        items: itemsCopy,
                        totalItems,
                        total,
                        totalTxt: getFormattedNumber(total, 2, '$'),
                    };
                    cartData.put(newState);
                } else {
                    this.removeItem(id);
                }
            }

            return newState;
        }, () => console.log(`new cart state = `, this.state));
    }
}

export const cartStateContainer = new CartState();
export const inventoryStateContainer = new InventoryState();