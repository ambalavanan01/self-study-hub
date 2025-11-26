import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { calculateCGPA, calculateGPA, type Semester } from '../lib/cgpa';
import { Button } from '../components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { AddSemesterModal } from '../components/cgpa/AddSemesterModal';
import { AddSubjectModal } from '../components/cgpa/AddSubjectModal';
import { Card } from '../components/ui/card';

export function CGPA() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [isAddSemesterOpen, setIsAddSemesterOpen] = useState(false);
    const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
    const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);

    const fetchSemesters = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('semesters')
                .select('*, subjects(*)')
                .order('year', { ascending: false })
                .order('term', { ascending: false });

            if (error) throw error;
            setSemesters(data || []);
        } catch (error) {
            console.error('Error fetching semesters:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSemesters();
    }, [user]);

    const handleDeleteSubject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subject?')) return;
        try {
            await supabase.from('subjects').delete().eq('id', id);
            fetchSemesters();
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    const handleDeleteSemester = async (id: string) => {
        if (!confirm('Are you sure you want to delete this semester? All subjects will be deleted.')) return;
        try {
            await supabase.from('semesters').delete().eq('id', id);
            fetchSemesters();
        } catch (error) {
            console.error('Error deleting semester:', error);
        }
    };

    const cgpa = calculateCGPA(semesters);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">CGPA Manager</h1>
                    <p className="text-muted-foreground">
                        Current CGPA: <span className="font-bold text-primary text-xl">{cgpa.toFixed(2)}</span>
                    </p>
                </div>
                <Button onClick={() => setIsAddSemesterOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Semester
                </Button>
            </div>

            <div className="space-y-6">
                {semesters.map((semester) => {
                    const gpa = calculateGPA(semester.subjects);
                    return (
                        <Card key={semester.id} className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {semester.term} {semester.year}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        GPA: <span className="font-bold text-primary">{gpa.toFixed(2)}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedSemesterId(semester.id);
                                            setIsAddSubjectOpen(true);
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Subject
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => handleDeleteSemester(semester.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-md border overflow-x-auto">
                                <table className="w-full text-sm min-w-[600px]">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="p-3 text-left font-medium">Subject</th>
                                            <th className="p-3 text-left font-medium">Code</th>
                                            <th className="p-3 text-left font-medium">Credit</th>
                                            <th className="p-3 text-left font-medium">Grade</th>
                                            <th className="p-3 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {semester.subjects.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                    No subjects added yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            semester.subjects.map((subject) => (
                                                <tr key={subject.id} className="border-b last:border-0 hover:bg-muted/50">
                                                    <td className="p-3 font-medium">{subject.subject_name}</td>
                                                    <td className="p-3 text-muted-foreground">{subject.subject_code}</td>
                                                    <td className="p-3">{subject.credit}</td>
                                                    <td className="p-3">
                                                        <span className={`inline-flex items-center justify-center rounded px-2 py-1 font-medium text-xs ${subject.grade === 'S' || subject.grade === 'A'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-secondary text-secondary-foreground'
                                                            }`}>
                                                            {subject.grade}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                            onClick={() => handleDeleteSubject(subject.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <AddSemesterModal
                isOpen={isAddSemesterOpen}
                onClose={() => setIsAddSemesterOpen(false)}
                onSuccess={fetchSemesters}
            />

            {selectedSemesterId && (
                <AddSubjectModal
                    isOpen={isAddSubjectOpen}
                    onClose={() => {
                        setIsAddSubjectOpen(false);
                        setSelectedSemesterId(null);
                    }}
                    onSuccess={fetchSemesters}
                    semesterId={selectedSemesterId}
                />
            )}
        </div>
    );
}
