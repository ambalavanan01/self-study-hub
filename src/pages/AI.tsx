import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Semester } from '../lib/cgpa';
import { CGPAAnalysis } from '../components/ai/CGPAAnalysis';
import { StudyGuide } from '../components/ai/StudyGuide';
import { FutureTrends } from '../components/ai/FutureTrends';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Sparkles, BookOpen, TrendingUp } from 'lucide-react';

export function AI() {
    const { user } = useAuth();
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchSemesters();
        }
    }, [user]);

    const fetchSemesters = async () => {
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

    if (loading) return <div className="p-8 text-center">Loading AI Assistant...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                    AI Assistant
                </h1>
                <p className="text-muted-foreground mt-1">
                    Your intelligent companion for academic success and future planning.
                </p>
            </div>

            <Tabs defaultValue="cgpa" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="cgpa" className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Analysis
                    </TabsTrigger>
                    <TabsTrigger value="study" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Study Guide
                    </TabsTrigger>
                    <TabsTrigger value="trends" className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Trends
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="cgpa" className="space-y-4">
                    <div className="grid gap-4">
                        <CGPAAnalysis semesters={semesters} />
                    </div>
                </TabsContent>

                <TabsContent value="study" className="space-y-4">
                    <StudyGuide />
                </TabsContent>

                <TabsContent value="trends" className="space-y-4">
                    <FutureTrends />
                </TabsContent>
            </Tabs>
        </div>
    );
}
