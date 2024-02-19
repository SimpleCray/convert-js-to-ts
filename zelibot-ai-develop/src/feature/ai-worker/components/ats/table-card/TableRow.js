import { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { TableRow as MuiTableRow, TableCell, Stack, Typography, IconButton, Menu, MenuItem, Tooltip, TextField, Button } from '@mui/material';
// Menu icons
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
// cell icons
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';

const TableRow = ({ row, selected, onEditRow, handleRowClick, enableRowClick = true, menuComponent, subRowComponent, subRowVisible, actionWidth, rowAction, tableType }) => {
	const rowStatus = row?.upload_status_id || 1;
	// For arranging the body correctly
	const filteredKeyCount = Object.keys(row).filter((k) => !k.match(/(\_id|^id$)/)).length;

	const handleDataLinking = (e, item, row, k) => {
		e.preventDefault();
		e.stopPropagation();
		// console.log('Data clicked is >>> ', item, row, k);
		if (k === 'document' || k === 'category') {
			// console.log('Data clicked is >>> ', item, row, k);
			handleRowClick(e, row);
			return
		}
		if (k === 'job_title' && row?.job_title?.value !== 'None' && row?.job_title?.value !== 'Multiple') {
			const jobId = row?.job_opening_id;
			const jobTitle = row?.job_title.value;
			// console.log('Value is job title, should open job status')
			rowAction(undefined, 'JOB_OPENING', { id: jobId, ...(jobTitle && { title: jobTitle }) });
			return
		}
		if (k === 'company') {
			// console.log('Value is company, should open client card')
			if (row?.company?.client_id) {
				rowAction(null, 'CLIENT_DETAILS', row?.company?.client_id);
			}
			return
		}
		if (k === 'friendly_name') {
			const candidateId = row?.candidate_id;
			const jobId = row?.job_opening_id;
			// console.log('Value is friendly name, should open candidate card')
			rowAction(undefined, 'WSC_CANDIDATE_PROFILE', { candidate_id: candidateId, ...(jobId && { job_id: jobId }) });
			return
		}
		if (k === 'email') {
			// console.log('Value is email, should open email')
			// Manually open the mailto: link
			window.open(`mailto:${row?.email?.value}`, '_blank');
			return
		}
	}

	const rowClickTimer = useRef(null);
	const [rowClickDisabled, setRowClickDisabled] = useState(false);

	return (
		<>
			<MuiTableRow
				hover
				selected={selected}
				onClick={(e) => {
					if (enableRowClick && handleRowClick) {
						if (!rowClickDisabled) {
							handleRowClick(e, row);
						}
					}
				}}
				sx={{
					cursor: enableRowClick ? 'pointer' : 'default',
					height: '56px',
					width: '100%',
				}}
			>
				{/* Handle values that are not nested objects (won't have icons or anything) */}
				{/* {Object.keys(row).filter((k) => !k.match(/(\_id|^id$)/)).map((item, i) => {
                    return (
                        <TableCell key={`cell-${i}`} sx={{ padding: '16px 0', border: 'none', borderBottom: (theme) => `1px solid ${theme.palette.divider}`, color: '#030D3A', width: `calc(100% / ${filteredKeyCount})` }}>
                            <Stack direction='row' alignItems='center' justifyContent='center' spacing={0}>
                                <Typography variant={'body2'} noWrap>
                                    {row[item] ?? '-'}
                                </Typography>
                            </Stack>
                        </TableCell>
                    );
                })} */}

				{Object.keys(row)
					.filter((k) => !k.match(/(\_id|^id$)/))
					.map((k, i) => {
						const { value, icon, type, showValue = true, cellStyle } = row[k];
						if (!value && (!type || type !== 'toggle') && !icon) {
							if (tableType === 'candidate_list') {
								return <TableCell
									key={'table-row-key-' + i + Math.random()}
									sx={{
										padding: '4px 8px',
										border: 'none',
										borderBottom: (theme) => (!subRowVisible ? `1px solid ${theme.palette.divider}` : 'none'),
										color: (theme) => (rowStatus === 2 ? theme.palette.grey[500] : '#030D3A'),
										// color: '#030D3A',
										width: k === 'company' ? '184px' : `calc(100% / ${filteredKeyCount + (menuComponent ? 1 : 0)})`,
										maxWidth: `calc(672px / ${filteredKeyCount + (menuComponent ? 1 : 0)})`,
										fontSize: '14px',
										textAlign: 'center',
										...cellStyle,
									}}>-</TableCell>
							} else {
								return null;
							}
						}
						return (
							<TableCell
								key={'table-row-key-' + i + Math.random()}
								sx={{
									padding: '4px 8px',
									border: 'none',
									borderBottom: (theme) => (!subRowVisible ? `1px solid ${theme.palette.divider}` : 'none'),
									color: (theme) => (rowStatus === 2 ? theme.palette.grey[500] : '#030D3A'),
									// color: '#030D3A',
									width: k === 'company' ? '184px' : `calc(100% / ${filteredKeyCount + (menuComponent ? 1 : 0)})`,
									maxWidth: `calc(672px / ${filteredKeyCount + (menuComponent ? 1 : 0)})`,
									fontSize: '14px',
									...cellStyle,
								}}
							>
								<Tooltip title={value.toString()}>
									<Stack direction='row' alignItems='center' justifyContent={i < 1 || k === 'company' || k === 'candidates' || k === 'client' ? 'flex-start' : 'center'} spacing={`${icon ? 0 : 2}`} alt={value.toString()}>
										{icon && <TableCellIconType variant={rowStatus === 'pending' ? 'PENDING' : icon} />}
										{value && (type === 'string' || !type) && showValue && (
											<Typography
												onClick={(e) => handleDataLinking(e, row[k], row, k)}
												sx={{ "&:hover": (k === 'job_title' && value === 'None' || k === 'job_title' && value === 'Multiple' || k === 'date' || k === 'job_status') ? null : { color: '#9859E0', textDecoration: 'underline' } }} fontSize={'14px'} variant={i === 0 ? 'body1' : 'body2'} noWrap>
												{value}
											</Typography>
										)}
										{type === 'toggle' && (
											<StyledSwitch
												checked={value || false}
												onChange={(e) => {
													e.stopPropagation();
													// handleToggle(e, value)
													if (row[k].cellAction) {
														row[k].cellAction(e, row, value);
													}
												}}
												onClick={(e) => {
													// swallow the click else it'll bubble up to the row and run whatever handler came with it
													// will probably end up opening a file or single item card
													e.stopPropagation();
												}}
											/>
										)}
									</Stack>
								</Tooltip>
							</TableCell>
						);
					})}
				{menuComponent && (
					<TableCell
						sx={{ padding: '16px 0', border: 'none', borderBottom: (theme) => (!subRowVisible ? `1px solid ${theme.palette.divider}` : 'none'), color: '#030D3A', width: actionWidth ?? `calc(100% / ${filteredKeyCount + (menuComponent ? 1 : 0)})` }}
						onClick={(e) => e.stopPropagation()} // swallow clicks so the row handler doesn't end up triggering when clicking the menu. on chrome. not on firefox because it already handled it better
					>
						<Stack direction='row' alignItems='center' justifyContent={actionWidth ? 'flex-end' : 'center'}>
							{menuComponent}
						</Stack>
					</TableCell>
				)}
			</MuiTableRow>
			{subRowComponent && subRowVisible && (
				<MuiTableRow sx={{ height: '56px' }}>
					<TableCell colSpan={filteredKeyCount + (menuComponent ? 1 : 0)} sx={{ paddingX: 0 }}>
						{subRowComponent}
					</TableCell>
				</MuiTableRow>
			)}
		</>
	);
};

// Move this to a reusable state
const StyledSwitch = styled(Switch)(({ theme }) => ({
	width: 42,
	height: 22,
	padding: 0,
	zIndex: 100,
	'& .MuiSwitch-switchBase': {
		padding: 0,
		margin: 2,
		transitionDuration: '300ms',
		left: 0,
		'&.Mui-checked': {
			transform: 'translateX(16px)',
			color: '#fff',
			left: 4,
			'& + .MuiSwitch-track': {
				backgroundColor: '#6E30C1',
				opacity: 1,
				border: 0,
			},
			'&.Mui-disabled + .MuiSwitch-track': {
				opacity: 0.5,
			},
		},
		'&.Mui-focusVisible .MuiSwitch-thumb': {
			color: '#33cf4d',
			border: '6px solid #fff',
		},
		'&.Mui-disabled .MuiSwitch-thumb': {
			color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
		},
		'&.Mui-disabled + .MuiSwitch-track': {
			opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
		},
	},
	'& .MuiSwitch-thumb': {
		boxSizing: 'border-box',
		width: 18,
		height: 18,
	},
	'& .MuiSwitch-track': {
		borderRadius: 22 / 2,
		backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 500,
		}),
	},
}));

export const TableCellIconType = ({ variant }) => {
	switch (variant) {
		case 'PERSON':
			return <PersonOutlineRoundedIcon className={'MuiChip-icon'} sx={{ color: (theme) => theme.palette.primary.light }} />;
		case 'WORK':
			return <WorkOutlineRoundedIcon className={'MuiChip-icon'} sx={{ color: (theme) => theme.palette.primary.light }} />;
		case 'FILE':
			return <DescriptionRoundedIcon className={'MuiChip-icon'} sx={{ color: (theme) => theme.palette.primary.light }} />;
		case 'DOC':
			return <DescriptionOutlinedIcon className={'MuiChip-icon'} sx={{ color: (theme) => theme.palette.primary.light }} />;
		case 'VIDEO':
			return <SmartDisplayOutlinedIcon className={'MuiChip-icon'} sx={{ color: (theme) => theme.palette.primary.light }} />;
		case 'PENDING':
			return <AutorenewRoundedIcon className={'MuiChip-icon'} sx={{ color: (theme) => theme.palette.grey[500] }} />;
		default:
			return null;
	}
};

export default TableRow;
export { TableRow };