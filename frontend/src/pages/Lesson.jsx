import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errorMessage } from "../services/api";

export default function Lesson() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState({ completedLessons: [], percentage: 0 });
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([api.get(`/courses/${id}`), api.get(`/progress/${id}`)])
      .then(([courseResponse, progressResponse]) => { setCourse(courseResponse.data.course); setProgress(progressResponse.data.progress); })
      .catch((e) => setError(errorMessage(e)));
  }, [id]);
  async function toggle(lesson) {
    const complete = !progress.completedLessons.some((item) => item.toString() === lesson._id);
    try {
      const { data } = await api.put(`/progress/${id}`, { lessonId: lesson._id, completed: complete });
      setProgress(data.progress);
      setError("");
    } catch (e) { setError(errorMessage(e)); }
  }
  if (error && !course) return <div className="content-message notice error">{error} <Link to="/dashboard">Go to my courses</Link></div>;
  if (!course) return <div className="page-loader">Loading your lessons…</div>;
  const current = course.lessons.find((lesson) => !progress.completedLessons.some((item) => item.toString() === lesson._id));
  return <section className="lesson-page"><Link to="/dashboard" className="back-link dark"><ArrowLeft size={15} /> My courses</Link><div className="lesson-layout"><aside className="lesson-sidebar"><span className="course-category">{course.category} · {course.level}</span><h1>{course.title}</h1><div className="lesson-progress-title"><span>Your progress</span><strong>{progress.percentage}%</strong></div><div className="progress-track"><span style={{ width: `${progress.percentage}%` }} /></div><div className="lesson-sidebar-list">{course.lessons.map((lesson, index) => { const done = progress.completedLessons.some((item) => item.toString() === lesson._id); return <button className={`sidebar-lesson ${current?._id === lesson._id ? "selected" : ""}`} key={lesson._id} onClick={() => document.getElementById(`lesson-${lesson._id}`)?.scrollIntoView({ behavior: "smooth" })}><span>{done ? <CheckCircle2 size={17} /> : <Circle size={17} />}</span><span>{String(index + 1).padStart(2, "0")} · {lesson.title}</span></button>; })}</div></aside><div className="lesson-main"><div className="eyebrow">ONE LESSON AT A TIME</div><h2>{current ? "You’re right where you need to be." : "Look at how far you’ve come."}</h2>{error && <div className="notice error">{error}</div>}{course.lessons.length ? course.lessons.map((lesson, index) => { const done = progress.completedLessons.some((item) => item.toString() === lesson._id); return <article className={`lesson-content-card ${current?._id === lesson._id ? "current" : ""}`} id={`lesson-${lesson._id}`} key={lesson._id}><div className="lesson-content-top"><span>LESSON {String(index + 1).padStart(2, "0")}</span><span><Clock3 size={14} /> {lesson.duration} min</span></div><h3>{lesson.title}</h3><p>{lesson.description || "Take this lesson at your own pace. When you’re ready, mark it complete and move on to the next one."}</p><button className={done ? "button button-completed" : "button button-primary"} onClick={() => toggle(lesson)}>{done ? <><CheckCircle2 size={16} /> Completed — undo</> : <>Mark as complete <ArrowRight size={16} /></>}</button></article>; }) : <div className="empty-state"><h3>Lessons are on their way.</h3></div>}</div></div></section>;
}
