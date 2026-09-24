import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Database, FileText, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between text-gray-900 dark:text-gray-100 overflow-x-hidden">
      
      {/* Fixed Full-Screen Background Video (Pointer events none allows clicking through it) */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70"></div>
      </div>

      {/* Main Content Container scrolling above the fixed video */}
      <div className="relative z-10 flex-grow flex flex-col justify-between">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-12 sm:pb-16 w-full">
          <div className="max-w-3xl space-y-6 text-center sm:text-left">
            
            <div className="flex justify-center sm:justify-start">
              <span className="bg-emerald-600 text-white text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block shadow-md">
                Official AIIA CTMS & NPvCC Platform
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg leading-tight">
              AyurPrana: Real-Time Clinical Trials & Safety Surveillance
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed drop-shadow-md max-w-2xl">
              Giving the All India Institute of Ayurveda a single, auditable, regulatory-grade view of clinical portfolios, patient contracts, CDISC standards, and NPvCC pharmacovigilance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 pt-2">
              <Link 
                to="/login" 
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5"
              >
                <span>Access Portals</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 px-8 py-3.5 rounded-xl font-semibold shadow-sm text-center transition"
              >
                Register New User
              </Link>
            </div>
            
          </div>
        </section>

        {/* Role Portals Grid Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 sm:pb-24">
          <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left text-white mb-6 drop-shadow-md">
            Role-Based Secure Portals
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PortalCard 
              title="Doctor Portal" 
              desc="Manage patient contracts, clinical screenings, and direct AE/SAE reporting." 
              to="/login" 
              icon={Activity} 
            />
            <PortalCard 
              title="Patient Portal" 
              desc="View trial agreements, informed consent, and Ayushman Bharat (ABDM) status." 
              to="/login" 
              icon={FileText} 
            />
            <PortalCard 
              title="Researcher Portal" 
              desc="Monitor multi-centre trials, CTRI sync, and CDISC SDTM/ADaM exports." 
              to="/login" 
              icon={Database} 
            />
            <PortalCard 
              title="Government Regulator" 
              desc="Auditable oversight, NPvCC safety signals, and compliance reporting." 
              to="/login" 
              icon={ShieldCheck} 
            />
          </div>
        </section>

      </div>
    </div>
  );
}

function PortalCard({ title, desc, to, icon: Icon }) {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700 flex flex-col justify-between hover:scale-[1.02] transition duration-300">
      <div>
        <div className="p-3 bg-emerald-100 dark:bg-gray-700 text-emerald-700 dark:text-emerald-400 rounded-xl inline-block mb-4 shadow-sm">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{desc}</p>
      </div>
      
      <Link 
        to={to} 
        className="mt-6 text-emerald-700 dark:text-emerald-400 font-bold text-sm flex items-center space-x-1 hover:underline group"
      >
        <span>Open Portal</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}