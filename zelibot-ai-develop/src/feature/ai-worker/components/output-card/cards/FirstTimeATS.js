import LooksOneRoundedIcon from '@mui/icons-material/LooksOneRounded';
import LooksTwoRoundedIcon from '@mui/icons-material/LooksTwoRounded';
import Looks3RoundedIcon from '@mui/icons-material/Looks3Rounded';
import Looks4RoundedIcon from '@mui/icons-material/Looks4Rounded';
import Looks5RoundedIcon from '@mui/icons-material/Looks5Rounded';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import OutputCard from '../OutputCard';
import PromptCard from '../../prompt-card';
import { StyledOutputPrompts } from '../../../layout/AIWorkerLayoutStyles';
import propTypes from 'prop-types';
import { useAIWorkerContext } from '../../../AIWorker';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import { Text16PurpleMonsterWeight700 } from '../../../../../components/common/TypographyStyled';
import { PromptFirstTimeIconType, PromptIconType } from '../../prompt-card/PromptCard';

export default function FirstTimeATSOutputCard({ body, outputCardAction, clickRequestAction, prompts, setIsPromptsOpen, ...props }) {
	const { rawLeftPrompts } = useAIWorkerContext();
	if (!rawLeftPrompts?.length) {
		return null;
	}
	const handleAction = (action, title) => {
		// console.log('Action in FirstTimeATS.js ', action, title);
		if (action) {
			outputCardAction(action, title);
			setIsPromptsOpen(false);
		}
	};

	return (
		<Stack flexDirection={'column'} p={3} borderRadius={1} gap={4} sx={{backgroundColor: 'white', width: '90%', maxWidth: '672px'}}>
			<Typography sx={{ fontWeight: '400', fontSize: '28px', color: '#3B0099', lineHeight: '36.4px' }}>Unleash the magic of efficiency and reclaim hours from your workday.</Typography>
			<StyledOutputPrompts>
				<Grid container spacing={2}>
					{rawLeftPrompts?.map(({ action, title, icon }, index) => {
						const [itemAction] = action;
						return (
							<Grid item md={6} lg={3} key={`ATSprompt-${index}`}>
								<Stack gap={1} alignItems='center'>
									<IconButton onClick={() => handleAction(action, title)} sx={{ width: 96, height: 96, bgcolor: '#E3C7F9' }}>
										{/* <PromptIconType variant={icon} style={{ fontSize: 40, color: '#6E30C1' }} /> */}
										<PromptFirstTimeIconType action={itemAction} style={{ fontSize: 40, color: '#6E30C1' }} />
										{/* <UploadFileIcon className={'MuiChip-icon'} style={{ fontSize: 44, color: '#6E30C1' }} /> */}
									</IconButton>
									<Typography sx={{ textAlign: 'center', fontWeight: 'bold', lineHeight: '20.8px', color: '#3B0099', fontSize: '16px' }}>{title}</Typography>
								</Stack>
							</Grid>
						);
					})}
				</Grid>
			</StyledOutputPrompts>
		</Stack>
	);
	// OLD UI elements
	// if (!prompts) {
	// 	return null;
	// }
	// return prompts.map((prompt, index) => {
	// 	props.title = prompt.title;
	// 	const nestedPrompts = prompt.prompts;

	// 	return (
	// 		<OutputCard showActions={false} {...props} isATSCard fixedWidth={54} key={`ATScard-${index}`} titleIcon={<CardIconType variant={index + 1} />}>
	// 			<StyledOutputPrompts>
	// 				{nestedPrompts &&
	// 					nestedPrompts.length &&
	// 					nestedPrompts.map((nestedPrompt, index) => {
	// 						const [action] = nestedPrompt.action;
	// 						return <PromptCard key={`ATSprompt-${index}`} title={nestedPrompt.title} icon={nestedPrompt.icon} action={action} setAction={outputCardAction} setIsPromptsOpen={setIsPromptsOpen} outlined={true} />;
	// 					})}
	// 			</StyledOutputPrompts>
	// 		</OutputCard>
	// 	);
	// });
}

CardIconType.propTypes = {
	variant: propTypes.number,
};

function CardIconType({ variant }) {
	switch (variant) {
		case 1:
			return <LooksOneRoundedIcon />;
		case 2:
			return <LooksTwoRoundedIcon />;
		case 3:
			return <Looks3RoundedIcon />;
		case 4:
			return <Looks4RoundedIcon />;
		case 5:
			return <Looks5RoundedIcon />;
		default:
			return <WorkOutlineIcon />;
	}
}
