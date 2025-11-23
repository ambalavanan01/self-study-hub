import { File as FileIcon, Trash2, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/card';

interface FileItem {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    path: string;
    created_at: string;
}

interface FileListProps {
    files: FileItem[];
    onDelete: () => void;
}

export function FileList({ files, onDelete }: FileListProps) {
    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDelete = async (file: FileItem) => {
        if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;

        try {
            // Delete from Storage
            const { error: storageError } = await supabase.storage
                .from('files')
                .remove([file.path]);

            if (storageError) throw storageError;

            // Delete from Database
            const { error: dbError } = await supabase
                .from('files')
                .delete()
                .eq('id', file.id);

            if (dbError) throw dbError;

            onDelete();
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Error deleting file.');
        }
    };

    if (files.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No files uploaded yet.
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
                <Card key={file.id} className="p-4 flex items-start gap-4 group hover:border-primary/50 transition-colors">
                    <div className="p-2 rounded bg-secondary">
                        <FileIcon className="h-8 w-8 text-secondary-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate" title={file.name}>
                            {file.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {formatSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={file.url} target="_blank" rel="noreferrer" download>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                            </Button>
                        </a>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(file)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}
