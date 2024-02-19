import PropTypes from 'prop-types';
// @mui
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
//
import useLocales from './useLocales';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

ThemeLocalization.propTypes = {
	children: PropTypes.node,
};

export default function ThemeLocalization({ children }) {
	const outerTheme = useTheme();

	const { currentLang } = useLocales();

	const theme = createTheme(outerTheme, currentLang.systemValue);

	const customTheme = createTheme(theme, {
		components: {
			MuiMenu: {
				styleOverrides: {
					paper: {
						backgroundColor: '#fff!important',
						color: '#21054C',
						backgroundImage: 'none',
					},
				},
			},
		},
	});

	return <ThemeProvider theme={customTheme}> {children} </ThemeProvider>;
}
