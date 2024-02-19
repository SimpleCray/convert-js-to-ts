import { Box, Button, Chip, Collapse, Grid, Typography } from '@mui/material';
import { SwiperSlide } from 'swiper/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRef, useState } from 'react';
import useResponsive from '../../../../hooks/useResponsive';
import { AvatarSelector, SkillIconType } from '../index';
import { ExpandMoreButton, StyledAIAvatarSelectorWrapper, StyledCardActions, StyledSkillsTextWrapper, StyledSkillsWrapper, StyledSwiper, StyledWorkerDetails } from './ChooseHelperStyles';
import { postAssistantId } from '../../constants';
import 'swiper/css';

export default function ChooseHelper({ assistants, selectedAssistant, setSelectedAssistant, onComplete }) {
	const isDesktop = useResponsive('up', 'md');
	const [expanded, setExpanded] = useState(false);
	const swiperRef = useRef(null);

	const handleAssistantSelect = (id) => {
		const assistant = assistants.find((assistant) => assistant.id === id);
		setSelectedAssistant(assistant);
	};

	const handleSwiperOnSlideChange = (swiper) => {
		const assistant = assistants[swiper.activeIndex];
		setSelectedAssistant(assistant);
	};

	const handleSwiperAssistantSelect = (e) => {
		const id = parseInt(e.currentTarget.dataset.id);
		selectedAssistant?.id !== id && swiperRef.current?.swiper.slideTo(id - 1);
	};

	const handleExpandMobileCardClick = () => {
		setExpanded(!expanded);
	};

	const handleButtonOnClick = async () => {
		await postAssistantId(selectedAssistant.id); // TODO: Handle errors
		onComplete();
	};

	return (
		<>
			<Grid item xs={12} md={7}>
				<StyledWorkerDetails>
					{isDesktop ? (
						<>
							<Grid container display='flex' direction='row'>
								<Grid item xs={12} md={6}>
									<Box pr={4}>
										<Typography variant='h3' component={'h2'}>
											{selectedAssistant?.avatarName}
										</Typography>
										<Typography variant='h6' component={'div'} color={'text.disabled'} mb={4}>
											{selectedAssistant?.avatarRole}
										</Typography>
										<Typography variant='body2' component={'p'}>
											{selectedAssistant?.dialogueText}
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={12} md={6} display='flex' justifyContent={'center'}>
									<AvatarSelector id={'desktop-avatar'} assistant={selectedAssistant} selected />
								</Grid>
							</Grid>
						</>
					) : (
						<>
							<StyledSwiper ref={swiperRef} centeredSlides slidesPerView={'auto'} spaceBetween={10} onSlideChange={handleSwiperOnSlideChange}>
								{assistants &&
									assistants.map((assistant) => (
										<SwiperSlide key={assistant?.id} data-id={assistant?.id} onClick={handleSwiperAssistantSelect}>
											<AvatarSelector assistant={assistant} selected={selectedAssistant.id === assistant?.id} />
										</SwiperSlide>
									))}
							</StyledSwiper>
							<Grid container display='flex' direction='column'>
								<Grid item>
									<Typography variant='h3' component={'h2'} align='center' gutterBottom>
										{selectedAssistant?.avatarName}
									</Typography>
									<Typography variant='h5' component={'div'} align='center' mx={2} color={'text.disabled'}>
										{selectedAssistant?.avatarRole}
									</Typography>
								</Grid>
							</Grid>
							<Grid container>
								<Grid item>
									<StyledSkillsTextWrapper>
										<Typography variant='body2' component={'div'} mt={3} mx={2} gutterBottom>
											Hi there! I am Zeli. I can help you advertise jobs, analyse and compare resumes, set up interviews with the most promising candidates, write employment contracts, and much more! Choose an avatar to work with.
										</Typography>
									</StyledSkillsTextWrapper>
								</Grid>
							</Grid>
						</>
					)}
					{isDesktop ? (
						<StyledSkillsTextWrapper>
							<Typography variant='overline' component={'div'} gutterBottom>
								Skills
							</Typography>
							<StyledSkillsWrapper>{selectedAssistant?.avatarSkills && selectedAssistant?.avatarSkills.map((skill) => <Chip key={skill?.id} label={skill?.name} variant='filled' icon={<SkillIconType variant={skill?.icon} />} />)}</StyledSkillsWrapper>
						</StyledSkillsTextWrapper>
					) : (
						<Box sx={{ width: '100%' }}>
							<StyledCardActions sx={{ width: '100%' }} disableSpacing onClick={handleExpandMobileCardClick}>
								<Typography variant='overline' component={'div'}>
									Skills
								</Typography>
								<ExpandMoreButton expand={expanded} aria-expanded={expanded} aria-label='show more'>
									<ExpandMoreIcon />
								</ExpandMoreButton>
							</StyledCardActions>
							<Collapse in={expanded} timeout='auto' unmountOnExit>
								<StyledSkillsWrapper>{selectedAssistant?.avatarSkills && selectedAssistant?.avatarSkills.map((skill) => <Chip key={skill?.id} label={skill?.name} icon={<SkillIconType variant={skill?.icon} />} />)}</StyledSkillsWrapper>
							</Collapse>
						</Box>
					)}
					<Button variant={'contained'} color={'primary'} size='large' onClick={handleButtonOnClick} sx={{ width: '65%' }}>
						<span style={{ textTransform: 'none' }}>Continue</span>
					</Button>
				</StyledWorkerDetails>
			</Grid>
			{isDesktop && (
				<Grid item xs={12} md={5} justifyItems={'center'} height={'100%'}>
					<StyledAIAvatarSelectorWrapper>
						<Grid container spacing={{ xs: 2, md: 3 }}>
							{assistants &&
								assistants.map((assistant) => (
									<Grid item xs={6} key={assistant?.id}>
										<AvatarSelector assistant={assistant} onAvatarSelect={handleAssistantSelect} selected={selectedAssistant.id === assistant?.id} />
									</Grid>
								))}
						</Grid>
					</StyledAIAvatarSelectorWrapper>
				</Grid>
			)}
		</>
	);
}
