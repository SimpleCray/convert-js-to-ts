import { useMutation, useQuery } from '@tanstack/react-query';
import getQueryKeys from '../../helpers/getQueryKeys';
import { AIGetAPIRequest, AIPostAPIRequest } from '../../feature/ai-worker/constants';
import { useSnackbar } from 'notistack';
import { ASSIGN_DOCUMENT_TYPE } from '../../feature/ai-worker/components/output-card/cards/Documents';
import { getCompoundComponentPromiseBySectionName } from '../../utils/common';

export const useGetAllCandidatesAndJobOpenings = ({ options }) => {
	return useQuery({
		queryKey: [getQueryKeys.getCandidateListAndJobOpeningListQueryKey()],
		queryFn: async () => {
			const candidateListPromise = AIGetAPIRequest(`${process.env['API_HR_ATS_MS']}/get_candidate_list`);
			const jobOpeningListPromise = AIGetAPIRequest(`${process.env['API_HR_ATS_MS']}/get_job_openings`);
			const [candidateList, jobOpeningList] = await Promise.all([candidateListPromise, jobOpeningListPromise]);
			return { candidateList, jobOpeningList };
		},
		...options,
	});
};

export const useAssignDocument = ({ options }) => {
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: ({ type, ...payload }) => {
			if (type === ASSIGN_DOCUMENT_TYPE.CANDIDATE) {
				return AIPostAPIRequest(`${process.env['API_HR_ATS_MS']}/assign_document_candidate`, payload);
			} else if (type === ASSIGN_DOCUMENT_TYPE.JOB_OPENING) {
				return AIPostAPIRequest(`${process.env['API_HR_ATS_MS']}/assign_document_job_opening`, payload);
			}
			return null;
		},
		onSuccess: () => {
			enqueueSnackbar('Document assigned', { variant: 'success' });
		},
		...options,
	});
};

const SECTION_NAMES = {
	section_name: 'DOCUMENT_CONTENT',
};

export const useGetDocumentContent = ({ options, compound_component, id }) => {
	return useQuery({
		queryKey: [getQueryKeys.getDocumentContentQueryKey(id)],
		queryFn: async () => {
			let { promise: documentContentPromise, endpoint: documentContentEndpoint } = getCompoundComponentPromiseBySectionName(compound_component, SECTION_NAMES.section_name);
			const documentContent = await documentContentPromise;
			return { documentContent, documentContentEndpoint };
		},
		...options,
	});
};

export const useEditDocumentContent = ({ options, endpoint }) => {
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: (payload) => {
			return AIPostAPIRequest(endpoint, payload);
		},
		onSuccess: () => {
			enqueueSnackbar('Document content updated', { variant: 'success' });
		},
		...options,
	});
};
