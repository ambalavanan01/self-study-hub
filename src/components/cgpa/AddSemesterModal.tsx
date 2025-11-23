import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface AddSemesterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddSemesterModal({ isOpen, onClose, onSuccess }: AddSemesterModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        year: new Date().getFullYear(),
        term: 'Fall',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            const { error } = await supabase.from('semesters').insert([
                {
                    user_id: user.id,
                    year: formData.year,
                    term: formData.term,
                },
            ]);

            if (error) throw error;
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error adding semester:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Semester">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                    min={2000}
                    max={2100}
                />
                <div className="space-y-2">
                    <label className="text-sm font-medium">Term</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.term}
                        onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                    >
                        <option value="Fall">Fall</option>
                        <option value="Winter">Winter</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={loading}>
                        Add Semester
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
