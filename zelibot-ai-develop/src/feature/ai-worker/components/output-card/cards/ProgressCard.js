import { useTheme } from '@mui/material/styles';
import { CheckBox, CheckBoxOutlined } from '@mui/icons-material';
import OutputCard from '../OutputCard';
import { LinearProgress, Stack } from '@mui/material';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';

export default function ProgressCard({ target_url, type, event_id, ...props }) {
	const theme = useTheme();
	return (
		<OutputCard showTitle={true} title={'Task Progress'} showActions={false} {...props}>
			{props.data.map(({ name, complete }) =>
				complete ? (
					<div key={name}>
						<div style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
							<CheckBox style={{ color: theme.palette.primary.main }} />
							<label>{name}</label>
						</div>
						<LinearProgress value={100} variant='determinate' />
					</div>
				) : (
					<div key={name}>
						<div style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
							<CheckBoxOutlined style={{ color: theme.palette.primary.main }} />
							<label>{name}</label>
						</div>
						<LinearProgress />
					</div>
				)
			)}
			<Stack direction='row' justifyContent='flex-end' alignItems='center' gap={2} mt={2}>
				<UserFeedback type={type} event_id={event_id} />
			</Stack>
		</OutputCard>
	);
}
