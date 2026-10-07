import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Progress from "../models/Progress.js";

export async function listCourses(req, res, next) {
  try {
    const { search, category, level } = req.query;
    const filter = {};
    const searchTerms = search?.trim().split(/\s+/).filter(Boolean) || [];
    if (searchTerms.length) {
      filter.$or = searchTerms.map((term) => {
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return { title: { $regex: escapedTerm, $options: "i" } };
      });
    }
    if (category) filter.category = category;
    if (level) filter.level = level;
    const courses = await Course.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ courses });
  } catch (error) {
    next(error);
  }
}

export async function getCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.id).populate("createdBy", "name");
    if (!course) return res.status(404).json({ message: "Course not found." });
    res.json({ course });
  } catch (error) {
    next(error);
  }
}

export async function createCourse(req, res, next) {
  try {
    const course = await Course.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ course });
  } catch (error) {
    next(error);
  }
}

export async function updateCourse(req, res, next) {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found." });
    res.json({ course });
  } catch (error) {
    next(error);
  }
}

export async function deleteCourse(req, res, next) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found." });
    await Promise.all([
      Enrollment.deleteMany({ course: course.id }),
      Progress.deleteMany({ course: course.id })
    ]);
    res.json({ message: "Course and its enrollment records were deleted." });
  } catch (error) {
    next(error);
  }
}
