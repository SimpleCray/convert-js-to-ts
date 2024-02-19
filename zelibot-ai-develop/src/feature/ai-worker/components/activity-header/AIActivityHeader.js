import { Divider, IconButton, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { StyledAIActivityHeader } from './AIActivityHeaderStyles';
import propTypes from 'prop-types';

AIActivityHeader.propTypes = {
	activity: propTypes.bool,
	onClick: propTypes.func,
};

export default function AIActivityHeader({ activity = false, onClick }) {
	return (
		<StyledAIActivityHeader>
			<IconButton onClick={onClick}>
				<KeyboardArrowUpIcon />
			</IconButton>
			<Divider />
			<Typography variant={activity ? 'overline' : 'h6'} color={activity ? 'text.disabled' : 'text.primary'} component={'div'}>
				{activity ? 'New Activity' : 'No new activity'}
			</Typography>
		</StyledAIActivityHeader>
	);
}
