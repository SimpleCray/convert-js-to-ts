import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, Pagination, PaginationItem, TableRow, Stack, Collapse } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import React from 'react';

const PreviousButton = () => {
	return (
		<Stack direction='row' alignItems='center'>
			<NavigateBeforeIcon />
			Prev
		</Stack>
	);
};
const NextButton = () => {
	return (
		<Stack direction='row' alignItems='center'>
			Next <NavigateNextIcon />
		</Stack>
	);
};

// type DashboardProps<T> = {
//   data: T[];
//   columns: ColumnDashboard[];
//   handleChangePage: (
//     _event: React.ChangeEvent<unknown>,
//     newPage: number,
//   ) => void;
//   renderValue: (id: keyof T, row: T) => React.ReactNode;
//   renderSkeletons?: (id: keyof T) => React.ReactNode;
//   totalPage: number;
//   page: number;
//   isLoading?: boolean;
//   noDataText?: string;
//   showPagination?: boolean;
// };

const DashBoard = ({ data, columns, handleChangePage, renderValue, totalPage, page, renderSubRowValue, isLoading, noDataText = 'No Data Available', showPagination = true, listSubRowIndexKey = [] }) => {
	return (
		<Paper sx={{ width: '100%', overflow: 'hidden', margin: '2rem 0 0' }}>
			<TableContainer>
				<Table stickyHeader aria-label='sticky table'>
					<TableHead>
						<TableRow>
							{columns.map((column, index) => (
								<TableCell key={'dashboard-column-cells-' + index} sx={{ background: (theme) => theme.palette.primary.darker, color: (theme) => theme.palette.primary.contrastText, ...column.headerStyle }} onClick={column?.onClick}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.length === 0 && !isLoading && (
							<TableRow role='checkbox' tabIndex={-1}>
								<TableCell colSpan={columns.length ?? 1} sx={{ textAlign: 'center' }}>
									{noDataText}
								</TableCell>
							</TableRow>
						)}
						{data?.length > 0 &&
							renderValue &&
							data?.map((row, indexRow) => {
								return (
									<React.Fragment key={'dashboard-fragment-row' + indexRow}>
										<TableRow hover role='checkbox' tabIndex={-1}>
											{columns.map((column, indexColumn) => {
												return (
													<TableCell
														key={'dashboard-column-cells-2-' + indexColumn}
														sx={{
															whiteSpace: 'nowrap',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															...column.cellStyle,
														}}
													>
														{renderValue(column.id, row)}
													</TableCell>
												);
											})}
										</TableRow>
										{/* Add your sub-row here */}
										{renderValue && listSubRowIndexKey.includes(indexRow) && (
											<TableRow>
												<TableCell colSpan={columns.length}>
													<Collapse in={open} timeout='auto' unmountOnExit>
														{renderSubRowValue(row)}
													</Collapse>
												</TableCell>
											</TableRow>
										)}
									</React.Fragment>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			{showPagination && (
				<Pagination
					sx={{ display: 'flex', justifyContent: 'flex-end', margin: '24px' }}
					count={totalPage}
					shape='rounded'
					onChange={handleChangePage}
					page={page}
					renderItem={(item) => (
						<PaginationItem
							components={{
								previous: PreviousButton,
								next: NextButton,
							}}
							{...item}
						/>
					)}
				/>
			)}
		</Paper>
	);
};

export default DashBoard;
