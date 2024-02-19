import {Box, Grid, Link, Stack, Container, Typography, Divider, Button, TextField, styled} from '@mui/material';
import { Logo } from '@zelibot/zeligate-ui';
import { APP_NAME } from '../../../config-global';
import { PATH_PAGE } from '../../../routes/paths';
import { CTASection } from '../components';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const FooterSection = styled(Box)(({ theme }) => ({
	position: 'relative',
	backgroundImage: 'url(/assets/images/footer-bg.jpeg)',
	backgroundSize: 'cover',
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center',
	color: theme.palette.primary.main,
	'& > .MuiContainer-root': {
		maxWidth: 972,
		padding: 0,
	},
	'& .MuiDivider-root': {
		width: '100%',
		height: '2px',
		borderColor: 'transparent',
		backgroundImage: 'linear-gradient(35deg, rgba(59,0,153,1) 0%, rgba(150,192,224,1) 100%)',
	},
	[theme.breakpoints.up('md')]: {
		padding: theme.spacing(6, 0, 8),
	},
	[theme.breakpoints.down('md')]: {
		padding: theme.spacing(4),
	},
}))

const StyledTypography = styled(Typography)(({ theme }) => ({
	fontSize: 14,
	fontWeight: 'inherit',
	'& > *': {
		fontSize: 'inherit !important',
	},
	'& p': {
		margin: 0,
		'&.bold': {
			fontWeight: 600,
		}
	}
}));

const Column = styled(Stack)(({ theme }) => ({
	gap: theme.spacing(3.5),
	'& .MuiButtonBase-root': {
		fontSize: 14,
		padding: theme.spacing(1,2),
		whiteSpace: 'nowrap',
	},
	[theme.breakpoints.up('md')]: {
		maxWidth: 220,
		gap: theme.spacing(3),
	},
}));

export default function Footer({ showCTA = true }) {
	return (
		<FooterSection component='footer'>
			<Container>
				<Grid container rowSpacing={4}>
					<Grid
						item
						xs={12}
						display='grid'
						gridTemplateColumns={{
							xs: 'repeat(1, 1fr)',
							md: 'repeat(2, 1fr)',
						}}
						rowGap={4}
					>
						<Typography fontWeight={400} variant={'subtitle2'} textAlign={{ xs: 'center', md: 'left' }}>Proudly made in Australia for the world.</Typography>
						<Stack gap={4} direction={'row'} alignItems={'center'} justifyContent={{ xs: 'space-evenly', md: 'flex-end' }}>
							<a target="_blank" href="https://www.facebook.com/zelibot?mibextid=ViGcVu">
								<img src="/assets/images/Facebook.svg"></img>
							</a>
							<a target="_blank" href="https://www.instagram.com/zeligate/">
								<img src="/assets/images/Instagram.svg"></img>
							</a>
							<a target="_blank" href="https://www.youtube.com/@Zeligate_AI">
								<img src="/assets/images/Youtube.svg"></img>
							</a>
							<a target="_blank" href="https://au.linkedin.com/company/zeligate">
								<img src="/assets/images/Linkedin.svg"></img>
							</a>
						</Stack>
					</Grid>
					<Grid
						item
						xs={12}
						display='grid'
						gridTemplateColumns={{
							xs: 'repeat(1, 1fr)',
							md: 'repeat(4, 1fr)',
						}}
						rowGap={4}
					>
						<Column>
							<Divider />
							<StyledTypography
								component='div'
								variant='subtitle3'
							>
								<p>Get in touch with us at</p>
								<Link variant={'subtitle2'} href="mailto:support@zeligate.com" target="_blank" color={'inherit'}>
									support@zeligate.com
								</Link>
								<p className="bold"><br/>88 Tribune Street,</p>
								<p className="bold">South Brisbane, Qld 4101 Australia</p>
							</StyledTypography>
						</Column>
						<Column>
							<Divider />
							<StyledTypography
								component='div'
								variant='subtitle3'
							>
								<p>Looking for your next adventure? This may be the start for your new chapter.</p>
								<Link variant={'subtitle2'} href="mailto:careers@zeligate.com" target="_blank" color={'inherit'}>
									careers@zeligate.com
								</Link>
							</StyledTypography>
						</Column>
						<Column>
							<Divider />
							<StyledTypography
								component='div'
								variant='subtitle3'
							>
								<p>Discover our latest feats and triumphs.</p>
								<Link variant={'subtitle2'} href="mailto:media@zeligate.com" target="_blank" color={'inherit'}>
									media@zeligate.com
								</Link>
							</StyledTypography>
							<Link href="company/#media-anchor">
								<Button sx={{ border: '1px solid rgba(59, 0, 153, 1)' }} fullWidth>See the waves we're making</Button>
							</Link>
						</Column>
						<Column>
							<Divider />
							<StyledTypography
								component='div'
								variant='subtitle3'
							>
								Subscribe for updates, new releases and offers.
							</StyledTypography>
							<Stack direction="row" gap={1.25} sx={{ marginTop: { md: 'auto' } }}>
								<TextField variant="standard" placeholder="Email" fullWidth />
								<Button sx={{ color: 'white', backgroundColor: '#170058' }}>Submit</Button>
							</Stack>
						</Column>
					</Grid>
					<Grid item xs={12}>
						<Divider />
					</Grid>
					<Grid
						item
						xs={12}
						display='grid'
						gridTemplateColumns={{
							xs: 'repeat(1, 1fr)',
							md: 'repeat(2, 1fr)',
						}}
						alignItems="center"
						justifyItems={{ xs: 'end', md: 'stretch' }}
					>
						<Logo type={'full'} />
						<Typography
							variant='caption'
							component='div'
							sx={{
								textAlign: { xs: 'center', md: 'right' },
								pt: { xs: 2, md: 0 },
							}}
						>
							<strong>
								© {APP_NAME} {new Date().getFullYear()}
							</strong>{' '}
							|{' '}
							<Link color={'inherit'} href={PATH_PAGE.terms}>
								Privacy and Security
							</Link>
						</Typography>
					</Grid>
				</Grid>
			</Container>
		</FooterSection>
	);
}
