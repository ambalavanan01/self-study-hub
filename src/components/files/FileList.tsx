import { File as FileIcon, Trash2, Download, Link as LinkIcon } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/card';

interface FileItem {
    id: string;
    file_name: string;
    size_bytes: number;
    file_type: string;
    file_url: string;
    uploaded_at: string;
}

interface FileListProps {
    files: FileItem[];
    onDelete: () => void;
}

export function FileList({ files, onDelete }: FileListProps) {
    const { showNotification } = useNotification();

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getPathFromUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/public/files/');
            if (pathParts.length > 1) {
                return decodeURIComponent(pathParts[1]);
            }
            return '';
        } catch (e) {
            console.error('Error parsing URL:', e);
            return '';
        }
    };

    const handleDelete = async (file: FileItem) => {
        if (!confirm(`Are you sure you want to delete "${file.file_name}"?`)) return;

        try {
            const filePath = getPathFromUrl(file.file_url);
            if (filePath) {
                // Delete from Storage
                const { error: storageError } = await supabase.storage
                    .from('files')
                    .remove([filePath]);

                if (storageError) {
                    console.error('Storage delete error:', storageError);
                    // Continue to delete from DB even if storage fails (orphan cleanup)
                }
            }

            // Delete from Database
            const { error: dbError } = await supabase
                .from('files')
                .delete()
                .eq('id', file.id);

            if (dbError) throw dbError;

            showNotification('File deleted successfully', 'success');
            onDelete();
        } catch (error) {
            console.error('Error deleting file:', error);
            showNotification('Error deleting file', 'error');
        }
    };

    const handleShare = async (file: FileItem) => {
        try {
            await navigator.clipboard.writeText(file.file_url);
            showNotification('Link copied to clipboard', 'success');
        } catch (err) {
            console.error('Failed to copy:', err);
            showNotification('Failed to copy link', 'error');
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
                        <h3 className="font-medium truncate" title={file.file_name}>
                            {file.file_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {formatSize(file.size_bytes)} • {new Date(file.uploaded_at).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleShare(file)}
                            title="Copy Link"
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                        <a href={file.file_url} target="_blank" rel="noreferrer" download>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download">
                                <Download className="h-4 w-4" />
                            </Button>
                        </a>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(file)}
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}
