export interface TimeBlock {
    day: string;
    startTime: string;
    endTime: string;
}

export interface ParsedEntry {
    subject_name: string;
    subject_code: string;
    type: 'theory' | 'lab';
    slot_code: string; // The specific slot (e.g., "A1")
    slot_label: string; // The user input (e.g., "A1+TA1")
    room_number: string;
    credit: number;
    day: string;
    start_time: string;
    end_time: string;
}

// Master Slot Mapping based on VIT FFCS
// Format: "SLOT": [{ day: "Day", startTime: "HH:MM", endTime: "HH:MM" }]
const SLOT_MAPPING: Record<string, TimeBlock[]> = {
    // --- Theory Slots ---
    'A1': [
        { day: 'Monday', startTime: '08:00', endTime: '08:50' },
        { day: 'Wednesday', startTime: '09:00', endTime: '09:50' }
    ],
    'A2': [
        { day: 'Monday', startTime: '14:00', endTime: '14:50' },
        { day: 'Wednesday', startTime: '15:00', endTime: '15:50' }
    ],
    'B1': [
        { day: 'Tuesday', startTime: '08:00', endTime: '08:50' },
        { day: 'Thursday', startTime: '09:00', endTime: '09:50' }
    ],
    'B2': [
        { day: 'Tuesday', startTime: '14:00', endTime: '14:50' },
        { day: 'Thursday', startTime: '15:00', endTime: '15:50' }
    ],
    'C1': [
        { day: 'Wednesday', startTime: '08:00', endTime: '08:50' },
        { day: 'Friday', startTime: '09:00', endTime: '09:50' }
    ],
    'C2': [
        { day: 'Wednesday', startTime: '14:00', endTime: '14:50' },
        { day: 'Friday', startTime: '15:00', endTime: '15:50' }
    ],
    'D1': [
        { day: 'Thursday', startTime: '08:00', endTime: '08:50' },
        { day: 'Monday', startTime: '10:00', endTime: '10:50' }
    ],
    'D2': [
        { day: 'Thursday', startTime: '14:00', endTime: '14:50' },
        { day: 'Monday', startTime: '16:00', endTime: '16:50' }
    ],
    'E1': [
        { day: 'Friday', startTime: '08:00', endTime: '08:50' },
        { day: 'Tuesday', startTime: '10:00', endTime: '10:50' }
    ],
    'E2': [
        { day: 'Friday', startTime: '14:00', endTime: '14:50' },
        { day: 'Tuesday', startTime: '16:00', endTime: '16:50' }
    ],
    'F1': [
        { day: 'Monday', startTime: '09:00', endTime: '09:50' },
        { day: 'Wednesday', startTime: '10:00', endTime: '10:50' }
    ],
    'F2': [
        { day: 'Monday', startTime: '15:00', endTime: '15:50' },
        { day: 'Wednesday', startTime: '16:00', endTime: '16:50' }
    ],
    'G1': [
        { day: 'Tuesday', startTime: '09:00', endTime: '09:50' },
        { day: 'Thursday', startTime: '10:00', endTime: '10:50' }
    ],
    'G2': [
        { day: 'Tuesday', startTime: '15:00', endTime: '15:50' },
        { day: 'Thursday', startTime: '16:00', endTime: '16:50' }
    ],

    // --- Tutorial/Extra Theory Slots ---
    'TA1': [{ day: 'Friday', startTime: '10:00', endTime: '10:50' }],
    'TA2': [{ day: 'Friday', startTime: '16:00', endTime: '16:50' }],
    'TB1': [{ day: 'Monday', startTime: '11:00', endTime: '11:50' }],
    'TB2': [{ day: 'Monday', startTime: '17:00', endTime: '17:50' }],
    'TC1': [{ day: 'Tuesday', startTime: '11:00', endTime: '11:50' }],
    'TC2': [{ day: 'Tuesday', startTime: '17:00', endTime: '17:50' }],
    'TD1': [{ day: 'Friday', startTime: '12:00', endTime: '12:50' }],
    'TD2': [{ day: 'Wednesday', startTime: '17:00', endTime: '17:50' }],
    'TE1': [{ day: 'Thursday', startTime: '11:00', endTime: '11:50' }],
    'TE2': [
        { day: 'Thursday', startTime: '17:00', endTime: '17:50' },
        { day: 'Friday', startTime: '17:00', endTime: '17:50' }
    ],
    'TF1': [{ day: 'Friday', startTime: '11:00', endTime: '11:50' }],
    // TF2 is usually Fri 17:00, but mapped to TE2 as per user request. 
    // Keeping TF2 as alias just in case.
    'TF2': [{ day: 'Friday', startTime: '17:00', endTime: '17:50' }],
    'TG1': [{ day: 'Monday', startTime: '12:00', endTime: '12:50' }],
    'TG2': [{ day: 'Monday', startTime: '18:00', endTime: '18:50' }],

    // --- New Slots from User Request ---
    'TAA1': [{ day: 'Tuesday', startTime: '12:00', endTime: '12:50' }],
    'TAA2': [{ day: 'Tuesday', startTime: '18:00', endTime: '18:50' }],
    'V1': [{ day: 'Wednesday', startTime: '11:00', endTime: '11:50' }],
    'V2': [{ day: 'Wednesday', startTime: '12:00', endTime: '12:50' }],
    'TBB2': [{ day: 'Wednesday', startTime: '18:00', endTime: '18:50' }],
    'TCC1': [{ day: 'Thursday', startTime: '12:00', endTime: '12:50' }],
    'TCC2': [{ day: 'Thursday', startTime: '18:00', endTime: '18:50' }],
    'TDD2': [{ day: 'Friday', startTime: '18:00', endTime: '18:50' }],

    // --- Lab Slots (L1 to L60) ---
    // Morning Labs (08:00 - 13:20 approx, broken into hours)
    'L1': [{ day: 'Monday', startTime: '08:00', endTime: '08:50' }],
    'L2': [{ day: 'Monday', startTime: '08:51', endTime: '09:40' }],
    'L3': [{ day: 'Monday', startTime: '09:51', endTime: '10:40' }],
    'L4': [{ day: 'Monday', startTime: '10:41', endTime: '11:30' }],
    'L5': [{ day: 'Monday', startTime: '11:40', endTime: '12:30' }],
    'L6': [{ day: 'Monday', startTime: '12:31', endTime: '13:20' }],

    'L7': [{ day: 'Tuesday', startTime: '08:00', endTime: '08:50' }],
    'L8': [{ day: 'Tuesday', startTime: '08:51', endTime: '09:40' }],
    'L9': [{ day: 'Tuesday', startTime: '09:51', endTime: '10:40' }],
    'L10': [{ day: 'Tuesday', startTime: '10:41', endTime: '11:30' }],
    'L11': [{ day: 'Tuesday', startTime: '11:40', endTime: '12:30' }],
    'L12': [{ day: 'Tuesday', startTime: '12:31', endTime: '13:20' }],

    'L13': [{ day: 'Wednesday', startTime: '08:00', endTime: '08:50' }],
    'L14': [{ day: 'Wednesday', startTime: '08:51', endTime: '09:40' }],
    'L15': [{ day: 'Wednesday', startTime: '09:51', endTime: '10:40' }],
    'L16': [{ day: 'Wednesday', startTime: '10:41', endTime: '11:30' }],
    'L17': [{ day: 'Wednesday', startTime: '11:40', endTime: '12:30' }],
    'L18': [{ day: 'Wednesday', startTime: '12:31', endTime: '13:20' }],

    'L19': [{ day: 'Thursday', startTime: '08:00', endTime: '08:50' }],
    'L20': [{ day: 'Thursday', startTime: '08:51', endTime: '09:40' }],
    'L21': [{ day: 'Thursday', startTime: '09:51', endTime: '10:40' }],
    'L22': [{ day: 'Thursday', startTime: '10:41', endTime: '11:30' }],
    'L23': [{ day: 'Thursday', startTime: '11:40', endTime: '12:30' }],
    'L24': [{ day: 'Thursday', startTime: '12:31', endTime: '13:20' }],

    'L25': [{ day: 'Friday', startTime: '08:00', endTime: '08:50' }],
    'L26': [{ day: 'Friday', startTime: '08:51', endTime: '09:40' }],
    'L27': [{ day: 'Friday', startTime: '09:51', endTime: '10:40' }],
    'L28': [{ day: 'Friday', startTime: '10:41', endTime: '11:30' }],
    'L29': [{ day: 'Friday', startTime: '11:40', endTime: '12:30' }],
    'L30': [{ day: 'Friday', startTime: '12:31', endTime: '13:20' }],

    // Afternoon Labs (14:00 - 19:20 approx)
    'L31': [{ day: 'Monday', startTime: '14:00', endTime: '14:50' }],
    'L32': [{ day: 'Monday', startTime: '14:51', endTime: '15:40' }],
    'L33': [{ day: 'Monday', startTime: '15:51', endTime: '16:40' }],
    'L34': [{ day: 'Monday', startTime: '16:41', endTime: '17:30' }],
    'L35': [{ day: 'Monday', startTime: '17:40', endTime: '18:30' }],
    'L36': [{ day: 'Monday', startTime: '18:31', endTime: '19:20' }],

    'L37': [{ day: 'Tuesday', startTime: '14:00', endTime: '14:50' }],
    'L38': [{ day: 'Tuesday', startTime: '14:51', endTime: '15:40' }],
    'L39': [{ day: 'Tuesday', startTime: '15:51', endTime: '16:40' }],
    'L40': [{ day: 'Tuesday', startTime: '16:41', endTime: '17:30' }],
    'L41': [{ day: 'Tuesday', startTime: '17:40', endTime: '18:30' }],
    'L42': [{ day: 'Tuesday', startTime: '18:31', endTime: '19:20' }],

    'L43': [{ day: 'Wednesday', startTime: '14:00', endTime: '14:50' }],
    'L44': [{ day: 'Wednesday', startTime: '14:51', endTime: '15:40' }],
    'L45': [{ day: 'Wednesday', startTime: '15:51', endTime: '16:40' }],
    'L46': [{ day: 'Wednesday', startTime: '16:41', endTime: '17:30' }],
    'L47': [{ day: 'Wednesday', startTime: '17:40', endTime: '18:30' }],
    'L48': [{ day: 'Wednesday', startTime: '18:31', endTime: '19:20' }],

    'L49': [{ day: 'Thursday', startTime: '14:00', endTime: '14:50' }],
    'L50': [{ day: 'Thursday', startTime: '14:51', endTime: '15:40' }],
    'L51': [{ day: 'Thursday', startTime: '15:51', endTime: '16:40' }],
    'L52': [{ day: 'Thursday', startTime: '16:41', endTime: '17:30' }],
    'L53': [{ day: 'Thursday', startTime: '17:40', endTime: '18:30' }],
    'L54': [{ day: 'Thursday', startTime: '18:31', endTime: '19:20' }],

    'L55': [{ day: 'Friday', startTime: '14:00', endTime: '14:50' }],
    'L56': [{ day: 'Friday', startTime: '14:51', endTime: '15:40' }],
    'L57': [{ day: 'Friday', startTime: '15:51', endTime: '16:40' }],
    'L58': [{ day: 'Friday', startTime: '16:41', endTime: '17:30' }],
    'L59': [{ day: 'Friday', startTime: '17:40', endTime: '18:30' }],
    'L60': [{ day: 'Friday', startTime: '18:31', endTime: '19:20' }],
};

export interface CourseInput {
    subject_name: string;
    subject_code: string;
    type: 'theory' | 'lab';
    slot: string;
    room_number: string;
    credit: number;
}

export function parseCourseEntries(inputs: CourseInput[]): { entries: ParsedEntry[], errors: string[] } {
    const entries: ParsedEntry[] = [];
    const errors: string[] = [];

    inputs.forEach((input) => {
        // Split slots by '+' (e.g., "A1+TA1" -> ["A1", "TA1"])
        const slots = input.slot.toUpperCase().split('+').map(s => s.trim());

        slots.forEach(slot => {
            const timeBlocks = SLOT_MAPPING[slot];

            if (!timeBlocks) {
                errors.push(`Invalid slot "${slot}" for subject "${input.subject_name}"`);
                return;
            }

            timeBlocks.forEach(block => {
                entries.push({
                    subject_name: input.subject_name,
                    subject_code: input.subject_code,
                    type: input.type,
                    slot_code: slot,
                    slot_label: input.slot,
                    room_number: input.room_number,
                    credit: input.credit,
                    day: block.day,
                    start_time: block.startTime,
                    end_time: block.endTime
                });
            });
        });
    });

    return { entries, errors };
}
