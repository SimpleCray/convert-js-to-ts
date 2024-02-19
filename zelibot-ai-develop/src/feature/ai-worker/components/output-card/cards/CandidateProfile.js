// Job status but v2
// All mocked to figure out the pieces
import { useEffect, useState, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { styled, alpha } from '@mui/material/styles';
import { Stack, Box, Typography, Button, Link, Grid, Menu, MenuItem } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { useSnackbar } from 'notistack';
import { AIGetAPIRequest, AIPostAPIRequest, setChatContext } from 'src/feature/ai-worker/constants';
import { useTable } from 'src/components/table';
import OutputCard from '../OutputCard';
import { TableRow as CustomTableRow, Table as CustomTable } from '../../ats';
import { StyledSectionHeader } from '../ATSCardSytles';
import Contact from '../../ats/contact/Contact';
import { Loading } from 'src/components/loading-screen';
import { StyledTextArea } from '../OutputCardStyles';
import { StyledButton } from './CardStyles';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';

import Details from '../../ats/contact/Details';
import TableCellMenu from '../../ats/table-cell-menu/TableCellMenu';
import TableRowSubComponent from '../../ats/table-card/TableSubRow';
import { makeReadable } from 'src/feature/ai-worker/helpers/makeReadable';
import { ORDER_TYPE, getCustomComparator } from '../../../../../components/table';
import TableHeadAction from '../../ats/table-card/TableHeadAction';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../../../../redux/slices/modal';
import { set } from 'lodash';
import { Text14DeepCoveWeight600 } from '../../../../../components/common/TypographyStyled';
import moment from 'moment';
import { clearRefreshComponent, refreshComponent as setRefreshComponent } from '../../../../../redux/slices/refresh';
// import CandidateDetails from './CandidateDetails';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';
import { getSourceUrl } from '../../../../../utils/common';

// Styled components to be moved later
const CandidateStatusOption = styled(Stack)(({ theme }) => ({
	direction: 'column',
	justifyContent: 'end',
	alignItems: 'center',
	gap: theme.spacing(1),
	paddingBottom: theme.spacing(2),
	paddingTop: theme.spacing(1.5),
	cursor: 'pointer',
	'& > .MuiTypography-body1': {
		fontWeight: 600,
	},
	'& > .MuiTypography-body2': {
		textAlign: 'center',
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

const CandidateProfileOutputCard = ({
	target_url,
	compound_component,
	outputCardAction,
	data,
	// all temp flags
	showContactBox = true,
	showScoreSection = true,
	includeFileMenu = true,
	clickRequestAction,
	type,
	event_id,
	handleCardClose,
	conversationGuid,
	...props
}) => {
	const { enqueueSnackbar } = useSnackbar();

	const [candidateDetails, setCandidateDetails] = useState('');

	const [candidateApplications, setCandidateApplications] = useState([]);

	const [loadingData, setLoadingData] = useState(false);
	const [refetchData, setRefetchData] = useState(true);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const refreshComponent = useSelector((state) => state.refresh.component);

	const handleClick = (event) => {
		if (!candidateApplications?.length) {
			clickRequestAction(undefined, 'SEND_INVITATION_EMAIL', { application: null, candidateDetails });
			return;
		}
		// if (candidateApplications.length === 1) {
		// 	clickRequestAction(undefined, 'SEND_INVITATION_EMAIL', {application: candidateApplications[0], candidateDetails});
		// 	return;
		// }
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const deleteCandidateDocumentEndpoint = useRef(null);
	// both to GET and POST
	const candidateNotesEndpoint = useRef(null);

	const { order, orderBy, onSort, orderType } = useTable({
		defaultOrderBy: 'document',
		defaultOrder: 'asc',
		defaultOrderType: ORDER_TYPE.ALPHABETICALLY,
	});

	const TABLE_HEAD = [
		{ id: 'category', label: <TableHeadAction id='category' order={order} orderBy={orderBy} onSort={onSort} title='Document' orderType={ORDER_TYPE.ALPHABETICALLY} />, align: 'left' },
		{ id: 'document', label: <TableHeadAction id='document' order={order} orderBy={orderBy} onSort={onSort} title='File Name' orderType={ORDER_TYPE.ALPHABETICALLY} />, align: 'left' },
		{ id: 'date', label: <TableHeadAction id='date' order={order} orderBy={orderBy} onSort={onSort} title='Date' orderType={ORDER_TYPE.TIME} />, align: 'center' },
		// { id: 'source', label: 'Source', align: 'center' },
		// { id: 'type', label: 'Type', align: 'center' },
		...((includeFileMenu && [{ id: 'edit', label: 'Edit', align: 'center' }]) || []),
	];

	const [fileTableData, setFileTableData] = useState([]);

	// Hacks for candidate notes
	const { register, handleSubmit, setValue } = useForm();
	const [notes, setNotes] = useState(['-']);
	const [editNotes, setEditNotes] = useState(false);
	const handleEditClick = () => {
		setEditNotes(true);
	};
	const isNotFound = false;
	const [anchorMenuEl, setAnchorMenuEl] = useState(null);
	const [candidateDeleted, setCandidateDeleted] = useState(false);
	const [candidateDisabled, setCandidateDisabled] = useState(false);

	// temp / maybe permanent
	const [showScores, setShowScores] = useState(true);
	const dispatch = useDispatch();

	const onSubmit = async (data) => {
		setEditNotes(false);
		if (candidateNotesEndpoint.current) {
			if (data.textArea && data.textArea.length) {
				try {
					await AIPostAPIRequest(candidateNotesEndpoint.current, {
						candidate_id: candidateDetails.candidate_id,
						notes: data.textArea,
					});
					await enqueueSnackbar('Note updated!');
					await fetchNotes();
				} catch (e) {
					console.error(e);
					await enqueueSnackbar('Unable to update candidate note. Please try again later', { variant: 'error' });
					await fetchNotes();
				}
			}
		}
	};

	const handleSetContext = async (candidate) => {
		const body = {
			conversation_id: conversationGuid,
			event_id: props.id,
			payload: {
				candidate: candidate
			},
			category: 'WSC_CANDIDATE_PROFILE',
		};
		try {
			const response = await setChatContext(body);
		} catch (err) {
			console.error(err);
		}
	};

	const handleChange = (event) => {
		setNotes(event.target.value);
	};

	const fetchNotes = async () => {
		if (!candidateNotesEndpoint.current) {
			return null;
		}
		const [response] = await AIGetAPIRequest(candidateNotesEndpoint.current);
		setValue('textArea', response?.notes);
		setNotes(response.notes);
	};

	useEffect(() => {
		if (compound_component && refetchData) {
			setLoadingData(true);
			for (const comp of compound_component) {
				const { section_name, target_api_endpoint, target_path } = comp;
				const API = process.env[`API_${target_api_endpoint}`];
				const endpoint = `${API}/${target_path}`;

				if (section_name === 'DELETE_CANDIDATE_DOCUMENTS') {
					deleteCandidateDocumentEndpoint.current = endpoint;
				}

				setLoadingData(true);
				// const API = process.env[`API_${target_api_endpoint}`];
				if (section_name !== 'DELETE_CANDIDATE_DOCUMENTS') {
					const handleGetData = async () => {
						// await AIGetAPIRequest(`${API}/${target_path}?candidate_id=${candidateId.split('=')[1]}`)
						console.debug(`${API}/${target_path}`);
						await AIGetAPIRequest(`${API}/${target_path}`)
							.then((response) => {
								if (response !== null) {
									if (section_name === 'CANDIDATE_DETAILS') {
										const [candidate] = response;
										setCandidateDetails(candidate);
										window.sessionStorage.setItem('candidate_details', JSON.stringify(candidate));
										handleSetContext(candidate)
										// console.log('Candidate details are ', candidate)
									}
									if (section_name === 'CANDIDATE_NOTES') {
										candidateNotesEndpoint.current = endpoint;
										fetchNotes();
										// setNotes(response.notes);
									}
									if (section_name === 'CANDIDATE_SCORE') {
										if (response.length) {
											setCandidateApplications(response);
										}
									}
									if (section_name === 'CANDIDATE_DOCUMENTS') {
										const files = response.map((f, i) => {
											// console.log('Candidate details are ', candidateDetails)
											return {
												document_id: f.user_document_id || i,
												assigned: {
													value: candidateDetails?.friendly_name,
													assigned_id: JSON.parse(window.sessionStorage.getItem('candidate_details'))?.candidate_id,
												},
												category: { value: makeReadable(f.document_category) },
												document: { icon: FileIconType(f.file_type || 'docx'), value: f.file_name || 'Unknown file' },
												date: { value: f.utc_date_created ? format(new Date(f.utc_date_created), 'dd/MM/yyyy') : '-' },
												// source: { value: 'Zeli' },
												// type: { value: f.file_type || 'docx', icon: FileIconType(f.file_type || 'docx') },
												source_url_id: { value: f.source_url || '-' },
												upload_status_id: 1,
												edit: { value: '', menu: true },
												sk: f.dynamo_sk
											};
										});
										setFileTableData(files);
									}
								}
								setLoadingData(false);
								setRefetchData(false);
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

	useEffect(() => {
		if (refreshComponent === 'CANDIDATE_PROFILE' || refreshComponent === 'PRE-SCREENING-INTERVIEW') {
			// console.log('REFETCHING THE DATA!!!')
			setRefetchData(true);
			dispatch(clearRefreshComponent());
		}
	}, [refreshComponent]);

	const handleHeaderAction = (e) => {
		// setShowScores(!showScores);
		// dispatch(openModal({component: 'EDIT CANDIDATE'}))
		window.sessionStorage.setItem('candidate_details', JSON.stringify(candidateDetails));
		setAnchorMenuEl(e.currentTarget);
	};

	const handleCloseMenuActions = () => {
		setAnchorMenuEl(null);
	};

	const handleJobClick = (score) => {
		// console.log('Job clicked', score)
		if (score.job_opening_id) {
			clickRequestAction(undefined, 'JOB_OPENING', { id: score?.job_opening_id, title: score?.job_title });
		}
		return;
	};

	const handleCompanyClick = (company) => {
		// console.log('Company details are >>> ', company);
		clickRequestAction(null, 'CLIENT_DETAILS', company)
	}

	const { email: email, friendly_name: name, first_name: firstName, last_name: lastName, mobile_number: phone } = candidateDetails || {};

	const summary = (jobTitle, company, score) => {
		return (
			<Typography sx={{ cursor: 'pointer' }} variant='body2'>
				<Link onClick={() => handleJobClick(score)}>{jobTitle || 'unknown'}</Link> at <Link onClick={() => handleCompanyClick(score?.client_id)}>{company || 'unknown'}</Link>
			</Typography>
		);
	};

	const handleDeleteDocument = (document, candidateId) => {
		const postDelete = async () => {
			await AIPostAPIRequest(deleteCandidateDocumentEndpoint.current, {
				// candidate_id: candidateId,
				user_document_id: document.document_id,
			})
				.then((response) => {
					enqueueSnackbar('Candidate deleted');
					setRefetchData(true);
				})
				.catch((error) => {
					console.error('error: ', error);
					enqueueSnackbar('Error deleting candidate. Please try again later.', { variant: 'error' });
					setLoadingData(false);
				});
		};
		void postDelete();
	};

	const handleApplicationClicked = (application) => {
		// console.log('Prescreening Application is >>> ', {candidateDetails, application})
		// console.log('Candidate Details is >>> ', candidateDetails)
		clickRequestAction(undefined, 'SEND_INVITATION_EMAIL', { application, candidateDetails });
		handleClose();
	};

	const handleEditDetailsClick = () => {
		dispatch(openModal({ component: 'EDIT CANDIDATE' }));
		handleCloseMenuActions();
	};

	const handleDeactivateCandidate = (status) => {
		AIPostAPIRequest(`${process.env.API_SET_CANDIDATE_STATUS}`, {
			candidate_id: candidateDetails.candidate_id,
			candidate_status_id: status,
		}).then((response) => {
			if (status === 1) {
				enqueueSnackbar('Candidate activated');
				setCandidateDetails({
					...candidateDetails,
					candidate_status_id: 1,
				});
				setCandidateDisabled(false);
			} else {
				enqueueSnackbar('Candidate deactivated');
				setCandidateDetails({
					...candidateDetails,
					candidate_status_id: 2,
				});
				setCandidateDisabled(true);
			}
			// setRefetchData(true);
		});
		handleCloseMenuActions();
	};

	const handleCandidateDeleteClick = () => {
		AIPostAPIRequest(`${process.env.API_DELETE_CANDIDATE}`, {
			candidate_id: candidateDetails.candidate_id,
		})
			.then((response) => {
				enqueueSnackbar('Candidate successfully deleted');
				dispatch(setRefreshComponent({ component: 'WSC_CANDIDATE_LIST' }));
				setCandidateDeleted(true);
				// setRefetchData(true);
			})
			.catch((err) => {
				enqueueSnackbar('Error deleting candidate. Please try again later.', { variant: 'error' });
				// console.log('Error deleting candidate > ', err);
			});
		handleCloseMenuActions();
	};

	// const DetailsComponent = compoundComponents['JOB_OPENING_COMPANY'];
	// const FilesComponent = compoundComponents['JOB_OPENING_DOCUMENTS'];
	const sortedData = useMemo(() => {
		return fileTableData?.toSorted((a, b) => {
			const valueA = a[orderBy]?.value;
			const valueB = b[orderBy]?.value;
			return getCustomComparator({ valueA, valueB, order, orderType, timeFormat: 'DD/MM/YYYY' });
		});
	}, [fileTableData, order, orderBy, orderType]);

	const closeThiscard = () => {
		handleCardClose(props)
	}

	return (
		<OutputCard sx={{ display: candidateDeleted && 'none' }} title={`${name || firstName || lastName || ''}`} titleIcon={<PersonOutlineOutlinedIcon />} showActions={false} showHeaderMenu={!candidateDeleted} headerActionIcon={<MenuIcon />} headerAction={handleHeaderAction} isATSCard closeCard={closeThiscard}>
			{!candidateDeleted && (
				<Menu
					id='basic-menu'
					anchorEl={anchorMenuEl}
					open={!!anchorMenuEl}
					onClose={handleCloseMenuActions}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					<MenuItem onClick={() => handleEditDetailsClick()}>Edit details</MenuItem>
					<MenuItem onClick={() => handleDeactivateCandidate(candidateDetails?.candidate_status_id === 1 ? 2 : 1)}>{candidateDetails?.candidate_status_id === 1 ? 'Deactivate' : 'Re-activate'}</MenuItem>
					<MenuItem onClick={() => handleCandidateDeleteClick()}>Delete</MenuItem>
				</Menu>
			)}
			<Stack direction='column' gap={1.5}>
				{loadingData && <Loading />}

				<Details contact={name} email={email} phone={phone} showContactBox={showContactBox} showContact={false} />

				{candidateDeleted ? (
					<Box p={2} sx={{ borderRadius: '8px', background: '#FFB9B1' }}>
						<Text14DeepCoveWeight600>Candidate deleted {moment().format('DD/MM/YYYY')}</Text14DeepCoveWeight600>
					</Box>
				) : candidateDetails?.candidate_status_id === 2 ? (
					<Box p={2} sx={{ borderRadius: '8px', background: '#FFB9B1' }}>
						<Text14DeepCoveWeight600>Candidate deactivated {candidateDisabled ? moment().format('DD/MM/YYYY') : moment(candidateDetails.utc_date_updated).format('DD/MM/YYYY')}</Text14DeepCoveWeight600>
					</Box>
				) : (
					<></>
				)}
				<Stack direction='column' gap={1}>
					{candidateApplications.map((score, index) => {
						// Gross, do it better
						const scores = [];
						scores.push({ label: 'Skill', value: score.skill_score || 111 });
						scores.push({ label: 'Experience', value: score.experience_score || 111 });
						scores.push({ label: 'Relevance', value: score.job_title_score || 111 });
						scores.push({ label: 'Qualification', value: score.qualification_score || 111 });
						scores.push({ label: 'Technology', value: score.technology_score || 111 });
						scores.push({ label: 'Overall', value: score.general_score || 111 });
						if (score?.job_title && score?.company) {
							return (
								<div key={'candidate-applications-map-' + index}>
									<>{summary(score?.job_title || 'N/A', score?.company || 'Unknown', score)}</>
									<Stack direction='row' sx={{ borderTop: (theme) => `1px solid ${theme.palette.grey[200]}`, gap: (theme) => theme.spacing(1) }}>
										{scores.map((s) => {
											return (
												<CandidateStatusOption key={`candidate-${s.label}`} width={`calc(100% / ${scores.length})`}>
													<Typography variant='body2'>{s.label}</Typography>
													{s.label === 'Overall' ? (
														<CandidateScore
															sx={{
																background: (theme) => alpha(theme.palette.primary.main, s.value < 10 || s.value === 111 ? 0.1 : s.value / 100),
															}}
														>
															{s.value === 111 ? '-' : s.value}
														</CandidateScore>
													) : (
														<Typography variant='body1'>{s.value === 111 ? '-' : s.value}</Typography>
													)}
												</CandidateStatusOption>
											);
										})}
									</Stack>
								</div>
							);
						} else {
							return <div key={'candidate-applications-map-' + index}></div>;
						}
					})}
				</Stack>

				{/* {notes && ( */}
				<Box pb={1.5}>
					<StyledSectionHeader sx={{ background: (theme) => theme.palette.primary.lighter, color: '#030D3A' }}>
						<Typography variant='body2' sx={{ color: '#21054C', fontWeight: '600' }}>
							Notes
						</Typography>
					</StyledSectionHeader>
					{/* {notes.map((note) => <Typography key={note.id} p={1}>{note.body}</Typography>)} */}
					{editNotes && (
						<Grid container display={'flex'} flexDirection={'column'} justifyContent={'center'}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<StyledTextArea>
									<TextareaAutosize id={'textArea'} value={notes} minRows={12} {...register('textArea')} onChange={handleChange} />
									<Grid container display={'flex'} justifyContent={'flex-start'}>
										<StyledButton variant={'outlined'} color={'secondary'} onClick={() => setEditNotes(false)}>
											Cancel
										</StyledButton>
										<StyledButton variant={'contained'} color='primary' type='submit'>
											Save
										</StyledButton>
									</Grid>
								</StyledTextArea>
							</form>
						</Grid>
					)}
					{!editNotes && (
						<>
							<Stack direction='row' justifyContent='space-between' py={1}>
								<>{notes || '-'}</>
								<ModeEditOutlineOutlinedIcon onClick={handleEditClick} sx={{ cursor: 'pointer' }} />
							</Stack>
						</>
					)}
				</Box>
				{/* )} */}

				{fileTableData && (
					<CandidateFiles candidateName={name} fileTableData={sortedData} TABLE_HEAD={TABLE_HEAD} includeFileMenu={includeFileMenu} viewFile={clickRequestAction} deleteEndpoint={deleteCandidateDocumentEndpoint.current} handleDelete={handleDeleteDocument} candidateId={candidateDetails?.candidate_id} />
				)}
				<Box height={3}></Box>
				<Stack flexDirection={'row'} justifyContent={'flex-end'} alignItems={'center'} gap={2}>
					<Button id='basic-button' aria-controls={open ? 'basic-menu' : undefined} aria-haspopup='true' aria-expanded={open ? 'true' : undefined} onClick={handleClick} sx={{ padding: '8px 16px', fontSize: '14px', fontWeight: 600, backgroundColor: '#170058' }} variant='contained'>
						<span style={{ marginRight: '5px' }}>Invite for prescreening</span>
						<VideoCameraFrontIcon sx={{ color: 'white', height: '18px', width: 'auto' }} />
					</Button>
					<UserFeedback type={type} event_id={event_id} />
					<Menu
						id='basic-menu'
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							'aria-labelledby': 'basic-button',
						}}
					>
						<MenuItem sx={{ color: '#9859E0' }} onClick={() => handleApplicationClicked(null)}>
							General pre-screening
						</MenuItem>
						{candidateApplications.map((application, index) => {
							return (
								<MenuItem key={'candidate-applications-job-title-key-' + index} sx={{ color: '#9859E0' }} onClick={() => handleApplicationClicked(application)}>
									{application?.job_title}
								</MenuItem>
							);
						})}
					</Menu>
				</Stack>
			</Stack>
		</OutputCard>
	);
};

// Temporary props to hide / disable certain elements during development
CandidateProfileOutputCard.propTypes = {
	showContactBox: PropTypes.bool,
	showScoreSection: PropTypes.bool,
	includeFileMenu: PropTypes.bool,
};

export default CandidateProfileOutputCard;

/*
	body elements separated to own components
	Should be moved to new files
*/
const CandidateDetails = ({ contact, email, phone, summary, jobTitle, company, showContact, showContactBox }) => {
	const renderLink = (title, company) => {
		return (
			<>
				<Link>{title || 'unknown'}</Link> at <Link>{company || 'unknown'}</Link>
			</>
		);
	};

	return (
		<>
			<Stack direction='row' justifyContent='space-between'>
				<Box flex={3}>
					{contact && showContact && (
						<Box>
							<Typography variant='body1' fontWeight={600}>
								{contact}
							</Typography>
						</Box>
					)}
					{email && (
						<Box>
							<Typography variant='body1' fontWeight={600} component='span'>
								Email:&nbsp;
							</Typography>
							<Typography
								sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}
								onClick={() => {
									window.open(`mailto:${email}`);
									return;
								}}
								component='span'
								variant='body1'
								color={(theme) => theme.palette.primary.light}
							>
								{email}
							</Typography>
						</Box>
					)}
					{phone && (
						<Box>
							<Typography variant='body1' fontWeight={600} component='span'>
								Phone:&nbsp;
							</Typography>
							<Typography component='span' variant='body1' color={(theme) => theme.palette.primary.light}>
								{phone}
							</Typography>
						</Box>
					)}
				</Box>

				{showContactBox && <Contact title='Contact' email={email} phone={phone} />}
			</Stack>
			{(jobTitle || company) && <Typography variant='body2'>{renderLink(jobTitle, company)}</Typography>}
		</>
	);
};

const CandidateFiles = ({ candidateName, fileTableData, TABLE_HEAD, includeFileMenu, viewFile, deleteEndpoint, handleDelete, candidateId }) => {
	return (
		<CustomTable dataFiltered={[]} tableData={fileTableData} tableHead={TABLE_HEAD} isNotFound={fileTableData.length < 1}>
			{fileTableData.map((row, index) => (
				<FileTableRow name={candidateName} key={'candidate-profile-files-key-' + index} row={row} index={index} viewFile={viewFile} includeFileMenu={includeFileMenu} deleteEndpoint={deleteEndpoint} handleDelete={handleDelete} candidateId={candidateId} />
			))}
		</CustomTable>
	);
};

const FileTableRow = ({ name, row, index, viewFile, includeFileMenu, handleDelete, candidateId }) => {
	const { enqueueSnackbar } = useSnackbar();

	const handleRowClick = async (_, view_file) => {
		const target_url = await getSourceUrl({ source_type: 1, url: view_file.source_url_id.value.split('?')[0] });
		if (target_url) {
			// console.log('File data in candidate profile ', row)
			viewFile(undefined, 'VIEW_DOCUMENT', { name: name, id: row?.assigned?.assigned_id, document_category: row?.category?.value, sk: row?.sk }, target_url);
		}
	};

	const [isSubRowVisible, setIsSubRowVisible] = useState(false);

	const handleAssignClick = () => {
		setIsSubRowVisible(!isSubRowVisible);
	};

	return (
		<CustomTableRow
			key={index}
			row={row}
			enableRowClick={!!handleRowClick}
			menuComponent={
				includeFileMenu && (
					<TableCellMenu
						item={row}
						handleClick={(e) => {
							// console.log('clicked file menu opener thing');
							// e.preventDefault();
							// e.stopPropogation();
						}}
						options={[
							// {
							// 	icon: 'ASSIGN',
							// 	label: 'Assign',
							// 	clickEvent: (e, id) => {
							// 		handleAssignClick();
							// 	},
							// },
							{
								icon: 'DELETE',
								label: 'Delete',
								clickEvent: (e, item) => {
									handleDelete(item, candidateId);
								},
							},
						]}
					/>
				)
			}
			// isNotFound={!fileTableData.length}
			handleRowClick={handleRowClick}
			subRowVisible={isSubRowVisible}
		// subRowComponent={
		//     <TableRowSubComponent
		//         row={row}
		//         title='Assign file to:'
		//         options={options}
		//         inputOnChangeHandler={(e) => console.log('input changed')}
		//         inputClearHandler={() => console.log('input cleared')}
		//         submitHandler={(value) => {
		//             // make server request here?
		//             setIsSubRowVisible(false);
		//             enqueueSnackbar(`Moved file to ${value.label ?? value}`);
		//         }}
		//     />
		// }
		/>
	);
};
