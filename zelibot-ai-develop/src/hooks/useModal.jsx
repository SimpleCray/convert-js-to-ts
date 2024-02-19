import { Backdrop, Box, CircularProgress, styled, Modal, Stack } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { EditJobOpeningModal, SummaryVideoModal, VideoAudioControls } from '../components/modal';
import { COLORS, Text14SlateGreyWeight600 } from '../components/common/TypographyStyled';
import { Close as CloseIcon } from '@mui/icons-material';

export const MODAL_TYPES = {
	EDIT_JOB_OPENING: EditJobOpeningModal,
	SUMMARY_VIDEO: SummaryVideoModal,
	VIDEO_AUDIO_CONTROLS: VideoAudioControls,
};

const StyledModal = styled(Modal)({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '100%',
	maxWidth: 'fit-content',
	bgcolor: '#fff',
	boxShadow: 24,
	outline: 0,
	p: 4,
	borderRadius: 1,
};

const useModal = ({ isLoading, additionalStyles = {}, showCloseButton = false, closeWhenClickedOutside = true }) => {
	const [openModal, setOpenModal] = useState(null);
	const onHandleCloseModal = useCallback(() => {
		setOpenModal(null);
	}, []);
	const renderModal = useMemo(() => {
		const { modalType: ModalComponent, data } = openModal ?? {};
		return openModal ? (
			<StyledModal
				open={!!openModal}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
				onClose={() => {
					if (closeWhenClickedOutside) {
						onHandleCloseModal();
					}
				}}
				closeAfterTransition
				sx={{
					zIndex: (theme) => {
						return theme.zIndex.drawer + 1;
					},
				}}
			>
				<Box sx={{ ...style, ...additionalStyles }}>
					{showCloseButton ? (
						<Box onClick={onHandleCloseModal} sx={{ position: 'absolute', top: -44, right: 40, backgroundColor: '#fff', borderRadius: 1, zIndex: 10000, padding: '12px 16px 18px', cursor: 'pointer' }}>
							<Stack direction='row' alignItems='center' justifyContent='space-between' gap={1}>
								<Text14SlateGreyWeight600>Close</Text14SlateGreyWeight600>
								<CloseIcon style={{ color: COLORS.SlateGrey }} />
							</Stack>
						</Box>
					) : null}
					{isLoading && (
						<Backdrop open={true}>
							<CircularProgress color='inherit' />
						</Backdrop>
					)}
					{ModalComponent ? <ModalComponent data={data} onCloseModal={onHandleCloseModal} /> : null}
				</Box>
			</StyledModal>
		) : null;
	}, [additionalStyles, isLoading, onHandleCloseModal, openModal]);

	return { renderModal, setOpenModal, onHandleCloseModal };
};

export default useModal;
