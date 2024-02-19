import { useEffect, useState, useRef, useCallback } from 'react';
import { Loading } from 'src/components/loading-screen';
import { Stack, Typography } from '@mui/material';
import OutputCard from '../OutputCard';
import { setChatContext } from '../../../constants';
import { StyledAvatar } from '../OutputCardStyles';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { getDocumentContent } from 'src/constants';


export default function ResumeOutputCard({ target_url, type, event_id, handleCardClose, conversationGuid, clickRequestAction, ...props }) {
	const docRef = useRef(null);
	const [retryInterval, setRetryInterval] = useState();
	const [showTitle, setShowTitle] = useState(true);
	const [documentType, setDocumentType] = useState('');
	const [subjectText, setSubjectText] = useState('');
	const [clickId, setClickId] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchDocumentData = async () => {
		let response = await getDocumentContent(`document_content?${props?.data?.document_id ? 'document_id=' + props?.data?.document_id + '&' : ''}sk=${props?.data?.sk}`)
		console.log('Document data is ', response)
		if (response?.friendly_name) {
			setSubjectText(response?.friendly_name);
		}
		if (response?.candidate_id) {
			setClickId(response?.candidate_id)
		}
		if (response?.document_category) {
			let word = response?.document_category?.toLowerCase();
			let documentType = word[0]?.toUpperCase() + word?.substr(1);
			setDocumentType(documentType);
		}
		if (response?.friendly_name && response?.candidate_id) {
			setShowTitle(false);
		}
	}

	useEffect(() => {
		if (props?.data?.id && props?.data?.name) {
			setShowTitle(false)
			setDocumentType(props?.data?.document_category)
			setSubjectText(props?.data?.name);
			setClickId(props?.data?.id)
		}
	}, [])

	useEffect(() => {
		console.log('Resume props are ', props);
		setLoading(true);
		if (props?.data?.document_id || props?.data?.sk) {
			fetchDocumentData();
		}
		handleSetContext(props.compound_component[0].sk);
	}, []);

	const getDocumentUrl = useCallback(() => {
		return `https://docs.google.com/gview?url=${encodeURIComponent(target_url)}&embedded=true`;
	}, [target_url]);

	const handleError = useCallback(() => {
		if (docRef.current) {
			docRef.current.src = getDocumentUrl();
		}
	}, [getDocumentUrl]);

	useEffect(() => {
		const interval = setInterval(handleError, 3000);
		setRetryInterval(interval);

		return () => {
			clearInterval(interval)
		}
	}, [handleError]);

	const documentLoaded = () => {
		setLoading(false);
		clearInterval(retryInterval);
	};

	const closeThiscard = () => {
		handleCardClose(props);
	};

	const returnDocumentTitle = () => {
		if (props?.data?.document_category) {
			if (props?.data?.name && props?.data?.name !== '-') {
				console.log('The Assigned ID is >>> ', props?.data?.id)
				return `${props?.data?.document_category} for ${props?.data?.name}`;
			}
		}
		if (props?.data?.document_category?.toLowerCase() === 'company information' || props?.data?.document_category === 'COMPANY_INFORMATION') {
			return 'Company document';
		}
		return 'View Document';
	};

	const handleSetContext = async (sk) => {
		const body = {
			conversation_id: conversationGuid,
			event_id: props.id,
			payload: {
				sk: sk,
			},
			category: 'VIEW_DOCUMENT',
		};
		try {
			const response = await setChatContext(body);
		} catch (err) {
			console.error(err);
		}
	};

	const handleClientClick = () => {
		if (documentType === 'Resume') {
			// Candidate Profile
			return clickRequestAction(undefined, 'WSC_CANDIDATE_PROFILE', { candidate_id: clickId });
		} else {
			// Job Opening
			return clickRequestAction(undefined, 'WSC_CANDIDATE_PROFILE', { candidate_id: clickId });
		}
	};

	return (
		<OutputCard isATSCard showTitle={showTitle} title={showTitle && returnDocumentTitle()} showActions={true} closeCard={closeThiscard}>
			{
				!showTitle
					?
					<Stack flexDirection={'row'} alignItems={'center'} gap={2} sx={{ width: '100%' }}>
						<StyledAvatar variant='rounded'>{<WorkOutlineIcon />}</StyledAvatar>
						<Stack gap={0.5} flexWrap={'wrap'} flexDirection={'row'} alignItems={'center'} sx={{ whiteSpace: 'nowrap' }}>
							<Typography sx={{ fontWeight: '400', fontSize: '1.125rem' }}>{documentType} for</Typography>
							<Typography onClick={handleClientClick} sx={{ fontWeight: '400', fontSize: '1.125rem', '&:hover': clickId && { textDecoration: 'underline', cursor: 'pointer', color: '#9859E0' } }}>
								{subjectText}
							</Typography>
						</Stack>
					</Stack>
					:
					null
			}
			{loading && <Loading />}
			<iframe ref={docRef} onLoad={documentLoaded} onError={handleError} src={getDocumentUrl()} style={{ all: 'unset', width: '100%', height: '600px' }} />
			{/* <Stack direction='row' justifyContent='flex-end' alignItems='center' gap={2} mt={2}>
				<UserFeedback type={type} event_id={event_id} />
			</Stack> */}
		</OutputCard>
	);
}
