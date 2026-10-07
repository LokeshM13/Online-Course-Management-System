import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { errorMessage } from "../services/api";

const emptyCourse = { title: "", description: "", category: "", level: "Beginner", imageUrl: "", instructor: { name: "", bio: "" }, lessons: [] };

export default function CourseForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyCourse);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (editing) api.get(`/courses/${id}`).then(({ data }) => setForm({ ...emptyCourse, ...data.course, instructor: { ...emptyCourse.instructor, ...data.course.instructor } })).catch((e) => setError(errorMessage(e)));
  }, [id, editing]);
  function updateLesson(index, key, value) {
    const lessons = [...form.lessons]; lessons[index] = { ...lessons[index], [key]: value }; setForm({ ...form, lessons });
  }
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await api[editing ? "put" : "post"](editing ? `/courses/${id}` : "/courses", form);
      navigate("/admin");
    } catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  }
  return <section className="course-form-page"><Link className="back-link dark" to="/admin"><ArrowLeft size={15} /> Admin dashboard</Link><div className="form-heading"><div className="eyebrow">BUILD SOMETHING MEANINGFUL</div><h1>{editing ? "A thoughtful update." : "A new place to begin."}</h1><p>Share a course with learners who are ready for their next step.</p></div>{error && <div className="notice error">{error}</div>}<form className="course-form" onSubmit={submit}><fieldset><legend>Course details</legend><label>Course title<input required maxLength="120" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label><label>Description<textarea required maxLength="3000" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><div className="form-two-col"><label>Category<input required maxLength="60" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Design" /></label><label>Level<select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label></div><label>Cover image URL <span className="optional-label">Optional</span><input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" /></label></fieldset><fieldset><legend>Instructor</legend><label>Instructor name<input required maxLength="80" value={form.instructor.name} onChange={(e) => setForm({ ...form, instructor: { ...form.instructor, name: e.target.value } })} /></label><label>Short bio <span className="optional-label">Optional</span><textarea rows="2" maxLength="500" value={form.instructor.bio} onChange={(e) => setForm({ ...form, instructor: { ...form.instructor, bio: e.target.value } })} /></label></fieldset><fieldset><div className="lesson-form-heading"><legend>Course lessons</legend><button type="button" className="panel-add" onClick={() => setForm({ ...form, lessons: [...form.lessons, { title: "", description: "", duration: 10 }] })}><Plus size={16} /> Add lesson</button></div>{form.lessons.map((lesson, index) => <div className="lesson-form-card" key={lesson._id || index}><div className="form-two-col"><label>Lesson {index + 1} title<input required maxLength="120" value={lesson.title} onChange={(e) => updateLesson(index, "title", e.target.value)} /></label><label>Duration (minutes)<input type="number" required min="1" value={lesson.duration} onChange={(e) => updateLesson(index, "duration", Number(e.target.value))} /></label></div><label>Description <span className="optional-label">Optional</span><textarea rows="2" maxLength="1000" value={lesson.description} onChange={(e) => updateLesson(index, "description", e.target.value)} /></label><button type="button" className="remove-lesson" onClick={() => setForm({ ...form, lessons: form.lessons.filter((_, lessonIndex) => lessonIndex !== index) })}><Trash2 size={14} /> Remove lesson</button></div>)}{!form.lessons.length && <p className="muted">No lessons yet. Add a lesson when you’re ready.</p>}</fieldset><div className="form-actions"><Link className="button button-quiet" to="/admin">Cancel</Link><button className="button button-primary" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Create course"}</button></div></form></section>;
}
