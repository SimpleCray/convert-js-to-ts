import { useEffect, useState, useRef, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { AIGetAPIRequest } from 'src/feature/ai-worker/constants';
import OutputCard from '../OutputCard';
import { useTable, getComparator, ORDER_TYPE, getCustomComparator } from 'src/components/table';
import { JobOpeningsList } from 'src/feature/shared-components';
import { applyFilter } from 'src/feature/ai-worker/helpers/applyFilter';
import TableHeadAction from '../../ats/table-card/TableHeadAction';
import { useAIWorkerContext } from '../../../AIWorker';

export default function JobOpeningListOutputCard({ target_url, compound_component, outputCardAction, clickRequestAction, type, event_id, handleCardClose, ...props }) {
	const { enqueueSnackbar } = useSnackbar();
	const { triggerUpdate } = useAIWorkerContext();
	const [loadingData, setLoadingData] = useState(false);
	const { order, orderBy, orderType, onSort } = useTable({ defaultOrderBy: 'job_title', defaultOrder: 'asc', defaultOrderType: ORDER_TYPE.ALPHABETICALLY });
	// Mock data for early dev
	const TABLE_HEAD = [
		{ id: 'job_title', label: <TableHeadAction id='job_title' order={order} orderBy={orderBy} onSort={onSort} title='Job Title' orderType={ORDER_TYPE.ALPHABETICALLY} />, align: 'left', sort: false },
		{ id: 'company', label: <TableHeadAction id='company' order={order} orderBy={orderBy} onSort={onSort} title='Company / Department' orderType={ORDER_TYPE.ALPHABETICALLY} />, align: 'center', sort: false },
		{ id: 'candidates', label: <TableHeadAction id='candidates' order={order} orderBy={orderBy} onSort={onSort} title='Candidates' orderType={ORDER_TYPE.NUMBER} />, align: 'center', sort: false },
		{ id: 'job_status', label: <TableHeadAction id='job_status' order={order} orderBy={orderBy} onSort={onSort} title='Days open' orderType={ORDER_TYPE.NUMBER} />, align: 'center', sort: false },
	];

	const [tableData, setTableData] = useState([]);
	const [loading, setLoading] = useState(true);
	const anchor = useRef(null);

	const getTimeElapsedInDays = (timestamp) => {
		const ts = new Date(timestamp);
		const now = new Date();
		const dayMs = 1000 * 60 * 60 * 24;
		const diff = now.getTime() - ts.getTime();
		const days = Math.round(diff / dayMs) ?? 0;
		return `${days} day${days > 1 ? 's' : ''}`;
	};

	const fetchCandidateCountEndpoint = useRef(null);

	const fetchCandidateCount = async (jobId) => {
		if (!fetchCandidateCountEndpoint.current) {
			return null;
		}
		const API = `${fetchCandidateCountEndpoint.current}?job_id=${jobId}`;
		const response = await AIGetAPIRequest(API);
		return response;
	};

	useEffect(() => {
		if (compound_component) {
			setLoadingData(true);
			for (const comp of compound_component) {
				const { section_name, target_api_endpoint, target_path } = comp;
				const API = process.env[`API_${target_api_endpoint}`];
				if (section_name === 'JOB_OPENING_CANDIDATE_COUNT') {
					fetchCandidateCountEndpoint.current = `${API}/${target_path}`;
				}
			}
			for (const comp of compound_component) {
				const { section_name, target_api_endpoint, target_path } = comp;
				if (section_name === 'JOB_OPENING_CANDIDATE_COUNT') {
					continue;
				}
				const API = process.env[`API_${target_api_endpoint}`];
				const handleGetData = async () => {
					await AIGetAPIRequest(`${API}/${target_path}`)
						.then(async (response) => {
							if (response !== null) {
								if (section_name === 'JOB_OPENINGS' || section_name === 'JOB_OPENING_LIST') {
									const jobs = await Promise.all(
										response.map(async (r) => {
											const count = await fetchCandidateCount(r.job_opening_id);
											const isOpeningJob = r.job_opening_status_id !== 2;
											// console.log('row is  r ', r);
											return {
												job_opening_id: r.job_opening_id,
												job_title: { value: r.job_title },
												company: { value: r.client_name ?? 'Unknown', client_id: r?.client_id },
												candidates: { value: count[0].candidate_count, icon: 'PERSON' },
												job_status: { value: isOpeningJob ? getTimeElapsedInDays(r.utc_date_created) : 'Closed' },
											};
										})
									);
									setTableData(jobs);
									setLoadingData(false);
								}
							}
						})
						.catch((error) => {
							console.error('error: ', error);
							setLoadingData(false);
						});
				};
				void handleGetData();
			}
		}
	}, [compound_component, triggerUpdate]);

	useEffect(() => {
		anchor?.current?.scrollIntoView({
			block: 'end',
		});
	}, [loading]);

	const handleRowClick = (_, row) => {
		const jobId = row.job_opening_id;
		outputCardAction(undefined, 'JOB_OPENING', { id: jobId });
	};

	// Test some filtering
	const [filterTitle, setFilterTitle] = useState('');

	const handleFilterInput = (e) => {
		setFilterTitle(e.target.value);
	};

	const handleClearFilter = () => {
		setFilterTitle('');
	};

	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterBy: {
			key: 'job_title',
			value: filterTitle,
			condition: 'contains',
			threshold: 3,
		},
	});

	const isFiltered = filterTitle !== '';

	const isNotFound = !dataFiltered.length && !!filterTitle;
	const sortedData = useMemo(() => {
		return tableData?.toSorted((a, b) => {
			const valueA = a[orderBy]?.value;
			const valueB = b[orderBy]?.value;
			return getCustomComparator({ valueA, valueB, order, orderType });
		});
	}, [tableData, order, orderBy, orderType]);

	const closeThiscard = () => {
		handleCardClose(props)
	}

	return (
		<OutputCard {...props} title='Job listings' isATSCard closeCard={closeThiscard}>
			<JobOpeningsList tableHead={TABLE_HEAD} tableData={sortedData} action={clickRequestAction} loading={loadingData} event_id={event_id} type={type} />
		</OutputCard>
	);
}
