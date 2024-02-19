import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Stack, Avatar, Button, Checkbox, TableRow, MenuItem, TableCell, IconButton, Typography } from '@mui/material';

// ----------------------------------------------------------------------

JobDescriptionTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onEditRow: PropTypes.func,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

export default function JobDescriptionTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onViewJobDescription }) {
	const handleOnViewJobDescription = (view_job_description) => {
		onViewJobDescription({ action: 'view_job_description', view_job_description });
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
							{row?.job_title}
						</Typography>
					</Stack>
				</TableCell>

				<TableCell>
					<Typography variant='body2' onClick={() => handleOnViewJobDescription(row?.source_url)} style={{ cursor: 'pointer' }}>
						View Job Description
					</Typography>
				</TableCell>
			</TableRow>
		</>
	);
}
