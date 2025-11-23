import { addMinutes, format, parse } from 'date-fns';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
export type Day = typeof DAYS[number];

export const THEORY_SLOTS = [
    'A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1',
    'A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2'
] as const;

export const LAB_SLOTS = ['Morning', 'Evening'] as const;

export const THEORY_DURATION = 90; // minutes
export const LAB_DURATION = 100; // minutes
export const BREAK_DURATION = 10; // minutes

export function calculateEndTime(startTime: string, type: 'theory' | 'lab'): string {
    if (!startTime) return '';

    const date = parse(startTime, 'HH:mm', new Date());
    const duration = type === 'theory' ? THEORY_DURATION : LAB_DURATION;
    const endDate = addMinutes(date, duration);

    return format(endDate, 'HH:mm');
}

export function validateTimeRange(startTime: string, endTime: string): boolean {
    if (!startTime || !endTime) return false;

    const start = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());

    // College hours: 08:00 to 19:30
    const minTime = parse('08:00', 'HH:mm', new Date());
    const maxTime = parse('19:30', 'HH:mm', new Date());

    return (
        start >= minTime &&
        end <= maxTime &&
        start < end
    );
}
