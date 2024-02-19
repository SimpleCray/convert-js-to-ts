import PropTypes from 'prop-types';
import { LazyMotion, m } from 'framer-motion';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

// eslint-disable-next-line import/extensions
const loadFeatures = () => import('./features.js').then((res) => res.default);

MotionLazyContainer.propTypes = {
	children: PropTypes.node,
};

export default function MotionLazyContainer({ children }) {
	return (
		<LazyMotion strict features={loadFeatures}>
			<m.div style={{ height: '100%' }}> {children} </m.div>
		</LazyMotion>
	);
}
