import { styled, alpha } from '@mui/material/styles';
import { Button, Typography, Stack, Box, Modal, CardContent, Card } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LeftIcon from '@mui/icons-material/ChevronLeft';
import RightIcon from '@mui/icons-material/ChevronRight';

export const StyledModal = styled(Modal)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	' & .MuiModal-backdrop' : {
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
	},
}));

export const StyledModalWrapper = styled(Box)(({ theme }) => ({
	height: '100%',
	outline: 'none',
	'& > div': {
		position: 'relative',
		top: '50%',
		flex: 1,
		display: 'flex',
		transform: 'translateY(-50%)',
		width: 800,
		maxHeight: '80%',
		'& > div': {
			borderRadius: 16,
		},
	},
}));

export const StyledModalInner = styled(Box)(({ theme }) => ({
	position: 'relative',
	top: '50%',
	flex: 1,
	display: 'flex',
	width: '100%',
	transform: 'translateY(-50%)',
	maxHeight: '90%',
	'& .MuiCard-root': {
		display: 'flex',
		'& > *': {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
		},
	},
	'& .MuiCardContent-root': {
		display: 'flex',
		flexDirection: 'column',
		overflowY: 'auto',
		gap: theme.spacing(2),
		'& .quill': {
			height: `calc(100% - ${theme.spacing(8)})`,
		},
	},
	'& .MuiCardActions-root': {
		justifyContent: 'flex-end',
		paddingTop: theme.spacing(2),
	},
}));

export const StyledModalContent = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: theme.spacing(4),
	paddingTop: theme.spacing(4),
	paddingBottom: theme.spacing(4),
	textAlign: 'center',
}));

const StyledCloseButton = styled(Button)(({ theme }) => ({
	'& span': {
		fontWeight: 400,
		color: theme.palette.grey[600],
	},
	'& .MuiSvgIcon-root': {
		color: theme.palette.grey[600],
		width: '1rem',
		height: '1rem',
	}
}));

const StyledButtonAsFab = styled(Button)(({ theme }) => ({
	'&': {
		backgroundColor: alpha(theme.palette.primary.lighter, 0.6),
		borderRadius: theme.spacing.borderRadius,
		padding: theme.spacing(1),
		minWidth: theme.spacing(5),
	},
	'&:hover': {
		backgroundColor: alpha(theme.palette.primary.lighter, 0.4),
	},
	'& .MuiSvgIcon-root': {
		color: theme.palette.grey[800],
	},
}));

export const Spacer = ({ style }) => <div style={{ flex: 1, ...style }} />;

export const HeaderCloseButton = ({ onClick }) => (
	<StyledCloseButton style={{ textTransform: 'unset' }} onClick={onClick}>
		<Typography variant='button'>{'Close'}&nbsp;&nbsp;</Typography> <CloseIcon />
	</StyledCloseButton>
);

export const EducationalHeading = ({ content }) => <Typography variant='h4'>{content}</Typography>;
export const EducationalText = ({ content }) => <Typography>{content}</Typography>;
export const EducationalImage = ({ src }) => <img style={{ width: 416, height: 264, borderRadius: 8 }} src={src} />;

export const CloseForeverButton = ({ onClick }) => <StyledCloseButton onClick={onClick}><Typography variant='button'>{"Don't show again"}</Typography></StyledCloseButton>;
export const CloseForNowButton = ({ onClick }) => <StyledCloseButton onClick={onClick}><Typography variant='button'>{'Remind me later'}</Typography></StyledCloseButton>;

export const PageInfo = ({ current, total }) => <Typography>{`Tip ${current} of ${total}`}</Typography>;
export const PageLeftButton = ({ onClick }) => (
	<StyledButtonAsFab onClick={onClick}>
		<LeftIcon />
	</StyledButtonAsFab>
);
export const PageRightButton = ({ onClick }) => (
	<StyledButtonAsFab variant='contained' onClick={onClick}>
		<RightIcon />
	</StyledButtonAsFab>
);
export const CloseButton = ({ onClick }) => (
	<StyledButtonAsFab onClick={onClick}>
		<CloseIcon />
	</StyledButtonAsFab>
);

export const ModalFrame = ({ open, onClose, Header, Footer, Content }) => (
	<StyledModal open={open} onClose={onClose}>
		<StyledModalWrapper>
			<StyledModalInner>
				<Card style={{ padding: 0 }}>
					<Stack direction='column'>
						<Header />
						<CardContent style={{ padding: 0 }}>
							<Content />
						</CardContent>
						<Footer />
					</Stack>
				</Card>
			</StyledModalInner>
		</StyledModalWrapper>
	</StyledModal>
);
