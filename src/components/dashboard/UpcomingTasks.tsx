
import { Card } from '../ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Task {
    id: string;
    title: string;
    due_date: string;
    status: 'todo' | 'in-progress' | 'done';
    subject_code?: string;
}

interface UpcomingTasksProps {
    tasks: Task[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
    return (
        <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Upcoming Deadlines</h3>
            <div className="space-y-4">
                {tasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No upcoming tasks</p>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3">
                            {task.status === 'done' ? (
                                <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                            ) : (
                                <Circle className="mt-0.5 h-5 w-5 text-muted-foreground" />
                            )}
                            <div className="flex-1 space-y-1">
                                <p className={cn("text-sm font-medium leading-none", task.status === 'done' && "line-through text-muted-foreground")}>
                                    {task.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {task.subject_code && (
                                        <span className="rounded bg-secondary px-1.5 py-0.5">
                                            {task.subject_code}
                                        </span>
                                    )}
                                    <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
