import { IconButton, Stack, Tooltip } from '@mui/material';
import { CopyAll, EditRounded } from '@mui/icons-material';
import { StyledButton } from '../../feature/ai-worker/components/output-card/cards/CardStyles';
import UserFeedback from '../user-feedback/UserFeedback';

const ActionPanel = ({ type, handleCopyToClipboard, handleEditClick, handlePostLinkedIn, event_id, document_category }) => (
	<Stack direction={'row'} alignItems='center' justifyContent='space-between'>
		<Stack direction='row'>
			<Tooltip title='Copy'>
				<IconButton onClick={handleCopyToClipboard}>
					<CopyAll />
				</IconButton>
			</Tooltip>
			<Tooltip title='Edit'>
				<IconButton onClick={handleEditClick}>
					<EditRounded />
				</IconButton>
			</Tooltip>
		</Stack>
		<Stack direction='row' alignItems='center' gap={2}>
			{type === 'LINKEDIN_JOB_AD' || document_category === 'JOB_AD' ? (
				<StyledButton variant={'contained'} color={'primary'} onClick={handlePostLinkedIn}>
					<Stack gap={1} direction='row' alignItems={'center'}>
						Copy and go to LinkedIn&nbsp;
						<CopyAll />
					</Stack>
				</StyledButton>
			) : null}
			<UserFeedback type={type} event_id={event_id} />
		</Stack>
	</Stack>
);

export default ActionPanel;
