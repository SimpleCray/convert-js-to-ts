import { useState } from 'react';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { IconButton, Stack, InputAdornment, Box, Button } from '@mui/material';
import { Table as CustomTable, TableRow as CustomTableRow } from '../ai-worker/components/ats';
import { TableNoData, TableEmptyRows, emptyRows, useTable, getComparator } from 'src/components/table';
import { StyledTextField } from '../ai-worker/components/output-card/cards/CardStyles';
import UserFeedback from '../../components/user-feedback/UserFeedback';

const JobOpeningsList = ({ tableHead, tableData, action, loading = false, event_id, type }) => {
	const { dense, order, orderBy, page, rowsPerPage } = useTable();

	const applyFilter = ({ inputData, comparator, filterTitle, event_id, type }) => {
		if (!inputData || inputData.length < 1) {
			return inputData;
		}

		const stabilizedThis = inputData.map((el, index) => [el, index]);

		stabilizedThis.sort((a, b) => {
			const order = comparator(a[0], b[0]);
			if (order !== 0) return order;
			return a[1] - b[1];
		});
		inputData = stabilizedThis.map((el) => el[0]);

		if (filterTitle && filterTitle.length >= 3) {
			inputData = inputData.filter((job) => {
				return job?.job_title.value ? job?.job_title.value.toLowerCase().indexOf(filterTitle.toLowerCase()) !== -1 : false;
			});
		}

		return inputData;
	};

	const handleRowClick = (_, row) => {
		const jobId = row?.job_opening_id;
		const jobTitle = row?.job_title.value;
		if (action) {
			action(undefined, 'JOB_OPENING', { id: jobId, ...(jobTitle && { title: jobTitle }) });
		}
	};

	// Test some filtering
	const [filterTitle, setFilterTitle] = useState('');

	const handleFilterInput = (e) => {
		setFilterTitle(e.target.value);
	};

	const handleClearFilter = () => {
		setFilterTitle('');
		setFilterCompany('');
	};

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterTitle,
	});

	const handleCreateJobOpening = () => {
		action(undefined, 'CREATE_JOB_OPENING', { id: undefined, title: undefined });
		// action(undefined, 'CREATE_JOB_OPENING', undefined);
		return;
	};

	const isFiltered = filterTitle !== '';

	const isNotFound = !dataFiltered.length && !filterTitle;
	// console.log('isNotFound', isNotFound, 'filtered length', !dataFiltered.length, 'filterTitle', !filterTitle);

	return (
		<>
			<CustomTable dataFiltered={dataFiltered} tableData={tableData} tableHead={tableHead} loading={loading}>
				{/* {dataFiltered.length < 1 && (
                    <TableRow>
                        <TableCell sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, color: '#030D3A' }}>
                            <Box padding={1} textAlign='center'>
                                <Typography variant='h6'>No current job openings</Typography>
                            </Box>
                        </TableCell>
                    </TableRow>
                )} */}
				{dataFiltered.map((row, index) => (
					<CustomTableRow
						key={index}
						row={row}
						handleRowClick={handleRowClick}
						rowAction={action}
						// rowActionType='VIEW_SINGLE_JOB_OPENING' // mock
					/>
				))}

				<TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

				{!loading && <TableNoData isNotFound={isNotFound} />}
			</CustomTable>
			{!isNotFound && (
				<Stack sx={{ marginTop: 1 }} direction='row' alignItems='center' justifyContent={'space-between'}>
					{/* <SearchRoundedIcon /> */}
					<StyledTextField
						label='Filter'
						onChange={handleFilterInput}
						value={filterTitle}
						InputProps={{
							...(filterTitle.length && {
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton onClick={handleClearFilter} edge='end'>
											<ClearRoundedIcon />
										</IconButton>
									</InputAdornment>
								),
							}),
						}}
					/>
					<Stack direction='row' alignItems='center' gap={2}>
						<Button onClick={() => handleCreateJobOpening()} sx={{ backgroundColor: '#21044c', color: 'white' }} variant='contained'>
							Create new job opening
						</Button>
						<UserFeedback event_id={event_id} type={type} />
					</Stack>
				</Stack>
			)}
		</>
	);
};

export default JobOpeningsList;
