
import { MobileLogin } from '../components/auth/MobileLogin';
import { DesktopLogin } from '../components/auth/DesktopLogin';

export function Login() {
    return (
        <>
            <div className="block md:hidden">
                <MobileLogin />
            </div>
            <div className="hidden md:block">
                <DesktopLogin />
            </div>
        </>
    );
}
