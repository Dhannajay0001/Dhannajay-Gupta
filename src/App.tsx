import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { 
  Home, User, FileText, Image as ImageIcon, Server, Mail, 
  Github, Linkedin, Instagram, Twitter, Phone, MapPin, 
  Download, MessageSquare, Check, Code, Palette, Layers,
  Menu, X, TrendingUp, Github as GithubIcon, LucideIcon,
  Send, Loader2, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { jsPDF } from "jspdf";
import { PORTFOLIO_DATA } from './constants';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const downloadResume = () => {
  const doc = new jsPDF();
  const data = PORTFOLIO_DATA;
  
  // Professional Resume Layout
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(data.profile.fullName.toUpperCase(), 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Lucknow, Uttar Pradesh | ${data.profile.phone} | ${data.profile.email}`, 105, 28, { align: 'center' });
  
  // Line
  doc.setLineWidth(0.5);
  doc.line(20, 32, 190, 32);
  
  let y = 40;
  
  // Education
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("EDUCATION", 20, y);
  y += 7;
  doc.setLineWidth(0.2);
  doc.line(20, y - 2, 190, y - 2);
  
  (data as any).education.forEach((edu: any) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(edu.institution, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(edu.duration, 190, y, { align: 'right' });
    y += 5;
    doc.setFont("helvetica", "italic");
    doc.text(`${edu.degree} - ${edu.details}`, 20, y);
    y += 8;
  });
  
  // Skills
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TECHNICAL SKILLS", 20, y);
  y += 7;
  doc.line(20, y - 2, 190, y - 2);
  
  doc.setFontSize(11);
  const frontend = data.skills.frontend.map(s => s.name).join(", ");
  const backend = data.skills.backend.map(s => s.name).join(", ");
  
  doc.setFont("helvetica", "bold");
  doc.text("Frontend: ", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(frontend, 45, y);
  y += 6;
  
  doc.setFont("helvetica", "bold");
  doc.text("Backend: ", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(backend, 45, y);
  y += 6;
  
  doc.setFont("helvetica", "bold");
  doc.text("Languages: ", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(data.profile.languages.join(", ") + ", Java, SQL", 45, y);
  y += 10;
  
  // Projects
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("PROJECTS", 20, y);
  y += 7;
  doc.line(20, y - 2, 190, y - 2);
  
  data.projects.forEach((proj: any) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(proj.title, 20, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(proj.description, 160);
    doc.text(splitDesc, 20, y);
    y += (splitDesc.length * 5) + 3;
  });
  
  // Certifications
  if ((data as any).certifications) {
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("CERTIFICATIONS", 20, y);
    y += 7;
    doc.line(20, y - 2, 190, y - 2);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    (data as any).certifications.forEach((cert: string) => {
      doc.text(`• ${cert}`, 20, y);
      y += 6;
    });
  }

  doc.save(`${data.profile.fullName.replace(" ", "_")}_Resume.pdf`);
};

const IconMap: { [key: string]: LucideIcon } = {
  Home, User, FileText, ImageIcon, Server, Mail, Github, Linkedin, Instagram, Twitter, 
  Phone, MapPin, Download, MessageSquare, Check, Code, Palette, Layers, TrendingUp
};

const SectionHeader = ({ badge, title }: { badge: string; title: string }) => (
  <div className="mb-12" data-aos="fade-up">
    <span className="px-3 py-1 bg-brand-accent/10 text-brand-accent text-xs font-semibold rounded-full uppercase tracking-wider mb-4 inline-block">
      {badge}
    </span>
    <h2 className="text-3xl md:text-4xl font-display text-brand-primary">{title}</h2>
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

  return <span className="text-brand-accent border-r-2 border-brand-accent pr-1">{displayText}</span>;
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
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
      // Use Gemini to generate a personalized "Instant Response"
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an AI assistant for Dhannajay Gupta's portfolio. 
        A visitor named ${formData.name} (${formData.email}) sent a message about "${formData.subject}": 
        "${formData.message}"
        
        Write a short, professional, and friendly "Instant Automated Response" as if you were Dhannajay's assistant. 
        Acknowledge the message and say Dhannajay will get back to them soon. Keep it under 60 words.`,
      });

      setAiResponse(response.text);
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Form submission failed:", error);
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-brand-accent/30">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#home" className="text-2xl font-display font-bold tracking-tight text-brand-primary">
            Port<span className="text-brand-accent">Folio</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-sm font-medium transition-colors hover:text-brand-accent ${activeSection === item.id ? 'text-brand-accent' : 'text-gray-500'}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <button 
            className="md:hidden text-brand-primary" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 p-6 flex flex-col gap-4 md:hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 text-lg font-medium ${activeSection === item.id ? 'text-brand-accent' : 'text-gray-500'}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -z-10 rounded-l-[100px]" />
        <div className="section-padding grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display text-brand-primary mb-4 leading-tight">
              I'm <span className="text-brand-accent">{PORTFOLIO_DATA.profile.firstName}</span>
              <br /> {PORTFOLIO_DATA.profile.lastName}
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 mb-8 font-light">
              I'm a <Typewriter items={PORTFOLIO_DATA.profile.subRoles} />
            </p>
            <p className="text-gray-600 mb-10 max-w-lg leading-relaxed">
              {PORTFOLIO_DATA.profile.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="btn-primary">View My Work</a>
              <button 
                onClick={downloadResume}
                className="btn-outline flex items-center gap-2 group transition-all"
              >
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                Resume
              </button>
            </div>
            
            <div className="mt-12 flex gap-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
              {PORTFOLIO_DATA.socials.map((social) => {
                const Icon = IconMap[social.name] || GithubIcon;
                return (
                  <a key={social.name} href={social.url} className="text-brand-primary hover:text-brand-accent transition-colors">
                    <Icon size={24} />
                  </a>
                );
              })}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="w-full aspect-square max-w-md mx-auto relative z-10">
              <img 
                src={PORTFOLIO_DATA.profile.profileImage} 
                alt={PORTFOLIO_DATA.profile.fullName} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-accent rounded-3xl -z-10" />
              <div className="absolute -top-6 -right-6 w-32 h-32 border-4 border-gray-100 rounded-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-50/50 relative overflow-hidden">
        <div className="section-padding grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <SectionHeader badge="Get to Know Me" title="Passionate About Design. Develop. Deploy. Deliver." />
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{PORTFOLIO_DATA.profile.aboutText}</p>
              <p>{PORTFOLIO_DATA.profile.approachText}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8">
              {PORTFOLIO_DATA.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-display font-bold text-brand-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
               <div className="space-y-1">
                 <span className="text-[10px] uppercase tracking-widest text-gray-400">Specialization</span>
                 <p className="text-sm font-medium text-brand-primary">{PORTFOLIO_DATA.profile.specialization}</p>
               </div>
               <div className="space-y-1">
                 <span className="text-[10px] uppercase tracking-widest text-gray-400">Education</span>
                 <p className="text-sm font-medium text-brand-primary">{PORTFOLIO_DATA.profile.education}</p>
               </div>
               <div className="space-y-1">
                 <span className="text-[10px] uppercase tracking-widest text-gray-400">Location</span>
                 <p className="text-sm font-medium text-brand-primary">{PORTFOLIO_DATA.profile.location}</p>
               </div>
               <div className="space-y-1">
                 <span className="text-[10px] uppercase tracking-widest text-gray-400">Languages</span>
                 <p className="text-sm font-medium text-brand-primary">{PORTFOLIO_DATA.profile.languages.join(', ')}</p>
               </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={downloadResume}
                className="btn-primary flex items-center gap-2"
              >
                <Download size={18} />
                Download Resume
              </button>
              <a href="#contact" className="btn-outline flex items-center gap-2">
                <MessageSquare size={18} />
                Let's Talk
              </a>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square bg-blue-100/30 rounded-full blur-3xl" />
            <div className="relative z-10 glass-card p-4 rounded-[40px] rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={PORTFOLIO_DATA.profile.profileImage} 
                  alt="About Me" 
                  referrerPolicy="no-referrer"
                  className="rounded-[32px] w-full object-cover object-top aspect-[4/5]"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-padding">
        <SectionHeader badge="Expertise" title="My Technical Skills" />
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-10">
            <h3 className="text-xl font-display flex items-center gap-2">
              <Code size={20} className="text-brand-accent" /> Front-end Development
            </h3>
            <div className="space-y-8">
              {PORTFOLIO_DATA.skills.frontend.map((skill) => (
                <div key={skill.name} className="group cursor-help relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-brand-primary">{skill.name}</span>
                    <span className="text-sm text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-brand-primary transition-all group-hover:bg-brand-accent"
                    />
                  </div>
                  <div className="absolute top-full left-0 mt-2 bg-brand-primary text-white text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none max-w-[200px]">
                    {skill.tooltip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <h3 className="text-xl font-display flex items-center gap-2">
              <Server size={20} className="text-brand-accent" /> Back-end Development
            </h3>
            <div className="space-y-8">
              {PORTFOLIO_DATA.skills.backend.map((skill) => (
                <div key={skill.name} className="group cursor-help relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-brand-primary">{skill.name}</span>
                    <span className="text-sm text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-brand-primary transition-all group-hover:bg-brand-accent"
                    />
                  </div>
                  <div className="absolute top-full left-0 mt-2 bg-brand-primary text-white text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none max-w-[200px]">
                    {skill.tooltip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="bg-gray-50/50">
        <div className="section-padding">
          <SectionHeader badge="Recent Work" title="Featured Projects" />
          
          <div className="flex flex-wrap gap-3 mb-10" data-aos="fade-up">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setProjectFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  projectFilter === cat 
                    ? 'bg-brand-primary text-white shadow-md' 
                    : 'bg-white text-gray-500 border border-gray-100 hover:border-brand-accent/30'
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-brand-primary rounded-full uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-xl font-display text-brand-primary mb-3">{project.title}</h4>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-accent group-hover:gap-3 transition-all"
                    >
                      View Details <TrendingUp size={16} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding">
        <SectionHeader badge="Contact" title="Let's Build Something Together" />
        <div className="grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h3 className="text-2xl font-display mb-6">Contact Info</h3>
              <p className="text-gray-500 mb-10 leading-relaxed">
                Have a project in mind or just want to say hello? I'm always open to discussing new opportunities and collaborations.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: "Our Location", content: PORTFOLIO_DATA.profile.location },
                  { icon: Phone, title: "Phone Number", content: PORTFOLIO_DATA.profile.phone },
                  { icon: Mail, title: "Email Address", content: PORTFOLIO_DATA.profile.email },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-brand-accent/5 flex items-center justify-center text-brand-accent shrink-0">
                      <item.icon size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-brand-primary">{item.title}</h4>
                      <p className="text-gray-500 text-sm whitespace-pre-line">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-8 bg-brand-primary rounded-[32px] text-white space-y-4">
              <h4 className="text-xl font-display">Ready to get started?</h4>
              <p className="text-gray-400 text-sm">Drop me a line and let's turn your ideas into digital reality.</p>
              <div className="h-px bg-white/10 my-4" />
              <div className="flex gap-4">
                {PORTFOLIO_DATA.socials.map((social) => {
                  const Icon = IconMap[social.name] || GithubIcon;
                  return (
                    <a key={social.name} href={social.url} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-primary transition-all">
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
             <form className="space-y-6" onSubmit={handleContactSubmit}>
               <div className="grid md:grid-cols-2 gap-6">
                 <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name" 
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
                 />
                 <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email" 
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
                 />
               </div>
               <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject" 
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
               />
               <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6} 
                  placeholder="Message" 
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all resize-none"
               />
               
               <AnimatePresence>
                 {formStatus === 'success' && aiResponse && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="p-6 bg-brand-accent/5 border border-brand-accent/10 rounded-2xl"
                   >
                     <div className="flex items-center gap-2 text-brand-accent font-semibold mb-2">
                       <Sparkles size={16} />
                       AI Assistant Reply
                     </div>
                     <p className="text-sm text-gray-600 leading-relaxed italic">
                       "{aiResponse}"
                     </p>
                   </motion.div>
                 )}
                 {formStatus === 'error' && (
                   <motion.p 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="text-red-500 text-sm font-medium"
                   >
                     Something went wrong. Please try again.
                   </motion.p>
                 )}
               </AnimatePresence>

               <button 
                 type="submit" 
                 disabled={formStatus === 'loading'}
                 className="w-full md:w-auto btn-primary py-4 px-10 flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 {formStatus === 'loading' ? (
                   <>
                     <Loader2 size={20} className="animate-spin" />
                     Sending...
                   </>
                 ) : (
                   <>
                     <Send size={20} />
                     Send Message
                   </>
                 )}
               </button>
             </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="font-semibold text-brand-primary">{PORTFOLIO_DATA.profile.fullName}</span>. All Rights Reserved.
          </p>
          <p className="text-gray-400 text-xs">
            Designed by {PORTFOLIO_DATA.profile.fullName}
          </p>
        </div>
      </footer>
    </div>
  );
}
