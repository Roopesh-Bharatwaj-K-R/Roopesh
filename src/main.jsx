


import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "motion/react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Plus,
  Minus,
  Layers,
  Database,
  Palette,
  FileText,
  Shield,
  ScanEye,
  Download,
  Github,
  Linkedin,
  Mail,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Award,
} from "lucide-react";
import data from "./content.json";
import "./styles.css";
import Journey from "./Journey";
const links = [
  ["work", "Work"],
  ["skills", "Expertise"],
  ["experience", "Experience"],
  ["method", "Method"],
];
const icons = [Layers, Database, Palette, FileText, Shield, ScanEye];
function Tags({ items }) {
  return (
    <div className="tags">
      {items.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  );
}
function Heading({ number, title, children }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{number}</p>
        <h2>{title}</h2>
      </div>
      {children && <p>{children}</p>}
    </div>
  );
}
function App() {
  const [light, setLight] = useState(() => {
      try {
        return localStorage.getItem("portfolio-theme") === "light";
      } catch {
        return false;
      }
    }),
    [menu, setMenu] = useState(false),
    [panel, setPanel] = useState(null),
    [step, setStep] = useState(0),
    [playing, setPlaying] = useState(false);
  const dialog = useRef(null),
    reduce = useReducedMotion();
  const [journey, setJourney] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const replayRef = useRef(null);
  const finishJourney = useCallback(() => {
    setJourney(false);
    requestAnimationFrame(() => replayRef.current?.focus());
  }, []);
  useEffect(() => {
    if (!journey) return;
    const nodes = [...document.querySelectorAll("header, main, footer")];
    nodes.forEach((n) => (n.inert = true));
    return () => nodes.forEach((n) => (n.inert = false));
  }, [journey]);
  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
    try {
      localStorage.setItem("portfolio-theme", light ? "light" : "dark");
    } catch {}
  }, [light]);
  useEffect(() => {
    if (panel) {
      dialog.current.showModal();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setStep((s) => {
          if (s === data.steps.length - 1) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        }),
      4200,
    );
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    const handle = () => {
      const id = location.hash.replace("#project-", "");
      if (location.hash.startsWith("#project-")) {
        const project = data.projects.find((p) => p.id === id);
        if (project) setPanel({ kind: "project", item: project });
      }
    };
    handle();
    addEventListener("hashchange", handle);
    return () => removeEventListener("hashchange", handle);
  }, []);
  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.1 },
        transition: { duration: 0.45 },
      };
  function openProject(p) {
    location.hash = "project-" + p.id;
    setPanel({ kind: "project", item: p });
  }
  function close() {
    dialog.current?.close();
    setPanel(null);
    if (location.hash.startsWith("#project-"))
      history.replaceState(
        null,
        "",
        location.pathname + location.search + "#work",
      );
  }
  function openPane(id) {
    setPanel({ kind: "pane", item: data.panes.find((p) => p.id === id) });
  }
  const current = data.steps[step];
  return (
    <>
      {journey && <Journey onComplete={finishJourney} />}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header>
        <nav className="container">
          <a href="#top" className="brand">
            RB<span>.</span>
            <small>ROOPESH BHARATWAJ KR</small>
          </a>
          <div className="desktop-nav">
            {links.map(([id, t]) => (
              <a href={"#" + id} key={id}>
                {t}
              </a>
            ))}
            <a className="nav-contact" href="#contact">
              Let’s talk
            </a>
          </div>
          <div className="nav-tools">
            <button
              className="icon-button"
              onClick={() => setLight(!light)}
              aria-label={
                light ? "Switch to dark theme" : "Switch to light theme"
              }
            >
              {light ? <Moon size={19} /> : <Sun size={19} />}
            </button>
            <button
              className="icon-button mobile-toggle"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label="Toggle navigation"
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
        {menu && (
          <div className="mobile-nav">
            {[...links, ["contact", "Contact"]].map(([id, t]) => (
              <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
                {t}
              </a>
            ))}
          </div>
        )}
      </header>
      <main id="main">
        <section id="top" className="hero container">
          <motion.div {...reveal}>
            <p className="eyebrow">AI ARCHITECT · APPLIED AI LEAD · IRELAND</p>
            <h1>
              Turning complex
              <br />
              problems into
              <br />
              <em>working AI.</em>
            </h1>
            <p className="hero-copy">
              I’m Roopesh. I connect architecture with hands-on engineering to
              deliver LLM applications, data platforms and cloud systems—from
              the first conversation to production.
            </p>
            <div className="actions">
              <a className="button primary" href="#work">
                Explore selected work
              </a>
              <a
                className="button"
                href="mailto:krroopeshbharatwaj1@gmail.com?subject=CV%20request"
              >
                <Mail size={17} /> CV available on request
              </a>
            </div>
            <button
              ref={replayRef}
              className="journey-replay"
              onClick={() => {
                window.scrollTo(0, 0);
                setJourney(true);
              }}
            >
              Replay universe-to-Dublin journey
            </button>
            <div className="hero-foot">
              CeADAR, University College Dublin <span> / </span> NovaUCD AI
              Accelerator
            </div>
          </motion.div>
          <motion.aside {...reveal} className="architecture">
            <div className="architecture-top">
              <span className="eyebrow">DELIVERY LIFECYCLE</span>
              <Layers size={22} />
            </div>
            {[
              ["01", "Understand", "Business needs · data · constraints"],
              ["02", "Architect", "Systems · models · security"],
              ["03", "Build & evaluate", "APIs · workflows · quality"],
              ["04", "Deploy & improve", "Cloud · monitoring · iteration"],
            ].map(([n, t, d]) => (
              <div className="architecture-row" key={n}>
                <span>{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </div>
            ))}
            <div className="architecture-bottom">
              Architecture grounded in implementation.
            </div>
          </motion.aside>
        </section>
        <div className="metrics container">
          {[
            ["11+", "Years in software & applied AI"],
            ["30+", "Startups advised over two years"],
            ["25–30M", "Records processed weekly"],
            ["10+", "Data scientists coordinated"],
          ].map(([n, t]) => (
            <div key={n}>
              <strong>{n}</strong>
              <span>{t}</span>
            </div>
          ))}
        </div>
        <section id="work" className="section container">
          <Heading
            number="01 / SELECTED WORK"
            title="Built around real problems."
          >
            Explore the purpose, contribution and engineering behind each
            project.
          </Heading>
          <div className="project-grid">
            {data.projects.map((p, i) => {
              const Icon = icons[i];
              return (
                <motion.button
                  {...reveal}
                  className={"project project-" + i}
                  key={p.id}
                  onClick={() => openProject(p)}
                >
                  <div className="project-top">
                    <Icon size={28} />
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="eyebrow">{p.category.split(" · ")[1]}</p>
                  <h3>{p.title}</h3>
                  <p className="project-summary">{p.summary}</p>
                  <Tags items={p.tags} />
                  <div className="project-bottom">
                    View case study <Plus size={19} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
        <section id="skills" className="tinted">
          <div className="section container">
            <Heading
              number="02 / EXPERTISE"
              title="Depth across the lifecycle."
            />
            <div className="skill-grid">
              {[
                ...data.skills,
                ...(!data.skills.some((s) =>
                  s.items?.some((t) =>
                    ["langfuse", "langsmith", "deepeval", "trulens"].includes(
                      t.toLowerCase(),
                    ),
                  ),
                )
                  ? [
                      {
                        title: "Evaluation & observability",
                        items: ["Langfuse", "LangSmith", "DeepEval", "TruLens"],
                      },
                    ]
                  : []),
              ].map((s, i) => (
                <div className="skill" key={s.title}>
                  <span className="eyebrow">0{i + 1}</span>
                  <h3>{s.title}</h3>
                  <Tags items={s.items} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="experience" className="section container">
          <Heading number="03 / EXPERIENCE" title="Research meets delivery." />
          <div className="timeline">
            {data.jobs.map((j, i) => (
              <motion.article {...reveal} className="job" key={j.title}>
                <div className="job-date">{j.date}</div>
                <div>
                  <h3>{j.title}</h3>
                  <p className="org">{j.org}</p>
                  <ul>
                    {j.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  {j.sections?.length > 0 && (
                    <div className="cohort-links">
                      <span>Explore selected projects</span>
                      {j.sections.map((section) => (
                        <button key={section.title} onClick={() => setPanel({
                          kind: "experience",
                          item: {title: section.title, summary: j.title + " · " + j.org, bullets: section.bullets}
                        })}>
                          {section.title}<Plus size={16} />
                        </button>
                      ))}
                    </div>
                  )}
                  {i === 0 && (
                    <details className="recognition">
                      <summary>
                        <Award size={20} /> Team recognition · 2026{" "}
                        <Plus size={17} />
                      </summary>
                      <h4>{data.award.title}</h4>
                      <p>{data.award.body}</p>
                      <a href={data.award.url}>Read the team announcement</a>
                    </details>
                  )}
                  {/lead.*consultant|forward.*deployed/i.test(j.title) && (
                    <div className="actions">
                      <a
                        className="button"
                        href="#method"
                        onClick={() => {
                          setStep(0);
                          setPlaying(false);
                        }}
                      >
                        <Layers size={17} /> How I work{" "}
                        <ChevronRight size={17} />
                      </a>
                    </div>
                  )}
                  {i === 1 && (
                    <div className="cohort-links">
                      <span>Explore accelerator cohorts</span>
                      {["2024", "2025", "2026"].map((y, k) => (
                        <button key={y} onClick={() => openPane(y)}>
                          {y}
                          <small>{[11, 9, 10][k]} startups</small>
                          <Plus size={16} />
                        </button>
                      ))}
                    </div>
                  )}
                  {i === 3 && (
                    <div className="cohort-links">
                      <span>Selected client work</span>
                      {[
                        ["npd", "NPD ReceiptPal"],
                        ["lux", "Luxottica"],
                        ["ei", "Enterprise Ireland"],
                      ].map(([id, t]) => (
                        <button key={id} onClick={() => openPane(id)}>
                          {t}
                          <Plus size={16} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </section>
        <section id="method" className="tinted">
          <div className="section container">
            <Heading
              number="04 / HOW I WORK"
              title="From discovery to readiness."
            >
              My approach across discovery, architecture, engineering, testing
              and deployment.
            </Heading>
            <div
              className="step-tabs"
              role="group"
              aria-label="Delivery stages"
            >
              {data.steps.map((s, i) => (
                <React.Fragment key={s.title}>
                  <motion.button
                    aria-pressed={step === i}
                    onClick={() => {
                      setStep(i);
                      setPlaying(false);
                    }}
                    key={s.title}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </motion.button>
                  {i < data.steps.length - 1 && (
                    <div className="step-arrow" aria-hidden="true">
                      <ChevronRight size={20} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="method-panel" aria-live="polite">
              <div className="step-counter">
                <span className="step-number">
                  {String(step + 1).padStart(2, "0")}
                </span>
                <span className="step-divider">/</span>
                <span className="step-total">{data.steps.length}</span>
              </div>
              <div>
                <p className="eyebrow">{current.subtitle}</p>
                <h3>{current.title}</h3>
                <p>{current.body}</p>
              </div>
              <div>
                <h4>Parameters assessed</h4>
                <Tags items={current.parameters} />
                <h4>Outcome</h4>
                <p>{current.outcome}</p>
              </div>
            </div>
            <div className="method-controls">
              <button
                className="button"
                disabled={step === 0}
                onClick={() => {
                  setStep(step - 1);
                  setPlaying(false);
                }}
              >
                <ChevronLeft size={17} /> Previous
              </button>
              <button
                className="button primary"
                onClick={() => {
                  if (step === data.steps.length - 1) setStep(0);
                  setPlaying(!playing);
                }}
              >
                {playing ? <Pause size={17} /> : <Play size={17} />}{" "}
                {playing ? "Pause" : "Play flow"}
              </button>
              <button
                className="button"
                disabled={step === data.steps.length - 1}
                onClick={() => {
                  setStep(step + 1);
                  setPlaying(false);
                }}
              >
                Next <ChevronRight size={17} />
              </button>
              <span>
                {step + 1} / {data.steps.length}
              </span>
            </div>
          </div>
        </section>
        <section className="section container background-grid">
          <div>
            <p className="eyebrow">EDUCATION</p>
            <h3>MSc Software Design with AI</h3>
            <p>Technological University of the Shannon · 2020–2021</p>
            <h3>B.Tech Information Technology</h3>
            <p>Anna University · 2011–2015</p>
          </div>
          <div>
            <p className="eyebrow">RESEARCH & RECOGNITION</p>
            <h3>Human–robot collaboration</h3>
            <p>
              “EHRCoI4: A Novel Framework for Enhancing Human-Robot
              Collaboration in Industry 4.0,” IEEE eSmarTA 2023.
            </p>
            <h3>OpenCV Spatial AI Contest</h3>
            <p>Top 50 worldwide finalist · 2021</p>
            <p>
              Virtual machine scheduling and allocation in cloud computing, Anna
              University 2015; meritorious paper award.
            </p>
            <h3>Medium Publications</h3>
            <p>Graph Neural Networks: Unlocking the Power of Graph Data</p>
            <a className="button" href="https://medium.com/@krroopeshbharatwaj1/graph-neural-networks-unlocking-the-power-of-graph-data-9e160f921045" target="_blank" rel="noopener noreferrer">
              <FileText size={17} /> Read on Medium <ChevronRight size={17} />
            </a>
            <h3>Substack Articles</h3>
            <p>Graph convolutional network articles on the CeADAR Lighthouse Project Substack.</p>
            <a className="button" href="https://lhpceadar.substack.com/t/gcn" target="_blank" rel="noopener noreferrer">
              <FileText size={17} /> Explore Substack <ChevronRight size={17} />
            </a>
          </div>
        </section>
        <section id="contact" className="container contact">
          <p className="eyebrow">05 / CONNECT</p>
          <h2>
            Let’s build something
            <br />
            <em>that works.</em>
          </h2>
          <p>AI architecture, engineering and technical leadership.</p>
          <div className="actions">
            <a
              className="button primary"
              href="mailto:krroopeshbharatwaj1@gmail.com"
            >
              <Mail size={18} /> Email me
            </a>
            <a
              className="button"
              href="https://www.linkedin.com/in/roopesh-bharatwaj-kr/"
            >
              <Linkedin size={18} /> LinkedIn
            </a>
            <a
              className="button"
              href="https://github.com/Roopesh-Bharatwaj-K-R"
            >
              <Github size={18} /> GitHub
            </a>
          </div>
        </section>
      </main>
      <footer className="container">
        <span>© {new Date().getFullYear()} Roopesh Bharatwaj KR</span>
        <span>Architecture. Engineering. Applied AI.</span>
      </footer>
      <dialog
        ref={dialog}
        onCancel={close}
        onClose={() => setPanel(null)}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        className="case-dialog"
      >
        {panel && (
          <>
            <div className="dialog-header">
              <p className="eyebrow">
                {panel.kind === "project"
                  ? panel.item.category
                  : "SELECTED EXPERIENCE"}
              </p>
              <button
                className="icon-button"
                onClick={close}
                aria-label="Close case study"
              >
                <X />
              </button>
            </div>
            <div className="dialog-content">
              <h2>
                {panel.kind === "project"
                  ? panel.item.title
                  : panel.item.title || {
                      2024: "Accelerator cohort · 2024",
                      2025: "Accelerator cohort · 2025",
                      2026: "Accelerator cohort · 2026",
                      npd: "NPD ReceiptPal",
                      lux: "Luxottica",
                      ei: "Enterprise Ireland",
                    }[panel.item.id]}
              </h2>
              <p className="dialog-intro">
                {panel.item.summary || panel.item.intro}
              </p>
              {panel.kind === "experience" ? (
                <ul>{panel.item.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
              ) : panel.kind === "project" ? (
                <>
                  <Tags items={panel.item.tags} />
                  {panel.item.sections.map((s) => (
                    <section className="case-section" key={s.title}>
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                    </section>
                  ))}
                </>
              ) : (
                <div className="client-grid">
                  {panel.item.cards.map((c) => (
                    <article key={c.title}>
                      <h3>{c.title}</h3>
                      {c.sector && <p className="eyebrow">{c.sector}</p>}
                      <p>{c.summary}</p>
                      {c.tags.length > 0 && <Tags items={c.tags} />}
                      {c.url && (
                        <a href={c.url} target="_blank" rel="noreferrer">
                          Visit website
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
