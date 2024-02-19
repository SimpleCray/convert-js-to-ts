// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/context/useAuthContext';
// components
import { CustomAvatar } from '../../../../components/custom-avatar';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(2, 2.5),
	borderRadius: Number(theme.shape.borderRadius) * 1.5,
	backgroundColor: alpha(theme.palette.grey[500], 0.12),
	transition: theme.transitions.create('opacity', {
		duration: theme.transitions.duration.shorter,
	}),
}));

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function NavAccount() {
	const { user } = useAuthContext();

	// Get first string of email
	const defaultUserAvatar = !user?.displayName || user?.displayName?.toLowerCase() === 'go to profile' ? user?.email?.split('@')[0] : user?.displayName;

	return (
		<Link underline='none' color='inherit'>
			<StyledRoot>
				<CustomAvatar src={user?.photoURL} alt={defaultUserAvatar} name={defaultUserAvatar} />
				<Box sx={{ ml: 2, minWidth: 0 }}>
					{user?.displayName?.toLowerCase() === 'go to profile' || user?.displayName === undefined ? (
						<Typography variant='subtitle2' noWrap>
							{user?.email}
						</Typography>
					) : (
						<Typography variant='subtitle2' noWrap>
							{user?.displayName}
						</Typography>
					)}
					<Typography variant='body2' noWrap sx={{ color: 'text.secondary' }}>
						{user?.pricingModelTitle}
					</Typography>
				</Box>
			</StyledRoot>
		</Link>
	);
}
