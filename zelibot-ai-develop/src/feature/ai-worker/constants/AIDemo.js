export const aiDemo = {
	defaultDialogue: null,
	defaultAvatar: {
		url: 'Alex_25_seconds_of_silence.mp4',
		loop: true,
	},
	actions: [
		{
			id: 1,
			triggerType: 'input',
			trigger: 'please',
			avatar: {
				url: 'Alex_25_seconds_of_silence.mp4',
				loop: true,
			},
			dialogue: null,
			prompts: [
				{
					id: 1,
					icon: 'text',
					title: 'Write position description',
					credit: 1,
					action: 'write-position-description',
				},
				{
					id: 2,
					icon: 'text',
					title: 'Write job ad',
					credit: 1,
					action: 'write-job-ad',
				},
			],
			outputs: [
				{
					id: 1,
					type: 'job-requisition',
					body: [
						{
							id: 1,
							title: 'Position Title',
							value: 'Marketing Account Manager',
						},
						{
							id: 2,
							title: 'Approved By',
							value: 'Sam Gupta',
						},
					],
					chips: [
						{
							id: 1,
							label: 'Approved',
						},
						{
							id: 2,
							label: 'Attachment detected',
						},
					],
				},
			],
			addToOutput: false,
		},
		{
			id: 2,
			triggerType: 'prompt',
			trigger: 'write-job-ad',
			avatar: {
				url: 'scene2_Alex_01.mp4',
			},
			dialogue: "Here's the job ad for the open Marketing Account Manager position. Shall I go ahead and post this?",
			prompts: null,
			outputs: [
				{
					id: 1,
					type: 'linkedin-job-ad',
				},
			],
			addToOutput: false,
		},
		{
			id: 3,
			triggerType: 'input',
			trigger: 'linkedin',
			avatar: {
				url: 'scene2_Alex_01.mp4',
			},
			dialogue: "Here's the job ad for the open Marketing Account Manager position. Shall I go ahead and post this?",
			prompts: null,
			outputs: [
				{
					id: 1,
					type: 'linkedin-job-ad',
				},
			],
			addToOutput: false,
		},
		// Clean slate
		{
			id: 4,
			triggerType: 'keyboard',
			trigger: 'ctrl+0',
			avatar: {
				url: 'Alex_25_seconds_of_silence.mp4',
				loop: true,
			},
			dialogue: '',
			prompts: [],
			outputs: [],
			notification: null,
			addToOutput: false,
		},
		{
			id: 5,
			triggerType: 'keyboard',
			trigger: 'ctrl+1',
			avatar: {
				url: 'scene3_Alex_01.mp4',
			},
			dialogue: 'Hey, welcome back! Three resumes have come in for the open Marketing Account Manager position, and it looks like we have some promising candidates.',
			prompts: [],
			outputs: [
				{
					id: 1,
					type: 'job-requisition',
					body: [
						{
							id: 1,
							title: 'Position Title',
							value: 'Marketing Account Manager',
						},
						{
							id: 2,
							title: 'Approved By',
							value: 'Sam Gupta',
						},
					],
					chips: [
						{
							id: 1,
							label: 'Approved',
						},
						{
							id: 2,
							label: 'Attachment detected',
						},
					],
				},
			],
			notification: {
				messageId: new Date().getTime(),
				title: `Marketing Account Manager position`,
				message: `3 resumes received`,
				action: 'view-resume',
			},
			addToOutput: false,
		},
		{
			id: 6,
			triggerType: 'input',
			trigger: 'list of candidates',
			avatar: {
				url: 'scene3_Alex_02.mp4',
			},
			dialogue: 'Here they are. Let me know if you want to know more.',
			prompts: null,
			outputs: [
				{
					id: 1,
					type: 'candidates',
				},
			],
			addToOutput: false,
		},
		{
			id: 7,
			triggerType: 'input',
			trigger: 'summary for the best candidate',
			avatar: {
				url: 'scene3_Alex_03.mp4',
			},
			dialogue: 'Anthony Stewart is a seasoned Marketing Account Manager with 20 years of experience in diverse industries. He excels in developing and executing marketing strategies, managing client accounts, and driving successful marketing campaigns.',
			prompts: null,
			outputs: [
				{
					id: 1,
					type: 'best-candidate-summary',
				},
			],
			addToOutput: false,
		},
		{
			id: 8,
			triggerType: 'input',
			trigger: 'job description',
			avatar: {
				url: 'scene3_Alex_04.mp4',
			},
			dialogue:
				"Here's a detailed comparison between Anthony's resume and the Marketing Account Manager profile. One: Client relationship building. Simon's resume highlights his exceptional ability to build and maintain strong relationships with clients, resulting in an impressive 40% increase in customer satisfaction and a remarkable 30% growth in repeat business.",
			prompts: null,
			outputs: [
				{
					id: 2,
					type: 'view-resume',
				},
			],
			addToOutput: true,
		},
		{
			id: 9,
			triggerType: 'input',
			trigger: 'video interview',
			avatar: {
				url: 'scene4_Alex_01.mp4',
			},
			dialogue: "Absolutely. I'm sending him an invite by email and will give him a call and let you know how it went.",
			prompts: null,
			outputs: null,
			addToOutput: false,
		},
		{
			id: 10,
			triggerType: 'keyboard',
			trigger: 'ctrl+2',
			avatar: null,
			dialogue: null,
			prompts: null,
			outputs: null,
			notification: {
				messageId: new Date().getTime(),
				title: `Anthony Stewart`,
				message: `Completed his video interview`,
				action: 'view-interview-summary',
			},
			addToOutput: false,
		},
		{
			id: 11,
			triggerType: 'input',
			trigger: 'how did it go',
			avatar: {
				url: 'scene4_Alex_09.mp4',
			},
			dialogue: 'He seems like a really good fit. He was confident and enthusiastic. Here is a recording with my notes and summary. I would suggest to get him in for a live interview.',
			prompts: null,
			outputs: null,
			addToOutput: false,
		},
		{
			id: 12,
			triggerType: 'keyboard',
			trigger: 'ctrl+3',
			avatar: null,
			dialogue: null,
			prompts: null,
			outputs: null,
			notification: {
				messageId: new Date().getTime(),
				title: `Anthony Stewart`,
				message: `Live interview completed`,
				action: 'view-live-interview-summary',
			},
			addToOutput: false,
		},
		{
			id: 13,
			triggerType: 'input',
			trigger: 'live interview',
			avatar: {
				url: 'scene5_Alex_01.mp4',
			},
			dialogue: "Absolutely. I'll contact him again right now and put it on your calendars.",
			prompts: null,
			outputs: null,
			addToOutput: false,
		},
		{
			id: 14,
			triggerType: 'input',
			trigger: 'what did you think',
			avatar: {
				url: 'scene5_Alex_05.mp4',
			},
			dialogue: 'I agree. He was able to speak about his experience in great detail and seemed to be really inspired by what the company is building. Here is a recording with my notes and summary. Have a look and let me know if you want to proceed.',
			prompts: null,
			outputs: null,
			addToOutput: false,
		},
		{
			id: 15,
			triggerType: 'input',
			trigger: 'employment contract',
			avatar: {
				url: 'scene6_Alex_01.mp4',
			},
			dialogue: "Here's the contract, as well as a summary of it, and the email for the Hiring Manger to request final approval.",
			prompts: null,
			outputs: [
				{
					id: 1,
					type: 'view-employment-contract',
				},
			],
			addToOutput: false,
		},
		{
			id: 16,
			triggerType: 'keyboard',
			trigger: 'ctrl+4',
			avatar: null,
			dialogue: null,
			prompts: null,
			outputs: null,
			notification: {
				messageId: new Date().getTime(),
				title: `Anthony Stewart`,
				message: `Accepted Job Offer`,
				action: 'view-job-status',
			},
			addToOutput: false,
		},
		{
			id: 16,
			triggerType: 'keyboard',
			trigger: 'ctrl+5',
			avatar: null,
			dialogue: null,
			prompts: null,
			outputs: null,
			notification: {
				messageId: new Date().getTime(),
				title: `Anthony Stewart`,
				message: `Signed Employment Contract`,
			},
			addToOutput: false,
		},
	],
};
