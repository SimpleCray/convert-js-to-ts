import { styled, alpha } from '@mui/material/styles';
import { ListItemButton } from '@mui/material';
import { NAV } from '../../../../../config-global';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export const ListItem = styled(ListItemButton, {
	shouldForwardProp: (prop) => prop !== 'active',
})(({ active, theme }) => ({
	...theme.typography.body2,
	color: theme.palette.text.secondary,
	height: NAV.H_DASHBOARD_ITEM,
	// Active
	...(active && {
		color: theme.palette.primary.main,
		...theme.typography.subtitle2,
		backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
	}),
}));
