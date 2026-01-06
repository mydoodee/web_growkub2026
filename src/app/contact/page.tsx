'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    const [pageData, setPageData] = useState({
        title: "ติดต่อเรา",
        email: "contact@growkub.com",
        phone: "02-XXX-XXXX",
        address: "กรุงเทพมหานคร ประเทศไทย",
        lineId: "@growkub"
    });
    const [logoText, setLogoText] = useState("growkub");

    useEffect(() => {
        async function fetchData() {
            const { getCachedConfig, setCachedConfig } = await import('@/lib/cache');
            const cached = getCachedConfig();

            if (cached?.pages?.contact) {
                setPageData(cached.pages.contact);
                if (cached.site?.logoText) setLogoText(cached.site.logoText);
            }

            try {
                const docRef = doc(db, "configs", "main");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as any;
                    if (data.pages?.contact) {
                        setPageData(data.pages.contact);
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
                <div className="max-w-5xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-16 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                            <Mail size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Get in Touch</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{pageData.title}</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            พร้อมให้บริการและตอบทุกคำถาม ติดต่อเราผ่านช่องทางที่สะดวกที่สุดสำหรับคุณ
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        {/* Email */}
                        <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Mail className="text-primary" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">อีเมล</h3>
                            <a href={`mailto:${pageData.email}`} className="text-primary hover:underline text-lg">
                                {pageData.email}
                            </a>
                        </div>

                        {/* Phone */}
                        <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Phone className="text-primary" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">โทรศัพท์</h3>
                            <a href={`tel:${pageData.phone}`} className="text-primary hover:underline text-lg">
                                {pageData.phone}
                            </a>
                        </div>

                        {/* Line */}
                        <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MessageCircle className="text-primary" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">LINE</h3>
                            <p className="text-primary text-lg">{pageData.lineId}</p>
                        </div>

                        {/* Address */}
                        <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MapPin className="text-primary" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">ที่อยู่</h3>
                            <p className="text-muted-foreground">{pageData.address}</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20">
                        <h2 className="text-3xl font-black mb-4">พร้อมเริ่มต้นแล้วใช่ไหม?</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            ลองใช้บริการของเราได้ฟรี ไม่มีค่าใช้จ่ายแอบแฝง
                        </p>
                        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-black rounded-full font-bold text-lg hover:scale-105 transition-transform">
                            เริ่มต้นใช้งาน
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
