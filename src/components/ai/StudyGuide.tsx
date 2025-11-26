import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { getStudyGuide } from '../../lib/ai';
import { Loader2, BookOpen, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function StudyGuide() {
    const [topic, setTopic] = useState('');
    const [guide, setGuide] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        try {
            const result = await getStudyGuide(topic);
            setGuide(result);
        } catch (error) {
            console.error(error);
            setGuide("Failed to generate study guide. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    AI Study Guide Generator
                </h2>
                <form onSubmit={handleGenerate} className="flex gap-2">
                    <Input
                        placeholder="Enter a topic or concept (e.g., 'Quantum Physics', 'React Hooks')"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={loading}
                    />
                    <Button type="submit" disabled={loading || !topic.trim()}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        <span className="ml-2 hidden sm:inline">Generate</span>
                    </Button>
                </form>
            </Card>

            {guide && (
                <Card className="p-6">
                    <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{guide}</ReactMarkdown>
                    </div>
                </Card>
            )}
        </div>
    );
}
