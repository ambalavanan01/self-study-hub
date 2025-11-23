export type Grade = 'S' | 'A' | 'B' | 'C' | 'D' | 'E';

export const GRADE_POINTS: Record<Grade, number> = {
    S: 10,
    A: 9,
    B: 8,
    C: 7,
    D: 6,
    E: 5,
};

export interface Subject {
    id: string;
    subject_name: string;
    subject_code: string;
    grade: Grade;
    credit: number;
}

export interface Semester {
    id: string;
    year: number;
    term: 'Fall' | 'Winter';
    subjects: Subject[];
}

export function calculateGPA(subjects: Subject[]): number {
    if (!subjects || subjects.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach((subject) => {
        const points = GRADE_POINTS[subject.grade];
        if (points !== undefined) {
            totalPoints += points * subject.credit;
            totalCredits += subject.credit;
        }
    });

    if (totalCredits === 0) return 0;
    return Number((totalPoints / totalCredits).toFixed(2));
}

export function calculateCGPA(semesters: Semester[]): number {
    if (!semesters || semesters.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    semesters.forEach((semester) => {
        semester.subjects.forEach((subject) => {
            const points = GRADE_POINTS[subject.grade];
            if (points !== undefined) {
                totalPoints += points * subject.credit;
                totalCredits += subject.credit;
            }
        });
    });

    if (totalCredits === 0) return 0;
    return Number((totalPoints / totalCredits).toFixed(2));
}
