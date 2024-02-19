import { Avatar, Chip, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { fUtcDateTime } from '../../../utils/formatTime';
import { Iconify } from '@zelibot/zeligate-ui';
import * as React from 'react';
import { useSnackbar } from 'notistack';
import useCopyToClipboard from '../../../hooks/useCopyToClipboard';
import { StyledHistoryItem, StyledHistoryItemTitle } from './styles';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useState, useEffect, useRef } from 'react';
// Custom Components
import { getTextToVoiceSignedURL, assistants, getConversationHistory } from '../constants';
import { AnswerCard } from '../../ai-worker/components/output-card/cards';
import { useRouter } from 'src/hooks/useRouter';

export default function HrHistoryView({ selected, setOnViewRow, onViewRow }) {
	const { enqueueSnackbar } = useSnackbar();
	const { copy } = useCopyToClipboard();
	const { push } = useRouter();
	const audioRef = useRef(null);
	const data = selected;
	const assistant = assistants.find((assistant) => assistant.id === data?.assistant_id);
	const date = selected['utc_date'] ? fUtcDateTime(selected['utc_date']) : null;
	const [textToVoiceSignedURL, setTextToVoiceSignedURL] = useState(null);
	const [playButtonVisible, setPlayButtonVisible] = useState(true);
	const [loading, setLoading] = useState(false);
	const [readAloudMessage, setReadAloudMessage] = useState('');
	const [conversationHistory, setConversationHistory] = useState([]);

	const handleGetConversationHistory = async () => {
		if (!selected?.assistant_id || !selected?.conversation_guid) {
			return;
		}
		await getConversationHistory(selected?.assistant_id, selected?.conversation_guid)
			.then((res) => {
				setConversationHistory(res);
			})
			.catch((err) => {
				// console.log('error: ', err);
				enqueueSnackbar('Error fetching data', { variant: 'error' });
				setLoading(false);
			});
	};

	useEffect(() => {
		void handleGetConversationHistory();
	}, [selected]);

	// ----------------------------------------------------------------------------------------------------------------
	// Get the Text to Voice from the Database [Denver Naidoo - 26 Apr 2023]
	// ----------------------------------------------------------------------------------------------------------------
	const handleTextToVoiceSignedURL = async () => {
		if (data?.request_id) {
			await getTextToVoiceSignedURL(data?.request_id)
				.then((res) => {
					if (res) {
						setTextToVoiceSignedURL(res);
					} else {
						setLoading(false);
						setReadAloudMessage('zelibot.ai prevented the reading of this text. Please contact support if you need further assistance.');
					}
				})
				.catch((err) => {
					// console.log('error: ', err);
					enqueueSnackbar('Error fetching data', { variant: 'error' });
				});
		}
	};

	// unload
	useEffect(() => {
		return () => {
			setPlayButtonVisible(true);
			setReadAloudMessage('');
		};
	}, [onViewRow]);

	const handlePlayClick = () => {
		setLoading(true);
		setPlayButtonVisible(false);
		setTextToVoiceSignedURL(null);
		void handleTextToVoiceSignedURL();
	};

	useEffect(() => {
		if (audioRef.current && textToVoiceSignedURL) {
			audioRef.current.play();
			setLoading(false);
		}
	}, [textToVoiceSignedURL]);

	const setAction = (action) => {
		if (action === 'copy') {
			// copy to clipboard
			void copy(data?.ai_response);
			enqueueSnackbar('Copied!');
		} else {
			void push(
				{
					pathname: PATH_DASHBOARD.zeliHR.app,
					query: {
						title: data?.product_title,
						keywords: data?.product_keywords,
						description: data?.ai_response,
						image: data?.product_image_url,
						assistant: data?.assistant_id,
						action: action,
						requestContext: 'DEFAULT',
					},
				},
				PATH_DASHBOARD.zeliHR.app
			);
		}
	};

	return (
		<Drawer
			anchor='right'
			open={!!onViewRow}
			onClose={() => setOnViewRow(null)}
			PaperProps={{
				sx: {
					width: 800,
					maxWidth: '100%',
				},
			}}
		>
			<Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ px: 3, py: 2, borderBottom: (theme) => `solid 1px ${theme.palette.divider}` }}>
				<div>
					<Typography variant='h4'>{data?.title}</Typography>
					<Typography variant='body2' sx={{ color: 'text.secondary' }}>
						{date}
					</Typography>
				</div>
				<IconButton onClick={() => setOnViewRow(null)}>
					<Iconify icon='mdi:close' width={20} height={20} />
				</IconButton>
			</Stack>

			<Stack spacing={3} sx={{ p: 3 }}>
				<StyledHistoryItem>
					{conversationHistory && (
						<Stack spacing={3} sx={{ p: 3 }}>
							{conversationHistory.map((conversation, index) => (
								<AnswerCard key={index} cardContent={conversation.user} cardResponseContent={conversation.assistant} />
							))}
						</Stack>
					)}

					<StyledHistoryItemTitle variant={'body2'}>Your Conversation History</StyledHistoryItemTitle>
					{/* <TextField name={"conversation"} multiline={true} value={data?.preview} readOnly={true} autoComplete={"off"} sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: 0 + 'px !important',
                                borderRadius: 0,
                            },
                            '&:hover, &.Mui-focused': {
                                '& fieldset': {
                                    borderColor: 'grey.300',
                                }
                            }
                        }
                    }} /> */}
					{/* <DescriptionToolbar setAction={setAction} sx={{borderBottom: '0', borderLeft: '0', borderRight: '0'}} /> */}
				</StyledHistoryItem>

				{/* <StyledHistoryItem sx={{p: 2}}>
                    <StyledHistoryItemTitle variant={"body2"}>
                        Suggested Hashtags
                    </StyledHistoryItemTitle>
                    <Stack direction={"row"} spacing={1} flexWrap={"wrap"} justifyContent={"center"} sx={{pt: 1, mb: '-8px'}}>
                        {data?.hashtags?.map((hashtag, index) => {
                            return (
                                <Chip key={index} label={`${hashtag}`} variant={"soft"} color="primary" sx={{mb: '8px !important',pointerEvents: 'none' }} />
                            )
                        })}
                    </Stack>
                </StyledHistoryItem> */}

				{/* Display the Text to Voice File */}
				{/* {<StyledHistoryItem sx={{p: 2}}>
                    <StyledHistoryItemTitle variant={"body2"}>
                        Read Out Your Conversation
                    </StyledHistoryItemTitle>
                    <Stack direction={"row"} spacing={1} sx={{pt: 0.5}} flexWrap={"wrap"} justifyContent={"center"}>
                        {loading && <Loading />}
                        <Typography variant={"body2"}>
                        {playButtonVisible && <Button
                            variant={"contained"}
                            size={"large"}
                            color={"primary"}
                            onClick={handlePlayClick}
                            sx={{minWidth: '150px', mr: 0.5}}>
                                <Iconify icon="mdi:play" sx={{mr:1}} /> Read Aloud
                        </Button>}
                        {readAloudMessage}
                        {textToVoiceSignedURL && !playButtonVisible && (
                            <audio ref={audioRef} controls>
                            <source src={textToVoiceSignedURL} type="audio/mpeg" />
                            Your browser does not support the the playback of audio. We would suggest using a different brower, such as Chrome.
                            </audio>
                        )}
                        </Typography>
                    </Stack>
                </StyledHistoryItem>} */}

				<StyledHistoryItem sx={{ p: 2 }}>
					<StyledHistoryItemTitle variant={'body2'}>Summary</StyledHistoryItemTitle>
					<Stack direction={'row'} spacing={1} sx={{ pt: 0.5 }} flexWrap={'wrap'} justifyContent={'center'}>
						<Typography variant={'body2'}>{data?.category}</Typography>
					</Stack>
					<Stack direction={'row'} spacing={1} sx={{ pt: 0.5 }} flexWrap={'wrap'} justifyContent={'center'}>
						<Typography variant={'body2'}>{data?.title}</Typography>
					</Stack>
					<Stack direction={'row'} spacing={1} sx={{ pt: 0.5 }} flexWrap={'wrap'} justifyContent={'center'}>
						<Typography variant={'body2'}>{data?.preview}</Typography>
					</Stack>
					<Stack direction={'row'} spacing={1} sx={{ pt: 0.5 }} flexWrap={'wrap'} justifyContent={'center'}>
						<Typography variant={'body2'}>{date}</Typography>
					</Stack>
				</StyledHistoryItem>

				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={'center'}>
					<Avatar src={assistant?.avatar} alt={assistant?.name} sx={{ width: 48, height: 48 }} />
					<Stack direction={'column'} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
						<Typography variant={'h6'}>{assistant?.name}</Typography>
						<Typography variant={'body1'} sx={{ color: 'text.secondary' }}>
							{assistant?.subtitle}
						</Typography>
					</Stack>
					<Chip label={`${data?.category}`} variant={'soft'} color='primary' sx={{ ml: { xs: '', sm: 'auto!important' }, pointerEvents: 'none' }} />
				</Stack>
			</Stack>
		</Drawer>
	);
}
