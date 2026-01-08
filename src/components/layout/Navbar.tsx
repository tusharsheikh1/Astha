import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react'; 

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Certifications', href: '#certifications' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-20 ${
      isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="container mx-auto max-w-7xl px-6 h-full flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3 group">
          <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white leading-none tracking-tight">
              Ibrahim <span className="text-indigo-500">Hossain</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] mt-1">
              Business Optimization Specialist
            </span>
          </div>
        </a>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
              {link.name}
            </a>
          ))}
          <a href="#contact" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg">
            Connect
          </a>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className={`absolute top-20 left-0 w-full bg-slate-900 border-b border-white/10 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 space-y-4">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-300">
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;