import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Plus, Trash2, Clock, MapPin } from 'lucide-react';
import { AddClassModal } from '../components/timetable/AddClassModal';
import { Card } from '../components/ui/card';
import { DAYS, type Day } from '../lib/time';

interface TimetableEntry {
    id: string;
    day: Day;
    type: 'theory' | 'lab';
    slot_code?: string;
    slot_label?: string;
    subject_name: string;
    subject_code: string;
    start_time: string;
    end_time: string;
}

export function Timetable() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [isAddClassOpen, setIsAddClassOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<Day>('Monday');

    const fetchTimetable = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('timetable_entries')
                .select('*')
                .order('start_time', { ascending: true });

            if (error) throw error;
            setEntries(data || []);
        } catch (error) {
            console.error('Error fetching timetable:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimetable();
    }, [user]);

    const handleDeleteEntry = async (id: string) => {
        if (!confirm('Are you sure you want to delete this class?')) return;
        try {
            await supabase.from('timetable_entries').delete().eq('id', id);
            fetchTimetable();
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

    const filteredEntries = entries.filter(entry => entry.day === selectedDay);

    if (loading) return <div className="p-8 text-center">Loading timetable...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
                <Button onClick={() => setIsAddClassOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Class
                </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {DAYS.map((day) => (
                    <Button
                        key={day}
                        variant={selectedDay === day ? 'primary' : 'outline'}
                        onClick={() => setSelectedDay(day)}
                        className="whitespace-nowrap flex-shrink-0"
                    >
                        {day}
                    </Button>
                ))}
            </div>

            <div className="grid gap-4">
                {filteredEntries.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                        No classes scheduled for {selectedDay}
                    </div>
                ) : (
                    filteredEntries.map((entry) => (
                        <Card key={entry.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-accent/50 transition-colors">
                            <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center min-w-[100px] rounded bg-secondary p-2 text-sm font-bold w-full sm:w-auto">
                                <span>{entry.start_time.slice(0, 5)}</span>
                                <span className="hidden sm:block h-4 w-px bg-border my-1" />
                                <span className="sm:hidden">-</span>
                                <span>{entry.end_time.slice(0, 5)}</span>
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <h3 className="font-semibold text-lg leading-tight">{entry.subject_name}</h3>
                                    <span className={`text-xs font-medium px-2 py-1 rounded self-start sm:self-auto ${entry.type === 'theory'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                        }`}>
                                        {entry.type === 'theory' ? 'Theory' : 'Lab'}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {entry.subject_code}
                                    </span>
                                    {entry.slot_code && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            Slot {entry.slot_code}
                                        </span>
                                    )}
                                    {entry.slot_label && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            {entry.slot_label}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive self-end sm:self-center"
                                onClick={() => handleDeleteEntry(entry.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </Card>
                    ))
                )}
            </div>

            <AddClassModal
                isOpen={isAddClassOpen}
                onClose={() => setIsAddClassOpen(false)}
                onSuccess={fetchTimetable}
            />
        </div>
    );
}
