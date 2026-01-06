'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowRight, BarChart3, CheckCircle2, LayoutDashboard, Zap, Shield, Gift, Code2, AppWindow, ShoppingBag, QrCode, Building2, CalendarCheck, Info } from 'lucide-react';
import Image from 'next/image';

// Icon mapping for dynamic icons
const IconMap: { [key: string]: any } = {
  Building2, ShoppingBag, QrCode, CalendarCheck, Zap, Shield, BarChart3, Gift, LayoutDashboard, AppWindow, Code2, Info, CheckCircle2
};

export default function Home() {
  const [config, setConfig] = useState({
    site: {
      logoText: "growkub",
      logoUrl: ""
    },
    hero: {
      line1: "ขับเคลื่อนธุรกิจยุคใหม่",
      line2: "ด้วยโซลูชันที่เหนือกว่า",
      sub: "แพลตฟอร์มที่รวมเครื่องมือสำหรับเจ้าของธุรกิจยุคใหม่ ไม่ว่าจะเป็นระบบ POS, จัดการสต็อก และอีกมากมาย ทั้งหมดนี้ใช้งานได้ฟรี ไม่มีค่าใช้จ่ายแอบแฝง",
      badge: "แพลตฟอร์มธุรกิจครบวงจร"
    },
    services: [
      { title: "หอพัก", desc: "จัดการผู้อยู่อาศัย บิลค่าน้ำไฟ และสัญญาง่ายๆ", icon: "Building2" },
      { title: "POS", desc: "ระบบขายหน้าหน้าร้านที่เสถียร รองรับทุกอุปกรณ์", icon: "ShoppingBag" },
      { title: "QDD", desc: "สั่งอาหารผ่าน QR Code ลดการรอคอย เพิ่มยอดขาย", icon: "QrCode" },
      { title: "ระบบจอง", desc: "จัดการคิวและนัดหมายออนไลน์ได้ตลอด 24 ชม.", icon: "CalendarCheck" }
    ],
    spotlight: {
      heading: "เปลี่ยนหน้าจอให้เป็น ระบบขายของมืออาชีพ",
      items: [
        { title: "ไม่จำกัดจำนวนรายการ", desc: "ขายได้ไม่จำกัด ไม่มีการเก็บค่าบริการเพิ่มตามยอดขายหรือจำนวนบิล" },
        { title: "ใบเสร็จดิจิทัล", desc: "ลดต้นทุนและช่วยรักษ์โลก ด้วยการส่งใบเสร็จผ่าน SMS หรือ Email ได้ทันที" },
        { title: "โหมดออฟไลน์", desc: "ขายต่อได้แม้ไม่มีอินเทอร์เน็ต และระบบจะซิงค์ข้อมูลให้อัตโนมัติเมื่อกลับมาออนไลน์" }
      ]
    },
    dev: {
      heading: "รับเขียนโปรแกรม ระบบสำหรับธุรกิจ",
      sub: "รับพัฒนาระบบแอพพลิเคชั่นเพื่อตอบสนองความต้องการของธุรกิจคุณ...",
      items: [
        { title: "ระบบแอพพลิเคชั่น", sub: "Mobile & Web Apps", icon: "AppWindow" },
        { title: "ระบบจัดการการขาย", sub: "Sales & Inventory", icon: "ShoppingBag" }
      ]
    },
    features: {
      heading: "ครบทุกฟังก์ชันที่ธุรกิจต้องการ",
      sub: "เราเติบโตไปพร้อมกับความสำเร็จของคุณ ไม่มีค่าธรรมเนียมรายเดือน",
      items: [
        { title: "ระบบ POS ฟรี", desc: "จัดการงานขายได้จากทุกที่...", icon: "BarChart3" }
      ]
    },
    footer: {
      desc: "ช่วยให้ธุรกิจท้องถิ่นเติบโตอย่างมั่นคง...",
      copyright: "© 2026 Growkub.",
      links: {
        terms: "/terms",
        privacy: "/privacy",
        contact: "/contact"
      }
    }
  });

  useEffect(() => {
    async function fetchConfig() {
      // Try to load from cache first
      const { getCachedConfig, setCachedConfig } = await import('@/lib/cache');
      const cached = getCachedConfig();

      if (cached) {
        setConfig(cached);
      }

      // Fetch latest from Firestore in background
      try {
        const docRef = doc(db, "configs", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const freshData = docSnap.data() as any;
          setConfig(freshData);
          setCachedConfig(freshData);
        }
      } catch (err) {
        console.error("Config fetch error:", err);
      }
    }
    fetchConfig();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#services" className="hover:text-primary transition-colors">บริการของเรา</a>
            <a href="#pos" className="hover:text-primary transition-colors">POS ฟรี</a>
            <a href="#dev" className="hover:text-primary transition-colors">รับเขียนโปรแกรม</a>
            <a href="/about" className="hover:text-primary transition-colors">เกี่ยวกับเรา</a>
            <button className="bg-primary text-black px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform active:scale-95">
              เริ่มต้นใช้งาน
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />

          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 animate-fade-in text-secondary">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium">{config.hero.badge}</span>
            </div>

            <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
              {config.hero.line1} <br />
              <span className="text-primary italic">{config.hero.line2}</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-12 drop-shadow-lg">
              {config.hero.sub}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary text-black rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-accent transition-colors shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                เริ่มใช้งานฟรีวันนี้ <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-sm">
                ดูบริการทั้งหมด
              </button>
            </div>

            {/* Service Grid Section */}
            <div className="mt-24">
              <div className="text-center mb-12">
                <p className="text-primary font-bold text-sm mb-2 uppercase tracking-[0.2em]">Our Ecosystem</p>
                <h2 className="text-3xl md:text-5xl font-black">ใช้งานได้จริงทุกที่ ทุกเวลา</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {config.services.map((service, idx) => (
                  <ServiceGridCard
                    key={idx}
                    icon={service.icon === "Building2" ? <Building2 className="text-primary" size={28} /> :
                      service.icon === "ShoppingBag" ? <ShoppingBag className="text-secondary" size={28} /> :
                        service.icon === "QrCode" ? <QrCode className="text-primary" size={28} /> :
                          <CalendarCheck className="text-secondary" size={28} />}
                    title={service.title}
                    desc={service.desc}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Development Services Section */}
        <section id="dev" className="py-24 relative overflow-hidden bg-zinc-950">
          <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] -z-10" />
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="border border-white/10 rounded-[40px] p-2 bg-gradient-to-br from-zinc-800 to-black shadow-2xl transform -rotate-2">
                  <div className="relative aspect-[9/16] w-full max-w-[320px] mx-auto rounded-[32px] overflow-hidden border border-white/5">
                    <Image
                      src="/images/pos_ui.jpg"
                      alt="Custom Application View"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -top-10 -right-10 bg-primary/20 backdrop-blur-xl border border-primary/30 p-6 rounded-3xl hidden md:block">
                  <Code2 className="text-primary mb-2" size={32} />
                  <p className="font-bold">Custom Build</p>
                  <p className="text-xs text-muted-foreground">Tailored for you</p>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider">Business Solutions</span>
                </div>
                <h2 className="text-5xl font-black mb-8 leading-tight">
                  {config.dev?.heading.split(' ').map((word, i) => (
                    <span key={i} className={i === 1 ? "text-primary" : ""}>{word} </span>
                  )) || "รับเขียนโปรแกรม ระบบสำหรับธุรกิจ"}
                </h2>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                  {config.dev?.sub}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {config.dev?.items?.map((item, idx) => {
                    const IconComponent = IconMap[item.icon] || Code2;
                    return (
                      <div key={idx} className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <IconComponent className="text-primary" size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="services" className="py-24 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">{config.features?.heading || "ครบทุกฟังก์ชันที่ธุรกิจต้องการ"}</h2>
              <p className="text-muted-foreground text-lg italic">{config.features?.sub || "เราเติบโตไปพร้อมกับความสำเร็จของคุณ ไม่มีค่าธรรมเนียมรายเดือน"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {config.features?.items?.map((item, idx) => {
                const IconComponent = IconMap[item.icon] || Zap;
                return (
                  <FeatureCard
                    key={idx}
                    icon={<IconComponent className="text-primary" size={32} />}
                    title={item.title}
                    description={item.desc}
                  />
                )
              })}
            </div>
          </div>
        </section>

        {/* POS Spotlight */}
        <section id="pos" className="py-24 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8">
                {config.spotlight.heading}
              </h2>
              <div className="space-y-6 mb-12">
                {config.spotlight.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="text-primary" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="px-10 py-5 bg-primary text-black rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                รับระบบ POS ฟรี ของคุณทันที
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-black shadow-2xl rounded-[40px] flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden group border border-white/10">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                >
                  <source src="/videos/delivery_promo.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent group-hover:opacity-0 transition-opacity" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-black p-8 rounded-3xl font-black text-2xl animate-bounce shadow-2xl z-20">
                ฟรี 100%
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-black font-black">G</span>
            </div>
            <span className="text-xl font-bold tracking-tighter">{config.site.logoText}</span>
          </div>
          <p className="text-muted-foreground mb-8 italic">{config.footer?.desc}</p>
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <a href={config.footer?.links?.terms || "#"} className="hover:text-primary transition-colors">เงื่อนไขการใช้งาน</a>
            <a href={config.footer?.links?.privacy || "#"} className="hover:text-primary transition-colors">นโยบายความเป็นส่วนตัว</a>
            <a href={config.footer?.links?.contact || "#"} className="hover:text-primary transition-colors">ติดต่อเรา</a>
          </div>
          <p className="mt-12 text-xs text-muted-foreground/50">{config.footer?.copyright}</p>
        </div>
      </footer>
    </div>
  );
}

function ServiceGridCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-500 backdrop-blur-sm relative overflow-hidden text-left">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl border border-white/5 bg-white/5 hover:border-primary/20 hover:bg-white/10 transition-all group">
      <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
