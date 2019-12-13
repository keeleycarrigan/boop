import React from 'react';
import Grid from '@material-ui/core/Grid';
import { get } from 'lodash';

import {
  characterLimitMask,
  creditCardMask,
} from '@momappoki/elements-utils';

import {
  CartSelect,
  CartTextInput,
} from '../../components/CartForm'

export default function PaymentView ({ cart, customerData, formApi }) {
  const paymentData = get(customerData, 'state.payment.values', {});

  return (
    <Grid container item xs={12} spacing={24} justify={'center'}>
      <Grid item xs={12} md={6}>
        <CartSelect
          field={'ccType'}
          id={'ccType'}
          label={'Credit Card Type'}
          validate
        >
          <option value=""></option>
          <option value="visa">Visa</option>
          <option value="mastercard">Mastercard</option>
          <option value="discover">Discover</option>
          <option value="capital one">Capital One</option>
        </CartSelect>
        <CartTextInput
          field={'ccNumber'}
          fullWidth
          id={'ccNumber'}
          initialValue={paymentData.ccNumber}
          label={'Credit Card Number'}
          mask={creditCardMask}
          maskOnChange
          validate
        />
        <Grid container item xs={12} spacing={24}>
          <Grid item xs={12} md={4}>
            <CartSelect
              field={'ccExpirationMonth'}
              id={'ccExpirationMonth'}
              initialValue={paymentData.ccExpirationMonth}
              label={'Exp. Month'}
              validate
            >
              <option value=""></option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </CartSelect>
          </Grid>
          <Grid item xs={12} md={4}>
            <CartSelect
              field={'ccExpirationYear'}
              id={'ccExpirationYear'}
              initialValue={paymentData.ccExpirationYear}
              label={'Exp. Year'}
              validate
            >
              <option value=""></option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
            </CartSelect>
          </Grid>
          <Grid item xs={12} md={4}>
            <CartTextInput
              field={'ccSecurity'}
              fullWidth
              id={'ccSecurity'}
              initialValue={paymentData.ccSecurity}
              label={'Security Code'}
              mask={characterLimitMask(3)}
              maskOnChange
              validate
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
