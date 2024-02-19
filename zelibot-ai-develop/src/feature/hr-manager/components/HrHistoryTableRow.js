import PropTypes from 'prop-types';
// @mui
import { Box, Stack, Avatar, TableRow, TableCell, Typography, Chip } from '@mui/material';
// utils
import { fUtcDateTime } from '../../../utils/formatTime';
import Image from '../../../components/image';
import * as React from 'react';
import { assistants } from '../constants';

HrHistoryTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onSelectRow: PropTypes.func,
};

export default function HrHistoryTableRow({ row, selected, onSelectRow, onViewRow, ...other }) {
	const data = row;
	const assistant = assistants.find((assistant) => assistant.id === data?.user_id.split('#')[1]);
	const date = row['utc_date'] ? fUtcDateTime(row['utc_date']) : null;
	const [image, setImage] = React.useState(null);

	return (
		<>
			<TableRow hover selected={selected} onClick={onViewRow} {...other}>
				<TableCell>
					<Stack direction='row' alignItems='center' spacing={2}>
						<Image src={image} alt={data?.product_title} sx={{ borderRadius: '8px', width: 48, height: 48 }} />
						<Box sx={{ width: { xs: 150, md: 350 } }}>
							<Typography noWrap variant='subtitle2' sx={{ color: 'text.primary' }}>
								{data?.title}
							</Typography>
							<Typography noWrap variant='body2' sx={{ color: 'text.secondary' }}>
								{data?.preview}
							</Typography>
						</Box>
					</Stack>
				</TableCell>

				<TableCell>
					<Chip label={`${data?.category}`} variant={'soft'} color='primary' sx={{ pointerEvents: 'none' }} />
				</TableCell>
				<TableCell>
					<Stack direction='row' alignItems='center' spacing={1}>
						<Avatar src={assistant?.avatar} alt={assistant?.name} sx={{ width: 40, height: 40 }} />
						<Typography noWrap variant='subtitle2' sx={{ color: 'text.primary' }}>
							{assistant?.name}
						</Typography>
					</Stack>
				</TableCell>

				<TableCell align='left'>{date}</TableCell>
			</TableRow>
		</>
	);
}
