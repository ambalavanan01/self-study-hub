import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Timer } from '../components/study/Timer';
import { Card } from '../components/ui/card';
import { Clock, Calendar } from 'lucide-react';

interface Session {
    id: string;
    duration: number;
    completed_at: string;
}

export function Study() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [stats, setStats] = useState({
        totalSessions: 0,
        totalHours: 0,
        todaySessions: 0,
    });

    const fetchSessions = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('study_sessions')
                .select('*')
                .order('completed_at', { ascending: false });

            if (error) throw error;

            const sessionData = data || [];
            setSessions(sessionData);

            // Calculate stats
            const totalMins = sessionData.reduce((acc, curr) => acc + curr.duration, 0);
            const today = new Date().toDateString();
            const todayCount = sessionData.filter(s => new Date(s.completed_at).toDateString() === today).length;

            setStats({
                totalSessions: sessionData.length,
                totalHours: Math.round((totalMins / 60) * 10) / 10,
                todaySessions: todayCount,
            });
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [user]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Study Sessions</h1>
                <p className="text-muted-foreground">
                    Focus on your work with the Pomodoro timer and track your progress.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                        <h3 className="text-2xl font-bold">{stats.totalHours}h</h3>
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Sessions Today</p>
                        <h3 className="text-2xl font-bold">{stats.todaySessions}</h3>
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                        <h3 className="text-2xl font-bold">{stats.totalSessions}</h3>
                    </div>
                </Card>
            </div>

            <Timer onSessionComplete={fetchSessions} />

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Sessions</h2>
                <div className="grid gap-2">
                    {sessions.slice(0, 5).map((session) => (
                        <Card key={session.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="font-medium">Focus Session</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {new Date(session.completed_at).toLocaleString()} • {session.duration} mins
                            </div>
                        </Card>
                    ))}
                    {sessions.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No sessions recorded yet. Start focusing!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
