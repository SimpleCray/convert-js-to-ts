// Job status but v2
// All mocked to figure out the pieces
import { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { styled, alpha } from '@mui/material/styles';
import { Stack, Box, Typography, Button, Menu, MenuItem, Fade, IconButton, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useSnackbar } from 'notistack';
import { AIGetAPIRequest, AIPostAPIRequest, setChatContext } from 'src/feature/ai-worker/constants';
import { useTable, getComparator, ORDER_TYPE, getCustomComparator } from 'src/components/table';
import OutputCard from '../OutputCard';
import { TableRow as CustomTableRow, Table as CustomTable } from '../../ats';
import TableCellMenu from '../../ats/table-cell-menu/TableCellMenu';
import { StyledSectionHeader } from '../ATSCardSytles';
import { Loading } from 'src/components/loading-screen';
import Details from '../../ats/contact/Details';
import { makeReadable } from 'src/feature/ai-worker/helpers/makeReadable';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import TableHeadAction from '../../ats/table-card/TableHeadAction';
import JobDetails from '../../ats/contact/JobDetails';
import useDialog from '../../../../../hooks/useDialog';
import { useAIWorkerContext } from '../../../AIWorker';
import { useCloseReopenJobOpening, useDeleteJobOpening } from '../../../../../hooks/JobOpenings/useJobOpening';
import useModal, { MODAL_TYPES } from '../../../../../hooks/useModal';
import moment from 'moment-timezone';
import { Text14DeepCoveWeight600 } from '../../../../../components/common/TypographyStyled';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';
import { getSourceUrl } from '../../../../../utils/common';
import { StyledAvatar } from '../OutputCardStyles';

const JOB_STATUS = {
	OPEN: 1,
	CLOSED: 2,
};

// Styled components to be moved later
export const CandidateStatusOption = styled(Stack)(({ theme, isselected }) => ({
	direction: 'column',
	justifyContent: 'end',
	alignItems: 'center',
	borderBottom: isselected ? `4px solid ${theme.palette.primary.main}` : `4px solid ${theme.palette.primary.light}`,
	gap: theme.spacing(1),
	paddingBottom: theme.spacing(2),
	cursor: 'pointer',
	'& > .MuiTypography-body1': {
		fontWeight: 600,
	},
	'& > .MuiTypography-body2': {
		textAlign: 'center',
	},
	'&:hover': {
		borderBottom: isselected ? `4px solid ${theme.palette.primary.main}` : `4px solid ${theme.palette.primary.lighter}`,
	},
}));

const CandidateStatusButton = styled(Button)(({ theme }) => ({
	justifyContent: 'space-between',
	flex: 1,
}));

const CandidateScore = styled(Stack)(({ theme }) => ({
	alignItems: 'center',
	justifyContent: 'center',
	width: theme.spacing(5),
	height: theme.spacing(5),
	color: theme.palette.common.white,
	borderRadius: theme.spacing(10),
	px: '5px',
	background: theme.palette.primary.main,
}));

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

const JobOpeningOutputCard = ({
	target_url,
	compound_component,
	outputCardAction,
	clickRequestAction,
	// all temp flags
	includeCandidates = true,
	includeCandidateStatusFunctionalty = true,
	enableCandidateFiltering = true,
	showContactBox = true,
	includeFileMenu = true,
	id: outputCardId,
	handleCardClose,
	type,
	event_id,
	conversationGuid,
	...props
}) => {
	const { enqueueSnackbar } = useSnackbar();

	const compoundComponents = {
		JOB_OPENING_COMPANY: Details,
		JOB_OPENING_DOCUMENTS: JobOpeningFiles,
		JOB_OPENING_CANDIDATE: Details,
	};

	const [jobOpeningDetails, setJobOpeningDetails] = useState('');
	const [loadingData, setLoadingData] = useState(false);
	const [refetchData, setRefetchData] = useState(true);
	const [anchorMenuEl, setAnchorMenuEl] = useState(null);

	const { order, orderBy, onSort, orderType } = useTable({
		defaultOrderBy: 'document',
		defaultOrder: 'asc',
		defaultOrderType: ORDER_TYPE.ALPHABETICALLY,
	});

	const TABLE_HEAD = [
		{ id: 'category', label: <TableHeadAction id='category' order={order} orderBy={orderBy} onSort={onSort} title='Document' orderType={ORDER_TYPE.ALPHABETICALLY} />, align: 'left' },
		{ id: 'document', label: <TableHeadAction id='document' order={order} orderBy={orderBy} onSort={onSort} title='File Name' orderType={ORDER_TYPE.ALPHABETICALLY} />, align: 'left' },
		{ id: 'date', label: <TableHeadAction id='date' order={order} orderBy={orderBy} onSort={onSort} title='Date' orderType={ORDER_TYPE.TIME} />, align: 'center' },
		// { id: 'type', label: 'Type', align: 'center' },
		...((includeFileMenu && [{ id: 'edit', label: 'Edit', align: 'center' }]) || []),
	];

	const [fileTableData, setFileTableData] = useState([]);

	const updateCandidateStageEndpoint = useRef(null);
	const getCandidateStageEndpoint = useRef(null);
	const getCandidateSummaryEndpoint = useRef(null);
	const { renderModal, setOpenModal } = useModal({});
	const { mutate: mutateDeleteJobOpening, isPending: isPendingDeleteJobOpening } = useDeleteJobOpening();
	const { mutate: mutateCloseReopenJobOpening, isPending: isPendingCloseReopenJobOpening } = useCloseReopenJobOpening();
	const isLoadingDialog = isPendingDeleteJobOpening;
	const { renderDialog, handleOpenDialog, handleCloseDialog } = useDialog({ isLoading: isLoadingDialog });
	const { handleRemoveCartById, toggleTriggerUpdate } = useAIWorkerContext();
	const candidateStatistics = [
		{
			id: 1,
			label: 'Applied',
			status_id: 1,
			status: 'applied',
			value: 234,
		},
		{
			id: 2,
			label: 'Pre-screen',
			status_id: 2,
			status: 'pre',
			value: 177,
		},
		{
			id: 3,
			label: 'IV',
			status_id: 3,
			status: 'iv',
			value: 30,
		},
		{
			id: 4,
			label: 'Shortlist',
			status_id: 4,
			status: 'shortlist',
			value: 8,
		},
		{
			id: 5,
			label: 'Assess',
			status_id: 5,
			status: 'assess',
			value: 7,
		},
		{
			id: 6,
			label: 'Client IV',
			status_id: 6,
			status: 'client_iv',
			value: 7,
		},
		{
			id: 7,
			label: 'Ref checks',
			status_id: 7,
			status: 'checked',
			value: 6,
		},
		{
			id: 8,
			label: 'Offer',
			status_id: 8,
			status: 'offer',
			value: 1,
		},
		{
			id: 9,
			label: 'Accept',
			status_id: 9,
			status: 'accept',
			value: 0,
		},
	];

	const [jobOpeningCandidates, setJobOpeningCandidates] = useState([]);

	const [candidateStageSummary, setCandidateStageSummary] = useState([]);

	const candidateStatusOptions = [
		{
			id: 1,
			name: 'applied',
			label: 'Applied',
		},
		{
			id: 2,
			name: 'pre',
			label: 'Pre-screen',
		},
		{
			id: 3,
			name: 'iv',
			label: 'Interview',
		},
		{
			id: 4,
			name: 'shortlist',
			label: 'Shortlist',
		},
		{
			id: 5,
			name: 'tech',
			label: 'Tech assessment',
		},
		{
			id: 6,
			name: 'psych',
			label: 'Psych assessment',
		},
		{
			id: 7,
			name: 'civ1',
			label: 'Client interview 1',
		},
		{
			id: 8,
			name: 'civ2',
			label: 'Client interview 2',
		},
		{
			id: 9,
			name: 'checked',
			label: 'Ref-checks',
		},
		{
			id: 10,
			name: 'offer',
			label: 'Offer',
		},
		{
			id: 11,
			name: 'contract',
			label: 'Contract offer',
		},
		{
			id: 12,
			name: 'onboard',
			label: 'Onboard',
		},
	];

	const [candidateStageOptions, setCandidateStageOptions] = useState([]);

	useEffect(() => {
		if (compound_component && refetchData) {
			for (const comp of compound_component) {
				setLoadingData(true);
				const { section_name, target_api_endpoint, target_path } = comp;
				// Skip until
				// if (comp.section_name === "CANDIDATE_STAGES") {
				// 	continue;
				// }
				const API = process.env[`API_${target_api_endpoint}`];
				const endpoint = `${API}/${target_path}`;
				if (section_name === 'SET_CANDIDATE_STAGES') {
					updateCandidateStageEndpoint.current = endpoint;
				}
				if (section_name === 'JOB_OPENING_STAGE_DETAILS') {
					getCandidateStageEndpoint.current = endpoint;
					fetchCandidateStageDetails();
				}
				if (section_name === 'JOB_OPENING_STAGE_SUMMARY') {
					getCandidateSummaryEndpoint.current = endpoint;
					fetchCandidateSummary();
				}
				// const API = process.env[`API_${target_api_endpoint}`];
				if (section_name !== 'SET_CANDIDATE_STAGES' && section_name !== 'JOB_OPENING_STAGE_DETAILS' && 'JOB_OPENING_STAGE_SUMMARY') {
					const handleGetData = async () => {
						await AIGetAPIRequest(`${API}/${target_path}`)
							.then((response) => {
								if (response !== null) {
									if (section_name === 'JOB_OPENING_COMPANY') {
										const [job] = response;
										setJobOpeningDetails(job);
										handleSetContext(job)
									}
									if (section_name === 'JOB_OPENING_DOCUMENTS') {
										const files = response.map((f, i) => {
											// console.log('FILE IS >', f);
											return {
												document_id: f.user_document_id || i,
												category: { value: makeReadable(f.document_category) },
												document: { icon: FileIconType(f.file_type || 'docx'), value: f.file_name || 'Unknown file' },
												date: { value: f.utc_date_created ? moment.utc(f.utc_date_created).local().format('DD/MM/YYYY') : '-' },
												assigned: {
													value: f?.linked_name ?? '-',
													assigned_id: f?.linked_id ?? null,
												},
												// source: { value: 'Zeli' },
												// type: { value: f.file_type, icon: FileIconType(f.file_type) },
												source_url_id: { value: f.source_url },
												upload_status_id: 1,
												edit: { value: '', menu: true },
												document_category: f.document_category,
												sk: f.dynamo_sk											
											};
										});
										setFileTableData(files);
									}
									if (section_name === 'CANDIDATE_STAGES') {
										// process data to state
										setCandidateStageOptions(response);
									}
									setLoadingData(false);
									setRefetchData(false);
								}
							})
							.catch((error) => {
								console.error('error: ', error);
								enqueueSnackbar('Error fetching job details. Please try again later', { variant: 'error' });
								setLoadingData(false);
								setRefetchData(false);
							});
					};
					void handleGetData();
				}
			}
		}
	}, [compound_component, refetchData]);

	const isNotFound = false;

	// temp / maybe permanent
	// const [isShowingDetails, setIsShowingDetails] = useState(includeCandidates && jobOpeningCandidates.length ? false : true);
	const [isShowingDetails, setIsShowingDetails] = useState(true);

	const handleHeaderAction = (e) => {
		setAnchorMenuEl(e.currentTarget);
	};

	const handleCloseMenuActions = () => {
		setAnchorMenuEl(null);
	};

	const handleOpenEditJobOpeningModal = () => {
		handleCloseMenuActions();
		setOpenModal({ modalType: MODAL_TYPES.EDIT_JOB_OPENING, data: { jobOpeningDetails, setRefetchData } });
	};

	const handleCloseJobOpening = () => {
		if (jobOpeningDetails?.job_opening_id) {
			mutateCloseReopenJobOpening(
				{ job_opening_id: jobOpeningDetails.job_opening_id, job_opening_status_id: job_opening_status_id === JOB_STATUS.OPEN ? JOB_STATUS.CLOSED : JOB_STATUS.OPEN },
				{
					onSuccess: () => {
						handleCloseMenuActions();
						toggleTriggerUpdate && toggleTriggerUpdate();
						setRefetchData(true);
					},
				}
			);
		}
	};

	const handleOpenDeleteDialog = () => {
		handleCloseMenuActions();
		handleOpenDialog({
			content: (
				<Stack alignItems='center' sx={{ textAlign: 'center' }}>
					<Typography>Are you sure you want to delete this job?</Typography>
					{/* <Typography>Deleted jobs will be stored for 30 days and can be found in your history.</Typography> */}
				</Stack>
			),
			handleConfirm: () => {
				if (jobOpeningDetails?.job_opening_id) {
					mutateDeleteJobOpening(jobOpeningDetails.job_opening_id, {
						onSuccess: () => {
							handleCloseDialog();
							handleRemoveCartById && handleRemoveCartById(outputCardId);
							toggleTriggerUpdate && toggleTriggerUpdate();
						},
					});
				}
			},
		});
	};

	const handleSetContext = async (job) => {
		const body = {
			conversation_id: conversationGuid,
			event_id: outputCardId,
			payload: {
				job: job
			},
			category: 'WSC_JOB_STATUS',
		};
		try {
			const response = await setChatContext(body);
		} catch (err) {
			console.error(err);
		}
	};

	const [filterByStatus, setFilterByStatus] = useState(null);

	const handleStatusClick = (_, status) => {
		const newFilterStatus = filterByStatus && filterByStatus.status_id === status.status_id ? null : status;
		setFilterByStatus(newFilterStatus);
	};

	const applyFilter = ({ inputData, comparator, filterTitle }) => {
		const stabilizedThis = inputData.map((el, index) => [el, index]);

		stabilizedThis.sort((a, b) => {
			const order = comparator(a[0], b[0]);
			if (order !== 0) return order;
			return a[1] - b[1];
		});
		inputData = stabilizedThis.map((el) => el[0]);

		if (filterByStatus) {
			inputData = inputData.filter((candidate) => {
				return candidate.stage.stage_id === filterByStatus.candidate_stage_id;
			});
		}

		return inputData;
	};

	const filteredCandidates = applyFilter({
		inputData: jobOpeningCandidates,
		comparator: getComparator(order, orderBy),
		filterByStatus,
	});

	const [candidateStatusMenuRef, setCandidateStatusMenuRef] = useState(null);

	const open = Boolean(candidateStatusMenuRef);
	const handleCandidateStatusClick = (e) => {
		setCandidateStatusMenuRef(e.currentTarget);
	};

	const fetchCandidateStageDetails = async () => {
		if (!getCandidateStageEndpoint.current) {
			return null;
		}

		try {
			const response = await AIGetAPIRequest(getCandidateStageEndpoint.current);
			if (response !== null) {
				const c = response.map((r, i) => {
					return {
						candidate_id: r.candidate_id,
						name: r.friendly_name,
						score: r.general_score,
						stage: {
							stage_id: r.candidate_stage_id,
							name: r.candidate_stage,
						},
					};
				});
				setJobOpeningCandidates(c);
			}
		} catch (e) {
			console.error(e);
		}
	};

	const fetchCandidateSummary = async () => {
		if (!getCandidateSummaryEndpoint.current) {
			return null;
		}

		try {
			const response = await AIGetAPIRequest(getCandidateSummaryEndpoint.current);
			if (response !== null) {
				setCandidateStageSummary(response);
			}
		} catch (e) {
			console.error(e);
		}
	};

	const handleCandidateStatusMenuOptionClick = async (key, candidate) => {
		try {
			await AIPostAPIRequest(updateCandidateStageEndpoint.current, {
				job_id: jobOpeningDetails.job_opening_id,
				candidate_id: candidate.candidate_id,
				stage_id: key,
			});
			await enqueueSnackbar('Note updated!');
			await fetchCandidateStageDetails();
			await fetchCandidateSummary();
		} catch (e) {
			console.error(e);
			await enqueueSnackbar('Unable to update candidate note. Please try again later', { variant: 'error' });
			// await fetchNotes();
		}
		// close the menu
		// setCandidateStatusMenuRef(null);
	};

	const handleCandidateStatusMenuClose = () => {
		setCandidateStatusMenuRef(null);
	};

	const { job_title, client_email, summary, contact, client_phone, client_name, job_opening_status_id, utc_date_updated } = jobOpeningDetails;

	const handleCandidateRowClick = (_, candidate) => {
		clickRequestAction(undefined, 'WSC_CANDIDATE_PROFILE', {
			...(candidate?.candidate_id && { candidate_id: candidate?.candidate_id }),
			...(jobOpeningDetails?.job_opening_id && { job_id: jobOpeningDetails?.job_opening_id }),
		});
	};

	const handleClientClick = () => {
		return jobOpeningDetails?.client_id ? clickRequestAction(null, 'CLIENT_DETAILS', jobOpeningDetails?.client_id) : null;
	};

	const handleDeleteDocument = (document) => {
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
					enqueueSnackbar('Error deleting document. Please try again later.', { variant: 'error' });
					setLoadingData(false);
				});
		};
		void postDelete();
	};

	const DetailsComponent = compoundComponents['JOB_OPENING_COMPANY'];
	const FilesComponent = compoundComponents['JOB_OPENING_DOCUMENTS'];

	const sortedData = useMemo(() => {
		return fileTableData?.toSorted((a, b) => {
			const valueA = a[orderBy]?.value;
			const valueB = b[orderBy]?.value;
			return getCustomComparator({ valueA, valueB, order, orderType, timeFormat: 'DD/MM/YYYY' });
		});
	}, [fileTableData, order, orderBy, orderType]);

	return (
		<OutputCard showTitle={false} title={`${job_title || '-'}, ${client_name || '-'}`} showActions={false} headerAction={handleHeaderAction} headerActionIcon={<MenuIcon />} showHeaderMenu isATSCard closeCard={() => handleCardClose({ id: outputCardId })}>
			<Stack mb={2} flexDirection={'row'} alignItems={'center'} gap={1}>
				<Stack flexDirection={'row'} alignItems={'center'} gap={2} sx={{ width: '100%' }}>
					<StyledAvatar variant='rounded'>{<WorkOutlineIcon />}</StyledAvatar>
					<Stack gap={0.5} flexWrap={'wrap'} flexDirection={'row'} alignItems={'center'} sx={{ whiteSpace: 'nowrap' }}>
						<Typography sx={{ fontWeight: '400', fontSize: '1.125rem' }}>{job_title || '-'}, </Typography>
						<Typography onClick={handleClientClick} sx={{ fontWeight: '400', fontSize: '1.125rem', '&:hover': jobOpeningDetails?.client_id && { textDecoration: 'underline', cursor: 'pointer', color: '#9859E0' } }}>
							{'' + client_name || '-'}
						</Typography>
					</Stack>
				</Stack>
				<IconButton aria-label='settings' onClick={handleHeaderAction}>
					{<MenuIcon />}
				</IconButton>
			</Stack>
			{renderDialog}
			{renderModal}
			{/* menu actions */}
			<Menu
				id='basic-menu'
				anchorEl={anchorMenuEl}
				open={!!anchorMenuEl}
				onClose={handleCloseMenuActions}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				{job_opening_status_id !== JOB_STATUS.CLOSED && (
					<MenuItem
						onClick={() => {
							setIsShowingDetails((prev) => !prev);
							handleCloseMenuActions();
						}}
					>
						{isShowingDetails ? 'Hide details' : 'View details'}
					</MenuItem>
				)}
				{job_opening_status_id !== JOB_STATUS.CLOSED && <MenuItem onClick={handleOpenEditJobOpeningModal}>Edit details</MenuItem>}
				<MenuItem onClick={handleCloseJobOpening}>
					<Stack direction='row' alignItems='center' gap={1}>
						{job_opening_status_id === JOB_STATUS.CLOSED ? 'Re-open' : 'Close'} job {isPendingCloseReopenJobOpening ? <CircularProgress size={10} /> : null}
					</Stack>
				</MenuItem>
				{job_opening_status_id !== JOB_STATUS.CLOSED && <MenuItem onClick={handleOpenDeleteDialog}>Delete job</MenuItem>}
			</Menu>
			{/* contact details */}
			<Stack direction='column' gap={1.5}>
				{loadingData && <Loading />}
				{job_opening_status_id === JOB_STATUS.CLOSED ? (
					<Box p={2} sx={{ borderRadius: '8px', background: '#FFB9B1' }}>
						<Text14DeepCoveWeight600>Job closed {moment.utc(utc_date_updated).local().format('DD/MM/YYYY')}</Text14DeepCoveWeight600>
					</Box>
				) : null}
				{isShowingDetails && (
					<>
						{/* <DetailsComponent contact={contact} email={email} phone={phone} summary={summary} showSummary showContactBox={showContactBox} showContact /> */}
						<JobDetails info={jobOpeningDetails} />
					</>
				)}
				{fileTableData && <FilesComponent fileTableData={sortedData} TABLE_HEAD={TABLE_HEAD} includeFileMenu={includeFileMenu} viewFile={outputCardAction} handleDelete={handleDeleteDocument} clickRequestAction={clickRequestAction} />}
				{/*
					"0": {
							"candidate_stage_id": 1,
							"candidate_stage": "Applied",
							"candidate_stage_count": 1
						}
				*/}
				{includeCandidates && (
					<>
						<StyledSectionHeader>
							<Typography variant='body2'>{enableCandidateFiltering ? 'Filter candidates' : 'Candidate statistics'}:</Typography>
						</StyledSectionHeader>
						<Stack direction='row' gap={1}>
							{/* {candidateStatistics.map((candidate) => {
								// This is built for mock data and will need to be revised when real data is delivered
								const count = jobOpeningCandidates.filter((cd) => cd.stage.stage_id === candidate.status_id).length;
								const isSelected = filterByStatus && filterByStatus.status_id === candidate.status_id;
								return (
									<CandidateStatusOption key={`candidate-${candidate.id}`} width={`calc(100% / ${candidateStatistics.length})`} {...(enableCandidateFiltering && { onClick: (e) => handleStatusClick(e, candidate) })} isSelected={isSelected}>
										<Typography variant='body2'>{candidate.label}</Typography>
										<Typography variant='body1'>{count}</Typography>
									</CandidateStatusOption>
								);
							})} */}
							{candidateStageOptions.map((candidate) => {
								// This is built for mock data and will need to be revised when real data is delivered
								const count = candidateStageSummary.filter((cs) => cs.candidate_stage_id === candidate.candidate_stage_id).length;
								const isSelected = filterByStatus && filterByStatus.status_id === candidate.candidate_stage_id;
								return (
									<CandidateStatusOption
										key={`candidate-${candidate.candidate_stage_id}`}
										width={candidateStageSummary.length > 0 ? `calc(100% / ${candidateStageSummary.length})` : '100%'}
										{...(enableCandidateFiltering && { onClick: (e) => handleStatusClick(e, candidate) })}
										isselected={isSelected}
									>
										{/* {console.log('Candidate Stage Summary Data is >>> ', candidateStageSummary)} */}
										<Typography variant='body2'>{candidate.candidate_stage}</Typography>
										<Typography variant='body1'>{count}</Typography>
									</CandidateStatusOption>
								);
							})}
						</Stack>

						<Stack direction='column' sx={{ maxHeight: '560px', overflowY: 'auto' }}>
							{filteredCandidates.map((candidate, i) => {
								return (
									<Stack key={`candidate-${i}`} direction='row' py={2} gap={2} alignItems='center' justifyContent='center'>
										<Box onClick={(e) => handleCandidateRowClick(e, candidate)} sx={{ cursor: 'pointer', display: 'flex', flex: 1 }}>
											<Typography sx={{ '&:hover': { textDecoration: 'underline', color: '#9859E0', cursor: 'pointer' } }} variant='body1' flex={2}>
												{candidate.name}
											</Typography>
										</Box>
										<CandidateScore
											sx={{
												// This will need to be revised when real data is delivered
												background: (theme) => alpha(theme.palette.primary.main, candidate.stage.stage_id > 10 ? 0.1 : candidate.stage.stage_id / 10),
											}}
										>
											{candidate.score || '0'}
										</CandidateScore>
										{/* <>
											<CandidateStatusButton
												variant='outlined'
												endIcon={<ChevronRightRoundedIcon />}
												{...(includeCandidateStatusFunctionalty && {
													onClick: handleCandidateStatusClick,
												})}
											>
												{candidate.stage.name}
											</CandidateStatusButton>
											<Menu
												anchorEl={candidateStatusMenuRef}
												open={open}
												onClose={handleCandidateStatusMenuClose}
												TransitionComponent={Fade}
												anchorOrigin={{
													vertical: 'top',
													horizontal: 'right',
												}}
												transformOrigin={{
													vertical: 'bottom',
													horizontal: 'right',
												}}
											>
												{candidateStageOptions.map((stage, index) => (
													<MenuItem key={`stageOption-${index}`} onClick={(e) => handleCandidateStatusMenuOptionClick(e, stage.candidate_stage_id, candidate)}>
														{stage.candidate_stage}
													</MenuItem>
												))}
											</Menu>
										</> */}
										<StageOptions candidate={candidate} candidateStageOptions={candidateStageOptions} updateCandidateStageEndpoint={updateCandidateStageEndpoint} handleCandidateStatusMenuOptionClick={handleCandidateStatusMenuOptionClick} />
									</Stack>
								);
							})}
						</Stack>
					</>
				)}
				<Stack direction='row' alignItems='center' justifyContent='flex-end' gap={2}>
					<UserFeedback type={type} event_id={event_id} />
				</Stack>
			</Stack>
		</OutputCard>
	);
};

// Temporary props to hide / disable certain elements during development
JobOpeningOutputCard.propTypes = {
	includeCandidates: PropTypes.bool,
	includeCandidateStatusFunctionalty: PropTypes.bool,
	enableCandidateFiltering: PropTypes.bool,
	showContactBox: PropTypes.bool,
	includeFileMenu: PropTypes.bool,
};

export default JobOpeningOutputCard;

/*
    body elements separated to own components
    Should be moved to new files
*/

const StageOptions = ({
	candidate,
	candidateStageOptions,
	// handleCandidateStatusClick,
	updateCandidateStageEndpoint,
	handleCandidateStatusMenuOptionClick,
}) => {
	const [candidateStatusMenuRef, setCandidateStatusMenuRef] = useState(null);

	const open = Boolean(candidateStatusMenuRef);
	const handleCandidateStatusClick = (e) => {
		setCandidateStatusMenuRef(e.currentTarget);
	};

	const optionClick = async (_, key, candidate) => {
		await handleCandidateStatusMenuOptionClick(key, candidate);
		// close the menu
		setCandidateStatusMenuRef(null);
	};

	const handleCandidateStatusMenuClose = () => {
		setCandidateStatusMenuRef(null);
	};

	return (
		<>
			<CandidateStatusButton variant='outlined' endIcon={<ChevronRightRoundedIcon />} onClick={handleCandidateStatusClick}>
				{candidate.stage.name}
			</CandidateStatusButton>
			<Menu
				anchorEl={candidateStatusMenuRef}
				open={open}
				onClose={handleCandidateStatusMenuClose}
				TransitionComponent={Fade}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
			>
				{candidateStageOptions.map((stage, index) => (
					<MenuItem key={`stageOption-${index}`} onClick={(e) => optionClick(e, stage.candidate_stage_id, candidate)}>
						{stage.candidate_stage}
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

const JobOpeningFiles = ({ fileTableData, TABLE_HEAD, includeFileMenu, viewFile, handleDelete, clickRequestAction }) => {
	const handleRowClick = async (_, view_file) => {
		if (clickRequestAction && !view_file?.source_url_id?.value) {
			clickRequestAction(undefined, 'EDIT_DOCUMENT_CONTENT', { document_id: view_file?.document_id, sk: fileTableData[0].sk });
			return;
		}
		if (view_file.source_url_id?.value) {
			// console.log('Details are > ', view_file)
			const target_url = await getSourceUrl({ source_type: 1, url: view_file.source_url_id?.value?.split('?')[0] });
			if (target_url) {
				clickRequestAction(undefined, 'VIEW_DOCUMENT', {document_category: view_file?.category?.value, document_id: view_file?.document_id, name: view_file?.assigned?.value, id: view_file?.assigned?.assigned_id, sk: fileTableData[0].sk }, target_url);
			}
		}
	};

	return (
		<CustomTable dataFiltered={[]} tableData={fileTableData} tableHead={TABLE_HEAD} isNotFound={fileTableData.length < 1}>
			{fileTableData.map((row, index) => (
				<CustomTableRow
					key={index}
					row={row}
					enableRowClick={true}
					// menuComponent={includeFileMenu && <FileMenu file={row} handleClick={handleFileDeleteButtonClick} />}
					isNotFound={!fileTableData.length}
					handleRowClick={handleRowClick}
					menuComponent={
						includeFileMenu && (
							<TableCellMenu
								item={row}
								options={[
									{
										icon: 'DELETE',
										label: 'Delete',
										clickEvent: (e, item) => {
											handleDelete(item);
										},
									},
								]}
							/>
						)
					}
				/>
			))}
		</CustomTable>
	);
};

const FileMenu = ({ file, handleClick }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const isOpen = Boolean(anchorEl);

	const handleButtonClick = (e) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
	};

	const handleItemClick = (e, id) => {
		e.stopPropagation();
		handleClick(e, id);
		setAnchorEl(null);
	};

	return (
		<>
			<IconButton onClick={handleButtonClick}>
				<MoreVertRoundedIcon sx={{ color: '#9859E0' }} />
			</IconButton>
			<Menu anchorEl={anchorEl} onClose={handleMenuClose} open={isOpen}>
				<MenuItem onClick={(e) => handleItemClick(e, file.document_id)}>
					<>
						<Typography variant='body1'>Delete</Typography>
						<DeleteForeverRoundedIcon />
					</>
				</MenuItem>
			</Menu>
		</>
	);
};
