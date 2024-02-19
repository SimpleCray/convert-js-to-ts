import {useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {useForm} from "react-hook-form";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

import Layout from "../../website/layout";
import {APP_NAME} from "../../../config-global";
import {WEBSITE_REGEX} from "../../../constants";
import {getAssistants, getUserType, MAIN_SECTION_COMPONENT_ID} from "../constants";
import {default as LandingSection} from "../components/LandingSection";
import {default as MainSection} from "../components/MainSection";

export default function Onboarding() {
	const [assistants, setAssistants] = useState([]);
	const [selectedAssistant, setSelectedAssistant] = useState(null);
	const [isLandingSectionActive, setLandingSectionActive] = useState(true);
	const [userType, setUserType] = useState('hr');

	const UpdateUserSchema = Yup.object().shape({
		websiteUrl: Yup.string().matches(
			WEBSITE_REGEX,
			{
				message: 'Your company website must be a valid URL',
				excludeEmptyString: true,
			},
		),
	});

	const defaultValues = {
		websiteUrl: '',
		name: '',
		phone: '',
		country: '',
		state: '',
		city: '',
		streetAddress: '',
		zipcode: '',
	};

	const methods = useForm({
		resolver: yupResolver(UpdateUserSchema),
		defaultValues,
	});

	const handleScroll = () => {
		const position = window.pageYOffset;
		setLandingSectionActive(position < document.getElementById(MAIN_SECTION_COMPONENT_ID)?.offsetTop);
	};

	useEffect(() => {
		getUserType().then(async (response) => {
			const userKey = (!response.data[0].user_type || response.data[0].user_type === 'HR_USER') ? 'ONBOARDING_AVATAR_SELECTOR' : 'CANDIDATE_ONBOARDING_AVATAR_SELECTOR'

			return getAssistants(userKey);
		}).then((response) => {
			console.debug(response);
			setAssistants(response?.data?.avatars);
			setSelectedAssistant(response?.data?.avatars[0]);

			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);

			const userType = urlParams.get('userType')
			setUserType(userType);
		}).catch((error) => {
			console.error('error: ', error);
		});

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<Layout headerStyle={'light'} headerGap={false} mobileHeaderGap={false} bgGradient={2} offNavBar>
			<Helmet>
				<title>Onboarding | {APP_NAME}</title>
			</Helmet>

			<LandingSection isActive={isLandingSectionActive} assistants={assistants} setSelectedAssistant={setSelectedAssistant}/>

			<MainSection isActive={!isLandingSectionActive} methods={methods} selectedAssistant={selectedAssistant} />

		</Layout>
	);
}
