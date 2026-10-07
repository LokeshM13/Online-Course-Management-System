import dotenv from "dotenv";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";

dotenv.config();

const courses = [
  {
    title: "Design Foundations: Think in Systems",
    description: "Build a thoughtful design practice, from understanding people’s needs to sketching, testing, and refining useful ideas.",
    category: "Design",
    level: "Beginner",
    instructor: {
      name: "Alex Morgan",
      bio: "Product designer helping early-career creatives turn good questions into thoughtful digital experiences."
    },
    lessons: [
      { title: "Notice the small things", description: "Learn to observe everyday experiences and find the details that shape how something feels.", duration: 12 },
      { title: "Ask better questions", description: "Practice a human-centered approach to understanding the people you design for.", duration: 16 },
      { title: "Sketch your first ideas", description: "Turn what you have learned into a few simple, testable concepts.", duration: 18 },
      { title: "Make room to iterate", description: "Gather feedback and refine your ideas without losing what makes them useful.", duration: 14 }
    ]
  },
  {
    title: "A Gentler Introduction to JavaScript",
    description: "Get comfortable with the building blocks of JavaScript and create a small interactive project, one clear step at a time.",
    category: "Development",
    level: "Beginner",
    instructor: {
      name: "Jordan Lee",
      bio: "Frontend developer and patient teacher who believes that everyone can learn to build for the web."
    },
    lessons: [
      { title: "Your first little program", description: "Meet values, variables, and the console in a welcoming first session.", duration: 15 },
      { title: "Decisions and repetition", description: "Use conditionals and loops to make programs respond and repeat.", duration: 20 },
      { title: "Functions that do a job", description: "Bundle useful steps into small, reusable functions.", duration: 18 },
      { title: "Bring a page to life", description: "Connect JavaScript to a web page with a few helpful interactions.", duration: 22 }
    ]
  },
  {
    title: "Make Sense of Your Money",
    description: "Create a practical personal budget, understand everyday financial choices, and build a money routine you can stick with.",
    category: "Personal Growth",
    level: "Beginner",
    instructor: {
      name: "Sam Rivera",
      bio: "Financial educator making personal finance more approachable, practical, and judgment-free."
    },
    lessons: [
      { title: "Start with where you are", description: "Take a calm, clear look at the money coming in and going out.", duration: 11 },
      { title: "Build a flexible budget", description: "Create a simple spending plan that leaves room for real life.", duration: 17 },
      { title: "Make a savings habit", description: "Choose an achievable goal and set up a routine to support it.", duration: 14 },
      { title: "Keep your plan working", description: "Review your plan and adjust it as your needs change.", duration: 13 }
    ]
  }
];

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const admin = await User.findOne({ role: "admin" }).select("_id");
  if (!admin) {
    throw new Error("No admin account found. Run `npm run seed:admin --prefix backend` first.");
  }

  for (const course of courses) {
    await Course.updateOne(
      { title: course.title },
      { $setOnInsert: { ...course, createdBy: admin._id } },
      { upsert: true, runValidators: true }
    );
  }

  console.log(`Demo catalog ready: ${courses.length} courses.`);
} finally {
  await mongoose.disconnect();
}
