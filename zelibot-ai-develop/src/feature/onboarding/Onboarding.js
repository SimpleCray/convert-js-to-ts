import { GatherCompanyDetails, ChooseHelper, UploadDocuments } from './components';
import OnboardingLayout from './layout';
import { useEffect, useState } from 'react';
import { useRouter } from '../../hooks/useRouter';
import { PATH_DASHBOARD } from '../../routes/paths';
import { getAssistants, getUserType } from './constants';
import SplashScreen from '../../components/loading-screen';

export default function Onboarding({}) {
	const { push } = useRouter();
	const [activeStep, setActiveStep] = useState(1);
	const [selectedAssistant, setSelectedAssistant] = useState(null);
	const [assistants, setAssistants] = useState([]);
	const [userType, setUserType] = useState('hr');

	const goToNextPage = () => setActiveStep(activeStep + 1);
	const navigateToWorkspace = () => push(PATH_DASHBOARD.hrHelper.root);
	const navigateToVideoMessaging = () => push(PATH_DASHBOARD.videoMessaging.root);


	useEffect(() => {

		getUserType().then(async (response) => {
			// console.log(response.data[0].user_type)
			const userKey = (!response.data[0].user_type || response.data[0].user_type === 'HR_USER') ? 'ONBOARDING_AVATAR_SELECTOR' : 'CANDIDATE_ONBOARDING_AVATAR_SELECTOR'

			handleGetAssistants(userKey)
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
		})
		.catch((error) => {
			console.error('error: ', error);
		});

		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		const userType = urlParams.get('userType')
		setUserType(userType)
	}

	const steps = {
		'Create Account': {
			title: ' ',
			Content: () => <></>,
		},
		'Company Details': {
			title: ' ',
			Content: () => <GatherCompanyDetails onComplete={goToNextPage} />,
		},
		'Select Helper': {
			title: 'Which Helper would you like to work with?',
			Content: () => <ChooseHelper selectedAssistant={selectedAssistant} setSelectedAssistant={setSelectedAssistant} onComplete={goToNextPage} assistants={assistants} />,
		},
		'Upload Documents': {
			title: 'Share some relevant files with Zeli',
			Content: () => <UploadDocuments selectedAssistant={selectedAssistant} onComplete={navigateToWorkspace} />,
		},
	};

	const { Content, title } = Object.values(steps)[activeStep];

	return (
		<>
			{userType !== 'Candidate' ? <>
			{assistants ? (
				<OnboardingLayout title={title} activeStep={activeStep - 1} steps={Object.keys(steps)}>
					<Content />
				</OnboardingLayout>
			) : (
				<SplashScreen />
			)}</> : <ChooseHelper selectedAssistant={selectedAssistant} setSelectedAssistant={setSelectedAssistant} onComplete={navigateToVideoMessaging} assistants={assistants} />}
		</>
	);
}
