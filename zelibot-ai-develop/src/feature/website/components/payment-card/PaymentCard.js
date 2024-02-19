import React from 'react';
import { Box, Typography, Button, Stack, Link } from '@mui/material';

const PaymentCard = ({ cardName, cardSubtitle, paymentAmount, paymentIntervalTag, CTAText, CTALink, cardPointers, cardWidth }) => {
	let element = document.getElementById('contact');
	return (
		<Box maxWidth={{ sm: '500px' }} sx={{ backgroundColor: 'transparent', border: '2px solid white', borderRadius: '24px', minWidth: '0px', width: cardWidth ? cardWidth : '100%', padding: 4 }}>
			<Typography color='white' fontWeight={700} fontSize={34}>
				{cardName}
			</Typography>
			<Typography fontWeight={400} marginY={1} color='white' variant={'subtitle1'} dangerouslySetInnerHTML={{ __html: cardSubtitle }}></Typography>
			<Stack direction={'row'} alignItems={'flex-end'} my={2}>
				<Box display={'flex'} flexDirection={'row'} mr={2} alignItems={'flex-start'}>
					<Typography fontSize={'42px'} color='white'>
						$
					</Typography>
					<Typography fontWeight={400} sx={{ fontSize: '80px' }} color='white'>
						{paymentAmount}
					</Typography>
				</Box>
				<Typography fontWeight={400} sx={{ fontSize: '14px', mb: 2.75 }} color='white' variant={'subtitle2'} dangerouslySetInnerHTML={{ __html: paymentIntervalTag }}></Typography>
			</Stack>
			<Link href='auth/register'>
				<Button sx={{ border: '2px solid white', backgroundColor: '#170058', minWidth: '50%', height: 50, color: 'white', marginBottom: 0 }}>{CTAText}</Button>
			</Link>
			{cardPointers ? (
				<ul style={{ padding: 0, listStylePosition: 'inside', marginTop: '40px' }}>
					{cardPointers.map((cardPointer, index) => {
						return (
							<li style={{ color: 'white', marginBottom: '12px', minHeight: '22px' }} key={'card-pointer-' + index}>
								<Typography color='white' variant={'p'}>
									{cardPointer}
								</Typography>
							</li>
						);
					})}
				</ul>
			) : null}
		</Box>
	);
};

export default PaymentCard;
