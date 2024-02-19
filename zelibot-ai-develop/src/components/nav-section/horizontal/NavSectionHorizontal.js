import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import { Stack } from '@mui/material';
// utils
import { hideScrollbarY } from '../../../utils/cssStyles';
//
import NavList from './NavList';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavSectionHorizontal.propTypes = {
	sx: PropTypes.object,
	data: PropTypes.array,
};

function NavSectionHorizontal({ data, sx, ...other }) {
	return (
		<Stack
			direction='row'
			spacing={1}
			sx={{
				mx: 'auto',
				...hideScrollbarY,
				...sx,
			}}
			{...other}
		>
			{data.map((group) => (
				<Items key={group.subheader} items={group.items} />
			))}
		</Stack>
	);
}

export default memo(NavSectionHorizontal);

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

Items.propTypes = {
	items: PropTypes.array,
};

function Items({ items }) {
	return (
		<>
			{items.map((list) => (
				<NavList key={list.title + list.path} data={list} depth={1} hasChild={!!list.children} />
			))}
		</>
	);
}
