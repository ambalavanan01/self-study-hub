import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function LiveClock() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-end">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{format(currentTime, 'h:mm a')}</h2>
            <p className="text-xs font-medium text-muted-foreground">{format(currentTime, 'EEE, MMMM d')}</p>
        </div>
    );
}
