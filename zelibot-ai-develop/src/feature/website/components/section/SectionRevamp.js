import React from 'react';
import { Stack, Box } from '@mui/material';
import DescriptionText from 'src/components/typography/DescriptionText';
import OutlinedHeading from '../outlined-heading/OutlinedHeading';

const SectionRevamp = ({ heading, image, description, alignment, mobileAlignment, background, textColor, titleMaxWidth, reverseDescription, py, px }) => {
	switch (alignment) {
		case 'LEFT':
			return (
				<Stack py={py ? py : 0} px={px ? px : 0} sx={{ background: background ? background : null }} gap={{ xs: 4, md: 7.25 }} flexDirection={'row'} alignItems={'center'}>
					<Box sx={{ borderRadius: '0px 24px 24px 0px', overflow: 'hidden' }}>
						<img src={image} style={{ width: '100%', height: '100%', maxHeight: 500 }}></img>
					</Box>
					<Stack flexDirection={reverseDescription ? 'column-reverse' : 'column'} maxWidth={414}>
						<Box mb={!reverseDescription && 6}>{description ? <DescriptionText color={textColor ? textColor : 'white'}>{description}</DescriptionText> : null}</Box>
						<Box mb={reverseDescription && 6} maxWidth={titleMaxWidth ? titleMaxWidth : null}>
							{heading ? <OutlinedHeading color={textColor ? textColor : 'white'} heading={heading} /> : null}
						</Box>
					</Stack>
				</Stack>
			);
		case 'RIGHT':
			return (
				<Stack py={py ? py : 0} px={px ? px : 0} sx={{ background: background ? background : null }} gap={{ xs: 4, md: 7.25 }} flexDirection={'reverse-row'} alignItems={'center'}>
					<Box sx={{ borderRadius: '24px 0px 0px 24px', overflow: 'hidden' }}>
						<img src={image} style={{ width: '100%', height: '100%', maxHeight: 500 }}></img>
					</Box>
					<Stack flexDirection={reverseDescription ? 'column-reverse' : 'column'} width={'50%'}>
						<Box mb={!reverseDescription && 6}>{description ? <DescriptionText color={textColor ? textColor : 'white'}>{description}</DescriptionText> : null}</Box>
						<Box mb={reverseDescription && 6} maxWidth={titleMaxWidth ? titleMaxWidth : null}>
							{heading ? <OutlinedHeading color={textColor ? textColor : 'white'} heading={heading} /> : null}
						</Box>
					</Stack>
				</Stack>
			);
		case 'MIDDLE-IMAGE':
			return (
				<Stack py={py ? py : 0} px={0} sx={{ background: background ? background : null }} flexDirection={'column'} gap={{ xs: 4, md: 7.25 }}>
					{reverseDescription ? (
						<>
							<Box px={px ? px : 0} sx={{ width: '100%' }} maxWidth={titleMaxWidth ? titleMaxWidth : null}>
								{heading ? <OutlinedHeading textAlign={'center'} color={textColor ? textColor : 'white'} heading={heading} /> : null}
							</Box>
							<Box width={'100%'} sx={{ overflow: 'hidden' }}>
								<img src={image} style={{ width: '100%', height: '100%' }}></img>
							</Box>
							<Box px={px ? px : 0} sx={{ width: '100%' }}>{description ? <DescriptionText color={textColor ? textColor : 'white'}>{description}</DescriptionText> : null}</Box>
						</>
					) : (
						<>
							<Box mb={2} px={px ? px : 0}>
								{description ? <DescriptionText color={textColor ? textColor : 'white'}>{description}</DescriptionText> : null}
							</Box>
							<Box mb={2} width={'100%'} sx={{ overflow: 'hidden' }}>
								<img src={image} style={{ width: '100%', height: '100%' }}></img>
							</Box>
							<Box px={px ? px : 0} maxWidth={titleMaxWidth ? titleMaxWidth : null}>
								{heading ? <OutlinedHeading textAlign={'center'} color={textColor ? textColor : 'white'} heading={heading} /> : null}
							</Box>
						</>
					)}
				</Stack>
			);
		case 'CENTER-TEXT':
			return (
				<Stack py={py ? py : 0} px={px ? px : 0} sx={{ background: background ? background : null, width: '100%' }} gap={{ xs: 4, md: 7.25 }} flexDirection={'column'} alignItems={'center'}>
					<Box sx={{ width: '100%' }}>
						{heading ? <OutlinedHeading textAlign={'center'} color={textColor ? textColor : 'white'} heading={heading} /> : null}
					</Box>
					<Box maxWidth={titleMaxWidth ? titleMaxWidth : null}>
						{description ? (
							<DescriptionText color={textColor ? textColor : 'white'}>
								{description}
							</DescriptionText>
						) : null}
					</Box>
				</Stack>
			);
	}
};

export default SectionRevamp;
