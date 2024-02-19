import { AIWorker } from '../../../feature/ai-worker';
import AuthGuard from '../../../feature/auth/context/AuthGuard';
import { NotSupportMobile } from '../../../components/not-support-mobile';
import useResponsive from '../../../hooks/useResponsive';

export default function HrHelperWorkspacePage() {
	const isDesktop = useResponsive('up', 'md');
	const renderContent = () => {
		return isDesktop ? <AIWorker /> : <NotSupportMobile />;
	};

	return <AuthGuard> {renderContent()} </AuthGuard>;
}
