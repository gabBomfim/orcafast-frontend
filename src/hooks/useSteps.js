import { useState } from 'react';

export const useSteps = ({ initialStep, count = 0 }) => {
  const [activeStep, setActiveStep] = useState(initialStep);

  const goToNext = () => {
    if (count >= activeStep + 1) {
      setActiveStep((step) => step + 1);
    }
  };

  const goToPrevious = () => {
    if (activeStep - 1 >= 0) {
      setActiveStep((step) => step - 1);
    }
  };

  return {
    activeStep,
    goToNext,
    goToPrevious
  };
};
