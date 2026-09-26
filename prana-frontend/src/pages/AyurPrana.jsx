import React, { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BellRing,
  BrainCircuit,
  CalendarClock,
  Check,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Cloud,
  Code2,
  Database,
  FileCheck2,
  FileJson2,
  Fingerprint,
  GitBranch,
  Globe2,
  HeartPulse,
  Hospital,
  KeyRound,
  Layers3,
  Leaf,
  LockKeyhole,
  Map,
  Network,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Moon,
  Timer,
  UserCheck,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* -------------------------------------------------------------------------- */
/*                                    DATA                                    */
/* -------------------------------------------------------------------------- */

const problems = [
  {
    icon: Database,
    title: "Fragmented clinical data",
    text: "Trial information can live across spreadsheets, CRFs, hospital systems, documents and disconnected workflows.",
  },
  {
    icon: Timer,
    title: "Delayed visibility",
    text: "Recruitment, monitoring, safety and compliance status become difficult to understand without a consolidated operational view.",
  },
  {
    icon: CircleAlert,
    title: "Safety complexity",
    text: "An adverse event can trigger classification, seriousness assessment, coding, review and regulatory timelines.",
  },
  {
    icon: Network,
    title: "Disconnected standards",
    text: "Healthcare data and clinical-research data use different representations and require a deliberate interoperability layer.",
  },
];

const features = [
  {
    icon: ClipboardCheck,
    title: "Clinical Trial Management",
    text: "Manage studies, protocols, sites, investigators, participants, visits and milestones from one operational layer.",
    tag: "CTMS",
  },
  {
    icon: ShieldCheck,
    title: "Ethics & Regulatory",
    text: "Track ethics submissions, approvals, CTRI information, regulatory milestones, documents and upcoming actions.",
    tag: "COMPLIANCE",
  },
  {
    icon: HeartPulse,
    title: "Pharmacovigilance",
    text: "Connect adverse-event workflows with seriousness, causality, coding, review and safety intelligence.",
    tag: "SAFETY",
  },
  {
    icon: FileJson2,
    title: "FHIR & CDISC",
    text: "Create a standards-aware pathway from clinical information to structured research representations and exports.",
    tag: "INTEROPERABILITY",
  },
  {
    icon: Fingerprint,
    title: "Auditability",
    text: "Preserve who changed what, when it changed and why, supporting traceability and data-integrity workflows.",
    tag: "ALCOA+",
  },
  {
    icon: BrainCircuit,
    title: "Trial Intelligence",
    text: "Turn cross-module events into explainable operational risks, alerts and human-review actions.",
    tag: "INTELLIGENCE",
  },
];

const lifecycle = [
  {
    number: "01",
    title: "Protocol",
    text: "Define the study, intervention, population, sites, endpoints and milestones.",
  },
  {
    number: "02",
    title: "Ethics",
    text: "Submit and track protocol review, consent documentation and approval status.",
  },
  {
    number: "03",
    title: "Registration",
    text: "Track registration information and important regulatory milestones.",
  },
  {
    number: "04",
    title: "Participants",
    text: "Screen, enroll, consent and manage participant visits and clinical data.",
  },
  {
    number: "05",
    title: "Safety",
    text: "Capture adverse events and route serious events through safety workflows.",
  },
  {
    number: "06",
    title: "Analysis",
    text: "Standardize clinical data and move toward research-ready representations.",
  },
  {
    number: "07",
    title: "Close-out",
    text: "Bring documents, actions, audit history and study completion into one record.",
  },
];

const roles = [
  {
    title: "Principal Investigator",
    icon: Stethoscope,
    items: ["Study oversight", "Participants", "Safety review", "Protocol actions"],
  },
  {
    title: "Ethics Committee",
    icon: FileCheck2,
    items: ["Protocol review", "Consent", "Amendments", "Safety oversight"],
  },
  {
    title: "Pharmacovigilance",
    icon: HeartPulse,
    items: ["AE / SAE", "Causality", "Coding", "Signal monitoring"],
  },
  {
    title: "Leadership",
    icon: Activity,
    items: ["Portfolio KPIs", "Recruitment", "Compliance", "Risk visibility"],
  },
];

const safetySteps = [
  {
    icon: CircleAlert,
    label: "Adverse Event",
    short: "AE",
    text: "An event is captured against the participant and study.",
  },
  {
    icon: ShieldCheck,
    label: "Seriousness",
    short: "SAE",
    text: "Seriousness criteria trigger the appropriate safety pathway.",
  },
  {
    icon: Code2,
    label: "Coding",
    short: "CODE",
    text: "Clinical terminology is normalized for consistent review.",
  },
  {
    icon: CalendarClock,
    label: "Regulatory Timeline",
    short: "DUE",
    text: "Reporting obligations and review milestones become visible.",
  },
  {
    icon: BellRing,
    label: "Safety Signal",
    short: "SIGNAL",
    text: "Patterns can be surfaced for human investigation and action.",
  },
];

/* -------------------------------------------------------------------------- */
/*                                SMALL COMPONENTS                            */
/* -------------------------------------------------------------------------- */

function SectionEyebrow({ children, dark = false }) {
  return (
    <div
      className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${
        dark
          ? "border-white/15 bg-white/[0.06] text-[#d9e7d2]"
          : "border-[#b9cdb5] bg-[#eef4e8] dark:border-emerald-800/40 dark:bg-emerald-950/40 text-[#315f42] dark:text-emerald-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          dark ? "bg-[#b8d6a9]" : "bg-[#4f825f] dark:bg-emerald-400"
        }`}
      />
      {children}
    </div>
  );
}

function FlowArrow({ vertical = false, dark = false }) {
  return (
    <div
      className={`flex items-center justify-center ${
        vertical ? "py-2" : "px-1 md:px-2"
      } ${dark ? "text-[#9fbd9c]" : "text-[#769578] dark:text-emerald-500/60"}`}
    >
      {vertical ? (
        <ArrowDown size={18} strokeWidth={1.7} />
      ) : (
        <ArrowRight size={18} strokeWidth={1.7} />
      )}
    </div>
  );
}

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

export default function AyurPrana() {
  const [activeRole, setActiveRole] = useState(0);
  const [activeSafety, setActiveSafety] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme class on the root container
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen overflow-x-hidden transition-colors duration-300`}>
      <div className="min-h-screen bg-[#f7f3e9] text-[#20372a] dark:bg-[#111c16] dark:text-emerald-50">
        
        {/* Floating Theme Toggle (or integrate into Navbar) */}
        <div className="fixed right-6 top-6 z-50">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex items-center gap-2 rounded-full border border-[#c7d4c3] bg-white/80 dark:border-emerald-800/60 dark:bg-emerald-950/80 px-4 py-2.5 text-xs font-semibold text-[#31563e] dark:text-emerald-300 shadow-lg backdrop-blur transition hover:scale-105"
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>

        <main>
          {/* ================================================================== */}
          {/* HERO                                                               */}
          {/* ================================================================== */}
          <section className="relative overflow-hidden border-b border-[#dce5d7] dark:border-emerald-900/40">
            {/* background decoration */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-32 top-24 h-[420px] w-[420px] rounded-full bg-[#dcebd7] dark:bg-emerald-900/20 opacity-50 blur-3xl" />
              <div className="absolute right-[-100px] top-[-80px] h-[500px] w-[500px] rounded-full bg-[#eadfc9] dark:bg-emerald-950/30 opacity-70 blur-3xl" />

              <svg
                className="absolute inset-0 h-full w-full opacity-[0.23] dark:opacity-[0.08]"
                viewBox="0 0 1200 800"
                fill="none"
              >
                <path
                  d="M-50 590C180 410 250 690 480 500C690 325 790 490 1000 290C1100 195 1160 180 1260 210"
                  stroke="#7a9b78"
                  strokeWidth="1"
                />
                <path
                  d="M-80 650C150 470 260 740 490 555C690 395 830 530 1020 335C1110 245 1190 230 1280 250"
                  stroke="#9eaf88"
                  strokeWidth="1"
                />
              </svg>
            </div>

            <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
              <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
                <Reveal>
                  <SectionEyebrow>Ayurveda-first clinical intelligence</SectionEyebrow>

                  <h1 className="max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.045em] text-[#173c2a] dark:text-emerald-100 sm:text-6xl lg:text-[76px]">
                    From clinical data
                    <span className="block text-[#628463] dark:text-emerald-400">to clinical insight.</span>
                  </h1>

                  <p className="mt-7 max-w-2xl text-lg leading-8 text-[#607064] dark:text-emerald-300/80 sm:text-xl">
                    AyurPrana brings clinical trial operations, Ayurveda-specific
                    data, safety intelligence, compliance workflows and
                    interoperable research standards into one connected platform.
                  </p>

                  <div className="mt-9 flex flex-wrap gap-3">
                    <a
                      href="#architecture"
                      className="group inline-flex items-center gap-2 rounded-full bg-[#234c35] dark:bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(35,76,53,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1b3e2b] dark:hover:bg-emerald-500"
                    >
                      Explore the platform
                      <ArrowUpRight
                        size={16}
                        className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>

                    <a
                      href="#workflow"
                      className="inline-flex items-center gap-2 rounded-full border border-[#c7d4c3] dark:border-emerald-800/60 bg-white/60 dark:bg-emerald-950/40 px-6 py-3.5 text-sm font-semibold text-[#31563e] dark:text-emerald-300 backdrop-blur transition hover:bg-white dark:hover:bg-emerald-900/40"
                    >
                      See the workflows
                      <ChevronRight size={16} />
                    </a>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-[#718071] dark:text-emerald-400/80">
                    <span className="flex items-center gap-2">
                      <Check size={14} className="text-[#5f8b64] dark:text-emerald-400" />
                      Clinical trial management
                    </span>
                    <span className="flex items-center gap-2">
                      <Check size={14} className="text-[#5f8b64] dark:text-emerald-400" />
                      FHIR / CDISC pathway
                    </span>
                    <span className="flex items-center gap-2">
                      <Check size={14} className="text-[#5f8b64] dark:text-emerald-400" />
                      Pharmacovigilance
                    </span>
                  </div>
                </Reveal>

                {/* Hero architecture visual */}
                <Reveal className="lg:justify-self-end">
                  <div className="relative mx-auto max-w-[570px]">
                    <div className="absolute -inset-5 rounded-[38px] bg-[#dbe8d7]/50 dark:bg-emerald-950/40 blur-2xl" />

                    <div className="relative rounded-[32px] border border-[#cddbc9] dark:border-emerald-800/50 bg-[#fbfaf5]/90 dark:bg-[#16261d]/90 p-5 shadow-[0_30px_80px_rgba(47,75,51,0.12)] backdrop-blur">
                      <div className="flex items-center justify-between border-b border-[#e2e7de] dark:border-emerald-800/40 pb-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#79907b] dark:text-emerald-400/70">
                            Clinical intelligence layer
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[#264b34] dark:text-emerald-200">
                            AyurPrana Core
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-full border border-[#cce0c9] dark:border-emerald-800 bg-[#edf6e9] dark:bg-emerald-950 px-2.5 py-1 text-[10px] font-semibold text-[#47704e] dark:text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#5c9b65] dark:bg-emerald-400 animate-pulse" />
                          LIVE
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-4">
                        {[
                          ["37", "Active trials"],
                          ["82", "Sites"],
                          ["8.4K", "Participants"],
                        ].map(([value, label]) => (
                          <div
                            key={label}
                            className="rounded-2xl border border-[#e3e8df] dark:border-emerald-900/60 bg-white/70 dark:bg-emerald-950/30 p-3"
                          >
                            <p className="text-xl font-semibold tracking-tight text-[#244c34] dark:text-emerald-100">
                              {value}
                            </p>
                            <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#879286] dark:text-emerald-400/60">
                              {label}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-[#dfe8da] dark:border-emerald-900/60 bg-[#f1f6ed] dark:bg-emerald-950/20 p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#748576] dark:text-emerald-400/70">
                              Connected clinical flow
                            </p>
                            <p className="mt-1 text-xs font-medium text-[#355b40] dark:text-emerald-300">
                              One data layer. Multiple research standards.
                            </p>
                          </div>
                          <Network size={18} className="text-[#628464] dark:text-emerald-400" />
                        </div>

                        <div className="space-y-2">
                          <MiniFlow
                            icon={<Hospital size={14} />}
                            title="Hospital / EHR"
                            value="FHIR"
                          />
                          <MiniFlow
                            icon={<Database size={14} />}
                            title="Clinical trial data"
                            value="Canonical"
                          />
                          <MiniFlow
                            icon={<FileJson2 size={14} />}
                            title="Research representation"
                            value="CDISC"
                          />
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <MiniMetric
                          label="Safety cases"
                          value="14"
                          icon={<HeartPulse size={14} />}
                        />
                        <MiniMetric
                          label="Actions due"
                          value="07"
                          icon={<CalendarClock size={14} />}
                        />
                      </div>
                    </div>

                    <div className="absolute -right-4 top-20 hidden rounded-2xl border border-[#d6e2d1] dark:border-emerald-800 bg-white dark:bg-[#16261d] p-3 shadow-xl sm:block">
                      <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-[#eaf3e7] dark:bg-emerald-950 p-2 text-[#47734f] dark:text-emerald-300">
                          <ShieldCheck size={17} />
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-[#829080] dark:text-emerald-400/60">
                            Integrity
                          </p>
                          <p className="text-xs font-semibold text-[#2c5139] dark:text-emerald-200">
                            Audit-ready
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ================================================================== */}
          {/* PROBLEM                                                            */}
          {/* ================================================================== */}
          <section id="problems" className="bg-[#f0eadb] dark:bg-[#0c1611] py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal>
                <SectionEyebrow>The problem</SectionEyebrow>

                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                  <div>
                    <h2 className="max-w-xl text-4xl font-medium tracking-[-0.035em] text-[#203f2d] dark:text-emerald-100 sm:text-5xl">
                      Clinical research is not one workflow.
                      <span className="text-[#6f896f] dark:text-emerald-400/80">
                        {" "}
                        It is a network of connected workflows.
                      </span>
                    </h2>

                    <p className="mt-6 max-w-lg leading-7 text-[#6e756c] dark:text-emerald-300/80">
                      Protocols, participants, ethics, regulatory obligations,
                      clinical observations and safety events create data at
                      every stage. When those pieces remain disconnected, the
                      operational picture becomes harder to see.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {problems.map((item, index) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="group rounded-3xl border border-[#d8d9c9] dark:border-emerald-900/50 bg-[#faf8f0] dark:bg-[#14211a] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#afc6ac] dark:hover:border-emerald-700 hover:shadow-[0_18px_50px_rgba(55,75,48,0.08)]"
                        >
                          <div className="flex items-start justify-between">
                            <div className="rounded-2xl bg-[#e6efdf] dark:bg-emerald-950 p-3 text-[#4e7656] dark:text-emerald-300">
                              <Icon size={21} strokeWidth={1.7} />
                            </div>
                            <span className="font-mono text-[10px] text-[#9ca394] dark:text-emerald-500/60">
                              0{index + 1}
                            </span>
                          </div>

                          <h3 className="mt-6 text-lg font-semibold text-[#294c35] dark:text-emerald-200">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-[#737b70] dark:text-emerald-300/70">
                            {item.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ================================================================== */}
          {/* PLATFORM                                                           */}
          {/* ================================================================== */}
          <section id="platform" className="bg-[#f7f3e9] dark:bg-[#111c16] py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal>
                <div className="max-w-3xl">
                  <SectionEyebrow>One connected platform</SectionEyebrow>

                  <h2 className="text-4xl font-medium tracking-[-0.04em] text-[#1e3d2c] dark:text-emerald-100 sm:text-5xl">
                    The operational layer for the
                    <span className="text-[#67866b] dark:text-emerald-400"> entire trial lifecycle.</span>
                  </h2>

                  <p className="mt-6 text-lg leading-8 text-[#6b756c] dark:text-emerald-300/80">
                    AyurPrana connects study management, clinical data,
                    compliance, safety and analytics rather than treating them as
                    isolated screens.
                  </p>
                </div>
              </Reveal>

              <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {features.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <Reveal key={item.title} className={`delay-[${index * 50}ms]`}>
                      <div className="group h-full rounded-[28px] border border-[#d9e1d4] dark:border-emerald-900/50 bg-[#fcfbf6] dark:bg-[#15231c] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#a9c0a7] dark:hover:border-emerald-700 hover:shadow-[0_24px_70px_rgba(44,70,48,0.08)]">
                        <div className="flex items-start justify-between">
                          <div className="rounded-2xl bg-[#e8f0e3] dark:bg-emerald-950 p-3.5 text-[#4f7758] dark:text-emerald-300">
                            <Icon size={22} strokeWidth={1.7} />
                          </div>

                          <span className="rounded-full bg-[#f0eee5] dark:bg-emerald-900/40 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-[#7d877b] dark:text-emerald-300">
                            {item.tag}
                          </span>
                        </div>

                        <h3 className="mt-7 text-xl font-semibold tracking-tight text-[#274c35] dark:text-emerald-200">
                          {item.title}
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-[#727b70] dark:text-emerald-300/70">
                          {item.text}
                        </p>

                        <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-[#5b7d60] dark:text-emerald-400">
                          Explore capability
                          <ArrowUpRight
                            size={14}
                            className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ================================================================== */}
          {/* LIFECYCLE                                                          */}
          {/* ================================================================== */}
          <section id="workflow" className="overflow-hidden bg-[#203d2c] dark:bg-[#0a120e] py-24 text-white lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal>
                <SectionEyebrow dark>Clinical trial lifecycle</SectionEyebrow>

                <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <h2 className="text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
                      From protocol
                      <span className="block text-[#b9d3ae] dark:text-emerald-300">to close-out.</span>
                    </h2>

                    <p className="mt-6 max-w-md leading-7 text-[#b6c5b7] dark:text-emerald-300/70">
                      Every stage produces information. AyurPrana gives that
                      information a connected operational context.
                    </p>

                    <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.045] p-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-[#a9c79f]/10 p-2.5 text-[#b7d1ae]">
                          <Workflow size={19} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">
                            Lifecycle principle
                          </p>
                          <p className="mt-1 text-xs text-[#9daf9e]">
                            One study record. Connected events.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-[20px] top-6 bottom-6 w-px bg-white/10 dark:bg-emerald-900/40" />

                    <div className="space-y-4">
                      {lifecycle.map((item, index) => (
                        <div
                          key={item.number}
                          className="group relative flex gap-5 rounded-3xl border border-white/[0.08] dark:border-emerald-900/40 bg-white/[0.035] dark:bg-emerald-950/20 p-5 transition hover:border-white/15 hover:bg-white/[0.06]"
                        >
                          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#779b79]/30 bg-[#294b37] dark:bg-emerald-900 font-mono text-[10px] font-bold text-[#bdd4b6]">
                            {item.number}
                          </div>

                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-white">
                                {item.title}
                              </h3>
                              {index < lifecycle.length - 1 && (
                                <ChevronRight
                                  size={14}
                                  className="text-[#719177]"
                                />
                              )}
                            </div>
                            <p className="mt-1.5 text-sm leading-6 text-[#9fb1a1]">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ================================================================== */}
          {/* FHIR → CDISC                                                       */}
          {/* ================================================================== */}
          <section id="architecture" className="bg-[#f7f3e9] dark:bg-[#111c16] py-24 lg:py-36">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal>
                <SectionEyebrow>Interoperability layer</SectionEyebrow>

                <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
                  <div>
                    <h2 className="text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-[#1d3c2b] dark:text-emerald-100 sm:text-5xl">
                      FHIR
                      <span className="text-[#789578]"> → </span>
                      clinical data
                      <span className="text-[#789578]"> → </span>
                      CDISC
                    </h2>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-[#6d766d] dark:text-emerald-300/80">
                      Healthcare systems and clinical research systems speak
                      different standards. AyurPrana introduces a mapping layer
                      between the two instead of treating interoperability as
                      just an API checkbox.
                    </p>

                    <div className="mt-8 space-y-3">
                      {[
                        "External healthcare data enters through FHIR resources.",
                        "A canonical clinical model provides the internal bridge.",
                        "Research data can be represented through CDISC-aligned structures.",
                        "The same data foundation feeds analytics and operational workflows.",
                      ].map((text) => (
                        <div
                          key={text}
                          className="flex gap-3 rounded-2xl border border-[#dde5d8] dark:border-emerald-900/50 bg-[#fcfbf6] dark:bg-[#15231c] p-4"
                        >
                          <div className="mt-0.5 rounded-full bg-[#e4efdf] dark:bg-emerald-950 p-1 text-[#4c7755] dark:text-emerald-300">
                            <Check size={13} />
                          </div>
                          <p className="text-sm leading-6 text-[#69766a] dark:text-emerald-300/70">
                            {text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mapping diagram */}
                  <div className="relative">
                    <div className="absolute -inset-6 rounded-[40px] bg-[#dce9d8]/60 dark:bg-emerald-950/30 blur-2xl" />

                    <div className="relative overflow-hidden rounded-[32px] border border-[#cddbc8] dark:border-emerald-800/50 bg-[#fbfaf5] dark:bg-[#16261d] p-5 shadow-[0_25px_80px_rgba(53,78,54,0.1)]">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#839183] dark:text-emerald-400/60">
                            Data transformation
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[#2c5239] dark:text-emerald-200">
                            Clinical interoperability pipeline
                          </p>
                        </div>
                        <GitBranch size={20} className="text-[#668467] dark:text-emerald-400" />
                      </div>

                      <div className="space-y-2">
                        <PipelineCard
                          number="01"
                          icon={<Hospital size={18} />}
                          title="Healthcare source"
                          subtitle="Hospital / EHR / HIS"
                          badge="FHIR"
                        />

                        <FlowArrow vertical />

                        <PipelineCard
                          number="02"
                          icon={<RefreshCw size={18} />}
                          title="Integration layer"
                          subtitle="Normalize + map"
                          badge="MAP"
                          active
                        />

                        <FlowArrow vertical />

                        <PipelineCard
                          number="03"
                          icon={<Database size={18} />}
                          title="Clinical data"
                          subtitle="Canonical research model"
                          badge="CORE"
                        />

                        <FlowArrow vertical />

                        <PipelineCard
                          number="04"
                          icon={<FileJson2 size={18} />}
                          title="Research standards"
                          subtitle="Collection → tabulation → analysis"
                          badge="CDISC"
                        />
                      </div>

                      <div className="mt-5 rounded-2xl bg-[#edf4e9] dark:bg-emerald-950/40 p-4">
                        <div className="flex items-start gap-3">
                          <Sparkles
                            size={17}
                            className="mt-0.5 shrink-0 text-[#638466] dark:text-emerald-400"
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#345a3f] dark:text-emerald-200">
                              Why this matters
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[#718071] dark:text-emerald-300/70">
                              The platform can connect operational clinical data
                              with research-oriented representations without
                              forcing every stakeholder to work in the same
                              system or vocabulary.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ================================================================== */}
          {/* AYURVEDA SEMANTIC BRIDGE                                           */}
          {/* ================================================================== */}
          <section className="bg-[#e9e2d1] dark:bg-[#0e1713] py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal>
                <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                  <div>
                    <SectionEyebrow>Our domain differentiator</SectionEyebrow>

                    <h2 className="max-w-2xl text-4xl font-medium tracking-[-0.04em] text-[#294332] dark:text-emerald-100 sm:text-5xl">
                      Ayurveda-specific data,
                      <span className="text-[#748c6e] dark:text-emerald-400">
                        {" "}
                        without losing interoperability.
                      </span>
                    </h2>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-[#6f756c] dark:text-emerald-300/80">
                      Ayurveda brings its own clinical concepts, interventions
                      and research context. The platform's semantic layer is
                      designed to connect that domain-specific information with
                      modern healthcare and clinical-research standards.
                    </p>

                    <div className="mt-9 grid gap-3 sm:grid-cols-2">
                      {[
                        ["Ayurvedic clinical context", "DOMAIN"],
                        ["Canonical clinical model", "BRIDGE"],
                        ["FHIR representation", "HEALTHCARE"],
                        ["CDISC representation", "RESEARCH"],
                      ].map(([title, tag]) => (
                        <div
                          key={title}
                          className="rounded-2xl border border-[#d2cfbd] dark:border-emerald-900/50 bg-[#f8f5eb]/80 dark:bg-[#14211a] p-5"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <Leaf size={17} className="text-[#638263] dark:text-emerald-400" />
                            <span className="text-[9px] font-bold tracking-[0.16em] text-[#9a9a89] dark:text-emerald-500/60">
                              {tag}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[#3a5740] dark:text-emerald-200">
                            {title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Semantic bridge visual */}
                  <div className="relative">
                    <div className="rounded-[34px] border border-[#d1d5c4] dark:border-emerald-800/50 bg-[#f8f5eb] dark:bg-[#15231c] p-6 shadow-[0_25px_60px_rgba(67,70,48,0.08)]">
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b9184] dark:text-emerald-400/60">
                            Semantic bridge
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[#34533d] dark:text-emerald-200">
                            Ayurveda → standards
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#e5efdf] dark:bg-emerald-950 p-2.5 text-[#5c805f] dark:text-emerald-300">
                          <Leaf size={19} />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <BridgeNode
                          icon={<Leaf size={17} />}
                          title="Ayurveda-specific clinical data"
                          detail="Intervention • clinical context • observations"
                        />

                        <FlowArrow vertical />

                        <BridgeNode
                          icon={<Layers3 size={17} />}
                          title="Canonical clinical model"
                          detail="Normalize meaning before exchanging data"
                          highlighted
                        />

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <BridgeNode
                            icon={<Globe2 size={16} />}
                            title="FHIR"
                            detail="Healthcare exchange"
                          />
                          <BridgeNode
                            icon={<FileJson2 size={16} />}
                            title="CDISC"
                            detail="Research standards"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ================================================================== */}
          {/* SAFETY WORKFLOW                                                    */}
          {/* ================================================================== */}
          <section id="safety" className="bg-[#f7f3e9] dark:bg-[#111c16] py-24 lg:py-36">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal>
                <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
                  <div>
                    <SectionEyebrow>Pharmacovigilance workflow</SectionEyebrow>

                    <h2 className="text-4xl font-medium tracking-[-0.04em] text-[#1e3c2b] dark:text-emerald-100 sm:text-5xl">
                      AE
                      <span className="text-[#789378]"> → </span>
                      SAE
                      <span className="text-[#789378]"> → </span>
                      coding
                      <span className="text-[#789378]"> → </span>
                      signal.
                    </h2>

                    <p className="mt-6 max-w-lg text-lg leading-8 text-[#6d766d] dark:text-emerald-300/80">
                      Safety is not a single page. It is a chain of decisions,
                      deadlines and reviews. AyurPrana makes that chain visible.
                    </p>

                    <div className="mt-8 rounded-3xl border border-[#dbe2d7] dark:border-emerald-900/50 bg-[#fcfbf6] dark:bg-[#15231c] p-5">
                      <div className="flex gap-3">
                        <div className="rounded-xl bg-[#edf4e9] dark:bg-emerald-950 p-2.5 text-[#5d8060] dark:text-emerald-300">
                          <ShieldCheck size={19} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#31543b] dark:text-emerald-200">
                            Human-reviewed safety intelligence
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#778076] dark:text-emerald-300/70">
                            Signals and analytics support investigation; they do
                            not replace authorized clinical or regulatory
                            decisions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Step selector */}
                    <div className="flex flex-wrap gap-2">
                      {safetySteps.map((step, index) => {
                        const Icon = step.icon;
                        const active = index === activeSafety;

                        return (
                          <button
                            key={step.short}
                            onClick={() => setActiveSafety(index)}
                            className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition ${
                              active
                                ? "border-[#5f8263] bg-[#31573e] dark:bg-emerald-600 text-white shadow-lg"
                                : "border-[#d5dfd0] dark:border-emerald-900/50 bg-white/70 dark:bg-emerald-950/30 text-[#667467] dark:text-emerald-300 hover:border-[#a9c1a7]"
                            }`}
                          >
                            <Icon size={14} />
                            {step.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Main workflow */}
                    <div className="mt-5 overflow-hidden rounded-[30px] border border-[#d7e0d3] dark:border-emerald-900/50 bg-[#fcfbf6] dark:bg-[#15231c] shadow-[0_25px_70px_rgba(46,70,50,0.08)]">
                      <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
                        <div className="border-b border-[#e1e7dd] dark:border-emerald-900/40 bg-[#edf4e9] dark:bg-emerald-950/40 p-7 lg:border-b-0 lg:border-r">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#31573e] dark:bg-emerald-600 text-white">
                            {React.createElement(safetySteps[activeSafety].icon, {
                              size: 25,
                              strokeWidth: 1.7,
                            })}
                          </div>

                          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7c8c7d] dark:text-emerald-400/60">
                            Stage {String(activeSafety + 1).padStart(2, "0")}
                          </p>

                          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#294c35] dark:text-emerald-100">
                            {safetySteps[activeSafety].label}
                          </h3>

                          <p className="mt-3 text-sm leading-6 text-[#718071] dark:text-emerald-300/70">
                            {safetySteps[activeSafety].text}
                          </p>
                        </div>

                        <div className="p-7">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a9388] dark:text-emerald-400/60">
                                Safety case
                              </p>
                              <p className="mt-1 font-mono text-sm font-semibold text-[#36563e] dark:text-emerald-200">
                                PV-2026-00127
                              </p>
                            </div>

                            <span className="rounded-full bg-[#fff0d6] dark:bg-amber-950/60 px-3 py-1 text-[10px] font-bold text-[#96703d] dark:text-amber-300">
                              REVIEW
                            </span>
                          </div>

                          <div className="mt-7 grid gap-3 sm:grid-cols-2">
                            <DataPoint label="Study" value="AYU-DM-001" />
                            <DataPoint label="Participant" value="P-0192" />
                            <DataPoint label="Severity" value="Serious" />
                            <DataPoint label="Causality" value="Possible" />
                            <DataPoint label="Reported" value="12 Sep 2026" />
                            <DataPoint label="Action" value="PV Review" />
                          </div>

                          <div className="mt-6 rounded-2xl border border-[#e2e6dc] dark:border-emerald-900/50 bg-[#f7f8f3] dark:bg-[#101b15] p-4">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-[#405945] dark:text-emerald-200">
                                Regulatory timeline
                              </p>
                              <Timer size={15} className="text-[#718c70] dark:text-emerald-400" />
                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#dde4d8] dark:bg-emerald-950">
                              <div className="h-full w-[72%] rounded-full bg-[#6b8d6d] dark:bg-emerald-500" />
                            </div>

                            <div className="mt-2 flex justify-between text-[10px] text-[#899287] dark:text-emerald-400/60">
                              <span>Reported</span>
                              <span>Review</span>
                              <span>Due</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Workflow strip */}
                    <div className="mt-5 hidden items-center overflow-x-auto rounded-2xl border border-[#dbe2d6] dark:border-emerald-900/50 bg-white/60 dark:bg-emerald-950/30 p-3 md:flex">
                      {safetySteps.map((step, index) => (
                        <React.Fragment key={step.short}>
                          <button
                            onClick={() => setActiveSafety(index)}
                            className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-semibold transition ${
                              index === activeSafety
                                ? "bg-[#e7f0e3] dark:bg-emerald-900 text-[#416849] dark:text-emerald-200"
                                : "text-[#879087] dark:text-emerald-400/60"
                            }`}
                          >
                            <span className="font-mono">{step.short}</span>
                          </button>

                          {index < safetySteps.length - 1 && (
                            <ArrowRight
                              size={13}
                              className="mx-1 shrink-0 text-[#a1aaa0] dark:text-emerald-800"
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ================================================================== */}
          {/* RISK ENGINE                                                        */}
          {/* ================================================================== */}
          <section className="bg-[#dfe9da] dark:bg-[#0c1611] py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal>
                <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
                  <div>
                    <SectionEyebrow>Intelligence layer</SectionEyebrow>

                    <h2 className="text-4xl font-medium tracking-[-0.04em] text-[#21412e] dark:text-emerald-100 sm:text-5xl">
                      Explain the risk.
                      <span className="block text-[#718b70] dark:text-emerald-400/80">
                        Don't just show a number.
                      </span>
                    </h2>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-[#687568] dark:text-emerald-300/80">
                      AyurPrana can bring signals from different modules together
                      so that operational risks are understandable, traceable and
                      routed to the right human reviewer.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-2">
                      {[
                        "Recruitment",
                        "Compliance",
                        "Safety",
                        "Data quality",
                        "Site performance",
                      ].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#c7d6c2] dark:border-emerald-900/60 bg-[#edf3e9] dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-[#55705b] dark:text-emerald-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[32px] border border-[#cbd9c6] dark:border-emerald-900/50 bg-[#f8f8f1] dark:bg-[#15231c] p-5 shadow-[0_25px_70px_rgba(48,72,51,0.09)]">
                    <div className="flex items-center justify-between border-b border-[#e0e5dc] dark:border-emerald-900/40 pb-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#879186] dark:text-emerald-400/60">
                          Explainable trial risk
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#35553d] dark:text-emerald-200">
                          AYU-DM-001
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-full bg-[#fff0dc] dark:bg-amber-950/60 px-3 py-1.5 text-[10px] font-bold text-[#987242] dark:text-amber-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#c58a42]" />
                        MODERATE RISK
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-[#eef4ea] dark:bg-emerald-950/40 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white dark:bg-emerald-900 p-2 text-[#618364] dark:text-emerald-200 shadow-sm">
                          <BrainCircuit size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#36563e] dark:text-emerald-200">
                            Risk explanation
                          </p>
                          <p className="text-[11px] text-[#7a867a] dark:text-emerald-400/60">
                            Multiple operational signals detected.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <RiskRow
                        label="Recruitment velocity"
                        value="-18%"
                        width="76%"
                      />
                      <RiskRow
                        label="Ethics milestone"
                        value="5 days"
                        width="62%"
                      />
                      <RiskRow
                        label="Site performance"
                        value="2 sites"
                        width="48%"
                      />
                      <RiskRow
                        label="Open safety reviews"
                        value="4"
                        width="37%"
                      />
                    </div>

                    <div className="mt-5 rounded-2xl border border-[#dce4d8] dark:border-emerald-900/50 bg-white dark:bg-[#101b15] p-4">
                      <div className="flex gap-3">
                        <Zap size={16} className="mt-0.5 text-[#688868] dark:text-emerald-400" />
                        <p className="text-xs leading-5 text-[#697569] dark:text-emerald-300/70">
                          <span className="font-semibold text-[#3f5d45] dark:text-emerald-200">
                            Suggested action:
                          </span>{" "}
                          review site recruitment and approaching ethics
                          milestone before the next monitoring cycle.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[10px] text-[#8a9488] dark:text-emerald-400/60">
                      <span>AI / rules support</span>
                      <span>Human approval required</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ================================================================== */}
          {/* ROLE BASED                                                         */}
          {/* ================================================================== */}
          <section className="bg-[#f7f3e9] dark:bg-[#111c16] py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal>
                <div className="text-center">
                  <SectionEyebrow>Role-based intelligence</SectionEyebrow>

                  <h2 className="mx-auto max-w-3xl text-4xl font-medium tracking-[-0.04em] text-[#1f3e2c] dark:text-emerald-100 sm:text-5xl">
                    The same trial.
                    <span className="text-[#708b70] dark:text-emerald-400">
                      {" "}
                      Different perspectives.
                    </span>
                  </h2>

                  <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#6e776e] dark:text-emerald-300/80">
                    Every stakeholder sees the information, actions and KPIs
                    relevant to their responsibility.
                  </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-[0.55fr_1.45fr]">
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                    {roles.map((role, index) => {
                      const Icon = role.icon;
                      const active = index === activeRole;

                      return (
                        <button
                          key={role.title}
                          onClick={() => setActiveRole(index)}
                          className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                            active
                              ? "border-[#91ac91] dark:border-emerald-600 bg-[#eaf2e7] dark:bg-emerald-950/60 shadow-sm"
                              : "border-[#dde4da] dark:border-emerald-900/50 bg-[#fcfbf6] dark:bg-[#15231c] hover:border-[#bdcfba]"
                          }`}
                        >
                          <div
                            className={`rounded-xl p-2.5 ${
                              active
                                ? "bg-[#31573e] dark:bg-emerald-600 text-white"
                                : "bg-[#edf2e9] dark:bg-emerald-950 text-[#68836b] dark:text-emerald-300"
                            }`}
                          >
                            <Icon size={18} />
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-[#35543d] dark:text-emerald-200">
                              {role.title}
                            </p>
                            <p className="mt-1 text-[10px] text-[#899288] dark:text-emerald-400/60">
                              Role workspace
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-[32px] border border-[#d9e1d6] dark:border-emerald-900/50 bg-[#fcfbf6] dark:bg-[#15231c] p-6 shadow-[0_25px_60px_rgba(44,70,47,0.07)]">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e7df] dark:border-emerald-900/40 pb-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-[#e7f0e3] dark:bg-emerald-950 p-3 text-[#54795a] dark:text-emerald-300">
                          {React.createElement(roles[activeRole].icon, {
                            size: 21,
                          })}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#899388] dark:text-emerald-400/60">
                            Current workspace
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-[#2c4e36] dark:text-emerald-100">
                            {roles[activeRole].title}
                          </h3>
                        </div>
                      </div>

                      <div className="rounded-full bg-[#edf4e9] dark:bg-emerald-950 px-3 py-1.5 text-[10px] font-semibold text-[#57765b] dark:text-emerald-300">
                        AUTHORIZED VIEW
                      </div>
                    </div>

                    <div className="grid gap-3 pt-5 sm:grid-cols-2">
                      {roles[activeRole].items.map((item, index) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-2xl border border-[#e2e7df] dark:border-emerald-900/50 bg-white dark:bg-[#101b15] p-4"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#edf3e9] dark:bg-emerald-950 text-[10px] font-bold text-[#638166] dark:text-emerald-300">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-[#526254] dark:text-emerald-300/80">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <DashboardStat value="37" label="Studies" />
                      <DashboardStat value="14" label="Safety cases" />
                      <DashboardStat value="07" label="Actions" />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ================================================================== */}
          {/* SECURITY / INTEGRITY                                               */}
          {/* ================================================================== */}
          <section className="bg-[#e8e2d3] dark:bg-[#0e1713] py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal>
                <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
                  <div>
                    <SectionEyebrow>Trust layer</SectionEyebrow>

                    <h2 className="text-4xl font-medium tracking-[-0.04em] text-[#26432f] dark:text-emerald-100 sm:text-5xl">
                      Built for
                      <span className="text-[#758c70] dark:text-emerald-400"> traceability.</span>
                    </h2>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-[#6c756b] dark:text-emerald-300/80">
                      Clinical research requires more than a polished interface.
                      Every important action should have identity, authorization,
                      history and context.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {[
                        ["Role-based access", KeyRound],
                        ["Audit history", Fingerprint],
                        ["Consent tracking", UserCheck],
                        ["Data integrity", ShieldCheck],
                      ].map(([label, Icon]) => (
                        <div
                          key={label}
                          className="flex items-center gap-3 rounded-2xl border border-[#d5d1bf] dark:border-emerald-900/50 bg-[#f8f5eb]/80 dark:bg-[#14211a] p-4"
                        >
                          <div className="rounded-xl bg-[#e8f0e3] dark:bg-emerald-950 p-2.5 text-[#58795c] dark:text-emerald-300">
                            <Icon size={17} />
                          </div>
                          <span className="text-sm font-semibold text-[#48604c] dark:text-emerald-200">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[32px] border border-[#d2d8c9] dark:border-emerald-900/50 bg-[#f8f7f0] dark:bg-[#15231c] p-6 shadow-[0_25px_70px_rgba(67,70,48,0.08)]">
                    <div className="flex items-center justify-between border-b border-[#e2e5db] dark:border-emerald-900/40 pb-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b9187] dark:text-emerald-400/60">
                          Immutable audit stream
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#3b5741] dark:text-emerald-200">
                          Record history
                        </p>
                      </div>

                      <LockKeyhole size={19} className="text-[#688668] dark:text-emerald-400" />
                    </div>

                    <div className="mt-5 space-y-3">
                      <AuditRow
                        time="10:02:41"
                        user="INV-0042"
                        action="Clinical value updated"
                        detail="BP 140/90 → 130/80"
                      />
                      <AuditRow
                        time="10:03:07"
                        user="INV-0042"
                        action="Reason recorded"
                        detail="Transcription correction"
                      />
                      <AuditRow
                        time="10:04:12"
                        user="PV-0011"
                        action="Safety review opened"
                        detail="PV-2026-00127"
                      />
                    </div>

                    <div className="mt-5 rounded-2xl bg-[#edf3e9] dark:bg-emerald-950/40 p-4">
                      <div className="flex items-center gap-2">
                        <BadgeCheck size={16} className="text-[#5f8061] dark:text-emerald-400" />
                        <p className="text-xs font-semibold text-[#49664e] dark:text-emerald-200">
                          Identity + timestamp + action + context
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ================================================================== */}
          {/* ARCHITECTURE SUMMARY                                               */}
          {/* ================================================================== */}
          <section className="bg-[#f7f3e9] dark:bg-[#111c16] py-24 lg:py-36">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal>
                <div className="text-center">
                  <SectionEyebrow>Platform architecture</SectionEyebrow>

                  <h2 className="mx-auto max-w-3xl text-4xl font-medium tracking-[-0.04em] text-[#1f3d2c] dark:text-emerald-100 sm:text-5xl">
                    One operational core.
                    <span className="text-[#738d73] dark:text-emerald-400">
                      {" "}
                      Multiple intelligence layers.
                    </span>
                  </h2>
                </div>

                <div className="relative mx-auto mt-14 max-w-5xl">
                  <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[#dbe3d7] dark:bg-emerald-900/40 lg:block" />

                  <div className="grid gap-4">
                    <ArchitectureRow
                      number="01"
                      title="Users & roles"
                      text="Investigators • Ethics • Pharmacovigilance • Leadership"
                      icon={<Users size={20} />}
                    />

                    <ArchitectureConnector />

                    <ArchitectureRow
                      number="02"
                      title="Clinical trial core"
                      text="Studies • Sites • Participants • Visits • eCRF • Milestones"
                      icon={<Layers3 size={20} />}
                      highlighted
                    />

                    <ArchitectureConnector />

                    <div className="grid gap-4 lg:grid-cols-2">
                      <ArchitectureRow
                        number="03A"
                        title="Interoperability"
                        text="FHIR • Canonical model • CDISC • SDTM / ADaM"
                        icon={<Network size={20} />}
                      />

                      <ArchitectureRow
                        number="03B"
                        title="Safety intelligence"
                        text="AE • SAE • Coding • Timelines • Signals"
                        icon={<HeartPulse size={20} />}
                      />
                    </div>

                    <ArchitectureConnector />

                    <ArchitectureRow
                      number="04"
                      title="Analytics & decision support"
                      text="KPIs • Alerts • Risk explanations • Human actions"
                      icon={<BrainCircuit size={20} />}
                      highlighted
                    />

                    <ArchitectureConnector />

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {["RBAC", "Audit", "Consent", "Security"].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-[#dbe2d7] dark:border-emerald-900/50 bg-[#fcfbf6] dark:bg-[#15231c] p-4 text-center"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#728073] dark:text-emerald-300">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ================================================================== */}
          {/* DIFFERENTIATOR                                                     */}
          {/* ================================================================== */}
          <section className="bg-[#203d2c] dark:bg-[#0a120e] py-24 text-white lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal>
                <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                  <div>
                    <SectionEyebrow dark>Why AyurPrana</SectionEyebrow>

                    <h2 className="text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
                      Not another
                      <span className="block text-[#b9d3ae] dark:text-emerald-300">
                        clinical dashboard.
                      </span>
                    </h2>

                    <p className="mt-6 max-w-lg text-lg leading-8 text-[#b2c3b4] dark:text-emerald-300/70">
                      The differentiation is in the connection: Ayurveda-specific
                      clinical context, interoperable data, safety workflows and
                      explainable operational intelligence working together.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <DarkDifferentiator
                      number="01"
                      title="Ayurveda Clinical Semantic Bridge"
                      text="Ayurveda-specific clinical information → canonical model → FHIR / CDISC representations."
                      icon={<Leaf size={19} />}
                    />

                    <DarkDifferentiator
                      number="02"
                      title="Explainable Trial Risk Engine"
                      text="Cross-module signals → evidence-backed operational risk → responsible human action."
                      icon={<BrainCircuit size={19} />}
                    />

                    <DarkDifferentiator
                      number="03"
                      title="Connected Safety Intelligence"
                      text="AE → SAE → coding → timeline → review → safety signal support."
                      icon={<HeartPulse size={19} />}
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ================================================================== */}
          {/* FINAL CTA                                                          */}
          {/* ================================================================== */}
          <section className="relative overflow-hidden bg-[#f0eadb] dark:bg-[#0c1611] py-24 lg:py-32">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8e7d2] dark:bg-emerald-950/40 opacity-60 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
              <Reveal>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#31573e] dark:bg-emerald-600 text-white shadow-xl">
                  <Leaf size={28} strokeWidth={1.6} />
                </div>

                <h2 className="mt-8 text-4xl font-medium tracking-[-0.045em] text-[#203f2d] dark:text-emerald-100 sm:text-6xl">
                  Research that stays
                  <span className="text-[#6f896f] dark:text-emerald-400"> connected.</span>
                </h2>

                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#70776d] dark:text-emerald-300/80">
                  From Ayurveda-specific clinical data to interoperable research
                  standards, from safety events to operational intelligence —
                  AyurPrana connects the pieces that make modern clinical
                  research work.
                </p>

                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <a
                    href="#platform"
                    className="inline-flex items-center gap-2 rounded-full bg-[#234c35] dark:bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1b3e2b] dark:hover:bg-emerald-500"
                  >
                    Explore capabilities
                    <ArrowUpRight size={16} />
                  </a>

                  <a
                    href="#architecture"
                    className="inline-flex items-center gap-2 rounded-full border border-[#c7d3c2] dark:border-emerald-800/60 bg-white/70 dark:bg-emerald-950/40 px-7 py-3.5 text-sm font-semibold text-[#31563e] dark:text-emerald-300 transition hover:bg-white dark:hover:bg-emerald-900/40"
                  >
                    View architecture
                    <Network size={16} />
                  </a>
                </div>
              </Reveal>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               SUB COMPONENTS                               */
/* -------------------------------------------------------------------------- */

function MiniFlow({ icon, title, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#dde6d9] dark:border-emerald-900/60 bg-white/70 dark:bg-emerald-950/30 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <div className="text-[#648167] dark:text-emerald-400">{icon}</div>
        <span className="text-[11px] font-medium text-[#536555] dark:text-emerald-300">
          {title}
        </span>
      </div>

      <span className="rounded-full bg-[#edf3e9] dark:bg-emerald-900 px-2 py-1 font-mono text-[9px] font-semibold text-[#607b62] dark:text-emerald-200">
        {value}
      </span>
    </div>
  );
}

function MiniMetric({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#e0e6dc] dark:border-emerald-900/60 bg-white/70 dark:bg-emerald-950/30 p-3">
      <div>
        <p className="text-[9px] uppercase tracking-[0.12em] text-[#8a9489] dark:text-emerald-400/60">
          {label}
        </p>
        <p className="mt-1 text-lg font-semibold text-[#36583f] dark:text-emerald-100">{value}</p>
      </div>

      <div className="rounded-xl bg-[#edf3e9] dark:bg-emerald-900 p-2 text-[#668268] dark:text-emerald-300">
        {icon}
      </div>
    </div>
  );
}

function PipelineCard({ number, icon, title, subtitle, badge, active }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-3.5 ${
        active
          ? "border-[#a9c4a6] dark:border-emerald-700 bg-[#edf5e9] dark:bg-emerald-950/60"
          : "border-[#e1e6de] dark:border-emerald-900/40 bg-white/70 dark:bg-emerald-950/20"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-[#31573e] dark:bg-emerald-600 text-white"
            : "bg-[#edf2e9] dark:bg-emerald-900 text-[#648167] dark:text-emerald-300"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-[#a0a89e] dark:text-emerald-500/60">{number}</span>
          <p className="truncate text-xs font-semibold text-[#3a5740] dark:text-emerald-200">
            {title}
          </p>
        </div>

        <p className="mt-0.5 truncate text-[10px] text-[#899388] dark:text-emerald-400/60">
          {subtitle}
        </p>
      </div>

      <span className="rounded-full bg-[#f0f3eb] dark:bg-emerald-900 px-2 py-1 font-mono text-[8px] font-bold text-[#718072] dark:text-emerald-300">
        {badge}
      </span>
    </div>
  );
}

function BridgeNode({ icon, title, detail, highlighted = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlighted
          ? "border-[#abc4a8] dark:border-emerald-600 bg-[#edf4e9] dark:bg-emerald-950/60"
          : "border-[#e0e3d7] dark:border-emerald-900/40 bg-white/60 dark:bg-emerald-950/20"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-[#e7efe3] dark:bg-emerald-900 p-2 text-[#638164] dark:text-emerald-300">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-[#3b5941] dark:text-emerald-200">{title}</p>
          <p className="mt-1 text-[10px] leading-4 text-[#879087] dark:text-emerald-400/60">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function DataPoint({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#e1e6dd] dark:border-emerald-900/40 bg-white dark:bg-[#101b15] p-3.5">
      <p className="text-[9px] uppercase tracking-[0.14em] text-[#939c92] dark:text-emerald-400/60">
        {label}
      </p>
      <p className="mt-1.5 text-xs font-semibold text-[#4a604e] dark:text-emerald-200">{value}</p>
    </div>
  );
}

function RiskRow({ label, value, width }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#6c786d] dark:text-emerald-300/80">{label}</span>
        <span className="font-mono text-[10px] text-[#788679] dark:text-emerald-400">{value}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[#e1e7dd] dark:bg-emerald-950">
        <div
          className="h-full rounded-full bg-[#769578] dark:bg-emerald-500"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function DashboardStat({ value, label }) {
  return (
    <div className="rounded-2xl bg-[#eef3ea] dark:bg-emerald-950/40 p-4 text-center">
      <p className="text-xl font-semibold tracking-tight text-[#36583e] dark:text-emerald-100">
        {value}
      </p>
      <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-[#879287] dark:text-emerald-400/60">
        {label}
      </p>
    </div>
  );
}

function AuditRow({ time, user, action, detail }) {
  return (
    <div className="rounded-2xl border border-[#e1e5dc] dark:border-emerald-900/40 bg-white dark:bg-[#101b15] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-[#8d968c] dark:text-emerald-400/60">{time}</span>
          <span className="rounded-full bg-[#edf3e9] dark:bg-emerald-900 px-2 py-1 font-mono text-[8px] font-semibold text-[#617962] dark:text-emerald-200">
            {user}
          </span>
        </div>

        <Check size={14} className="text-[#648367] dark:text-emerald-400" />
      </div>

      <p className="mt-3 text-xs font-semibold text-[#4b624f] dark:text-emerald-200">{action}</p>
      <p className="mt-1 text-[10px] text-[#879087] dark:text-emerald-400/60">{detail}</p>
    </div>
  );
}

function ArchitectureRow({
  number,
  title,
  text,
  icon,
  highlighted = false,
}) {
  return (
    <div
      className={`relative z-10 flex items-center gap-4 rounded-[26px] border p-5 ${
        highlighted
          ? "border-[#a9c3a6] dark:border-emerald-600 bg-[#edf4e9] dark:bg-emerald-950/60"
          : "border-[#dbe2d7] dark:border-emerald-900/40 bg-[#fcfbf6] dark:bg-[#15231c]"
      }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
          highlighted
            ? "bg-[#31573e] dark:bg-emerald-600 text-white"
            : "bg-[#eaf1e6] dark:bg-emerald-900 text-[#618063] dark:text-emerald-300"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-[#9ba49a] dark:text-emerald-500/60">
            {number}
          </span>
          <h3 className="text-sm font-semibold text-[#36553e] dark:text-emerald-200">{title}</h3>
        </div>
        <p className="mt-1 text-xs leading-5 text-[#7a857b] dark:text-emerald-300/70">{text}</p>
      </div>
    </div>
  );
}

function ArchitectureConnector() {
  return (
    <div className="flex justify-center py-0.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dce4d8] dark:border-emerald-900/50 bg-[#f7f3e9] dark:bg-[#111c16]">
        <ArrowDown size={14} className="text-[#799078] dark:text-emerald-400" />
      </div>
    </div>
  );
}

function DarkDifferentiator({ number, title, text, icon }) {
  return (
    <div className="group rounded-[26px] border border-white/10 dark:border-emerald-900/50 bg-white/[0.045] dark:bg-emerald-950/20 p-6 transition hover:border-white/15 hover:bg-white/[0.07]">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#b9d3ae]/10 text-[#b9d3ae]">
          {icon}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-[#718b76]">
              {number}
            </span>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
          </div>

          <p className="mt-2 text-sm leading-6 text-[#9fb1a1]">{text}</p>
        </div>

        <ArrowUpRight
          size={16}
          className="text-[#6e8b72] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </div>
  );
}