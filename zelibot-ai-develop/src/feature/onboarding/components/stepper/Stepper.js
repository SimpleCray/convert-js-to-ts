import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { StyledStepper } from './StepperStyles';
import useResponsive from '../../../../hooks/useResponsive';

export default function AIOnboardingStepper({ steps, currentStep }) {
	const isDesktop = useResponsive('up', 'md');
	const [activeStep, setActiveStep] = useState(currentStep);
	const [skipped, setSkipped] = useState(new Set());

	useEffect(() => {
		handleNext();
	}, [currentStep]);

	const isStepOptional = (step) => {
		// return step === 2;
	};

	const isStepSkipped = (step) => {
		return skipped.has(step);
	};

	const handleNext = () => {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped(newSkipped);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<StyledStepper activeStep={activeStep}>
				{steps.map((label, index) => {
					const stepProps = {};
					const labelProps = {};
					if (isStepOptional(index)) {
						labelProps.optional = <Typography variant='caption'>Optional</Typography>;
					}
					if (isStepSkipped(index)) {
						stepProps.completed = false;
					}
					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{isDesktop && label}</StepLabel>
						</Step>
					);
				})}
			</StyledStepper>
		</Box>
	);
}
