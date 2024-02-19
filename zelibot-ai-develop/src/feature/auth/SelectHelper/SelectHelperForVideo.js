import { Button, Typography, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import useResponsive from '../../../hooks/useResponsive';
import { getAssistants, postAssistantId, getUserType } from '../../onboarding/constants';
import 'swiper/css';
import { SplashScreen } from '../../../components/loading-screen';
import { useRouter } from '../../../hooks/useRouter';
import AlertDialog from '../../../components/dialog/Dialog';
import Layout from '../../website/layout/Layout';
import AvatarCarousel from '../../../components/avatar-carousel/AvatarCarousel';
import { Text18Weight400, Text20, Text32Weight700 } from '../../../components/common/TypographyStyled';
import OnboardingLayout from '../../onboarding/layout/OnboardingLayout';
import { NotSupportMobile } from '../../../components/not-support-mobile';

export default function SelectHelperForVideo({}) {
	const isDesktop = useResponsive('up', 'md');
	const [loading, setLoading] = useState(true);
	const [assistants, setAssistants] = useState([]);
	const [selectedAssistant, setSelectedAssistant] = useState(null);
	const [openTermsDialog, setOpenTermsDialog] = useState(false);

	const { push } = useRouter();
	const navigateToVideoMessaging = () => push('/dashboard/hr-helper/video-messaging');

	const termsTemplate = () => {
		return (
			<>
				<Typography variant='body1' component={'span'}>
					By clicking continue you confirm the following:
					<ul>
						<li>I have working rights</li>
						<li>I am happy to be recorded</li>
						<li>I am happy to be interviewed by an Avatar</li>
					</ul>
				</Typography>
			</>
		);
	};

	useEffect(() => {
		getUserType()
			.then(async (response) => {
				// console.log(response.data[0].user_type)

				const userKey = !response.data[0].user_type || response.data[0].user_type === 'HR_USER' ? 'ONBOARDING_AVATAR_SELECTOR' : 'CANDIDATE_ONBOARDING_AVATAR_SELECTOR';
				handleGetAssistants(userKey);
			})
			.catch((error) => {
				console.error('error: ', error);
			});
	}, []);

	const handleGetAssistants = (userKey) => {
		getAssistants(userKey)
			.then((response) => {
				setAssistants(response?.data?.avatars);
				setSelectedAssistant(response?.data?.avatars[0]);
				setLoading(false);
			})
			.catch((error) => {
				console.error('error: ', error);
			});
	};

	const onComplete = () => {
		navigateToVideoMessaging();
		return;
	};

	const handleTermsAndConditionsConfirm = () => {
		setOpenTermsDialog(true);
	};

	const handleButtonOnClick = async () => {
		setLoading(true);
		try {
			await postAssistantId(selectedAssistant.id); // TODO: Handle errors
			return onComplete();
		} catch (err) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (!isDesktop) {
		return <NotSupportMobile title='This video interview is not optimised for mobile yet.' subTitle='Please respond to the email on your computer to use this feature.' />;
	}

	return loading ? (
		<SplashScreen />
	) : (
		<OnboardingLayout noLogo title={'Select your preferred Zeli to interact with'} activeStep={3} steps={[]}>
			<Layout noMarginTopContent noFooter offNavBar headerStyle={'light'} headerGap={false} bgGradient={2}>
				<Stack width='100%' alignItems='center'>
					<Stack alignItems='center' mt={{ xs: 0, md: 4 }} sx={{ width: 'min(100%, 958px)' }} gap={0}>
						{assistants?.length > 1 && (
							<AvatarCarousel assistants={assistants} setSelectedAssistant={setSelectedAssistant} showNavBtn={isDesktop} displaySize={isDesktop ? 5 : 3} isDesktop={isDesktop} isActive={true} showSoundUp>
								<Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 1, md: 4 }} justifyContent='center' alignItems={{ xs: 'center', md: 'flex-end' }} sx={{ '& > p': { lineHeight: 1, color: '#fff' } }}>
									<Text32Weight700 xs={{ fontSize: { xs: 28, md: 'inherit' } }}>{selectedAssistant?.avatarName}</Text32Weight700>
									<Text20 sx={{ textAlign: { xs: 'center', md: 'inherit' }, fontSize: { xs: 16, md: 'inherit' } }}>{selectedAssistant?.avatarRole}</Text20>
								</Stack>
							</AvatarCarousel>
						)}
						<Text18Weight400 sx={{ mt: { xs: 0, md: 1 }, mb: { xs: 4, md: 7.25 }, color: '#fff', textAlign: 'center', fontSize: { xs: 16, md: 'inherit' } }}>{selectedAssistant?.dialogueText}</Text18Weight400>
						<Button variant='outlined' sx={{ color: '#fff', backgroundColor: 'rgba(23, 0, 88, 1)', fontSize: { xs: 14, md: 18 }, '&.MuiButton-root': { textWrap: 'wrap' } }} onClick={handleTermsAndConditionsConfirm}>
							<span style={{ textTransform: 'none' }}>Continue to interview</span>
						</Button>
					</Stack>
				</Stack>
				<AlertDialog
					isOpen={openTermsDialog}
					onClose={() => {
						setOpenTermsDialog(false);
					}}
					title=''
					content={termsTemplate()}
					btnLabel='Cancel'
					submitBtnLabel={'Confirm'}
					onSubmit={handleButtonOnClick}
				/>
			</Layout>
		</OnboardingLayout>
	);
}
