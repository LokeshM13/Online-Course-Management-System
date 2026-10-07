import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Progress from "../models/Progress.js";

export async function enroll(req, res, next) {
  try {
    const course = await Course.findById(req.body.courseId);
    if (!course) return res.status(404).json({ message: "Course not found." });
    const existing = await Enrollment.findOne({ student: req.user.id, course: course.id });
    if (existing) {
      if (existing.status === "cancelled") {
        existing.status = "active";
        await existing.save();
        return res.status(200).json({ enrollment: existing });
      }
      return res.status(409).json({ message: "You are already enrolled in this course." });
    }
    const enrollment = await Enrollment.create({ student: req.user.id, course: course.id });
    res.status(201).json({ enrollment });
  } catch (error) {
    next(error);
  }
}

export async function myEnrollments(req, res, next) {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate("course")
      .sort({ createdAt: -1 }).lean();
    const progress = await Progress.find({ student: req.user.id }).lean();
    const byCourse = new Map(progress.map((item) => [item.course.toString(), item]));
    res.json({
      enrollments: enrollments.map((enrollment) => ({
        ...enrollment,
        progress: byCourse.get(enrollment.course._id.toString()) ?? { percentage: 0, completedLessons: [] }
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function getEnrollment(req, res, next) {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== "admin") filter.student = req.user.id;
    const enrollment = await Enrollment.findOne(filter).populate("student", "name email").populate("course");
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found." });
    res.json({ enrollment });
  } catch (error) {
    next(error);
  }
}
