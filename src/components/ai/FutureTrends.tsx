import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { getFutureTrends } from '../../lib/ai';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Loader2, TrendingUp, Plus, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function FutureTrends() {
    const { user } = useAuth();
    const [interests, setInterests] = useState<string[]>([]);
    const [newInterest, setNewInterest] = useState('');
    const [trends, setTrends] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchingInterests, setFetchingInterests] = useState(true);

    useEffect(() => {
        if (user) {
            fetchInterests();
        }
    }, [user]);

    const fetchInterests = async () => {
        try {
            const { data, error } = await supabase
                .from('user_interests')
                .select('interest')
                .eq('user_id', user?.id);

            if (error) throw error;
            setInterests(data.map(i => i.interest));
        } catch (error) {
            console.error('Error fetching interests:', error);
        } finally {
            setFetchingInterests(false);
        }
    };

    const addInterest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newInterest.trim() || !user) return;

        try {
            const { error } = await supabase
                .from('user_interests')
                .insert({ user_id: user.id, interest: newInterest.trim() });

            if (error) throw error;

            setInterests([...interests, newInterest.trim()]);
            setNewInterest('');
        } catch (error) {
            console.error('Error adding interest:', error);
        }
    };

    const removeInterest = async (interest: string) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('user_interests')
                .delete()
                .eq('user_id', user.id)
                .eq('interest', interest);

            if (error) throw error;
            setInterests(interests.filter(i => i !== interest));
        } catch (error) {
            console.error('Error removing interest:', error);
        }
    };

    const handleGetTrends = async () => {
        setLoading(true);
        try {
            const result = await getFutureTrends(interests);
            setTrends(result);
        } catch (error) {
            console.error(error);
            setTrends("Failed to fetch trends. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Future Trends & Interests
                </h2>

                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {fetchingInterests ? (
                            <span className="text-sm text-muted-foreground">Loading interests...</span>
                        ) : interests.length === 0 ? (
                            <span className="text-sm text-muted-foreground">No interests added yet.</span>
                        ) : (
                            interests.map((interest, idx) => (
                                <Badge key={idx} variant="secondary" className="px-3 py-1">
                                    {interest}
                                    <button
                                        onClick={() => removeInterest(interest)}
                                        className="ml-2 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))
                        )}
                    </div>

                    <form onSubmit={addInterest} className="flex gap-2">
                        <Input
                            placeholder="Add an interest (e.g., AI, Blockchain, Renewable Energy)"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                        />
                        <Button type="submit" size="icon" disabled={!newInterest.trim()}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </form>

                    <Button
                        onClick={handleGetTrends}
                        className="w-full mt-4"
                        disabled={loading || interests.length === 0}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Fetching Daily Trends...
                            </>
                        ) : (
                            'Get Latest Trends Update'
                        )}
                    </Button>
                </div>
            </Card>

            {trends && (
                <Card className="p-6">
                    <h3 className="font-semibold mb-4 text-lg">Daily Briefing</h3>
                    <div className="prose dark:prose-invert max-w-none text-sm">
                        <ReactMarkdown>{trends}</ReactMarkdown>
                    </div>
                </Card>
            )}
        </div>
    );
}
