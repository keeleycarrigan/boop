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
  Form,
} from '@momappoki/elements';

// import AudioPlayer from 'test-thunder-lizard/components/AudioPlayer';



import { Row } from '../../layout';
import {
  CartSubmitButton
} from '../../components/CartForm';
import {
  MainFormErrors
} from '../../components/CartForm/FieldError';
import {
    cartStateContainer,
    customerDataStateContainer,
} from '../../stores';
import ConfirmationView from './confirmation';
import PaymentView from './payment';
import ReviewItemsView from './review';
import ShippingView from './shipping';

const styles = theme => ({
  backButton: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  price: {
      display: 'flex',
      justifyContent: 'flex-end',
  },
  stepLabel: {
    whiteSpace: 'pre',
  }
});

function getStepContent(cart, customerData, formApi) {

  switch (cart.state.activeStep) {
    case 0:
      return <ReviewItemsView />;
    case 1:
      return <ShippingView cart={cart} customerData={customerData} formApi={formApi} />;
    case 2:
      return <PaymentView cart={cart} customerData={customerData} formApi={formApi} />;
    case 3:
      return <ConfirmationView />
    default:
      return 'Uknown stepIndex';
  }
}

class CartStepView extends PureComponent {
  setApi = (api) => {
    this.api = api;
  }
  getFormState = () => {
    console.log(this.api.getFormState())
  }

  submitStep(cart, customerData) {
    return () => {
      const stepName = cart.state.steps[cart.state.activeStep].toLowerCase();
      this.api.validateFields()
        .then(() => {
          if (cart.state.activeStep === cart.state.steps.length - 2) {
            cart.reset();
            customerData.reset();
          }
          customerData.update(stepName, this.api.getFormState());
          cart.goToNextStep();
        })
        .catch(() => customerData.update(stepName, this.api.getFormState()));
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Subscribe to={[cartStateContainer, customerDataStateContainer]}>
        {(cart, customerData) => (
          <Form getApi={this.setApi} errorLimit={1}>
            {({ formApi }) => (
              <React.Fragment>
                <Row justify="center">
                  <Grid item xs={12}>
                    <Stepper activeStep={cart.state.activeStep} alternativeLabel>
                      {cart.state.steps.map(label => {
                        return (
                          <Step key={label}>
                            <StepLabel className={classes.stepLabel}>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MainFormErrors />
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.instructions}>{getStepContent(cart, customerData, formApi)}</div>
                  </Grid>
                  {(() => {
                    if (cart.state.activeStep < cart.state.steps.length - 1) {
                      return (
                        <Grid container item xs={12} md={6}>
                          <Grid item xs={12} md={6}>
                            <Button
                              disabled={cart.state.activeStep === 0}
                              onClick={cart.goToPreviousStep}
                              className={classes.backButton}
                            >
                              Back
                            </Button>
                            <CartSubmitButton
                              onClick={this.submitStep(cart, customerData)}
                            >
                              {cart.state.activeStep === cart.state.steps.length - 2 ? 'Finish' : 'Next'}
                            </CartSubmitButton>
                            {/* <Button variant={'contained'} color={'primary'} type="submit" onClick={this.getFormState}>
                          Get Form State
                        </Button> */}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div className={classes.price}>
                              <Typography component="h5" variant="h4">{cart.state.totalTxt}</Typography>
                            </div>
                          </Grid>
                        </Grid>
                      )
                    }
                  })()}
                </Row>

              </React.Fragment>
            )}
          </Form>
        )}
      </Subscribe>
    );
  }
  
}

export default withStyles(styles)(CartStepView);
