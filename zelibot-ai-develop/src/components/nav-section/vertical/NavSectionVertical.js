import PropTypes, { func } from 'prop-types';
// @mui
import { List, Stack, Button } from '@mui/material';
// locales
import { useLocales } from '../../../locales';
//
import { StyledSubheader } from './styles';
import NavList from './NavList';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
	sx: PropTypes.object,
	data: PropTypes.array,
	hideHeader: PropTypes.bool,
	// TODO: props passed down a long chain, turn into a context provider or something
	actionHandler: PropTypes.func,
	onCloseNav: PropTypes.func,
};

export default function NavSectionVertical({ data, sx, hideHeader = false, actionHandler, onCloseNav, ...other }) {
	const { translate } = useLocales();

	return (
		<Stack sx={sx} {...other}>
			{data.map((group) => {
				const key = group.subheader || group.items[0].title;
				
				return (
					<List key={key} disablePadding sx={{ pl: 3, pr: 0, py: 1 }}>
						{group.subheader && !hideHeader && <StyledSubheader disableSticky>{`${translate(group.subheader)}`}</StyledSubheader>}

						{group.items.map((list) => {
							return <NavList key={list.title + list.path} data={list} depth={1} hasChild={!!list.children} actionHandler={actionHandler} onCloseNav={onCloseNav} />
						})}
					</List>
				);
			})}
		</Stack>
	);
}
