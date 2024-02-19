import React, { ReactNode } from 'react';
import { Container, Stack, Typography, Button, Divider } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { SxProps } from '@mui/system';

type BillingProps = {
	heading: string;
	btnLabel: string;
	body: ReactNode;
	endIcon?: ReactNode;
	sx?: SxProps;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => {}
};

const BillingInfo = (props: BillingProps) => {
	const { heading, btnLabel, body, endIcon = <EditRoundedIcon />, sx, onClick } = props;
	return (
		<Container sx={sx}>
			<Stack spacing={2} direction={'row'} alignItems={'baseline'} justifyContent={'space-between'} mb={1}>
				<Typography color={'#21054C'} sx={{ fontWeight: '600', height: '35px' }}>
					{heading || 'Current Plan'}
				</Typography>
				{btnLabel && (
					<Button variant='outlined' color='primary' size='small' endIcon={endIcon} onClick={onClick}>
						{btnLabel || 'Change'}
					</Button>
				)}
			</Stack>
			<Divider />
			<Stack mt={1}>{body}</Stack>
		</Container>
	);
};

export default BillingInfo;
