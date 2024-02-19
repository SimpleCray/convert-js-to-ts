import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { Box, IconButton, Stack, styled, Typography } from '@mui/material';
import { KeyboardArrowLeft as KeyboardArrowLeftIcon, KeyboardArrowRight as KeyboardArrowRightIcon } from '@mui/icons-material';
import { m } from 'framer-motion';

import { SoundIconAnimate } from '../animate';

const ArrowButton = styled(IconButton)(({ theme, scale }) => ({
	backgroundColor: 'rgba(255, 255, 255, 0.20)',
	borderRadius: theme.shape.borderRadius * 2,
	'&:hover': {
		filter: 'brightness(1.75)',
	},
	[theme.breakpoints.up('sm')]: {
		width: 56 * scale,
		height: 56 * scale,
	},
}));

const CenterCircle = styled('div')(({ theme }) => ({
	borderRadius: 1000,
	borderColor: theme.palette.primary.lighter,
	borderStyle: 'solid',
	background: 'transparent',
	zIndex: 10,
}));

const CenterBox = styled(Box)({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
});

const VideoAnimate = styled(m.video)({
	width: 304,
	position: 'absolute',
	borderRadius: 1000,
	cursor: 'pointer',
});

const ImageAnimate = styled(m.img)({
	width: 304,
	position: 'absolute',
	borderRadius: 1000,
	cursor: 'pointer',
});

const SoundUpIcon = styled(SoundIconAnimate)({
	width: 24,
	height: 24,
});

export default ({ assistants, setSelectedAssistant, beginningIndex = 0, displaySize = 5, showNavBtn = false, showSoundUp = false, isDesktop = false, isActive = false, scale = 1, ...props }) => {
	const [selectedIndex, setSelectedIndex] = useState(beginningIndex);
	const elRefs = useRef(assistants?.map(() => createRef()) || []);

	const size = useMemo(() => {
		if (!assistants?.length) {
			return 3;
		}

		const tmpSize = assistants.length < displaySize ? assistants.length : displaySize;
		if (tmpSize === 3 || tmpSize === 5 || tmpSize === 7 || tmpSize === 9) {
			return tmpSize;
		}

		if (tmpSize < 5) {
			return 3;
		}

		if (tmpSize < 7) {
			return 5;
		}

		if (tmpSize < 9) {
			return 7;
		}

		return 9;
	}, [displaySize, assistants]);

	const positions = useMemo(() => {
		if (!assistants?.length) {
			return [];
		}

		return [
			'center',
			...Array.from({ length: (size - 1) / 2 }).map((_, index) => `right_${index + 1}`),
			...(assistants.length - size > 0 ? Array.from({ length: assistants.length - size }).map(() => 'hidden') : []),
			...Array.from({ length: (size - 1) / 2 })
				.map((_, index) => `left_${index + 1}`)
				.reverse(),
		];
	}, [assistants, size]);

	const displayNavBtn = useMemo(() => assistants?.length > 1 && showNavBtn, [assistants, showNavBtn]);

	useEffect(() => {
		if (!assistants?.length) {
			return;
		}

		if (elRefs?.current?.length) {
			elRefs.current.forEach((ref, index) => {
				if (!ref?.current) {
					return;
				}
				ref.current.muted = !isActive || index !== selectedIndex;
				ref.current.loop = isActive && index !== selectedIndex;
				ref.current.src = isActive && index === selectedIndex ? assistants[index].dialogueVideo : assistants[index].avatarVideo;
				ref.current.load();
				ref.current.play();

				if (selectedIndex === index) {
					ref.current.onended = function () {
						ref.current.src = assistants[index].avatarVideo;
						ref.current.loop = true;
						ref.current?.play();
					};
				}
			});
		}

		setSelectedAssistant && setSelectedAssistant(assistants[selectedIndex]);
	}, [selectedIndex, assistants, isActive]);

	const handlePrevious = () => {
		onChangePositionIndexes(-1);
	};
	const handleNext = () => {
		onChangePositionIndexes(1);
	};

	const imageVariants = {
		center: { x: '0%', scale: 1, zIndex: 7 },
		left_1: { x: '-61.51%', scale: 0.7895, zIndex: 5 },
		right_1: { x: '61.51%', scale: 0.7895, zIndex: 5 },
		left_2: { x: '-100.987%', scale: 0.6053, zIndex: 4 },
		right_2: { x: '100.987%', scale: 0.6053, zIndex: 4 },
		left_3: { x: '-123.684%', scale: 0.4539, zIndex: 3 },
		right_3: { x: '-123.684%', scale: 0.4539, zIndex: 3 },
		left_4: { x: '-141.447%', scale: 0.3553, zIndex: 2 },
		right_4: { x: '141.447%', scale: 0.3553, zIndex: 2 },
		hidden: { x: '0%', scale: 0.2, zIndex: 1 },
	};

	const anim = (variants, animate) => {
		return { initial: 'center', animate, exit: 'exit', variants };
	};

	const onChangePosition = (position) => {
		if (position === 'center') {
			return;
		}

		const [side, step] = position.split('_');
		onChangePositionIndexes(side === 'left' ? -step : +step);
	};

	const onChangePositionIndexes = (step) => {
		if (Math.abs(step) <= 1) {
			setSelectedIndex((prev) => (prev + step + assistants.length) % assistants.length);
			return;
		}

		setSelectedIndex((prev) => (prev + step / Math.abs(step) + assistants.length) % assistants.length);
		let count = 1;
		const interval = setInterval(() => {
			if (count >= Math.abs(step)) {
				clearInterval(interval);
				return;
			}
			setSelectedIndex((prev) => (prev + step / Math.abs(step) + assistants.length) % assistants.length);
			count++;
		}, 500);
	};

	const onHandleSwipe = (event, info) => {
		if (info.offset.x > 10) {
			onChangePositionIndexes(-1);
		} else if (info.offset.x < -10) {
			onChangePositionIndexes(1);
		}
	};

	if (isDesktop) {
		return (
			<Stack gap={2} sx={{ width: '100%' }} py={2} {...props}>
				<Stack direction='row' sx={{ width: '100%' }}>
					{displayNavBtn && (
						<Stack alignItems='center' justifyContent='center'>
							<ArrowButton onClick={handlePrevious} scale={scale}>
								<KeyboardArrowLeftIcon sx={{ color: 'common.white' }} />
							</ArrowButton>
						</Stack>
					)}
					<Stack alignItems='center' justifyContent='center' sx={{ position: 'relative', flexGrow: 1 }}>
						<CenterCircle sx={{ width: 336 * scale, height: 336 * scale, borderWidth: (theme) => theme.spacing(2 * scale) }} />
						{assistants.map(({ id, avatarImage, avatarName, avatarVideo, dialogueVideo }, index) => {
							const positionIndex = (index - selectedIndex + assistants.length) % assistants.length;
							const position = positions[positionIndex];
							const isCenter = position === 'center';
							if (avatarVideo) {
								return (
									<VideoAnimate
										ref={elRefs.current[index]}
										key={'avatar-carousels-1-' + id}
										src={avatarVideo}
										autoPlay
										loop
										playsInline
										muted
										poster={avatarImage}
										alt={avatarName}
										{...anim(imageVariants, position)}
										transition={{ duration: 0.5 }}
										onClick={() => onChangePosition(position)}
										drag={isCenter ? 'x' : false}
										onDragEnd={(event, info) => isCenter && onHandleSwipe(event, info)}
										dragConstraints={{ left: 0, right: 0 }}
										dragElastic={0}
										sx={{
											width: 304 * scale,
										}}
									/>
								);
							}

							return (
								<ImageAnimate
									key={id}
									src={avatarImage}
									alt={avatarName}
									{...anim(imageVariants, position)}
									transition={{ duration: 0.5 }}
									onClick={() => onChangePosition(position)}
									drag={isCenter ? 'x' : false}
									onDragEnd={(event, info) => isCenter && onHandleSwipe(event, info)}
									dragConstraints={{ left: 0, right: 0 }}
									dragElastic={0}
									sx={{
										width: 304 * scale,
									}}
								/>
							);
						})}
					</Stack>
					{displayNavBtn && (
						<Stack alignItems='center' justifyContent='center'>
							<ArrowButton onClick={handleNext} scale={scale}>
								<KeyboardArrowRightIcon sx={{ color: 'common.white' }} />
							</ArrowButton>
						</Stack>
					)}
				</Stack>
				{showSoundUp && (
					<CenterBox sx={{ flexDirection: 'row', padding: (theme) => theme.spacing(0.5 * scale), color: 'common.white' }}>
						<Typography variant='body2' component='span' mr={0.75}>
							Turn up your sound
						</Typography>
						<SoundUpIcon />
					</CenterBox>
				)}
			</Stack>
		);
	}

	return (
		<Stack gap={2} sx={{ width: '100%' }} py={2} {...props}>
			<Stack alignItems='center' justifyContent='center' sx={{ position: 'relative', flexGrow: 1, overflowY: 'clip', overflowX: 'hidden' }}>
				<CenterCircle sx={{ width: 269 * scale, height: 269 * scale, borderWidth: (theme) => theme.spacing(1.5 * scale) }} />
				{assistants.map(({ id, avatarImage, avatarName, avatarVideo, dialogueVideo }, index) => {
					const positionIndex = (index - selectedIndex + assistants.length) % assistants.length;
					const position = positions[positionIndex];
					const isCenter = position === 'center';
					if (avatarVideo) {
						return (
							<VideoAnimate
								ref={elRefs.current[index]}
								key={'avatar-carousels-2-' + id}
								src={avatarVideo}
								autoPlay
								loop
								playsInline
								muted
								poster={avatarImage}
								alt={avatarName}
								{...anim(imageVariants, position)}
								transition={{ duration: 0.5 }}
								sx={{
									width: 253 * scale,
									display: position !== 'hidden' ? 'block' : 'none',
								}}
								onClick={() => onChangePosition(position)}
								drag={isCenter ? 'x' : false}
								onDragEnd={(event, info) => isCenter && onHandleSwipe(event, info)}
								dragConstraints={{ left: 0, right: 0 }}
								dragElastic={0}
							/>
						);
					}

					return (
						<ImageAnimate
							key={id}
							src={avatarImage}
							alt={avatarName}
							{...anim(imageVariants, position)}
							transition={{ duration: 0.5 }}
							sx={{
								width: 253 * scale,
								display: position !== 'hidden' ? 'block' : 'none',
							}}
							onClick={() => onChangePosition(position)}
							drag={isCenter ? 'x' : false}
							onDragEnd={(event, info) => isCenter && onHandleSwipe(event, info)}
							dragConstraints={{ left: 0, right: 0 }}
							dragElastic={0}
						/>
					);
				})}
			</Stack>
			{showSoundUp && (
				<CenterBox sx={{ flexDirection: 'row', padding: (theme) => theme.spacing(0.5 * scale), color: 'common.white' }}>
					<Typography variant='body2' component='span' mr={0.75}>
						Turn up your sound
					</Typography>
					<SoundUpIcon />
				</CenterBox>
			)}
			{displayNavBtn && (
				<Stack direction='row' justifyContent='center' gap={2}>
					<ArrowButton onClick={handlePrevious} scale={scale}>
						<KeyboardArrowLeftIcon sx={{ color: 'common.white' }} />
					</ArrowButton>
					<ArrowButton onClick={handleNext} scale={scale}>
						<KeyboardArrowRightIcon sx={{ color: 'common.white' }} />
					</ArrowButton>
				</Stack>
			)}
		</Stack>
	);
};
