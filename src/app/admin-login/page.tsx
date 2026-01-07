'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/adminpagegrowkub');
        } catch (err: any) {
            console.error('Login error:', err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            } else if (err.code === 'auth/too-many-requests') {
                setError('มีการพยายาม Login มากเกินไป กรุณารอสักครู่');
            } else {
                setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // Use flex-col and overflow-auto to handle virtual keyboard on mobile
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-kanit overflow-y-auto">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md relative z-10 py-10">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                            <Lock size={32} className="text-black" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black mb-2">ADMIN LOGIN</h1>
                    <p className="text-muted-foreground">Growkub CMS Dashboard</p>
                </div>

                {/* Login Form */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-500">{error}</p>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                อีเมล
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-primary outline-none transition-colors text-base"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                รหัสผ่าน
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-12 py-3 focus:border-primary outline-none transition-colors text-base"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-black font-bold py-3 px-6 rounded-xl hover:bg-accent transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    กำลังเข้าสู่ระบบ...
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    เข้าสู่ระบบ
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Note */}
                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-muted-foreground">
                            🔒 Protected by Firebase Authentication
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        ← กลับหน้าแรก
                    </a>
                </div>
            </div>
        </div>
    );
}
