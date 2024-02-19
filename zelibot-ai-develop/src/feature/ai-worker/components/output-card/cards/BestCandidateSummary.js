import OutputCard from '../OutputCard';
import { Stack, TableContainer, TableBody, TableCell, TableRow, Paper, Table, Box } from '@mui/material';
import { Iconify } from '@zelibot/zeligate-ui';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';

export default function BestCandidateSummaryOutputCard({ chips, body, type, event_id, handleCardClose, ...props }) {
	const rows = [
		{
			name: 'Name',
			value: 'Anthony Stewart',
		},
		{
			name: 'Contact',
			value: {
				email: 'mdi:email',
				phone: 'mdi:phone',
				address: 'mdi:home',
			},
		},
		{
			name: 'Current Position',
			value: 'Senior Marketing Specialist, ABC Corp',
		},
		{
			name: 'Location',
			value: 'South Brisbane, Australia',
		},
		{
			name: 'Application Date',
			value: '12th August, 2023',
		},
	];

	const closeThiscard = () => {
		handleCardClose(props)
	}


	return (
		<OutputCard title={'Best Candidate Summary'} {...props} closeCard={closeThiscard}>
			<h2>Marketing Account Manager</h2>
			<p>
				<strong>Candidate Information</strong>
			</p>
			<TableContainer component={Paper}>
				<Table sx={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
					<TableBody>
						{rows.map((row) => (
							<TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell component='th' scope='row'>
									<strong>{row.name}</strong>
								</TableCell>
								<TableCell>
									{typeof row.value === 'object'
										? Object.keys(row.value).map((key) => (
												<Box key={key} mr={1} as={'span'}>
													<Iconify icon={row.value[key]} />
												</Box>
											))
										: row.value}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<div dangerouslySetInnerHTML={{ __html: HtmlText }} />
			<Stack direction='row' justifyContent='flex-end' alignItems='center' gap={2} mt={2}>
				<UserFeedback type={type} event_id={event_id} />
			</Stack>
		</OutputCard>
	);
}

const HtmlText = `
<p>
  <strong>Evaluation Metrics</strong>
</p>
<ul>
  <li>Relevant Experience: 20 years in diverse industries</li>
  <li>Education: Bachelor's in Marketing</li>
  <li>Skills: Marketing Strategies, Managing Client Accounts, Campaign Management</li>
  <li>Certifications: Google Ads Certified</li>
  <li>Language Proficiency: Fluent in English and Spanish</li>
</ul>
<p>
  <strong>Strengths</strong>
</p>
<ul>
  <li>Proven track record in managing successful marketing campaigns.</li>
  <li>Exceptional communication skills, with experience in client interaction.</li>
  <li>In-depth knowledge of digital marketing strategies and analytics.</li>
</ul>
<p>
  <strong>Interview Notes</strong>
</p>
<ul>
  <li>Demonstrated excellent problem-solving skills during the interview.</li>
  <li>Shared creative insights for optimising campaign performance.</li>
  <li>Exhibited a strong understanding of current market trends.</li>
</ul>
<p>
  <strong>Comparative Analysis</strong>
</p>
<ul>
  <li>Compared to other candidates, Anthony stands out due to his extensive campaign management experience and bilingual skills.</li>
</ul>
<p>
  <strong>Recommendation</strong>
</p>
<p>Recommended for Further Consideration</p>
<p>
  <strong>Comments</strong>
</p>
<p>Anthony's skills and experience align well with the requirements for the Marketing Account Manager role. His communication abilities and proficiency in digital marketing make him a strong candidate.</p>`;
