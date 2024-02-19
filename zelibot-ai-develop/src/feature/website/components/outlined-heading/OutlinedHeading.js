import {styled, Typography} from '@mui/material';
import AnimatedBorder from '../animated-border';
import { StyledOutlinedHeading } from './OutlinedHeadingStyles';

export default function OutlinedHeading(props) {
	return (
		<StyledOutlinedHeading>
			<AnimatedBorder />
			<TextHeading {...props} />
			<AnimatedBorder />
		</StyledOutlinedHeading>
	);
}

const StyledTypography = styled(Typography)(({ theme, color }) => ({
	fontSize: 60,
	letterSpacing: -0.6,
	lineHeight: 1.3,
	color: color === 'purple' ? theme.palette.primary.darker : theme.palette.common.white,
	[theme.breakpoints.down('md')]: {
		fontSize: 32,
	},
}));

export const TextHeading = ({ heading, ...props }) => (
	<StyledTypography
		color={props.color}
		component={'div'}
		dangerouslySetInnerHTML={{ __html: heading }}
		{...props}
	/>
);
