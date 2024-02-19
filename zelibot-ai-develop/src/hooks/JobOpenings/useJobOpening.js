import { useMutation, useQuery } from '@tanstack/react-query';
import getQueryKeys from '../../helpers/getQueryKeys';
import { AIGetAPIRequest, AIPostAPIRequest } from '../../feature/ai-worker/constants';
import { useSnackbar } from 'notistack';

export const useGetJobOpenings = () => {
	return useQuery({
		queryKey: getQueryKeys.getJobOpeningsQueryKey(),
		queryFn: () => {
			return AIGetAPIRequest(`${process.env['API_JOB_OPENING_MS']}/get_job_openings`);
		},
	});
};

export const useEditJobOpening = () => {
	const { enqueueSnackbar } = useSnackbar();
	const path = 'add_or_update_clients';
	const endpoint = process.env['API_JOB_OPENING_MS'];
	const API = `${endpoint}/${path}`;
	return useMutation({
		mutationFn: (payload) => {
			return AIPostAPIRequest(API, payload);
		},
		onSuccess: () => {
			enqueueSnackbar('Job Opening edited ', { variant: 'success' });
		},
	});
};

export const useDeleteJobOpening = () => {
	const { enqueueSnackbar } = useSnackbar();
	const path = 'delete_job_openings';
	const endpoint = process.env['API_JOB_OPENING_MS'];
	const API = `${endpoint}/${path}`;
	return useMutation({
		mutationFn: (jobOpeningId) => {
			return AIPostAPIRequest(API, {
				job_opening_id: jobOpeningId,
			});
		},
		onSuccess: () => {
			enqueueSnackbar('Job Opening deleted ', { variant: 'success' });
		},
	});
};

export const useCloseReopenJobOpening = () => {
	const { enqueueSnackbar } = useSnackbar();
	const path = 'change_job_opening_status';
	const endpoint = process.env['API_JOB_OPENING_MS'];
	const API = `${endpoint}/${path}`;
	return useMutation({
		mutationFn: ({ job_opening_id, job_opening_status_id }) => {
			return AIPostAPIRequest(API, {
				job_opening_id,
				job_opening_status_id,
			});
		},
		onSuccess: () => {
			enqueueSnackbar('Job Opening Status updated ', { variant: 'success' });
		},
	});
};
