// @mui
import { TableRow, TableCell, Skeleton, Stack } from '@mui/material';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function TableSkeleton({ ...other }) {
	return (
		<TableRow {...other}>
			<TableCell colSpan={12}>
				<Stack spacing={3} direction='row' alignItems='center'>
					<Skeleton variant='rectangular' width={40} height={40} sx={{ borderRadius: 1, flexShrink: 0 }} />
					<Skeleton variant='text' width='100%' height={20} />
					<Skeleton variant='text' width={160} height={20} />
					<Skeleton variant='text' width={160} height={20} />
					<Skeleton variant='text' width={160} height={20} />
					<Skeleton variant='text' width={160} height={20} />
				</Stack>
			</TableCell>
		</TableRow>
	);
}
