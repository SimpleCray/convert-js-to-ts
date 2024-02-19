import { Helmet } from 'react-helmet-async';
import { Typography, Grid } from '@mui/material';
import { Logo } from '@zelibot/zeligate-ui';
import { StyledHeader, StyledOnboarding, StyledWorkerDetailsWrapper, StyledBackgroundStyles } from './OnboardingLayoutStyles';
import { APP_NAME } from '../../../config-global';
import { AIOnboardingStepper } from '../components';
import { useEffect } from 'react';

export default function OnboardingLayout({ title, children, activeStep, steps, noLogo = false }) {
	useEffect(() => {
		const avatar = document.getElementById('desktop-avatar');
		if (!avatar) {
			return;
		}

		avatar.style.height = avatar.offsetWidth + 'px';
		const resizeListener = () => {
			avatar.style.height = avatar.offsetWidth + 'px';
		};
		window.addEventListener('resize', resizeListener);
		return () => window.removeEventListener('resize', resizeListener);
	}, []);
	return (
		<>
			<StyledBackgroundStyles />
			<Helmet>
				<title>Onboarding | {APP_NAME}</title>
			</Helmet>
			<StyledOnboarding>
				{noLogo ? null : (
					<StyledHeader>
						<Logo type={'full'} className={'logoFull'} />
					</StyledHeader>
				)}
				<Grid container>
					<Grid item xs={12} md={10} mx={'auto'} mt={3}>
						<AIOnboardingStepper currentStep={activeStep} steps={steps} />
					</Grid>
				</Grid>
				<Typography variant='h2' component={'h1'} align='center' sx={{ color: 'common.white', letterSpacing: { xs: 'inherit', md: '-0.48px' }, fontSize: { xs: 32, md: 48 }, fontWeight: 400 }}>
					{title}
				</Typography>
				<StyledWorkerDetailsWrapper container>{children}</StyledWorkerDetailsWrapper>
			</StyledOnboarding>
		</>
	);
}
