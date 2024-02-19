import { m } from 'framer-motion';
import AnimatedBorder from '../animated-border';
import { StyledBorder } from './TextBorderStyles';

export default function TextBorder({ text }) {
	return (
		<StyledBorder>
			{text.split('<span>').map((item, index) => {
				if (item.includes('</span>')) {
					const text = item.split('</span>');
					return (
						<span key={index}>
							<m.span className={'underline'} layoutId='underline'>
								{text[0]}
								<AnimatedBorder layoutId='underline' />
							</m.span>
							<span>{text[1]}</span>
						</span>
					);
				} else {
					return <span key={index}>{item}</span>;
				}
			})}
		</StyledBorder>
	);
}
