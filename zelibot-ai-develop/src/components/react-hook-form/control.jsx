import { Textarea } from './';

export const CONTROL_TYPE = {
	INPUT: 'input',
	TEXTAREA: 'textarea',
};

const Control = (props) => {
	const { control, ...rest } = props;
	switch (control) {
		case CONTROL_TYPE.TEXTAREA:
			return <Textarea {...rest} />;
		default:
			return null;
	}
};
export default Control;
