import { Box, Button, Grid, Typography } from '@mui/material';
import { AvatarSelector } from '../index';
import { StyledSkillsTextWrapper, StyledWorkerDetails, StyledMessageDialog, NextButton } from './UploadDocumentsStyles';
import { UploadFiles } from '../../../ai-worker/components';

export default function UploadDocuments({ selectedAssistant, onComplete }) {
	return (
		<>
			<Grid item xs={12} md={6} lg={7}>
				<StyledWorkerDetails>
					<Grid container display='flex' flexWrap={'initial'} direction={{ xs: 'column-reverse', md: 'row' }} spacing={{ xs: 2, md: 0 }}>
						<Grid item xs={12} md={6} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
							<Box pr={{ xs: 0, md: 4 }}>
								<Typography variant='h3' component={'h2'} textAlign={{ xs: 'center', md: 'left' }}>
									{selectedAssistant?.avatarName}
								</Typography>
								<Typography variant='h6' component={'div'} color={'text.disabled'} textAlign={{ xs: 'center', md: 'left' }}>
									{selectedAssistant?.avatarRole}
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} md={6} display='flex' justifyContent={'center'}>
							<AvatarSelector id={'desktop-avatar'} assistant={selectedAssistant} step={2} selected />
						</Grid>
					</Grid>
					<StyledSkillsTextWrapper>
						<StyledMessageDialog>
							<Typography variant='body2' component={'div'}>
								{selectedAssistant?.dialogueText2}
							</Typography>
						</StyledMessageDialog>
					</StyledSkillsTextWrapper>
				</StyledWorkerDetails>
			</Grid>
			<Grid item xs={12} md={6} lg={5}>
				<StyledWorkerDetails>
					<UploadFiles />
					<NextButton onClick={onComplete} />
				</StyledWorkerDetails>
			</Grid>
		</>
	);
}
