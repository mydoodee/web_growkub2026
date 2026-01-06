'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
    Users, Target, Rocket, Heart, ShieldCheck,
    ArrowRight, Globe, Zap, MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    const [config, setConfig] = useState({
        site: {
            logoText: "growkub",
            logoUrl: ""
        }
    });

    useEffect(() => {
        async function fetchConfig() {
            const docRef = doc(db, "configs", "main");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setConfig(prev => ({
                    ...prev,
                    site: { ...prev.site, ...data.site }
                }));
            }
        }
        fetchConfig();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black font-kanit">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        {config.site.logoUrl ? (
                            <div className="w-10 h-10 relative">
                                <img src={config.site.logoUrl} alt="logo" className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <span className="text-black font-black text-xl">
                                    {config.site.logoText.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <span className="text-2xl font-bold tracking-tighter">{config.site.logoText}</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="/#services" className="hover:text-primary transition-colors">บริการของเรา</Link>
                        <Link href="/#pos" className="hover:text-primary transition-colors">POS ฟรี</Link>
                        <Link href="/#dev" className="hover:text-primary transition-colors">รับเขียนโปรแกรม</Link>
                        <Link href="/about" className="text-white">เกี่ยวกับเรา</Link>
                        <Link href="/#contact" className="bg-primary text-black px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform active:scale-95">เริ่มต้นใช้งาน</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse delay-700" />
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
                        <Users size={16} className="text-primary" />
                        <span className="text-xs font-bold tracking-widest uppercase">Growkub Story</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-[1.1]">
                        เราสร้าง <span className="text-primary">Growkub</span> เพื่อ <br />
                        สนับสนุนธุรกิจไทย <span className="text-white/30 italic">ให้เติบโต</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
                        เริ่มต้นจากความเชื่อที่ว่า "เทคโนโลยีที่ดีไม่จำเป็นต้องมีราคาแพง"
                        เราจึงสร้างแพลตฟอร์มที่รวมเครื่องมือจัดการธุรกิจที่ทันสมัยที่สุด
                        ให้เจ้าของธุรกิจทุกคนใช้งานได้ฟรี ไม่มีข้อผูกมัด
                    </p>
                </div>
            </section>

            {/* Our Mission */}
            <section className="py-20 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                                วิสัยทัศน์<span className="text-primary">ของเรา</span>
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                ในยุคที่โลกเปลี่ยนผ่านไปสู่ดิจิทัล ธุรกิจขนาดกลางและขนาดย่อม (SMEs)
                                มักต้องเผชิญกับต้นทุนเทคโนโลยีที่สูงเกินไป เราต้องการเป็นตัวกลางที่ทำลายกำแพงเหล่านั้น
                                ด้วยการส่งมอบซอฟต์แวร์คุณภาพระดับองค์กรให้แก่ทุกคน
                            </p>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                    <Target className="text-primary mb-4" size={32} />
                                    <h3 className="font-bold mb-2">เป้าหมาย</h3>
                                    <p className="text-xs text-muted-foreground">ช่วย 10,000+ ธุรกิจไทย เข้าสู่ระบบดิจิทัลในปีนี้</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                    <Rocket className="text-secondary mb-4" size={32} />
                                    <h3 className="font-bold mb-2">นวัตกรรม</h3>
                                    <p className="text-xs text-muted-foreground">พัฒนาฟีเจอร์ใหม่ๆ จากความต้องการจริงของผู้ใช้</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-primary/20 to-transparent rounded-[40px] border border-white/10 overflow-hidden flex items-center justify-center">
                                <div className="text-[200px] font-black text-white/[0.03] absolute select-none">GROW</div>
                                <Users size={120} className="text-primary animate-bounce-slow" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Pillars */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 tracking-tighter">หัวใจสำคัญของ Growkub</h2>
                        <p className="text-muted-foreground">เรายึดถือมาตรฐานสูงสุดในการให้บริการเพื่อความสำเร็จของคุณ</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Heart, title: "ทำด้วยใจ", desc: "เราดูแลลูกค้าเหมือนคนในครอบครัว พร้อมรับฟังและพัฒนาเสมอ" },
                            { icon: ShieldCheck, title: "ความไว้ใจ", desc: "ข้อมูลของคุณคือสิ่งสำคัญสูงสุด เรามีระบบรักษาความปลอดภัยระดับสากล" },
                            { icon: Zap, title: "ความรวดเร็ว", desc: "ระบบที่เสถียรและรวดเร็ว รองรับการทำงานได้ทุกที่ทุกสถานการณ์" }
                        ].map((p, i) => (
                            <div key={i} className="group p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-primary/50 transition-all">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <p.icon className="text-primary" size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{p.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative p-12 md:p-20 rounded-[48px] overflow-hidden bg-primary text-black text-center">
                        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-white/20 blur-[80px] rounded-full" />
                        <h2 className="text-3xl md:text-6xl font-black mb-6 tracking-tighter">มาร่วมเป็นส่วนหนึ่งของ <br /> ครีเอเตอร์ธุรกิจยุคใหม่</h2>
                        <p className="max-w-xl mx-auto text-lg mb-10 font-medium opacity-80">เริ่มต้นใช้งานระบบจัดการหลังบ้านที่ดีที่สุดได้แล้ววันนี้ โดยไม่มีค่าธรรมเนียมใดๆ ทั้งสิ้น</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/#contact" className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform active:scale-95 flex items-center gap-2">
                                เริ่มต้นใช้งานฟรี <ArrowRight size={20} />
                            </Link>
                            <button className="bg-white/20 backdrop-blur-md border border-black/10 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-colors">
                                ติดต่อฝ่ายสนับสนุน
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Simple */}
            <section className="py-20 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-12 flex-wrap justify-center text-muted-foreground font-medium">
                        <div className="flex items-center gap-2"><Globe size={18} /> www.growkub.com</div>
                        <div className="flex items-center gap-2"><MessageSquare size={18} /> @growkub (LINE)</div>
                        <div className="flex items-center gap-2"><Zap size={18} /> Support 24/7</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2 opacity-50">
                            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold">G</div>
                            <span className="font-bold tracking-tighter">growkub</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            © 2026 Growkub Technologies. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a>
                            <a href="#" className="hover:text-white transition-colors">ข้อกำหนดการใช้งาน</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
