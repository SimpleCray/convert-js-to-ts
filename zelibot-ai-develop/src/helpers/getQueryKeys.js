export const GET_JOB_OPENINGS = 'GET_JOB_OPENINGS';
export const GET_PRE_SCREENING_DETAILS = 'GET_PRE_SCREENING_DETAILS';
export const GET_REJECTION_EMAIL_DETAILS = 'GET_REJECTION_EMAIL_DETAILS';
export const GET_CANDIDATE_LIST_AND_JOB_OPENING_LIST = 'GET_CANDIDATE_LIST_AND_JOB_OPENING_LIST';
export const GET_SHORTLIST_CANDIDATE_EMAIL_DETAILS = 'GET_SHORTLIST_CANDIDATE_EMAIL_DETAILS';
export const GET_DOCUMENT_CONTENT = 'GET_DOCUMENT_CONTENT';
export const GET_SURVEY_QUESTIONS = 'GET_SURVEY_QUESTIONS';

const getQueryKeys = {
	getJobOpeningsQueryKey: () => [GET_JOB_OPENINGS],
	getPreScreeningDetailsQueryKey: (id) => [GET_PRE_SCREENING_DETAILS, id],
	getRejectionEmailDetailsQueryKey: (id) => [GET_REJECTION_EMAIL_DETAILS, id],
	getCandidateListAndJobOpeningListQueryKey: () => [GET_CANDIDATE_LIST_AND_JOB_OPENING_LIST],
	getShortlistCandidateEmailDetailsQueryKey: (id) => [GET_SHORTLIST_CANDIDATE_EMAIL_DETAILS, id],
	getDocumentContentQueryKey: (id) => [GET_DOCUMENT_CONTENT, id],
	getSurveyQuestionsQueryKey: (survey_id) => [GET_SURVEY_QUESTIONS, survey_id],
};

export default getQueryKeys;
