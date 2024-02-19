import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {useTheme} from "@mui/material/styles";
import {Button, Drawer, IconButton, Link, Stack, styled} from '@mui/material';
import {Iconify} from '@zelibot/zeligate-ui';
import CloseIcon from '@mui/icons-material/Close';
import {usePathname} from 'src/hooks/usePathname';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NewNavMobile.propTypes = {
	data: PropTypes.array,
	isOffset: PropTypes.bool,
};

const StyledLink = styled(Link)(({ theme }) => ({
	color: theme.palette.common.white,
	fontSize: 40,
	lineHeight: 1.3,
	letterSpacing: -0.4,
}));

function NewNavMobile({ isOffset, data, style }) {
	const pathname = usePathname();
	const theme = useTheme();

	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (open) {
			handleClose();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<IconButton
				onClick={handleOpen}
				sx={{
					color: style === 'dark' ? 'text.primary' : '#fff',
				}}
			>
				<Iconify icon="ic:round-menu" width={24} height={24} />
			</IconButton>
			<Drawer
				sx={{
					'& .MuiPaper-root': {
						backgroundColor: 'transparent',
						width: '100%',
						backdropFilter: 'blur(4px)',
						padding: theme.spacing(2),
					},
				}}
				open={open}
				onClose={handleClose}
				anchor='right'
			>
				<Stack flexDirection={'row'} justifyContent={'flex-end'} alignItems={'center'} sx={{ marginBottom: theme.spacing(16) }}>
					<Button endIcon={<CloseIcon />} sx={{ color: theme.palette.common.white }} onClick={handleClose}>
						Close
					</Button>
				</Stack>
				<Stack gap={2} justifyContent={'center'} alignItems={'center'}>
					<StyledLink href={'/'}>
						Home
					</StyledLink>
					{data.map((item, index) => (
						<StyledLink href={item.path} key={'Mobile-Navigation-Item-' + index}>
							{item.title}
						</StyledLink>
					))}
				</Stack>
			</Drawer>
		</>
	);
}

export default NewNavMobile;
