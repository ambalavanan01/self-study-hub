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
    const [ongoingClass, setOngoingClass] = useState<any>(null);

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

                const [basicResult, smartResult] = await Promise.all([
                    supabase
                        .from('timetable_entries')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('day', today),
                    supabase
                        .from('smart_timetable_entries')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('day', today)
                ]);

                const allEntries = [...(basicResult.data || []), ...(smartResult.data || [])];
                allEntries.sort((a, b) => a.start_time.localeCompare(b.start_time));

                setSchedule(allEntries);

                // Determine ongoing class
                const now = new Date();
                const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

                const current = allEntries.find(entry =>
                    entry.start_time <= currentTime && entry.end_time > currentTime
                );
                setOngoingClass(current || null);

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
            <div className="grid gap-4 md:grid-cols-4">
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

                {/* On Going Class Tile */}
                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Calendar className="h-12 w-12" />
                    </div>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-primary">On Going Class</h3>
                        {ongoingClass && (
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                        )}
                    </div>
                    {ongoingClass ? (
                        <div>
                            <div className="text-lg font-bold truncate" title={ongoingClass.subject_name}>
                                {ongoingClass.subject_name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <span className="font-mono bg-muted px-1 rounded">{ongoingClass.subject_code}</span>
                                {ongoingClass.room_number && <span>• {ongoingClass.room_number}</span>}
                            </div>
                            <div className="text-xs font-medium mt-2">
                                {ongoingClass.start_time.slice(0, 5)} - {ongoingClass.end_time.slice(0, 5)}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center h-full min-h-[60px]">
                            <p className="text-sm text-muted-foreground">No class currently in progress.</p>
                        </div>
                    )}
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
