import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import { Iconify } from '@zelibot/zeligate-ui';

const INPUT_WIDTH = 160;

HistoryTableToolbar.propTypes = {
	isFiltered: PropTypes.bool,
	filterName: PropTypes.string,
	onFilterName: PropTypes.func,
	onResetFilter: PropTypes.func,
	onFilterDate: PropTypes.func,
	filterDate: PropTypes.instanceOf(Date),
};

export default function HistoryTableToolbar({ isFiltered, filterName, onFilterName, filterDate, onResetFilter, onFilterDate }) {
	return (
		<Stack
			spacing={2}
			alignItems='center'
			direction={{
				xs: 'column',
				md: 'row',
			}}
			sx={{ px: 2.5, py: 3 }}
		>
			<TextField
				fullWidth
				value={filterName}
				onChange={onFilterName}
				placeholder='Search by Title...'
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<Iconify icon='eva:search-fill' sx={{ color: 'text.disabled' }} />
						</InputAdornment>
					),
				}}
			/>

			<DatePicker
				label='Filter date'
				value={filterDate}
				onChange={onFilterDate}
				renderInput={(params) => (
					<TextField
						{...params}
						fullWidth
						sx={{
							maxWidth: { md: INPUT_WIDTH },
						}}
					/>
				)}
			/>

			{isFiltered && (
				<Button color='error' sx={{ flexShrink: 0 }} onClick={onResetFilter} startIcon={<Iconify icon='eva:trash-2-outline' />}>
					Clear
				</Button>
			)}
		</Stack>
	);
}
