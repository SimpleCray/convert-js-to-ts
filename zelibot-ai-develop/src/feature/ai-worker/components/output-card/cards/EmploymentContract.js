import OutputCard from '../OutputCard';
import Typewriter from '../../../hooks';
import { Typography, Stack } from '@mui/material';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';

export default function EmploymentContractOutputCard({ type, event_id, handleCardClose, ...props }) {
	const closeThiscard = () => {
		handleCardClose(props)
	}
	
	return (
		<OutputCard title={'Employment Contract'} showActions={true} closeCard={closeThiscard} {...props}>
			<Typography variant={'body1'} component={'div'}>
				{strings.map((string, index) => {
					const stringCount = string.length;
					return (
						<p key={index}>
							<Typewriter text={string} />
						</p>
					);
				})}
			</Typography>
			<Stack direction='row' justifyContent='flex-end' alignItems='center' gap={2} mt={2}>
				<UserFeedback type={type} event_id={event_id} />
			</Stack>
		</OutputCard>
	);
}

const strings = [
	'This Employment Contract ("Contract") is entered into on 21st September, 2023 (the "Effective Date"), between Acme Company, a company organized and existing under the laws of Delaware, USA, with its principal place of business at 2748 Callison Ave, Dover DE 19711 (hereinafter referred to as the "Company"), and Mr. Anthony Stewart, an individual residing at [Address] (hereinafter referred to as the "Employee").',
	'1. Position and Responsibilities',
	"The Company hereby employs the Employee as a Marketing Account Manager. The Employee's responsibilities shall include, but not be limited to, developing and implementing marketing strategies, optimizing campaigns, collaborating with cross-functional teams, and providing leadership within the marketing department.",
	'2. Compensation',
	'The Employee shall be compensated for their services as follows:',
	'Base Salary: $120,000/year (subject to applicable deductions and withholdings)',
	"Bonus and Incentives: The Employee may be eligible for performance-based bonuses and incentives, as determined by the Company's performance evaluation criteria.",
	'3. Work Schedule',
	"The Employee's standard work schedule shall be Monday through Friday, 9:00 AM to 5:00 PM, with a one-hour lunch break from 12:00 PM to 1:00 PM.. The Employee agrees to be flexible in working additional hours as required to fulfil their responsibilities.",
	'4. Benefits',
	"The Employee shall be entitled to participate in the Company's benefit programs, including but not limited to health insurance, retirement plans, and any other benefits offered to similarly situated employees.",
	'5. Probation Period',
	"The Employee's initial employment shall be considered a probationary period of 6 months. During this period, either party may terminate the employment relationship with 4 weeks written notice.",
	'6. Confidentiality and Non-Disclosure',
	'The Employee shall not disclose, use, or reproduce any confidential or proprietary information of the Company, including trade secrets, business strategies, client information, and marketing plans, both during and after their employment.',
	'7. Termination',
	"Either party may terminate this Contract with [Notice Period] written notice. The Company reserves the right to terminate the Employee's employment immediately for cause, including but not limited to misconduct, violation of company policies, or failure to perform their duties satisfactorily.",
	'8. Intellectual Property',
	'Any work created by the Employee during the course of their employment, including marketing materials and strategies, shall be the exclusive property of the Company.',
	'9. Governing Law',
	'This Contract shall be governed by and construed in accordance with the laws of [State/Country], without regard to its conflict of law principles.',
	'10. Entire Agreement',
	'This Contract constitutes the entire agreement between the parties and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties.',
	'IN WITNESS WHEREOF, the parties hereto have executed this Contract as of the Effective Date.',
];
