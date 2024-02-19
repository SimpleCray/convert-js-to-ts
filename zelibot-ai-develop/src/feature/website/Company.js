import React, { useEffect, useState } from 'react';
import Layout from './layout/Layout';
import { APP_NAME } from '../../config-global';
import { Helmet } from 'react-helmet-async';
import { Hero, OutlinedHeading } from './components';
import { Link as RRLink } from 'react-router-dom';
import { Box, Typography, Button, Stack, Link, styled, IconButton } from '@mui/material';
import useResponsive from 'src/hooks/useResponsive';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import SectionRevamp from './components/section/SectionRevamp';
import DescriptionText from 'src/components/typography/DescriptionText';
import { KeyboardArrowLeft as KeyboardArrowLeftIcon, KeyboardArrowRight as KeyboardArrowRightIcon } from '@mui/icons-material';

const aboutUsContent = `Every story has its own unique spark, and ours began with a simple question: could a fledgling idea become something extraordinary? What started as a casual coffee chat quickly ignited into a registered business. Today, we're a spirited team of 15 go-getters who've transformed that spark into a reality. Yes, we have a real office (with its share of late nights and whiteboard marathons), but there's more to us than pizza and brainstorming.<br><br>
Zeligate isn't your average startup. We're a passionate force driven by a shared vision: to leverage the power of AI and change the world for the better. We're innovators, creators, and disruptors, united by a commitment to leaving our mark.<br><br>
If you share this fire, this hunger for something bigger, we invite you to join us on our journey. Come be part of a team poised to rewrite the future: scroll down and click on the careers email link to get in touch.`;

const revolutionContent = [
	`Looking for your next adventure?  This may be the start for your next chapter.<br><br>
We are always on the lookout for big thinkers, problem solvers, and challengers of the status quo. Our mission at Zeligate is simple: we don't just embrace change; we drive it.<br><br>
Our team is made up of innovators who are passionate about reshaping the future and creating solutions that impact lives.`,
];

const companyValues = ['/assets/images/innovation-value.svg', '/assets/images/honesty-value.svg', '/assets/images/commitment-value.svg', '/assets/images/continuous-learning-value.svg', '/assets/images/excellence-value.svg'];

const companyValuesMobile = ['/assets/images/innovation-mobile.png', '/assets/images/honesty-mobile.png', '/assets/images/commitment-mobile.png', '/assets/images/learning-mobile.png', '/assets/images/excellence-mobile.png'];

const media = [
	{
		image: '/assets/images/media-image-1.png',
		link: 'https://www.youtube.com/watch?v=RZURhd0pCgM',
	},
	{
		image: '/assets/images/media-image-2.png',
		link: 'https://www.youtube.com/watch?v=SvFt6G6uhYA',
	},
	{
		image: '/assets/images/media-image-3.png',
		link: 'https://www.hrleader.com.au/tech/24885-a-glimpse-into-the-future-of-hr',
	},
	{
		image: '/assets/images/media-image-4.png',
		link: 'https://tickernews.co/ai-in-the-modern-economy/',
	},
];

const Company = () => {
	const isDesktop = useResponsive('up', 'md');
	const isTablet = useResponsive('up', 'sm');
	const [companyValuesIndex, setCompanyValuesIndex] = useState(0);
	const [mediasIndex, setMediasIndex] = useState(0);

	useEffect(() => {
		const href = window.location.href.substring(window.location.href.lastIndexOf('#') + 1);
		const element = document.getElementById(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}, []);

	const returnDescriptionText = (textArray) => {
		return textArray.length > 0
			? textArray.map((text, index) => {
					return (
						<Typography key={'return-description-text-' + text} fontWeight={400} fontSize={{ xs: 18, sm: 22 }} lineHeight={{ xs: '23.4px', sm: '28.6px' }} maxWidth={'730px'} width={{ md: '75%' }} mx={{ xs: 'auto' }} my={{ xs: 3, md: 6 }} variant={'subtitle2'} sx={{ color: 'white' }}>
							{text}
						</Typography>
					);
				})
			: null;
	};

	const createAboutUsSection = () => {
		return (
			<>
				<SectionRevamp px={4} heading={'<span>About us.</span>'} description={aboutUsContent} alignment={'CENTER-TEXT'} />
				<Box px={4} mt={0} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
					<img src='/assets/images/about/theteam.png' style={{ borderRadius: 24, width: 'min(100%, 730px)' }} />
				</Box>
			</>
		);
	};

	const createRevolutionSection = () => {
		return (
			<Stack gap={4}>
				<SectionRevamp px={4} heading={'<span>Come join the revolution.</span>'} description={revolutionContent} alignment={'CENTER-TEXT'} />
				{isTablet ? (
					<Typography textAlign={'center'} color='white' variant='h4'>
						Our values
					</Typography>
				) : (
					<Box px={4} mt={0} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
						<Stack width='100%' direction='row' alignItems='center' justifyContent='space-between'>
							<ArrowButton onClick={() => setCompanyValuesIndex((prevIndex) => (prevIndex - 1 + companyValuesMobile?.length) % companyValuesMobile?.length)}>
								<KeyboardArrowLeftIcon style={{ color: '#fff' }} />
							</ArrowButton>
							<Typography textAlign={'center'} color='white' variant='h4'>
								Our values
							</Typography>
							<ArrowButton onClick={() => setCompanyValuesIndex((prevIndex) => (prevIndex + 1) % companyValuesMobile?.length)}>
								<KeyboardArrowRightIcon style={{ color: '#fff' }} />
							</ArrowButton>
						</Stack>
					</Box>
				)}
				{isTablet ? (
					<Box margin={'auto'} maxWidth={'750px'} mt={0} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
						<Stack gap={2} mt={0} direction={'row'} width={{ md: '100%' }} justifyContent={'space-between'}>
							{companyValues.map((value, index) => {
								return (
									// <Box key={'company-value-' + index} sx={{ width: '100%', color: 'white' }}>
									<img key={'company-values-img-' + index} style={{ width: '100%' }} src={value}></img>
									// </Box>
								);
							})}
						</Stack>
					</Box>
				) : (
					<Box>
						<Carousel selectedItem={companyValuesIndex} showStatus={false} showThumbs={false} showArrows={false} infiniteLoop={true} autoPlay={true} showIndicators={false} emulateTouch={true}>
							{companyValuesMobile.map((value, index) => {
								return (
									<Box px={4} key={'company-value-' + index} sx={{ margin: 'auto', width: '100%', color: 'white' }}>
										<img style={{ width: '100%' }} src={value}></img>
									</Box>
								);
							})}
						</Carousel>
					</Box>
				)}
				<Stack gap={4} alignItems={'center'} px={4}>
					<DescriptionText maxWidth={'750px'}>If you're someone who thrives on challenges, dreams beyond the ordinary, and is ready to leave a mark in the world of AI and technology, you might just be the perfect fit for our team.</DescriptionText>
					<Box maxWidth={{ xs: '100%', md: '750px' }} padding={2} sx={{ backgroundColor: 'white', width: '100%', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
						<Typography textAlign={'center'}>We're always looking for the brightest minds to join the team.</Typography>
						<Typography textAlign={'center'}>Send us your CV to</Typography>
						<Link href='mailto:careers@zeligate.com'>
							<Button sx={{ backgroundColor: '#170058', color: 'white', marginTop: '25px' }}>careers@zeligate.com</Button>
						</Link>
					</Box>
				</Stack>
			</Stack>
		);
	};

	const createMediaSection = () => {
		return (
			<Stack id='media-anchor' gap={4}>
				<OutlinedHeading sx={{ textAlign: 'center', color: 'white' }} heading={'<span>Media.</span>'} />
				{isTablet ? (
					<Typography color='white' variant='h4' textAlign={'center'}>
						In the news
					</Typography>
				) : (
					<Box px={4} mt={0} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
						<Stack width='100%' direction='row' alignItems='center' justifyContent='space-between'>
							<ArrowButton onClick={() => setMediasIndex((prevIndex) => (prevIndex - 1 + media?.length) % media?.length)}>
								<KeyboardArrowLeftIcon style={{ color: '#fff' }} />
							</ArrowButton>
							<Typography color='white' variant='h4' textAlign={'center'}>
								In the news
							</Typography>
							<ArrowButton onClick={() => setMediasIndex((prevIndex) => (prevIndex + 1) % media?.length)}>
								<KeyboardArrowRightIcon style={{ color: '#fff' }} />
							</ArrowButton>
						</Stack>
					</Box>
				)}
				{/* News Swiper */}
				{isTablet ? (
					<Box margin={'auto'} maxWidth={'750px'} mt={0} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
						<Stack direction='row' alignItems='center' justifyContent='space-between'>
							<ArrowButton onClick={() => setMediasIndex((prevIndex) => (prevIndex - 2 + media?.length) % media?.length)}>
								<KeyboardArrowLeftIcon style={{ color: '#fff' }} />
							</ArrowButton>
							<Carousel selectedItem={mediasIndex} showStatus={false} showThumbs={false} showArrows={false} infiniteLoop={true} autoPlay={true} showIndicators={false} emulateTouch={true} centerMode centerSlidePercentage={100 / 3 /* display slides */}>
								{media.map((value, index) => {
									return (
										<Link href={value.link} key={'media-key-' + index}>
											<Box px={4} key={'media-mobile-value-' + index} sx={{ margin: 'auto', width: '100%', color: 'white' }}>
												<img style={{ width: '100%', borderRadius: '22px' }} src={value.image}></img>
											</Box>
										</Link>
									);
								})}
							</Carousel>
							<ArrowButton onClick={() => setMediasIndex((prevIndex) => (prevIndex + 2) % media?.length)}>
								<KeyboardArrowRightIcon style={{ color: '#fff' }} />
							</ArrowButton>
						</Stack>
					</Box>
				) : (
					<Box>
						<Carousel selectedItem={mediasIndex} showStatus={false} showThumbs={false} showArrows={false} infiniteLoop={true} autoPlay={true} showIndicators={false} emulateTouch={true}>
							{media.map((value, index) => {
								return (
									<Link href={value.link} key={'media-key-' + index}>
										<Box px={4} key={'media-mobile-value-' + index} sx={{ margin: 'auto', width: '100%', color: 'white' }}>
											<img style={{ width: '100%', borderRadius: '22px' }} src={value.image}></img>
										</Box>
									</Link>
								);
							})}
						</Carousel>
					</Box>
				)}
				<Stack px={4} gap={4} justifyContent={'center'} alignItems={'center'} width={'100%'}>
					<RRLink to='/assets/pdf/zeligate_one_pager.pdf' target='_blank' download>
						<Button sx={{ minWidth: 'max-content', backgroundColor: 'white', color: '#170058', '&:hover': { opacity: 0.8, backgroundColor: 'white', color: '#170058' } }}>Download media kit</Button>
					</RRLink>
					<DescriptionText display={'inline'} maxWidth={'750px'}>
						Looking for commentary, content contribution or an interview on all things AI, future of work and emerging technology? Get in touch.
					</DescriptionText>
					<Link href='mailto:media@zeligate.com'>
						<Button sx={{ width: 'max-content', backgroundColor: 'white', color: '#170058', '&:hover': { opacity: 0.8, backgroundColor: 'white', color: '#170058' } }}>Get in touch</Button>
					</Link>
				</Stack>
			</Stack>
		);
	};

	return (
		<Layout headerStyle={'light'} headerGap={false} mobileHeaderGap={false} bgGradient={2}>
			<Helmet>
				<title>Company - {APP_NAME}</title>
			</Helmet>
			<Hero image={'/assets/images/company-banner-bg.svg'} title={isDesktop ? '<span>You say. We do.</span><br />You thrive.' : '<span>You say. <br>We do.</span><br />You thrive.'} textStyle={'light'} />
			<Stack py={{ xs: 6, md: 10 }} gap={{ xs: 4, md: 6 }}>
				{createAboutUsSection()}
				{createRevolutionSection()}
				{createMediaSection()}
			</Stack>
		</Layout>
	);
};

export default Company;

const ArrowButton = styled(IconButton)({
	background: 'rgba(255, 255, 255, 0.20)',
	borderRadius: 10,
	'&:hover': {
		filter: 'brightness(1.75)',
	},
});
