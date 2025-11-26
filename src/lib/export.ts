import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from './supabase';

// --- Helper Types ---
interface ExportOptions {
    format: 'json' | 'pdf';
    userId: string;
}

// --- Export Functions ---

export async function exportCGPA({ format, userId }: ExportOptions) {
    const { data: semesters, error } = await supabase
        .from('semesters')
        .select('*, subjects(*)')
        .eq('user_id', userId)
        .order('year', { ascending: false })
        .order('term', { ascending: false });

    if (error) throw error;

    if (format === 'json') {
        downloadJSON(semesters, 'cgpa_data.json');
    } else {
        const doc = new jsPDF();
        doc.text('CGPA Report', 14, 15);

        let yPos = 25;

        semesters?.forEach((sem: any) => {
            // Calculate GPA for the semester
            let totalPoints = 0;
            let totalCredits = 0;
            const gradePoints: Record<string, number> = { 'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5 };

            sem.subjects.forEach((sub: any) => {
                const points = gradePoints[sub.grade];
                if (points !== undefined) {
                    totalPoints += points * sub.credit;
                    totalCredits += sub.credit;
                }
            });
            const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

            doc.text(`${sem.term} ${sem.year} (GPA: ${gpa})`, 14, yPos);
            yPos += 5;

            const tableData = sem.subjects.map((sub: any) => [
                sub.subject_name,
                sub.subject_code,
                sub.credit,
                sub.grade
            ]);

            autoTable(doc, {
                startY: yPos,
                head: [['Subject', 'Code', 'Credit', 'Grade']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [66, 66, 66] },
            });

            yPos = (doc as any).lastAutoTable.finalY + 15;
        });

        doc.save('cgpa_report.pdf');
    }
}

export async function exportTimetable({ format, userId }: ExportOptions) {
    const { data: entries, error } = await supabase
        .from('timetable_entries')
        .select('*')
        .eq('user_id', userId)
        .order('day');

    if (error) throw error;

    if (format === 'json') {
        downloadJSON(entries, 'timetable_data.json');
    } else {
        const doc = new jsPDF();
        doc.text('Timetable', 14, 15);

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const tableData: any[] = [];

        days.forEach(day => {
            const dayEntries = entries?.filter((e: any) => e.day === day) || [];
            if (dayEntries.length > 0) {
                dayEntries.forEach((e: any) => {
                    tableData.push([
                        day,
                        `${e.start_time.slice(0, 5)} - ${e.end_time.slice(0, 5)}`,
                        e.subject_name,
                        e.subject_code,
                        e.type,
                        e.room_number || '-'
                    ]);
                });
            }
        });

        autoTable(doc, {
            startY: 25,
            head: [['Day', 'Time', 'Subject', 'Code', 'Type', 'Room']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66] },
        });

        doc.save('timetable.pdf');
    }
}

export async function exportFiles({ format, userId }: ExportOptions) {
    const { data: files, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

    if (error) throw error;

    if (format === 'json') {
        downloadJSON(files, 'files_metadata.json');
    } else {
        const doc = new jsPDF();
        doc.text('Files Report', 14, 15);

        const tableData = files?.map((f: any) => [
            f.file_name,
            (f.size_bytes / 1024 / 1024).toFixed(2) + ' MB',
            f.file_type,
            new Date(f.uploaded_at).toLocaleDateString()
        ]);

        autoTable(doc, {
            startY: 25,
            head: [['Name', 'Size', 'Type', 'Uploaded Date']],
            body: tableData || [],
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66] },
        });

        doc.save('files_report.pdf');
    }
}

// --- Helper Functions ---

function downloadJSON(data: any, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
