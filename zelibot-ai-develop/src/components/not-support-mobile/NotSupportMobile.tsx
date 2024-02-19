import { Logo } from '@zelibot/zeligate-ui';
import { Button, Stack } from '@mui/material';
import { StyledAIOutputPanel } from '../../feature/ai-worker';
import { Text16MidnightPurpleWeight400, Text22MidnightPurpleWeight700 } from '../../components/common/TypographyStyled';
import { useRouter } from 'src/hooks/useRouter';
type NotSupportMobileProps = {
	title: string;
	subTitle: string;
};

const NotSupportMobile = ({ subTitle = 'Please access Zeligate from your computer.', title = 'Zeli is not optimised for mobile yet.' }: NotSupportMobileProps) => {
	const router = useRouter();
	return (
		<Stack sx={{ height: '100dvh' }}>
			<Stack direction='row' sx={{ height: 55, mx: 2, '& .logoFull': { height: 36 } }} justifyContent='space-between' alignItems='center'>
				<Logo type={'full'} className={'logoFull'} color={'#3B0099'} linkTo={'/'} />
				<div />
			</Stack>
			<Stack flexGrow={1} sx={{ mx: 2, mb: 2 }}>
				<StyledAIOutputPanel>
					<Stack justifyContent='center' alignItems='center' sx={{ height: '100%', '& p': { textAlign: 'center' } }} gap={4}>
						<Text22MidnightPurpleWeight700>{title}</Text22MidnightPurpleWeight700>
						<Text16MidnightPurpleWeight400>{subTitle}</Text16MidnightPurpleWeight400>
						<Button onClick={() => router.replace('/')} variant='contained' sx={{ fontSize: 18, fontWeight: 600, backgroundColor: '#170058' }}>
							Close
						</Button>
					</Stack>
				</StyledAIOutputPanel>
			</Stack>
		</Stack>
	);
};

export default NotSupportMobile;
