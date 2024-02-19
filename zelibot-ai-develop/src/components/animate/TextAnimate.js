import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import { Box } from '@mui/material';
//
import { varFade } from './variants';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

TextAnimate.propTypes = {
	text: PropTypes.string,
	variants: PropTypes.object,
	sx: PropTypes.object,
};

export default function TextAnimate({ text, variants, sx, ...other }) {
	return (
		<Box
			component={m.div}
			sx={{
				m: 0,
				typography: 'h1',
				overflow: 'hidden',
				display: 'inline-flex',
				...sx,
			}}
			{...other}
		>
			{text.split('').map((letter, index) => (
				<m.span key={'text-animate-'+index} variants={variants || varFade().inUp}>
					{letter}
				</m.span>
			))}
		</Box>
	);
}
