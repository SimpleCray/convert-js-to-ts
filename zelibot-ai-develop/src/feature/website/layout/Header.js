// @mui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, Button, Stack, Toolbar } from '@mui/material';
import { Logo } from '@zelibot/zeligate-ui';
// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// config
import { HEADER } from '../../../config-global';
// routes
import { PATH_AUTH } from '../../../routes/paths';
import { NewNavMobile } from './nav/mobile';
import navConfig from './nav/config-navigation';
import NavDesktop from './nav/desktop';
import ZeligateFull from '../../../assets/icons/zeligateFull';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
	[theme.breakpoints.down('md')]: {
		minHeight: HEADER.H_MOBILE,
	},
}));

const NavContainer = styled(Stack)(({ theme }) => ({
	width: '100%',
	justifyContent: 'space-between',
	[theme.breakpoints.down('md')]: {
		padding: theme.spacing(2, 2, 0),
	},
	[theme.breakpoints.up('md')]: {
		padding: theme.spacing(4, 8, 0),
	},
}));

const StyledHeader = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: 4,
	'& .logoFull': {
		[theme.breakpoints.up('md')]: {
			height: 48,
		},
	},
}));

const StyledNavDesktop = styled(NavDesktop)(({ theme }) => ({
	'& div.MuiButtonBase-root.MuiListItemButton-root': {
		fontSize: 16,
		padding: theme.spacing(1.25),
	},
}));

const StyledButtonWrapper = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(4),
	'& .MuiButton-root': {
		textWrap: 'nowrap',
		textTransform: 'none',
		'&.MuiButton-outlined': {
			borderColor: 'transparent',
			'&:before': {
				content: '""',
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				borderRadius: 'inherit',
				opacity: 0.5,
				border: `1px solid`,
			},
		},
	},
	'& .MuiButtonBase-root.MuiIconButton-root:hover': {
		backgroundColor: `${theme.palette.common.white}33`,
	},
	[theme.breakpoints.down('md')]: {
		gap: theme.spacing(1.5),
	},
}));

export const HEADER_STYLE = {
	dark: 'dark',
	light: 'light',
};

export default function Header({ style = HEADER_STYLE.light, offNavBar = false }) {
	const theme = useTheme();
	const isDesktop = useResponsive('up', 'md');
	const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

	return (
		<AppBar id='header' color='transparent' sx={{ boxShadow: 0 }}>
			<StyledToolbar
				disableGutters
				sx={{
					transition: theme.transitions.create(['height', 'background-color'], {
						easing: theme.transitions.easing.easeInOut,
						duration: theme.transitions.duration.shorter,
					}),
					...(isOffset && {
						...bgBlur({ color: style === HEADER_STYLE.dark ? theme.palette.background.default : theme.palette.text.primary }),
					}),
				}}
			>
				<NavContainer direction='row' sx={{ ...(isOffset && { paddingTop: '0 !important' }) }}>
					<StyledHeader sx={{ width: isDesktop ? 'auto' : '110px' }}>
						<Link href='/' underline='none'>
							<ZeligateFull />
						</Link>
					</StyledHeader>
					{!offNavBar && (
						<>
							{isDesktop && <StyledNavDesktop isOffset={isOffset} data={navConfig} style={style} />}
							<StyledButtonWrapper sx={{ color: style === HEADER_STYLE.dark ? '#955AF4' : '#fff' }}>
								<Button
									variant='outlined'
									sx={{
										backgroundColor: '#170058',
										fontSize: isDesktop ? 14.4 : 11.2,
									}}
									color={'inherit'}
									href={`/auth/register`}
								>
									Start free trial
								</Button>
								{isDesktop && (
									<Button variant='outlined' href={PATH_AUTH.login}>
										Login
									</Button>
								)}
								{!isDesktop && <NewNavMobile isOffset={isOffset} data={navConfig} style={style} />}
							</StyledButtonWrapper>
						</>
					)}
				</NavContainer>
			</StyledToolbar>
		</AppBar>
	);
}
