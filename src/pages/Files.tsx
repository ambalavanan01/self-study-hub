import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { FileUpload } from '../components/files/FileUpload';
import { FileList } from '../components/files/FileList';

export function Files() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState<any[]>([]);

    const fetchFiles = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('files')
                .select('*')
                .order('uploaded_at', { ascending: false });

            if (error) throw error;
            setFiles(data || []);
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [user]);

    if (loading) return <div className="p-8 text-center">Loading files...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Files</h1>
                <p className="text-muted-foreground">
                    Manage your study materials and documents.
                </p>
            </div>

            <FileUpload onUploadComplete={fetchFiles} />

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your Files</h2>
                <FileList files={files} onDelete={fetchFiles} />
            </div>
        </div>
    );
}
