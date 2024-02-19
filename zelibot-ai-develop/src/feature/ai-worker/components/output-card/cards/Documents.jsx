import { useEffect, useState, useMemo, useCallback } from 'react';
import { IconButton, Tooltip, InputAdornment, Stack, Box } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { useSnackbar } from 'notistack';
import { AIGetAPIRequest, AIPostAPIRequest } from 'src/feature/ai-worker/constants';
import { useTable, getComparator, ORDER_TYPE, getCustomComparator } from 'src/components/table';
import OutputCard from '../OutputCard';
import { TableRow as CustomTableRow, Table as CustomTable } from '../../ats';
import TableCellMenu from '../../ats/table-cell-menu/TableCellMenu';
import { StyledCardActions } from '../OutputCardStyles';
import { applyFilter } from 'src/feature/ai-worker/helpers/applyFilter';
import { makeReadable } from 'src/feature/ai-worker/helpers/makeReadable';
import { MinimizeOutlined } from '@mui/icons-material';
import TableHeadAction from '../../ats/table-card/TableHeadAction';
import TableRowSubComponent from '../../ats/table-card/TableSubRow';
import { useAssignDocument, useGetAllCandidatesAndJobOpenings } from '../../../../../hooks/Documents/useDocument';
import moment from 'moment-timezone';
import TextField from '@mui/material/TextField';
import { Loading } from 'src/components/loading-screen';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';
import { getSourceUrl } from '../../../../../utils/common';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

// Map file types to icons (from TableRow)
const FileIconType = (type) => {
	switch (type) {
		case 'pdf':
			return 'FILE';
		case 'docx':
			return 'DOC';
		case 'mp4':
			return 'VIDEO';
		default:
			return 'FILE';
	}
};

const DocumentsOutputCard = ({ target_url, outputCardAction, compound_component, clickRequestAction, type, event_id, handleCardClose, conversationGuid, ...props }) => {
	const { enqueueSnackbar } = useSnackbar();

	const [loadingData, setLoadingData] = useState(true);
	const [refetchData, setRefetchData] = useState(true);
	const [cardOpen, setCardOpen] = useState(true);

	const includeFileMenu = true;
	const { order, orderBy, onSort, orderType } = useTable({
		defaultOrderBy: 'document',
		defaultOrder: 'asc',
		defaultOrderType: ORDER_TYPE.ALPHABETICALLY,
	});

	const TABLE_HEAD = useMemo(
		() => [
			{
				id: 'category',
				label: <TableHeadAction id='category' order={order} orderBy={orderBy} onSort={onSort} title='Document' orderType={ORDER_TYPE.ALPHABETICALLY} style={{ p: 0 }} />,
				headerStyle: {
					textAlign: 'left',
					width: 100,
					maxWidth: 100,
				},
			},
			{
				id: 'document',
				label: <TableHeadAction id='document' order={order} orderBy={orderBy} onSort={onSort} title='File Name' orderType={ORDER_TYPE.ALPHABETICALLY} style={{ p: 0 }} />,
				headerStyle: {
					textAlign: 'left',
					width: 170,
					maxWidth: 170,
				},
			},
			{
				id: 'date',
				label: <TableHeadAction id='date' order={order} orderBy={orderBy} onSort={onSort} title='Date' orderType={ORDER_TYPE.TIME} style={{ p: 0 }} />,
				headerStyle: {
					textAlign: 'left',
					width: 50,
				},
			},
			{
				id: 'assigned',
				label: <TableHeadAction id='assigned' order={order} orderBy={orderBy} onSort={onSort} title='Assigned' orderType={ORDER_TYPE.ALPHABETICALLY} style={{ p: 0 }} />,
				align: 'center',
				headerStyle: {
					textAlign: 'center',
					width: 40,
				},
			},
			// { id: 'source', label: 'Source', align: 'center' },
			// { id: 'type', label: 'Type', align: 'center' },
			...((includeFileMenu && [
				{
					id: 'edit',
					label: 'Edit',
					align: 'center',
					headerStyle: {
						textAlign: 'center',
						width: 50,
					},
				},
			]) ||
				[]),
		],
		[order, orderBy, onSort, includeFileMenu]
	);

	const [fileTableData, setFileTableData] = useState([]);
	useEffect(() => {
		if (compound_component && refetchData) {
			setLoadingData(true);
			const { section_name, target_api_endpoint, target_path } = compound_component[0];
			const API = process.env[`API_${target_api_endpoint}`];
			const handleGetData = async () => {
				await AIGetAPIRequest(`${API}/${target_path}`)
					.then((response) => {
						if (response !== null) {
							const files = response.map((f, i) => {
								return {
									category: {
										value: makeReadable(f.document_category),
										cellStyle: {
											width: 70,
											maxWidth: 70,
											textAlign: 'left',
										},
									},
									document: {
										id: f.user_document_id,
										icon: FileIconType(f.file_type),
										value: f.file_name,
										cellStyle: {
											width: 120,
											maxWidth: 120,
											textAlign: 'left',
											'& .MuiStack-root': {
												justifyContent: 'flex-start',
											},
										},
									},
									date: {
										value: f.utc_date_created ? moment.utc(f.utc_date_created).local().format('DD/MM/YYYY') : '-',
										cellStyle: {
											width: 50,
											textAlign: 'left',
											'& .MuiStack-root': {
												justifyContent: 'flex-start',
											},
										},
									},
									assigned: {
										value: f?.linked_name ?? '-',
										assigned_id: f?.linked_id ?? null,
										cellStyle: {
											width: 40,
											textAlign: 'center',
										},
										icon: f?.link_type === ASSIGN_DOCUMENT_TYPE.JOB_OPENING ? 'WORK' : f?.link_type === ASSIGN_DOCUMENT_TYPE.CANDIDATE ? 'PERSON' : null,
										showValue: false,
									},
									edit: {
										value: '',
										menu: true,
										cellStyle: {
											width: 50,
											textAlign: 'center',
										},
									},
									document_id: f.user_document_id || i,
									document_category: f.document_category,
									// document: { value: `${f.friendly_name} resume` },
									// source: { value: 'Zeli' },
									// type: { value: f.file_type, icon: FileIconType(f.file_type) },
									// type: { value: 'doc', icon: FileIconType(f.file_type) },
									source_url_id: { value: f.source_url },
									upload_status_id: 1,
									sk: f.dynamo_sk,
								};
							});
							setFileTableData(files);
							setLoadingData(false);
							setRefetchData(false);
						}
					})
					.catch((error) => {
						console.error('error: ', error);
						enqueueSnackbar('Error fetching documents. Please try again later', { variant: 'error' });
						setLoadingData(false);
						setRefetchData(false);
					});
			};
			void handleGetData();
		}
	}, [compound_component, refetchData]);

	const [cellAnchorEl, setCellAnchorEl] = useState(null);

	const [filterName, setFilterName] = useState('');
	const [showFilterBar, setShowFilterBar] = useState(false);
	const handleFilterButtonClick = () => {
		setShowFilterBar(!showFilterBar);
		setFilterName('');
	};
	const handleFilterInput = (e) => {
		setFilterName(e.target.value);
	};
	const handleClearFilter = () => {
		setFilterName('');
	};

	// For testing 'deleting' files
	const [fileToDelete, setFileToDelete] = useState(null);
	const handleFileDeleteButtonClick = (_, id) => {
		// Likely need to send this off somewhere
		// setFileToDelete(id);
	};

	const sortedData = useMemo(() => {
		return fileTableData?.toSorted((a, b) => {
			const valueA = a[orderBy]?.value;
			const valueB = b[orderBy]?.value;
			return getCustomComparator({
				valueA,
				valueB,
				order,
				orderType,
				timeFormat: 'DD/MM/YYYY',
			});
		});
	}, [fileTableData, order, orderBy, orderType]);

	const dataFiltered = applyFilter({
		inputData: sortedData,
		comparator: getComparator(order, orderBy),
		filterBy: {
			key: 'document',
			value: filterName,
			condition: 'contains',
			threshold: 3,
		},
	});

	const handleDeleteDocument = useCallback((document) => {
		const postDelete = async () => {
			const path = 'delete_candidate_document';
			const endpoint = process.env['API_HR_ATS_MS'];
			const API = `${endpoint}/${path}`;
			await AIPostAPIRequest(API, {
				// candidate_id: candidateId,
				user_document_id: document.document_id,
			})
				.then((response) => {
					enqueueSnackbar('Document deleted');
					setRefetchData(true);
				})
				.catch((error) => {
					console.error('error: ', error);
					enqueueSnackbar('Error deleting document. Please try again later.', {
						variant: 'error',
					});
					setLoadingData(false);
				});
		};
		void postDelete();
	}, []);

	const isNotFound = !dataFiltered.length && !filterName;

	const handleHeaderAction = () => {
		setCardOpen(!cardOpen);
	};

	const closeThiscard = () => {
		handleCardClose(props);
	};

	return (
		<OutputCard title='My Documents' showActions={false} headerAction={handleHeaderAction} headerActionIcon={<MinimizeOutlined />} showHeaderMenu isATSCard closeCard={closeThiscard}>
			{cardOpen && (
				<>
					<Documents
						fileTableData={dataFiltered}
						TABLE_HEAD={TABLE_HEAD}
						loading={loadingData}
						fileToDelete={fileToDelete}
						includeFileMenu={includeFileMenu ?? false}
						handleFileDeleteButtonClick={handleFileDeleteButtonClick}
						viewFile={outputCardAction}
						handleDelete={handleDeleteDocument}
						clickRequestAction={clickRequestAction}
						setRefetchData={setRefetchData}
					/>
					<Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mt: 1 }}>
						<Stack direction='row' alignItems='center'>
							<StyledCardActions>
								<Tooltip title='Filter documents'>
									<span>
										<IconButton onClick={handleFilterButtonClick} disabled={fileTableData.length === 0}>
											<SearchRoundedIcon />
										</IconButton>
									</span>
								</Tooltip>
							</StyledCardActions>
							{showFilterBar && (
								<TextField
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
							)}
						</Stack>
						<Stack direction='row' alignItems='center' gap={2}>
							<UserFeedback type={type} event_id={event_id} />
						</Stack>
					</Stack>
				</>
			)}
		</OutputCard>
	);
};

export default DocumentsOutputCard;

const Documents = ({ fileTableData, TABLE_HEAD, loading, fileToDelete, handleFileDeleteButtonClick, includeFileMenu, viewFile, handleDelete, clickRequestAction, setRefetchData }) => {
	const handleRowClick = async (_) => {
		const view_file = _;

		if (clickRequestAction && !view_file?.source_url_id?.value) {
			clickRequestAction(undefined, 'EDIT_DOCUMENT_CONTENT', { document_id: view_file?.document_id, sk: view_file?.sk });
			return;
		}
		if (clickRequestAction && view_file?.source_url_id?.value) {
			const target_url = await getSourceUrl({ source_type: 1, url: view_file?.source_url_id?.value.split('?')[0] });
			if (target_url) {
				clickRequestAction(undefined, 'VIEW_DOCUMENT', { document_id: view_file?.document?.id, name: view_file?.assigned?.value, id: view_file?.assigned?.assigned_id, document_category: view_file?.category?.value, sk: view_file?.sk }, target_url);
			}
		}
	};

	const { data } = useGetAllCandidatesAndJobOpenings({});

	const candidateList = useMemo(() => data?.candidateList?.map((item) => ({ id: item?.candidate_id, label: item?.full_name ?? '-' })), [data?.candidateList]);
	const jobOpeningList = useMemo(() => data?.jobOpeningList?.map((item) => ({ id: item?.job_opening_id, label: item?.job_title ?? '-' })), [data?.jobOpeningList]);
	return (
		<>
			{loading && (
				<Box
					sx={{
						height: '360px',
					}}
				>
					<Loading />
				</Box>
			)}

			{!loading && (
				<CustomTable dataFiltered={[]} tableData={fileTableData} tableHead={TABLE_HEAD} isNotFound={fileTableData.length < 1} loading={loading}>
					{fileTableData
						.filter((f) => f.document_id !== fileToDelete)
						.map((row, index) => (
							<ListRow
								key={index}
								fileTableData={fileTableData}
								row={row}
								handleFileDeleteButtonClick={handleFileDeleteButtonClick}
								includeFileMenu={includeFileMenu}
								handleDelete={handleDelete}
								rowClickHandler={() => handleRowClick(row)}
								candidateList={candidateList || []}
								jobOpeningList={jobOpeningList || []}
								setRefetchData={setRefetchData}
							/>
						))}
				</CustomTable>
			)}
		</>
	);
};

export const ASSIGN_DOCUMENT_TYPE = {
	JOB_OPENING: 'JOB_OPENING',
	CANDIDATE: 'CANDIDATE',
};

const ListRow = ({ fileTableData, row, handleFileDeleteButtonClick, includeFileMenu, handleDelete, rowClickHandler, candidateList, jobOpeningList, setRefetchData }) => {
	const [key, setKey] = useState(1);
	const [isSubRowVisible, setIsSubRowVisible] = useState(false);
	const [assignType, setAssignType] = useState(null);

	const { mutate: mutateAssignDocument, isPending } = useAssignDocument({});

	const handleRowClick = (_) => {
		if (rowClickHandler) {
			rowClickHandler(row);
		}
	};

	const onHandleAssign = useCallback((type) => {
		setAssignType(type);
		setIsSubRowVisible(true);
		setKey((prevState) => prevState + 1);
	}, []);

	const onSubmit = (id) => {
		const payload =
			assignType === ASSIGN_DOCUMENT_TYPE.CANDIDATE
				? { type: assignType, document_id: row?.document_id, candidate_id: id }
				: {
						type: assignType,
						document_id: row?.document_id,
						job_opening_id: id,
					};
		mutateAssignDocument(payload, {
			onSuccess: () => {
				setIsSubRowVisible(false);
				setRefetchData(true);
			},
		});
	};

	const optionsMenu = useMemo(() => {
		const list = [];
		if (candidateList?.length) {
			list.push({
				label: 'Assign to candidate',
				clickEvent: (e, item) => {
					onHandleAssign(ASSIGN_DOCUMENT_TYPE.CANDIDATE);
				},
			});
		}
		if (jobOpeningList?.length) {
			list.push({
				label: 'Assign to job',
				clickEvent: (e, item) => {
					onHandleAssign(ASSIGN_DOCUMENT_TYPE.JOB_OPENING);
				},
			});
		}
		list.push({
			label: 'Delete',
			clickEvent: (e, item) => {
				handleDelete(item);
			},
		});
		return list;
	}, [candidateList, jobOpeningList, handleDelete]);

	const assignOptions = useMemo(() => {
		switch (assignType) {
			case ASSIGN_DOCUMENT_TYPE.CANDIDATE:
				return candidateList || [];
			case ASSIGN_DOCUMENT_TYPE.JOB_OPENING:
				return jobOpeningList || [];
			default:
				return [];
		}
	}, [assignType]);

	return (
		<CustomTableRow
			row={row}
			enableRowClick={true}
			actionWidth={50}
			menuItemClickHandler={handleFileDeleteButtonClick}
			// menuComponent={includeFileMenu && <FileMenu file={row} handleClick={handleFileDeleteButtonClick} />}
			menuComponent={includeFileMenu && <TableCellMenu item={row} options={optionsMenu} />}
			isNotFound={!fileTableData?.length}
			// handleDelete={handleDeleteDocument}
			handleRowClick={handleRowClick}
			subRowVisible={isSubRowVisible}
			subRowComponent={
				<TableRowSubComponent
					key={key}
					row={row}
					title='Assign document to:'
					options={assignOptions}
					inputOnChangeHandler={(e) => console.log('input changed')}
					inputClearHandler={() => console.log('input cleared')}
					submitHandler={(option) => {
						onSubmit(option?.id);
					}}
					isLoading={isPending}
				/>
			}
		/>
	);
};
