import * as React from 'react';
import MDBox from 'components/MDBox';
import Stepper from '@keyvaluesystems/react-stepper';
import MDTypography from 'components/MDTypography';

const steps = [
  {
    stepLabel: "Personal Information",
    stepDescription: <MDTypography variant='button'>Add your Personal Informations details</MDTypography>,
  },
  {
    stepLabel: "Career Questions",
    stepDescription: <MDTypography variant='button'>Answer the following questions</MDTypography>,
  },
  {
    stepLabel: "Referrence",
    stepDescription: <MDTypography variant='button'>Add your referrence</MDTypography>,
  },
];

export default function CareersStepper({activeStep}) {

  return (
    <MDBox sx={{ maxWidth: 400 }} position='fixed' m={5}>
      <Stepper 
      steps={steps} 
      currentStepIndex={activeStep} 
      orientation="vertical" 
      />
    </MDBox>
  );
}