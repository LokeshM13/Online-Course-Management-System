import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CourseCard from "../components/CourseCard";
import api, { errorMessage } from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      api.get("/courses", { params: { search: search || undefined, category: category || undefined, level: level || undefined } })
        .then(({ data }) => { setCourses(data.courses); setError(""); })
        .catch((e) => setError(errorMessage(e)));
    }, 200);
    return () => clearTimeout(timer);
  }, [search, category, level]);
  const categories = useMemo(() => [...new Set(courses.map((course) => course.category))].sort(), [courses]);
  return (
    <section className="catalog-page">
      <div className="catalog-banner"><div className="eyebrow"><span className="eyebrow-line" /> A WORLD OF POSSIBILITY</div><h1>Find something<br /><span>worth learning.</span></h1><p>Follow a spark of curiosity. Find a new skill. See where it takes you.</p><div className="catalog-stamp">EXPLORE<br />AT YOUR<br />OWN PACE <span>↘</span></div></div>
      <div className="catalog-content">
        <div className="catalog-tools"><label className="search-field"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="What would you like to learn?" aria-label="Search courses" /></label><div className="filter-controls"><SlidersHorizontal size={17} /><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category"><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><select value={level} onChange={(event) => setLevel(event.target.value)} aria-label="Filter by level"><option value="">All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div></div>
        {error && <div className="notice error">{error}</div>}
        {courses.length ? <div className="course-grid">{courses.map((course, index) => <CourseCard key={course._id} course={course} index={index} />)}</div> : !error && <div className="empty-state"><span>⌕</span><h3>No courses found just yet.</h3><p>Try another search or clear one of your filters.</p></div>}
      </div>
    </section>
  );
}
