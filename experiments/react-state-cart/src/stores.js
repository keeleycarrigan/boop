import { Container } from 'unstated';
import {
    cloneDeep,
    findIndex,
} from 'lodash';

import {
    getCleanNumber,
    getFormattedNumber,
    LocalData,
    roundNumber,
} from '@momappoki/elements-utils';

const cartData = new LocalData('cartData', 'sessionStorage');
const customerData = new LocalData('customerData', 'sessionStorage');

function getInitialCartState (reset) {
    const storage = reset ? null : cartData.get();
    let defaultState = {
        activeStep: 0,
        items: [],
        steps: ['Review', 'Shipping', 'Payment', 'Confirmation'],
        total: 0.00,
        totalItems: 0,
        totalTxt: '$0.00',
    };

    return storage ? { ...storage } : defaultState;
}

function getInitialCustomerInfoState (reset) {
    const storage = reset ? null : customerData.get();
    let defaultState = {
        shipping: {},
        payment: {},
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
        if (activeStep >= 0 && activeStep <= this.state.steps.length - 1) {
            cartData.update({ activeStep });
            this.setState(state => ({
                activeStep,
            }));
        }
    }

    goToNextStep = () => {
        this.goToStep(this.state.activeStep + 1);
    }

    goToPreviousStep = () => {
        this.goToStep(this.state.activeStep - 1);
    }

    reset = () => {
        const resetState = getInitialCartState(true);

        this.setState(state => {
            const newState = {
                ...resetState,
                activeStep: state.activeStep,
            }
            cartData.put(newState);
            return newState;
        });
        
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
                ...state,
                items: itemsCopy,
                totalItems: state.totalItems += 1,
                total,
                totalTxt: getFormattedNumber(total, 2, '$'),
            };
            cartData.put(newState);

            return newState;
        });
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
                    ...state,
                    items: itemsCopy,
                    totalItems,
                    total,
                    totalTxt: getFormattedNumber(total, 2, '$'),
                };
                cartData.put(newState);
            }

            return newState;
        });
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
                        ...state,
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
        });
    }
}

export class CustomerDataState extends Container {
    state = getInitialCustomerInfoState();

    reset = () => {
        const newState = getInitialCustomerInfoState(true);

        this.setState(newState);
        customerData.put(newState);
    }

    update = (step = '', values) => {
        const stepName = step.toLowerCase();

        if (this.state[stepName]) {
            this.setState(state => {
                let newState = cloneDeep(state);

                newState[step] = {
                    ...cloneDeep(values),
                };

                customerData.put(newState);

                return newState;
            });
        }
    }
}

export const cartStateContainer = new CartState();
export const customerDataStateContainer = new CustomerDataState();
export const inventoryStateContainer = new InventoryState();
