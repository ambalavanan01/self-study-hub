import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { TodaySchedule } from '../components/dashboard/TodaySchedule';
import { LiveClock } from '../components/dashboard/LiveClock';
import { Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        cgpa: 0,
        credits: 0,
    });
    const [schedule, setSchedule] = useState<any[]>([]);

    // Grade point mapping
    const gradePoints: Record<string, number> = {
        'S': 10,
        'A': 9,
        'B': 8,
        'C': 7,
        'D': 6,
        'E': 5,
    };

    useEffect(() => {
        async function fetchDashboardData() {
            if (!user) return;

            try {
                // Fetch all subjects to calculate CGPA and total credits
                const { data: allSubjects } = await supabase
                    .from('subjects')
                    .select('*')
                    .eq('user_id', user.id);

                // Calculate total credits and CGPA
                let totalCredits = 0;
                let totalGradePoints = 0;

                if (allSubjects && allSubjects.length > 0) {
                    allSubjects.forEach((subject) => {
                        if (subject.grade && subject.credit) {
                            const credit = parseFloat(subject.credit);
                            const gradePoint = gradePoints[subject.grade] || 0;
                            totalCredits += credit;
                            totalGradePoints += gradePoint * credit;
                        }
                    });
                }

                const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

                setStats({
                    cgpa: parseFloat(cgpa.toFixed(2)),
                    credits: totalCredits,
                });

                // Fetch Schedule
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const { data: scheduleData } = await supabase
                    .from('smart_timetable_entries')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('day', today)
                    .order('start_time', { ascending: true });

                setSchedule(scheduleData || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [user]);

    if (loading) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, <span className="font-semibold text-foreground">{user?.user_metadata?.name || 'Student'}</span>. Ready to learn?
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <LiveClock />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Link to="/timetable" className="group">
                    <div className="rounded-xl border bg-card p-4 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer h-full">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Check Schedule</h3>
                                <p className="text-xs text-muted-foreground">View today's classes</p>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to="/files" className="group">
                    <div className="rounded-xl border bg-card p-4 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer h-full">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Upload Files</h3>
                                <p className="text-xs text-muted-foreground">Manage study materials</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Stats Tiles */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Current CGPA</h3>
                    </div>
                    <div className="text-2xl font-bold">{stats.cgpa.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Cumulative Grade Point Average
                    </p>
                </div>
                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Credits</h3>
                    </div>
                    <div className="text-2xl font-bold">{stats.credits}</div>
                    <p className="text-xs text-muted-foreground">
                        Credits completed
                    </p>
                </div>
                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Classes Today</h3>
                    </div>
                    <div className="text-2xl font-bold">{schedule.length}</div>
                    <p className="text-xs text-muted-foreground">
                        Sessions scheduled
                    </p>
                </div>
            </div>

            {/* Schedule */}
            <div className="grid gap-4">
                <div className="space-y-4">
                    <TodaySchedule sessions={schedule} />
                </div>
            </div>
        </div>
    );
}
