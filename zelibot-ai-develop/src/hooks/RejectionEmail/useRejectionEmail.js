import { useMutation, useQuery } from '@tanstack/react-query';
import getQueryKeys from '../../helpers/getQueryKeys';
import { getCompoundComponentPromiseBySectionName } from '../../utils/common';
import { useSnackbar } from 'notistack';
import { AIPostAPIRequest } from '../../feature/ai-worker/constants';

const SECTION_NAMES = {
	WSC_REJECTION_EMAIL: 'WSC_REJECTION_EMAIL',
};

export const useGetRejectionEmailDetails = ({ options, compound_component, id }) => {
	return useQuery({
		queryKey: getQueryKeys.getRejectionEmailDetailsQueryKey(id),
		queryFn: async () => {
			let { promise: rejectionEmailDetailsPromise, endpoint: rejectionEmailDetailsEndpoint } = getCompoundComponentPromiseBySectionName(compound_component, SECTION_NAMES.WSC_REJECTION_EMAIL);
			const rejectionEmailDetails = await rejectionEmailDetailsPromise;
			return { rejectionEmailDetails, rejectionEmailDetailsEndpoint };
		},
		...options,
	});
};

export const useSendRejectionEmail = ({ options, endpoint }) => {
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: (payload) => {
			return AIPostAPIRequest(endpoint, payload);
		},
		onSuccess: () => {
			enqueueSnackbar('Rejection email sent', { variant: 'success' });
		},
		...options,
	});
};
