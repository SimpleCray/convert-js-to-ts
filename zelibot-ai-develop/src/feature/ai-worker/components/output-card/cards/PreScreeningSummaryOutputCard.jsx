import { Text20MediumPurpleWeight400, Text20MidnightPurpleWeight400 } from '../../../../../components/common/TypographyStyled';
import { useGetPreScreeningDetails } from '../../../../../hooks/PreScreeningSummary/usePreScreeningSummary';
import PreScreeningSummary from '../../../../pre-screening-summary/PreScreeningSummary';
import OutputCard from '../OutputCard';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import { Box } from '@mui/material';
import { Loading } from 'src/components/loading-screen';
export default function PreScreeningSummaryCard({ compound_component, id, clickRequestAction, event_id, type, handleCardClose, outputCardsLength, ...props }) {
	const { data, isFetching, isError } = useGetPreScreeningDetails({ compound_component, id });

	const handleCandidateLinkage = () => {
		// console.log('The data is >>> ', data);
		let candidateId = data?.prescreeningDetails?.candidate_id;
		let jobId = data?.prescreeningDetails?.job_opening_id;
		clickRequestAction(undefined, 'WSC_CANDIDATE_PROFILE', { candidate_id: candidateId, ...(jobId && { job_id: jobId }) });
		return
	};

	const closeThiscard = () => {
		handleCardClose({id: id});
	};

	return (
		<OutputCard
			title={
				<Text20MidnightPurpleWeight400>
					Pre-screening for{' '}
					<Text20MediumPurpleWeight400 sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => handleCandidateLinkage()} as='span'>
						{data?.prescreeningDetails?.friendly_name ?? '-'}
					</Text20MediumPurpleWeight400>
				</Text20MidnightPurpleWeight400>
			}
			showActions={false}
			titleIcon={<SummarizeOutlinedIcon />}
			isATSCard
			closeCard={closeThiscard}
		>
			{isError ? (
				'Something went wrong'
			) : isFetching ? (
				<Box my={4} height={200}>
					<Loading />
				</Box>
			) : (
				<PreScreeningSummary outputCardsLength={outputCardsLength} data={data} clickRequestAction={clickRequestAction} event_id={event_id} type={type} />
			)}
		</OutputCard>
	);
}
