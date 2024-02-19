import { styled } from '@mui/material/styles';
import { Box, Checkbox, TableRow, TableCell, TableHead as MuiTableHead, TableSortLabel } from '@mui/material';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	'& .MuiTableCell-root': {
		// padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
		color: theme.palette.primary.contrastText,
	},
	'& > .MuiTableSortLabel-root.Mui-active': {
		color: theme.palette.primary.contrastText,
	},
}));

const visuallyHidden = {
	border: 0,
	margin: -1,
	padding: 0,
	width: '1px',
	height: '1px',
	overflow: 'hidden',
	position: 'absolute',
	whiteSpace: 'nowrap',
	clip: 'rect(0 0 0 0)',
};

const TableHead = ({ order, orderBy, rowCount = 0, headLabel, numSelected = 0, onSort, onSelectAllRows, sx }) => {
	return (
		<MuiTableHead sx={{ ...sx, borderTopLeftRadius: (theme) => theme.shape.borderRadius, borderTopRightRadius: (theme) => theme.shape.borderRadius }}>
			<TableRow>
				{onSelectAllRows && (
					<TableCell padding='checkbox'>
						<Checkbox indeterminate={numSelected > 0 && numSelected < rowCount} checked={rowCount > 0 && numSelected === rowCount} onChange={(event) => onSelectAllRows(event.target.checked)} />
					</TableCell>
				)}

				{headLabel.map((headCell, index) => (
					<StyledTableCell
						key={headCell.id}
						align={headCell.align || 'left'}
						sortDirection={orderBy === headCell.id ? order : false}
						sx={{
							// width: headCell.width,
							width: `calc(100% / ${Object.keys(headLabel).length})`,
							minWidth: headCell.minWidth,
							background: (theme) => theme.palette.primary.darker,
							color: (theme) => theme.palette.primary.contrastText,
							padding: '4px 8px',
							...(index === 0 && { borderTopLeftRadius: (theme) => theme.shape.borderRadius }),
							...(index === headLabel.length - 1 && { borderTopRightRadius: (theme) => theme.shape.borderRadius }),
							...headCell.headerStyle,
						}}
					>
						{onSort && headCell.sort ? (
							<TableSortLabel hideSortIcon active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={() => onSort(headCell.id)} sx={{ textTransform: 'capitalize' }}>
								{headCell.label}

								{orderBy === headCell.id ? <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box> : null}
							</TableSortLabel>
						) : (
							headCell.label
						)}
					</StyledTableCell>
				))}
			</TableRow>
		</MuiTableHead>
	);
};

export default TableHead;
export { TableHead };
