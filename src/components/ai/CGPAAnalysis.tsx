import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { analyzeCGPA } from '../../lib/ai';
import { calculateCGPA, type Semester } from '../../lib/cgpa';
import { Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CGPAAnalysisProps {
    semesters: Semester[];
}

export function CGPAAnalysis({ semesters }: CGPAAnalysisProps) {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const currentCGPA = calculateCGPA(semesters);
            const result = await analyzeCGPA(semesters, currentCGPA);
            setAnalysis(result);
        } catch (error: any) {
            console.error(error);
            setAnalysis(error.message || "Failed to generate analysis. Please check your API key and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Performance Analysis
                </h2>
                <Button onClick={handleAnalyze} disabled={loading || semesters.length === 0}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        'Analyze My CGPA'
                    )}
                </Button>
            </div>

            {semesters.length === 0 && (
                <p className="text-muted-foreground text-sm">
                    Add semesters and subjects in the CGPA tab to enable analysis.
                </p>
            )}

            {analysis && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg prose dark:prose-invert max-w-none text-sm">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
            )}
        </Card>
    );
}
