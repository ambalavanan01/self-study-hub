import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface TimerProps {
    onSessionComplete: () => void;
}

const TIMER_SETTINGS_KEY = 'study_timer_settings';


export function Timer({ onSessionComplete }: TimerProps) {
    const { user } = useAuth();
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
    const [showSettings, setShowSettings] = useState(false);
    const timerRef = useRef<number | null>(null);

    // Load custom settings from localStorage or use defaults
    const [customSettings, setCustomSettings] = useState(() => {
        const stored = localStorage.getItem(TIMER_SETTINGS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            focus: 25,
            short: 5,
            long: 15,
        };
    });

    const MODES = {
        focus: { label: 'Focus', minutes: customSettings.focus, icon: Brain },
        short: { label: 'Short Break', minutes: customSettings.short, icon: Coffee },
        long: { label: 'Long Break', minutes: customSettings.long, icon: Coffee },
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
                        duration: MODES[mode].minutes,
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

    const handleSaveSettings = () => {
        localStorage.setItem(TIMER_SETTINGS_KEY, JSON.stringify(customSettings));
        setShowSettings(false);
        // Reset timer to new duration if not active
        if (!isActive) {
            setTimeLeft(MODES[mode].minutes * 60);
        }
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
                <Button size="lg" variant="outline" onClick={() => setShowSettings(!showSettings)}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
            </div>

            {showSettings && (
                <div className="w-full space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold">Timer Settings</h3>
                    <p className="text-sm text-muted-foreground mb-4">Customize your timer durations (in minutes)</p>
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Brain className="h-4 w-4" /> Focus Duration
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="120"
                                value={customSettings.focus}
                                onChange={(e) => setCustomSettings({ ...customSettings, focus: parseInt(e.target.value) || 1 })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Coffee className="h-4 w-4" /> Short Break Duration
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={customSettings.short}
                                onChange={(e) => setCustomSettings({ ...customSettings, short: parseInt(e.target.value) || 1 })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Coffee className="h-4 w-4" /> Long Break Duration
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={customSettings.long}
                                onChange={(e) => setCustomSettings({ ...customSettings, long: parseInt(e.target.value) || 1 })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSaveSettings} className="w-full">Save Settings</Button>
                </div>
            )}
        </Card>
    );
}
