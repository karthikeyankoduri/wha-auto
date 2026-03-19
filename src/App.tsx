import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Play, Zap, Palette, BarChart3, Shield } from 'lucide-react';
import { BlurText } from './components/BlurText';
import { HLSVideo } from './components/HLSVideo';

export default function App() {
  return (
    <div className="bg-black min-h-screen overflow-visible font-body selection:bg-white/20">
      {/* SECTION 1 — NAVBAR */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
          {/* Logo placeholder */}
          <div className="w-6 h-6 bg-white rounded-sm rotate-45" />
        </div>
        
        <div className="hidden md:flex liquid-glass rounded-full px-6 py-3 items-center gap-8">
          {['Home', 'Services', 'Work', 'Process', 'Pricing'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-foreground/90 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>

        <button className="bg-white text-black rounded-full px-5 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-white/90 transition-colors font-body">
          Get Started
          <ArrowUpRight size={16} />
        </button>
      </nav>

      {/* SECTION 2 — HERO */}
      <section className="relative overflow-visible h-[1000px] bg-black flex flex-col items-center pt-[150px]">
        <div className="absolute inset-0 bg-black/5 z-0" />
        <div className="absolute bottom-0 left-0 right-0 z-[1] h-[300px] bg-gradient-to-b from-transparent to-black pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-5xl mx-auto">
          <div className="liquid-glass rounded-full px-1.5 py-1.5 pr-4 flex items-center gap-3 mb-8">
            <span className="bg-white text-black text-xs font-bold px-2.5 py-1 rounded-full">New</span>
            <span className="text-sm text-white/80 font-medium">Introducing AI-powered web design.</span>
          </div>

          <BlurText 
            text="The Website Your Brand Deserves" 
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-foreground leading-[0.8] tracking-[-4px] mb-8"
          />

          <motion.p 
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl font-body font-light text-white/60 max-w-2xl mb-12"
          >
            Stunning design. Blazing performance. Built by AI, refined by experts. This is web design, wildly reimagined.
          </motion.p>

          <motion.div 
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button className="liquid-glass-strong rounded-full px-8 py-4 text-white font-medium flex items-center gap-2 hover:bg-white/5 transition-colors font-body">
              Get Started
              <ArrowUpRight size={18} />
            </button>
            <button className="rounded-full px-8 py-4 text-white font-medium flex items-center gap-2 hover:bg-white/5 transition-colors font-body">
              <Play size={18} className="fill-white" />
              Watch the Film
            </button>
          </motion.div>
        </div>

        {/* SECTION 3 — PARTNERS BAR */}
        <div className="relative z-10 mt-auto pb-16 pt-16 flex flex-col items-center w-full">
          <div className="liquid-glass rounded-full px-4 py-1.5 text-xs font-medium text-white font-body inline-block mb-8">
            Trusted by the teams behind
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 px-6">
            {['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma'].map((partner) => (
              <span key={partner} className="text-2xl md:text-3xl font-heading italic text-white/80">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — START SECTION ("How It Works") */}
      <section className="relative w-full min-h-[700px] py-32 px-6 md:px-16 lg:px-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HLSVideo src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent z-[1]" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto min-h-[500px] justify-center">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-6">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9] mb-6">
            You dream it. We ship it.
          </h2>
          <p className="font-body font-light text-white/60 text-lg md:text-xl mb-10 max-w-2xl">
            Share your vision. Our AI handles the rest—wireframes, design, code, launch. All in days, not quarters.
          </p>
          <button className="liquid-glass-strong rounded-full px-8 py-4 text-white font-medium flex items-center gap-2 hover:bg-white/5 transition-colors font-body">
            Get Started
            <ArrowUpRight size={18} />
          </button>
        </div>
      </section>

      {/* SECTION 5 — FEATURES CHESS */}
      <section className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4">
            Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            Pro features. Zero complexity.
          </h2>
        </div>

        <div className="space-y-32">
          {/* Row 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl md:text-4xl font-heading italic text-white leading-[1]">
                Designed to convert. Built to perform.
              </h3>
              <p className="font-body font-light text-white/60 text-base md:text-lg">
                Every pixel is intentional. Our AI studies what works across thousands of top sites—then builds yours to outperform them all.
              </p>
              <button className="liquid-glass-strong rounded-full px-6 py-3 text-white font-medium inline-flex items-center gap-2 hover:bg-white/5 transition-colors font-body mt-4">
                Learn more
              </button>
            </div>
            <div className="flex-1 w-full">
              <div className="liquid-glass rounded-2xl overflow-hidden aspect-video relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <img 
                  src="https://picsum.photos/seed/design/800/600" 
                  alt="Design interface" 
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl md:text-4xl font-heading italic text-white leading-[1]">
                It gets smarter. Automatically.
              </h3>
              <p className="font-body font-light text-white/60 text-base md:text-lg">
                Your site evolves on its own. AI monitors every click, scroll, and conversion—then optimizes in real time. No manual updates. Ever.
              </p>
              <button className="rounded-full px-6 py-3 text-white font-medium inline-flex items-center gap-2 hover:bg-white/5 transition-colors font-body mt-4 border border-white/10">
                See how it works
              </button>
            </div>
            <div className="flex-1 w-full">
              <div className="liquid-glass rounded-2xl overflow-hidden aspect-video relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <img 
                  src="https://picsum.photos/seed/analytics/800/600" 
                  alt="Analytics interface" 
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — FEATURES GRID */}
      <section className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4">
            Why Us
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            The difference is everything.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: "Days, Not Months", desc: "Concept to launch at a pace that redefines fast." },
            { icon: Palette, title: "Obsessively Crafted", desc: "Every detail considered. Every element refined." },
            { icon: BarChart3, title: "Built to Convert", desc: "Layouts informed by data. Decisions backed by performance." },
            { icon: Shield, title: "Secure by Default", desc: "Enterprise-grade protection comes standard." }
          ].map((feature, i) => (
            <div key={i} className="liquid-glass rounded-2xl p-6 flex flex-col gap-4">
              <div className="liquid-glass-strong rounded-full w-10 h-10 flex items-center justify-center">
                <feature.icon size={18} className="text-white" />
              </div>
              <h3 className="text-lg font-heading italic text-white">{feature.title}</h3>
              <p className="text-white/60 font-body font-light text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — STATS */}
      <section className="relative w-full py-32 px-6 md:px-16 lg:px-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HLSVideo 
            src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8" 
            style={{ filter: 'saturate(0)' }}
          />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent z-[1]" />
        
        <div className="relative z-10 w-full max-w-5xl">
          <div className="liquid-glass rounded-3xl p-12 md:p-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "200+", label: "Sites launched" },
              { value: "98%", label: "Client satisfaction" },
              { value: "3.2x", label: "More conversions" },
              { value: "5 days", label: "Average delivery" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white">{stat.value}</div>
                <div className="text-white/60 font-body font-light text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — TESTIMONIALS */}
      <section className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4">
            What They Say
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            Don't take our word for it.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "A complete rebuild in five days. The AI-driven approach is nothing short of magic. Our team is blown away.", name: "Sarah Chen", role: "CEO, Luminary" },
            { quote: "Conversions up 4x since launch. It's not just a pretty site, it's a performance machine built for growth.", name: "Marcus Webb", role: "Head of Growth, Arcline" },
            { quote: "They didn't just design our site, they elevated our entire brand identity. The attention to detail is unmatched.", name: "Elena Voss", role: "Brand Director, Helix" }
          ].map((testimonial, i) => (
            <div key={i} className="liquid-glass rounded-2xl p-8 flex flex-col justify-between gap-8">
              <p className="text-white/80 font-body font-light text-sm italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div>
                <div className="text-white font-body font-medium text-sm">{testimonial.name}</div>
                <div className="text-white/50 font-body font-light text-xs">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9 — CTA FOOTER */}
      <section className="relative w-full pt-32 pb-8 px-6 md:px-16 lg:px-24 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HLSVideo src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent z-[1]" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9] mb-6">
            Your next website starts here.
          </h2>
          <p className="font-body font-light text-white/60 text-lg md:text-xl mb-10">
            Book a free strategy call. See what AI-powered design can do.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-32">
            <button className="liquid-glass-strong rounded-full px-8 py-4 text-white font-medium flex items-center gap-2 hover:bg-white/5 transition-colors font-body">
              Book a Call
            </button>
            <button className="bg-white text-black rounded-full px-8 py-4 font-medium flex items-center gap-2 hover:bg-white/90 transition-colors font-body">
              View Pricing
            </button>
          </div>

          <footer className="w-full pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/40 text-xs font-body">
              © 2026 Studio
            </div>
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Contact'].map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="text-white/40 hover:text-white/80 text-xs font-body transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
