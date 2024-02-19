import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import GradingOutlinedIcon from '@mui/icons-material/GradingOutlined';
import FormatListNumberedRtlRoundedIcon from '@mui/icons-material/FormatListNumberedRtlRounded';
import RuleRoundedIcon from '@mui/icons-material/RuleRounded';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

import { StyledPromptCard } from './PromptCardStyles';
import propTypes from 'prop-types';

PromptCard.propTypes = {
	icon: propTypes.string,
	title: propTypes.string,
	credit: propTypes.number,
	setAction: propTypes.func,
};

export default function PromptCard({ icon, title = 'Write job ad', credit = 1, action, setAction, setIsPromptsOpen, outlined = false }) {
	const handleAction = () => {
		if (action) {
			setAction(action, title);
			setIsPromptsOpen(false);
		}
	};

	return (
		<div>
			<StyledPromptCard className={outlined ? 'outlined' : ''} onClick={handleAction} label={title} icon={<PromptIconType variant={icon} />} />
			<svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden='true' focusable='false'>
				<linearGradient id='gradient-svg' x1='3' y1='4.71094' x2='21.2525' y2='21.2759' gradientUnits='userSpaceOnUse'>
					<stop offset='0.0416667' stopColor='#B46D8F' />
					<stop offset='0.375' stopColor='#370F67' />
					<stop offset='0.921875' />
				</linearGradient>
			</svg>
		</div>
	);
}

PromptIconType.propTypes = {
	variant: propTypes.string,
};

export function PromptIconType({ variant }) {
	switch (variant) {
		case 'CREATE':
			return <AutoAwesomeRoundedIcon className={'MuiChip-icon'} />;
		case 'SEARCH':
			return <SearchRoundedIcon className={'MuiChip-icon'} />;
		case 'POST':
			return <PushPinOutlinedIcon className={'MuiChip-icon'} />;
		case 'SEND':
			return <SendOutlinedIcon className={'MuiChip-icon'} />;
		case 'PHONE_CALL':
			return <LocalPhoneOutlinedIcon className={'MuiChip-icon'} />;
		case 'RECORD':
			return <RecordVoiceOverOutlinedIcon className={'MuiChip-icon'} />;
		case 'SCHEDULE':
			return <CalendarTodayOutlinedIcon className={'MuiChip-icon'} />;
		case 'CONFIRM':
			return <CheckCircleOutlineRoundedIcon className={'MuiChip-icon'} />;
		case 'DENY':
			return <HighlightOffRoundedIcon className={'MuiChip-icon'} />;
		case 'SAVE':
			return <SaveOutlinedIcon className={'MuiChip-icon'} />;
		case 'EDIT':
			return <ModeEditOutlineOutlinedIcon className={'MuiChip-icon'} />;
		case 'PERSON':
			return <PersonOutlineRoundedIcon className={'MuiChip-icon'} />;
		case 'UPLOAD':
			return <UploadFileIcon className={'MuiChip-icon'} />;
		case 'ACCOUNT':
			return <AccountBalanceRoundedIcon className={'MuiChip-icon'} />;
		case 'DEVICES':
			return <DevicesRoundedIcon className={'MuiChip-icon'} />;
		case 'LETTER':
			return <ArticleRoundedIcon className={'MuiChip-icon'} />;
		default:
			return (
				<svg className={'MuiChip-icon MuiSvgIcon-root'} width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
					<path d='M6.4 19.25H5V17.85L13.625 9.225L15.025 10.625L6.4 19.25ZM15.05 4.975L19.3 9.175L20.725 7.75C21.1083 7.36667 21.2917 6.90417 21.275 6.3625C21.2583 5.82083 21.0583 5.35833 20.675 4.975L19.275 3.575C18.8917 3.19167 18.4208 3 17.8625 3C17.3042 3 16.8333 3.19167 16.45 3.575L15.05 4.975ZM3.2875 20.9625C3.47917 21.1542 3.71667 21.25 4 21.25H6.825C6.95833 21.25 7.0875 21.225 7.2125 21.175C7.3375 21.125 7.45 21.05 7.55 20.95L17.85 10.65L13.6 6.4L3.3 16.7C3.2 16.8 3.125 16.9125 3.075 17.0375C3.025 17.1625 3 17.2917 3 17.425V20.25C3 20.5333 3.09583 20.7708 3.2875 20.9625ZM5.8325 3.2925L5.0425 5.0425L3.2925 5.8325C2.9025 6.0125 2.9025 6.5625 3.2925 6.7425L5.0425 7.5325L5.8325 9.2925C6.0125 9.6825 6.5625 9.6825 6.7425 9.2925L7.5325 7.5425L9.2925 6.7525C9.6825 6.5725 9.6825 6.0225 9.2925 5.8425L7.5425 5.0525L6.7525 3.2925C6.5725 2.9025 6.0125 2.9025 5.8325 3.2925Z' />
				</svg>
			);
	}
}

export function PromptFirstTimeIconType({ action, ...props }) {
	switch (action) {
		case 'CREATE_JOB_OPENING':
			return <AiWriteRounded {...props} />;
		case 'CREATE_JOB_DESCRIPTION':
			return <AutoAwesomeRoundedIcon className={'MuiChip-icon'} {...props} />;
		case 'POST_JOB_AD':
			return <PushPinOutlinedIcon className={'MuiChip-icon'} {...props} />;
		case 'UPLOAD_RESUMES':
			return <UploadFileOutlinedIcon className={'MuiChip-icon'} {...props} />;
		case 'REVIEW_CANDIDATES':
			return <RuleRoundedIcon className={'MuiChip-icon'} {...props} />;
		case 'SCORE_AND_RANK_CANDIDATES':
			return <FormatListNumberedRtlRoundedIcon className={'MuiChip-icon'} {...props} />;
		case 'INVITE_CANDIDATES_FOR_PRE_SCREENING':
			return <RecordVoiceOverOutlinedIcon className={'MuiChip-icon'} {...props} />;
		case 'REVIEW_PRE_SCREENING_CALLS':
			return <GradingOutlinedIcon className={'MuiChip-icon'} {...props} />;
		default:
			return null;
	}
}

const AiWriteRounded = ({ width = 31, height = 30 }) => {
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M6.2398 26.7998H3.9998V24.5598L17.7998 10.7598L20.0398 12.9998L6.2398 26.7998ZM20.0798 3.9598L26.8798 10.6798L29.1598 8.39981C29.7731 7.78647 30.0665 7.04647 30.0398 6.1798C30.0131 5.31314 29.6931 4.57314 29.0798 3.9598L26.8398 1.7198C26.2265 1.10647 25.4731 0.799805 24.5798 0.799805C23.6865 0.799805 22.9331 1.10647 22.3198 1.7198L20.0798 3.9598ZM1.2598 29.5398C1.56647 29.8465 1.94647 29.9998 2.3998 29.9998H6.91981C7.13314 29.9998 7.33981 29.9598 7.5398 29.8798C7.73981 29.7998 7.91981 29.6798 8.07981 29.5198L24.5598 13.0398L17.7598 6.2398L1.2798 22.7198C1.1198 22.8798 0.999805 23.0598 0.919805 23.2598C0.839805 23.4598 0.799805 23.6665 0.799805 23.8798V28.3998C0.799805 28.8531 0.953138 29.2331 1.2598 29.5398ZM5.3318 1.2678L4.0678 4.0678L1.2678 5.33181C0.643805 5.61981 0.643805 6.49981 1.2678 6.78781L4.0678 8.0518L5.3318 10.8678C5.6198 11.4918 6.4998 11.4918 6.7878 10.8678L8.0518 8.0678L10.8678 6.8038C11.4918 6.5158 11.4918 5.6358 10.8678 5.3478L8.0678 4.08381L6.8038 1.2678C6.5158 0.643805 5.6198 0.643805 5.3318 1.2678Z'
				fill='#6E30C1'
			/>
		</svg>
	);
};
