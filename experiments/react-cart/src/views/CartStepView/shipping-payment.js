import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Subscribe } from 'unstated';

import {
    cartStateContainer,
} from '../../stores';
import {
    Form,
    InputGroup,
    Radio,
    GroupCheckbox,
    Checkbox,
} from '../../components/Form';
import {
    characterLimit,
    creditCard,
    hasInput,
    isZipcode,
    numbersOnly,
    zipcodeMask,
    isEmail,
} from '../../components/Form/utilities';

import {
    CartCheckbox,
    CartRadio,
    CartSelect,
    CartTextInput,
    FieldError,
    FieldErrorStyle,
    FormField,
} from '../../components/CartForm'

function setApi (api) {
    this.api = api;
}

export default class PaymentShippingView extends PureComponent {
    constructor(props) {
        super(props);

        this.isGift = React.createRef();

    }
    componentDidMount() {
        console.log(this.isGift.current)
    }
    render() {
        
        return (
            <Subscribe to={[cartStateContainer]}>
                {(cart) => (
                    <Form getApi={setApi.bind(this)} errorLimit={1}>
                        <Grid container item xs={12} spacing={24}>
                            <Grid item xs={12} md={6}>
                                <CartTextInput
                                    field={'fullName'}
                                    fullWidth
                                    id={'fullName'}
                                    label={'Name'}
                                    validate
                                />
                                <CartTextInput
                                    field={'email'}
                                    fullWidth
                                    id={'email'}
                                    label={'Email'}
                                    type={'email'}
                                    validate={{
                                        errorMsg: 'Please provide a valid email.',
                                        test: isEmail,
                                    }}
                                />
                                <CartTextInput
                                    field={'street'}
                                    fullWidth
                                    id={'street'}
                                    label={'Street'}
                                    validate
                                />
                                <CartTextInput
                                    field={'zipCode'}
                                    fullWidth
                                    id={'zipCode'}
                                    label={'Zip Code'}
                                    mask={zipcodeMask}
                                    maskOnChange
                                    validate={[
                                        {
                                            errorMsg: 'Please provide zipcode.',
                                            test: hasInput,
                                        },
                                        {
                                            errorMsg: 'Please provide a valid zipcode.',
                                            test: isZipcode,
                                        }
                                    ]}
                                />
                                <CartSelect
                                    field={'state'}
                                    fullWidth
                                    id={'state'}
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
                                    <InputGroup field="shippingType" initialValue={'normal'}>
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
                                        forwardedRef={this.isGift}
                                        id={'isGift'}
                                        label={'Is this is a gift?'}
                                    />
                                </FormField>
                            </Grid>
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
                                    label={'Credit Card Number'}
                                    mask={creditCard}
                                    maskOnChange
                                    validate
                                />
                                <Grid container item xs={12} spacing={24}>
                                    <Grid item xs={12} md={4}>
                                        <CartSelect
                                            field={'ccExpirationMonth'}
                                            id={'ccExpirationMonth'}
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
                                            label={'Security Code'}
                                            mask={characterLimit(3)}
                                            maskOnChange
                                            validate
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button variant={'contained'} color={'primary'} type={'submit'}>Submit</Button>
                            </Grid>
                        </Grid>
                    </Form>
            )}
            </Subscribe>
        )
    }
}