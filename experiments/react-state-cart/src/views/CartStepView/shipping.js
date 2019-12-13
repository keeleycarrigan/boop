import React from 'react';
import Grid from '@material-ui/core/Grid';
import { get } from 'lodash';

import {
  InputGroup,
} from '@momappoki/elements/Form';
import {
  validHasInput,
  validZipcode,
  zipcodeMask,
  validEmail,
} from '@momappoki/elements-utils';

import {
  CartCheckbox,
  CartRadio,
  CartSelect,
  CartTextInput,
  FormField,
} from '../../components/CartForm'


export default function ShippingView({ cart, customerData, formApi }) {
  const shippingData = get(customerData, 'state.shipping.values', {});

  return (
    <Grid container item xs={12} spacing={24} justify={'center'}>
      <Grid item xs={12} lg={6}>
        <CartTextInput
          field={'fullName'}
          fullWidth
          id={'fullName'}
          initialValue={shippingData.fullName}
          label={'Name'}
          validate
        />
        <CartTextInput
          field={'email'}
          fullWidth
          id={'email'}
          initialValue={shippingData.email}
          label={'Email'}
          type={'email'}
          validate={{
            errorMsg: 'Please provide a valid email.',
            test: validEmail,
          }}
        />
        <CartTextInput
          field={'street'}
          fullWidth
          id={'street'}
          initialValue={shippingData.street}
          label={'Street'}
          validate
        />
        <CartTextInput
          field={'zipCode'}
          fullWidth
          id={'zipCode'}
          initialValue={shippingData.zipCode}
          label={'Zip Code'}
          mask={zipcodeMask}
          maskOnChange
          validate={[
            {
              errorMsg: 'Please provide zipcode.',
              test: validHasInput,
            },
            {
              errorMsg: 'Please provide a valid zipcode.',
              test: validZipcode,
            }
          ]}
        />
        <CartSelect
          field={'state'}
          fullWidth
          id={'state'}
          initialValue={shippingData.state}
          label={'State'}
          validate
        >
          <option value=""></option>
          <option value="AL">Alabama</option>
          <option value="AK">Alaska</option>
          <option value="AZ">Arizona</option>
          <option value="AR">Arkansas</option>
          <option value="CA">California</option>
          <option value="CO">Colorado</option>
          <option value="CT">Connecticut</option>
          <option value="DE">Delaware</option>
          <option value="DC">District Of Columbia</option>
          <option value="FL">Florida</option>
          <option value="GA">Georgia</option>
          <option value="HI">Hawaii</option>
          <option value="ID">Idaho</option>
          <option value="IL">Illinois</option>
          <option value="IN">Indiana</option>
          <option value="IA">Iowa</option>
          <option value="KS">Kansas</option>
          <option value="KY">Kentucky</option>
          <option value="LA">Louisiana</option>
          <option value="ME">Maine</option>
          <option value="MD">Maryland</option>
          <option value="MA">Massachusetts</option>
          <option value="MI">Michigan</option>
          <option value="MN">Minnesota</option>
          <option value="MS">Mississippi</option>
          <option value="MO">Missouri</option>
          <option value="MT">Montana</option>
          <option value="NE">Nebraska</option>
          <option value="NV">Nevada</option>
          <option value="NH">New Hampshire</option>
          <option value="NJ">New Jersey</option>
          <option value="NM">New Mexico</option>
          <option value="NY">New York</option>
          <option value="NC">North Carolina</option>
          <option value="ND">North Dakota</option>
          <option value="OH">Ohio</option>
          <option value="OK">Oklahoma</option>
          <option value="OR">Oregon</option>
          <option value="PA">Pennsylvania</option>
          <option value="RI">Rhode Island</option>
          <option value="SC">South Carolina</option>
          <option value="SD">South Dakota</option>
          <option value="TN">Tennessee</option>
          <option value="TX">Texas</option>
          <option value="UT">Utah</option>
          <option value="VT">Vermont</option>
          <option value="VA">Virginia</option>
          <option value="WA">Washington</option>
          <option value="WV">West Virginia</option>
          <option value="WI">Wisconsin</option>
          <option value="WY">Wyoming</option>
        </CartSelect>
        <FormField>
          <InputGroup field="shippingType" initialValue={shippingData.shippingType || 'normal'}>
            <CartRadio
              value={'normal'}
              id={'normalShipping'}
              label={'Normal Shipping'}
            />
            <CartRadio
              value={'expedited'}
              id={'expeditedShipping'}
              label={'Expedited Shipping'}
            />
          </InputGroup>
        </FormField>

        <FormField>
          <CartCheckbox
            field={'isGift'}
            id={'isGift'}
            initialValue={shippingData.isGift}
            label={'Is this is a gift?'}
          />
        </FormField>
      </Grid>
    </Grid>
  );
}
