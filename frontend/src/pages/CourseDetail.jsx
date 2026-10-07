import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, GraduationCap, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { errorMessage } from "../services/api";

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api.get(`/courses/${id}`).then(({ data }) => setCourse(data.course)).catch((e) => setError(errorMessage(e)));
    if (user?.role === "student") api.get("/enrollments/my").then(({ data }) => setEnrolled(data.enrollments.some((entry) => entry.course._id === id && entry.status !== "cancelled"))).catch(() => {});
  }, [id, user]);
  async function enroll() {
    if (!user) return navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
    setBusy(true); setError("");
    try {
      await api.post("/enrollments", { courseId: id });
      setEnrolled(true);
    } catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  }
  if (!course && !error) return <div className="page-loader">Finding your course…</div>;
  if (!course) return <div className="content-message notice error">{error}</div>;
  return (
    <section className="detail-page">
      <div className={`detail-art ${course.imageUrl ? "" : "lavender"}`}>{course.imageUrl ? <img src={course.imageUrl} alt="" /> : <span>{course.title.slice(0, 1)}</span>}<Link to="/courses" className="back-link"><ArrowLeft size={15} /> All courses</Link><div className="detail-art-label">{course.category}<span>✳</span></div></div>
      <div className="detail-content"><div className="detail-main"><div className="eyebrow"><span className="eyebrow-line" /> {course.level} · {course.category}</div><h1>{course.title}</h1><p className="detail-description">{course.description}</p><div className="detail-instructor"><span className="instructor-avatar large">{course.instructor?.name?.slice(0, 1)}</span><div><span>YOUR INSTRUCTOR</span><strong>{course.instructor?.name}</strong>{course.instructor?.bio && <p>{course.instructor.bio}</p>}</div></div><div className="curriculum-heading"><div><div className="eyebrow">WHAT YOU’LL EXPLORE</div><h2>A little at a time.</h2></div><span><BookOpen size={15} /> {course.lessons?.length || 0} lessons</span></div><div className="lesson-list">{course.lessons?.length ? course.lessons.map((lesson, index) => <article key={lesson._id} className="lesson-row"><span className="lesson-index">{String(index + 1).padStart(2, "0")}</span><div><h3>{lesson.title}</h3>{lesson.description && <p>{lesson.description}</p>}</div><span className="lesson-duration"><Clock3 size={14} /> {lesson.duration} min</span></article>) : <p className="muted">Course lessons will be available soon.</p>}</div></div>
        <aside className="enroll-card"><span className="enroll-icon"><GraduationCap size={23} /></span><span className="eyebrow">YOUR NEXT STEP</span><h2>Make this yours.</h2><p>Take your time, follow your curiosity, and keep track of every small win.</p>{enrolled ? <><div className="enrolled-note"><CheckCircle2 size={18} /> You’re enrolled in this course</div><Link to={`/learn/${id}`} className="button button-primary full-button">Continue learning <ArrowRight size={16} /></Link></> : <button className="button button-primary full-button" onClick={enroll} disabled={busy}>{busy ? "Joining…" : "Enroll for free"} <ArrowRight size={16} /></button>}{error && <div className="inline-error">{error}</div>}<div className="enroll-includes"><span><CheckCircle2 size={15} /> Learn at your own pace</span><span><CheckCircle2 size={15} /> Track your progress</span><span><LockKeyhole size={15} /> Just for you</span></div></aside>
      </div>
    </section>
  );
}
