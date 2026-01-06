'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
    const [pageData, setPageData] = useState({
        title: "นโยบายความเป็นส่วนตัว",
        content: "กำลังโหลด..."
    });
    const [logoText, setLogoText] = useState("growkub");

    useEffect(() => {
        async function fetchData() {
            const { getCachedConfig, setCachedConfig } = await import('@/lib/cache');
            const cached = getCachedConfig();

            if (cached?.pages?.privacy) {
                setPageData(cached.pages.privacy);
                if (cached.site?.logoText) setLogoText(cached.site.logoText);
            }

            try {
                const docRef = doc(db, "configs", "main");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as any;
                    if (data.pages?.privacy) {
                        setPageData(data.pages.privacy);
                    }
                    if (data.site?.logoText) {
                        setLogoText(data.site.logoText);
                    }
                    setCachedConfig(data);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <span className="text-black font-black text-xl">{logoText.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tighter">{logoText}</span>
                    </div>
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft size={16} />
                        กลับหน้าแรก
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main className="pt-32 pb-24">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                            <Shield size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Privacy & Security</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{pageData.title}</h1>
                        <p className="text-muted-foreground text-sm">อัปเดตล่าสุด: มกราคม 2026</p>
                    </div>

                    {/* Content Body */}
                    <div className="prose prose-invert prose-lg max-w-none">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                            <div className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                                {pageData.content}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 text-center">
                        <p className="text-sm text-muted-foreground mb-6">
                            เรามุ่งมั่นในการปกป้องความเป็นส่วนตัวของคุณ หากมีข้อสงสัย โปรดติดต่อเรา
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-full font-bold hover:scale-105 transition-transform">
                            ติดต่อเรา
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
