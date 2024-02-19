import Layout from './layout';
import { APP_NAME } from '../../config-global';
import { Helmet } from 'react-helmet-async';
import { Hero, Section } from './components';
import { Typography } from '@mui/material';
import OutlinedHeading from './components/outlined-heading';

export default function Features() {
	return (
		<Layout headerStyle={'light'} headerGap={false} mobileHeaderGap={false} bgGradient={2}>
			<Helmet>
				<title>Features - {APP_NAME}</title>
			</Helmet>
			<Hero image={'/assets/images/features-hero-bg.jpg'} title={`<span>Don’t just delegate it.</span><br />Zeligate it.`} />
			<Section image={'/assets/images/features-section-hours.jpg'} type={'image-left-alt'}>
				<OutlinedHeading heading={'<span>Unlimit</span> your hours.'} />
				<Typography
					variant='h4'
					sx={{
						fontWeight: '300',
						letterSpacing: 0,
						lineHeight: 1.6,
					}}
				>
					Your smart AI Helper will generate job listings, evaluate resumés and even call candidates to schedule interviews and automatically send calendar invites. Let Zeligate handle your time-consuming admin so you can focus on what’s meaningful.
				</Typography>
			</Section>
			<Section image={'/assets/images/features-section-potential.jpg'} type={'image-left-alt'}>
				<OutlinedHeading heading={'<span>Unlimit</span> your potential.'} />
				<Typography
					variant='h4'
					sx={{
						fontWeight: '300',
						letterSpacing: 0,
						lineHeight: 1.6,
					}}
				>
					Delegate tasks using text prompts and voice commands on the fly. Zeligate is engineered to learn from your work, ensuring your smart AI helper always meets your unique requirements and standards.
				</Typography>
			</Section>
			<Section image={'/assets/images/features-section-success.jpg'} type={'image-left-alt'}>
				<OutlinedHeading heading={'<span>Unlimit</span> your success.'} />
				<Typography
					variant='h4'
					sx={{
						fontWeight: '300',
						letterSpacing: 0,
						lineHeight: 1.6,
					}}
				>
					Unshackle yourself from mundane tasks and unlock more creativity and productivity in your day. So don’t just delegate - Zeligate and thrive.
				</Typography>
			</Section>
		</Layout>
	);
}
