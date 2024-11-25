import * as React from 'react';
import MDBox from 'components/MDBox';
import Stepper from '@keyvaluesystems/react-stepper';
import MDTypography from 'components/MDTypography';

const steps = [
  {
    stepLabel: "Shipping address",
    stepDescription: "Add your delivery address",
  },
  {
    stepLabel: "Payment details",
    stepDescription: "Add your mode of payment",
  },
  {
    stepLabel: "Review your order",
    stepDescription: "Verify your order details",
  },
];

export default function CareersStepper(activeStep) {

  return (
    <MDBox sx={{ maxWidth: 400 }}>
      <Stepper 
      steps={steps} 
      currentStepIndex={activeStep} 
      orientation="vertical" 
      stepContent={(step) => (
        <MDTypography>{step.label}</MDTypography>
      )}
      />
    </MDBox>
  );
}