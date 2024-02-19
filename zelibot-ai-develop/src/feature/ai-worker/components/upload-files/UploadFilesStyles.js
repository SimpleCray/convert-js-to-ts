import { alpha, styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { Box, ListItem, ListItemIcon, Stack } from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { useTheme } from '@mui/material/styles';

const themed = (Component) => (props) => {
	const theme = useTheme();
	return <Component {...{ theme, ...props }} />;
};

export const StyledUploadFiles = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
	gap: theme.spacing(4),
	margin: '0 auto',
	width: '100%',
	paddingBottom: '16px',
}));

export const Inset = themed(({ style, theme, children }) => (
	<div
		style={{
			// boxShadow: `inset 0 8px 16px ${theme.palette.primary.darker}`,

			...style,
		}}
	>
		{children}
	</div>
));

export const StyledDropZone = styled('div')(({ theme }) => ({
	boxShadow: '0px 8px 16px 0px rgba(35, 0, 90, 0.40) inset',
	backgroundColor: theme.palette.background.default,
	borderRadius: theme.shape.borderRadius * 2,
	display: 'flex',
	outline: 'none',
	cursor: 'pointer',
	overflow: 'hidden',
	position: 'relative',
	padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
	transition: theme.transitions.create('padding'),
	'&:hover': {
		opacity: 0.70,
	},
}));

export const Heading = ({ style }) => (
	<Typography variant='h5' component={'h2'} textAlign={{ xs: 'center', md: 'left' }} style={style}>
		Zeli's ability to assist you increases as you upload more documents
	</Typography>
);

export const DocumentIcon = themed(({ theme, style }) => <ContentCopy style={{ color: theme.palette.primary.light, ...style }} />);
export const DocumentName = ({ style, text }) => <Typography style={style}>{text}</Typography>;
export const DocumentList = ({ children, style }) => <Stack style={style}>{children}</Stack>;
export const DocumentTypeItem = themed(({ style, Icon, Content }) => (
	<ListItem style={{ padding: 0, ...style }}>
		<ListItemIcon>
			<Icon />
		</ListItemIcon>
		<Content />
	</ListItem>
));
