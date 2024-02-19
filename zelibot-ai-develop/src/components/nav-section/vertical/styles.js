// @mui
import { alpha, styled } from '@mui/material/styles';
import { ListItemIcon, ListSubheader, ListItemButton } from '@mui/material';
// config
import { ICON, NAV } from '../../../config-global';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export const StyledItem = styled(ListItemButton, {
	shouldForwardProp: (prop) => prop !== 'active' && prop !== 'caption',
})(({ active, disabled, depth, caption, theme }) => {
	const isLight = theme.palette.mode === 'light';

	const subItem = depth !== 1;

	const activeStyle = {
		color: '#072188',
		backgroundColor: 'transparent',
		// background: `linear-gradient(145deg, ${alpha(theme.palette.secondary.main, 0.2)} 0%, transparent 100%) ${alpha(theme.palette.primary.main, 0.2)}`,
		background: theme.palette.primary.lighter,
		...(!isLight && {
			color: theme.palette.primary.light,
		}),
	};

	const activeSubStyle = {
		color: theme.palette.text.primary,
		backgroundColor: 'transparent',
		background: 'transparent',
	};

	return {
		position: 'relative',
		textTransform: 'capitalize',
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1.5),
		marginBottom: 0,
		// color: theme.palette.text.secondary,
		color: theme.palette.primary.darker,
		// borderRadius: theme.shape.borderRadius,
		borderTopLeftRadius: theme.shape.borderRadius,
		borderTopRightRadius: theme.shape.borderRadius,
		height: NAV.H_DASHBOARD_ITEM,
		// Sub item
		...(subItem && {
			...(depth > 2 && {
				height: NAV.H_DASHBOARD_ITEM_SUB,
				paddingLeft: theme.spacing(depth),
			}),
			...(caption && {
				height: NAV.H_DASHBOARD_ITEM,
			}),
		}),
		// Active item
		...(active && {
			...activeStyle,
			'&:hover': {
				...activeStyle,
			},
		}),
		// Active sub item
		...(subItem &&
			active && {
				...activeSubStyle,
				'&:hover': {
					...activeSubStyle,
				},
			}),
		// Disabled
		...(disabled && {
			'&.Mui-disabled': {
				opacity: 0.64,
			},
		}),
	};
});

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export const StyledIcon = styled(ListItemIcon)(({depth, theme}) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: ICON.NAV_ITEM,
	height: ICON.NAV_ITEM,
	marginRight: depth > 2 ? 0 : theme.spacing(1.5),
}));

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export const StyledDotIcon = styled('span', {
	shouldForwardProp: (prop) => prop !== 'active',
})(({ active, theme }) => ({
	width: 4,
	height: 4,
	borderRadius: '50%',
	backgroundColor: theme.palette.text.disabled,
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shorter,
	}),
	...(active && {
		transform: 'scale(2)',
		backgroundColor: theme.palette.primary.dark,
	}),
}));

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export const StyledSubheader = styled(ListSubheader)(({ theme }) => ({
	...theme.typography.overline,
	fontSize: 11,
	paddingTop: theme.spacing(3),
	paddingBottom: theme.spacing(1),
	color: theme.palette.text.secondary,
}));
