import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Clock, MapPin } from 'lucide-react';
import { isCurrentlyActive, getNextClass, getMinutesUntil } from '../../lib/time';

interface ClassSession {
    id: string;
    subject_name: string;
    subject_code: string;
    start_time: string;
    end_time: string;
    type: 'theory' | 'lab';
    slot_code?: string;
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

    const nextClassIndex = getNextClass(sessions);

    return (
        <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Today's Schedule</h3>
            <div className="space-y-4">
                {sessions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No classes today</p>
                ) : (
                    sessions.map((session, index) => {
                        const isActive = isCurrentlyActive(session.start_time, session.end_time);
                        const isNext = index === nextClassIndex;
                        const minutesUntil = getMinutesUntil(session.start_time);

                        return (
                            <div
                                key={session.id}
                                className={`relative flex items-start gap-4 rounded-lg border p-3 transition-all ${isActive
                                    ? 'bg-accent/50 border-primary shadow-md ring-2 ring-primary/20'
                                    : 'hover:bg-accent/50'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute -left-1 -top-1 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground animate-pulse">
                                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                        Now
                                    </div>
                                )}
                                {isNext && !isActive && (
                                    <div className="absolute -left-1 -top-1 flex items-center gap-1 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-bold text-white">
                                        Next
                                    </div>
                                )}
                                <div className={`flex flex-col items-center justify-center rounded px-2 py-1 text-xs font-bold ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                    }`}>
                                    <span>{session.start_time.slice(0, 5)}</span>
                                    <span className="h-3 w-px bg-border my-0.5" />
                                    <span>{session.end_time.slice(0, 5)}</span>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium leading-none">{session.subject_name}</p>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {session.type === 'theory' ? 'Theory' : 'Lab'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {session.subject_code}
                                        </span>
                                        {session.slot_code && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Slot {session.slot_code}
                                            </span>
                                        )}
                                        {isNext && minutesUntil > 0 && (
                                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                in {minutesUntil} min
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Card>
    );
}
