import { forwardRef } from 'react';
import { m } from 'framer-motion';

const AnimatedBorder = forwardRef((props, ref) => {
	return (
		<m.svg ref={ref} viewBox='0 0 262 2' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<m.path d='M0 1H262' stroke='url(#paint0_linear_8_66)' strokeWidth='0.5' initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
			<defs>
				<linearGradient id='paint0_linear_8_66' x1='262.241' y1='1.5072' x2='-0.0880435' y2='6.61646' gradientUnits='userSpaceOnUse'>
					<stop stopColor='#FEFDFD' />
					<stop offset='1' stopColor='#955AF4' />
				</linearGradient>
			</defs>
		</m.svg>
	);
});

export default AnimatedBorder;
