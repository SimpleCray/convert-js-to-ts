import React from 'react';
import { Typography } from '@mui/material';
import {useTheme} from "@mui/material/styles";

const DescriptionText = ({ children, color, maxWidth, display, margin }) => {
	const theme = useTheme();

	return (
		<Typography
			variant='p'
			sx={{
				margin: margin ? margin : null,
				display: display ? display : 'block',
				color: color === 'purple' ? theme.palette.primary.darker  : color === 'black' ? theme.palette.common.black : theme.palette.common.white,
				fontSize: { xs: 18, md: 22 },
				textShadow: 'none',
				width: '100%',
				maxWidth: maxWidth ? maxWidth : 732,
				lineHeight: 1.3,
			}}
			dangerouslySetInnerHTML={{ __html: children }}
		></Typography>
	);
};

export default DescriptionText;
