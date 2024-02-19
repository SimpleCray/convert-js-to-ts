import { VideoBtn } from './VideoTimeDisplay';

export default {
	title: 'Components/VideoBtn',
	component: VideoBtn,
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
};

export const VideoTimeDisplay = {
	args: {
		time: '88.88',
	},
};
