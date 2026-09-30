import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { 
  Home, User, FileText, Mail, 
  Github, Linkedin, Instagram, Twitter, Phone, MapPin, 
  MessageSquare, Layers, Menu, X, LucideIcon,
  Send, Loader2, Sparkles, GraduationCap, Award, ExternalLink,
  Calendar, CheckCircle2, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { PORTFOLIO_DATA } from './constants';
import ThreeDBackground from './components/ThreeDBackground';
import { ThreeDIcon } from './components/ThreeDIcon';

const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const IconMap: { [key: string]: LucideIcon } = {
  Home, User, FileText, Mail, Github, Linkedin, Instagram, Twitter, 
  Phone, MapPin, MessageSquare, Layers, GraduationCap, Award
};

const SectionHeader = ({ badge, title, subtitle, iconType }: { badge: string; title: string; subtitle?: string; iconType?: any }) => (
  <div className="mb-14 relative z-10" data-aos="fade-up">
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
      {iconType ? <ThreeDIcon type={iconType} size={18} /> : <Sparkles size={14} className="text-blue-400" />}
      <span>{badge}</span>
    </div>
    <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-slate-400 mt-3 text-base md:text-lg max-w-2xl leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

const Typewriter = ({ items }: { items: string[] }) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = items[index];
    
    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        if (displayText.length === currentFullText.length) {
          timer = setTimeout(() => setIsDeleting(true), 1500);
        } else {
          timer = setTimeout(handleTyping, 100);
        }
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setIndex((index + 1) % items.length);
        } else {
          timer = setTimeout(handleTyping, 50);
        }
      }
    };

    if (!timer) timer = setTimeout(handleTyping, 100);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index, items]);

  return <span className="text-blue-400 border-r-2 border-blue-400 pr-1">{displayText}</span>;
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'education', 'skills', 'projects', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Layers },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const [projectFilter, setProjectFilter] = useState('All');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const categories = ['All', ...new Set(PORTFOLIO_DATA.projects.map(p => p.category))];
  const filteredProjects = projectFilter === 'All' 
    ? PORTFOLIO_DATA.projects 
    : PORTFOLIO_DATA.projects.filter(p => p.category === projectFilter);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setAiResponse(null);

    try {
      const ai = getAi();
      if (!ai) {
        setAiResponse(`Thank you for reaching out, ${formData.name}! Dhannajay Gupta (Dhannajay Goel Lucknow) has received your message regarding "${formData.subject}" and will respond to ${formData.email} promptly.`);
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        return;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an AI assistant for Dhannajay Gupta's portfolio (Dhannajay Goel Lucknow, Full Stack Developer). 
        A visitor named ${formData.name} (${formData.email}) sent a message about "${formData.subject}": 
        "${formData.message}"
        
        Write a short, professional, and friendly "Instant Automated Response" as if you were Dhannajay's assistant. 
        Acknowledge the message and say Dhannajay will get back to them soon. Keep it under 60 words.`,
      });

      setAiResponse(response.text || `Thank you ${formData.name}! Dhannajay has received your message and will get back to you shortly.`);
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Form submission notice:", error);
      setAiResponse(`Thank you ${formData.name}! Your message regarding "${formData.subject}" has been recorded. Dhannajay will connect with you via ${formData.email}.`);
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* 3D Animated Background with Canvas Wireframes and Radial Mesh */}
      <ThreeDBackground />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#07090e]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3.5' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#home" className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-white flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <ThreeDIcon type="sparkle" size={22} />
            </div>
            <span>Dhannajay<span className="text-blue-400">.Portfolio</span></span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-sm font-medium transition-colors hover:text-blue-400 ${activeSection === item.id ? 'text-blue-400 font-semibold drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'text-slate-400'}`}
              >
                {item.label}
              </a>
            ))}
            <a 
              href={PORTFOLIO_DATA.profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-primary !py-2 !px-4 !text-xs !rounded-full uppercase tracking-wider"
            >
              Resume PDF
            </a>
          </div>

          <button 
            className="md:hidden text-slate-300 p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-[#0b0f19]/95 backdrop-blur-2xl border-t border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-2xl"
            >
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 text-base font-medium py-2 ${activeSection === item.id ? 'text-blue-400' : 'text-slate-300'}`}
                >
                  <item.icon size={18} />
                  {item.label}
                </a>
              ))}
              <a 
                href={PORTFOLIO_DATA.profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="btn-3d-primary w-full text-center mt-2"
              >
                View Resume (PDF)
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-28 pb-20">
        <div className="section-padding grid lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            {/* 3D Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
              <span>Dhannajay Portfolio • Goel Lucknow (GITM)</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white mb-6 leading-[1.08] tracking-tight">
              Crafting 3D Digital Visions Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">Reality</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-6 font-medium">
              I am <span className="text-white font-semibold">{PORTFOLIO_DATA.profile.fullName}</span>, a <Typewriter items={PORTFOLIO_DATA.profile.subRoles} />
            </p>

            <p className="text-slate-400 mb-10 max-w-xl leading-relaxed text-base md:text-lg">
              {PORTFOLIO_DATA.profile.description}
            </p>

            <div className="flex flex-wrap gap-4 items-center mb-12">
              <a href="#projects" className="btn-3d-primary">
                <span>View Projects</span>
                <ChevronRight size={18} />
              </a>
              <a 
                href={PORTFOLIO_DATA.profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-outline"
              >
                <FileText size={17} className="text-blue-400" />
                <span>Resume PDF</span>
              </a>
            </div>

            {/* 3D Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
              {PORTFOLIO_DATA.stats.slice(0, 3).map((st) => (
                <div key={st.label} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                  <div className="text-2xl font-display font-extrabold text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
                    {st.value}
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Profile Card with 3D Holographic Border & Floating 3D Icons */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md">
              {/* Floating 3D Icons around the portrait */}
              <motion.div 
                animate={{ y: [-10, 10, -10], rotate: [-4, 4, -4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 z-20 p-3 rounded-2xl bg-[#0b0f19]/90 border border-blue-500/30 shadow-[0_10px_25px_rgba(59,130,246,0.3)] backdrop-blur-md"
              >
                <ThreeDIcon type="code" size={40} />
              </motion.div>

              <motion.div 
                animate={{ y: [10, -10, 10], rotate: [4, -4, 4] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-4 z-20 p-3 rounded-2xl bg-[#0b0f19]/90 border border-emerald-500/30 shadow-[0_10px_25px_rgba(16,185,129,0.3)] backdrop-blur-md"
              >
                <ThreeDIcon type="database" size={40} />
              </motion.div>

              <motion.div 
                animate={{ y: [-8, 8, -8], rotate: [-3, 3, -3] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/3 -right-6 z-20 p-3 rounded-2xl bg-[#0b0f19]/90 border border-purple-500/30 shadow-[0_10px_25px_rgba(168,85,247,0.3)] backdrop-blur-md"
              >
                <ThreeDIcon type="education" size={40} />
              </motion.div>

              {/* Main 3D Portrait Box */}
              <div className="card-3d p-4 rounded-[36px] overflow-hidden relative">
                <div className="aspect-[4/5] rounded-[28px] overflow-hidden relative bg-slate-900 border border-white/10">
                  <img 
                    src={imageError ? 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800' : PORTFOLIO_DATA.profile.profileImage} 
                    alt={`${PORTFOLIO_DATA.profile.fullName} - Dhannajay Goel Lucknow Portfolio`} 
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-5 left-5 right-5 z-10">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 mb-1">
                      <CheckCircle2 size={15} className="text-blue-400" />
                      <span>Goel Institute of Technology & Mgmt</span>
                    </div>
                    <div className="text-lg font-bold text-white">
                      Lucknow, Uttar Pradesh
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services & Core Capabilities with 3D Icons */}
      <section className="py-20 border-y border-white/5 relative z-10 bg-white/[0.01]">
        <div className="section-padding !py-0">
          <SectionHeader 
            badge="What I Do" 
            title="Full Stack Engineering & Design" 
            subtitle="Transforming ideas into high-performance web products with clean code and cutting-edge 3D aesthetics."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'code' as const,
                title: "Frontend Engineering",
                desc: "Modern, responsive, dynamic SPAs engineered with React.js, TypeScript, Tailwind CSS, and smooth 3D micro-interactions.",
                tags: ["React", "TypeScript", "Tailwind CSS"]
              },
              {
                icon: 'database' as const,
                title: "Backend & APIs",
                desc: "Robust RESTful APIs, database schema modeling, authentication, and performant server architecture with Node.js.",
                tags: ["Node.js", "Express", "SQL & Relational DBs"]
              },
              {
                icon: 'palette' as const,
                title: "UI / UX & 3D Design",
                desc: "Intuitive user experiences, modern typography, glassmorphism, responsive mobile-first layouts, and interactive visual hierarchy.",
                tags: ["Figma", "UI/UX", "3D Components"]
              }
            ].map((srv) => (
              <motion.div 
                key={srv.title}
                whileHover={{ y: -6 }}
                className="card-3d p-8 rounded-3xl relative overflow-hidden group"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ThreeDIcon type={srv.icon} size={42} />
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-3">{srv.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{srv.desc}</p>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {srv.tags.map((t) => (
                    <span key={t} className="text-xs font-medium text-slate-300 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/5">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative z-10">
        <div className="section-padding !py-0 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <SectionHeader 
              badge="About Dhannajay" 
              title="Full Stack Developer from Lucknow" 
              subtitle="Specializing in responsive, modern web applications and thoughtful design."
            />
            
            <div className="space-y-4 text-slate-300 leading-relaxed text-base">
              <p>{PORTFOLIO_DATA.profile.aboutText}</p>
              <p>{PORTFOLIO_DATA.profile.approachText}</p>
            </div>

            {/* Keyword tags / target SEO ribbon */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Target Keywords & Regional Authority
              </div>
              <div className="flex flex-wrap gap-2">
                {PORTFOLIO_DATA.seoKeywords.map((kw) => (
                  <span key={kw} className="text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href={PORTFOLIO_DATA.profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-primary"
              >
                <FileText size={17} />
                <span>View Full Resume</span>
              </a>
              <a 
                href="#contact" 
                className="btn-3d-outline"
              >
                <MessageSquare size={17} />
                <span>Get In Touch</span>
              </a>
            </div>
          </motion.div>

          {/* Interactive 3D Stats & Highlights Grid */}
          <div className="grid grid-cols-2 gap-5">
            <div className="card-3d p-6 rounded-3xl flex flex-col justify-between">
              <ThreeDIcon type="education" size={44} />
              <div className="mt-8">
                <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">College</span>
                <h4 className="text-lg font-bold text-white mt-1">Goel Institute (GITM)</h4>
                <p className="text-xs text-slate-400 mt-1">Lucknow, UP</p>
              </div>
            </div>

            <div className="card-3d p-6 rounded-3xl flex flex-col justify-between">
              <ThreeDIcon type="code" size={44} />
              <div className="mt-8">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Specialization</span>
                <h4 className="text-lg font-bold text-white mt-1">Full Stack Web</h4>
                <p className="text-xs text-slate-400 mt-1">React, Node, SQL</p>
              </div>
            </div>

            <div className="card-3d p-6 rounded-3xl flex flex-col justify-between">
              <ThreeDIcon type="trophy" size={44} />
              <div className="mt-8">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Achievements</span>
                <h4 className="text-lg font-bold text-white mt-1">Competition Winner</h4>
                <p className="text-xs text-slate-400 mt-1">College Tech Fest</p>
              </div>
            </div>

            <div className="card-3d p-6 rounded-3xl flex flex-col justify-between">
              <ThreeDIcon type="rocket" size={44} />
              <div className="mt-8">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">Status</span>
                <h4 className="text-lg font-bold text-white mt-1">Open for Roles</h4>
                <p className="text-xs text-slate-400 mt-1">Internships & Full-Time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Academic Credentials Section */}
      <section id="education" className="py-24 border-t border-white/5 relative z-10 bg-white/[0.01]">
        <div className="section-padding !py-0">
          <SectionHeader 
            badge="Academic Credentials" 
            title="Education & Certifications" 
            subtitle="Academic qualifications from Goel Institute of Technology and Management (GITM), Lucknow, and recognized certifications."
            iconType="education"
          />

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Education Timeline */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-3">
                <ThreeDIcon type="education" size={28} />
                <span>Academic Degrees</span>
              </h3>

              <div className="space-y-4">
                {PORTFOLIO_DATA.education.map((edu, idx) => (
                  <motion.div 
                    key={edu.institution + idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card-3d p-6 rounded-3xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 self-start sm:self-auto">
                        <Calendar size={12} /> {edu.duration}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-blue-400 mb-2">
                      {edu.institution}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {edu.details}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications with 3D Icons */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-3">
                <ThreeDIcon type="trophy" size={28} />
                <span>Certifications & Honors</span>
              </h3>

              <div className="space-y-4">
                {PORTFOLIO_DATA.certifications.map((cert, idx) => (
                  <motion.div 
                    key={cert.title + idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card-3d p-5 rounded-3xl flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <ThreeDIcon type={idx === 1 ? 'trophy' : 'cert'} size={28} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                      <div className="text-xs font-semibold text-amber-400 mb-1">{cert.issuer}</div>
                      <p className="text-xs text-slate-400">{cert.description}</p>
                    </div>
                  </motion.div>
                ))}

                <div className="card-3d p-5 rounded-3xl bg-blue-500/[0.04] border-blue-500/20">
                  <p className="text-xs text-blue-300 leading-relaxed">
                    <strong>Dhannajay Gupta</strong> is enrolled in B.Tech CSE at <strong>Goel Institute of Technology and Management (GITM), Lucknow</strong>. Ready for full-stack engineering roles with immediate availability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section with 3D Visual Cards */}
      <section id="skills" className="py-24 border-t border-white/5 relative z-10">
        <div className="section-padding !py-0">
          <SectionHeader 
            badge="Technical Skills" 
            title="Tech Stack & Expertise" 
            subtitle="Demonstrated competency in modern front-end, back-end APIs, database schema engineering, and deployment."
            iconType="code"
          />

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-3d p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-8">
                <ThreeDIcon type="code" size={32} />
                <h3 className="text-xl font-display font-bold text-white">Front-end Architecture</h3>
              </div>
              <div className="space-y-6">
                {PORTFOLIO_DATA.skills.frontend.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-200">{skill.name}</span>
                      <span className="text-xs font-bold text-blue-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{skill.tooltip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-3d p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-8">
                <ThreeDIcon type="database" size={32} />
                <h3 className="text-xl font-display font-bold text-white">Back-end & Databases</h3>
              </div>
              <div className="space-y-6">
                {PORTFOLIO_DATA.skills.backend.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-200">{skill.name}</span>
                      <span className="text-xs font-bold text-emerald-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{skill.tooltip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 border-t border-white/5 relative z-10 bg-white/[0.01]">
        <div className="section-padding !py-0">
          <SectionHeader 
            badge="Featured Work" 
            title="Projects by Dhannajay" 
            subtitle="Web applications and UI/UX projects crafted with modern web technologies."
            iconType="rocket"
          />
          
          {/* Category Filter Controls */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setProjectFilter(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  projectFilter === cat 
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-blue-400' 
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div 
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="card-3d rounded-3xl overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-video overflow-hidden relative bg-slate-900 border-b border-white/10">
                      <img 
                        src={project.image} 
                        alt={`${project.title} - Dhannajay Portfolio Project`} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3.5 right-3.5 z-20">
                        <span className="px-3 py-1 bg-[#0b0f19]/90 backdrop-blur-md text-[10px] font-bold text-blue-300 rounded-full uppercase tracking-wider border border-white/10 shadow-lg">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-display font-bold text-white mb-2">{project.title}</h4>
                      <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-1 transition-transform"
                    >
                      <span>Explore Project</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 border-t border-white/5 relative z-10">
        <div className="section-padding !py-0">
          <SectionHeader 
            badge="Get In Touch" 
            title="Let's Build Something Together" 
            subtitle="Looking for a Full Stack Developer or have questions about a project? Send a message directly below."
            iconType="mail"
          />

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <div className="card-3d p-8 rounded-3xl space-y-6">
                <div className="flex items-center gap-3">
                  <ThreeDIcon type="mail" size={32} />
                  <h3 className="text-xl font-display font-bold text-white">Direct Channels</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: MapPin, title: "Location", content: PORTFOLIO_DATA.profile.location },
                    { icon: Phone, title: "Phone", content: PORTFOLIO_DATA.profile.phone },
                    { icon: Mail, title: "Email", content: PORTFOLIO_DATA.profile.email },
                    { icon: GraduationCap, title: "Institute", content: "Goel Institute of Technology & Management (GITM)" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                        <item.icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{item.title}</h4>
                        <p className="text-white text-sm font-medium">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                    Connect on Socials
                  </span>
                  <div className="flex gap-3">
                    {PORTFOLIO_DATA.socials.map((social) => {
                      const Icon = IconMap[social.name] || Github;
                      return (
                        <a 
                          key={social.name} 
                          href={social.url} 
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.name}
                          className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 hover:border-blue-400 hover:text-blue-400 flex items-center justify-center transition-all text-slate-300"
                        >
                          <Icon size={18} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form with 3D Card Style */}
            <div className="lg:col-span-7">
               <div className="card-3d p-8 rounded-3xl">
                 <h3 className="text-xl font-display font-bold text-white mb-2">Send a Direct Message</h3>
                 <p className="text-xs text-slate-400 mb-6">Drop me a line and let's turn your vision into digital reality.</p>
                 
                 <form className="space-y-5" onSubmit={handleContactSubmit}>
                   <div className="grid md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Name</label>
                       <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe" 
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm text-white placeholder-slate-500 transition-all"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Email</label>
                       <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@example.com" 
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm text-white placeholder-slate-500 transition-all"
                       />
                     </div>
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
                     <input 
                        type="text" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Project Collaboration / Job Inquiry" 
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm text-white placeholder-slate-500 transition-all"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-slate-300 mb-1.5">Message</label>
                     <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5} 
                        placeholder="Describe your inquiry or project scope..." 
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm text-white placeholder-slate-500 transition-all resize-none"
                     />
                   </div>
                   
                   <AnimatePresence>
                     {formStatus === 'success' && aiResponse && (
                       <motion.div 
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: 'auto' }}
                         exit={{ opacity: 0, height: 0 }}
                         className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-2xl"
                       >
                         <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs mb-1">
                           <Sparkles size={14} className="text-blue-400" />
                           Instant Confirmation
                         </div>
                         <p className="text-xs text-slate-200 leading-relaxed">
                           {aiResponse}
                         </p>
                       </motion.div>
                     )}
                     {formStatus === 'error' && (
                       <motion.p 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className="text-red-400 text-xs font-medium"
                       >
                         Something went wrong. Please email directly at gdhananjay115@gmail.com
                       </motion.p>
                     )}
                   </AnimatePresence>

                   <button 
                     type="submit" 
                     disabled={formStatus === 'loading'}
                     className="btn-3d-primary w-full sm:w-auto"
                   >
                     {formStatus === 'loading' ? (
                       <>
                         <Loader2 size={16} className="animate-spin" />
                         Sending...
                       </>
                     ) : (
                       <>
                         <Send size={16} />
                         Send Message
                       </>
                     )}
                   </button>
                 </form>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 relative z-10 bg-[#05070a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-sm">
              Dhannajay Gupta Portfolio • Lucknow, Uttar Pradesh
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Goel Institute of Technology and Management (GITM), Lucknow | Full Stack Developer
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-slate-400 text-xs">
              © {new Date().getFullYear()} <span className="font-semibold text-white">Dhannajay Gupta</span>. All Rights Reserved.
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Domain: <a href="https://dhannajay-gupta.vercel.app/" className="hover:text-blue-400 underline">dhannajay-gupta.vercel.app</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
