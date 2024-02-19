import { AuthNewPassword } from '../../feature/auth';
import GuestGuard from '../../feature/auth/context/GuestGuard';

export default function NewPasswordPage() {
	return <GuestGuard><AuthNewPassword /></GuestGuard>;
}
