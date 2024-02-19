import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';
// utils
import { bgGradient } from '../../../../utils/cssStyles';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
	height: '100%',
	width: '100%',
	display: 'flex',
	overflow: 'hidden',
	position: 'relative',
	color: theme.palette.common.white,
	borderRadius: Number(theme.shape.borderRadius) * 2,
	flexDirection: 'column',
	[theme.breakpoints.up('sm')]: {
		flexDirection: 'row',
	},
}));

const StyledBg = styled('div')(({ theme }) => ({
	top: 0,
	left: 0,
	zIndex: -1,
	width: '100%',
	height: '100%',
	position: 'absolute',
	backgroundColor: theme.palette.common.white,
	'&:before': {
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		position: 'absolute',
		zIndex: -2,
		content: '""',
		opacity: 0.2,
		...bgGradient({
			direction: '135deg',
			startColor: theme.palette.secondary.main,
			endColor: theme.palette.primary.main,
		}),
	},
}));

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

AppWelcome.propTypes = {
	img: PropTypes.node,
	action: PropTypes.node,
	title: PropTypes.string,
	description: PropTypes.string,
};

export default function AppWelcome({ title, description, action, img, ...other }) {
	return (
		<StyledRoot {...other}>
			<Stack
				flexGrow={1}
				justifyContent='center'
				alignItems={{ xs: 'center', sm: 'flex-start' }}
				sx={{
					pl: 5,
					py: { xs: 5, sm: 5 },
					pr: { xs: 5, sm: 0 },
					textAlign: { xs: 'center', sm: 'left' },
					background: 'linear-gradient(119deg, #C20BBD 0%, #254BF2 100%)',
				}}
			>
				<Typography paragraph variant='h4' sx={{ whiteSpace: 'pre-line' }}>
					{title}
				</Typography>

				<Typography
					variant='body2'
					sx={{
						opacity: 0.8,
						mb: { xs: 3, xl: 5 },
					}}
				>
					{description}
				</Typography>

				{action && action}
			</Stack>

			{img && img}

			<StyledBg />
		</StyledRoot>
	);
}
