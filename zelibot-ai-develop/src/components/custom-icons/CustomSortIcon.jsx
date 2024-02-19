import { Box } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const CustomSortIcon = ({ isAsc = false, isSorting = false }) => {
	if (!isSorting) {
		return <UnfoldMoreRoundedIcon sx={{ opacity: 0.5, width: '2.2rem', height: '2.2rem' }} />;
	}
	return <Box>{isAsc ? <KeyboardArrowUpIcon sx={{ width: '1.7rem', height: '1.7rem' }} /> : <KeyboardArrowDownIcon sx={{ width: '1.7rem', height: '1.7rem' }} />}</Box>;
};

export default CustomSortIcon;
