import PropTypes from 'prop-types';
// form
import { FormProvider as Form } from 'react-hook-form';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

FormProvider.propTypes = {
	children: PropTypes.node,
	methods: PropTypes.object,
	onSubmit: PropTypes.func,
};

export default function FormProvider({ children, onSubmit, methods }) {
	return (
		<Form {...methods}>
			<form style={{ height: '100%' }} onSubmit={onSubmit}>
				{children}
			</form>
		</Form>
	);
}
