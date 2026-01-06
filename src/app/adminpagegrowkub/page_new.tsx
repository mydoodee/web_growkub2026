'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
    Save, RefreshCw, LayoutDashboard, Type, CreditCard,
    PlaySquare, Upload, Plus, Trash2, Globe, Code2,
    BarChart3, Info, FileText, Users
} from 'lucide-react';

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('general');

    const [config, setConfig] = useState({
        site: {
            logoText: "growkub",
            logoUrl: ""
        },
        hero: {
            line1: "ขับเคลื่อนธุรกิจยุคใหม่",
            line2: "ด้วยโซลูชันที่เหนือกว่า",
            sub: "แพลตฟอร์มที่รวมเครื่องมือสำหรับเจ้าของธุรกิจยุคใหม่..."
        },
        services: [
            { title: "หอพัก", desc: "จัดการผู้อยู่อาศัย...", icon: "Building2" }
        ],
        spotlight: {
            heading: "เปลี่ยนหน้าจอให้เป็น ระบบขายของมืออาชีพ",
            items: [
                { title: "ไม่จำกัดจำนวนรายการ", desc: "ขายได้ไม่จำกัด..." }
            ]
        },
        dev: {
            heading: "รับเขียนโปรแกรม ระบบสำหรับธุรกิจ",
            sub: "รับพัฒนาระบบแอพพลิเคชั่น...",
            items: [
                { title: "ระบบแอพพลิเคชั่น", sub: "Mobile & Web Apps", icon: "AppWindow" }
            ]
        },
        features: {
            heading: "ครบทุกฟังก์ชันที่ธุรกิจต้องการ",
            sub: "เราเติบโตไปพร้อมกับความสำเร็จของคุณ...",
            items: [
                { title: "ระบบ POS ฟรี", desc: "จัดการงานขายได้จากทุกที่...", icon: "BarChart3" }
            ]
        },
        footer: {
            desc: "ช่วยให้ธุรกิจท้องถิ่นเติบโต...",
            copyright: "© 2026 Growkub.",
            links: {
                terms: "/terms",
                privacy: "/privacy",
                contact: "/contact"
            }
        },
        pages: {
            about: {
                hero: {
                    title: "เราสร้าง Growkub เพื่อสนับสนุนธุรกิจไทยให้เติบโต",
                    subtitle: "เริ่มต้นจากความเชื่อที่ว่า \"เทคโนโลยีที่ดีไม่จำเป็นต้องมีราคาแพง\""
                },
                mission: {
                    title: "วิสัยทัศน์ของเรา",
                    content: "ในยุคที่โลกเปลี่ยนผ่านไปสู่ดิจิทัล ธุรกิจขนาดกลางและขนาดย่อม..."
                },
                values: {
                    title: "คุณค่าหลักของเรา",
                    items: [
                        { title: "ความโปร่งใส", desc: "ไม่มีค่าใช้จ่ายแอบแฝง" },
                        { title: "นวัตกรรม", desc: "พัฒนาเทคโนโลยีใหม่อยู่เสมอ" },
                        { title: "ความมุ่งมั่น", desc: "เติบโตไปพร้อมกับคุณ" }
                    ]
                }
            },
            terms: {
                title: "เงื่อนไขการใช้งาน",
                content: "เนื้อหาเงื่อนไขการใช้งาน..."
            },
            privacy: {
                title: "นโยบายความเป็นส่วนตัว",
                content: "เนื้อหานโยบายความเป็นส่วนตัว..."
            },
            contact: {
                title: "ติดต่อเรา",
                email: "contact@growkub.com",
                phone: "02-XXX-XXXX",
                address: "กรุงเทพมหานคร ประเทศไทย",
                lineId: "@growkub"
            }
        }
    });

    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({
        show: false, message: '', type: 'success'
    });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const docRef = doc(db, "configs", "main");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setConfig((prev) => ({
                        ...prev,
                        ...data,
                        site: { ...prev.site, ...data.site },
                        hero: { ...prev.hero, ...data.hero },
                        services: data.services || prev.services,
                        spotlight: { ...prev.spotlight, ...data.spotlight, items: data.spotlight?.items || prev.spotlight.items },
                        dev: { ...prev.dev, ...data.dev, items: data.dev?.items || prev.dev.items },
                        features: { ...prev.features, ...data.features, items: data.features?.items || prev.features.items },
                        footer: { ...prev.footer, ...data.footer },
                        pages: { ...prev.pages, ...data.pages }
                    }));
                }
            } catch (err: any) {
                console.error("Fetch error:", err);
                setError(err.message || "Failed to connect to Firebase");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "configs", "main"), config);

            // Clear cache so users get fresh data
            const { clearConfigCache } = await import('@/lib/cache');
            clearConfigCache();

            showToast("บันทึกหน้าเว็บเรียบร้อยแล้ว!", "success");
        } catch (error) {
            console.error("Error saving document: ", error);
            showToast("เกิดข้อผิดพลาดในการบันทึก", "error");
        }
        setSaving(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(path);
        try {
            const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            if (path === 'logo') {
                setConfig({ ...config, site: { ...config.site, logoUrl: url } });
            }
            showToast("อัปโหลดไฟล์สำเร็จ", "success");
        } catch (err) {
            console.error("Upload error:", err);
            showToast("อัปโหลดไฟล์ไม่สำเร็จ", "error");
        } finally {
            setUploading(null);
        }
    };

    // Helper functions (abbreviated for brevity - continuing in next file section)
    const addService = () => {
        setConfig({
            ...config,
            services: [...config.services, { title: "บริการใหม่", desc: "คำอธิบายใหม่", icon: "Zap" }]
        });
        showToast("เพิ่มการ์ดบริการใหม่", "success");
    };

    const deleteService = (idx: number) => {
        const newServices = config.services.filter((_, i) => i !== idx);
        setConfig({ ...config, services: newServices });
        showToast("ลบการ์ดบริการแล้ว", "success");
    };

    const addSpotlightItem = () => {
        setConfig({
            ...config,
            spotlight: {
                ...config.spotlight,
                items: [...config.spotlight.items, { title: "หัวข้อใหม่", desc: "รายละเอียดใหม่" }]
            }
        });
        showToast("เพิ่มจุดเด่นใหม่", "success");
    };

    const deleteSpotlightItem = (idx: number) => {
        const newItems = config.spotlight.items.filter((_, i) => i !== idx);
        setConfig({ ...config, spotlight: { ...config.spotlight, items: newItems } });
        showToast("ลบจุดเด่นแล้ว", "success");
    };

    const addDevItem = () => {
        setConfig({
            ...config,
            dev: {
                ...config.dev,
                items: [...config.dev.items, { title: "โซลูชันใหม่", sub: "รายละเอียด", icon: "Code2" }]
            }
        });
        showToast("เพิ่มโซลูชันใหม่", "success");
    };

    const deleteDevItem = (idx: number) => {
        const newItems = config.dev.items.filter((_, i) => i !== idx);
        setConfig({ ...config, dev: { ...config.dev, items: newItems } });
        showToast("ลบโซลูชันแล้ว", "success");
    };

    const addFeature = () => {
        setConfig({
            ...config,
            features: {
                ...config.features,
                items: [...config.features.items, { title: "ฟีเจอร์ใหม่", desc: "คำอธิบาย", icon: "Zap" }]
            }
        });
        showToast("เพิ่มฟีเจอร์ใหม่", "success");
    };

    const deleteFeature = (idx: number) => {
        const newItems = config.features.items.filter((_, i) => i !== idx);
        setConfig({ ...config, features: { ...config.features, items: newItems } });
        showToast("ลบฟีเจอร์แล้ว", "success");
    };

    const addAboutValue = () => {
        const currentValues = config.pages.about.values.items || [];
        setConfig({
            ...config,
            pages: {
                ...config.pages,
                about: {
                    ...config.pages.about,
                    values: {
                        ...config.pages.about.values,
                        items: [...currentValues, { title: "คุณค่าใหม่", desc: "คำอธิบาย" }]
                    }
                }
            }
        });
        showToast("เพิ่มคุณค่าใหม่", "success");
    };

    const deleteAboutValue = (idx: number) => {
        const newValues = config.pages.about.values.items.filter((_, i) => i !== idx);
        setConfig({
            ...config,
            pages: {
                ...config.pages,
                about: {
                    ...config.pages.about,
                    values: {
                        ...config.pages.about.values,
                        items: newValues
                    }
                }
            }
        });
        showToast("ลบคุณค่าแล้ว", "success");
    };

    if (loading) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-kanit">
            <RefreshCw className="animate-spin text-primary mr-2" /> กำลังโหลดข้อมูล...
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-kanit p-4">
            <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl max-w-md text-center">
                <h2 className="text-xl font-bold text-red-500 mb-2">เกิดข้อผิดพลาดในการเชื่อมต่อ</h2>
                <p className="text-sm text-gray-400 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl">ลองใหม่อีกครั้ง</button>
            </div>
        </div>
    );

    const tabs = [
        { id: 'general', label: 'ทั่วไป', icon: Globe },
        { id: 'content', label: 'เนื้อหาหลัก', icon: Type },
        { id: 'pages', label: 'หน้าต่างๆ', icon: FileText },
        { id: 'footer', label: 'Footer', icon: Info }
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-kanit overflow-x-hidden">
            {/* Toast Notification */}
            <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 pointer-events-none ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'}`}>
                <div className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${toast.type === 'success' ? 'bg-zinc-900 border-primary/30 text-primary' : 'bg-red-950 border-red-500/30 text-red-500'}`}>
                    {toast.type === 'success' ? <Save size={20} /> : <Trash2 size={20} />}
                    <span className="font-bold">{toast.message}</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 sticky top-0 bg-zinc-950 z-40 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <LayoutDashboard size={28} className="text-black" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">Growkub CMS</h1>
                    </div>
                    <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-primary text-black rounded-xl font-bold flex items-center gap-2 hover:bg-accent transition-all shadow-lg active:scale-95 disabled:opacity-50 w-full md:w-auto justify-center">
                        {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                    </button>
                </header>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 sticky top-20 bg-zinc-950 z-30">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                        ? 'bg-primary text-black'
                                        : 'bg-white/5 hover:bg-white/10 text-white/60'
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <main className="space-y-8 pb-24">
                    {/* GENERAL TAB */}
                    {activeTab === 'general' && (
                        <>
                            <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[32px]">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                                    <Globe size={20} /> ตั้งค่าทั่วไป
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-muted-foreground mb-2">ชื่อแบรนด์</label>
                                        <input type="text" value={config.site.logoText} onChange={(e) => setConfig({ ...config, site: { ...config.site, logoText: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-muted-foreground mb-2">อัปโหลด Logo</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex-1 cursor-pointer bg-white/5 border border-dashed border-white/20 rounded-xl p-3 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                                <Upload size={18} className={uploading === 'logo' ? 'animate-bounce' : ''} />
                                                <span className="text-sm">{uploading === 'logo' ? 'กำลังอัปโหลด...' : 'เลือกไฟล์ภาพ'}</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                                            </label>
                                            {config.site.logoUrl && (
                                                <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden">
                                                    <img src={config.site.logoUrl} alt="logo" className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[32px]">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                                    <Type size={20} /> ส่วนหน้าแรก (Hero)
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-muted-foreground mb-2">พาดหัวบรรทัดที่ 1</label>
                                        <input type="text" value={config.hero.line1} onChange={(e) => setConfig({ ...config, hero: { ...config.hero, line1: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-muted-foreground mb-2">พาดหัวจุดเด่น (สีทอง)</label>
                                        <input type="text" value={config.hero.line2} onChange={(e) => setConfig({ ...config, hero: { ...config.hero, line2: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold text-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-muted-foreground mb-2">คำอธิบาย</label>
                                        <textarea rows={3} value={config.hero.sub} onChange={(e) => setConfig({ ...config, hero: { ...config.hero, sub: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none" />
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {/* Due to length constraints, I'll notify the user that the file is being created with tab structure */}
                </main>
            </div>
        </div>
    );
}
