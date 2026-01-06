import { ArrowRight, BarChart3, CheckCircle2, LayoutDashboard, Zap, Shield, Gift } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-black font-black text-xl">G</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter">growkub</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#pos" className="hover:text-primary transition-colors">Free POS</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <button className="bg-primary text-black px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />
          
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-secondary">Free Forever Services</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
              GROW YOUR BUSINESS <br />
              <span className="text-primary italic">FOR FREE</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-12">
              The ultimate platform for modern entrepreneurs. Get access to premium business tools like POS systems, inventory management, and more—at zero cost.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary text-black rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-accent transition-colors shadow-[0_0_40px_rgba(250,204,21,0.2)]">
                Start Using For Free <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                Explore Services
              </button>
            </div>

            {/* Mockup Preview */}
            <div className="mt-24 relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10" />
              <div className="border border-white/10 rounded-3xl bg-zinc-900/50 p-4 backdrop-blur-sm shadow-2xl overflow-hidden">
                <div className="aspect-[16/9] w-full bg-black rounded-2xl border border-white/5 overflow-hidden relative group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LayoutDashboard className="text-primary/10 w-48 h-48 group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  {/* Fake UI Elements */}
                  <div className="absolute top-8 left-8 flex gap-4">
                    <div className="w-32 h-12 bg-white/5 rounded-lg border border-white/10" />
                    <div className="w-32 h-12 bg-white/5 rounded-lg border border-white/10" />
                  </div>
                  <div className="absolute bottom-8 right-8 w-64 h-32 bg-primary/5 rounded-2xl border border-primary/20 p-4">
                    <div className="w-1/2 h-4 bg-primary/20 rounded-full mb-4" />
                    <div className="w-full h-8 bg-primary rounded-lg shadow-lg shadow-primary/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="services" className="py-24 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">EVERYTHING YOU NEED IS FREE</h2>
              <p className="text-muted-foreground text-lg">We grow together with your success. No hidden fees, ever.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<BarChart3 className="text-primary" size={32} />}
                title="Free POS System"
                description="Modern point-of-sale system that works on any device. Track sales, staff, and customers in real-time."
              />
              <FeatureCard 
                icon={<Zap className="text-secondary" size={32} />}
                title="Ultra-Fast Performance"
                description="Built with Next.js 15 for lightning-fast speeds. Your business shouldn't wait for a loading screen."
              />
              <FeatureCard 
                icon={<Shield className="text-primary" size={32} />}
                title="Bank-Level Security"
                description="Your data is encrypted and backed up daily. We take security as seriously as your business does."
              />
              <FeatureCard 
                icon={<CheckCircle2 className="text-secondary" size={32} />}
                title="Inventory Tracking"
                description="Automatic stock updates and low-stock alerts. Never miss a sale due to missing inventory."
              />
              <FeatureCard 
                icon={<Gift className="text-primary" size={32} />}
                title="Premium Support"
                description="Even for free users, our support team is ready to help you grow your business every step of the way."
              />
              <FeatureCard 
                icon={<LayoutDashboard className="text-secondary" size={32} />}
                title="Multi-Store Control"
                description="Manage all your branch locations from a single dashboard. Scale your business effortlessy."
              />
            </div>
          </div>
        </section>

        {/* POS Spotlight */}
        <section id="pos" className="py-24 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full" />
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black leading-tight mb-8">
                Professional POS <br />
                <span className="text-secondary">At Zero Cost</span>
              </h2>
              <ul className="space-y-6 mb-12">
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={14} className="text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Unlimited Transactions</h4>
                    <p className="text-muted-foreground">Sell as much as you want without worrying about limits or tiers.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={14} className="text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Digital Receipts</h4>
                    <p className="text-muted-foreground">Save costs and the environment by sending receipts via SMS or Email.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={14} className="text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Offline Mode</h4>
                    <p className="text-muted-foreground">Keep selling even when the internet goes down. Sync back when you're online.</p>
                  </div>
                </li>
              </ul>
              <button className="px-10 py-5 bg-secondary text-white rounded-2xl font-black text-xl hover:scale-105 transition-transform">
                Claim Your Free POS
              </button>
            </div>
            <div className="relative">
               <div className="aspect-square bg-white shadow-2xl rounded-[40px] flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:opacity-100 opacity-50 transition-opacity" />
                  <span className="text-9xl group-hover:scale-110 transition-transform duration-700">🚀</span>
               </div>
               <div className="absolute -bottom-6 -left-6 bg-primary text-black p-8 rounded-3xl font-black text-2xl animate-bounce">
                  100% FREE
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-black font-black">G</span>
            </div>
            <span className="text-xl font-bold tracking-tighter">growkub</span>
          </div>
          <p className="text-muted-foreground mb-8">Empowering local businesses since 2026. Made with ❤️ for entrepreneurs.</p>
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Connect</a>
          </div>
          <p className="mt-12 text-xs text-muted-foreground/50 italic">© 2026 Growkub. All rights resolved.</p>
        </div>
      </footer>
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
