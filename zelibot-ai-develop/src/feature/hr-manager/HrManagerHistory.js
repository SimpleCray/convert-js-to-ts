// @mui
import { Card, Table, TableBody, TableContainer } from '@mui/material';
// components
import { APP_NAME } from '../../config-global';
import * as React from 'react';
import { emptyRows, getComparator, TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom, useTable } from '../../components/table';
import { useState, useEffect } from 'react';
import Scrollbar from '../../components/scrollbar';
import { fTimestamp } from '../../utils/formatTime';
import { Loading } from '../../components/loading-screen';
import { useSnackbar } from 'notistack';
import { getChatHistoryByAssistantId } from './constants';
import { HrHistoryView, HrHistoryTableRow, HrHistoryToolbar } from './components';
import { useParams } from 'src/hooks/useParams';

const TABLE_HEAD = [
	{ id: 'title', label: 'Title', align: 'left', sort: true },
	{ id: 'category', label: 'Category', align: 'left', sort: true },
	{ id: 'assistant_id', label: 'Team Member', align: 'left', sort: false },
	{ id: 'utc_date', label: 'Date', align: 'left', sort: true },
];

export default function HrManagerHistory() {
	const { enqueueSnackbar } = useSnackbar();
	const params = useParams();

	const {
		dense,
		page,
		order,
		orderBy,
		rowsPerPage,
		setPage,
		//
		onSort,
		setOrderBy,
		onChangePage,
		onChangeRowsPerPage,
	} = useTable({ defaultOrderBy: '', defaultOrder: 'asc' });

	const [tableData, setTableData] = useState([]);
	const [filterName, setFilterName] = useState('');
	const [filterAssistant, setFilterAssistant] = useState('all');
	const [filterDate, setFilterDate] = useState(null);
	const [onViewRow, setOnViewRow] = useState(null);
	const [selected, setSelected] = useState({});
	const [loading, setLoading] = useState(true);
	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterAssistant,
		filterDate,
	});
	const denseHeight = dense ? 56 : 76;
	const isFiltered = filterAssistant !== 'all' || filterName !== '' || !!filterDate;

	const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterAssistant) || (!dataFiltered.length && !!filterDate);

	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	};

	const handleResetFilter = () => {
		setFilterName('');
		setFilterAssistant('all');
		setFilterDate(null);
	};

	const handleViewRow = (row) => {
		setOnViewRow(row);
		setSelected(tableData.find((item) => item?.conversation_guid === row));
	};

	// ----------------------------------------------------------------------------------------------------------------
	// [1] Get the User History from the Database [Denver Naidoo - 26 Apr 2023]
	// ----------------------------------------------------------------------------------------------------------------
	const handleUserHistory = async () => {
		let { assistant_id } = params;
		assistant_id = assistant_id === undefined ? 1 : assistant_id;
		await getChatHistoryByAssistantId(assistant_id)
			.then((res) => {
				// console.log('res: ', res);
				const resultArray = Array.isArray(res) ? res : [];
				setTableData(resultArray);
				setSelected(resultArray[0] || {}); // set selected to the first element or empty object if no elements
				setLoading(false);
			})
			.catch((err) => {
				// console.log('error: ', err);
				enqueueSnackbar('Error fetching data', { variant: 'error' });
				setLoading(false);
			});
	};

	useEffect(() => {
		void handleUserHistory();
	}, [setTableData, setLoading]);

	return (
		<>
			{/*<HeaderWrap title={'History'} subtitle={'History with Human Resources'} icon={'history'} />*/}
			<Card sx={{ mt: 5 }}>
				{loading && <Loading />}
				<HrHistoryToolbar
					isFiltered={isFiltered}
					filterName={filterName}
					filterDate={filterDate}
					onFilterName={handleFilterName}
					onResetFilter={handleResetFilter}
					onFilterDate={(newValue) => {
						setFilterDate(newValue);
					}}
				/>

				<TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
					<Scrollbar>
						<Table size={'medium'} sx={{ minWidth: 800 }}>
							<TableHeadCustom order={order} orderBy={orderBy} headLabel={TABLE_HEAD} rowCount={tableData.length} onSort={onSort} />
							<TableBody>
								{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
									<HrHistoryTableRow key={row?.conversation_guid} row={row} selected={selected?.conversation_guid === row?.conversation_guid} onViewRow={() => handleViewRow(row?.conversation_guid)} sx={{ cursor: 'pointer' }} />
								))}

								<TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

								<TableNoData isNotFound={isNotFound || loading} />
							</TableBody>
						</Table>
					</Scrollbar>
				</TableContainer>

				<TablePaginationCustom count={dataFiltered.length} page={page} rowsPerPage={rowsPerPage} onPageChange={onChangePage} onRowsPerPageChange={onChangeRowsPerPage} />
			</Card>
			<HrHistoryView selected={selected} onViewRow={onViewRow} setOnViewRow={setOnViewRow} />
		</>
	);
}

function applyFilter({ inputData, comparator, filterName, filterAssistant, filterDate }) {
	if (filterName) {
		inputData = inputData.filter((data) => data?.title?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
	}

	if (filterAssistant !== 'all') {
		inputData = inputData.filter((data) => data?.assistant_id === filterAssistant);
	}

	if (filterDate) {
		inputData = inputData.filter((data) => fTimestamp(data?.formatted_utc_date) <= fTimestamp(filterDate));
	}

	return inputData;
}
