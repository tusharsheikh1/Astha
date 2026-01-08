import React from 'react';
import { Mail, Linkedin, MapPin, ExternalLink, ShieldCheck } from 'lucide-react'; 

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="h-6 w-6 text-indigo-500" />
              <h3 className="text-xl font-bold text-white tracking-tight">Md Ibrahim Hossain PMP®</h3>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Business Optimization Specialist focusing on operational efficiency, cost reduction, and strategic growth in the manufacturing and electronics sector.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <div className="flex flex-col gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-3"><Mail size={16} /> milonhossen465568@gmail.com</span>
              <span className="flex items-center gap-3"><MapPin size={16} /> Dhaka, Bangladesh</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Social</h4>
            <div className="flex flex-col gap-4">
              <a href="https://www.linkedin.com/in/milonhossen465568/" target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-400 hover:text-indigo-400 transition gap-3 text-sm">
                <Linkedin size={18} /> LinkedIn Profile <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 text-center text-[10px] text-slate-600 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Md Ibrahim Hossain • Strategy into Performance</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;