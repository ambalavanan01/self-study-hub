import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface TimerProps {
    onSessionComplete: () => void;
}

export function Timer({ onSessionComplete }: TimerProps) {
    const { user } = useAuth();
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
    const timerRef = useRef<number | null>(null);

    const MODES = {
        focus: { label: 'Focus', minutes: 25, icon: Brain },
        short: { label: 'Short Break', minutes: 5, icon: Coffee },
        long: { label: 'Long Break', minutes: 15, icon: Coffee },
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const handleComplete = async () => {
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);

        // Play sound or notification here

        if (mode === 'focus' && user) {
            try {
                await supabase.from('study_sessions').insert([
                    {
                        user_id: user.id,
                        duration: 25,
                        completed_at: new Date().toISOString(),
                    },
                ]);
                onSessionComplete();
            } catch (error) {
                console.error('Error logging session:', error);
            }
        }

        alert(`${MODES[mode].label} session completed!`);
        resetTimer();
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode].minutes * 60);
    };

    const changeMode = (newMode: 'focus' | 'short' | 'long') => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(MODES[newMode].minutes * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const CurrentIcon = MODES[mode].icon;

    return (
        <Card className="p-8 flex flex-col items-center gap-8 max-w-md mx-auto">
            <div className="flex gap-2 p-1 bg-secondary rounded-lg">
                {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => (
                    <button
                        key={m}
                        onClick={() => changeMode(m)}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                            mode === m
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {MODES[m].label}
                    </button>
                ))}
            </div>

            <div className="relative flex items-center justify-center w-64 h-64 rounded-full border-8 border-primary/20">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <CurrentIcon className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="text-6xl font-bold tabular-nums tracking-tight">
                            {formatTime(timeLeft)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 font-medium uppercase tracking-widest">
                            {isActive ? 'Running' : 'Paused'}
                        </p>
                    </div>
                </div>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-primary transition-all duration-1000"
                        strokeDasharray={289}
                        strokeDashoffset={289 - (289 * timeLeft) / (MODES[mode].minutes * 60)}
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div className="flex gap-4">
                <Button
                    size="lg"
                    className="w-32"
                    onClick={toggleTimer}
                    variant={isActive ? "secondary" : "primary"}
                >
                    {isActive ? (
                        <>
                            <Pause className="mr-2 h-4 w-4" /> Pause
                        </>
                    ) : (
                        <>
                            <Play className="mr-2 h-4 w-4" /> Start
                        </>
                    )}
                </Button>
                <Button size="lg" variant="outline" onClick={resetTimer}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
            </div>
        </Card>
    );
}
