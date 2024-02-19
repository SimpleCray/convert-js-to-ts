import { Button, Stack } from '@mui/material';
import { CustomSortIcon } from 'src/components/custom-icons';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const TableHeadAction = ({ title, id, orderType, orderBy, order, onSort, style = {} }) => {
	return (
		<Button px={0.5} py={1} sx={style} variant='text' onClick={() => onSort(id, orderType)}>
			<Stack
				direction='row'
				alignItems='center'
				gap={1}
				sx={{
					fontSize: '14px',
					// whiteSpace: 'nowrap',
					overflow: 'hidden',
				}}
			>
				{title} <CustomSortIcon isSorting={orderBy === id} isAsc={orderBy === id && order === 'asc'} />
			</Stack>
		</Button>
	);
};

export default TableHeadAction;
