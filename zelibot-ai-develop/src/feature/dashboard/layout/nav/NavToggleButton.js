import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// utils
import { bgBlur } from '../../../../utils/cssStyles';
// config
import { NAV } from '../../../../config-global';
// components
import { Iconify } from '@zelibot/zeligate-ui';
import { useSettingsContext } from '@zelibot/zeligate-ui';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavToggleButton.propTypes = {
	sx: PropTypes.object,
};

export default function NavToggleButton({ sx, ...other }) {
	const theme = useTheme();

	const { themeLayout, onToggleLayout } = useSettingsContext();

	const isDesktop = useResponsive('up', 'lg');

	if (!isDesktop) {
		return null;
	}

	return (
		<IconButton
			size='small'
			onClick={onToggleLayout}
			sx={{
				p: 0.5,
				top: 32,
				position: 'fixed',
				left: NAV.W_DASHBOARD - 12,
				zIndex: theme.zIndex.appBar + 1,
				border: `dashed 1px ${theme.palette.divider}`,
				...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
				'&:hover': {
					bgcolor: 'background.default',
				},
				...sx,
			}}
			{...other}
		>
			<Iconify width={16} icon={themeLayout === 'vertical' ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'} />
		</IconButton>
	);
}
