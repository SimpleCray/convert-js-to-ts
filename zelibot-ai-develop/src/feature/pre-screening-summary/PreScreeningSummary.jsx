import { MenuItem, Menu, Stack, Box, styled, Grid, CircularProgress, Button, Typography } from '@mui/material';
import { COLORS, Text14MediumPurpleWeight600, Text14MidnightPurpleWeight400, Text14MidnightPurpleWeight600, Text16MediumPurpleWeight600, Text16MidnightPurpleWeight400, Text16MidnightPurpleWeight600, Text16SantaGreyWeight400, Text16Weight600 } from '../../components/common/TypographyStyled';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import useModal, { MODAL_TYPES } from '../../hooks/useModal';
import { useUpdateCandidateNotes } from '../../hooks/PreScreeningSummary/usePreScreeningSummary';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import Control, { CONTROL_TYPE } from '../../components/react-hook-form/control';
import { StyledButton } from '../ai-worker/components/output-card/cards/CardStyles';
import { SubjectRounded as SubjectRoundedIcon, KeyboardArrowDownRounded as KeyboardArrowDownRoundedIcon, ModeEditOutlineOutlined as ModeEditOutlineOutlinedIcon, KeyboardArrowRightRounded as KeyboardArrowRightRoundedIcon } from '@mui/icons-material';
import moment from 'moment';
import { CONVERSATION_TYPE } from '../video-messaging/VideoMessaging';
import PropTypes from 'prop-types';
import UserFeedback from '../../components/user-feedback/UserFeedback';
import { LoadingButton } from '@mui/lab';

const Score = styled(Stack)(({ theme }) => ({
	alignItems: 'center',
	justifyContent: 'center',
	width: theme.spacing(5),
	height: theme.spacing(5),
	color: theme.palette.common.white,
	borderRadius: theme.spacing(10),
	px: '5px',
	background: theme.palette.primary.main,
}));

const StyledSectionHeader = styled(Box)(({ theme }) => ({
	padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
	background: theme.palette.primary.darker,
	borderTopLeftRadius: theme.shape.borderRadius,
	borderTopRightRadius: theme.shape.borderRadius,
	'& > *': {
		color: theme.palette.common.white,
		fontWeight: 600,
	},
}));

const StyledTextArea = styled('TextareaAutosize')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	button: {
		margin: theme.spacing(0.5),
	},
}));

const ImageBox = styled(Box)({
	width: 167,
	height: 94,
	position: 'relative',
	cursor: 'pointer',
	borderRadius: '10px',
	overflow: 'hidden',
	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#979797',
		opacity: 0.7,
		zIndex: 0,
		borderRadius: 'inherit',
	},
	'& img': {
		objectFit: 'cover',
		width: '100%',
		height: '100%',
	},
});

const schema = Yup.object().shape({
	notes: Yup.string().notRequired(),
});

const PreScreeningSummary = ({ data, clickRequestAction, event_id, type, outputCardsLength }) => {
	const { renderModal, setOpenModal } = useModal({
		showCloseButton: true,
		additionalStyles: {
			height: '80dvh',
			maxWidth: '90dvw',
			p: 0,
			borderRadius: 4,
		},
	});
	const [loading, setLoading] = useState(false);
	const [anchorMenuEl, setAnchorMenuEl] = useState(null);
	const [openTranscript, setOpenTranscript] = useState(false);
	const [initialCardsLength, setInitialCardsLength] = useState(outputCardsLength);
	const transcriptRef = useRef(null);

	const onHandleNextStepMenu = (e) => {
		setAnchorMenuEl(e.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorMenuEl(null);
	};

	const handleOpenRejectionEmailOutputCard = () => {
		setLoading(true);
		clickRequestAction(undefined, 'WSC_REJECTION_EMAIL', {
			candidate_id: data?.prescreeningDetails?.candidate_id,
			job_id: data?.prescreeningDetails?.job_opening_id,
		});
		handleCloseMenu();
	};

	const handleOpenShortlistCandidateEmailOutputCard = () => {
		setLoading(true);
		clickRequestAction(undefined, 'WSC_SHORTLIST_CANDIDATE_EMAIL', {
			candidate_id: data?.prescreeningDetails?.candidate_id,
			job_id: data?.prescreeningDetails?.job_opening_id,
			pre_screening_interview_id: data?.prescreeningDetails?.pre_screening_interview_id,
		});
		handleCloseMenu();
	};

	const onHandleOpenVideoModal = () => {
		setOpenModal({
			modalType: MODAL_TYPES.SUMMARY_VIDEO,
			data: {
				recordingVideo: data?.recordingVideo?.video_url,
				interview_transcript: data?.prescreeningDetails?.interview_transcript,
				title: data?.prescreeningDetails?.job_title && data?.prescreeningDetails?.company ? `Screening for ${data?.prescreeningDetails?.job_title} at ${data?.prescreeningDetails?.company}` : null,
			},
		});
	};

	const handleJobDetailsLinkage = () => {
		let jobId = data?.prescreeningDetails?.job_opening_id;
		let jobTitle = data?.prescreeningDetails?.job_title;
		clickRequestAction(undefined, 'JOB_OPENING', { id: jobId, ...(jobTitle && { title: jobTitle }) });
	};

	const handleCompanyLinkage = () => {
		let clientId = data?.prescreeningDetails?.client_id;
		clickRequestAction(undefined, 'CLIENT_DETAILS', clientId);
	};

	useEffect(() => {
		if (openTranscript) {
			transcriptRef?.current?.scrollIntoView({
				behavior: 'instant',
				block: 'center',
			});
		}
	}, [openTranscript]);

	useEffect(() => {
		if (outputCardsLength > initialCardsLength) {
			setLoading(false);
		}
	}, [outputCardsLength]);

	return (
		<Stack gap={3}>
			{renderModal}
			<Stack direction='row' justifyContent='space-between' alignItems='center'>
				<Stack gap={2}>
					<Stack gap={0.4}>
						{data?.prescreeningDetails?.job_title && data?.prescreeningDetails?.company ? (
							// <Text16MediumPurpleWeight600>
							<Stack flexDirection={'row'} flexWrap={'wrap'} gap={0.5}>
								<Text16MediumPurpleWeight600 sx={{ display: 'inline', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={handleJobDetailsLinkage}>
									{data?.prescreeningDetails?.job_title}
								</Text16MediumPurpleWeight600>{' '}
								<Text16MidnightPurpleWeight600 component='span'>at</Text16MidnightPurpleWeight600>{' '}
								<Text16MediumPurpleWeight600 onClick={handleCompanyLinkage} sx={{ display: 'inline', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
									{data?.prescreeningDetails?.company}
								</Text16MediumPurpleWeight600>
							</Stack>
						) : // </Text16MediumPurpleWeight600>
						null}
						<Text16MediumPurpleWeight600>{moment(data?.prescreeningDetails?.utc_date_interviewed)?.format('D MMMM YYYY')}</Text16MediumPurpleWeight600>
					</Stack>
					<Stack direction='row' alignItems='center' gap={1}>
						<Text14MidnightPurpleWeight600>Interview score</Text14MidnightPurpleWeight600>
						<Score>
							<Text16Weight600>{data?.prescreeningDetails?.prescreening_interview_score ?? '--'}</Text16Weight600>
						</Score>
					</Stack>
				</Stack>
				<ImageBox onClick={onHandleOpenVideoModal}>
					<img src={data?.recordingVideo?.thumbnail ?? 'https://c6140bba-5c2d-4e7d-a82a-e7f61c4f4b4e.s3.ap-southeast-2.amazonaws.com/avatar/animation/HR/01/bg.png'} alt='interview summary' />
					<PlayCircleIcon style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', color: '#fff' }} fontSize='large' />
				</ImageBox>
			</Stack>
			<Stack gap={0.3}>
				<Text16MidnightPurpleWeight600>Summary</Text16MidnightPurpleWeight600>
				<Text16MidnightPurpleWeight400>{data?.prescreeningDetails?.summary}</Text16MidnightPurpleWeight400>
			</Stack>
			<Stack gap={0.3}>
				<Text16MidnightPurpleWeight600>Strengths</Text16MidnightPurpleWeight600>
				<Text16MidnightPurpleWeight400>{data?.prescreeningDetails?.strengths}</Text16MidnightPurpleWeight400>
			</Stack>
			<Stack gap={0.3}>
				<Text16MidnightPurpleWeight600>Weaknesses</Text16MidnightPurpleWeight600>
				<Text16MidnightPurpleWeight400>{data?.prescreeningDetails?.weaknesses}</Text16MidnightPurpleWeight400>
			</Stack>
			<Box>
				<NotesSection data={data} />
			</Box>
			<Box pb={1.5}>
				<StyledSectionHeader ref={transcriptRef} sx={{ background: (theme) => theme.palette.primary.lighter, cursor: 'pointer' }} onClick={() => setOpenTranscript((prevState) => !prevState)}>
					<Stack direction='row' alignItems='center' justifyContent='space-between'>
						<Stack direction='row' alignItems='center' gap={0.5}>
							<SubjectRoundedIcon style={{ color: COLORS.MidnightPurple }} />
							<Text14MidnightPurpleWeight600 variant='body2'>Transcript</Text14MidnightPurpleWeight600>
						</Stack>
						<Stack direction='row' alignItems='center' gap={0.5}>
							{openTranscript ? (
								<>
									<Text14MidnightPurpleWeight600 variant='body2'>Close</Text14MidnightPurpleWeight600>
									<KeyboardArrowDownRoundedIcon style={{ color: COLORS.MidnightPurple }} />
								</>
							) : (
								<>
									<Text14MidnightPurpleWeight600 variant='body2'>Open</Text14MidnightPurpleWeight600>
									<KeyboardArrowRightRoundedIcon style={{ color: COLORS.MidnightPurple }} />
								</>
							)}
						</Stack>
					</Stack>
				</StyledSectionHeader>
				{/* {openTranscript ? ( */}
				<Stack gap={0.6} sx={{ mt: 1, height: openTranscript ? '100%' : 120, overflow: 'hidden', position: 'relative' }}>
					{data?.prescreeningDetails?.interview_transcript_info?.start_time ? <Text14MediumPurpleWeight600>Start: {data?.prescreeningDetails?.interview_transcript_info?.start_time}</Text14MediumPurpleWeight600> : null}
					{data?.prescreeningDetails?.interview_transcript?.map(({ type, text }, index) => (
						<Text14MediumPurpleWeight600 key={`${type}_${index}`}>
							{type === CONVERSATION_TYPE?.AI ? 'Zeli' : data?.prescreeningDetails?.friendly_name ?? 'Candidate'} <Text14MidnightPurpleWeight400 as='span'>{text}</Text14MidnightPurpleWeight400>
						</Text14MediumPurpleWeight600>
					))}
					{data?.prescreeningDetails?.interview_transcript_info?.end_time ? <Text14MediumPurpleWeight600>End: {data?.prescreeningDetails?.interview_transcript_info?.end_time}</Text14MediumPurpleWeight600> : null}
					{data?.prescreeningDetails?.interview_transcript_info?.duration ? <Text14MediumPurpleWeight600>Duration: {data?.prescreeningDetails?.interview_transcript_info?.duration}</Text14MediumPurpleWeight600> : null}
					{openTranscript ? null : <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 60, background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)' }}></Box>}
				</Stack>
				{/* ) : null} */}
			</Box>
			<Stack direction='row' alignItems='center' justifyContent='space-between'>
				<Stack direction='row' gap={2}>
					{/* <IconButton>
						<MailOutlineOutlinedIcon />
					</IconButton>
					<IconButton>
						<SaveAltRoundedIcon />
					</IconButton> */}
				</Stack>
				<Stack direction='row' gap={2} alignItems='center'>
					<LoadingButton loading={loading} variant='contained' onClick={onHandleNextStepMenu} color='primary'>
						Next step
					</LoadingButton>
					<UserFeedback event_id={event_id} type={type} />
				</Stack>
			</Stack>
			<Menu
				id='basic-menu'
				anchorEl={anchorMenuEl}
				open={!!anchorMenuEl}
				onClose={handleCloseMenu}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				<MenuItem onClick={handleOpenRejectionEmailOutputCard}>Rejection email</MenuItem>
				{data?.prescreeningDetails?.job_opening_id ? <MenuItem onClick={handleOpenShortlistCandidateEmailOutputCard}>Shortlist to client</MenuItem> : null}
			</Menu>
		</Stack>
	);
};

const NotesSection = ({ data }) => {
	const methods = useForm({
		defaultValues: {
			notes: data?.notes ?? '',
		},
		resolver: yupResolver(schema),
	});
	const { watch, setValue } = methods;
	const notes = watch('notes');
	const { mutate: mutateEditNotes, isPending: isLoadingEditNotes } = useUpdateCandidateNotes({ endpoint: data?.notesEndpoint });
	const [editNotes, setEditNotes] = useState(false);
	const [hoveredNotes, setHoveredNote] = useState(false);

	const handleCancelEditNotes = () => {
		setValue('notes', data?.notes ?? '');
		setEditNotes(false);
		setHoveredNote(false);
	};

	const onSubmitUpdateNotes = (formData) => {
		mutateEditNotes(
			{
				candidate_id: data?.prescreeningDetails?.candidate_id,
				notes: formData.notes,
			},
			{
				onSuccess: () => {
					setEditNotes(false);
					setHoveredNote(false);
				},
				onError: () => {
					handleCancelEditNotes();
				},
			}
		);
	};
	return (
		<Stack direction='row' gap={{ xs: 4, md: 10, minHeight: 24 }} onMouseOver={() => setHoveredNote(true)} onMouseLeave={() => setHoveredNote(false)} onClick={() => !editNotes && setEditNotes(true)} sx={{ cursor: 'pointer' }}>
			{hoveredNotes || editNotes ? <Text16MediumPurpleWeight600>Notes</Text16MediumPurpleWeight600> : <Text16MidnightPurpleWeight600>Notes</Text16MidnightPurpleWeight600>}
			{editNotes ? (
				<Grid container display={'flex'} flexDirection={'column'} justifyContent={'center'}>
					<FormProvider {...methods}>
						<form onSubmit={methods.handleSubmit(onSubmitUpdateNotes)}>
							<StyledTextArea>
								<Stack direction='row'>
									<Control autoFocus={true} name='notes' fullWidth label='Notes' rows={4} control={CONTROL_TYPE.TEXTAREA} placeholder='Add your personal notes here' />
								</Stack>
								<Grid container display={'flex'} justifyContent={'flex-end'}>
									<StyledButton disabled={isLoadingEditNotes} variant={'outlined'} color='primary' onClick={handleCancelEditNotes}>
										Cancel
									</StyledButton>
									<StyledButton disabled={isLoadingEditNotes} variant={'contained'} color='primary' type='submit'>
										<Stack direction='row' alignItems='center' gap={2}>
											Save {isLoadingEditNotes && <CircularProgress size={24} />}
										</Stack>
									</StyledButton>
								</Grid>
							</StyledTextArea>
						</form>
					</FormProvider>
				</Grid>
			) : (
				<Stack direction='row' justifyContent='space-between' width={'100%'}>
					{notes ? <Text16MidnightPurpleWeight400>{notes}</Text16MidnightPurpleWeight400> : <Text16SantaGreyWeight400>You can add notes here</Text16SantaGreyWeight400>}
					{hoveredNotes ? <ModeEditOutlineOutlinedIcon /> : null}
				</Stack>
			)}
		</Stack>
	);
};

NotesSection.propTypes = {
	data: PropTypes.object.isRequired,
};

PreScreeningSummary.propTypes = {
	data: PropTypes.object.isRequired,
	clickRequestAction: PropTypes.func.isRequired,
};

export default PreScreeningSummary;
