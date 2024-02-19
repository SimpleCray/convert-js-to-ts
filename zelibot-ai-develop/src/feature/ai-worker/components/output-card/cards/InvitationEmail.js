import { useEffect, useState } from 'react';
import { Iconify } from '@zelibot/zeligate-ui';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, IconButton, Link, Stack, styled, Tooltip, Typography } from '@mui/material';
import { EditRounded } from '@mui/icons-material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { LoadingButton } from '@mui/lab';

import { StyledCardActions } from '../OutputCardStyles';
import { OutputCard } from '../../index';
import FormProvider, { RHFEditor } from '../../../../../components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { AIGetAPIRequest, AIPostAPIRequest } from '../../../constants';
import { useSnackbar } from 'notistack';
import { Text14DarkIndigoWeight600 } from '../../../../../components/common/TypographyStyled';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';
import useDialog from 'src/hooks/useDialog';
import { openModal } from 'src/redux/slices/modal';
import { useDispatch, useSelector } from 'react-redux';
import { clearRefreshComponent } from 'src/redux/slices/refresh';

const Links = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(2),
}));

const HighlightText = styled('span')(({ theme }) => ({
	fontSize: 'inherit',
	fontWeight: 'inherit !important',
	color: '#9859E0',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
	borderColor: '#9859E0',
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
	background: 'var(--BG-Gradient-Light, linear-gradient(132deg, #B46D8F 8.44%, #370F67 40.29%, #000 92.54%))',
	padding: theme.spacing(4),
	borderRadius: '16px 16px 0 0',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
	color: '#21054C',
	padding: theme.spacing(4),
	boxShadow: '0px 12px 24px 0px #0000001A',
}));

const StyledCard = styled(Card)(({ theme }) => ({
	padding: theme.spacing(2),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
	'& p': {
		margin: 0,
	},
	'& ul': {
		margin: 0,
	},
}));

const Footer = styled(Stack)(({ theme }) => ({
	fontSize: '12px',
	marginTop: theme.spacing(4),
}));

const DEFAULT_EMAIL_CONTENT = (country) =>
	`<p>During the screening interview you will be asked a few questions about your educational and professional background to determine if you are a good fit for this role.</p>
	<br>
	<p>The interview will be guided by Zeli, an AI helper.The interview can be completed in your own time when you feel comfortable. Zeli will ask you a short list of questions, and the interview will be recorded. Simply speak to Zeli as you would have a normal conversation. When you are ready to start, click on the button below.</p>
	<br>
	<p>By accepting this invite, I agree that:</p>
	<ul>
    ${country && country.toUpperCase() !== 'UNKNOWN' ? `<li>I have working rights in ${country}</li>` : ''}
    <li>I am happy to be recorded</li>
    <li>I am happy to be interviewed by Zeli</li>
	</ul>
	<br>
	<p>Go for it.</p>`;

function EditablePanel({ defaultData, data, edit, setData, setEdit, onSubmit, name = 'htmlContent' }) {
	const composeTextSchema = Yup.object().shape({
		title: Yup.string(),
		[name]: Yup.string().required('Text content is required.'),
	});

	const methods = useForm({
		resolver: yupResolver(composeTextSchema),
		defaultValues: {
			[name]: defaultData,
		},
		values: {
			[name]: data,
		},
	});

	const {
		setError,
		handleSubmit,
		values,
		formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
		getValues,
		setValue,
	} = methods;

	useEffect(() => {
		setValue(name, data || defaultData);
	}, [data, edit]);

	return (
		<>
			{!edit && (
				<StyledTypography variant='body1' onClick={() => setEdit(true)}>
					<div dangerouslySetInnerHTML={{ __html: data }}></div>
				</StyledTypography>
			)}
			{edit && (
				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<Grid container display={'flex'} spacing={1}>
						<Grid item xs={12}>
							<RHFEditor simple name={name} onEditorChange={() => { }} />
						</Grid>
						<Grid item xs={12} display={'flex'} justifyContent={'flex-end'}>
							<Button mr={1} variant='outlined' onClick={() => setEdit(false)}>
								Cancel
							</Button>
							<LoadingButton sx={{ backgroundColor: '#21044c', color: 'white', marginLeft: 1 }} type='submit' variant='contained' loading={isSubmitting}>
								Save
							</LoadingButton>
						</Grid>
					</Grid>
				</FormProvider>
			)}
		</>
	);
}

export default function InvitationEmail(props) {
	const {
		id,
		data: { application, candidateDetails },
		clickRequestAction,
		editable = false,
		type,
		event_id,
		handleCardClose
	} = props;

	const [isLoading, setLoading] = useState(true);
	const [candidateState, setCandidateState] = useState(candidateDetails);
	const [applicationState, setApplicationState] = useState(application);
	const [emailContent, setEmailContent] = useState(DEFAULT_EMAIL_CONTENT());
	const [editContent, setEditContent] = useState(false);
	const [applicationDetails, setApplicationDetails] = useState(null);
	const [isSent, setIsSent] = useState(false);
	const dispatch = useDispatch();
	const [sending, setSending] = useState(false);
	const { renderDialog, handleOpenDialog, handleCloseDialog } = useDialog({ isLoading: false });
	const refreshData = useSelector((state) => state.refresh);

	const { enqueueSnackbar } = useSnackbar();

	const handleOpenEmailDialog = () => {
		handleOpenDialog({
			content: (
				<Stack alignItems='center' sx={{ textAlign: 'center' }}>
					<Typography>Email address for {candidateState?.friendly_name} is missing.</Typography>
				</Stack>
			),
			approveText: 'Add email address',
			disapproveText: 'Cancel',
			handleDecline: () => {
				// Removing the invitation mail from the output cards array.
				dispatch(clearRefreshComponent());
				handleCloseDialog();
				handleCancelClicked();
			},
			handleConfirm: () => {
				dispatch(clearRefreshComponent());
				handleCloseDialog();
				dispatch(openModal({ component: 'EDIT CANDIDATE', data: 'email' }));
			},
		});
	};

	useEffect(() => {
		if (!candidateState?.email) {
			handleOpenEmailDialog();
		}
	}, [])

	useEffect(() => {
		if (refreshData?.component === 'PRE-SCREENING-INTERVIEW-EMAIL-MODAL') {
			handleOpenEmailDialog();
		} else if (refreshData?.component === 'PRE-SCREENING-INTERVIEW') {
			setCandidateState({
				...candidateState,
				email: refreshData?.data
			})
			setLoading(true);
			const endpointUrl = `${process.env.API_VIDEO_CHAT}/pre_screening_invite?candidate_id=${applicationState?.candidate_id}&job_id=${applicationState?.job_opening_id}`;
			AIGetAPIRequest(endpointUrl)
				.then((response) => {
					setApplicationDetails(response);
					setEmailContent(DEFAULT_EMAIL_CONTENT(response.country_name));
				})
				.catch((error) => {
					console.error(error, 'loading application details fails');
					enqueueSnackbar('Error fetching job details. Please try again later', { variant: 'error' });
				})
				.then(() => setLoading(false));
			// handleCancelClicked()
			dispatch(clearRefreshComponent());
		}
	}, [refreshData])

	useEffect(() => {
		if (!applicationState) {
			setEmailContent(DEFAULT_EMAIL_CONTENT());
			setLoading(false);
			return;
		}
		const endpointUrl = `${process.env.API_VIDEO_CHAT}/pre_screening_invite?candidate_id=${applicationState.candidate_id}&job_id=${applicationState.job_opening_id}`;
		AIGetAPIRequest(endpointUrl)
			.then((response) => {
				setApplicationDetails(response);
				setEmailContent(DEFAULT_EMAIL_CONTENT(response.country_name));
			})
			.catch((error) => {
				console.error(error, 'loading application details fails');
				enqueueSnackbar('Error fetching job details. Please try again later', { variant: 'error' });
			})
			.then(() => setLoading(false));
	}, [applicationState]);

	const onSubmit = (data) => {
		setEmailContent(data.htmlContent);
		setEditContent(false);
	};

	const handleSendEmail = () => {
		if (candidateState?.email) {
			setSending(true);
			const endpointUrl = `${process.env.API_VIDEO_CHAT}/pre_screening_invite?assistant_id=*`;
			const data = {
				candidate_id: candidateState.candidate_id,
				job_id: applicationState?.job_opening_id,
				content: emailContent,
			};
			AIPostAPIRequest(endpointUrl, data)
				.then((response) => {
					enqueueSnackbar('Sent the invitation E-Mail successfully', { variant: 'success' });
					setIsSent(true);
					setSending(false);
				})
				.catch((error) => {
					console.error(error, 'sending invitation email fails');
					enqueueSnackbar('Error sending an invitation email. Please try again later', { variant: 'error' });
					setSending(false);
				});
		}
	};

	const handleCancelClicked = () => clickRequestAction(id, 'COLLAPSE_OUTPUT_CARD', {});

	const getInvitationText = () => {
		const { job_title, company_name } = applicationDetails || applicationState || {};

		if (!job_title && !company_name) {
			return 'You have been invited for a screening interview.';
		} else if (!job_title) {
			return (
				<>
					You have been invited for a screening interview for the position at <HighlightText component={'span'}>{company_name}</HighlightText>.
				</>
			);
		} else if (!company_name) {
			return (
				<>
					You have been invited for a screening interview for the <HighlightText component={'span'}>{job_title}</HighlightText> position.
				</>
			);
		} else {
			return (
				<>
					You have been invited for a screening interview for the <HighlightText component={'span'}>{job_title}</HighlightText> position at <HighlightText component={'span'}>{company_name}</HighlightText>.
				</>
			);
		}
	};

	const closeThiscard = () => {
		handleCardClose(props)
	}

	const handleCandidateClick = () => {
		const candidateId = candidateState?.candidate_id;
		const jobId = candidateState?.job_opening_id;
		clickRequestAction(undefined, 'WSC_CANDIDATE_PROFILE', { candidate_id: candidateId, ...(jobId && { job_id: jobId }) });
	}

	return (
		<OutputCard
			title={
				<Typography
					sx={{
						'& > span':
						{
							fontWeight: 'inherit',
							color: '#9859E0',
						},
						'& > span:hover': {
							textDecoration: 'underline',
							cursor: 'pointer',
						}
					}}
					variant='h6'
					component='span'
					className='MuiCardHeader-title'
					closeCard={closeThiscard}
				>
					Pre-screening invite for <span onClick={() => handleCandidateClick()}>{candidateState?.friendly_name}</span>
				</Typography>
			}
			titleIcon={<EmailOutlinedIcon />}
			isATSCard
			showActions={false}
			closeCard={closeThiscard}
		>
			{renderDialog}
			{!isLoading && (
				<>
					<StyledCard>
						<StyledCardHeader avatar={<img src='/logo/logo.png' height='40' />} />

						<StyledCardContent>
							<Stack direction='column' justifyContent='center' alignItems='stretch' spacing={2}>
								<Typography sx={{ fontWeight: 700 }} variant='h5'>
									<div>
										Hi <HighlightText component={'span'}>{candidateState?.first_name || candidateState?.friendly_name}</HighlightText>, great news.
									</div>
									<br />
									<div>{getInvitationText()}</div>
								</Typography>

								<EditablePanel defaultData={DEFAULT_EMAIL_CONTENT()} edit={editContent && editable} setEdit={setEditContent} data={emailContent} setData={setEmailContent} onSubmit={onSubmit} />
								<Box sx={{ paddingTop: '16px' }}>
									<Button variant={'contained'} color={'primary'} sx={{ pointerEvents: 'none' }} endIcon={<Iconify icon={'ic:round-arrow-forward'} />}>
										Start screening interview
									</Button>
								</Box>
							</Stack>

							<Footer direction='column' justifyContent='center' alignItems='stretch' spacing={1}>
								<StyledDivider />

								<div>© Zeligate Pty Ltd. ACN 669 471 523. 88 Tribune St South Brisbane Qld 4101.</div>
								<Links>
									<Link href='/terms' target='_blank' color='#9859E0' underline='always'>
										Terms & Conditions.
									</Link>
									<Link href='/terms#privacy' target='_blank' color='#9859E0' underline='always'>
										Privacy policy.
									</Link>
								</Links>
							</Footer>
						</StyledCardContent>
					</StyledCard>
					<StyledCardActions>
						<CardActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0' }}>
							<Grid container display={'flex'} p={0}>
								<Grid item xs={3} display={'flex'} justifyContent={'flex-start'}>
									{editable && (
										<Tooltip title='Edit'>
											<IconButton onClick={() => setEditContent(!editContent)}>
												<EditRounded />
											</IconButton>
										</Tooltip>
									)}
								</Grid>
								{isSent ? (
									<Grid item xs={9} display={'flex'} justifyContent={'flex-end'} alignItems='center'>
										<Text14DarkIndigoWeight600>
											Sent to{' '}
											<Typography
												component={'a'}
												sx={{
													'& > span': {
														fontSize: 14,
														fontWeight: 600,
														color: '#9859E0',
														cursor: 'pointer',
													},
												}}
												onClick={(e) => {
													window.location.href = 'mailto:' + candidateState?.email;
													e.preventDefault();
												}}
											>
												<span>{candidateState?.email}</span>
											</Typography>
										</Text14DarkIndigoWeight600>
									</Grid>
								) : (
									<Grid item xs={9} display={'flex'} justifyContent={'flex-end'} gap={2}>
										<Button variant='outlined' color='primary' onClick={handleCancelClicked}>
											Cancel
										</Button>
										{
											candidateState?.email
												?
												<LoadingButton sx={{ cursor: 'pointer' }} variant='contained' color='primary' size='small' loading={sending} endIcon={<Iconify icon={'ic:round-arrow-forward-ios'} />} onClick={handleSendEmail}>
													Send
												</LoadingButton>
												:
												<Tooltip title={'Candidate email address missing'} placement='right'>
													<Box sx={{ cursor: 'pointer', height: '100%', width: 'fit-content' }}>
														<LoadingButton sx={{ padding: '8px 16px', height: '100%' }} variant='contained' color='primary' size='small' disabled={!candidateState?.email} loading={sending} endIcon={<Iconify icon={'ic:round-arrow-forward-ios'} />} onClick={handleSendEmail}>
															Send
														</LoadingButton>
													</Box>
												</Tooltip>
										}
										<Box mt={0.5}>
											<UserFeedback event_id={event_id} type={type} />
										</Box>
									</Grid>
								)}
							</Grid>
						</CardActions>
					</StyledCardActions>
				</>
			)}
		</OutputCard>
	);
}
