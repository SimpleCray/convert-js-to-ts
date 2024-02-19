import GuestGuard from '../../feature/auth/context/GuestGuard';
import { AuthLogin } from '../../feature/auth';

export default function LoginPage() {
	return (
		<GuestGuard>
			<AuthLogin />
		</GuestGuard>
	);
}
