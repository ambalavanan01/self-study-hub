import { supabase } from './supabase';

interface ImportOptions {
    file: File;
    userId: string;
}

export async function importCGPA({ file, userId }: ImportOptions): Promise<void> {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!Array.isArray(data)) throw new Error('Invalid data format');

    for (const semester of data) {
        // 1. Create Semester
        const { data: newSem, error: semError } = await supabase
            .from('semesters')
            .insert({
                user_id: userId,
                year: semester.year,
                term: semester.term
            })
            .select()
            .single();

        if (semError) throw semError;

        // 2. Create Subjects
        if (semester.subjects && semester.subjects.length > 0) {
            const subjectsToInsert = semester.subjects.map((sub: any) => ({
                user_id: userId,
                semester_id: newSem.id,
                subject_name: sub.subject_name,
                subject_code: sub.subject_code,
                credit: sub.credit,
                grade: sub.grade
            }));

            const { error: subError } = await supabase
                .from('subjects')
                .insert(subjectsToInsert);

            if (subError) throw subError;
        }
    }
}

export async function importTimetable({ file, userId }: ImportOptions): Promise<void> {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!Array.isArray(data)) throw new Error('Invalid data format');

    const entriesToInsert = data.map((entry: any) => ({
        user_id: userId,
        day: entry.day,
        start_time: entry.start_time,
        end_time: entry.end_time,
        subject_name: entry.subject_name,
        subject_code: entry.subject_code,
        type: entry.type,
        room_number: entry.room_number,
        slot_code: entry.slot_code,
        slot_label: entry.slot_label
    }));

    const { error } = await supabase
        .from('timetable_entries')
        .insert(entriesToInsert);

    if (error) throw error;
}

export async function importFiles({ file, userId }: ImportOptions): Promise<void> {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!Array.isArray(data)) throw new Error('Invalid data format');

    // Note: We can only import metadata, not the actual file content from JSON
    // This is useful for restoring a record of files, but the links might be broken
    // if the files aren't actually in the storage bucket.

    const filesToInsert = data.map((f: any) => ({
        user_id: userId,
        file_name: f.file_name,
        size_bytes: f.size_bytes,
        file_type: f.file_type,
        file_url: f.file_url // This might be invalid if not pointing to existing storage
    }));

    const { error } = await supabase
        .from('files')
        .insert(filesToInsert);

    if (error) throw error;
}
