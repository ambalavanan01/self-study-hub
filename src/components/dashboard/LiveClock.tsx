import { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="h-4 w-4" />
            <div className="flex flex-col">
                <span className="font-medium">{format(currentTime, 'EEEE')}</span>
                <span className="text-xs">{format(currentTime, 'h:mm:ss a')}</span>
            </div>
        </div>
    );
}
