import Layout from './layout';
import { APP_NAME } from '../../config-global';
import { Helmet } from 'react-helmet-async';
import { AnimatedBorder, Hero } from './components';
import { Box, Typography, Button, Stack, styled, IconButton } from '@mui/material';
import OutlinedHeading from './components/outlined-heading';
import useResponsive from 'src/hooks/useResponsive';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useEffect, useRef, useState } from 'react';
import SectionRevamp from './components/section/SectionRevamp';
import DescriptionText from 'src/components/typography/DescriptionText';
import { StyledOutlinedHeading } from './components/outlined-heading/OutlinedHeadingStyles';
import { TextHeading } from './components/outlined-heading/OutlinedHeading';
import { KeyboardArrowLeft as KeyboardArrowLeftIcon, KeyboardArrowRight as KeyboardArrowRightIcon } from '@mui/icons-material';

const featuresData = [
	{
		title: 'Write job descriptions',
		description: 'Write tailored compelling job descriptions.',
		image: '/assets/images/zeligate_it/job-descriptions.png',
	},
	{
		title: 'Rank candidates',
		description: 'Rank candidates using advanced AI algorithms.',
		image: '/assets/images/zeligate_it/rank-candidates.png',
	},
	{
		title: 'Video screen interviews',
		description: 'Automated 24/7 video interviews.',
		image: '/assets/images/zeligate_it/screen-interviews.png',
	},
	{
		title: 'Candidate summary',
		description: 'Evaluate candidates with advanced technology.',
		image: '/assets/images/zeligate_it/candidate-summary.png',
	},
];

const highlightsData = [
	{
		title: 'Voice to task',
		description: 'Say anything to initiate tasks using your voice.',
		image: '/assets/images/highlights/voice-to-task.png',
	},
	{
		title: 'Text to task',
		description: 'Initiate tasks through free text.',
		image: '/assets/images/highlights/text-to-task.png',
	},
	{
		title: 'Video interview',
		description: 'Virtual interviews for seamless candidate assessment.',
		image: '/assets/images/highlights/video-highlight.png',
	},
];

export default function Product() {
	const isDesktop = useResponsive('up', 'md');
	const backgroundGradient2 = 'linear-gradient(132.18deg, #F4C4DC 2.46%, #D1CAF2 70.14%);';
	const aiHelperText = 'Your smart AI Helper will generate job listings, evaluate resumés and even call candidates to schedule interviews and automatically send calendar invites. Let Zeligate handle your time-consuming admin so you can focus on what’s meaningful.';
	const [featuresIndex, setFeaturesIndex] = useState(0);
	const [highlightsIndex, setHighlightsIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const stopAutoPlay = (shouldAutoPlay) => {
		setIsAutoPlaying(shouldAutoPlay);
	};
	const handleFeatureCarouselChange = (index) => {
		setFeaturesIndex(index);
	};
	const anchorRef = useRef(null);
	const handleHighlightCarouselChange = (index) => {
		setHighlightsIndex(index);
	};

	useEffect(() => {
		// console.log('Product page mounting!')
		if (anchorRef.current) {
			// console.log('Product page scrolling!')
			setTimeout(() => {
				anchorRef.current.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				})
			}, 250)
		}
	}, [anchorRef.current])

	return (
		<Layout headerStyle={'light'} headerGap={false} mobileHeaderGap={false} bgGradient={2}>
			<Helmet>
				<title>Product - {APP_NAME}</title>
			</Helmet>
			<Hero image={'/assets/images/product-banner-bg.svg'} title={isDesktop ? '<span>You say. We do.</span><br />You thrive.' : '<span>You say. <br>We do.</span><br />You thrive.'} textStyle={'light'} />

			<Stack ref={anchorRef} py={{ xs: 8, md: 12 }} gap={{ xs: 4, md: 7.25 }}>
				<SectionRevamp
					px={4}
					heading={'<span>What is Zeligate?</span>'}
					description={`Zeligate is the world's first workforce of AI helpers that empowers teams to focus on meaningful work by automating repetitive tasks, workflows, and streamlining processes, all while learning and adapting to your evolving needs.`}
					textColor={'white'}
					alignment={'CENTER-TEXT'}
				/>
				<SectionRevamp
					px={{ xs: 4, md: 0 }}
					reverseDescription={true}
					image={'/assets/images/product-page-people-looking-at-zelibot.svg'}
					alignment={isDesktop ? 'LEFT' : 'MIDDLE-IMAGE'}
					description={aiHelperText}
					heading={isDesktop ? '<span>Unlimit<br/><strong>your hours.</strong></span>' : '<span>Unlimit your <strong>hours.</strong></span>'}
				/>
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Button href={`/auth/register`} sx={{ backgroundColor: 'rgba(23, 0, 88, 1)', border: '1px solid white', color: 'white' }}>
						Start free trial
					</Button>
				</Box>
			</Stack>

			<Stack py={{ xs: 8, md: 12 }} gap={{ xs: 4, md: 7.5 }} sx={{ background: backgroundGradient2 }}>
				<SectionRevamp
					px={4}
					heading={'<span>How does Zeligate work?</span>'}
					description={`Zeligate is an intelligent AI helper that streamlines talent recruitment activities, such as talent acquisition and meeting coordination. From writing and posting job ads, ranking and interviewing candidates, to managing meetings, Zeligate's got it covered. The highly interactive, and adaptive AI system, doesn't just create content quickly; it gets things done with precision.
					<br /><br />Let Zeligate simplify your talent recruitment, making your job easier and more efficient.`}
					textColor={'purple'}
					alignment={'CENTER-TEXT'}
				/>
				{isDesktop ? (
					<Stack width={'100%'} gap={2} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-end'}>
						<Stack py={8} px={4} width={'40%'}>
							<OutlinedHeading heading={'<span>Zeligate it.</span>'} color={'purple'} />
							<Stack gap={2} mt={6}>
								{featuresData.map((feature, index) => {
									return (
										<Stack key={'feature-data-' + index}>
											<Typography my={1} onClick={() => setFeaturesIndex(index)} variant='h4' sx={{ mb: '4px', fontSize: '22px!important', fontWeight: 700, color: 'rgba(33, 5, 76, 1)', cursor: 'pointer' }}>
												{featuresIndex === index && ' - '}
												{feature.title}
											</Typography>
											{featuresIndex === index ? (
												<Typography variant='p' sx={{ fontSize: '18px!important', fontWeight: 400, textShadow: 'none', width: '80%', color: 'rgba(33, 5, 76, 1)', position: 'relative', left: '15px' }}>
													{feature.description}
												</Typography>
											) : null}
										</Stack>
									);
								})}
							</Stack>
						</Stack>
						<Box width={'50%'} height={'550px'} sx={{ borderRadius: '24px 0px 0px 24px', overflow: 'hidden', background: `url(${featuresData[featuresIndex].image})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
							{/* <img src={featuresData[featuresIndex].image} style={{ width: '100%', height: '100%' }}></img> */}
						</Box>
					</Stack>
				) : (
					<Box>
						<Box px={2}>
							<StyledOutlinedHeading>
								<AnimatedBorder />
								<Stack direction='row' alignItems='center' justifyContent='space-between'>
									<ArrowButton onClick={() => setFeaturesIndex((prevIndex) => (prevIndex - 1 + featuresData?.length) % featuresData?.length)}>
										<KeyboardArrowLeftIcon style={{ color: '#21054C' }} />
									</ArrowButton>
									<TextHeading heading={'<span>Zeligate it.</span>'} align={'center'} color='purple'></TextHeading>
									<ArrowButton onClick={() => setFeaturesIndex((prevIndex) => (prevIndex + 1) % featuresData?.length)}>
										<KeyboardArrowRightIcon style={{ color: '#21054C' }} />
									</ArrowButton>
								</Stack>
								<AnimatedBorder />
							</StyledOutlinedHeading>
						</Box>
						<Typography mt={4} color='#21054C' textAlign={'center'} variant='h4'>
							{featuresData[featuresIndex].title}
						</Typography>
						<Box my={2} textAlign={'center'}>
							<DescriptionText color={'purple'} textAlign={'center'}>
								{featuresData[featuresIndex].description}
							</DescriptionText>
						</Box>
						<Box>
							<Carousel
								interval={2500}
								autoPlay={isAutoPlaying}
								onSwipeStart={() => stopAutoPlay(false /* shouldAutoPlay */)}
								onSwipeEnd={() => stopAutoPlay(true /* shouldAutoPlay */)}
								selectedItem={featuresIndex}
								showIndicators={false}
								showStatus={false}
								showThumbs={false}
								showArrows={false}
								infiniteLoop={true}
								onChange={(index) => handleFeatureCarouselChange(index)}
								emulateTouch={true}
							>
								{featuresData.map((feature) => (
									<img key={feature?.image} src={feature?.image} alt={feature?.title} />
								))}
							</Carousel>
						</Box>
					</Box>
				)}
				<SectionRevamp
					px={4}
					heading={'<span>Unlimit <strong>your potential</strong></span>'}
					description={`Delegate tasks using text prompts and voice commands on the fly. Zeligate is engineered to learn from your work, ensuring your smart AI helper always meets your unique requirements and standards.`}
					textColor={'purple'}
					alignment={'CENTER-TEXT'}
				/>
			</Stack>

			<Stack py={{ xs: 8, md: 12 }} gap={{ xs: 4, md: 7.25 }}>
				<SectionRevamp
					px={4}
					heading={'<span>What could Zeligate do for me?</span>'}
					description={`Transform Your Hiring Experience with Zeligate! <br><br>
					Discover a seamless and efficient recruitment process like never before. With Zeligate, you can effortlessly create job listings, quickly assess candidate resumes, and conduct interviews, all in one integrated solution.<br><br>
					Instant Job Listings: Post jobs quickly with text or voice commands.Resume Match: Get concise, insightful summaries for faster decisions.Streamlined Interviews: Let Zeligate handle the first screening, schedule and summarise interviews.`}
					alignment={'CENTER-TEXT'}
				/>
				{isDesktop ? (
					<Stack width={'100%'} gap={2} flexDirection={'row-reverse'} alignItems={'center'} justifyContent={'flex-end'}>
						<Stack py={8} px={4} width={'40%'}>
							<OutlinedHeading heading={'<span>Highlights.</span>'} color={'white'} />
							<Stack gap={2} mt={6}>
								{highlightsData.map((highlight, index) => {
									return (
										<Stack key={'highlight-data-' + index}>
											<Typography my={1} onClick={() => setHighlightsIndex(index)} variant='h4' sx={{ mb: '4px', fontSize: '22px!important', fontWeight: 700, color: 'white', cursor: 'pointer' }}>
												{highlightsIndex === index && ' - '}
												{highlight.title}
											</Typography>
											{highlightsIndex === index ? (
												<Typography variant='p' sx={{ fontSize: '18px!important', fontWeight: 400, textShadow: 'none', width: '80%', color: 'white', position: 'relative', left: '15px' }}>
													{highlight.description}
												</Typography>
											) : null}
										</Stack>
									);
								})}
							</Stack>
						</Stack>
						<Box width={'50%'} height={'550px'} sx={{ borderRadius: '0px 24px 24px 0px', overflow: 'hidden', background: `url(${highlightsData[highlightsIndex].image})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}></Box>
					</Stack>
				) : (
					<Box>
						<Box px={2}>
							<StyledOutlinedHeading>
								<AnimatedBorder />
								<Stack direction='row' alignItems='center' justifyContent='space-between'>
									<ArrowButton onClick={() => setHighlightsIndex((prevIndex) => (prevIndex - 1 + highlightsData?.length) % highlightsData?.length)}>
										<KeyboardArrowLeftIcon style={{ color: '#fff' }} />
									</ArrowButton>
									<TextHeading heading={'<span>Highlights</span>'} align={'center'} color='white'></TextHeading>
									<ArrowButton onClick={() => setHighlightsIndex((prevIndex) => (prevIndex + 1) % highlightsData?.length)}>
										<KeyboardArrowRightIcon style={{ color: '#fff' }} />
									</ArrowButton>
								</Stack>
								<AnimatedBorder />
							</StyledOutlinedHeading>
						</Box>
						<Typography mt={4} color='white' textAlign={'center'} variant='subtitle1'>
							{highlightsData[highlightsIndex].title}
						</Typography>
						<Typography fontWeight={400} mt={2} mb={4} color='white' textAlign={'center'} variant='subtitle2'>
							{highlightsData[highlightsIndex].description}
						</Typography>
						<Carousel
							interval={2500}
							autoPlay={isAutoPlaying}
							onSwipeStart={() => stopAutoPlay(false /* shouldAutoPlay */)}
							onSwipeEnd={() => stopAutoPlay(true /* shouldAutoPlay */)}
							selectedItem={highlightsIndex}
							showIndicators={false}
							showStatus={false}
							showThumbs={false}
							showArrows={false}
							infiniteLoop={true}
							onChange={(index) => handleHighlightCarouselChange(index)}
							emulateTouch={true}
						>
							{highlightsData.map((feature, index) => (
								<img key={feature?.image} src={feature?.image} alt={feature?.title} />
							))}
						</Carousel>
					</Box>
				)}
				<SectionRevamp px={4} heading={'<span>Unlimit <strong>your success.</strong></span>'} description={`Unshackle yourself from mundane tasks and unlock more creativity and productivity in your day. So don’t just delegate - Zeligate and thrive.`} alignment={'CENTER-TEXT'} />
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Button href={`/auth/register`} sx={{ backgroundColor: 'rgba(23, 0, 88, 1)', border: '1px solid white', color: 'white' }}>
						Start free trial
					</Button>
				</Box>
			</Stack>
		</Layout>
	);
}

const ArrowButton = styled(IconButton)({
	background: 'rgba(255, 255, 255, 0.20)',
	borderRadius: 10,
	'&:hover': {
		filter: 'brightness(1.75)',
	},
});
