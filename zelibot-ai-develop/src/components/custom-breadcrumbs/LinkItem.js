import PropTypes from 'prop-types';
// @mui
import { Box, Link } from '@mui/material';
import RouterLink from 'src/components/router-link';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

BreadcrumbsLink.propTypes = {
	activeLast: PropTypes.bool,
	disabled: PropTypes.bool,
	link: PropTypes.shape({
		href: PropTypes.string,
		icon: PropTypes.node,
		name: PropTypes.string,
	}),
};

export default function BreadcrumbsLink({ link, activeLast, disabled }) {
	const { name, href, icon } = link;

	const styles = {
		typography: 'body2',
		alignItems: 'center',
		color: 'text.primary',
		display: 'inline-flex',
		...(disabled &&
			!activeLast && {
				cursor: 'default',
				pointerEvents: 'none',
				color: 'text.disabled',
			}),
	};

	const renderContent = (
		<>
			{icon && (
				<Box
					component='span'
					sx={{
						mr: 1,
						display: 'inherit',
						'& svg': { width: 20, height: 20 },
					}}
				>
					{icon}
				</Box>
			)}

			{name}
		</>
	);

	if (href) {
		return (
			<Link component={RouterLink} href={href} sx={styles}>
				{renderContent}
			</Link>
		);
	}

	return <Box sx={styles}> {renderContent} </Box>;
}
