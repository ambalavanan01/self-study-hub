import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { supabase } from '../lib/supabase';
import { MobileSignup } from '../components/auth/MobileSignup';

export function Signup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                    },
                },
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                // Create profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            user_id: data.user.id,
                            name: formData.name,
                        },
                    ]);

                if (profileError) {
                    // If profile creation fails, we should probably warn the user but let them proceed
                    console.error('Error creating profile:', profileError);
                }
            }

            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="block md:hidden">
                <MobileSignup />
            </div>
            <div className="hidden md:block">
                <AuthLayout
                    title="Create an account"
                    subtitle="Enter your email below to create your account"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="w-full" isLoading={loading}>
                            Sign Up
                        </Button>
                    </form>
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                            Sign in
                        </Link>
                    </div>
                </AuthLayout>
            </div>
        </>
    );
}
