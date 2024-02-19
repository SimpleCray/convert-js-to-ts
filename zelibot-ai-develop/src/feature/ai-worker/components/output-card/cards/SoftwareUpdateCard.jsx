import OutputCard from '../OutputCard';
import { Typography, Stack, Button } from '@mui/material';
import { APP_VERSION } from '../../../../../config-global';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';

export default function SoftwareUpdateCard({ new_version, body, outputCardAction, target_path, prompts, setIsPromptsOpen, dashboard, handleCardClose, ...props }) {
	const handleUpgrade = () => {
		if ('caches' in window) {
			caches.keys().then((names) => {
				names.forEach((name) => caches.delete(name));
			});
		}

		// Force reload the page after clearing the cache
		window.location.reload(true);
	};

	return (
		<OutputCard {...props} isATSCard titleIcon={<BrowserUpdatedIcon />} closeCard={() => handleCardClose(props)}>
			<Stack direction='column' spacing={3} justifyContent='center' alignItems='center'>
				<Typography variant='h5'>Software Update</Typography>

				{new_version && (
					<Typography variant='body1' component={'div'} sx={{ textAlign: 'center' }}>
						There is a new version available.
						<br />
						Shall we reload the page to upgrade from {APP_VERSION} to {new_version} now?
						<br />
						Your current work will not be lost.
					</Typography>
				)}

				<Stack direction='row' spacing={4}>
					<Button variant='contained' color='primary' endIcon={<BrowserUpdatedIcon />} onClick={handleUpgrade}>
						Upgrade Now
					</Button>
				</Stack>
			</Stack>
		</OutputCard>
	);
}
