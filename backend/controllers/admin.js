import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Progress from "../models/Progress.js";
import User from "../models/User.js";

export async function dashboard(req, res, next) {
  try {
    const [users, courses, enrollments, completed, recentEnrollments] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: "completed" }),
      Enrollment.find().sort({ createdAt: -1 }).limit(8).populate("student", "name email").populate("course", "title").lean()
    ]);
    const progress = await Progress.aggregate([{ $group: { _id: null, average: { $avg: "$percentage" } } }]);
    res.json({ stats: { users, courses, enrollments, completed, averageProgress: Math.round(progress[0]?.average ?? 0) }, recentEnrollments });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(_req, res, next) {
  try {
    const users = await User.find({ role: "student" }).select("name email createdAt").sort({ createdAt: -1 }).limit(200);
    res.json({ users });
  } catch (error) {
    next(error);
  }
}

export async function listEnrollments(_req, res, next) {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 }).limit(200)
      .populate("student", "name email").populate("course", "title");
    res.json({ enrollments });
  } catch (error) {
    next(error);
  }
}
