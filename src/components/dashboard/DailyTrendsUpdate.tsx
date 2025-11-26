import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { getFutureTrends } from '../../lib/ai';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Loader2, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function DailyTrendsUpdate() {
    const { user } = useAuth();
    const [trends, setTrends] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentTime = hours + minutes / 60;

            // 7:30 AM is 7.5, 7:30 PM is 19.5
            if (currentTime >= 7.5 && currentTime <= 19.5) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isVisible && user && !trends) {
            fetchTrends();
        }
    }, [isVisible, user]);

    const fetchTrends = async () => {
        setLoading(true);
        try {
            // Get interests
            const { data: interestData } = await supabase
                .from('user_interests')
                .select('interest')
                .eq('user_id', user?.id);

            const interests = interestData?.map(i => i.interest) || [];

            if (interests.length > 0) {
                const result = await getFutureTrends(interests);
                setTrends(result);
            }
        } catch (error) {
            console.error('Error fetching daily trends:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <Card className="p-6 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Daily Future Trends Update</h3>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">Curating your daily briefing...</span>
                </div>
            ) : trends ? (
                <div className="prose dark:prose-invert max-w-none text-sm">
                    <ReactMarkdown>{trends}</ReactMarkdown>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    Add interests in the AI page to see daily updates here.
                </p>
            )}
        </Card>
    );
}
