import { Stack, Typography } from '@mui/material';
import OutputCard from '../OutputCard';
import { useEffect, useRef, useState } from 'react';
import useCopyToClipboard from '../../../../../hooks/useCopyToClipboard';
import TextEditor from '../../editor/textEditor';
import { useSnackbar } from 'notistack';
import { Loading } from '../../../../../components/loading-screen';
import { AIGetAPIRequest, AIPostAPIRequest } from '../../../constants';
import ActionPanel from '../../../../../components/job-action-panel/JobActionPanel';
import zeligate from '../../../../../assets/icons/zeligate.svg';
import { getSourceUrl } from '../../../../../utils/common';
import { makeReadable } from 'src/feature/ai-worker/helpers/makeReadable';
import useResponsive from '../../../../../hooks/useResponsive';
import { Text16MediumPurpleWeight400, Text16MidnightPurpleWeight400 } from '../../../../../components/common/TypographyStyled';
import { saveDocumentContent } from '../../../../../constants';

const GenericCard = ({ body, outputCardAction, writingContent, userHasScrolled, storedSourceLinks, clickRequestAction, type, event_id, requestId, handleCardClose, ...props }) => {

	const anchorRef = useRef(null);
	const { copy } = useCopyToClipboard();
	const { enqueueSnackbar } = useSnackbar();
	const [isEditMode, setEditMode] = useState(false);
	const [content, setContent] = useState('');
	const JOB_ID = props?.data?.job_id;
	const JOB_TITLE = props?.data?.title || '';
	const [documentId, setDocumentId] = useState('');

	const isDesktop = useResponsive('up', 'md');

	const viewFile = async (url, sk) => {
		const target_url = await getSourceUrl({ source_type: 1, url });
		if (target_url) {
			clickRequestAction(undefined, 'VIEW_DOCUMENT', { sk: sk }, target_url);
		}
	};

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

		let documentid;
		try {
			const document = await saveDocumentContent({
				content: data,
				sk: requestId,
				documentId: documentId

			});
			documentid = document?.document_id;
			setDocumentId(documentid)

			if (documentid) {
				enqueueSnackbar('Note updated!');
			}
		} catch (err) {
			console.error('failed to update job ad', err);
			enqueueSnackbar('Unable to update job ad. Please try again later', { variant: 'error' });
		}

		setContent(createHtmlContent(data));
		setEditMode(false);
	};

	const closeThiscard = () => {
		handleCardClose(props);
	};

	return (
		<OutputCard showActions={true} isATSCard {...props} actionsDisabled={writingContent} closeCard={closeThiscard} title={JOB_TITLE} titleIcon={<img width={24} height={24} src={zeligate} alt='zeligate' />}>
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
					{storedSourceLinks?.length > 0 ? (
						<Stack>
							<Text16MidnightPurpleWeight400>{storedSourceLinks?.length > 1 ? 'Links of interest' : 'Link of interest'}: </Text16MidnightPurpleWeight400>
							<Stack flexDirection='column' alignItems={'flex-start'}>
								{storedSourceLinks?.map((item, index) =>
									item?.url
										?
										isDesktop ? (
											<ul key={`${item?.name}_${index}`} style={{ marginBlock: 0 }}>
												<li>
													<Text16MidnightPurpleWeight400 as='span'>{item?.category ? `${makeReadable(item?.category)}: ` : ''}</Text16MidnightPurpleWeight400>
													<Text16MediumPurpleWeight400 as='span' onClick={() => viewFile(item?.url, item?.sk)} sx={{
														cursor: 'pointer', '&:hover': {
															textDecoration: 'underline'
														}
													}}>
														{item?.name}
													</Text16MediumPurpleWeight400>
												</li>
											</ul>
										) : (
											<React.Fragment key={`${item?.name}_${index}`}>
												<Text16MediumPurpleWeight400 onClick={() => viewFile(item?.url)} sx={{ cursor: 'pointer' }}>
													{item?.name}
												</Text16MediumPurpleWeight400>
												{index !== storedSourceLinks?.length - 1 ? ', ' : ''}
											</React.Fragment>
										)
										:
										null
								)}
							</Stack>
						</Stack>
					) : null}
					{!writingContent && <ActionPanel type={type} event_id={event_id} handleEditClick={() => setEditMode(true)} handleCopyToClipboard={handleCopyToClipboard} handlePostLinkedIn={handlePostLinkedIn} />}
					<div ref={anchorRef} />
				</>
			)}
		</OutputCard>
	);
};

export default GenericCard;
