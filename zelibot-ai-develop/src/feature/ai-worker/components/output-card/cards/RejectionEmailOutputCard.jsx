import { OutputCard } from '../../index';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, IconButton, Link, Stack, styled, Tooltip, Typography } from '@mui/material';
import { Iconify } from '@zelibot/zeligate-ui';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useAIWorkerContext } from '../../../AIWorker';
import { useEffect, useState } from 'react';
import { TextEditorCommon } from '../../editor';
import { StyledCardActions } from '../OutputCardStyles';
import { EditRounded as EditRoundedIcon } from '@mui/icons-material';
import { Text14DarkIndigoWeight600, Text16MediumPurpleWeight400 } from '../../../../../components/common/TypographyStyled';
import { useGetRejectionEmailDetails, useSendRejectionEmail } from '../../../../../hooks/RejectionEmail/useRejectionEmail';
import { Loading } from 'src/components/loading-screen';
import { LoadingButton } from '@mui/lab';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';

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

const Footer = styled(Stack)(({ theme }) => ({
	fontSize: '12px',
	marginTop: theme.spacing(4),
}));

const DEFAULT_EMAIL_CONTENT = `
    <p>We appreciate the time and effort you invested in the interview process.</p>
    <p>After careful consideration, we regret to inform you that, on this occasion, your application has not been successful.</p>
    <p>The decision was challenging, as we had the opportunity to interview many qualified candidates. If you have any questions or would like feedback on your application process, please feel free to reach out. We appreciate the effort you put into your application and respect your dedication to your professional endeavours.</p>
    <p>Thank you once again for considering this position. We wish you all the best in your future endeavours.</p>
    <br/>
    <p>Kind regards,</p>
  `;

export default function RejectionEmailOutputCard({ id: outputCardId, editable = false, compound_component, type, event_id, handleCardClose }) {
	const { data, isFetching, isError } = useGetRejectionEmailDetails({ id: outputCardId, compound_component });
	const { handleRemoveCartById } = useAIWorkerContext();
	const [emailContent, setEmailContent] = useState(DEFAULT_EMAIL_CONTENT);
	const [keyTextEditor, setKeyTextEditor] = useState(1);
	const [isSent, setIsSent] = useState(false);
	const [editContent, setEditContent] = useState(false);
	const { mutate: mutateSendEmail, isPending } = useSendRejectionEmail({ endpoint: data?.rejectionEmailDetailsEndpoint });

	const handleCancelClicked = () => handleRemoveCartById(outputCardId);
	const handleSendEmail = () => {
		mutateSendEmail(
			{
				candidate_id: data?.rejectionEmailDetails?.candidate_id,
				job_id: data?.rejectionEmailDetails?.job_id,
				content: emailContent,
			},
			{
				onSuccess: () => {
					setIsSent(true);
				},
			}
		);
	};

	const onSaveHandler = (newContent) => {
		setEmailContent(newContent);
		setEditContent(false);
	};

	useEffect(() => {
		if (!!data?.rejectionEmailDetails?.content) {
			setEmailContent(data?.rejectionEmailDetails?.content);
			setKeyTextEditor((prevState) => prevState + 1);
		}
	}, [data?.rejectionEmailDetails?.content]);

	return (
		<OutputCard
			title={
				<Typography
					sx={{
						'& > span': {
							fontWeight: 'inherit',
							color: '#9859E0',
						},
					}}
					variant='h6'
					component='span'
					className='MuiCardHeader-title'
				>
					Email to {data?.rejectionEmailDetails?.candidate_email ? <span>{data?.rejectionEmailDetails?.candidate_email}</span> : null}
				</Typography>
			}
			titleIcon={<EmailOutlinedIcon />}
			isATSCard
			showActions={false}
			closeCard={() => {
				handleCardClose({ id: outputCardId });
			}}
		>
			{isError ? (
				'Something went wrong'
			) : isFetching ? (
				<Box my={4} height={200}>
					<Loading />
				</Box>
			) : (
				<>
					<StyledCard>
						<StyledCardHeader avatar={<img src='/logo/logo.png' height='40' />} />
						<StyledCardContent>
							<Stack direction='column' justifyContent='center' alignItems='stretch' spacing={2}>
								<Typography sx={{ fontWeight: 700 }} variant='h5'>
									<div>
										Hi <HighlightText component={'span'}>{data?.rejectionEmailDetails?.candidate_name ? data?.rejectionEmailDetails?.candidate_name : '-'}</HighlightText>,
									</div>
									<br />

									{data?.rejectionEmailDetails?.company_name && data?.rejectionEmailDetails?.job_title ? (
										<div>
											Thank you for expressing your interest in the <HighlightText component={'span'}>{data?.rejectionEmailDetails?.job_title}</HighlightText> position at <HighlightText component={'span'}>{data?.rejectionEmailDetails?.company_name}</HighlightText>.
										</div>
									) : (
										<div>Thank you for expressing your interest </div>
									)}
								</Typography>
								<Stack>
									<TextEditorCommon key={keyTextEditor} htmlContent={emailContent} onSave={onSaveHandler} defaultIsEditMode={editContent} setDefaultIsEditMode={setEditContent} />
									<Text16MediumPurpleWeight400>{data?.rejectionEmailDetails?.user_name}</Text16MediumPurpleWeight400>
								</Stack>
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
												<EditRoundedIcon />
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
													window.location.href = 'mailto:' + data?.rejectionEmailDetails?.candidate_email;
													e.preventDefault();
												}}
											>
												<span>{data?.rejectionEmailDetails?.candidate_email}</span>
											</Typography>
										</Text14DarkIndigoWeight600>
									</Grid>
								) : (
									<Grid item xs={9} display={'flex'} justifyContent={'flex-end'} gap={2}>
										<Button disabled={isPending} variant='outlined' color='primary' onClick={handleCancelClicked}>
											Cancel
										</Button>

										<LoadingButton variant='contained' color='primary' size='small' endIcon={<Iconify icon={'ic:round-arrow-forward-ios'} />} loading={isPending} onClick={handleSendEmail}>
											Send
										</LoadingButton>
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
