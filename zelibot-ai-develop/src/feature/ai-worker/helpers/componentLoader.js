import { v4 as uuidv4 } from 'uuid';

// ? This file is for features that are loaded without websocket
const componentLoader = (action, clickRequest = {}, target_url = '') => {
	const id = uuidv4();
	let componentObj;
	switch (action) {
		case 'USER_DOCUMENTS':
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'USER_DOCUMENTS',
				compound_component: [
					{
						action_id: 'USER_DOCUMENTS',
						section_name: 'USER_DOCUMENTS',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'get_job_opening_documents',
					},
				],
				target_path: 'candidates',
				action: 3,
				sleep_time: 3,
			};
			break;
		case 'CLIENT_DETAILS':
			// console.log('Loading client details card in componentLoader')
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'CLIENT_DETAILS',
				target_path: '',
				action: 3,
				sleep_time: 0,
				client_data: clickRequest
			};
			break
		case 'CLIENT_LIST':
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'CLIENT_LIST',
				compound_component: [
					{
						action_id: 'CLIENT_LIST',
						section_name: 'CLIENT_LIST',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'get_clients_by_userid',
					},
				],
				target_path: 'get_clients_by_userid',
				action: 3,
				sleep_time: 3,
			};
			break;
		case 'JOB_OPENING_LIST':
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'WSC_OPEN_JOB_LISTINGS',
				compound_component: [
					{
						action_id: 'JOB_OPENING_LIST',
						section_name: 'JOB_OPENINGS',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'get_job_openings',
					},
					{
						action_id: 'JOB_OPENING_LIST',
						section_name: 'JOB_OPENING_CANDIDATE_COUNT',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'get_candidate_count_by_opening_id',
					},
				],
				target_path: '',
				action: 3,
				sleep_time: 3,
			};
			break;

		case 'DISPLAY_CANDIDATE_LISTING':
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'WSC_CANDIDATE_LIST',
				compound_component: [
					{
						action_id: 'DISPLAY_CANDIDATE_LISTING',
						section_name: 'CANDIDATE_LIST',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'get_candidate_list',
					},
					{
						action_id: 'DISPLAY_CANDIDATE_LISTING',
						section_name: 'ASSIGN_CANDIDATE',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'assign_candidate',
					},
					{
						action_id: 'DISPLAY_CANDIDATE_LISTING',
						section_name: 'SET_CANDIDATE_STATUS',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'set_candidate_status',
					},
					{
						action_id: 'DISPLAY_CANDIDATE_LISTING',
						section_name: 'DELETE_CANDIDATE',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'delete_candidate',
					},
					{
						action_id: 'DISPLAY_CANDIDATE_LISTING',
						section_name: 'JOB_OPENING_LIST',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'get_job_openings',
					},
				],
				target_path: '',
				action: 3,
				sleep_time: 3,
			};
			break;

		case 'REVIEW_CANDIDATES':
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'WSC_CANDIDATE_LIST',
				compound_component: [
					{
						action_id: 'DISPLAY_CANDIDATE_LISTING',
						section_name: 'CANDIDATE_LIST',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'get_candidate_list',
					},
					{
						action_id: 'DISPLAY_CANDIDATE_LISTING',
						section_name: 'ASSIGN_CANDIDATE',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'assign_candidate',
					},
					{
						action_id: 'DISPLAY_CANDIDATE_LISTING',
						section_name: 'SET_CANDIDATE_STATUS',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'set_candidate_status',
					},
					{
						action_id: 'DISPLAY_CANDIDATE_LISTING',
						section_name: 'DELETE_CANDIDATE',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'delete_candidate',
					},
					{
						action_id: 'DISPLAY_CANDIDATE_LISTING',
						section_name: 'JOB_OPENING_LIST',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: 'get_job_openings',
					},
				],
				target_path: '',
				action: 3,
				sleep_time: 3,
			};
			break;

		case 'CREATE_JOB_OPENING':
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'CREATE_JOB_OPENING',
				compound_component: [
					{
						action_id: 'CREATE_JOB_OPENING',
					},
				],
				target_path: 'get_existing_clients',
				action: 3,
				sleep_time: 3,
			};
			break;

		case 'UPLOAD_RESUMES':
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'UPLOAD_FILES',
				compound_component: [
					{
						action_id: 'UPLOAD_RESUMES',
					},
				],
				target_path: '',
				action: 3,
				sleep_time: 3,
				avatar_dialog: ''
			};
			break;

			case 'UPLOAD_FILES':
				componentObj = {
					id: id,
					data: '#LOAD_COMPONENT',
					type: 'UPLOAD_FILES',
					compound_component: [
						{
							action_id: 'UPLOAD_RESUMES',
						},
					],
					target_path: '',
					action: 3,
					sleep_time: 3,
					avatar_dialog: ''
				};
				break;

		case 'CANDIDATES_QUICKSIGHT':
			componentObj = {
				id: id,
				// data: parsedSocketMessage?.data,
				type: 'QUICKSIGHT',
				// title: parsedSocketMessage?.title,
				// action: parsedSocketMessage?.action,
				// target_url: parsedSocketMessage?.target_url,
				// compound_component: parsedSocketMessage?.compound_component,
				// target_api_endpoint: parsedSocketMessage?.target_api_endpoint,
				target_path: 'candidates',
			};
			break;

		case 'FIRST_TIME_ATS':
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'FIRST_TIME_ATS',
				compound_component: [
					{
						action_id: 'FIRST_TIME_ATS',
					},
				],
				target_path: '',
				action: 3,
				sleep_time: 0,
			};
			break;

		case 'REVIEW_PRE_SCREENING_CALLS':
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'PRE_SCREENING_OVERVIEW',
				compound_component: [
					{
						action_id: 'REVIEW_PRE_SCREENING_CALLS',
					},
				],
				target_path: '',
				action: 3,
				sleep_time: 0,
			};
			break;

			case 'SOFTWARE_UPDATE':
				componentObj = {
					id: id,
					data: '#LOAD_COMPONENT',
					type: 'SOFTWARE_UPDATE',
					compound_component: [
						{
							action_id: 'SOFTWARE_UPDATE',
						},
					],
					target_path: '',
					action: 3,
					sleep_time: 0,
				};
				break;

		case 'WSC_CANDIDATE_PROFILE':
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'WSC_CANDIDATE_PROFILE',
				action: 3,
				target_url: '',
				compound_component: [
					{
						action_id: 'WSC_CANDIDATE_PROFILE',
						section_name: 'CANDIDATE_DETAILS',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: `get_candidate_details?candidate_id=${clickRequest?.candidate_id}&job_id=${clickRequest?.job_id}`,
					},
					{
						action_id: 'WSC_CANDIDATE_PROFILE',
						section_name: 'CANDIDATE_SCORE',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: `get_candidate_score?candidate_id=${clickRequest?.candidate_id}&job_id=${clickRequest?.job_id}`,
					},
					{
						action_id: 'WSC_CANDIDATE_PROFILE',
						section_name: 'CANDIDATE_NOTES',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: `candidate_notes?candidate_id=${clickRequest?.candidate_id}&job_id=${clickRequest?.job_id}`,
					},
					{
						action_id: 'WSC_CANDIDATE_PROFILE',
						section_name: 'CANDIDATE_DOCUMENTS',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: `get_candidate_document?candidate_id=${clickRequest?.candidate_id}&job_id=${clickRequest?.job_id}`,
					},
					{
						action_id: 'WSC_CANDIDATE_PROFILE',
						section_name: 'DELETE_CANDIDATE_DOCUMENTS',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: `delete_candidate_document?candidate_id=${clickRequest?.candidate_id}&job_id=${clickRequest?.job_id}`,
					},
				],
				target_api_endpoint: 'HR_ATS_MS',
				target_path: '',
			};
			break;

		case 'OPEN_CANDIDATE_PRESCREEN_REVIEW':
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'PRE_SCREENING_SUMMARY',
				action: 3,
				target_url: '',
				compound_component: [
					{
						action_id: 'OPEN_CANDIDATE_PRESCREEN_REVIEW',
						section_name: 'CANDIDATE_NOTES',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: `candidate_notes?candidate_id=${clickRequest.candidate_id}&pre_screening_interview_id=${clickRequest.pre_screening_interview_id}&meeting_id=${clickRequest.meeting_id}&job_id=${clickRequest.job_opening_id}`,
					},
					{
						action_id: 'OPEN_CANDIDATE_PRESCREEN_REVIEW',
						section_name: 'PRE_SCREENING_INTERVIEW_DETAILS',
						target_api_endpoint: 'VIDEO_CHAT',
						target_path: `get_pre_screening_interview_details?candidate_id=${clickRequest.candidate_id}&pre_screening_interview_id=${clickRequest.pre_screening_interview_id}&meeting_id=${clickRequest.meeting_id}&job_id=${clickRequest.job_opening_id}`,
					},
					{
						action_id: 'OPEN_CANDIDATE_PRESCREEN_REVIEW',
						section_name: 'PRE_SCREENING_VIDEO',
						target_api_endpoint: 'VIDEO_CHAT',
						target_path: `get_meeting_video?candidate_id=${clickRequest.candidate_id}&pre_screening_interview_id=${clickRequest.pre_screening_interview_id}&meeting_id=${clickRequest.meeting_id}&job_id=${clickRequest.job_opening_id}`,
					},
					{
						action_id: 'OPEN_CANDIDATE_PRESCREEN_REVIEW',
						section_name: 'PRE_SCREENING_TRANSCRIPTION',
						target_api_endpoint: 'VIDEO_CHAT',
						target_path: `get_pre_screening_interview_transcription?candidate_id=${clickRequest.candidate_id}&pre_screening_interview_id=${clickRequest.pre_screening_interview_id}&meeting_id=${clickRequest.meeting_id}&job_id=${clickRequest.job_opening_id}`,
					},
				],
				target_api_endpoint: '',
				target_path: '',
				event_id: 'da172388-c96d-4b52-bbf6-009cdf1ac522',
			};
			break;

		case 'JOB_OPENING':
			componentObj = {
				id: id,
				data: '#LOAD_COMPONENT',
				type: 'WSC_JOB_STATUS',
				action: 3,
				target_url: '',
				compound_component: [
					{
						action_id: 'JOB_OPENING',
						section_name: 'JOB_OPENING_COMPANY',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: `get_job_openings?job_id=${clickRequest?.id}&id=&title=${clickRequest?.title}`,
					},
					{
						action_id: 'JOB_OPENING',
						section_name: 'JOB_OPENING_DOCUMENTS',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: `get_job_opening_documents?job_id=${clickRequest?.id}&id=${clickRequest?.id}&title=${clickRequest?.title}`,
					},
					{
						action_id: 'JOB_OPENING',
						section_name: 'CANDIDATE_STAGES',
						target_api_endpoint: 'CANDIDATE_STAGE_MS',
						target_path: `get_candidate_stages?job_id=${clickRequest?.id}&id=${clickRequest?.id}&title=${clickRequest?.title}`,
					},
					{
						action_id: 'JOB_OPENING',
						section_name: 'JOB_OPENING_CANDIDATES',
						target_api_endpoint: 'HR_ATS_MS',
						target_path: `get_job_opening_candidates?candidate_id=${clickRequest?.candidate_id}&job_id=${clickRequest?.job_id}`,
					},
					{
						action_id: 'JOB_OPENING',
						section_name: 'JOB_OPENING_STAGE_SUMMARY',
						target_api_endpoint: 'CANDIDATE_STAGE_MS',
						target_path: `get_job_opening_stage_summary?candidate_id=${clickRequest?.candidate_id}&job_id=${clickRequest?.job_id}419`,
					},
					{
						action_id: 'JOB_OPENING',
						section_name: 'JOB_OPENING_STAGE_DETAILS',
						target_api_endpoint: 'CANDIDATE_STAGE_MS',
						target_path: `get_job_opening_stage_details?candidate_id=${clickRequest?.candidate_id}&job_id=${clickRequest?.job_id}`,
					},
					{
						action_id: 'DISPLAY_SINGLE_JOB_OPENING_FOR_INVITE_CANDIDATES',
						section_name: 'SET_CANDIDATE_STAGES',
						target_api_endpoint: 'CANDIDATE_STAGE_MS',
						target_path: `post_candidate_stages?candidate_id=${clickRequest?.candidate_id}&job_id=${clickRequest?.job_id}`,
					},
				],
				target_api_endpoint: '',
				target_path: '',
				event_id: 'a945223d-2dea-4ff6-ade0-9416bcb419f5',
			};
			break;
		case 'VIEW_DOCUMENT':
			componentObj = {
				action: 3,
				compound_component: [{ action_id: 'VIEW_DOCUMENT', section_name: null, target_api_endpoint: null, target_path: null, sk: clickRequest?.sk }],
				data: clickRequest,
				event_id: '6266c158-019c-4a2a-8050-0b0b5ea8228d',
				id: id,
				target_api_endpoint: '',
				target_path: '',
				target_url,
				type: 'VIEW_DOCUMENT',
				writingContent: false,
			};
			break;
		default:
			componentObj = null;
			break;
	}

	return componentObj;
};

const FEATURES_WITHOUT_WEBSOCKET = ['USER_DOCUMENTS', 'CLIENT_LIST', 'JOB_OPENING_LIST', 'DISPLAY_CANDIDATE_LISTING', 'REVIEW_CANDIDATES', 'CREATE_JOB_OPENING', 'UPLOAD_RESUMES', 'CANDIDATES_QUICKSIGHT', 'FIRST_TIME_ATS','REVIEW_PRE_SCREENING_CALLS', 'OPEN_CANDIDATE_PRESCREEN_REVIEW', 'WSC_CANDIDATE_PROFILE', 'VIEW_DOCUMENT', 'CLIENT_DETAILS', 'SOFTWARE_UPDATE', 'PRE_SCREENING_OVERVIEW', 'WSC_CANDIDATE_LIST', 'UPLOAD_FILES', 'WSC_OPEN_JOB_LISTINGS'];

export { componentLoader, FEATURES_WITHOUT_WEBSOCKET };
