import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import { Iconify } from '@zelibot/zeligate-ui';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

InvoiceTableToolbar.propTypes = {
	isFiltered: PropTypes.bool,
	filterName: PropTypes.string,
	onFilterName: PropTypes.func,
	onResetFilter: PropTypes.func,
	filterService: PropTypes.string,
	onFilterEndDate: PropTypes.func,
	onFilterService: PropTypes.func,
	onFilterStartDate: PropTypes.func,
	filterEndDate: PropTypes.instanceOf(Date),
	filterStartDate: PropTypes.instanceOf(Date),
	optionsService: PropTypes.arrayOf(PropTypes.string),
};

export default function InvoiceTableToolbar({ isFiltered, filterName, onFilterName, filterDate, onResetFilter, onFilterDate }) {
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
				placeholder='Search invoice number...'
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
