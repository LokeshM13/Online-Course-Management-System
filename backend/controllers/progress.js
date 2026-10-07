import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Progress from "../models/Progress.js";

export async function getProgress(req, res, next) {
  try {
    const enrollment = await Enrollment.findOne({ student: req.user.id, course: req.params.courseId, status: { $ne: "cancelled" } });
    if (!enrollment) return res.status(403).json({ message: "Enroll in this course to view your progress." });
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found." });
    const progress = await Progress.findOne({ student: req.user.id, course: course.id });
    res.json({ progress: progress ?? { completedLessons: [], percentage: 0 }, lessons: course.lessons });
  } catch (error) {
    next(error);
  }
}

export async function updateProgress(req, res, next) {
  try {
    const { lessonId, completed } = req.body;
    if (!lessonId || typeof completed !== "boolean") {
      return res.status(400).json({ message: "lessonId and a boolean completed value are required." });
    }
    const [enrollment, course] = await Promise.all([
      Enrollment.findOne({ student: req.user.id, course: req.params.courseId, status: { $ne: "cancelled" } }),
      Course.findById(req.params.courseId)
    ]);
    if (!course) return res.status(404).json({ message: "Course not found." });
    if (!enrollment) return res.status(403).json({ message: "Enroll in this course to update progress." });
    if (!course.lessons.id(lessonId)) return res.status(404).json({ message: "Lesson not found in this course." });

    const progress = await Progress.findOneAndUpdate(
      { student: req.user.id, course: course.id },
      { $setOnInsert: { student: req.user.id, course: course.id } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const completedIds = new Set(progress.completedLessons.map(String));
    if (completed) completedIds.add(String(lessonId));
    else completedIds.delete(String(lessonId));
    progress.completedLessons = [...completedIds];
    progress.percentage = course.lessons.length ? Math.round((completedIds.size / course.lessons.length) * 100) : 0;
    await progress.save();
    enrollment.status = progress.percentage === 100 && course.lessons.length ? "completed" : "active";
    await enrollment.save();
    res.json({ progress });
  } catch (error) {
    next(error);
  }
}
