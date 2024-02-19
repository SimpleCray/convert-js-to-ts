import Layout from './layout';
import { APP_NAME } from '../../config-global';
import { Helmet } from 'react-helmet-async';
import { Hero } from './components';
import { Box, Typography, Stack } from '@mui/material';
import Switch from './components/switch-btn/Switch';
import { useEffect, useState } from 'react';
import PaymentCard from './components/payment-card/PaymentCard';

export default function Pricing() {
	const [yearlyPlan, setYearlyPlan] = useState(true);
	const mainCardPoints = ['Create job descriptions and ads', 'Summarise & evaluate resumes', 'Candidate pre-screening interviews' ,'Candidate suitability ranking', 'Ability to top up your Zelicredits'];

	useEffect(() => {
		const href = window.location.href.substring(window.location.href.lastIndexOf('#') + 1);
		const element = document.getElementById(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}, []);

	return (
		<Layout headerStyle={'light'} headerGap={false} mobileHeaderGap={false} bgGradient={2}>
			<Helmet>
				<title>Pricing - {APP_NAME}</title>
			</Helmet>
			<Hero image={'/assets/images/pricing-banner-img.svg'} title={'<span style="font-weight: 300">Unlimit </span><span style="font-weight: 600">your time.</span>'} textStyle={'purple'} />
			{/* ZELIGATE PAYMENT CARDS */}
			<Box px={2} py={{ xs: 4 }} pb={{ xs: 8 }}>
				{/* Toggle Box */}
				<Stack direction={'row'} alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', height: 120, margin: 'auto' }}>
					<Typography variant='subtitle1' color={yearlyPlan ? '#C492F4' : '#fff'}>
						Pay monthly
					</Typography>
					<Box mx={4}>
						<Switch onChange={(event) => setYearlyPlan(event.target.checked)} checked={yearlyPlan} size={'small'} />
					</Box>
					<Typography marginBottom={1} variant={'subtitle1'} color={yearlyPlan ? '#fff' : '#C492F4'}>
						Yearly discount
					</Typography>
				</Stack>
				{/* Main Pricing Card */}
				<Box display={'flex'} justifyContent={'center'}>
					<PaymentCard cardName='Zeli subscription' cardSubtitle='2500 Zeli credits per month' paymentAmount={yearlyPlan ? 49 : 55} paymentIntervalTag={`Per month <br> billed ${yearlyPlan ? 'annually' : 'monthly'}`} CTAText={'Start free trial'} cardPointers={mainCardPoints} />
				</Box>
				{/* Pricing Card Packs */}
				{/* <Box my={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography my={6} fontWeight={400} fontSize={'22px'} color={'white'}>Zelicredit top-up packs</Typography>
                    <Stack width={'100%'} maxWidth={{ md: '80%' }} direction={{ sm: 'column', md: 'row' }} justifyContent={'center'} alignItems={'center'} gap={4}>
                        <PaymentCard
                            cardName="Light"
                            cardSubtitle="1000 Zelicredits"
                            paymentAmount={19}
                            paymentIntervalTag={'Single<br>Payment'}
                            CTAText={'Get Pack'}
                        />
                        <PaymentCard
                            cardName="Pro"
                            cardSubtitle="5000 Zelicredits"
                            paymentAmount={39}
                            paymentIntervalTag={'Single<br>Payment'}
                            CTAText={'Get Pack'}
                        />
                        <PaymentCard
                            cardName="Champion"
                            cardSubtitle="10000 Zelicredits"
                            paymentAmount={59}
                            paymentIntervalTag={'Single<br>Payment'}
                            CTAText={'Get Pack'}
                        />
                    </Stack>
                </Box> */}
				{/* Endorsed by section */}
				{/* <Box my={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography my={6} fontWeight={400} fontSize={'22px'} color={'white'}>Endorsed by industry-leading companies</Typography>

                </Box> */}
			</Box>
			{/* <CTASection /> */}
			{/* START ZELIGATING FOR FREE SECTION */}
			{/* <Box px={2} pt={2} pb={4} sx={{ minHeight: '70vh', background: backgroundGradient, color: '#21054C', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Stack my={4} direction={'column'} justifyContent={'space-between'} alignItems={'center'} textAlign={'center'}>
                    <Typography fontSize={{ xs: 36, sm: 44 }} mb={2} fontStyle={{ fontWeight: 400 }}>Start Zeligating for FREE</Typography>
                    <Typography fontSize={{ xs: 22, sm: 22 }} fontStyle={{ fontWeight: 400 }}>No billing for the first 30 days.</Typography>
                </Stack>
                <Stack py={2} direction={{ xs: 'column', sm: 'row' }} gap={5} maxWidth={{ md: '80%' }}>
                    <Box width={{ xs: '100%', sm: '50%' }}>
                        <Typography fontSize={{ xs: '16px', md: '22px' }} fontWeight={400} lineHeight={{ xs: '24px', md: '28px' }}>
                            Today you will be charged US$0.00. You may cancel your free trial at any time in your Dashboard. If you do not cancel during your free trial, you will be charged US${yearlyPlan ? Math.floor(49 - 0.1 * 49) : 49}/month {'('}plus applicable tax{')'} for your subscription on{'<'} 30 days from current date {'>'}.
                        </Typography>
                        <Stack mt={4} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Stack direction="row" alignItems={'center'} onClick={() => setCardPayment(true)}>
                                <img height={'100%'} style={{ marginRight: '10px' }} src="/assets/images/mastercard.svg"></img>
                                <img height={'100%'} src="/assets/images/visa.svg"></img>
                            </Stack>
                        </Stack>
                        <TextField variant='filled' label='Card Number' placeholder='**** **** **** ****' sx={{ width: '100%', marginTop: '25px', backgroundColor: 'white', borderRadius: 0.5 }} />
                        <TextField variant='filled' label='Cardholder name' placeholder='Name on card' sx={{ width: '100%', marginTop: '25px', backgroundColor: 'white', borderRadius: 0.5 }} />
                        <Stack direction="row" gap={2}>
                            <TextField variant='filled' label="Expiration Date" placeholder='MM/YY' sx={{ width: '100%', marginTop: '25px', backgroundColor: 'white', borderRadius: 0.5 }} />
                            <TextField variant='filled' label='CVV/CVC' placeholder='888' sx={{ width: '100%', marginTop: '25px', backgroundColor: 'white', borderRadius: 0.5 }} />
                        </Stack>
                    </Box>
                    <Box width={{ xs: '100%', sm: '50%' }} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box padding={{ xs: 2, md: 4 }} maxWidth={{ sm: '400px' }} sx={{ position: 'relative', width: '100%', height: '100%', border: '2px solid #170058', borderRadius: '24px' }}>
                            <Stack mb={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                <Box>
                                    <Typography variant="h4">Invoice</Typography>
                                    <Typography variant="p">Billed in USD$</Typography>
                                </Box>
                            </Stack>
                            <Stack mt={1} mb={2} direction={'row'} justifyContent={'space-between'}>
                                <Box>
                                    <Typography variant="p">Selected plan</Typography>
                                    <br></br>
                                    <Typography variant="p">1000 Zelicredits/month</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h5">$0.00</Typography>
                                </Box>
                            </Stack>
                            <TextField variant='filled' label="Discount Code" placeholder='Enter Discount Code' sx={{ width: '100%', backgroundColor: 'white', borderRadius: 0.5 }} />
                            <Stack mt={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography variant="subtitle1">Discount</Typography>
                                <Typography variant="subtitle1">$0.00</Typography>
                            </Stack>
                            <Stack my={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography fontWeight={400} variant="subtitle2">Estimated Tax</Typography>
                                <Typography fontWeight={400} variant="subtitle2">$0.00</Typography>
                            </Stack>
                            <div style={{ height: '2px', backgroundColor: '#170058', width: '100%' }}></div>
                            <Stack my={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography variant="h5">Total</Typography>
                                <Typography variant="h5">$0.00</Typography>
                            </Stack>
                            <Typography>Your receipt will be sent to:</Typography>
                            <Typography variant={'subtitle1'}>email@company.com</Typography>
                            <Stack mt={{ xs: 2, md: 4 }} direction={'row'}>
                                <Typography sx={{ color: '#9859E0', width: '100%', textAlign: 'right' }}>Cancellation Policy</Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Stack>
                <Typography my={4} maxWidth={{ md: '80%' }}>
                    Your subscription will automatically renew until you cancel it. By registering day, you agree to our <a href="#">Customer Agreement</a> and you acknowledge that you have read and understood our <a href="#">Privacy Policy</a>.
                </Typography>
                <Button sx={{ border: '1px solid white', backgroundColor: '#170058', width: 175, height: 65, color: 'white', fontSize: 22 }}>Continue</Button>
            </Box> */}
		</Layout>
	);
}
