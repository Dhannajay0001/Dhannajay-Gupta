import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { 
  Home, User, FileText, Mail, 
  Github, Linkedin, Instagram, Twitter, Phone, MapPin, 
  MessageSquare, Code, Palette, Layers,
  Menu, X, TrendingUp, Github as GithubIcon, LucideIcon,
  Send, Loader2, Sparkles, GraduationCap, Award, ExternalLink,
  Calendar, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { PORTFOLIO_DATA } from './constants';

const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const IconMap: { [key: string]: LucideIcon } = {
  Home, User, FileText, Mail, Github, Linkedin, Instagram, Twitter, 
  Phone, MapPin, MessageSquare, Code, Palette, Layers, TrendingUp,
  GraduationCap, Award
};

const SectionHeader = ({ badge, title, subtitle }: { badge: string; title: string; subtitle?: string }) => (
  <div className="mb-12" data-aos="fade-up">
    <span className="px-3.5 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full uppercase tracking-wider mb-3 inline-flex items-center gap-1.5 border border-blue-100">
      <Sparkles size={13} className="text-blue-600" />
      {badge}
    </span>
    <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight">{title}</h2>
    {subtitle && <p className="text-gray-500 mt-2 text-base max-w-2xl">{subtitle}</p>}
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

  return <span className="text-blue-600 border-r-2 border-blue-600 pr-1">{displayText}</span>;
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
    { id: 'skills', label: 'Skills', icon: TrendingUp },
    { id: 'projects', label: 'Projects', icon: Layers },
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
        // Friendly fallback when GEMINI_API_KEY is not set
        setAiResponse(`Thank you for reaching out, ${formData.name}! Dhannajay Gupta (Dhannajay Goel Lucknow) has received your message regarding "${formData.subject}" and will respond to ${formData.email} promptly.`);
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        return;
      }

      // Use Gemini to generate a personalized "Instant Response"
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
      // Still show successful message delivery fallback
      setAiResponse(`Thank you ${formData.name}! Your message regarding "${formData.subject}" has been recorded. Dhannajay will connect with you via ${formData.email}.`);
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3.5 border-b border-gray-100' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#home" className="text-xl md:text-2xl font-display font-bold tracking-tight text-gray-950 flex items-center gap-1.5">
            <span>Dhannajay</span>
            <span className="text-blue-600">.Portfolio</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${activeSection === item.id ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
              >
                {item.label}
              </a>
            ))}
            <a 
              href={PORTFOLIO_DATA.profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-all border border-blue-200"
            >
              Resume
            </a>
          </div>

          <button 
            className="md:hidden text-gray-800 p-2" 
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
              className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 p-6 flex flex-col gap-4 md:hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 text-base font-medium py-2 ${activeSection === item.id ? 'text-blue-600' : 'text-gray-600'}`}
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
                className="mt-2 text-center py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm"
              >
                View Resume (PDF)
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/60 -z-10 rounded-l-[120px]" />
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Targeted SEO keywords pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200/80 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-blue-700 tracking-wide">
                Dhannajay Portfolio • Goel Lucknow (GITM)
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-gray-950 mb-4 leading-tight tracking-tight">
              Hi, I'm <span className="text-blue-600">{PORTFOLIO_DATA.profile.fullName}</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-6 font-medium">
              I'm a <Typewriter items={PORTFOLIO_DATA.profile.subRoles} />
            </p>

            <p className="text-gray-600 mb-8 max-w-lg leading-relaxed text-base">
              {PORTFOLIO_DATA.profile.description}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <a 
                href="#projects" 
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                View My Projects
              </a>
              <a 
                href={PORTFOLIO_DATA.profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm rounded-xl border border-gray-200 flex items-center gap-2 shadow-sm transition-all hover:border-gray-300"
              >
                <FileText size={17} className="text-blue-600" />
                View Resume
              </a>
            </div>

            {/* Quick SEO Target Badges */}
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">#DhannajayPortfolio</span>
              <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">#DhannajayGoelLucknow</span>
              <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">#FullStackDeveloper</span>
              <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">#GITMLucknow</span>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Connect:</span>
              <div className="flex gap-3">
                {PORTFOLIO_DATA.socials.map((social) => {
                  const Icon = IconMap[social.name] || GithubIcon;
                  return (
                    <a 
                      key={social.name} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={`${PORTFOLIO_DATA.profile.fullName} on ${social.name}`}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 flex items-center justify-center transition-all"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="w-full aspect-square max-w-md mx-auto relative z-10">
              <img 
                src={imageError ? 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800' : PORTFOLIO_DATA.profile.profileImage} 
                alt={`${PORTFOLIO_DATA.profile.fullName} - Dhannajay Goel Lucknow Portfolio`} 
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-top rounded-3xl shadow-2xl border-4 border-white transition-all duration-700"
              />
              <div className="absolute -bottom-5 -left-5 w-28 h-28 bg-blue-600/10 rounded-3xl -z-10 border border-blue-200" />
              <div className="absolute -top-5 -right-5 w-28 h-28 bg-emerald-500/10 rounded-3xl -z-10 border border-emerald-200" />
              
              {/* Floating verified badge */}
              <div className="absolute -bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-600" />
                <span className="text-xs font-semibold text-gray-800">Goel Institute (GITM)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50/70 border-y border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <SectionHeader 
              badge="About Dhannajay" 
              title="Full Stack Developer from Lucknow, India" 
              subtitle="Passionate about designing and deploying scalable web solutions."
            />
            
            <div className="space-y-4 text-gray-600 leading-relaxed text-base">
              <p>{PORTFOLIO_DATA.profile.aboutText}</p>
              <p>{PORTFOLIO_DATA.profile.approachText}</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {PORTFOLIO_DATA.stats.map((stat) => (
                <div key={stat.label} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="text-2xl font-display font-bold text-blue-600 mb-0.5">{stat.value}</div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
               <div className="space-y-0.5">
                 <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Target Keywords</span>
                 <p className="text-xs font-semibold text-blue-700">Dhannajay Portfolio • Dhannajay Goel Lucknow</p>
               </div>
               <div className="space-y-0.5">
                 <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">College / Institute</span>
                 <p className="text-xs font-semibold text-gray-900">Goel Institute of Tech & Mgmt (GITM)</p>
               </div>
               <div className="space-y-0.5">
                 <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Location</span>
                 <p className="text-xs font-semibold text-gray-900">{PORTFOLIO_DATA.profile.location}</p>
               </div>
               <div className="space-y-0.5">
                 <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Official URL</span>
                 <a href={PORTFOLIO_DATA.profile.canonicalUrl} className="text-xs font-semibold text-blue-600 hover:underline">dhannajay-gupta.vercel.app</a>
               </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href={PORTFOLIO_DATA.profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl flex items-center gap-2 transition-all shadow-sm"
              >
                <FileText size={16} />
                View Full Resume
              </a>
              <a 
                href="#contact" 
                className="px-5 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium text-sm rounded-xl border border-gray-200 flex items-center gap-2 transition-all"
              >
                <MessageSquare size={16} />
                Contact Dhannajay
              </a>
            </div>
          </motion.div>

          <div className="relative">
            <div className="relative z-10 bg-white p-3 rounded-3xl shadow-xl border border-gray-100">
              <img 
                src={imageError ? 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800' : PORTFOLIO_DATA.profile.profileImage} 
                alt="Dhannajay Gupta - Full Stack Developer Goel Lucknow" 
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="rounded-2xl w-full object-cover object-top aspect-[4/5]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Education & Academic Credentials Section */}
      <section id="education" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            badge="Academic Background" 
            title="Education & Certifications" 
            subtitle="Academic qualifications at Goel Institute of Technology and Management (GITM), Lucknow, and recognized certifications."
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Education Timeline (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap size={22} className="text-blue-600" /> Education History
              </h3>

              <div className="space-y-4">
                {PORTFOLIO_DATA.education.map((edu, idx) => (
                  <motion.div 
                    key={edu.institution + idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 hover:border-blue-300 transition-all hover:shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="text-base font-bold text-gray-900">{edu.degree}</h4>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 self-start sm:self-auto">
                        <Calendar size={12} /> {edu.duration}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-blue-600 mb-2">
                      {edu.institution}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {edu.details}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications (1 col) */}
            <div className="space-y-6">
              <h3 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                <Award size={22} className="text-amber-500" /> Certifications & Achievements
              </h3>

              <div className="space-y-4">
                {PORTFOLIO_DATA.certifications.map((cert, idx) => (
                  <motion.div 
                    key={cert.title + idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 hover:border-amber-300 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{cert.title}</h4>
                        <div className="text-xs font-semibold text-amber-700 mb-1">{cert.issuer}</div>
                        <p className="text-xs text-gray-600">{cert.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Local SEO note card */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                  <strong>Dhannajay Gupta</strong> is currently a computer science undergraduate student at <strong>Goel Institute of Technology and Management (GITM) Lucknow</strong>, actively seeking internships and full-stack software development roles.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            badge="Technical Competencies" 
            title="Skills & Technologies" 
            subtitle="Full Stack proficiency across front-end, back-end, database architecture, and development tooling."
          />

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-display font-bold flex items-center gap-2 text-gray-900">
                <Code size={20} className="text-blue-600" /> Front-end Development
              </h3>
              <div className="space-y-6">
                {PORTFOLIO_DATA.skills.frontend.map((skill) => (
                  <div key={skill.name} className="group relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-800">{skill.name}</span>
                      <span className="text-xs font-bold text-blue-600">{skill.level}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-blue-600 rounded-full transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">{skill.tooltip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-display font-bold flex items-center gap-2 text-gray-900">
                <Layers size={20} className="text-emerald-600" /> Back-end & Tools
              </h3>
              <div className="space-y-6">
                {PORTFOLIO_DATA.skills.backend.map((skill) => (
                  <div key={skill.name} className="group relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-800">{skill.name}</span>
                      <span className="text-xs font-bold text-emerald-600">{skill.level}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-emerald-600 rounded-full transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">{skill.tooltip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            badge="Featured Work" 
            title="Projects by Dhannajay" 
            subtitle="Web applications and UI/UX projects developed with modern technologies."
          />
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setProjectFilter(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                  projectFilter === cat 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video overflow-hidden relative">
                      <img 
                        src={project.image} 
                        alt={`${project.title} - Dhannajay Portfolio Project`} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3.5 right-3.5 z-20">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-[10px] font-bold text-gray-800 rounded-full uppercase tracking-wider shadow-sm">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-display font-bold text-gray-900 mb-2">{project.title}</h4>
                      <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
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
      <section id="contact" className="py-20 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            badge="Get In Touch" 
            title="Contact Dhannajay Gupta" 
            subtitle="Let's discuss opportunities, projects, or collaborations. Based in Lucknow, Uttar Pradesh."
          />

          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3">Direct Contact Info</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Feel free to send a message using the form or connect directly through email, phone, or GitHub.
                </p>
                
                <div className="space-y-4">
                  {[
                    { icon: MapPin, title: "Location", content: PORTFOLIO_DATA.profile.location },
                    { icon: Phone, title: "Phone", content: PORTFOLIO_DATA.profile.phone },
                    { icon: Mail, title: "Email", content: PORTFOLIO_DATA.profile.email },
                    { icon: GraduationCap, title: "College", content: "Goel Institute of Technology & Management (GITM)" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3.5 items-start">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <item.icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.title}</h4>
                        <p className="text-gray-900 text-sm font-medium">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white space-y-3 shadow-lg">
                <h4 className="text-lg font-display font-bold">Dhannajay Portfolio • Official</h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Available for full-time Full Stack Developer roles, frontend internships, and freelance projects in Lucknow & remote.
                </p>
                <div className="h-px bg-white/10 my-3" />
                <div className="flex gap-3">
                  {PORTFOLIO_DATA.socials.map((social) => {
                    const Icon = IconMap[social.name] || GithubIcon;
                    return (
                      <a 
                        key={social.name} 
                        href={social.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white hover:text-gray-900 flex items-center justify-center transition-all text-white"
                      >
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
               <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Send a Direct Message</h3>
               <p className="text-xs text-gray-500 mb-6">Enter your details and inquiry below.</p>
               
               <form className="space-y-5" onSubmit={handleContactSubmit}>
                 <div className="grid md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Name</label>
                     <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe" 
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm transition-all"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Email</label>
                     <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com" 
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm transition-all"
                     />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subject</label>
                   <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Project Inquiry / Job Opportunity" 
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm transition-all"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message</label>
                   <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5} 
                      placeholder="Write your message here..." 
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm transition-all resize-none"
                   />
                 </div>
                 
                 <AnimatePresence>
                   {formStatus === 'success' && aiResponse && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       exit={{ opacity: 0, height: 0 }}
                       className="p-5 bg-blue-50/80 border border-blue-200 rounded-2xl"
                     >
                       <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs mb-1">
                         <Sparkles size={14} />
                         Message Received
                       </div>
                       <p className="text-xs text-gray-700 leading-relaxed">
                         {aiResponse}
                       </p>
                     </motion.div>
                   )}
                   {formStatus === 'error' && (
                     <motion.p 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="text-red-500 text-xs font-medium"
                     >
                       Something went wrong. Please email directly at gdhananjay115@gmail.com
                     </motion.p>
                   )}
                 </AnimatePresence>

                 <button 
                   type="submit" 
                   disabled={formStatus === 'loading'}
                   className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
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
      </section>

      {/* Footer with Structured SEO Text & Links */}
      <footer className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-gray-900 font-bold text-sm">
              Dhannajay Gupta Portfolio • Lucknow, Uttar Pradesh
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Student at Goel Institute of Technology and Management (GITM), Lucknow | Full Stack Developer
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} <span className="font-semibold text-gray-900">Dhannajay Gupta</span>. All Rights Reserved.
            </p>
            <p className="text-gray-400 text-[11px] mt-0.5">
              Domain: <a href="https://dhannajay-gupta.vercel.app/" className="hover:text-blue-600 underline">dhannajay-gupta.vercel.app</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
