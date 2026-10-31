
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  BrainCircuit,
  ChartNoAxesCombined,
  ShieldCheck,
  Sparkles,
  Target,
  GraduationCap,
  Users,
  Building2,
  Clock3,
  BookOpen,
  HeartPulse,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";
import Nav from "../components/Nav.jsx";
import "./Landing.css";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-powered learning",
    description:
      "Understand what you know, identify what you don't, and get a learning experience that adapts to you.",
  },
  {
    icon: Target,
    title: "Learn with direction",
    description:
      "Focus on your weak areas instead of spending hours revising what you already understand.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Track your growth",
    description:
      "See your learning progress, recognize patterns, and make better decisions about your study routine.",
  },
  {
    icon: HeartPulse,
    title: "Digital wellbeing",
    description:
      "Build healthier study habits with tools designed to support focus, balance, and consistency.",
  },
];

const audiences = [
  {
    icon: GraduationCap,
    title: "For Students",
    description:
      "Take control of your learning journey. Discover weak topics, revise smarter, and build consistent study habits.",
    points: ["Personal learning insights", "Smart revision", "Focus tracking"],
  },
  {
    icon: BookOpen,
    title: "For Teachers",
    description:
      "Understand your students better. Identify shared misconceptions and make classroom learning more effective.",
    points: ["Class insights", "Topic-level analysis", "Student progress"],
  },
  {
    icon: Building2,
    title: "For Coaching Institutes",
    description:
      "Bring your learning ecosystem together with meaningful insights into batches, teachers, and student progress.",
    points: ["Batch management", "Faculty overview", "Institution insights"],
  },
];

const steps = [
  {
    number: "01",
    title: "Create your space",
    description:
      "Join KYROS as a student, teacher, or coaching institute.",
  },
  {
    number: "02",
    title: "Understand your learning",
    description:
      "Explore your learning patterns and discover where you need support.",
  },
  {
    number: "03",
    title: "Grow consistently",
    description:
      "Use meaningful insights and focused tools to improve every day.",
  },
];

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function HeroPreview() {
  return (
    <motion.div
      className="kyros-preview-wrap"
      initial={{ opacity: 0, x: 35 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.2 }}
    >
      <motion.div
        className="kyros-mascot"
        animate={{ y: [0, -9, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <BrainCircuit size={43} strokeWidth={1.8} />
        <span className="mascot-spark">✦</span>
      </motion.div>

      <div className="preview-window">
        <div className="preview-top">
          <span className="preview-dot" />
          <span className="preview-dot" />
          <span className="preview-dot" />
          <span className="preview-label">KYROS Learning Space</span>
        </div>

        <div className="preview-content">
          <div className="preview-heading">
            <span className="preview-eyebrow">YOUR LEARNING INSIGHT</span>
            <h3>Let's find what you don't know.</h3>
            <p>
              A little more understanding can make a big difference.
            </p>
          </div>

          <div className="question-card">
            <div className="question-label">
              <Sparkles size={15} />
              Learning check
            </div>
            <h4>Which concept would you like to understand better?</h4>

            <div className="question-option">
              <span>A</span> Concepts I find difficult
            </div>
            <div className="question-option">
              <span>B</span> Topics I need to revise
            </div>
            <div className="question-option">
              <span>C</span> Something completely new
            </div>

            <div className="question-footer">
              <span>Personalized learning starts here</span>
              <ArrowRight size={17} />
            </div>
          </div>

          <div className="preview-bottom">
            <div>
              <span className="preview-mini-icon"><Target size={17} /></span>
              <span>Focused learning</span>
            </div>
            <div>
              <span className="preview-mini-icon"><ShieldCheck size={17} /></span>
              <span>Healthy habits</span>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="floating-note"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <span className="floating-note-icon">
          <Sparkles size={17} />
        </span>
        <div>
          <strong>Learn smarter</strong>
          <span>One step at a time</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="kyros-landing">
      <Nav />

      <main>
        {/* HERO */}
        <section className="kyros-hero section-container">
          <div className="hero-copy">
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Sparkles size={15} />
              <span>A smarter way to learn and grow</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Learn what you
              <br />
              actually <span>don't know.</span>
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              Learning isn't about studying more. It's about understanding
              yourself better. KYROS helps you discover knowledge gaps,
              improve focus, and make every learning session count.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              <Link to="/auth" className="kyros-primary-btn">
                Get started <ArrowRight size={18} />
              </Link>

              <a href="#features" className="kyros-secondary-btn">
                Explore KYROS
              </a>
            </motion.div>

            <div className="hero-trust">
              <div className="trust-symbols">
                <span><Brain size={15} /></span>
                <span><Target size={15} /></span>
                <span><HeartPulse size={15} /></span>
              </div>
              <p>Learning, focus and wellbeing in one space.</p>
            </div>
          </div>

          <HeroPreview />
        </section>

        {/* INTRO STRIP */}
        <section className="kyros-intro-strip">
          <div className="section-container intro-inner">
            <span>LEARN WITH PURPOSE</span>
            <div />
            <span>UNDERSTAND YOURSELF</span>
            <div />
            <span>GROW EVERY DAY</span>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="kyros-section section-container">
          <Reveal className="section-heading">
            <span className="section-eyebrow">WHAT MAKES KYROS DIFFERENT</span>
            <h2>
              Not just another learning platform.
              <br />
              <span>A better way to understand.</span>
            </h2>
            <p>
              Everything you need to make learning more intentional,
              meaningful, and balanced.
            </p>
          </Reveal>

          <div className="feature-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Reveal key={feature.title} delay={index * 0.1}>
                  <article className="feature-card">
                    <div className="feature-icon">
                      <Icon size={24} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <span className="feature-number">
                      0{index + 1}
                    </span>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* AUDIENCE */}
        <section id="solutions" className="kyros-audience-section">
          <div className="section-container">
            <Reveal className="section-heading">
              <span className="section-eyebrow">BUILT FOR EVERY LEARNER</span>
              <h2>
                One ecosystem.
                <br />
                <span>Three ways to grow.</span>
              </h2>
              <p>
                Whether you're learning, teaching, or managing an institute,
                KYROS brings meaningful learning insights closer to you.
              </p>
            </Reveal>

            <div className="audience-grid">
              {audiences.map((audience, index) => {
                const Icon = audience.icon;

                return (
                  <Reveal key={audience.title} delay={index * 0.12}>
                    <article className="audience-card">
                      <div className="audience-icon">
                        <Icon size={27} />
                      </div>
                      <h3>{audience.title}</h3>
                      <p>{audience.description}</p>

                      <ul>
                        {audience.points.map((point) => (
                          <li key={point}>
                            <CheckCircle2 size={16} />
                            {point}
                          </li>
                        ))}
                      </ul>

                      <Link to="/auth" className="audience-link">
                        Get started <ArrowRight size={17} />
                      </Link>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="kyros-section section-container">
          <Reveal className="section-heading">
            <span className="section-eyebrow">SIMPLE BY DESIGN</span>
            <h2>
              Your growth starts
              <br />
              <span>with one small step.</span>
            </h2>
          </Reveal>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.12}>
                <article className="step-card">
                  <span className="step-number">{step.number}</span>
                  <div className="step-line" />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* WELLBEING */}
        <section className="kyros-wellbeing">
          <div className="section-container wellbeing-inner">
            <Reveal className="wellbeing-copy">
              <span className="section-eyebrow">BEYOND ACADEMICS</span>
              <h2>
                Your wellbeing
                <br />
                matters as much
                <br />
                as your progress.
              </h2>
              <p>
                Meaningful learning needs more than information. It needs
                attention, consistency, and balance. KYROS brings digital
                wellbeing into your learning journey.
              </p>
              <Link to="/auth" className="kyros-light-btn">
                Discover KYROS <ArrowRight size={18} />
              </Link>
            </Reveal>

            <Reveal className="wellbeing-visual">
              <div className="wellbeing-orbit orbit-one" />
              <div className="wellbeing-orbit orbit-two" />
              <div className="wellbeing-center">
                <HeartPulse size={55} />
                <span>Learn in balance</span>
              </div>
              <div className="wellbeing-tag tag-one">
                <Clock3 size={17} /> Focus
              </div>
              <div className="wellbeing-tag tag-two">
                <Brain size={17} /> Mindful learning
              </div>
              <div className="wellbeing-tag tag-three">
                <Target size={17} /> Consistency
              </div>
            </Reveal>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="kyros-final-cta section-container">
          <Reveal className="final-cta-card">
            <div className="final-spark spark-one">✦</div>
            <div className="final-spark spark-two">✧</div>

            <span className="section-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
            <h2>
              Stop guessing.
              <br />
              Start understanding.
            </h2>
            <p>
              Build a better relationship with learning, one step at a time.
            </p>
            <Link to="/auth" className="kyros-primary-btn">
              Join KYROS <ArrowRight size={18} />
            </Link>
          </Reveal>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="kyros-footer">
        <div className="section-container footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <span>K</span> KYROS
            </div>
            <p>
              Learn with purpose. Grow with understanding.
            </p>
          </div>

          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#solutions">Solutions</a>
            <a href="#how-it-works">How it works</a>
            <Link to="/extension">Extension</Link>
            <Link to="/auth">Sign in</Link>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} KYROS. All rights reserved.</span>
            <span>Learning with purpose.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
