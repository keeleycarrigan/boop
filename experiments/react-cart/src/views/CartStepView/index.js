import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Subscribe } from 'unstated';

import { Row } from '../../layout';
import {
    cartStateContainer,
} from '../../stores';
import PaymentShippingView from './shipping-payment';
import ReviewItemsView from './review';

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

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return <ReviewItemsView />;
    case 1:
      return <PaymentShippingView />;
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Uknown stepIndex';
  }
}

function CartStepView ({ classes }) {
  const steps = ['Review', 'Shipping +\nPayment', 'Confirmation'];

  return (
    <Subscribe to={[ cartStateContainer ]}>
      {({ state, goToNextStep, goToPreviousStep }) => (
        <Row>
          <Grid item xs={12}>
            <Stepper activeStep={state.activeStep} alternativeLabel>
              {steps.map(label => {
                return (
                  <Step key={label}>
                    <StepLabel className={classes.stepLabel}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Grid>
          <Grid item xs={12}>
            <div>
              <div className={classes.instructions}>{getStepContent(state.activeStep)}</div>
              <div className={classes.price}>
                <Typography component="h5" variant="h4">{state.totalTxt}</Typography>
              </div>
              <div>
                {/* Move buttons inside views. */}
                <Button
                  disabled={state.activeStep === 0}
                  onClick={goToPreviousStep}
                  className={classes.backButton}
                >
                  Back
                </Button>
                <Button variant={'contained'} color={'primary'} onClick={goToNextStep}>
                  {state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          </Grid>
        </Row>

      )}
    </Subscribe>
  );
}

export default withStyles(styles)(CartStepView);