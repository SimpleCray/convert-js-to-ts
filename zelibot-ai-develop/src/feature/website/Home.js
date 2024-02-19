import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Grid, Stack, styled, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Layout from './layout';
import { APP_NAME, AVATAR_ANIMATION } from '../../config-global';
import { Hero } from './components';
import useResponsive from 'src/hooks/useResponsive';
import SectionRevamp from './components/section/SectionRevamp';
import { TextHeading } from './components/outlined-heading/OutlinedHeading';
import { Text22Weight400 } from '../../components/common/TypographyStyled';
import { useInView } from 'framer-motion';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { default as AvatarCarousel } from '../../components/avatar-carousel';
import axios from '../../utils/axios';

const aWorkforceOfAIhelpersContent = `Imagine having a smart, interactive AI Helper available to you, 24/7, to do mundane tasks so you can focus on the human side of your job?`;
const whatIsZeligateContent = `Zeligate is the world's first workforce of AI helpers that empowers teams to focus on meaningful work by automating repetitive tasks, workflows, and streamlining processes, all while learning and adapting to your evolving needs.`;
const meetYourFirstAIhelperContent = `Zeli is the first generation in the workforce, specialised in HR Recruitment tasks.`;

const DesktopAvatarCarousel = styled(AvatarCarousel)({
	maxWidth: 970,
});

const LinkButton = styled(Button)(({ theme }) => ({
	order: 1,
	width: 'max-content',
	border: '1px solid white',
	backgroundColor: '#170058',
	height: 50,
	color: theme.palette.common.white,
	padding: theme.spacing(1, 2),
	[theme.breakpoints.up('md')]: {
		padding: theme.spacing(1.75, 2.5),
	},
}));

export default function Home() {
	const backgroundGradient = 'linear-gradient(132.18deg, #F4C4DC 2.46%, #D1CAF2 70.14%);';
	const theme = useTheme();
	const isDesktop = useResponsive('up', 'md');
	const [assistants, setAssistants] = useState([]);
	const [isAvatarCarouselActive, setIsAvatarCarouselActive] = useState(false);
	const avatarSectionRef = useRef();
	const isAvatarSectionInView = useInView(avatarSectionRef);
	useEffect(() => {
		setIsAvatarCarouselActive(isAvatarSectionInView);
	}, [isAvatarSectionInView]);

	useEffect(() => {
		const payload = {
			pk: 'ONBOARDING_AVATAR_SELECTOR',
			sk: 1,
		};
		axios
			.post(`${AVATAR_ANIMATION}`, payload)
			.then((response) => {
				setAssistants(response?.data?.avatars);
			})
			.catch((error) => {
				console.error('failed to fetch public avatars: ', error);
			});
	}, []);

	return (
		<Layout headerStyle={'light'} headerGap={false} mobileHeaderGap={false} bgGradient={2}>
			<Helmet>
				<title> {APP_NAME} - Access to Powerful AI for your Business</title>
			</Helmet>
			<Hero image={'/assets/images/home-banner-bg.png'} title={isDesktop ? `Unlimit <span>what's humanly <br />possible.</span>` : `Unlimit <br /><span>what's humanly possible.</span>`} textStyle={'light'} />

			<Stack py={{ xs: 8, md: 12 }} gap={{ xs: 4, md: 7.25 }} alignItems='center'>
				<SectionRevamp px={4} heading={'<span>A workforce of AI helpers.</span>'} description={aWorkforceOfAIhelpersContent} alignment={'CENTER-TEXT'} />
				<ZeliCanBe />
			</Stack>

			<SectionRevamp py={{ xs: 8, md: 12 }} px={4} textColor={'purple'} background={backgroundGradient} heading={'<span>What is <span style="font-weight: 700">Zeligate?</span></span>'} description={whatIsZeligateContent} alignment={'CENTER-TEXT'} />

			<Stack ref={avatarSectionRef} py={{ xs: 8, md: 12 }} gap={{ xs: 4, md: 7.25 }} alignItems='center'>
				<Box px={4}>
					<SectionRevamp heading={'<span>Meet your first AI helper.</span>'} description={meetYourFirstAIhelperContent} alignment={'CENTER-TEXT'} />
				</Box>
				{isDesktop ? (
					<>
						{assistants.length > 0 && <DesktopAvatarCarousel assistants={assistants} isDesktop isActive={isAvatarCarouselActive} showNavBtn />}
						<Link to={'/product'}>
							<LinkButton>See what Zeli can do</LinkButton>
						</Link>{' '}
					</>
				) : (
					<>
						{assistants.length > 0 && <AvatarCarousel assistants={assistants} isActive={isAvatarCarouselActive} />}
						<Link to={'/product'}>
							<LinkButton>See what Zeli can do</LinkButton>
						</Link>
					</>
				)}
			</Stack>

			<Stack
				py={{ xs: 4, md: 12 }}
				px={4}
				width={1}
				minHeight={{ xs: 210 }}
				justifyContent='center'
				alignItems='center'
				sx={{
					margin: 'auto',
					background: backgroundGradient,
					'& > iframe': {
						aspectRatio: 16 / 9,
						borderRadius: 4,
						height: { md: 608 },
						width: { xs: `calc(100vw - ${theme.spacing(8)})`, md: 972 },
					},
				}}
			>
				<iframe src='https://www.youtube.com/embed/KClsrMPbONg' title='Zeligate Brand Activation' frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowFullScreen />
			</Stack>
		</Layout>
	);
}

const AvatarSection = ({ imageIndex = 1, text }) => (
	<Stack alignItems='center' gap={5.25}>
		<Box
			sx={{
				position: 'relative',
				overflow: 'hidden',
				height: 240,
				width: 240,
				'& > img': {
					position: 'absolute',
					top: 0,
					left: 0,
					borderRadius: '50%',
					objectFit: 'contain',
				},
			}}
		>
			<img src={`/assets/images/avatars_home/avatar-${imageIndex}.png`} alt='avatar' width={240} height={240} />
		</Box>
		<Text22Weight400 color='white'>{text}</Text22Weight400>
	</Stack>
);

const ZELI = ['HR Recruitment helper', 'Marketing helper', 'Sales helper', 'Legal helper', 'Real Estate helper', 'Know it all'];

const ZeliCanBe = () => {
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const stopAutoPlay = (shouldAutoPlay) => {
		setIsAutoPlaying(shouldAutoPlay);
	};
	const matches = useMediaQuery('(min-width: 727px)');

	const isDesktop = useResponsive('up', 'md');
	const [activeIndex, setActiveIndex] = useState(matches ? 1 : 0);
	useEffect(() => {
		if (matches) {
			if (activeIndex === 0) {
				setActiveIndex(1);
			}
			if (activeIndex === ZELI?.length - 1) {
				setActiveIndex(activeIndex - 1);
			}
		}
	}, [activeIndex]);
	const handleCarouselChange = (index) => {
		setActiveIndex(index);
	};

	return isDesktop ? (
		<Stack gap={4} alignItems='center' sx={{ width: 882 }}>
			<TextHeading heading={'Zeli can be a:'} />
			<Grid container spacing={10} rowSpacing={4}>
				{ZELI.map((text, index) => (
					<Grid item xs={4} key={index}>
						<AvatarSection imageIndex={1 + index} text={text} />
					</Grid>
				))}
			</Grid>
		</Stack>
	) : (
		<Box
			sx={{
				textAlign: 'center',
				width: '100%',
				'& .carousel-root': {
					'& .slider-wrapper.axis-horizontal': {
						display: 'flex',
						justifyContent: 'center',
					},
					'& ul.slider': {
						width: 240,
						'& > li:first-child': {},
					},
				},
			}}
		>
			<TextHeading heading={'Zeli can be a:'} sx={{ mb: 4 }} />
			<Carousel
				autoPlay={isAutoPlaying}
				onSwipeStart={() => stopAutoPlay(false /* shouldAutoPlay */)}
				onSwipeEnd={() => stopAutoPlay(true /* shouldAutoPlay */)}
				selectedItem={activeIndex}
				onChange={handleCarouselChange}
				showStatus={false}
				showThumbs={false}
				showArrows={false}
				infiniteLoop={false}
				showIndicators={false}
				centerMode
				centerSlidePercentage={93.33}
				interval={5000}
				emulateTouch={true}
			>
				{ZELI.map((text, index) => (
					<AvatarSection key={text} imageIndex={1 + index} text={text} />
				))}
			</Carousel>
		</Box>
	);
};
