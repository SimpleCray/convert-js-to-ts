import {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Stack, Typography} from '@mui/material';
import {LoadingButton} from "@mui/lab";
import {useSnackbar} from 'notistack';
import {getAssistants, getUserType, postAssistantId} from 'src/feature/onboarding/constants';
import {getSelectedAssistantId} from 'src/feature/ai-worker/constants';
import AvatarCarousel from "../../../../../components/avatar-carousel";
import {StyledButton, StyledLoadingButton, StyledTypography} from "./AccountStyles";

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const StyledAvatarCarousel = styled(AvatarCarousel)(({ theme }) => ({
	padding: 0,
	'& button.MuiButtonBase-root': {
		backgroundColor: `${theme.palette.primary.lighter}66`,
		'& > svg.MuiSvgIcon-root': {
			color: theme.palette.primary.main,
		},
		'&:hover': {
			backgroundColor: theme.palette.primary.lighter,
			filter: 'none',
		},
	},
}));

export default function AccountChangeAssistant({ setStateShouldUpdate, onClose }) {
	const { enqueueSnackbar } = useSnackbar();

	const [isLoadingData, setLoadingData] = useState(true);
	const [isSubmitting, setSubmitting] = useState(false);
	const [originalAssistantIndex, setOriginalAssistantIndex] = useState(0);
    const [selectedAssistant, setSelectedAssistant] = useState(null);
    const [assistants, setAssistants] = useState([]);

    useEffect(() => {
		Promise.all([
			getUserType().then(async (response) => {
				const userKey = (!response.data[0].user_type || response.data[0].user_type === 'HR_USER') ? 'ONBOARDING_AVATAR_SELECTOR' : 'CANDIDATE_ONBOARDING_AVATAR_SELECTOR'

				return getAssistants(userKey);
			}),
			getSelectedAssistantId(),
		]).then(([avatarResp, userResp]) => {
			const foundIndex = avatarResp?.data?.avatars.findIndex(({id}) => id === userResp?.data[0]?.assistant_id);
			setAssistants(avatarResp?.data?.avatars);
			if (foundIndex && foundIndex!== -1) {
				setSelectedAssistant(avatarResp?.data?.avatars[foundIndex]);
				setOriginalAssistantIndex(foundIndex);
			}
		}).catch((err) => {
			console.error('failed to fetch data:', err);
		}).then(() => setLoadingData(false));
	}, []);

	const onSave = () => {
		if (isLoadingData || assistants[originalAssistantIndex]?.id === selectedAssistant?.id) {
			return;
		}

		setSubmitting(true);
		postAssistantId(selectedAssistant.id).then(() => {
			setStateShouldUpdate(true);
			enqueueSnackbar('Zeli selected!');
		}).catch((err) => {
			console.error('failed to update avatar:', err);
			enqueueSnackbar('Failed to update avatar.', { variant: 'error' });
		}).then(() => {
			setSubmitting(false);
			onClose();
		});
	};

	return (
		<Stack gap={5}>
			<StyledTypography variant="h1">
				Select your Zeli
			</StyledTypography>
			{assistants?.length > 1 &&
				<StyledAvatarCarousel
					beginningIndex={originalAssistantIndex}
					assistants={assistants}
					setSelectedAssistant={setSelectedAssistant}
					showNavBtn
					isDesktop
					isActive
					scale={0.8125}
				/>
			}
			<StyledTypography variant="subtitle1">
				Hi there! I am Zeli. I can help you advertise jobs, analyse and compare resumes, set up interviews
				with the most promising candidates, write employment contracts, and much more! Choose an avatar to
				work with.
			</StyledTypography>
			<Stack gap={3} direction='row' justifyContent='flex-end'>
				<StyledButton variant='outlined' color='primary' onClick={onClose}>
					Cancel
				</StyledButton>
				<StyledLoadingButton
					variant='contained'
					color='primary'
					loading={isSubmitting}
					disabled={isLoadingData || (assistants[originalAssistantIndex]?.id === selectedAssistant?.id)}
					onClick={onSave}
				>
					Save
				</StyledLoadingButton>
			</Stack>
		</Stack>
	);
}
