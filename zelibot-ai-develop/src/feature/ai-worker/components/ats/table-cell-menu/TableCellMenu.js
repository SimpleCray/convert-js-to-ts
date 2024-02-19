import { useState } from 'react';
import { Typography, Menu, MenuItem, IconButton, Stack } from '@mui/material';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import DriveFileMoveRoundedIcon from '@mui/icons-material/DriveFileMoveRounded';

const TableCellMenu = ({ item, options }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const isOpen = Boolean(anchorEl);

	const handleButtonClick = (e) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
	};

	const handleItemClick = (e, item, clickEvent) => {
		e.stopPropagation();
		clickEvent(e, item);
		setAnchorEl(null);
	};

	return (
		<>
			<IconButton onClick={handleButtonClick}>
				<MoreVertRoundedIcon sx={{color: '#9859E0'}}/>
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				onClose={handleMenuClose}
				open={isOpen}
				sx={{
					'& .MuiMenu-paper': {
						padding: (theme) => theme.spacing(1),
						gap: (theme) => theme.spacing(1),
						minWidth: '8rem',
						// width: (theme) => theme.spacing(29),
					},
				}}
			>
				{options.map((option, i) => (
					<MenuItem key={`option-${i}`} onClick={(e) => handleItemClick(e, item, option.clickEvent)}>
						<Stack direction='row' justifyContent='space-between' width='100%' gap={2}>
							<Typography variant='body1'>{option.label} </Typography>
							{option.icon ? <TableCellMenuIconType variant={option.icon} /> : null}
						</Stack>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default TableCellMenu;

export const TableCellMenuIconType = ({ variant }) => {
	switch (variant) {
		case 'DELETE':
			return <DeleteForeverRoundedIcon className={'MuiChip-icon'} />;
		case 'ASSIGN':
			return <DriveFileMoveRoundedIcon className={'MuiChip-icon'} />;
		default:
			return (
				<svg className={'MuiChip-icon MuiSvgIcon-root'} width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
					<path d='M6.4 19.25H5V17.85L13.625 9.225L15.025 10.625L6.4 19.25ZM15.05 4.975L19.3 9.175L20.725 7.75C21.1083 7.36667 21.2917 6.90417 21.275 6.3625C21.2583 5.82083 21.0583 5.35833 20.675 4.975L19.275 3.575C18.8917 3.19167 18.4208 3 17.8625 3C17.3042 3 16.8333 3.19167 16.45 3.575L15.05 4.975ZM3.2875 20.9625C3.47917 21.1542 3.71667 21.25 4 21.25H6.825C6.95833 21.25 7.0875 21.225 7.2125 21.175C7.3375 21.125 7.45 21.05 7.55 20.95L17.85 10.65L13.6 6.4L3.3 16.7C3.2 16.8 3.125 16.9125 3.075 17.0375C3.025 17.1625 3 17.2917 3 17.425V20.25C3 20.5333 3.09583 20.7708 3.2875 20.9625ZM5.8325 3.2925L5.0425 5.0425L3.2925 5.8325C2.9025 6.0125 2.9025 6.5625 3.2925 6.7425L5.0425 7.5325L5.8325 9.2925C6.0125 9.6825 6.5625 9.6825 6.7425 9.2925L7.5325 7.5425L9.2925 6.7525C9.6825 6.5725 9.6825 6.0225 9.2925 5.8425L7.5425 5.0525L6.7525 3.2925C6.5725 2.9025 6.0125 2.9025 5.8325 3.2925Z' />
				</svg>
			);
	}
};
