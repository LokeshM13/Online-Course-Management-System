import { ArrowUpRight, Clock3, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const palettes = ["lavender", "peach", "mint", "blue"];

export default function CourseCard({ course, index = 0 }) {
  return (
    <article className="course-card">
      <Link className={`course-art ${palettes[index % palettes.length]}`} to={`/courses/${course._id}`}>
        {course.imageUrl ? <img src={course.imageUrl} alt="" /> : <span className="art-mark">{course.title.slice(0, 1)}</span>}
        <span className="art-tag">{course.level}</span>
        <span className="art-arrow"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="course-card-body">
        <div className="course-meta"><span>{course.category}</span><span className="meta-dot" /> <span><Clock3 size={13} /> {course.lessons?.length || 0} lessons</span></div>
        <h3><Link to={`/courses/${course._id}`}>{course.title}</Link></h3>
        <p>{course.description}</p>
        <div className="course-card-bottom"><div className="instructor-mini"><span className="instructor-avatar">{course.instructor?.name?.slice(0, 1) || "I"}</span><span>{course.instructor?.name || "Instructor"}</span></div><span className="course-detail-link"><UsersRound size={14} /> Learn more</span></div>
      </div>
    </article>
  );
}
