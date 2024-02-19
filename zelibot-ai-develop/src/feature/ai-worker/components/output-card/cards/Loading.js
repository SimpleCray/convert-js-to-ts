import OutputCard from '../OutputCard';
import { Box, CircularProgress } from '@mui/material';

export default function LoadingOutputCard() {
	return (
		<OutputCard title={'Writing'}>
			<Box sx={{ display: 'flex', justifyContent: 'center' }}>
				<CircularProgress />
			</Box>
		</OutputCard>
	);
}
