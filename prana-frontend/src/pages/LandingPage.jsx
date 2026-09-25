import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Database, FileText, ArrowRight, Lock, Award, Globe, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between text-gray-900 dark:text-gray-100 overflow-x-hidden">
      
      {/* Fixed Full-Screen Background Video */}
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
        <div className="absolute inset-0 bg-black/60 dark:bg-black/80"></div>
      </div>

      {/* Main Content Container scrolling above the fixed video */}
      <div className="relative z-10 flex-grow flex flex-col justify-between">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-10 sm:pb-14 w-full">
          <div className="max-w-3xl space-y-6 text-center sm:text-left">
            

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg leading-tight">
              AyurPran: GCP-Compliant Clinical Research & Safety Intelligence
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed drop-shadow-md max-w-2xl">
              Providing the All India Institute of Ayurveda with real-time portfolio oversight, CDISC data standards, immutable SHA-256 audit trails, and strict DPDP Act 2023 patient privacy controls.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 pt-2">
              <Link 
                to="/login" 
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5"
              >
                <span>Access Secure Portals</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 px-8 py-3.5 rounded-xl font-semibold shadow-sm text-center transition"
              >
                Register Participant / Investigator
              </Link>
            </div>
            
          </div>
        </section>

        {/* NEW: National Compliance & Technical Standards Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
          <div className="bg-white/10 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 dark:border-gray-700 p-6 rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center sm:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-emerald-400 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>CDISC Standards</span>
              </div>
              <p className="text-xs text-gray-300">Define-XML, SDTM & ADaM Datasets</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-emerald-400 font-bold">
                <Lock className="h-4 w-4" />
                <span>DPDP Act 2023</span>
              </div>
              <p className="text-xs text-gray-300">Encrypted Vault & Role Blinding</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-emerald-400 font-bold">
                <Award className="h-4 w-4" />
                <span>NPvCC Anchored</span>
              </div>
              <p className="text-xs text-gray-300">MedDRA & WHO-Drug Coded AE/SAE</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-emerald-400 font-bold">
                <Globe className="h-4 w-4" />
                <span>ISO 27001 & ICMR</span>
              </div>
              <p className="text-xs text-gray-300">GCP-ASU & NDCT Rules 2019 Compliant</p>
            </div>
          </div>
        </section>

        {/* Core Architecture Highlights Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 sm:pb-20">
          <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left text-white mb-6 drop-shadow-md">
            System Architecture & Core Capabilities
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard 
              title="Immutable Audit Trails" 
              desc="Every single database action, e-consent signature, and status change is recorded with cryptographic SHA-256 time-stamped verification ensuring complete ALCOA+ data integrity." 
              icon={ShieldCheck} 
            />
            <InfoCard 
              title="Pharmacovigilance (NPvCC)" 
              desc="Real-time adverse event reporting routed directly to investigators with automated regulatory timeline tracking and Data Safety Monitoring Board telemetry." 
              icon={Activity} 
            />
            <InfoCard 
              title="Interoperability & ABDM" 
              desc="Seamless connection with Electronic Data Capture (EDC) systems and Ayushman Bharat Digital Mission (ABDM) building blocks using FHIR R4 specifications." 
              icon={Database} 
            />
          </div>
        </section>

      </div>
    </div>
  );
}

function InfoCard({ title, desc, icon: Icon }) {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700 flex flex-col justify-between hover:scale-[1.02] transition duration-300">
      <div>
        <div className="p-3 bg-emerald-100 dark:bg-gray-700 text-emerald-700 dark:text-emerald-400 rounded-xl inline-block mb-4 shadow-sm">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}