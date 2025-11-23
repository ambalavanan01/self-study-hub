import { AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export function ConfigurationError() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Configuration Required</h1>
                    <p className="text-muted-foreground">
                        StudyTrack needs to be configured before you can use it.
                    </p>
                </div>

                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-left space-y-3">
                    <h2 className="font-semibold text-sm">Missing Configuration:</h2>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                        {!supabaseUrl && (
                            <li className="flex items-center gap-2">
                                <span className="text-destructive">✗</span>
                                VITE_SUPABASE_URL
                            </li>
                        )}
                        {!supabaseKey && (
                            <li className="flex items-center gap-2">
                                <span className="text-destructive">✗</span>
                                VITE_SUPABASE_ANON_KEY
                            </li>
                        )}
                    </ul>
                </div>

                <div className="rounded-lg border bg-card p-4 text-left space-y-3">
                    <h3 className="font-semibold text-sm">Setup Instructions:</h3>
                    <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
                        <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener" className="text-primary hover:underline">supabase.com</a></li>
                        <li>Copy your project URL and anon key from Settings → API</li>
                        <li>Add them as environment variables:
                            <ul className="ml-6 mt-1 space-y-1 text-xs font-mono">
                                <li>VITE_SUPABASE_URL</li>
                                <li>VITE_SUPABASE_ANON_KEY</li>
                            </ul>
                        </li>
                        <li>Restart the development server</li>
                    </ol>
                </div>

                <div className="space-y-2">
                    <a
                        href="https://github.com/ambalavanan01/self-study-hub/blob/main/DEPLOYMENT.md"
                        target="_blank"
                        rel="noopener"
                    >
                        <Button className="w-full">
                            View Deployment Guide
                        </Button>
                    </a>
                    <a
                        href="https://github.com/ambalavanan01/self-study-hub/blob/main/SUPABASE_SETUP.md"
                        target="_blank"
                        rel="noopener"
                    >
                        <Button variant="outline" className="w-full">
                            Supabase Setup Guide
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
}
