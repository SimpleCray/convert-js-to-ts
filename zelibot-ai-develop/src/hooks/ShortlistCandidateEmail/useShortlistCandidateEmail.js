import { useMutation, useQuery } from '@tanstack/react-query';
import getQueryKeys from '../../helpers/getQueryKeys';
import { getCompoundComponentPromiseBySectionName } from '../../utils/common';
import { useSnackbar } from 'notistack';
import { AIPostAPIRequest } from '../../feature/ai-worker/constants';

const SECTION_NAMES = {
	WSC_SHORTLIST_CANDIDATE_EMAIL: 'WSC_SHORTLIST_CANDIDATE_EMAIL',
};

export const useGetShortlistCandidateEmailDetails = ({ options, compound_component, id }) => {
	return useQuery({
		queryKey: getQueryKeys.getShortlistCandidateEmailDetailsQueryKey(id),
		queryFn: async () => {
			let { promise: shortlistCandidateEmailDetailsPromise, endpoint: shortlistCandidateDetailsEndpoint } = getCompoundComponentPromiseBySectionName(compound_component, SECTION_NAMES.WSC_SHORTLIST_CANDIDATE_EMAIL);
			const shortlistCandidateEmailDetails = await shortlistCandidateEmailDetailsPromise;
			return { shortlistCandidateEmailDetails, shortlistCandidateDetailsEndpoint };
		},
		...options,
	});
};

export const useSendShortlistCandidateEmail = ({ options, endpoint }) => {
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: (payload) => {
			return AIPostAPIRequest(endpoint, payload);
		},
		onSuccess: () => {
			enqueueSnackbar('Shortlist candidate email sent', { variant: 'success' });
		},
		...options,
	});
};
