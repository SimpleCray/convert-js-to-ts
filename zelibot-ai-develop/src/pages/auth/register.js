import GuestGuard from '../../feature/auth/context/GuestGuard';
import { AuthRegister } from '../../feature/auth';

export default function RegisterPage({ title }) {
	return (
		<GuestGuard>
			<AuthRegister title={title}/>
		</GuestGuard>
	);
}
