import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Plus, CheckCircle2, Circle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { Card } from '../components/ui/card';
import { cn } from '../lib/utils';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date: string;
}

const TASKS_STORAGE_KEY = 'study_app_tasks';

export function Tasks() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    const fetchTasks = () => {
        if (!user) return;
        try {
            const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
            if (storedTasks) {
                const allTasks = JSON.parse(storedTasks);
                // Filter tasks for current user
                const userTasks = allTasks.filter((task: Task & { userId: string }) => task.userId === user.id);
                // Sort by due date
                userTasks.sort((a: Task, b: Task) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
                setTasks(userTasks);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const handleStatusChange = (task: Task, newStatus: Task['status']) => {
        try {
            const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
            if (storedTasks) {
                const allTasks = JSON.parse(storedTasks);
                const updatedTasks = allTasks.map((t: Task) =>
                    t.id === task.id ? { ...t, status: newStatus } : t
                );
                localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
                fetchTasks();
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = (id: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
            if (storedTasks) {
                const allTasks = JSON.parse(storedTasks);
                const updatedTasks = allTasks.filter((t: Task) => t.id !== id);
                localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
                fetchTasks();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-500';
            case 'medium': return 'text-yellow-500';
            case 'low': return 'text-green-500';
            default: return 'text-muted-foreground';
        }
    };

    if (loading) return <div className="p-8 text-center">Loading tasks...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                <Button onClick={() => setIsAddTaskOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            </div>

            <div className="grid gap-4">
                {tasks.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                        No tasks found. Add a task to get started!
                    </div>
                ) : (
                    tasks.map((task) => (
                        <Card key={task.id} className="p-4 flex items-start gap-4 group hover:border-primary/50 transition-colors">
                            <button
                                onClick={() => handleStatusChange(task, task.status === 'completed' ? 'todo' : 'completed')}
                                className="mt-1"
                            >
                                {task.status === 'completed' ? (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                                )}
                            </button>

                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className={cn(
                                        "font-medium truncate",
                                        task.status === 'completed' && "line-through text-muted-foreground"
                                    )}>
                                        {task.title}
                                    </h3>
                                    <AlertCircle className={cn("h-4 w-4", getPriorityColor(task.priority))} />
                                </div>

                                {task.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {task.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Due: {new Date(task.due_date).toLocaleDateString()}
                                    </span>
                                    <span className="capitalize px-2 py-0.5 rounded-full bg-secondary">
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                onClick={() => handleDeleteTask(task.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </Card>
                    ))
                )}
            </div>

            <AddTaskModal
                isOpen={isAddTaskOpen}
                onClose={() => setIsAddTaskOpen(false)}
                onSuccess={fetchTasks}
            />
        </div>
    );
}
