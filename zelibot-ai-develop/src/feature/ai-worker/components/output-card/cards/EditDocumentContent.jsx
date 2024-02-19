import OutputCard from '../OutputCard';
import { Box, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useEffect, useState } from 'react';
import { Loading } from '../../../../../components/loading-screen';
import { useEditDocumentContent, useGetDocumentContent } from '../../../../../hooks/Documents/useDocument';
import { TextEditorCommon } from '../../editor';
import { makeReadable } from 'src/feature/ai-worker/helpers/makeReadable';
import ActionPanel from '../../../../../components/job-action-panel/JobActionPanel';
import useCopyToClipboard from '../../../../../hooks/useCopyToClipboard';
import { useSnackbar } from 'notistack';
import { setChatContext } from '../../../constants'

export default function EditDocumentContent({ compound_component, id, type, event_id, handleCardClose, conversationGuid, ...props }) {
	const [keyTextEditor, setKeyTextEditor] = useState(1);
	const [content, setContent] = useState('');
	const [editContent, setEditContent] = useState(false);
	const { data, isError, isFetching } = useGetDocumentContent({ compound_component, id });
	const { mutate: mutateEditDocumentContent, isPending: isPendingEdit } = useEditDocumentContent({ endpoint: data?.documentContentEndpoint ?? '' });
	const { copy } = useCopyToClipboard();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		if (!!data?.documentContent?.raw_text) {
			setContent(data?.documentContent?.raw_text);
			setKeyTextEditor((prevState) => prevState + 1);
		}
	}, [data?.documentContent?.raw_text]);

	useEffect(() => {
		if (data?.documentContent?.sk) {
			handleSetContext();
		}
	}, [data?.documentContent?.sk])

	const handleSetContext = async () => {
		const body = {
			conversation_id: conversationGuid,
			event_id: id,
			payload: {
				sk: data?.documentContent?.sk
			},
			category: 'VIEW_DOCUMENT',
		};
		try {
			await setChatContext(body);
		} catch (err) {
			console.error(err);
		}
	};

	const onHandleSave = (newContent) => {
		mutateEditDocumentContent(
			{
				document_id: data?.documentContent?.document_id,
				sk: data?.documentContent?.sk,
				content: newContent,
			},
			{
				onSuccess: () => {
					setContent(newContent);
				},
				onSettled: () => {
					setEditContent(false);
				},
			}
		);
	};

	const reverseHtmlContent = (data) => {
		if (!data) return;

		// handle new lines, bolding, and italics
		const htmlContent = data
			.replace(/<br \/>/g, '\n')
			.replace(/<p>(.*?)<\/p>/g, '$1\n')
			.replace(/<strong>(.*?)<\/strong>/g, '**$1**')
			.replace(/<em>(.*?)<\/em>/g, '*$1*')

		return htmlContent;
	};

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
		if (await copy(reverseHtmlContent(content))) {
			enqueueSnackbar('Copied to clipboard ', { variant: 'success' });
			const linkedInUrl = 'https://www.linkedin.com/feed/?shareActive=true';
			window.open(linkedInUrl, '_blank');
		} else {
			enqueueSnackbar('Security settings prevent copying to clipboard', { variant: 'warning' });
		}
	};

	return (
		<OutputCard

			title={
				data?.documentContent?.document_category && data?.documentContent?.file_name ? (
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
						{data?.documentContent?.job_title && data?.documentContent?.client_name
							? `${data?.documentContent?.document_category === 'JOB_AD' ? 'Job ad' : 'Job description'} for ${data?.documentContent?.job_title} at ${data?.documentContent?.client_name}`
							: `Edit ${makeReadable(data?.documentContent?.document_category)} for  ${data?.documentContent?.file_name}`}
					</Typography>
				) : null
			}
			// titleIcon={<EditOutlinedIcon />}
			isATSCard
			closeCard={() => handleCardClose({id: id})}
		>
			{isError ? (
				'Something went wrong'
			) : isFetching ? (
				<Box my={4} height={200}>
					<Loading />
				</Box>
			) : (
				<TextEditorCommon key={keyTextEditor} htmlContent={content} onSave={onHandleSave} defaultIsEditMode={editContent} setDefaultIsEditMode={setEditContent} isLoading={isPendingEdit} />
			)}
			<Box mt={2}>
				<ActionPanel type={type} event_id={event_id} handleEditClick={() => setEditContent(true)} handleCopyToClipboard={handleCopyToClipboard} handlePostLinkedIn={handlePostLinkedIn} document_category={data?.documentContent?.document_category} />
			</Box>
		</OutputCard>
	);
}
