import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { AIPostAPIRequest } from '../../feature/ai-worker/constants';

export const useSendUserFeedback = (setUserFeedbackId) => {
	const { enqueueSnackbar } = useSnackbar();
	const API = process.env['API_SEND_USER_FEEDBACK'];
	return useMutation({
		// payload = {event_id, click_sentiment, comment}
		mutationFn: (payload) => AIPostAPIRequest(API, payload),
		onSuccess: (data) => {
			enqueueSnackbar('Feedback sent', { variant: 'success' });
			if (data?.user_feedback_id && setUserFeedbackId) {
        setUserFeedbackId(data.user_feedback_id)
      }
		},
	});
};
