import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { ThemeToggle } from '../ThemeToggle';
import { BookOpen } from 'lucide-react';

export function DashboardLayout() {
    return (
        <div className="min-h-screen bg-background relative">
            {/* Glass Header */}
            <header className="fixed top-0 left-0 right-0 z-40 h-16 px-6 glass border-b-0">
                <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary">
                        <BookOpen className="h-6 w-6" />
                        <span>StudyTrack</span>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-32 px-4 min-h-screen">
                <div className="mx-auto max-w-6xl">
                    <Outlet />
                </div>
            </main>

            {/* Floating Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
