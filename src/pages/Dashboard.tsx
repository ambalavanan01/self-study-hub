import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CGPAChart } from '../components/dashboard/CGPAChart';
import { UpcomingTasks } from '../components/dashboard/UpcomingTasks';
import { TodaySchedule } from '../components/dashboard/TodaySchedule';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats] = useState({
        cgpa: 0,
        credits: 0,
    });
    const [tasks, setTasks] = useState<any[]>([]);
    const [schedule, setSchedule] = useState<any[]>([]);
    const [cgpaData, setCgpaData] = useState<{ semester: string; gpa: number }[]>([]);

    useEffect(() => {
        async function fetchDashboardData() {
            if (!user) return;

            try {
                // Fetch Tasks
                const { data: tasksData } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('status', 'todo')
                    .order('due_date', { ascending: true })
                    .limit(5);

                // Fetch Schedule
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const { data: scheduleData } = await supabase
                    .from('timetable_entries')
                    .select('*')
                    .eq('day', today)
                    .order('start_time', { ascending: true });

                // Fetch Semesters for CGPA Chart
                const { data: semestersData } = await supabase
                    .from('semesters')
                    .select('*, subjects(*)')
                    .order('year', { ascending: true })
                    .order('term', { ascending: false });

                // Calculate CGPA Data
                const chartData = semestersData?.map(sem => ({
                    semester: `${sem.term} ${sem.year}`,
                    gpa: 0, // TODO: Calculate GPA
                })) || [];

                setTasks(tasksData || []);
                setSchedule(scheduleData || []);
                setCgpaData(chartData);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.user_metadata?.name || 'Student'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link to="/tasks">
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            New Task
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Current CGPA</h3>
                    </div>
                    <div className="text-2xl font-bold">{stats.cgpa.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        +0.0 from last semester
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
                        <h3 className="tracking-tight text-sm font-medium">Tasks Due</h3>
                    </div>
                    <div className="text-2xl font-bold">{tasks.length}</div>
                    <p className="text-xs text-muted-foreground">
                        Upcoming deadlines
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <CGPAChart data={cgpaData} />
                </div>
                <div className="col-span-3 space-y-4">
                    <TodaySchedule sessions={schedule} />
                    <UpcomingTasks tasks={tasks} />
                </div>
            </div>
        </div>
    );
}
