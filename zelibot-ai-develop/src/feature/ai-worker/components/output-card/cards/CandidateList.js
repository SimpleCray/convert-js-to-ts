import { useEffect, useState, useRef, useMemo } from 'react';
import { Autocomplete, Stack, Box, Typography, Button, Menu, MenuItem, Fade, IconButton, Link, TextField, InputAdornment } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { useSnackbar } from 'notistack';
import useResponsive from 'src/hooks/useResponsive';
import { AIGetAPIRequest, AIPostAPIRequest } from 'src/feature/ai-worker/constants';
import OutputCard from '../OutputCard';
import { TableNoData, TableEmptyRows, emptyRows, useTable, getComparator, ORDER_TYPE, getCustomComparator } from 'src/components/table';
import { TableRow as CustomTableRow, Table as CustomTable } from '../../ats';
import { StyledTextField } from './CardStyles';
import TableCellMenu from '../../ats/table-cell-menu/TableCellMenu';
import TableRowSubComponent from '../../ats/table-card/TableSubRow';
import { Loading } from 'src/components/loading-screen';
import { applyFilter } from 'src/feature/ai-worker/helpers/applyFilter';
import TableHeadAction from '../../ats/table-card/TableHeadAction';
import { useDispatch, useSelector } from 'react-redux';
import { clearRefreshComponent } from '../../../../../redux/slices/refresh';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';
import { set } from 'lodash';

const CandidateListOutputCard = ({ compound_component, outputCardAction, clickRequestAction, includeMenu = true, type, event_id, handleCardClose, ...rest }) => {
	const { enqueueSnackbar } = useSnackbar();

	const { order, orderBy, page, rowsPerPage, onSort, orderType } = useTable({ defaultOrderBy: 'friendly_name', defaultOrder: 'asc', defaultOrderType: ORDER_TYPE.ALPHABETICALLY });

	const isDesktop = useResponsive('up', 'md');

	const [candidates, setCandidates] = useState([
		// {
		//     id: 1,
		//     candidate_id: 1,
		//     friendly_name: { type: 'string', value: 'Robert Paulson' },
		//     job_title: { type: 'string', value: 'Evasion Specialist' },
		//     active: { type: 'toggle', value: true },
		// },
		// {
		//     id: 2,
		//     candidate_id: 2,
		//     friendly_name: { type: 'string', value: 'Robert Paulson' },
		//     job_title: { type: 'string', value: 'Professional Slacker' },
		//     active: { type: 'toggle', value: false },
		// },
		// {
		//     id: 3,
		//     candidate_id: 3,
		//     friendly_name: { type: 'string', value: 'Robert Paulson' },
		//     job_title: { type: 'string', value: 'Master of disaster' },
		//     active: { type: 'toggle', value: true },
		// },
	]);

	const [assignOptions, setAssignOptions] = useState([]);
	const [dataLoading, setDataLoading] = useState(false);
	const dispatch = useDispatch();
	const [updateStatusEndpoint, setUpdateStatusEndpoint] = useState(null);
	// Use refs as endpoint states because state won't reliably update when they're parsed on mount
	const candidateStatusEndpoint = useRef(null);
	const assignCandidateEndpoint = useRef(null);
	const deleteCandidateEndpoint = useRef(null);
	const fetchCandidateList = useRef(null);
	const refreshComponent = useSelector((state) => state.refresh.component);

	const [refetchData, setRefetchData] = useState(true);
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	const handleToggleClick = (e, candidate, checked) => {
		if (candidateStatusEndpoint.current) {
			const status = checked ? 2 : 1;
			// Optimistic update. maybe or maybe not a good idea
			setCandidates((prevState) => prevState.map((c) => (c.candidate_id === candidate.candidate_id ? { ...c, active: { ...c.active, value: status === 2 ? false : true } } : c)));
			const postStatusUpdate = async () => {
				await AIPostAPIRequest(candidateStatusEndpoint.current, {
					candidate_id: candidate.candidate_id,
					candidate_status_id: status,
				})
					.then((response) => {
						enqueueSnackbar('Candidate status updated!');
						setRefetchData(true);
					})
					.catch((error) => {
						console.error('error: ', error);
						enqueueSnackbar('Error updating candidate status. Please try again later.', { variant: 'error' });
						setDataLoading(false);
					});
			};
			void postStatusUpdate();
		}
	};

	const handleAssignCandidateToJob = (candidateId, jobId) => {
		if (assignCandidateEndpoint.current) {
			const postAssign = async () => {
				await AIPostAPIRequest(assignCandidateEndpoint.current, {
					job_opening_id: jobId,
					candidate_id: candidateId,
				})
					.then((response) => {
						enqueueSnackbar('Candidate assigned to job!');
						setRefetchData(true);
					})
					.catch((error) => {
						console.error('error: ', error);
						enqueueSnackbar('Error assigning candidate. Please try again later.', { variant: 'error' });
						setDataLoading(false);
					});
			};
			void postAssign();
		}
	};

	const handleDeleteCandidate = (candidate) => {
		const postDelete = async () => {
			await AIPostAPIRequest(deleteCandidateEndpoint.current, {
				candidate_id: candidate.candidate_id,
			})
				.then((response) => {
					enqueueSnackbar('Candidate deleted');
					setRefetchData(true);
				})
				.catch((error) => {
					console.error('error: ', error);
					enqueueSnackbar('Error deleting candidate. Please try again later.', { variant: 'error' });
					setDataLoading(false);
				});
		};
		void postDelete();
	};

	useEffect(() => {
		if (compound_component && refetchData) {
			setDataLoading(true);
			for (const comp of compound_component) {
				const { section_name, target_api_endpoint, target_path } = comp;
				// console.log('Target API Endpoint is ', target_api_endpoint, target_path);
				const API = process.env[`API_${target_api_endpoint}`];
				const endpoint = target_path === 'get_candidate_list' ? process.env[`API_GET_CANDIDATE_LIST`] : `${API}/${target_path}`;

				if (section_name === 'SET_CANDIDATE_STATUS') {
					setUpdateStatusEndpoint(endpoint);
					candidateStatusEndpoint.current = endpoint;
				}
				if (section_name === 'ASSIGN_CANDIDATE') {
					assignCandidateEndpoint.current = endpoint;
				}
				if (section_name === 'DELETE_CANDIDATE') {
					deleteCandidateEndpoint.current = endpoint;
				}
				if (section_name === 'CANDIDATE_LIST' || section_name === 'JOB_OPENING_LIST') {
					fetchCandidateList.current = endpoint;
					const handleGetData = async () => {
						await AIGetAPIRequest(endpoint)
							.then((response) => {
								if (response !== null) {
									if (section_name === 'CANDIDATE_LIST') {
										// console.log(response);
										const candidates = response.map((r) => {
											return {
												candidate_id: r?.candidate_id,
												job_opening_id: r?.job_opening_details?.length > 0 ? r?.job_opening_details[0]?.job_opening_id : '',
												friendly_name: { type: 'string', value: r?.full_name || 'Unknown' },
												job_title: r?.job_opening_details?.length === 0 ? { type: 'string', value: 'None' } : r?.job_opening_details?.length > 1 ? { type: 'string', value: 'Multiple' } :  { type: 'string', value: r?.job_opening_details[0].job_title },
												active: { type: 'toggle', value: r?.candidate_status === 'Inactive' ? false : true, cellAction: handleToggleClick },
											};
										});
										setCandidates(candidates)
										// setDataLoading(false);
									}

									if (section_name === 'JOB_OPENING_LIST') {
										const jobs = response.map((r) => {
											return {
												id: r?.job_opening_id,
												label: r?.job_title,
											};
										});
										setAssignOptions(jobs);
									}
								}
								setRefetchData(false);
								setIsInitialLoad(false);
								setDataLoading(false);
							})
							.catch((error) => {
								console.error('error: ', error);
								// console.log('Error fetching prompts. Please try again later.', { variant: 'error' });
								setRefetchData(false);
								setIsInitialLoad(false);
								setDataLoading(false);
							});
					};
					void handleGetData();
				}
			}
			// setRefetchData(false);
			// setIsInitialLoad(false);
			// setDataLoading(false);
		}
	}, [compound_component, refetchData]);

	useEffect(() => {
		if (refreshComponent === 'WSC_CANDIDATE_LIST') {
			// console.log('Refetching candidate list data');
			setRefetchData(true);
			dispatch(clearRefreshComponent());
		}
	}, [refreshComponent]);

	// Mock data for early dev
	const TABLE_HEAD = [
		{ id: 'friendly_name', label: <TableHeadAction id='friendly_name' order={order} orderBy={orderBy} onSort={onSort} title='Candidate Name' orderType={ORDER_TYPE.ALPHABETICALLY} />, align: 'left', sort: false },
		{ id: 'job_title', label: <TableHeadAction id='job_title' order={order} orderBy={orderBy} onSort={onSort} title='Applied for' orderType={ORDER_TYPE.ALPHABETICALLY} />, align: 'center', sort: false },
		{ id: 'active', label: <TableHeadAction id='active' order={order} orderBy={orderBy} onSort={onSort} title='Active' orderType={ORDER_TYPE.BOOLEAN} />, align: 'center', sort: false },
		{ id: 'edit', label: '', align: 'center', sort: false }, // won't display but to keep the headers and columns aligned
	];

	const [filterName, setFilterName] = useState('');

	const handleFilterInput = (e) => {
		setFilterName(e.target.value);
	};

	const handleClearFilter = () => {
		setFilterName('');
	};

	const handleRowClick = (row) => {
		if (clickRequestAction) {
			clickRequestAction(undefined, 'WSC_CANDIDATE_PROFILE', { candidate_id: row.candidate_id, ...(row.job_opening_id && { job_id: row.job_opening_id }) });
		}
	};

	const sortedData = useMemo(() => {
		return candidates?.toSorted((a, b) => {
			const valueA = a[orderBy]?.value;
			const valueB = b[orderBy]?.value;
			return getCustomComparator({ valueA, valueB, order, orderType });
		});
	}, [candidates, order, orderBy, orderType]);

	// const dataFiltered = candidates;
	const dataFiltered = applyFilter({
		inputData: sortedData,
		comparator: getComparator(order, orderBy),
		filterBy: {
			key: 'friendly_name',
			value: filterName,
			condition: 'contains',
			threshold: 3,
		},
	});

	const isNotFound = !dataFiltered.length && !filterName;

	const closeThiscard = () => {
		handleCardClose(rest)
	}

	return (
		<OutputCard {...rest} title='Candidate list' titleIcon={<PersonOutlineOutlinedIcon />} isATSCard closeCard={closeThiscard}>
			<>
				{dataLoading && !isInitialLoad && <Loading />}
				{isDesktop ? (
					<CustomTable dataFiltered={dataFiltered} tableData={dataFiltered} tableHead={TABLE_HEAD} loading={dataLoading && isInitialLoad}>
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
							<ListRow refetchData={refetchData} key={index} row={row} index={index} includeMenu={includeMenu} clickRequestAction={clickRequestAction} subRowOptions={assignOptions} subRowSubmitHandler={handleAssignCandidateToJob} deleteHandler={handleDeleteCandidate} rowClickHandler={handleRowClick} />
						))}

						<TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, candidates.length)} />

						{!dataLoading && <TableNoData isNotFound={isNotFound} />}
					</CustomTable>
				) : (
					<>no mobile pls</>
				)}
				{!isNotFound && (
					<Stack direction='row' alignItems='center' justifyContent='space-between'>
						<StyledTextField
							label='Filter'
							onChange={handleFilterInput}
							value={filterName}
							InputProps={{
								...(filterName.length && {
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
						<Stack direction='row' alignItems='center' justifyContent='flex-end' gap={2}>
							<UserFeedback event_id={event_id} type={type} />
						</Stack>
					</Stack>
				)}
			</>
		</OutputCard>
	);
};

const ListRow = ({ row, index, includeMenu, clickRequestAction, subRowOptions, subRowSubmitHandler, deleteHandler, rowClickHandler, refetchData }) => {
	const handleRowClick = (_) => {
		if (rowClickHandler) {
			rowClickHandler(row);
		}
	};

	const [isSubRowVisible, setIsSubRowVisible] = useState(false);

	const handleAssignClick = () => {
		setIsSubRowVisible(!isSubRowVisible);
	};

	const onSubmit = (candidate_id, option_id) => {
		subRowSubmitHandler(candidate_id, option_id);
		// setIsSubRowVisible(false);
	};

	useEffect(() => {
		if (refetchData) {
			setIsSubRowVisible(false);
		}
	}, [refetchData])

	return (
		<CustomTableRow
			key={index}
			row={row}
			tableType={'candidate_list'}
			rowAction={clickRequestAction}
			// rowActionType='VIEW_SINGLE_JOB_OPENING' // mock
			menuComponent={
				includeMenu && (
					<TableCellMenu
						item={row}
						options={[
							{
								icon: 'ASSIGN',
								label: 'Assign',
								clickEvent: () => {
									handleAssignClick();
								},
							},
							{
								icon: 'DELETE',
								label: 'Delete',
								clickEvent: (e, item) => {
									deleteHandler(item);
								},
							},
						]}
					/>
				)
			}
			handleRowClick={handleRowClick}
			subRowVisible={isSubRowVisible}
			subRowComponent={
				<TableRowSubComponent
					row={row}
					title='Assign candidate to:'
					options={subRowOptions}
					setIsSubRowVisible={setIsSubRowVisible}
					inputOnChangeHandler={(e) => console.log('input changed')}
					inputClearHandler={() => console.log('input cleared')}
					refetchData={refetchData}
					submitHandler={(option) => {
						onSubmit(row.candidate_id, option.id);
					}}
				/>
			}
		/>
	);
};

export default CandidateListOutputCard;
