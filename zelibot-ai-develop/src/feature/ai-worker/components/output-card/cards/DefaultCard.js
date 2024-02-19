import { Typography, Stack, Box } from '@mui/material';
import OutputCard from '../OutputCard';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';
import { Text16MediumPurpleWeight400, Text16MidnightPurpleWeight400 } from '../../../../../components/common/TypographyStyled';
import useResponsive from '../../../../../hooks/useResponsive';
import { makeReadable } from 'src/feature/ai-worker/helpers/makeReadable';
import { getSourceUrl } from '../../../../../utils/common';
import { Loading } from '../../../../../components/loading-screen';

export default function DefaultOutputCard({ clickRequestAction, storedSourceLinks, type, event_id, body, writingContent, ...props }) {
	const isDesktop = useResponsive('up', 'md');
	const viewFile = async (url) => {
		const target_url = await getSourceUrl({ source_type: 1, url });
		if (target_url) {
			clickRequestAction(undefined, 'VIEW_DOCUMENT', {}, target_url);
		}
	};

	return (
		<OutputCard {...props} isATSCard>
			<Stack gap={0.8}>
				{body ? (
					<Typography variant='body1' component={'div'}>
						{body && body.includes('\n')
							? body.split('\n').map((paragraph, index) => (
								<Typography key={index} variant='body1' gutterBottom>
									{paragraph}
								</Typography>
							))
							: body}
					</Typography>
				) : (
					<Box my={4} height={200}>
						<Loading />
					</Box>
				)}
				{storedSourceLinks?.length > 0 ? (
					<Stack>
						<Text16MidnightPurpleWeight400>{storedSourceLinks?.length > 1 ? 'Links of interest' : 'Link of interest'}: </Text16MidnightPurpleWeight400>
						<Stack flexDirection='column' alignItems={'flex-start'}>
							{storedSourceLinks?.map((item, index) =>
								item?.url
									?
									isDesktop ? (
										<ul key={`${item?.name}_${index}`} style={{ marginBlock: 0 }}>
											<li>
												<Text16MidnightPurpleWeight400 as='span'>{item?.category ? `${makeReadable(item?.category)}: ` : ''}</Text16MidnightPurpleWeight400>
												<Text16MediumPurpleWeight400 as='span' onClick={() => viewFile(item?.url)} sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
													{item?.name}
												</Text16MediumPurpleWeight400>
											</li>
										</ul>
									) : (
										<React.Fragment key={`${item?.name}_${index}`}>
											<Text16MediumPurpleWeight400 onClick={() => viewFile(item?.url)} sx={{ cursor: 'pointer' }}>
												{item?.name}
											</Text16MediumPurpleWeight400>
											{index !== storedSourceLinks?.length - 1 ? ', ' : ''}
										</React.Fragment>
									)
									: null
							)}
						</Stack>
					</Stack>
				) : null}
			</Stack>
			{!writingContent ? (
				<Stack direction='row' justifyContent='flex-end' alignItems='center' gap={2} mt={2}>
					<UserFeedback type={type} event_id={event_id} />
				</Stack>
			) : null}
		</OutputCard>
	);
}
