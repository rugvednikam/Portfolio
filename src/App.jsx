/**
 * Portfolio Website — Business/Data Analyst
 * Aesthetic: Editorial Data Noir
 * Stack: React + Tailwind CSS (CDN classes only)
 * Single-file, production-ready, dark/light mode
 */

import { useState, useEffect, useRef } from "react";

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
const useTheme = () => {
  const [dark, setDark] = useState(true);
  return { dark, toggle: () => setDark((d) => !d) };
};

// ─── CUSTOM HOOK: intersection observer for scroll reveal ─────────────────────
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

// ─── REVEAL WRAPPER ───────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0, className = "" }) => {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ─── COLOUR TOKENS (inline style approach to avoid Tailwind purge issues) ─────
const T = {
  dark: {
    bg: "#0a0a0f",
    surface: "#12121a",
    card: "#17172200",
    border: "#2a2a3a",
    accent: "#f59e0b",
    accentSoft: "#f59e0b22",
    text: "#e8e8f0",
    muted: "#8888aa",
    grad: "linear-gradient(135deg,#f59e0b22 0%,transparent 60%)",
  },
  light: {
    bg: "#f5f4ef",
    surface: "#ffffff",
    card: "#ffffff",
    border: "#e0ddd5",
    accent: "#c2770a",
    accentSoft: "#c2770a18",
    text: "#1a1a2e",
    muted: "#6b6b80",
    grad: "linear-gradient(135deg,#c2770a18 0%,transparent 60%)",
  },
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav = ({ dark, toggle }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const c = dark ? T.dark : T.light;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = ["About", "Skills", "Projects", "Experience", "Contact"];

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? (dark ? "rgba(10,10,15,0.92)" : "rgba(245,244,239,0.92)") : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? `1px solid ${c.border}` : "none",
        transition: "all 0.4s ease",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <a href="#hero" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 18, color: c.accent, letterSpacing: "-0.02em" }}>
            {"<"}<span style={{ color: c.text }}>Alex Morgan</span>{" />"}
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: c.muted, textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.target.style.color = c.accent}
              onMouseLeave={(e) => e.target.style.color = c.muted}
            >
              {l.toUpperCase()}
            </a>
          ))}
          {/* Theme toggle */}
          <button onClick={toggle}
            style={{ background: c.accentSoft, border: `1px solid ${c.accent}44`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", color: c.accent, fontFamily: "'Space Mono', monospace", fontSize: 12, transition: "all 0.2s" }}>
            {dark ? "☀ LIGHT" : "◑ DARK"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: c.text, fontSize: 22, display: "none" }}
          className="mobile-menu-btn">
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: c.surface, borderTop: `1px solid ${c.border}`, padding: "16px 24px 24px" }}>
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "12px 0", fontFamily: "'Space Mono', monospace", fontSize: 14, color: c.text, textDecoration: "none", borderBottom: `1px solid ${c.border}` }}>
              {l}
            </a>
          ))}
          <button onClick={toggle} style={{ marginTop: 16, background: c.accentSoft, border: `1px solid ${c.accent}`, borderRadius: 8, padding: "8px 20px", color: c.accent, fontFamily: "'Space Mono', monospace", fontSize: 13, cursor: "pointer" }}>
            {dark ? "☀ Light Mode" : "◑ Dark Mode"}
          </button>
        </div>
      )}
    </nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ c, dark }) => {
  const [typed, setTyped] = useState("");
  const roles = ["Business Analyst", "Data Analyst", "Analytics Consultant"];
  const [roleIdx, setRoleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIdx];
    const timeout = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setTyped(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setTimeout(() => setDeleting(true), 1800);
      } else if (deleting && charIdx > 0) {
        setTyped(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      } else {
        setDeleting(false);
        setRoleIdx((i) => (i + 1) % roles.length);
      }
    }, deleting ? 60 : 100);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, roleIdx]);

  // Grid dots background
  const gridStyle = {
    backgroundImage: dark
      ? `radial-gradient(circle, #f59e0b18 1px, transparent 1px)`
      : `radial-gradient(circle, #c2770a18 1px, transparent 1px)`,
    backgroundSize: "36px 36px",
  };

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", ...gridStyle, paddingTop: 80 }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}18 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}10 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%" }}>
        <div style={{ maxWidth: 760 }}>
          {/* Label */}
          <div style={{ opacity: 0, animation: "fadeUp 0.6s 0.1s ease forwards" }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: c.accent, letterSpacing: "0.15em", background: c.accentSoft, border: `1px solid ${c.accent}44`, borderRadius: 4, padding: "4px 12px" }}>
              AVAILABLE FOR HIRE · 2025
            </span>
          </div>

          {/* Name */}
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1.05, margin: "20px 0 12px", color: c.text, opacity: 0, animation: "fadeUp 0.7s 0.25s ease forwards" }}>
            Alex<br />
            <span style={{ color: c.accent, fontStyle: "italic" }}>Morgan</span>
          </h1>

          {/* Typewriter role */}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1rem, 3vw, 1.4rem)", color: c.muted, marginBottom: 24, minHeight: 36, opacity: 0, animation: "fadeUp 0.7s 0.4s ease forwards" }}>
            <span style={{ color: c.accent }}>{"> "}</span>
            {typed}
            <span style={{ borderRight: `2px solid ${c.accent}`, marginLeft: 2, animation: "blink 1s step-end infinite" }}></span>
          </div>

          {/* Value proposition */}
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: c.muted, maxWidth: 560, lineHeight: 1.7, marginBottom: 40, opacity: 0, animation: "fadeUp 0.7s 0.55s ease forwards" }}>
            I transform raw data into strategic decisions. Combining <strong style={{ color: c.text }}>SQL, Python, and Power BI</strong> expertise with business acumen to uncover insights that drive measurable impact.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.7s 0.7s ease forwards" }}>
            <a href="#projects" style={{ background: c.accent, color: "#0a0a0f", fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", padding: "14px 28px", borderRadius: 8, textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s", display: "inline-block" }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 24px ${c.accent}44`; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}>
              VIEW PROJECTS
            </a>
            <a href="#" style={{ background: "transparent", color: c.text, fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", padding: "14px 28px", borderRadius: 8, border: `1px solid ${c.border}`, textDecoration: "none", transition: "all 0.2s", display: "inline-block" }}
              onMouseEnter={(e) => { e.target.style.borderColor = c.accent; e.target.style.color = c.accent; }}
              onMouseLeave={(e) => { e.target.style.borderColor = c.border; e.target.style.color = c.text; }}>
              ↓ DOWNLOAD RESUME
            </a>
            <a href="#contact" style={{ background: "transparent", color: c.muted, fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: "0.08em", padding: "14px 28px", borderRadius: 8, border: `1px solid ${c.border}44`, textDecoration: "none", transition: "color 0.2s", display: "inline-block" }}
              onMouseEnter={(e) => e.target.style.color = c.accent}
              onMouseLeave={(e) => e.target.style.color = c.muted}>
              GET IN TOUCH
            </a>
          </div>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: 40, marginTop: 64, flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.7s 0.9s ease forwards" }}>
            {[["4+", "Projects Delivered"], ["3", "Target Roles"], ["5+", "Tools Mastered"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: c.accent, lineHeight: 1 }}>{num}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: c.muted, letterSpacing: "0.1em", marginTop: 4 }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0, animation: "fadeUp 0.7s 1.2s ease forwards" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: c.muted, letterSpacing: "0.2em" }}>SCROLL</span>
        <div style={{ width: 1, height: 48, background: `linear-gradient(${c.accent}, transparent)`, animation: "scrollPulse 1.8s ease-in-out infinite" }} />
      </div>
    </section>
  );
};

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const About = ({ c }) => (
  <section id="about" style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
      {/* Left */}
      <Reveal>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: c.accent, letterSpacing: "0.2em" }}>01 — ABOUT ME</span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, color: c.text, margin: "16px 0 24px", lineHeight: 1.15 }}>
          Data-Driven.<br /><span style={{ color: c.accent, fontStyle: "italic" }}>Business-Focused.</span>
        </h2>
        <p style={{ color: c.muted, lineHeight: 1.85, fontSize: 16, marginBottom: 20 }}>
          I'm a Business & Data Analyst who bridges the gap between raw datasets and executive decisions. My approach starts with the business question — not the data — and works backward to find the signal in the noise.
        </p>
        <p style={{ color: c.muted, lineHeight: 1.85, fontSize: 16 }}>
          With hands-on experience in end-to-end analytics workflows — from ETL pipeline design to interactive Power BI dashboards — I deliver insights that stakeholders actually act on.
        </p>
      </Reveal>

      {/* Right cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {[
          { icon: "◈", title: "Analytical Mindset", desc: "Statistical thinking meets business context. I ask 'so what?' before presenting any number." },
          { icon: "◉", title: "Business-First Approach", desc: "Every query, chart, and model is anchored to a business objective and KPI that matters." },
          { icon: "◇", title: "Data Storytelling", desc: "I craft narratives from data that move stakeholders from confusion to clarity to action." },
        ].map(({ icon, title, desc }, i) => (
          <Reveal key={title} delay={i * 100}>
            <div style={{ padding: "24px 28px", borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, display: "flex", gap: 20, alignItems: "flex-start", transition: "border-color 0.3s, transform 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.accent + "88"; e.currentTarget.style.transform = "translateX(6px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "translateX(0)"; }}>
              <span style={{ fontSize: 24, color: c.accent, marginTop: 2 }}>{icon}</span>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: c.text, fontSize: 14, marginBottom: 6 }}>{title}</div>
                <div style={{ color: c.muted, fontSize: 14, lineHeight: 1.7 }}>{desc}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ─── SKILL BAR ────────────────────────────────────────────────────────────────
const SkillBar = ({ name, level, c, delay }) => {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: c.text }}>{name}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: c.accent }}>{level}%</span>
      </div>
      <div style={{ height: 4, background: c.border, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: visible ? `${level}%` : "0%", background: `linear-gradient(90deg, ${c.accent}, ${c.accent}88)`, borderRadius: 4, transition: `width 1.2s ${delay}ms cubic-bezier(0.4,0,0.2,1)` }} />
      </div>
    </div>
  );
};

// ─── SKILLS ───────────────────────────────────────────────────────────────────
const Skills = ({ c }) => {
  const categories = [
    { label: "Programming", skills: [{ name: "Python (Pandas, NumPy, Matplotlib)", level: 85 }, { name: "SQL (Window Functions, CTEs)", level: 90 }, { name: "Git & Version Control", level: 72 }] },
    { label: "BI & Analytics Tools", skills: [{ name: "Power BI (DAX, Data Modelling)", level: 88 }, { name: "Microsoft Excel (Advanced)", level: 92 }, { name: "Google Analytics", level: 70 }] },
    { label: "Data Techniques", skills: [{ name: "ETL / Data Pipeline Design", level: 80 }, { name: "Exploratory Data Analysis (EDA)", level: 87 }, { name: "KPI Design & Dashboard Strategy", level: 85 }] },
    { label: "Soft Skills", skills: [{ name: "Stakeholder Communication", level: 90 }, { name: "Requirements Gathering", level: 85 }, { name: "Data Storytelling & Presentation", level: 88 }] },
  ];

  return (
    <section id="skills" style={{ padding: "120px 24px", background: c.surface }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: c.accent, letterSpacing: "0.2em" }}>02 — SKILLS</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: c.text, margin: "16px 0 56px", lineHeight: 1.2 }}>
            Tools & <span style={{ color: c.accent, fontStyle: "italic" }}>Expertise</span>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
          {categories.map(({ label, skills }, ci) => (
            <Reveal key={label} delay={ci * 80}>
              <div style={{ padding: "28px 28px 20px", borderRadius: 12, border: `1px solid ${c.border}`, background: c.bg }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: c.accent, letterSpacing: "0.15em", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 20, height: 1, background: c.accent, display: "inline-block" }} />
                  {label.toUpperCase()}
                </div>
                {skills.map((s, si) => <SkillBar key={s.name} name={s.name} level={s.level} c={c} delay={si * 150} />)}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
const ProjectCard = ({ project, c, i }) => {
  const [hovered, setHovered] = useState(false);
  const colors = ["#f59e0b", "#10b981", "#6366f1", "#f43f5e"];
  const accent = colors[i % colors.length];

  return (
    <Reveal delay={i * 120}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: 16, border: `1px solid ${hovered ? accent + "66" : c.border}`,
          background: c.surface, overflow: "hidden", transition: "all 0.35s ease",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered ? `0 20px 60px ${accent}18` : "none",
        }}
      >
        {/* Preview placeholder */}
        <div style={{ height: 180, background: `linear-gradient(135deg, ${accent}22 0%, ${c.bg} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, ${accent}08 0px, ${accent}08 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, ${accent}08 0px, ${accent}08 1px, transparent 1px, transparent 28px)` }} />
          <div style={{ textAlign: "center", zIndex: 1 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{project.icon}</div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: accent, letterSpacing: "0.15em", background: accent + "22", border: `1px solid ${accent}44`, borderRadius: 4, padding: "4px 10px" }}>DASHBOARD PREVIEW</span>
          </div>
        </div>

        <div style={{ padding: "28px 28px 24px" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: accent, letterSpacing: "0.15em", marginBottom: 10 }}>
            {project.category.toUpperCase()}
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: c.text, marginBottom: 16, lineHeight: 1.3 }}>{project.title}</h3>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {project.tools.map((t) => (
              <span key={t} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: c.muted, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 4, padding: "3px 9px" }}>{t}</span>
            ))}
          </div>

          {/* Business problem */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: c.muted, letterSpacing: "0.1em", marginBottom: 6 }}>BUSINESS PROBLEM</div>
            <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.7 }}>{project.problem}</p>
          </div>

          {/* KPIs */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            {project.kpis.map((kpi) => (
              <div key={kpi} style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: accent, background: accent + "14", borderRadius: 6, padding: "4px 10px" }}>
                {kpi}
              </div>
            ))}
          </div>

          {/* Impact */}
          <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: 14, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: c.muted, letterSpacing: "0.1em", marginBottom: 4 }}>IMPACT</div>
            <p style={{ fontSize: 13, color: c.text, lineHeight: 1.6 }}>{project.impact}</p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 12 }}>
            <a href="#" style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: c.text, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 6, padding: "8px 16px", textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = accent; e.target.style.color = accent; }}
              onMouseLeave={(e) => { e.target.style.borderColor = c.border; e.target.style.color = c.text; }}>
              ⌥ GitHub
            </a>
            <a href="#" style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#0a0a0f", background: accent, borderRadius: 6, padding: "8px 16px", textDecoration: "none", fontWeight: 700, transition: "opacity 0.2s" }}
              onMouseEnter={(e) => e.target.style.opacity = "0.85"}
              onMouseLeave={(e) => e.target.style.opacity = "1"}>
              ↗ Live Demo
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

const Projects = ({ c }) => {
  const projects = [
    {
      title: "Telecom Churn Analysis",
      category: "Customer Analytics",
      icon: "📡",
      tools: ["Python", "SQL", "Power BI", "Pandas", "Scikit-learn"],
      problem: "A telecom provider was losing ~22% of customers annually with no visibility into which customers were likely to churn or why.",
      kpis: ["Churn Rate", "CLV", "Retention ROI", "Segment Risk Score"],
      impact: "Identified top 3 churn drivers, enabling targeted retention campaigns projected to reduce churn by 15% and save $2.4M annually.",
    },
    {
      title: "Social Media Engagement Dashboard",
      category: "Marketing Analytics",
      icon: "📊",
      tools: ["Python", "Power BI", "Excel", "APIs", "DAX"],
      problem: "Marketing team lacked a unified view of cross-platform engagement metrics, making ROI measurement and content strategy decisions slow and inconsistent.",
      kpis: ["Engagement Rate", "Reach", "CTR", "Content ROI"],
      impact: "Centralized 6 platform data sources into a real-time dashboard, reducing reporting time from 3 days to 2 hours per week.",
    },
    {
      title: "AI Resume Enhancer",
      category: "NLP / Product Analytics",
      icon: "🤖",
      tools: ["Python", "OpenAI API", "NLP", "Streamlit", "SQL"],
      problem: "Job seekers lacked data-driven feedback on resume quality vs. ATS requirements and job description alignment.",
      kpis: ["ATS Match Score", "Keyword Gap %", "Section Completeness"],
      impact: "Built an end-to-end NLP pipeline that scores and rewrites resumes with 87% user satisfaction, tested with 50+ early users.",
    },
    {
      title: "E-commerce Product Analytics",
      category: "Retail Analytics",
      icon: "🛍️",
      tools: ["SQL", "Python", "Excel", "Power BI", "ETL"],
      problem: "An e-commerce retailer had no insight into which SKUs drove profit vs. just revenue, leading to inefficient inventory and pricing decisions.",
      kpis: ["Gross Margin %", "Inventory Turnover", "Return Rate", "LTV"],
      impact: "Uncovered 28% of SKUs generating 72% of losses, leading to a pricing overhaul that improved gross margin by 9 percentage points.",
    },
  ];

  return (
    <section id="projects" style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: c.accent, letterSpacing: "0.2em" }}>03 — PROJECTS</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: c.text, margin: "16px 0 56px", lineHeight: 1.2 }}>
            Featured <span style={{ color: c.accent, fontStyle: "italic" }}>Work</span>
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
          {projects.map((p, i) => <ProjectCard key={p.title} project={p} c={c} i={i} />)}
        </div>
      </div>
    </section>
  );
};

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
const Experience = ({ c }) => {
  const experiences = [
    { type: "exp", year: "2024 – Present", title: "Junior Data Analyst", company: "Your Company Name", desc: "Placeholder: Describe your role, responsibilities, and key achievements. Quantify impact where possible." },
    { type: "exp", year: "2023 – 2024", title: "Business Analyst Intern", company: "Company Name", desc: "Placeholder: ETL process ownership, dashboard development, stakeholder reporting. Mention tools used." },
  ];
  const education = [
    { type: "edu", year: "2020 – 2024", title: "Bachelor of Science — Data Science / Business Analytics", company: "University Name", desc: "Relevant coursework: Statistics, Database Systems, Business Intelligence, Machine Learning Fundamentals." },
    { type: "cert", year: "2024", title: "Microsoft Power BI Data Analyst (PL-300)", company: "Microsoft Certified", desc: "Certified in data modelling, DAX, and enterprise-grade Power BI deployment." },
  ];

  const TimelineItem = ({ item, i }) => (
    <Reveal delay={i * 100}>
      <div style={{ display: "flex", gap: 28, marginBottom: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 20 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: c.accent, border: `2px solid ${c.bg}`, flexShrink: 0, marginTop: 6 }} />
          <div style={{ flex: 1, width: 1, background: c.border, marginTop: 8 }} />
        </div>
        <div style={{ paddingBottom: 8 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: c.accent, marginBottom: 4 }}>{item.year}</div>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: c.text, marginBottom: 4 }}>{item.title}</h4>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: c.muted, marginBottom: 10 }}>{item.company}</div>
          <p style={{ fontSize: 14, color: c.muted, lineHeight: 1.7 }}>{item.desc}</p>
        </div>
      </div>
    </Reveal>
  );

  return (
    <section id="experience" style={{ padding: "120px 24px", background: c.surface }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: c.accent, letterSpacing: "0.2em" }}>04 — EXPERIENCE & EDUCATION</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: c.text, margin: "16px 0 56px", lineHeight: 1.2 }}>
            Background & <span style={{ color: c.accent, fontStyle: "italic" }}>Credentials</span>
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: c.muted, letterSpacing: "0.15em", marginBottom: 28, paddingBottom: 12, borderBottom: `1px solid ${c.border}` }}>WORK EXPERIENCE</div>
            {experiences.map((e, i) => <TimelineItem key={i} item={e} i={i} />)}
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: c.muted, letterSpacing: "0.15em", marginBottom: 28, paddingBottom: 12, borderBottom: `1px solid ${c.border}` }}>EDUCATION & CERTIFICATIONS</div>
            {education.map((e, i) => <TimelineItem key={i} item={e} i={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── CONTACT ──────────────────────────────────────────────────────────────────
const Contact = ({ c }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 8, fontSize: 14,
    fontFamily: "'Space Mono', monospace", background: c.bg, border: `1px solid ${c.border}`,
    color: c.text, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  return (
    <section id="contact" style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: c.accent, letterSpacing: "0.2em" }}>05 — CONTACT</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: c.text, margin: "16px 0 16px" }}>
            Let's <span style={{ color: c.accent, fontStyle: "italic" }}>Connect</span>
          </h2>
          <p style={{ color: c.muted, fontSize: 16, marginBottom: 56, maxWidth: 500 }}>
            Open to Business Analyst, Data Analyst, and Junior Analytics Consultant roles. Drop me a message.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64 }}>
          {/* Socials */}
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "⟁", label: "LinkedIn", handle: "linkedin.com/in/alexmorgan", href: "#" },
                { icon: "⊙", label: "GitHub", handle: "github.com/alexmorgan", href: "#" },
                { icon: "◈", label: "Email", handle: "alex.morgan@email.com", href: "mailto:alex@email.com" },
              ].map(({ icon, label, handle, href }) => (
                <a key={label} href={href} style={{ display: "flex", gap: 20, alignItems: "center", padding: "20px 24px", borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, textDecoration: "none", transition: "all 0.25s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.accent + "66"; e.currentTarget.style.transform = "translateX(6px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "translateX(0)"; }}>
                  <span style={{ fontSize: 22, color: c.accent }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: c.muted, letterSpacing: "0.1em", marginBottom: 4 }}>{label.toUpperCase()}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: c.text }}>{handle}</div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={150}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: c.muted, letterSpacing: "0.12em", display: "block", marginBottom: 8 }}>YOUR NAME</label>
                  <input required style={inputStyle} placeholder="Jane Smith" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = c.accent}
                    onBlur={(e) => e.target.style.borderColor = c.border} />
                </div>
                <div>
                  <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: c.muted, letterSpacing: "0.12em", display: "block", marginBottom: 8 }}>EMAIL</label>
                  <input required type="email" style={inputStyle} placeholder="jane@company.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = c.accent}
                    onBlur={(e) => e.target.style.borderColor = c.border} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: c.muted, letterSpacing: "0.12em", display: "block", marginBottom: 8 }}>MESSAGE</label>
                <textarea required rows={5} style={{ ...inputStyle, resize: "vertical" }} placeholder="I'd love to discuss an opportunity..." value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={(e) => e.target.style.borderColor = c.accent}
                  onBlur={(e) => e.target.style.borderColor = c.border} />
              </div>
              <button type="submit" style={{ background: sent ? "#10b981" : c.accent, color: "#0a0a0f", fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", padding: "16px 32px", borderRadius: 8, border: "none", cursor: "pointer", transition: "all 0.3s", alignSelf: "flex-start" }}>
                {sent ? "✓ MESSAGE SENT" : "SEND MESSAGE →"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = ({ c }) => (
  <footer style={{ borderTop: `1px solid ${c.border}`, padding: "32px 24px", textAlign: "center" }}>
    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: c.muted, letterSpacing: "0.1em" }}>
      © 2025 <span style={{ color: c.accent }}>Alex Morgan</span> · Business & Data Analyst · Built with React
    </p>
  </footer>
);

// ─── CSS INJECTION ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Space+Mono:wght@400;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { -webkit-font-smoothing: antialiased; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes blink { 50% { opacity: 0; } }
    @keyframes scrollPulse { 0%,100% { opacity: 0.3; transform: scaleY(0.7); } 50% { opacity: 1; transform: scaleY(1); } }
    @media (max-width: 768px) {
      .desktop-nav { display: none !important; }
      .mobile-menu-btn { display: block !important; }
    }
    @media (max-width: 900px) {
      section > div > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 40px !important; }
      section > div > div[style*="grid-template-columns: 1fr 1.4fr"] { grid-template-columns: 1fr !important; gap: 40px !important; }
    }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #f59e0b44; border-radius: 3px; }
  `}</style>
);

// ─── SEO META TAGS (injected into document.head) ──────────────────────────────
const SEOMeta = () => {
  useEffect(() => {
    document.title = "Alex Morgan — Business Analyst & Data Analyst Portfolio";
    const metas = [
      { name: "description", content: "Business Analyst and Data Analyst portfolio. Expert in SQL, Python, Power BI, Excel. Projects in Telecom Churn Analysis, Social Media Analytics, AI Resume Enhancer, and E-commerce Analytics." },
      { name: "keywords", content: "Business Analyst, Data Analyst, SQL, Python, Power BI, Excel, ETL, Dashboard, Analytics, Consultant, KPI" },
      { name: "author", content: "Alex Morgan" },
      { property: "og:title", content: "Alex Morgan — Business Analyst & Data Analyst" },
      { property: "og:description", content: "Transforming data into strategic decisions. Open to BA, DA, and Analytics Consultant roles." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow" },
    ];
    metas.forEach(({ name, property, content }) => {
      const el = document.createElement("meta");
      if (name) el.setAttribute("name", name);
      if (property) el.setAttribute("property", property);
      el.setAttribute("content", content);
      document.head.appendChild(el);
    });
  }, []);
  return null;
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const { dark, toggle } = useTheme();
  const c = dark ? T.dark : T.light;

  return (
    <>
      <GlobalStyles />
      <SEOMeta />
      <div style={{ background: c.bg, color: c.text, minHeight: "100vh", transition: "background 0.4s ease, color 0.4s ease" }}>
        <Nav dark={dark} toggle={toggle} />
        <Hero c={c} dark={dark} />
        <About c={c} />
        <Skills c={c} />
        <Projects c={c} />
        <Experience c={c} />
        <Contact c={c} />
        <Footer c={c} />
      </div>
    </>
  );
}
