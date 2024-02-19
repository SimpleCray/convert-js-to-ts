import { useMutation, useQuery } from '@tanstack/react-query';
import getQueryKeys from '../../helpers/getQueryKeys';
import { AIGetAPIRequest, AIPostAPIRequest } from '../../feature/ai-worker/constants';

export const useGetSurveyQuestions = ({ options, survey_id }) => {
	const endpoint = process.env['API_SURVEY_QUESTION'];
	const path = 'survey_question';
	const API = `${endpoint}/${path}`;
	return useQuery({
		queryKey: getQueryKeys.getSurveyQuestionsQueryKey(survey_id),
		queryFn: async () => {
			return AIGetAPIRequest(`${API}?survey_id=${survey_id}`);
		},
		...options,
	});
};

export const useSendSurveyAnswer = ({ options }) => {
	const endpoint = process.env['API_SURVEY_QUESTION'];
	const path = 'survey_answer';
	const API = `${endpoint}/${path}`;
	return useMutation({
		mutationFn: (payload) => {
			return AIPostAPIRequest(API, payload);
		},
		...options,
	});
};
