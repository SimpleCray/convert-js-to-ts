import { Card, CardContent, Button, Modal, Typography } from '@mui/material';
import { StyledWebsocketDialogWrapper, StyledContent } from './WebsocketErrorStyles';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';

export default function WebsocketError({ open }) {
	const handleButtonClick = () => {
		window.location.reload();
	};

	return (
		<Modal open={open} onClose={() => {}}>
			<StyledWebsocketDialogWrapper>
				<Card>
					<CardContent>
						<StyledContent>
							<ElectricalServicesIcon />
							<Typography variant={'body1'}>Looks like someone tripped over a power cord. Sorry we need to reconnect our service.</Typography>
						</StyledContent>
						<Button onClick={handleButtonClick} variant={'contained'} fullWidth>
							Reload
						</Button>
					</CardContent>
				</Card>
			</StyledWebsocketDialogWrapper>
		</Modal>
	);
}
