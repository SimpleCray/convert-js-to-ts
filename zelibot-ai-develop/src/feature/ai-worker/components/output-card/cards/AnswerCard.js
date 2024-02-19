import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Grid } from '@mui/material';

export default function AnswerCard({ id, cardContent = '', cardResponseContent = '' }) {
	return (
		<Box id={id && `dialogue_${id}`} sx={{ flexGrow: 1 }}>
			<Grid container spacing={0}>
				{cardResponseContent && (
					<>
						<Grid item xs={9} md={9} lg={9}>
							<ZeliCard type='answer' cardContent={cardResponseContent} />
						</Grid>
						<Grid item xs={3} md={3} lg={3} />
					</>
				)}

				{cardContent && (
					<>
						<Grid item xs={3} md={3} lg={3} />
						<Grid item xs={9} md={9} lg={9}>
							<ZeliCard type='question' cardContent={cardContent} />
						</Grid>
					</>
				)}
			</Grid>
		</Box>
	);
}

function ZeliCard({ type = 'answer', width = '100%', cardContent = '' }) {
	const cardStyle = {
		...(type === 'answer'
			? {
					border: '1px solid #fff',
					backgroundColor: 'rgba(255,255,255,0)',
					color: '#fff',
					borderRadius: '0 16px 16px 16px',
			  }
			: {
					backgroundColor: 'rgba(255,255,255,0.7)',
					borderRadius: '16px 0 16px 16px',
			  }),
	};

	return (
		<Card sx={{ width: width }} style={{ height: '100%', ...cardStyle }}>
			<CardContent>
				<Typography variant='body1' component={'div'}>
					{cardContent &&
						cardContent.split('\n').map((line, index) => (
							<span key={index}>
								{line}
								{index !== cardContent.length - 1 && <br />}
							</span>
						))}
				</Typography>
			</CardContent>
		</Card>
	);
}
