import { ArrowRight, ArrowUpRight, Check, Sparkles, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import CourseCard from "../components/CourseCard";
import { errorMessage } from "../services/api";

const features = [
  { icon: Target, title: "Learn with direction", copy: "Clear paths and practical lessons help you turn curiosity into real-world skills." },
  { icon: TrendingUp, title: "See your progress", copy: "Keep track of every lesson and pick up exactly where you left off." },
  { icon: Sparkles, title: "Grow at your pace", copy: "Explore thoughtful courses designed to fit your goals and your schedule." }
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/courses").then(({ data }) => setCourses(data.courses.slice(0, 3))).catch((e) => setError(errorMessage(e)));
  }, []);
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> A little progress, every day</div>
            <h1>Make room for<br />your <span>next big thing.</span></h1>
            <p>Curious about what you could do next? Find practical courses, learn from people who know their craft, and make progress that feels like yours.</p>
            <div className="hero-actions"><Link className="button button-primary" to="/courses">Explore courses <ArrowRight size={17} /></Link><Link className="text-link" to="/register">Create your free account <ArrowUpRight size={15} /></Link></div>
            <div className="hero-note"><span className="avatar-stack"><i>A</i><i>M</i><i>J</i></span><span>Small steps add up.<br /><strong>Your next one starts here.</strong></span></div>
          </div>
          <div className="hero-visual" aria-label="A learner's course progress">
            <div className="hero-sun" />
            <div className="hero-outline" />
            <div className="hero-card card-progress"><div className="progress-card-top"><span className="mini-icon"><Sparkles size={16} /></span><span>YOUR LEARNING</span><span className="live-dot" /></div><div className="hero-card-title">A good place<br />to begin.</div><div className="progress-track"><span /></div><div className="progress-card-foot"><span>3 of 8 lessons</span><strong>38%</strong></div></div>
            <div className="hero-card card-streak"><div className="streak-icon">✳</div><div><strong>One lesson</strong><small>is a lovely start</small></div><Check size={17} /></div>
            <span className="hero-scribble">learn a little.<br />grow a lot. <span>↗</span></span>
          </div>
        </div>
        <div className="hero-bottom"><span>LEARN SOMETHING THAT MOVES YOU</span><span>01 — BEGIN ANYWHERE</span></div>
      </section>
      <section className="section-wrap">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> FIND YOUR STARTING POINT</div><h2>Good things to learn.</h2></div><Link className="text-link" to="/courses">All courses <ArrowRight size={15} /></Link></div>
        {error && <div className="notice error">{error}</div>}
        {courses.length > 0 ? <div className="course-grid">{courses.map((course, index) => <CourseCard key={course._id} course={course} index={index} />)}</div> : !error && <div className="empty-state"><span>✳</span><h3>Your next favorite course is on its way.</h3><p>Check back soon to find something new to learn.</p></div>}
      </section>
      <section className="why-section"><div className="why-head"><div className="eyebrow"><span className="eyebrow-line" /> LEARNING, MADE HUMAN</div><h2>Not just more information.<br /><span>A little more possibility.</span></h2></div><div className="feature-grid">{features.map(({ icon: Icon, title, copy }, i) => <article className="feature" key={title}><span className={`feature-icon feature-${i}`}><Icon size={20} /></span><span className="feature-number">0{i + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
      <section className="closing-cta"><div className="cta-spark">✳</div><div><div className="eyebrow">YOUR NEXT CHAPTER CAN START SMALL</div><h2>Ready when you are.</h2></div><Link className="button button-light" to="/courses">Find your course <ArrowRight size={16} /></Link></section>
    </>
  );
}
