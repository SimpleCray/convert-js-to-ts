import PropTypes from 'prop-types';
// @mui
import { Link, Typography, Box } from '@mui/material';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

MenuHotProducts.propTypes = {
	tags: PropTypes.array,
};

export default function MenuHotProducts({ tags, ...other }) {
	return (
		<Box {...other}>
			<Typography variant='caption' fontWeight='fontWeightBold'>
				Hot Products:
			</Typography>
			&nbsp;
			{tags.map((tag, index) => (
				<Link
					key={tag.name}
					component={RouterLink}
					href={tag.path}
					underline='none'
					variant='caption'
					sx={{
						color: 'text.secondary',
						transition: (theme) => theme.transitions.create('all'),
						'&:hover': { color: 'primary.main' },
					}}
				>
					{index === 0 ? tag.name : `, ${tag.name} `}
				</Link>
			))}
		</Box>
	);
}
