import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CGPAChart } from '../components/dashboard/CGPAChart';
import { UpcomingTasks } from '../components/dashboard/UpcomingTasks';
import { TodaySchedule } from '../components/dashboard/TodaySchedule';
import { LiveClock } from '../components/dashboard/LiveClock';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        cgpa: 0,
        credits: 0,
    });
    const [tasks, setTasks] = useState<any[]>([]);
    const [schedule, setSchedule] = useState<any[]>([]);
    const [cgpaData, setCgpaData] = useState<{ semester: string; gpa: number }[]>([]);

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

                // Fetch Tasks with user_id filter
                const { data: tasksData } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('status', 'todo')
                    .order('due_date', { ascending: true })
                    .limit(5);

                // Fetch Schedule
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const { data: scheduleData } = await supabase
                    .from('timetable_entries')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('day', today)
                    .order('start_time', { ascending: true });

                // Fetch Semesters for CGPA Chart
                const { data: semestersData } = await supabase
                    .from('semesters')
                    .select('*, subjects(*)')
                    .eq('user_id', user.id)
                    .order('year', { ascending: true })
                    .order('term', { ascending: false });

                // Calculate GPA for each semester
                const chartData = semestersData?.map(sem => {
                    let semCredits = 0;
                    let semGradePoints = 0;

                    if (sem.subjects && sem.subjects.length > 0) {
                        sem.subjects.forEach((subject: any) => {
                            if (subject.grade && subject.credit) {
                                const credit = parseFloat(subject.credit);
                                const gradePoint = gradePoints[subject.grade] || 0;
                                semCredits += credit;
                                semGradePoints += gradePoint * credit;
                            }
                        });
                    }

                    const gpa = semCredits > 0 ? semGradePoints / semCredits : 0;

                    return {
                        semester: `${sem.term} ${sem.year}`,
                        gpa: parseFloat(gpa.toFixed(2)),
                    };
                }) || [];

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
                <div className="flex items-center gap-4">
                    <LiveClock />
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
