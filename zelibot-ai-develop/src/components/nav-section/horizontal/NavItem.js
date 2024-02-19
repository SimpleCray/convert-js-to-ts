import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { Box, Tooltip, ListItemText, Link } from '@mui/material';
// locales
import { useLocales } from '../../../locales';
// auth
import RoleBasedGuard from '../../../feature/auth/context/RoleBasedGuard';
//
import { Iconify } from '@zelibot/zeligate-ui';
import { StyledItem, StyledIcon } from './styles';
import RouterLink from 'src/components/router-link';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const NavItem = forwardRef(({ item, depth, open, active, isExternalLink, ...other }, ref) => {
	const { translate } = useLocales();

	const { title, path, icon, info, children, disabled, caption, roles } = item;

	const subItem = depth !== 1;

	const renderContent = (
		<StyledItem ref={ref} open={open} depth={depth} active={active} disabled={disabled} {...other}>
			{icon && <StyledIcon>{icon}</StyledIcon>}

			<ListItemText
				primary={`${translate(title)}`}
				primaryTypographyProps={{
					noWrap: true,
					component: 'span',
					variant: active ? 'subtitle2' : 'body2',
				}}
			/>

			{info && (
				<Box component='span' sx={{ ml: 1, lineHeight: 0 }}>
					{info}
				</Box>
			)}

			{caption && (
				<Tooltip title={`${translate(caption)}`} arrow>
					<Box component='span' sx={{ ml: 0.5, lineHeight: 0 }}>
						<Iconify icon='eva:info-outline' width={16} />
					</Box>
				</Tooltip>
			)}

			{!!children && <Iconify icon={subItem ? 'eva:chevron-right-fill' : 'eva:chevron-down-fill'} width={16} sx={{ ml: 0.5, flexShrink: 0 }} />}
		</StyledItem>
	);

	const renderItem = () => {
		// ExternalLink
		if (isExternalLink)
			return (
				<Link href={path} target='_blank' rel='noopener' underline='none'>
					{renderContent}
				</Link>
			);

		// Default
		return (
			<Link component={RouterLink} href={path} underline='none'>
				{renderContent}
			</Link>
		);
	};

	return <RoleBasedGuard roles={roles}> {renderItem()} </RoleBasedGuard>;
});

NavItem.propTypes = {
	open: PropTypes.bool,
	active: PropTypes.bool,
	item: PropTypes.object,
	depth: PropTypes.number,
	isExternalLink: PropTypes.any,
};

export default NavItem;
