import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { User, Lock, Download, Upload, FileJson, FileText } from 'lucide-react';
import { exportCGPA, exportTimetable, exportFiles } from '../lib/export';
import { importCGPA, importTimetable, importFiles } from '../lib/import';

export function Profile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = useState({
        name: user?.user_metadata?.name || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
    });

    // Refs for file inputs
    const cgpaInputRef = useRef<HTMLInputElement>(null);
    const timetableInputRef = useRef<HTMLInputElement>(null);
    const filesInputRef = useRef<HTMLInputElement>(null);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const updates: any = {
                data: { name: formData.name },
            };

            if (formData.password) {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                updates.password = formData.password;
            }

            const { error } = await supabase.auth.updateUser(updates);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type: 'cgpa' | 'timetable' | 'files', format: 'json' | 'pdf') => {
        if (!user) return;
        try {
            if (type === 'cgpa') await exportCGPA({ format, userId: user.id });
            if (type === 'timetable') await exportTimetable({ format, userId: user.id });
            if (type === 'files') await exportFiles({ format, userId: user.id });
            setMessage({ type: 'success', text: `${type.toUpperCase()} exported successfully` });
        } catch (error: any) {
            console.error(error);
            setMessage({ type: 'error', text: 'Export failed: ' + error.message });
        }
    };

    const handleImport = async (type: 'cgpa' | 'timetable' | 'files', e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !e.target.files?.[0]) return;
        const file = e.target.files[0];

        try {
            if (type === 'cgpa') await importCGPA({ file, userId: user.id });
            if (type === 'timetable') await importTimetable({ file, userId: user.id });
            if (type === 'files') await importFiles({ file, userId: user.id });
            setMessage({ type: 'success', text: `${type.toUpperCase()} imported successfully` });
        } catch (error: any) {
            console.error(error);
            setMessage({ type: 'error', text: 'Import failed: ' + error.message });
        } finally {
            // Reset input
            if (e.target) e.target.value = '';
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Card className="p-6">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </h2>

                        <Input
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <Input
                            label="Email"
                            value={formData.email}
                            disabled
                            className="bg-muted"
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Security
                        </h2>

                        <Input
                            label="New Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Leave blank to keep current password"
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-md text-sm ${message.type === 'success'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" isLoading={loading}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Card>

            <Card className="p-6">
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Data Management
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Export your data to JSON or PDF, or import data from JSON backups.
                    </p>

                    {/* CGPA */}
                    <div className="space-y-3 p-4 border rounded-lg">
                        <h3 className="font-medium">CGPA & Grades</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleExport('cgpa', 'json')}>
                                <FileJson className="mr-2 h-4 w-4" /> Export JSON
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleExport('cgpa', 'pdf')}>
                                <FileText className="mr-2 h-4 w-4" /> Export PDF
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => cgpaInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" /> Import JSON
                            </Button>
                            <input
                                type="file"
                                ref={cgpaInputRef}
                                className="hidden"
                                accept=".json"
                                onChange={(e) => handleImport('cgpa', e)}
                            />
                        </div>
                    </div>

                    {/* Timetable */}
                    <div className="space-y-3 p-4 border rounded-lg">
                        <h3 className="font-medium">Timetable</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleExport('timetable', 'json')}>
                                <FileJson className="mr-2 h-4 w-4" /> Export JSON
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleExport('timetable', 'pdf')}>
                                <FileText className="mr-2 h-4 w-4" /> Export PDF
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => timetableInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" /> Import JSON
                            </Button>
                            <input
                                type="file"
                                ref={timetableInputRef}
                                className="hidden"
                                accept=".json"
                                onChange={(e) => handleImport('timetable', e)}
                            />
                        </div>
                    </div>

                    {/* Files Metadata */}
                    <div className="space-y-3 p-4 border rounded-lg">
                        <h3 className="font-medium">Files Metadata</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleExport('files', 'json')}>
                                <FileJson className="mr-2 h-4 w-4" /> Export JSON
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleExport('files', 'pdf')}>
                                <FileText className="mr-2 h-4 w-4" /> Export PDF
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => filesInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" /> Import JSON
                            </Button>
                            <input
                                type="file"
                                ref={filesInputRef}
                                className="hidden"
                                accept=".json"
                                onChange={(e) => handleImport('files', e)}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
