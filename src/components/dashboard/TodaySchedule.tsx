import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { isCurrentlyActive } from '../../lib/time';
import { format } from 'date-fns';

interface ClassSession {
    id: string;
    subject_name: string;
    subject_code: string;
    start_time: string;
    end_time: string;
    type: 'theory' | 'lab';
    slot_code?: string;
    room_number?: string;
}

interface TodayScheduleProps {
    sessions: ClassSession[];
}

export function TodaySchedule({ sessions }: TodayScheduleProps) {
    const [, forceUpdate] = useState({});

    // Update every minute to refresh live indicators
    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate({});
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight">Today's Schedule</h3>
            <div className="space-y-3">
                {sessions.length === 0 ? (
                    <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
                        No classes scheduled for today
                    </div>
                ) : (
                    sessions.map((session) => {
                        const isActive = isCurrentlyActive(session.start_time, session.end_time);

                        return (
                            <div
                                key={session.id}
                                className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isActive ? 'bg-primary/10 text-primary' : 'bg-secondary text-primary'
                                        }`}>
                                        {session.type === 'lab' ? (
                                            <BookOpen className="h-6 w-6" />
                                        ) : (
                                            <BookOpen className="h-6 w-6" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base">{session.subject_name}</h4>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                                            <span>{format(new Date(`2000-01-01T${session.start_time}`), 'hh:mm a')} - {format(new Date(`2000-01-01T${session.end_time}`), 'hh:mm a')}</span>
                                        </div>
                                        {session.room_number && (
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                {session.room_number}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                    <ChevronRight className="h-5 w-5" />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
