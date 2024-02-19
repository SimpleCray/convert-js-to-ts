import { alpha, styled } from '@mui/material/styles';
import { Unstable_Popup as Popup } from '@mui/base';

export const StyledAIAvatar = styled('div')(({ theme, color, width, height, borderRadius, showBorder }) => ({
	display: 'flex',
	width: width,
	height: height,
	maxHeight: height,		// <-- needed to avoid distortion
	borderRadius: borderRadius,
    border: showBorder ? '4px solid white' : '0px',
    boxSizing: 'unset',
	overflow: 'hidden',
	position: 'relative',
	alignItems: 'center',
	justifyContent: 'center',

	'> span:nth-of-type(1)': {
		content: '""',
		position: 'absolute',
		width: '100%',
		height: '100%',
		borderRadius: borderRadius,
		border: `${theme.spacing(1)} solid ${color ? color : theme.palette.primary.main}`,
		animationDelay: '4s',
		animationDuration: '1s',
		animationIterationCount: 'infinite',
		animationTimingFunction: 'ease-in-out',

	},
}));

export const StyledAIAvatarImage = styled('img')(({ theme, borderRadius }) => ({
	width: '100%',
	height: '100%',
}));

export const StyledAIAvatarVideo = styled('video')(({ theme, borderRadius }) => ({
	width: '100%',
	height: '100%',
}));

