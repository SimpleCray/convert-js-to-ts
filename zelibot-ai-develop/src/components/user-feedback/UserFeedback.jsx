import { useState, useRef } from 'react';
import { Iconify } from '@zelibot/zeligate-ui';
import { Box, SpeedDial, SpeedDialAction, styled, Menu, Stack, Grid, Button } from '@mui/material';
import { MapsUgcRounded as MapsUgcRoundedIcon, ThumbUpAltOutlined as ThumbUpAltOutlinedIcon, ThumbUpAlt as ThumbUpAltIcon, ThumbDownAltOutlined as ThumbDownAltOutlinedIcon, ThumbDownAlt as ThumbDownAltIcon, ForumOutlined as ForumOutlinedIcon } from '@mui/icons-material';
import { COLORS } from '../common/TypographyStyled';
import { useSendUserFeedback } from '../../hooks/UserFeedback/useUserFeedback';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import Control, { CONTROL_TYPE } from '../react-hook-form/control';

const CLICK_SENTIMENT = {
	LIKE: 'LIKE',
	DISLIKE: 'DISLIKE',
	COMMENT: 'COMMENT',
};

const schema = Yup.object().shape({
	comment: Yup.string().notRequired(),
});

export default function UserFeedback({ event_id, type }) {
	const [activeState, setActiveState] = useState('');
	const [anchorEl, setAnchorEl] = useState(null);
	const [userFeedbackId, setUserFeedbackId] = useState(null);
	const speedDialRef = useRef();
	const [open, setOpen] = useState(false);
	const handleOpen = (e, reason) => {
		if (reason === 'mouseEnter') {
			setOpen(true);
		}
	};
	const handleClose = (e, reason) => {
		if (reason === 'mouseLeave') {
			setOpen(false);
		}
	};
	const { mutate: mutateSendUserFeedback, isPending } = useSendUserFeedback(setUserFeedbackId);
	const methods = useForm({
		defaultValues: {
			comment: '',
		},
		resolver: yupResolver(schema),
	});

	const { watch } = methods;

	const comment = watch('comment');

	const commentValue = comment?.trim();

	const handleActionClick = (sentiment) => {
		handleClose(undefined, 'mouseLeave');
		const payload = {
			event_id,
			click_sentiment: '',
			target_component: type,
			user_feedback_id: userFeedbackId ?? null,
			comment: commentValue,
		};
		if ([CLICK_SENTIMENT.LIKE, CLICK_SENTIMENT.DISLIKE].includes(sentiment)) {
			if (activeState === sentiment) {
				setActiveState('');
			} else {
				setActiveState(sentiment);
				payload.click_sentiment = sentiment;
			}
			mutateSendUserFeedback(payload);
		} else {
			setAnchorEl(speedDialRef.current);
		}
	};

	const handleCancelClicked = () => {
		setAnchorEl(null);
	};

	const onSubmitComment = ({ comment }) => {
		const payload = {
			event_id,
			click_sentiment: activeState,
			target_component: type,
			user_feedback_id: userFeedbackId ?? null,
			comment,
		};
		mutateSendUserFeedback(payload, {
			onSuccess: () => {
				handleCancelClicked();
			},
		});
	};

	const actions = [
		{ icon: <ForumOutlinedIcon />, name: 'Provide feedback', sentiment: CLICK_SENTIMENT.COMMENT },
		{ activeIcon: <ThumbDownAltIcon />, icon: <ThumbDownAltOutlinedIcon />, name: 'Bad response', sentiment: CLICK_SENTIMENT.DISLIKE },
		{ activeIcon: <ThumbUpAltIcon />, icon: <ThumbUpAltOutlinedIcon />, name: 'Good response', sentiment: CLICK_SENTIMENT.LIKE },
	];

	return (
		<>
			<StyledSpeedDial ref={speedDialRef} onClose={handleClose} onOpen={handleOpen} open={open} ariaLabel='SpeedDial' icon={<MapsUgcRoundedIcon />}>
				{actions.map((action) => (
					<SpeedDialAction onClick={() => handleActionClick(action.sentiment)} key={action.name} icon={(activeState === action.sentiment ? action?.activeIcon : action.icon) ?? action.icon} tooltipTitle={action.name} />
				))}
			</StyledSpeedDial>
			<Menu
				id='basic-menu'
				anchorEl={anchorEl}
				open={!!anchorEl}
				onClose={handleCancelClicked}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				sx={{ zIndex: 99999999 }}
			>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmitComment)}>
						<Stack sx={{ p: 2, gap: 1, minWidth: 310 }}>
							<Control autoFocus={true} name='comment' fullWidth label='Provide your feedback:' rows={5} control={CONTROL_TYPE.TEXTAREA} placeholder='Write a description here' />
							<Grid item xs={9} display={'flex'} justifyContent={'flex-end'}>
								{commentValue ? (
									<Button type='button' disabled={isPending} variant='outlined' color='primary' onClick={handleCancelClicked} sx={{ mr: 2.5 }}>
										Cancel
									</Button>
								) : null}

								<LoadingButton disabled={!commentValue} type='submit' variant='contained' color='primary' size='small' endIcon={<Iconify icon={'ic:round-arrow-forward-ios'} />} loading={isPending}>
									Send
								</LoadingButton>
							</Grid>
						</Stack>
					</form>
				</FormProvider>
			</Menu>
		</>
	);
}

const StyledSpeedDial = styled(SpeedDial)({
	position: 'relative',
	width: 36,
	height: 36,
	'& > .MuiFab-root': { width: 36, minHeight: 36, backgroundColor: COLORS.LightLavender, borderRadius: '4px', '&:hover': { backgroundColor: COLORS.LightLavender } },
	'& .MuiSpeedDial-actions .MuiFab-root': {
		borderRadius: '4px',
		width: 36,
		minHeight: 36,
		backgroundColor: '#E4E5E9',
		'& .MuiSvgIcon-root': {
			width: 17,
			height: 17,
		},
	},
	'& .MuiSvgIcon-root': {
		color: COLORS.BlueGem,
	},
});

// MuiButtonBase-root MuiFab-root MuiFab-circular MuiFab-sizeSmall MuiFab-primary MuiFab-root MuiFab-circular MuiFab-sizeSmall MuiFab-primary MuiSpeedDialAction-fab css-ox2dl8-MuiButtonBase-root-MuiFab-root-MuiSpeedDialAction-fab
// MuiButtonBase-root MuiFab-root MuiFab-circular MuiFab-sizeSmall MuiFab-primary MuiFab-root MuiFab-circular MuiFab-sizeSmall MuiFab-primary MuiSpeedDialAction-fab MuiSpeedDialAction-fabClosed css-12y3ebt-MuiButtonBase-root-MuiFab-root-MuiSpeedDialAction-fab
