
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    GraduationCap,
    Calendar,
    FolderOpen,
    CheckSquare,
    Timer,
    User,
    LogOut,
    BookOpen
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    className?: string;
    onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
    const { signOut } = useAuth();

    const links = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/cgpa', icon: GraduationCap, label: 'CGPA' },
        { to: '/timetable', icon: Calendar, label: 'Timetable' },
        { to: '/files', icon: FolderOpen, label: 'Files' },
        { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
        { to: '/study-sessions', icon: Timer, label: 'Study Sessions' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className={cn("flex h-full flex-col bg-card border-r", className)}>
            <div className="p-6 flex items-center gap-2 font-bold text-xl text-primary">
                <BookOpen className="h-6 w-6" />
                <span>StudyTrack</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )
                        }
                    >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
