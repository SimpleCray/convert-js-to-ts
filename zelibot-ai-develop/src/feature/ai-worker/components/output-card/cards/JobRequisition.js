import { Stack, Typography } from '@mui/material';
import OutputCard from '../OutputCard';
import { useEffect, useRef, useState } from 'react';
import useCopyToClipboard from '../../../../../hooks/useCopyToClipboard';
import TextEditor from '../../editor/textEditor';
import { useSnackbar } from 'notistack';
import { Loading } from '../../../../../components/loading-screen';
import { AIGetAPIRequest, AIPostAPIRequest } from '../../../constants';
import ActionPanel from '../../../../../components/job-action-panel/JobActionPanel';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { StyledAvatar } from '../OutputCardStyles';

export default function JobRequisitionOutputCard({ body, outputCardAction, writingContent, userHasScrolled, type, event_id, handleCardClose, clickRequestAction, ...props }) {
	const anchorRef = useRef(null);
	const { copy } = useCopyToClipboard();
	const { enqueueSnackbar } = useSnackbar();
	const [isEditMode, setEditMode] = useState(false);
	const [content, setContent] = useState('');
	const JOB_ID = props?.data?.job_id;
	const JOB_TITLE = props?.data?.job_title;

	// For stashing HTML content between edit mode

	const createHtmlContent = (data) => {
		if (!data) return;

		// handle new lines, bolding, and italics
		const htmlContent = data
			.replace(/\n/g, '<br />')
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>');

		return htmlContent;
	};

	const reverseHtmlContent = (data) => {
		if (!data) return;

		// handle new lines, bolding, and italics
		const htmlContent = data
			.replace(/<br \/>/g, '\n')
			.replace(/<p>(.*?)<\/p>/g, '$1\n')
			.replace(/<strong>(.*?)<\/strong>/g, '**$1**')
			.replace(/<em>(.*?)<\/em>/g, '*$1*');

		return htmlContent;
	};

	useEffect(() => {
		setContent(() => createHtmlContent(body));
	}, [body]);

	useEffect(() => {
		anchorRef?.current?.scrollIntoView({
			block: 'end',
		});
	}, [content]);

	const handleCopyToClipboard = async () => {
		if (!content) return;
		// copy to clipboard
		if (await copy(reverseHtmlContent(content))) {
			enqueueSnackbar('Copied to clipboard ', { variant: 'success' });
		} else {
			enqueueSnackbar('Security settings prevent copying to clipboard', { variant: 'warning' });
		}
	};

	const handlePostLinkedIn = async () => {
		if (!content) return;
		// copy to clipboard
		if (await copy(reverseHtmlContent(content))) {
			enqueueSnackbar('Copied to clipboard ', { variant: 'success' });
			const linkedInUrl = 'https://www.linkedin.com/feed/?shareActive=true';
			window.open(linkedInUrl, '_blank');
		} else {
			enqueueSnackbar('Security settings prevent copying to clipboard', { variant: 'warning' });
		}
	};

	const onSubmit = async (data) => {
		const JOB_DESCRIPTION_ENDPOINT = process.env['API_JOB_DESCRIPTION_MS'];
		if (!JOB_DESCRIPTION_ENDPOINT) {
			setEditMode(false);
			return;
		}
		// console.log('Data being saved is ', data)
		let documentId;
		try {
			const document = await AIPostAPIRequest(JOB_DESCRIPTION_ENDPOINT, {
				html: data,
				job_id: JOB_ID,
				job_title: JOB_TITLE,
			});
			documentId = document?.document_id;

			if (documentId) {
				enqueueSnackbar('Note updated!');
			}
		} catch (err) {
			console.error('failed to update job ad', err);
			enqueueSnackbar('Unable to update job ad. Please try again later', { variant: 'error' });
		}

		try {
			const resp = await AIGetAPIRequest(`${JOB_DESCRIPTION_ENDPOINT}?document_id=${documentId}`);
			setContent(createHtmlContent(resp?.html || data));
			setEditMode(false);
			return;
		} catch (err) {
			console.error('failed to reload job ad', err);
		}

		setContent(createHtmlContent(data));
		setEditMode(false);
	};

	const closeThiscard = () => {
		handleCardClose(props);
	};

	const handleClientClick = () => {
		clickRequestAction(null, 'CLIENT_DETAILS', props?.data?.client_id);
	}

	const handleJobClick = () => {
		clickRequestAction(undefined, 'JOB_OPENING', { id: props?.data?.job_id, title: props?.data?.job_title });
		return;
	}

	const handleCardTitle = () => {
		if (props?.data?.client_name && props?.data?.job_title) {
			return <Typography sx={{ fontSize: '1.15rem' }} display={'flex'} flexDirection={'row'} alignItems={'center'} flexWrap={'wrap'} width={'100%'}>
				{`${props?.data?.category} for`}&nbsp;
				<Typography sx={{ fontSize: '1.15rem', "&:hover": { textDecoration: 'underline', cursor: 'pointer', color: '#9859E0' } }} onClick={handleJobClick}>{props?.data?.job_title}</Typography>
				&nbsp;{`at`}&nbsp;
				<Typography sx={{ fontSize: '1.15rem', "&:hover": { textDecoration: 'underline', cursor: 'pointer', color: '#9859E0' } }} onClick={handleClientClick}>{props?.data?.client_name}</Typography>
			</Typography>
		} else if (props?.data?.job_title && !props?.data?.client_name) {
			return <Typography sx={{ fontWeight: 600, fontSize: '1.15rem', "&:hover": { textDecoration: 'underline', cursor: 'pointer', color: '#9859E0' } }} onClick={handleJobClick}>{`${props?.data?.category} for ${props?.data?.job_title}`}</Typography>
		} else {
			return ``
		}
	}

	return (
		<OutputCard showHeaderMenu={false} showTitle={false} showActions={true} isATSCard {...props} actionsDisabled={writingContent} closeCard={closeThiscard}>
			<Stack gap={2} mb={2} flexDirection={'row'} alignItems={'center'}>
				<StyledAvatar variant='rounded'><WorkOutlineIcon /></StyledAvatar>
				<Typography>{handleCardTitle()}</Typography>
			</Stack>
			{isEditMode && (
				<>
					<TextEditor body={content} onClose={() => setEditMode(false)} setContent={onSubmit} />
					<div ref={anchorRef} />
				</>
			)}
			{!isEditMode && !content && (
				<Stack sx={{ minHeight: '400px' }} position={'relative'} justifyContent={'center'} alignItems={'center'}>
					<Loading />
				</Stack>
			)}
			{!isEditMode && content && (
				<>
					<Typography onClick={() => setEditMode(!writingContent)} variant='body1' component={'div'} sx={{ mb: 2, cursor: 'pointer' }} dangerouslySetInnerHTML={{ __html: content }}></Typography>
					{!writingContent && <ActionPanel type={type} event_id={event_id} handleEditClick={() => setEditMode(true)} handleCopyToClipboard={handleCopyToClipboard} handlePostLinkedIn={handlePostLinkedIn} />}
				</>
			)}
			{
				// !isEditMode && (
				// 	<Tooltip title='Edit' placement='top'>
				// 		<IconButton onClick={handleEditClick} size='small'>
				// 			<EditRounded />
				// 		</IconButton>
				// 	</Tooltip>
				// )
			}
		</OutputCard>
	);
}
