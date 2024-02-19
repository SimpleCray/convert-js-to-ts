import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import { Box, Stack } from '@mui/material';
//
import NavList from './NavList';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavSectionMini.propTypes = {
	sx: PropTypes.object,
	data: PropTypes.array,
};

function NavSectionMini({ data, sx, ...other }) {
	return (
		<Stack
			spacing={0.5}
			alignItems='center'
			sx={{
				px: 0.75,
				...sx,
			}}
			{...other}
		>
			{data.map((group, index) => (
				<Items key={group.subheader} items={group.items} isLastGroup={index + 1 === data.length} />
			))}
		</Stack>
	);
}

export default memo(NavSectionMini);

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

Items.propTypes = {
	items: PropTypes.array,
	isLastGroup: PropTypes.bool,
};

function Items({ items, isLastGroup }) {
	return (
		<>
			{items.map((list) => (
				<NavList key={list.title + list.path} data={list} depth={1} hasChild={!!list.children} />
			))}

			{!isLastGroup && (
				<Box
					sx={{
						width: 24,
						height: '1px',
						bgcolor: 'divider',
						my: '8px !important',
					}}
				/>
			)}
		</>
	);
}
