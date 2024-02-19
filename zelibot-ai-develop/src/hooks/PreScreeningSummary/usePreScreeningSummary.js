import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getQueryKeys, { GET_PRE_SCREENING_DETAILS } from '../../helpers/getQueryKeys';
import { AIPostAPIRequest } from '../../feature/ai-worker/constants';
import { useSnackbar } from 'notistack';
import { getCompoundComponentPromiseBySectionName } from '../../utils/common';

const SECTION_NAMES = {
	CANDIDATE_NOTES: 'CANDIDATE_NOTES',
	PRE_SCREENING_VIDEO: 'PRE_SCREENING_VIDEO',
	PRE_SCREENING_INTERVIEW_DETAILS: 'PRE_SCREENING_INTERVIEW_DETAILS',
};

export const useGetPreScreeningDetails = ({ options, compound_component, id }) => {
	return useQuery({
		queryKey: getQueryKeys.getPreScreeningDetailsQueryKey(id),
		queryFn: async () => {
			let { promise: notesPromise, endpoint: notesEndpoint } = getCompoundComponentPromiseBySectionName(compound_component, SECTION_NAMES.CANDIDATE_NOTES);
			let { promise: recordingVideoPromise } = getCompoundComponentPromiseBySectionName(compound_component, SECTION_NAMES.PRE_SCREENING_VIDEO);
			let { promise: prescreeningDetailsPromise } = getCompoundComponentPromiseBySectionName(compound_component, SECTION_NAMES.PRE_SCREENING_INTERVIEW_DETAILS);
			const [notesResponse, recordingVideoResponse, prescreeningDetailsResponse] = await Promise.all([notesPromise, recordingVideoPromise, prescreeningDetailsPromise]);
			return { notesEndpoint, notes: notesResponse?.[0]?.notes, recordingVideo: recordingVideoResponse, prescreeningDetails: prescreeningDetailsResponse?.[0] };
		},
		staleTime: 0,
		...options,
	});
};

export const useUpdateCandidateNotes = ({ options, endpoint }) => {
	const { enqueueSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload) => {
			return AIPostAPIRequest(endpoint, payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries([GET_PRE_SCREENING_DETAILS]);
			enqueueSnackbar('Note updated', { variant: 'success' });
		},
		...options,
	});
};
