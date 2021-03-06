import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Route,
} from 'react-router-dom';
import { Provider } from 'unstated';
import CssBaseline from '@material-ui/core/CssBaseline';

import Navbar from './components/Navbar';
import ProductListView from './views/ProductListView';
import CartStepView from './views/CartStepView';


function AppRouter () {
    return (
        <BrowserRouter>
            <Provider>
                <CssBaseline />
                <Navbar />
                <div style={{ padding: 12 }}>
                    <Route path="/" exact component={ProductListView} />
                    <Route path="/cart/" component={CartStepView} />
                </div>
            </Provider>
        </BrowserRouter>
    )
}

const appContainer = document.getElementById('root');
ReactDOM.render(<AppRouter />, appContainer);