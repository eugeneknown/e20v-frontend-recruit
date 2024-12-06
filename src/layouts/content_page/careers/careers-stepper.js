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
    stepLabel: "Reference",
    stepDescription: <MDTypography variant='button'>Add your reference</MDTypography>,
  },
];

export default function CareersStepper({activeStep, orientation, position}) {

  return (
    <MDBox sx={{ maxWidth: 400 }} position={position} m={5}>
      <Stepper 
      steps={steps} 
      currentStepIndex={activeStep} 
      orientation={orientation}
      />
    </MDBox>
  );
}