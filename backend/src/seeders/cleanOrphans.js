// Elimina el progreso y los intentos de quiz que apuntan a cursos, temas o quizzes que ya no existen.
// Uso:  npm run clean-orphans            -> solo muestra cuántos hay (no borra nada)
//       npm run clean-orphans -- --apply -> los borra
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Course from "../models/Course.js";
import Topic from "../models/Topic.js";
import Quiz from "../models/Quiz.js";
import Progress from "../models/Progress.js";
import QuizAttempt from "../models/QuizAttempt.js";

const apply = process.argv.includes("--apply");

const run = async () => {
  await connectDB();
  const [courseIds, topicIds, quizIds] = await Promise.all([
    Course.distinct("_id"),
    Topic.distinct("_id"),
    Quiz.distinct("_id"),
  ]);

  const progressFilter = { $or: [{ course: { $nin: courseIds } }, { topic: { $nin: topicIds } }] };
  const attemptFilter = { quiz: { $nin: quizIds } };

  const [p, a] = await Promise.all([
    Progress.countDocuments(progressFilter),
    QuizAttempt.countDocuments(attemptFilter),
  ]);
  console.log(`Registros de progreso huérfanos: ${p}`);
  console.log(`Intentos de quiz huérfanos: ${a}`);

  if (!apply) {
    console.log("\nNo se borró nada. Para borrarlos: npm run clean-orphans -- --apply");
  } else {
    await Progress.deleteMany(progressFilter);
    await QuizAttempt.deleteMany(attemptFilter);
    console.log("\nListo: registros huérfanos eliminados. Las cuentas de usuario no se tocaron.");
  }
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
