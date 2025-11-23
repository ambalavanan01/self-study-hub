
import { Card } from '../ui/card';
import { Clock, MapPin } from 'lucide-react';

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
    return (
        <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Today's Schedule</h3>
            <div className="space-y-4">
                {sessions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No classes today</p>
                ) : (
                    sessions.map((session) => (
                        <div
                            key={session.id}
                            className="relative flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                        >
                            <div className="flex flex-col items-center justify-center rounded bg-secondary px-2 py-1 text-xs font-bold">
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
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
