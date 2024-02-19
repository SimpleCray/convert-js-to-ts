import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Stack, Avatar, Button, Checkbox, TableRow, MenuItem, TableCell, IconButton, Typography } from '@mui/material';
import { getSourceUrl } from '../../../../../utils/common';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onEditRow: PropTypes.func,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onViewResume }) {
	const handleOnViewResume = async (view_resume) => {
		const target_url = await getSourceUrl({ source_type: 1, url: view_resume.split('?')[0] });
		if (target_url) {
			clickRequestAction(undefined, 'VIEW_DOCUMENT', {}, target_url);
		}
	};

	return (
		<>
			<TableRow hover selected={selected}>
				{/*<TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>*/}

				<TableCell>
					<Stack direction='row' alignItems='center' spacing={2}>
						<Typography variant='subtitle2' noWrap>
							{row?.friendly_name}
						</Typography>
					</Stack>
				</TableCell>

				<TableCell>
					<Stack direction='row' alignItems='center' spacing={2}>
						<Typography variant='body2' noWrap>
							{row?.email}
						</Typography>
					</Stack>
				</TableCell>

				<TableCell>
					<Stack direction='row' alignItems='center' spacing={2}>
						<Typography variant='body2' noWrap>
							{row?.mobile_number}
						</Typography>
					</Stack>
				</TableCell>

				<TableCell>
					<Stack direction='row' alignItems='center' spacing={2}>
						<Typography variant='body2' noWrap>
							{row?.utc_date_created}
						</Typography>
					</Stack>
				</TableCell>

				<TableCell>
					<Typography variant='body2' onClick={() => handleOnViewResume(row?.source_url)} style={{ cursor: 'pointer' }}>
						View Resume
					</Typography>
				</TableCell>
			</TableRow>
		</>
	);
}
