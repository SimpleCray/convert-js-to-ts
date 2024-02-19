import { styled } from '@mui/material/styles';
import { Box, Card, CardActions, IconButton } from '@mui/material';
import { Swiper } from 'swiper/react';

export const StyledAIAvatarSelectorWrapper = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	height: '100%',
	'& .MuiAvatar-root': {
		width: '100%',
		height: '100%',
		maxWidth: 250,
		margin: 'auto',
	},
	overflowY: 'auto',
	'@media (max-height: 960px)': {
		alignItems: 'flex-start',
	},
}));

export const StyledSkillsTextWrapper = styled(Box)(({ theme }) => ({
	flexGrow: 1,
}));

export const StyledSkillsWrapper = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	'& .MuiChip-root': {
		width: 'max-content',
		display: 'flex',
	},
	[theme.breakpoints.up('md')]: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	[theme.breakpoints.down('md')]: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
}));

export const StyledCardActions = styled(CardActions)(({ theme }) => ({
	paddingLeft: theme.spacing(2),
	paddingRight: theme.spacing(2),
	paddingBottom: theme.spacing(1),
}));

export const StyledSwiper = styled(Swiper)(({ theme }) => ({
	width: '100%',
	'& .swiper-slide': {
		width: 'auto',
	},
}));

export const StyledWorkerDetails = styled(Card)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	height: '100%',
	alignItems: 'center',
	padding: theme.spacing(4),
	gap: theme.spacing(4),
	borderRadius: Number(theme.shape.borderRadius) * 2,
	[theme.breakpoints.down('md')]: {
		gap: theme.spacing(2),
		padding: theme.spacing(2),
		paddingLeft: 0,
		paddingRight: 0,
	},
}));

export const ExpandMoreButton = styled((props) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expand }) => ({
	transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	}),
}));
