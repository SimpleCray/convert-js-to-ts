import Onboarding from '../../feature/onboarding';
import AuthGuard from '../../feature/auth/context/AuthGuard';

export default function OnboardingPage() {
	return (
		<AuthGuard>
			<Onboarding />
		</AuthGuard>
	);
}
