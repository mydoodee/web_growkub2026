'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
    Save, RefreshCw, LayoutDashboard, Type, CreditCard, PlaySquare, Upload, Plus, Trash2,
    Globe, Code2, BarChart3, Info, FileText, Users, Target, Heart, LogOut
} from 'lucide-react';

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('general');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const [config, setConfig] = useState({
        site: { logoText: "growkub", logoUrl: "" },
        hero: {
            line1: "ขับเคลื่อนธุรกิจยุคใหม่",
            line2: "ด้วยโซลูชันที่เหนือกว่า",
            sub: "แพลตฟอร์ม...",
            badge: "แพลตฟอร์มธุรกิจครบวงจร"
        },
        services: [{ title: "หอพัก", desc: "จัดการผู้อยู่อาศัย...", icon: "Building2" }],
        spotlight: { heading: "เปลี่ยนหน้าจอ...", items: [{ title: "ไม่จำกัด", desc: "ขายได้..." }] },
        dev: { heading: "รับเขียนโปรแกรม...", sub: "รับพัฒนา...", items: [{ title: "ระบบแอพพลิเคชั่น", sub: "Mobile & Web", icon: "AppWindow" }] },
        features: { heading: "ครบทุกฟังก์ชัน...", sub: "เราเติบโต...", items: [{ title: "ระบบ POS ฟรี", desc: "จัดการงาน...", icon: "BarChart3" }] },
        footer: { desc: "ช่วยให้ธุรกิจ...", copyright: "© 2026 Growkub.", links: { terms: "/terms", privacy: "/privacy", contact: "/contact" } },
        pages: {
            about: {
                hero: { title: "เราสร้าง Growkub เพื่อสนับสนุนธุรกิจไทยให้เติบโต", subtitle: "เทคโนโลยีที่ดีไม่จำเป็นต้องมีราคาแพง" },
                mission: { title: "วิสัยทัศน์ของเรา", content: "ในยุคที่โลกเปลี่ยนผ่าน..." },
                values: { title: "คุณค่าหลักของเรา", items: [{ title: "ความโปร่งใส", desc: "ไม่มีค่าแอบแฝง" }] }
            },
            terms: { title: "เงื่อนไขการใช้งาน", content: "เนื้อหา..." },
            privacy: { title: "นโยบายความเป็นส่วนตัว", content: "เนื้อหา..." },
            contact: { title: "ติดต่อเรา", email: "contact@growkub.com", phone: "02-XXX-XXXX", address: "กรุงเทพฯ", lineId: "@growkub" }
        }
    });

    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    // Check authentication
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                router.push('/admin-login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        async function fetchData() {
            if (!isAuthenticated) return;
            try {
                const docRef = doc(db, "configs", "main");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setConfig((prev) => ({ ...prev, ...data, site: { ...prev.site, ...data.site }, hero: { ...prev.hero, ...data.hero }, services: data.services || prev.services, spotlight: { ...prev.spotlight, ...data.spotlight, items: data.spotlight?.items || prev.spotlight.items }, dev: { ...prev.dev, ...data.dev, items: data.dev?.items || prev.dev.items }, features: { ...prev.features, ...data.features, items: data.features?.items || prev.features.items }, footer: { ...prev.footer, ...data.footer }, pages: { ...prev.pages, ...data.pages } }));
                }
            } catch (err: any) {
                setError(err.message || "Failed to connect");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [isAuthenticated]);

    const handleLogout = async () => {
        const auth = getAuth();
        await signOut(auth);
        router.push('/admin-login');
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "configs", "main"), config);
            const { clearConfigCache } = await import('@/lib/cache');
            clearConfigCache();
            showToast("บันทึกเรียบร้อย!", "success");
        } catch (error) {
            showToast("เกิดข้อผิดพลาด", "error");
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
            if (path === 'logo') setConfig({ ...config, site: { ...config.site, logoUrl: url } });
            showToast("อัปโหลดสำเร็จ", "success");
        } catch (err) {
            showToast("อัปโหลดไม่สำเร็จ", "error");
        } finally {
            setUploading(null);
        }
    };

    const addService = () => { setConfig({ ...config, services: [...config.services, { title: "บริการใหม่", desc: "คำอธิบาย", icon: "Zap" }] }); showToast("เพิ่มบริการ"); };
    const deleteService = (idx: number) => { setConfig({ ...config, services: config.services.filter((_, i) => i !== idx) }); showToast("ลบแล้ว"); };
    const addSpotlightItem = () => { setConfig({ ...config, spotlight: { ...config.spotlight, items: [...config.spotlight.items, { title: "หัวข้อ", desc: "รายละเอียด" }] } }); showToast("เพิ่มแล้ว"); };
    const deleteSpotlightItem = (idx: number) => { setConfig({ ...config, spotlight: { ...config.spotlight, items: config.spotlight.items.filter((_, i) => i !== idx) } }); showToast("ลบแล้ว"); };
    const addDevItem = () => { setConfig({ ...config, dev: { ...config.dev, items: [...config.dev.items, { title: "โซลูชัน", sub: "รายละเอียด", icon: "Code2" }] } }); showToast("เพิ่มแล้ว"); };
    const deleteDevItem = (idx: number) => { setConfig({ ...config, dev: { ...config.dev, items: config.dev.items.filter((_, i) => i !== idx) } }); showToast("ลบแล้ว"); };
    const addFeature = () => { setConfig({ ...config, features: { ...config.features, items: [...config.features.items, { title: "ฟีเจอร์", desc: "คำอธิบาย", icon: "Zap" }] } }); showToast("เพิ่มแล้ว"); };
    const deleteFeature = (idx: number) => { setConfig({ ...config, features: { ...config.features, items: config.features.items.filter((_, i) => i !== idx) } }); showToast("ลบแล้ว"); };
    const addAboutValue = () => { setConfig({ ...config, pages: { ...config.pages, about: { ...config.pages.about, values: { ...config.pages.about.values, items: [...(config.pages.about.values.items || []), { title: "คุณค่า", desc: "คำอธิบาย" }] } } } }); showToast("เพิ่มแล้ว"); };
    const deleteAboutValue = (idx: number) => { setConfig({ ...config, pages: { ...config.pages, about: { ...config.pages.about, values: { ...config.pages.about.values, items: config.pages.about.values.items.filter((_, i) => i !== idx) } } } }); showToast("ลบแล้ว"); };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-kanit"><RefreshCw className="animate-spin text-primary mr-2" /> กำลังโหลด...</div>;
    if (error) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-kanit p-4"><div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl max-w-md text-center"><h2 className="text-xl font-bold text-red-500 mb-2">ข้อผิดพลาด</h2><p className="text-sm text-gray-400 mb-4">{error}</p><button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl">ลองใหม่</button></div></div>;

    const tabs = [
        { id: 'general', label: 'ทั่วไป', icon: Globe },
        { id: 'content', label: 'เนื้อหาหลัก', icon: Type },
        { id: 'pages', label: 'หน้าต่างๆ', icon: FileText },
        { id: 'footer', label: 'Footer', icon: Info }
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-kanit">
            <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${toast.show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${toast.type === 'success' ? 'bg-zinc-900 border-primary/30 text-primary' : 'bg-red-950 border-red-500/30 text-red-500'}`}>
                    {toast.type === 'success' ? <Save size={20} /> : <Trash2 size={20} />}
                    <span className="font-bold">{toast.message}</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 sticky top-0 bg-zinc-950 z-40 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center"><LayoutDashboard size={28} className="text-black" /></div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase">Growkub CMS</h1>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleLogout} className="px-4 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold flex items-center gap-2 hover:bg-red-500/20 transition-all active:scale-95">
                            <LogOut size={18} />
                            <span className="hidden md:inline">ออกจากระบบ</span>
                        </button>
                        <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-primary text-black rounded-xl font-bold flex items-center gap-2 hover:bg-accent transition-all active:scale-95 disabled:opacity-50 flex-1 md:flex-initial justify-center">
                            {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                        </button>
                    </div>
                </header>

                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 sticky top-20 bg-zinc-950 z-30">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}><Icon size={18} />{tab.label}</button>);
                    })}
                </div>

                <main className="space-y-8 pb-24">
                    {activeTab === 'general' && (
                        <>
                            <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary"><Globe size={20} /> ตั้งค่าทั่วไป</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div><label className="block text-sm text-muted-foreground mb-2">ชื่อแบรนด์</label><input type="text" value={config.site.logoText} onChange={(e) => setConfig({ ...config, site: { ...config.site, logoText: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none" /></div>
                                    <div><label className="block text-sm text-muted-foreground mb-2">อัปโหลด Logo</label><div className="flex gap-4"><label className="flex-1 cursor-pointer bg-white/5 border border-dashed border-white/20 rounded-xl p-3 hover:bg-white/10 flex items-center justify-center gap-2"><Upload size={18} className={uploading === 'logo' ? 'animate-bounce' : ''} /><span className="text-sm">{uploading === 'logo' ? 'กำลังอัปโหลด...' : 'เลือกไฟล์'}</span><input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} /></label>{config.site.logoUrl && <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden"><img src={config.site.logoUrl} alt="logo" className="w-full h-full object-contain" /></div>}</div></div>
                                </div>
                            </section>

                            <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary"><Type size={20} /> ส่วนหน้าแรก (Hero)</h2>
                                <div className="space-y-4">
                                    <div><label className="block text-sm text-muted-foreground mb-2">ข้อความ Badge (ป้ายกำกับ)</label><input type="text" value={config.hero.badge} onChange={(e) => setConfig({ ...config, hero: { ...config.hero, badge: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-medium text-secondary" placeholder="เช่น บริการฟรีตลอดชีพ..." /></div>
                                    <div><label className="block text-sm text-muted-foreground mb-2">พาดหัวบรรทัดที่ 1</label><input type="text" value={config.hero.line1} onChange={(e) => setConfig({ ...config, hero: { ...config.hero, line1: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" /></div>
                                    <div><label className="block text-sm text-muted-foreground mb-2">พาดหัวจุดเด่น (สีทอง)</label><input type="text" value={config.hero.line2} onChange={(e) => setConfig({ ...config, hero: { ...config.hero, line2: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold text-primary" /></div>
                                    <div><label className="block text-sm text-muted-foreground mb-2">คำอธิบาย</label><textarea rows={3} value={config.hero.sub} onChange={(e) => setConfig({ ...config, hero: { ...config.hero, sub: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none" /></div>
                                </div>
                            </section>
                        </>
                    )}

                    {activeTab === 'content' && (
                        <>
                            <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl">
                                <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold flex items-center gap-2 text-primary"><CreditCard size={20} /> รายการบริการ</h2><button onClick={addService} className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20"><Plus size={16} /> เพิ่ม</button></div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {config.services.map((item, idx) => (
                                        <div key={idx} className="p-6 border border-white/5 bg-black/30 rounded-2xl relative">
                                            <button onClick={() => deleteService(idx)} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500"><Trash2 size={20} /></button>
                                            <div className="space-y-4 pr-8">
                                                <input type="text" placeholder="หัวข้อ" value={item.title} onChange={(e) => { const s = [...config.services]; s[idx].title = e.target.value; setConfig({ ...config, services: s }); }} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" />
                                                <textarea placeholder="คำอธิบาย" rows={2} value={item.desc} onChange={(e) => { const s = [...config.services]; s[idx].desc = e.target.value; setConfig({ ...config, services: s }); }} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-sm" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl">
                                <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold flex items-center gap-2 text-primary"><Code2 size={20} /> รับเขียนโปรแกรม (Dev)</h2><button onClick={addDevItem} className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20"><Plus size={16} /> เพิ่ม</button></div>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div><label className="block text-sm text-muted-foreground mb-2">หัวข้อหลัก</label><input type="text" value={config.dev.heading} onChange={(e) => setConfig({ ...config, dev: { ...config.dev, heading: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" /></div>
                                        <div><label className="block text-sm text-muted-foreground mb-2">คำอธิบาย</label><textarea rows={2} value={config.dev.sub} onChange={(e) => setConfig({ ...config, dev: { ...config.dev, sub: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-sm" /></div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {config.dev.items.map((item, idx) => (
                                            <div key={idx} className="p-6 border border-white/5 bg-black/30 rounded-2xl relative">
                                                <button onClick={() => deleteDevItem(idx)} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500"><Trash2 size={20} /></button>
                                                <div className="space-y-3 pr-8">
                                                    <input type="text" placeholder="หัวข้อ" value={item.title} onChange={(e) => { const d = [...config.dev.items]; d[idx].title = e.target.value; setConfig({ ...config, dev: { ...config.dev, items: d } }); }} className="w-full bg-black/50 border border-white/10 rounded-xl p-2 focus:border-primary outline-none font-bold text-sm" />
                                                    <input type="text" placeholder="คำอธิบาย" value={item.sub} onChange={(e) => { const d = [...config.dev.items]; d[idx].sub = e.target.value; setConfig({ ...config, dev: { ...config.dev, items: d } }); }} className="w-full bg-black/50 border border-white/10 rounded-xl p-2 focus:border-primary outline-none text-xs text-muted-foreground" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl">
                                <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold flex items-center gap-2 text-primary"><BarChart3 size={20} /> Features Grid</h2><button onClick={addFeature} className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20"><Plus size={16} /> เพิ่ม</button></div>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div><label className="block text-sm text-muted-foreground mb-2">หัวข้อ</label><input type="text" value={config.features.heading} onChange={(e) => setConfig({ ...config, features: { ...config.features, heading: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" /></div>
                                        <div><label className="block text-sm text-muted-foreground mb-2">คำอธิบายย่อย</label><input type="text" value={config.features.sub} onChange={(e) => setConfig({ ...config, features: { ...config.features, sub: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-sm italic" /></div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {config.features.items.map((item, idx) => (
                                            <div key={idx} className="p-5 border border-white/5 bg-black/30 rounded-2xl relative">
                                                <button onClick={() => deleteFeature(idx)} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500"><Trash2 size={16} /></button>
                                                <div className="space-y-3">
                                                    <input type="text" placeholder="ชื่อ" value={item.title} onChange={(e) => { const f = [...config.features.items]; f[idx].title = e.target.value; setConfig({ ...config, features: { ...config.features, items: f } }); }} className="w-full bg-black/50 border border-white/10 rounded-xl p-2 focus:border-primary outline-none font-bold text-sm" />
                                                    <textarea placeholder="คำอธิบาย" rows={2} value={item.desc} onChange={(e) => { const f = [...config.features.items]; f[idx].desc = e.target.value; setConfig({ ...config, features: { ...config.features, items: f } }); }} className="w-full bg-black/50 border border-white/10 rounded-xl p-2 focus:border-primary outline-none text-xs" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl">
                                <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold flex items-center gap-2 text-primary"><PlaySquare size={20} /> POS Spotlight</h2><button onClick={addSpotlightItem} className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20"><Plus size={16} /> เพิ่ม</button></div>
                                <div className="space-y-6">
                                    <div><label className="block text-sm text-muted-foreground mb-2">หัวข้อหลัก</label><input type="text" value={config.spotlight.heading} onChange={(e) => setConfig({ ...config, spotlight: { ...config.spotlight, heading: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" /></div>
                                    {config.spotlight.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-start bg-black/30 p-4 rounded-xl border border-white/5 relative">
                                            <div className="flex-1 grid md:grid-cols-2 gap-4">
                                                <input type="text" value={item.title} onChange={(e) => { const sp = [...config.spotlight.items]; sp[idx].title = e.target.value; setConfig({ ...config, spotlight: { ...config.spotlight, items: sp } }); }} className="bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" />
                                                <input type="text" value={item.desc} onChange={(e) => { const sp = [...config.spotlight.items]; sp[idx].desc = e.target.value; setConfig({ ...config, spotlight: { ...config.spotlight, items: sp } }); }} className="bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-sm" />
                                            </div>
                                            <button onClick={() => deleteSpotlightItem(idx)} className="text-red-500/50 hover:text-red-500 pt-2"><Trash2 size={20} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    {activeTab === 'pages' && (
                        <>
                            <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary"><Users size={20} /> หน้า About Us</h2>
                                <div className="space-y-8">
                                    <div className="p-6 bg-black/30 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold mb-4 text-primary">ส่วน Hero</h3>
                                        <div className="space-y-4">
                                            <div><label className="block text-sm text-muted-foreground mb-2">หัวข้อหลัก</label><input type="text" value={config.pages.about.hero.title} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, about: { ...config.pages.about, hero: { ...config.pages.about.hero, title: e.target.value } } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" /></div>
                                            <div><label className="block text-sm text-muted-foreground mb-2">คำบรรยาย</label><textarea rows={3} value={config.pages.about.hero.subtitle} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, about: { ...config.pages.about, hero: { ...config.pages.about.hero, subtitle: e.target.value } } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-sm" /></div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-black/30 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold mb-4 text-primary">วิสัยทัศน์</h3>
                                        <div className="space-y-4">
                                            <div><label className="block text-sm text-muted-foreground mb-2">หัวข้อ</label><input type="text" value={config.pages.about.mission.title} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, about: { ...config.pages.about, mission: { ...config.pages.about.mission, title: e.target.value } } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" /></div>
                                            <div><label className="block text-sm text-muted-foreground mb-2">เนื้อหา</label><textarea rows={5} value={config.pages.about.mission.content} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, about: { ...config.pages.about, mission: { ...config.pages.about.mission, content: e.target.value } } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-sm" /></div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-black/30 rounded-2xl border border-white/5">
                                        <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-primary">คุณค่าหลัก</h3><button onClick={addAboutValue} className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-2 rounded-xl text-sm font-bold hover:bg-primary/20"><Plus size={14} /> เพิ่ม</button></div>
                                        <div className="space-y-4">
                                            <div><label className="block text-sm text-muted-foreground mb-2">หัวข้อ</label><input type="text" value={config.pages.about.values.title} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, about: { ...config.pages.about, values: { ...config.pages.about.values, title: e.target.value } } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" /></div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {config.pages.about.values.items?.map((item, idx) => (
                                                    <div key={idx} className="p-4 border border-white/5 bg-black/50 rounded-xl relative">
                                                        <button onClick={() => deleteAboutValue(idx)} className="absolute top-3 right-3 text-red-500/50 hover:text-red-500"><Trash2 size={16} /></button>
                                                        <div className="space-y-2 pr-6">
                                                            <input type="text" placeholder="หัวข้อ" value={item.title} onChange={(e) => { const v = [...config.pages.about.values.items]; v[idx].title = e.target.value; setConfig({ ...config, pages: { ...config.pages, about: { ...config.pages.about, values: { ...config.pages.about.values, items: v } } } }); }} className="w-full bg-black/50 border border-white/10 rounded-xl p-2 focus:border-primary outline-none font-bold text-sm" />
                                                            <input type="text" placeholder="คำอธิบาย" value={item.desc} onChange={(e) => { const v = [...config.pages.about.values.items]; v[idx].desc = e.target.value; setConfig({ ...config, pages: { ...config.pages, about: { ...config.pages.about, values: { ...config.pages.about.values, items: v } } } }); }} className="w-full bg-black/50 border border-white/10 rounded-xl p-2 focus:border-primary outline-none text-xs text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary"><FileText size={20} /> หน้าเนื้อหาอื่นๆ</h2>
                                <div className="space-y-6">
                                    <div className="p-6 bg-black/30 rounded-2xl">
                                        <h3 className="font-bold mb-4">เงื่อนไขการใช้งาน (Terms)</h3>
                                        <div className="space-y-4">
                                            <div><label className="block text-sm text-muted-foreground mb-2">หัวข้อ</label><input type="text" value={config.pages.terms.title} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, terms: { ...config.pages.terms, title: e.target.value } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" /></div>
                                            <div><label className="block text-sm text-muted-foreground mb-2">เนื้อหา</label><textarea rows={6} value={config.pages.terms.content} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, terms: { ...config.pages.terms, content: e.target.value } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-sm font-mono" /></div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-black/30 rounded-2xl">
                                        <h3 className="font-bold mb-4">นโยบายความเป็นส่วนตัว (Privacy)</h3>
                                        <div className="space-y-4">
                                            <div><label className="block text-sm text-muted-foreground mb-2">หัวข้อ</label><input type="text" value={config.pages.privacy.title} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, privacy: { ...config.pages.privacy, title: e.target.value } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" /></div>
                                            <div><label className="block text-sm text-muted-foreground mb-2">เนื้อหา</label><textarea rows={6} value={config.pages.privacy.content} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, privacy: { ...config.pages.privacy, content: e.target.value } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-sm font-mono" /></div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-black/30 rounded-2xl">
                                        <h3 className="font-bold mb-4">ติดต่อเรา (Contact)</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div><label className="block text-sm text-muted-foreground mb-2">หัวข้อ</label><input type="text" value={config.pages.contact.title} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, contact: { ...config.pages.contact, title: e.target.value } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none font-bold" /></div>
                                            <div><label className="block text-sm text-muted-foreground mb-2">อีเมล</label><input type="email" value={config.pages.contact.email} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, contact: { ...config.pages.contact, email: e.target.value } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none" /></div>
                                            <div><label className="block text-sm text-muted-foreground mb-2">เบอร์โทร</label><input type="text" value={config.pages.contact.phone} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, contact: { ...config.pages.contact, phone: e.target.value } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none" /></div>
                                            <div><label className="block text-sm text-muted-foreground mb-2">Line ID</label><input type="text" value={config.pages.contact.lineId} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, contact: { ...config.pages.contact, lineId: e.target.value } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none" /></div>
                                            <div className="md:col-span-2"><label className="block text-sm text-muted-foreground mb-2">ที่อยู่</label><textarea rows={2} value={config.pages.contact.address} onChange={(e) => setConfig({ ...config, pages: { ...config.pages, contact: { ...config.pages.contact, address: e.target.value } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-sm" /></div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {activeTab === 'footer' && (
                        <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary"><Info size={20} /> Footer Settings</h2>
                            <div className="space-y-6">
                                <div><label className="block text-sm text-muted-foreground mb-2">คำอธิบายแบรนด์</label><textarea rows={2} value={config.footer.desc} onChange={(e) => setConfig({ ...config, footer: { ...config.footer, desc: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-sm italic" /></div>
                                <div><label className="block text-sm text-muted-foreground mb-2">ข้อความลิขสิทธิ์</label><input type="text" value={config.footer.copyright} onChange={(e) => setConfig({ ...config, footer: { ...config.footer, copyright: e.target.value } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-primary outline-none text-xs text-muted-foreground" /></div>
                                <div className="border-t border-white/5 pt-6">
                                    <h3 className="text-sm font-bold mb-4 text-primary">ลิงก์ Footer</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div><label className="block text-xs text-muted-foreground mb-2">เงื่อนไข (URL)</label><input type="text" placeholder="/terms" value={config.footer.links?.terms || ""} onChange={(e) => setConfig({ ...config, footer: { ...config.footer, links: { ...config.footer.links, terms: e.target.value } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-2 focus:border-primary outline-none text-xs" /></div>
                                        <div><label className="block text-xs text-muted-foreground mb-2">นโยบาย (URL)</label><input type="text" placeholder="/privacy" value={config.footer.links?.privacy || ""} onChange={(e) => setConfig({ ...config, footer: { ...config.footer, links: { ...config.footer.links, privacy: e.target.value } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-2 focus:border-primary outline-none text-xs" /></div>
                                        <div><label className="block text-xs text-muted-foreground mb-2">ติดต่อ (URL)</label><input type="text" placeholder="/contact" value={config.footer.links?.contact || ""} onChange={(e) => setConfig({ ...config, footer: { ...config.footer, links: { ...config.footer.links, contact: e.target.value } } })} className="w-full bg-black/50 border border-white/10 rounded-xl p-2 focus:border-primary outline-none text-xs" /></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
