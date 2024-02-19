import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/material';
import { ModalFrame, EducationalHeading, EducationalText, EducationalImage, PageLeftButton, PageRightButton, Spacer, CloseButton, CloseForNowButton, CloseForeverButton, PageInfo, HeaderCloseButton } from './EducationalModalStyles';
import cardList from './educationModalData';
// import { AIGetAPIRequest } from '../../constants';
// import { USER_API, BASE_USER_API } from '../../../../config-global';
// import useEducationModal from '../../hooks/useEducationModal';

export default function EducationalModal({ open, closeForNow, closeForEver, trackHide }) {
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const { heading, text, image } = cardList[currentCardIndex];
	const [userSettings, setUserSettings] = useState({});

	const cardCount = cardList.length;
	const humanIndex = currentCardIndex + 1;

	const isFirstCard = humanIndex === 1;
	const isLastCard = humanIndex === cardCount;

	const moveLeft = () => setCurrentCardIndex(currentCardIndex - 1);
	const moveRight = () => setCurrentCardIndex(currentCardIndex + 1);

	const theme = useTheme();
	const sp = theme.spacing;

	const closeNowHandler = () => {
		trackHide(true);
		closeForNow();
	}

	const closeForeverHandler = () => {
		trackHide(true);
		closeForEver();
	}

	// useEffect(() => {
	// 	const getUserSettings = async () => {
	// 		try {
	// 			const fetchedUserSettings = await AIGetAPIRequest(`${BASE_USER_API}/user-settings/`);
	// 			// Step 2: Update the userSettings state
	// 			setUserSettings(fetchedUserSettings);
	// 		} catch (error) {
	// 			console.log('Error:', error);
	// 		}
	// 	};

	// 	void getUserSettings();
	// }, [setUserSettings]);

	// useEffect(() => {
	// 	if (userSettings.hasOwnProperty('education_show_again') && !userSettings.education_show_again) {
	// 		trackHide(true);
	// 	}
	// }, [userSettings]);

	// if (userSettings.hasOwnProperty('education_show_again') && !userSettings.education_show_again) {
	// 	return null;
	// }
	// else {
	return (
		// Step 3: Conditionally render ModalFrame
		<ModalFrame
			open={open}
			onClose={closeForNow}
			Header={() => (
				<Stack direction='row' style={{ alignSelf: 'stretch', justifySelf: 'flex-start', height: 56, alignItems: 'center', paddingRight: sp(4), paddingLeft: sp(4) }}>
					<Spacer />
					<HeaderCloseButton onClick={closeNowHandler} />
				</Stack>
			)}
			Footer={() => (
				<Stack direction='row' style={{ alignSelf: 'stretch', justifySelf: 'flex-end', alignItems: 'center', height: sp(12), gap: sp(2), paddingLeft: sp(4), paddingRight: sp(4) }}>
					<CloseForeverButton onClick={closeForeverHandler} />
					<CloseForNowButton onClick={closeNowHandler} />

					<Spacer />
					{!isFirstCard && <PageLeftButton onClick={moveLeft} />}
					<PageInfo current={humanIndex} total={cardCount} />
					{isLastCard ? <CloseButton onClick={closeNowHandler} /> : <PageRightButton onClick={moveRight} />}
				</Stack>
			)}
			Content={() => (
				<Stack direction='row' style={{ alignItems: 'center', height: 316, padding: sp(4) }}>
					<Stack direction='column' style={{ marginRight: sp(4), gap: sp(2) }}>
						<EducationalHeading content={heading} />
						<EducationalText content={text} />
					</Stack>
					<EducationalImage src={image} />
				</Stack>
			)}
		></ModalFrame>
	);
	// }
}
