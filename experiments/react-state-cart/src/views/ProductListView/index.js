import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Row } from '../../layout';
import ProductList from '../../components/ProductList';

export default function ProductListView () {
    return (
        <React.Fragment>
            <Row>
                <Grid item xs={12}>
                    <Typography gutterBottom variant={'h3'} component={'h1'}>Products</Typography>
                </Grid>
            </Row>
            <ProductList />
        </React.Fragment>
    );
}